import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  isInAigram,
  telegramId,
  useGameEvent,
  useGenImage,
} from '@shared/runtime';
import { useGameSave } from '@shared/save';
import {
  appendMessage,
  guestbookNotifyConfig,
  newMessage,
} from '@shared/social/guestbook';
import { promptForWindow } from '../data/prompts';
import { msToNextWindow, windowIndex } from '../utils/cadence';
import { sampledIndices } from '../utils/sample';
import { composePrompt } from '../utils/compose';
import {
  bestWallMatch,
  sharedDims,
  syncScore,
  variantVector,
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
  const genImage = useGenImage();
  const event = useGameEvent();
  const wall = useWall();
  const save = useGameSave<SameBrainSave>('same-brain');

  const [phase, setPhase] = useState<Phase>('boot');
  const [dimIndex, setDimIndex] = useState(0);
  const [vector, setVector] = useState<Vector>([]);
  const [myVision, setMyVision] = useState<Vision | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState(false);

  // The ritual clock. `win` is the current window; each window opens a new theme
  // and grants one draw. `now` ticks so the countdown is live and so we can
  // auto-advance to the next theme the instant a window rolls over.
  const [win, setWin] = useState(() => windowIndex());
  const [now, setNow] = useState(() => Date.now());
  const prompt = useMemo(() => promptForWindow(win), [win]);
  const nextPrompt = useMemo(() => promptForWindow(win + 1), [win]);
  // Which option subset this window shows, per dimension (stable through a draw).
  const display = useMemo(() => sampledIndices(prompt, win), [prompt, win]);

  // Local mirror of the cloud save (savedData never echoes writes — see CLAUDE.md).
  const [mirror, setMirror] = useState<SameBrainSave | undefined>(undefined);
  useEffect(() => {
    if (mirror === undefined && save.savedData !== undefined) {
      setMirror(save.savedData ?? EMPTY);
    }
  }, [save.savedData, mirror]);

  // One draw per window: locked if this window's draw is already spent.
  const locked = mirror !== undefined && mirror.lastDrawWindow === win;

  // Boot routing: once the save loads, land on the lock screen or a fresh intro
  // (no intro→lock flash for returning, already-drawn players).
  useEffect(() => {
    if (phase === 'boot' && mirror !== undefined) {
      setPhase(mirror.lastDrawWindow === win ? 'locked' : 'intro');
    }
  }, [phase, mirror, win]);

  // Tick every second while a countdown is on screen; roll the window over when
  // it elapses, which unlocks the next theme automatically.
  useEffect(() => {
    if (phase !== 'locked' && phase !== 'reveal') return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      const w = windowIndex(t);
      if (w !== win) {
        setWin(w);
        setPhase(p => (p === 'locked' ? 'intro' : p));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [phase, win]);

  const msLeft = msToNextWindow(now);

  const notified = useRef<Set<string>>(new Set());
  const likeNotified = useRef<Set<string>>(new Set());
  const msgNotified = useRef<Set<string>>(new Set());
  const wallRef = useRef(wall.visions);
  wallRef.current = wall.visions;

  // Heart a stranger's vision on the wall: persist it locally (fills the heart,
  // survives reloads) and ping the author once — never self, alter ego, or a
  // vision we've already pinged for.
  const likeVision = useCallback(
    (v: Vision) => {
      if (!v.id) return;
      setMirror(prev => {
        const base = prev ?? EMPTY;
        const likes = new Set(base.likes ?? []);
        const wasLiked = likes.has(v.id);
        if (wasLiked) likes.delete(v.id);
        else likes.add(v.id);
        const next: SameBrainSave = { ...base, likes: [...likes] };
        save.persist(next);

        // Notify only when newly hearting a real other player's vision, once.
        if (
          !wasLiked &&
          !v.alterEgo &&
          v.userId &&
          v.userId !== telegramId &&
          !likeNotified.current.has(v.id)
        ) {
          likeNotified.current.add(v.id);
          event.trigger('vision_liked', {
            actions: [
              {
                type: 'notify',
                target_user_id: v.userId,
                image: { ref_url: v.imageUrl, prompt: 'Someone loved the vision you pictured.' },
                message: {
                  template: '{sender_name} loved your vision',
                  variables: ['sender_name'],
                },
              },
            ],
          });
        }
        return next;
      });
    },
    [event, save],
  );

  // Leave a public note on a vision: store it in my OWN blob (the guestbook
  // aggregates everyone's), and ping the vision's author once — never self, an
  // alter ego, or a vision I've already pinged.
  const sendMessage = useCallback(
    (vision: Vision, text: string) => {
      const msg = newMessage(vision.id, vision.userId, text);
      if (!msg) return;
      setMirror(prev => {
        const next = appendMessage(prev ?? EMPTY, msg);
        save.persist(next);
        return next;
      });
      if (
        !vision.alterEgo &&
        vision.userId &&
        vision.userId !== telegramId &&
        !msgNotified.current.has(vision.id)
      ) {
        msgNotified.current.add(vision.id);
        event.trigger(
          'vision_message',
          guestbookNotifyConfig({
            toUserId: vision.userId,
            refUrl: vision.imageUrl,
            template: '{sender_name} left a note on your vision',
            imagePrompt: 'Someone left a note on the vision you pictured.',
          }),
        );
      }
    },
    [event, save],
  );

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

        // Priority: a REAL stranger (any overlap) > a curated seed on the real
        // house account (only if a believable >=2-dim match) > your alter ego.
        const all = wallRef.current;
        let m = bestWallMatch(mine, all.filter(v => !v.seed), telegramId);
        if (!m) {
          const sm = bestWallMatch(mine, all.filter(v => v.seed), telegramId);
          if (sm && sm.sharedDims >= 2) m = sm;
        }

        // No real twin yet → the player's own AI ALTER EGO (this is YOU, never a
        // fabricated user). Works everywhere with no wall and no fake identity; the
        // chip is a self entry, so there's no profile to open and no notify. Real
        // strangers replace it automatically as the wall fills up.
        if (!m) {
          const counts = prompt.dims.map(d => d.options.length);
          const pv = variantVector(vec, counts);
          const purl = await genWithRetry(composePrompt(prompt, pv));
          const partner: Vision = {
            id: 'alterego-' + uid(),
            promptId: prompt.id,
            vector: pv,
            imageUrl: purl,
            createdAt: Date.now(),
            alterEgo: true,
          };
          const sh = sharedDims(vec, pv);
          m = { partner, sharedDims: sh, sync: syncScore(sh, vec.length, mine.id + partner.id) };
        }

        setMatch(m);
        setPhase('reveal');

        // 3) persist my vision (feeds the wall + future matches) and spend this
        //    window's draw — locks until the next window opens.
        setMirror(prev => {
          const base = prev ?? EMPTY;
          const next: SameBrainSave = {
            ...base,
            visions: [mine, ...base.visions].slice(0, 12),
            plays: base.plays + 1,
            bestSync: Math.max(base.bestSync, m!.sync),
            lastDrawWindow: win,
          };
          save.persist(next);
          return next;
        });

        // 4) notify a REAL partner (never the alter ego — that's the player)
        if (
          !m.partner.alterEgo &&
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
    [prompt, event, save, win],
  );

  const start = useCallback(() => {
    if (locked) return; // one draw per window
    setVector([]);
    setDimIndex(0);
    setMyVision(null);
    setMatch(null);
    setError(false);
    setPhase('picking');
  }, [locked]);

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
  // Back out of the wall to wherever you came from: the sealed lock screen, your
  // reveal, or a fresh intro.
  const closeWall = useCallback(
    () => setPhase(locked ? 'locked' : myVision ? 'reveal' : 'intro'),
    [locked, myVision],
  );

  const lastVision = mirror?.visions?.[0] ?? null;

  return {
    prompt,
    nextPrompt,
    display,
    phase,
    dimIndex,
    vector,
    myVision,
    match,
    error,
    stats: mirror ?? EMPTY,
    likedIds: new Set(mirror?.likes ?? []),
    wall,
    // Guestbook: best-effort notes from the wall + my own outgoing notes (so a
    // just-sent note shows instantly, before the cloud write / read window).
    messagesByTarget: wall.messagesByTarget,
    myMessages: mirror?.messages ?? [],
    isInAigram,
    // ritual
    locked,
    msLeft,
    lastVision,
    // actions
    start,
    choose,
    back,
    again,
    openWall,
    closeWall,
    likeVision,
    sendMessage,
    retry: () => runMatch(vector),
  };
}
