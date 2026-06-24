// Cross-user wall. Reads every player's saved Same Brain visions from the
// platform's session-scoped save list, flattens them, resolves avatar+name,
// and hands back a flat Vision[] the game can both display AND match against.

import { useCallback, useEffect, useState } from 'react';
import {
  callAigramAPI,
  isInAigram,
  type AigramResponse,
} from '@shared/runtime';
import { getGameUuid } from '@shared/runtime/game-id';
import { messagesByTarget, type GuestMessage } from '@shared/social/guestbook';
import { seedVisions } from '../data/seeds';
import type { SameBrainSave, Vision } from '../types';

interface SaveRow {
  user_id: string;
  time: string;
  resource_data: string;
}

interface Profile {
  name?: string;
  head_url?: string;
}

const EMPTY_MSGS: Map<string, GuestMessage[]> = new Map();

export interface UseWall {
  visions: Vision[];
  /** Public notes left on visions, grouped by vision id (best-effort). */
  messagesByTarget: Map<string, GuestMessage[]>;
  loaded: boolean;
  refresh: () => void;
}

export function useWall(): UseWall {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [msgMap, setMsgMap] = useState<Map<string, GuestMessage[]>>(EMPTY_MSGS);
  const [loaded, setLoaded] = useState(false);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce(n => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    const sessionId = getGameUuid();
    if (!isInAigram || !sessionId) {
      setLoaded(true);
      return;
    }
    (async () => {
      try {
        const res = await callAigramAPI<AigramResponse<SaveRow[]>>(
          `/note/aigram/ai/game/get/data/list?session_id=${encodeURIComponent(sessionId)}`,
          'GET',
        );
        const rows = Array.isArray(res?.data) ? res.data : [];
        const flat: Vision[] = [];
        for (const row of rows) {
          if (!row.user_id || !row.resource_data) continue;
          try {
            const save = JSON.parse(row.resource_data) as SameBrainSave;
            for (const v of save.visions || []) {
              if (v && v.imageUrl && Array.isArray(v.vector)) {
                flat.push({ ...v, userId: row.user_id });
              }
            }
          } catch {
            /* skip corrupt row */
          }
        }
        flat.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        // Real strangers first, then curated seed visions (attributed to the real
        // house account) so the wall is never empty and early players have a real
        // twin to match. Seeds carry seed:true so matching can deprioritize them.
        const limited = [...flat.slice(0, 60), ...seedVisions()];

        // Public guestbook notes left on visions (best-effort, same read window).
        const msgs = messagesByTarget(rows);

        // Resolve profiles (avatar + name) for display + tappable chips — for
        // both vision authors AND note authors.
        const idSet = new Set(limited.map(v => v.userId).filter(Boolean) as string[]);
        for (const list of msgs.values()) {
          for (const m of list) if (m.fromUserId) idSet.add(m.fromUserId);
        }
        const ids = Array.from(idSet);
        const profEntries = await Promise.all(
          ids.map(async uid => {
            try {
              const r = await callAigramAPI<AigramResponse<Profile>>(
                `/note/telegram/user/get/info/by/telegram_id?telegram_id=${encodeURIComponent(uid)}`,
                'GET',
              );
              return [uid, r?.data ?? null] as const;
            } catch {
              return [uid, null] as const;
            }
          }),
        );
        const profMap = new Map(profEntries);
        const withProfiles = limited.map(v => {
          const p = v.userId ? profMap.get(v.userId) : null;
          return {
            ...v,
            userName: p?.name,
            userAvatarUrl: p?.head_url,
          };
        });
        // Stamp note authors with their profile too.
        const msgsWithProfiles = new Map<string, GuestMessage[]>();
        for (const [target, list] of msgs) {
          msgsWithProfiles.set(
            target,
            list.map(m => {
              const p = m.fromUserId ? profMap.get(m.fromUserId) : null;
              return { ...m, userName: p?.name, userAvatarUrl: p?.head_url };
            }),
          );
        }
        if (!cancelled) {
          setVisions(withProfiles);
          setMsgMap(msgsWithProfiles);
        }
      } catch {
        if (!cancelled) {
          setVisions([]);
          setMsgMap(EMPTY_MSGS);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return { visions, messagesByTarget: msgMap, loaded, refresh };
}
