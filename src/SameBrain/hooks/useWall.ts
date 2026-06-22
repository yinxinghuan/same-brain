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

export interface UseWall {
  visions: Vision[];
  loaded: boolean;
  refresh: () => void;
}

export function useWall(): UseWall {
  const [visions, setVisions] = useState<Vision[]>([]);
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

        // Resolve profiles (avatar + name) for display + tappable chips.
        const ids = Array.from(new Set(limited.map(v => v.userId).filter(Boolean) as string[]));
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
        if (!cancelled) setVisions(withProfiles);
      } catch {
        if (!cancelled) setVisions([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return { visions, loaded, refresh };
}
