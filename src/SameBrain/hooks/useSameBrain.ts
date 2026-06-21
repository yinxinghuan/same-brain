import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  isInAigram,
  telegramId,
  useGameEvent,
  useGenImage,
} from '@shared/runtime';
import { useGameSave } from '@shared/save';
import { todaysPrompt } from '../data/prompts';
import { randomRoster } from '../data/roster';
import { composePrompt } from '../utils/compose';
import {
  bestWallMatch,
  phantomVector,
  sharedDims,
  syncScore,
} from '../utils/match';
import type { Match, Phase, SameBrainSave, Vector, Vision } from '../types';
import { useWall } from './useWall';

const EMPTY: SameBrainSave = { visions: [], plays: 0, bestSync: 0 };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return 'v' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export function useSameBrain() {
  const prompt = useMemo(() => todaysPrompt(), []);
  const genImage = useGenImage();
  const event = useGameEvent();
  const wall = useWall();
  const save = useGameSave<SameBrainSave>('same-brain');

  const [phase, setPhase] = useState<Phase>('intro');
  const [dimIndex, setDimIndex] = useState(0);
  const [vector, setVector] = useState<Vector>([]);
  const [myVision, setMyVision] = useState<Vision | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState(false);

  // Local mirror of the cloud save (savedData never echoes writes — see CLAUDE.md).
  const [mirror, setMirror] = useState<SameBrainSave | undefined>(undefined);
  useEffect(() => {
    if (mirror === undefined && save.savedData !== undefined) {
      setMirror(save.savedData ?? EMPTY);
    }
  }, [save.savedData, mirror]);

  const notified = useRef<Set<string>>(new Set());
  const wallRef = useRef(wall.visions);
  wallRef.current = wall.visions;

  async function genWithRetry(p: string): Promise<string> {
    try {
      return await genImage.generate({ prompt: p });
    } catch {
      await sleep(2500);
      return await genImage.generate({ prompt: p });
    }
  }

  const runMatch = useCallback(
    async (vec: Vector) => {
      setError(false);
      setPhase('developing');
      setMyVision(null);
      setMatch(null);
      try {
        // 1) my vision — the payoff surface
        const myUrl = await genWithRetry(composePrompt(prompt, vec));
        const mine: Vision = {
          id: uid(),
          promptId: prompt.id,
          vector: vec,
          imageUrl: myUrl,
          createdAt: Date.now(),
          userId: telegramId ?? undefined,
        };
        setMyVision(mine);

        // 2) partner — prefer a real stranger who shares >= 2 dims, else conjure one
        let m = bestWallMatch(mine, wallRef.current, telegramId);
        if (!m || m.sharedDims < 2) {
          const counts = prompt.dims.map(d => d.options.length);
          const pv = phantomVector(vec, counts);
          const purl = await genWithRetry(composePrompt(prompt, pv));
          const partner: Vision = {
            id: 'phantom-' + uid(),
            promptId: prompt.id,
            vector: pv,
            imageUrl: purl,
            createdAt: Date.now(),
            userName: randomRoster(),
            phantom: true,
          };
          const sh = sharedDims(vec, pv);
          m = { partner, sharedDims: sh, sync: syncScore(sh, mine.id + partner.id) };
        }
        setMatch(m);
        setPhase('reveal');

        // 3) persist my vision (feeds the wall + future matches)
        setMirror(prev => {
          const base = prev ?? EMPTY;
          const next: SameBrainSave = {
            visions: [mine, ...base.visions].slice(0, 12),
            plays: base.plays + 1,
            bestSync: Math.max(base.bestSync, m!.sync),
          };
          save.persist(next);
          return next;
        });

        // 4) notify a REAL partner that a brain just synced with theirs
        if (
          !m.partner.phantom &&
          m.partner.userId &&
          m.partner.userId !== telegramId &&
          !notified.current.has(m.partner.userId)
        ) {
          notified.current.add(m.partner.userId);
          event.trigger('brain_sync', {
            actions: [
              {
                type: 'notify',
                target_user_id: m.partner.userId,
                image: { ref_url: myUrl, prompt: 'A stranger pictured the same thing you did.' },
                message: {
                  template: '{sender_name} has the same brain as you',
                  variables: ['sender_name'],
                },
              },
            ],
          });
        }
      } catch {
        setError(true);
        setPhase('reveal');
      }
    },
    [prompt, event, save],
  );

  const start = useCallback(() => {
    setVector([]);
    setDimIndex(0);
    setMyVision(null);
    setMatch(null);
    setError(false);
    setPhase('picking');
  }, []);

  const choose = useCallback(
    (optIndex: number) => {
      setVector(prev => {
        const next = [...prev];
        next[dimIndex] = optIndex;
        if (dimIndex >= prompt.dims.length - 1) {
          void runMatch(next);
        } else {
          setDimIndex(dimIndex + 1);
        }
        return next;
      });
    },
    [dimIndex, prompt.dims.length, runMatch],
  );

  const back = useCallback(() => {
    setDimIndex(i => Math.max(0, i - 1));
  }, []);

  const again = useCallback(() => start(), [start]);
  const openWall = useCallback(() => {
    wall.refresh();
    setPhase('wall');
  }, [wall]);
  const closeWall = useCallback(() => setPhase(myVision ? 'reveal' : 'intro'), [myVision]);

  return {
    prompt,
    phase,
    dimIndex,
    vector,
    myVision,
    match,
    error,
    stats: mirror ?? EMPTY,
    wall,
    isInAigram,
    // actions
    start,
    choose,
    back,
    again,
    openWall,
    closeWall,
    retry: () => runMatch(vector),
  };
}
