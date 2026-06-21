import type { Match, Vector, Vision } from '../types';

/** How many dimensions two vectors agree on exactly. */
export function sharedDims(a: Vector, b: Vector): number {
  let n = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) n++;
  }
  return n;
}

// Sync% bands per number of shared dimensions (out of 4). We always reveal the
// BEST available partner and frame it positively — but never a fake 100, and
// never a flat round number, so it reads as organic rather than computed.
const BANDS: Record<number, [number, number]> = {
  4: [94, 99],
  3: [80, 91],
  2: [66, 78],
  1: [50, 62],
  0: [40, 48],
};

/** Deterministic jitter from two ids so the same pairing always shows the same %. */
function jitter(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000; // 0..1
}

export function syncScore(shared: number, seed: string): number {
  const [lo, hi] = BANDS[shared] ?? BANDS[0];
  return Math.round(lo + jitter(seed) * (hi - lo));
}

/** Pick the closest real stranger's vision for the same prompt. */
export function bestWallMatch(
  mine: Vision,
  wall: Vision[],
  myUserId: string | null,
): Match | null {
  const cands = wall.filter(
    v =>
      v.promptId === mine.promptId &&
      v.imageUrl &&
      v.id !== mine.id &&
      (!myUserId || v.userId !== myUserId),
  );
  if (!cands.length) return null;
  let best: Vision | null = null;
  let bestShared = -1;
  for (const v of cands) {
    const s = sharedDims(mine.vector, v.vector);
    if (s > bestShared) {
      bestShared = s;
      best = v;
    }
  }
  if (!best) return null;
  return {
    partner: best,
    sharedDims: bestShared,
    sync: syncScore(bestShared, mine.id + best.id),
  };
}

/** Make a phantom vector that shares all-but-one dimension with mine (3/4). */
export function phantomVector(mine: Vector, optionCounts: number[]): Vector {
  const vec = [...mine];
  const flip = Math.floor(Math.random() * vec.length);
  const count = optionCounts[flip] ?? 6;
  if (count > 1) {
    let next = Math.floor(Math.random() * count);
    if (next === vec[flip]) next = (next + 1) % count;
    vec[flip] = next;
  }
  return vec;
}
