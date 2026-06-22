import type { Match, Vector, Vision } from '../types';

/** How many dimensions two vectors agree on exactly. */
export function sharedDims(a: Vector, b: Vector): number {
  let n = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) n++;
  }
  return n;
}

// Sync% band by FRACTION of dimensions shared, so it works for any dim count
// (prompts can have 4, 5, … dims). We always reveal the BEST available partner
// and frame it positively — but never a fake 100, and never a flat round
// number, so it reads as organic rather than computed.
function bandFor(frac: number): [number, number] {
  if (frac >= 0.999) return [94, 99];
  if (frac >= 0.75) return [82, 92];
  if (frac >= 0.6) return [72, 83];
  if (frac >= 0.5) return [64, 76];
  if (frac >= 0.34) return [55, 67];
  if (frac >= 0.2) return [48, 59];
  return [40, 50];
}

/** Deterministic jitter from two ids so the same pairing always shows the same %. */
function jitter(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000; // 0..1
}

export function syncScore(shared: number, total: number, seed: string): number {
  const [lo, hi] = bandFor(total > 0 ? shared / total : 0);
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
    sync: syncScore(bestShared, Math.min(mine.vector.length, best.vector.length), mine.id + best.id),
  };
}

export interface Twin {
  vision: Vision;
  /** 0-4 dims shared with the target. */
  shared: number;
  /** 0-100 sync. */
  sync: number;
}

/** Everyone else on the wall who pictured the same thing — same prompt, vectors
 *  overlapping on `minShared`+ dimensions. One entry per person (their strongest
 *  matching vision), strongest sync first. This is the "twins" of a vision: the
 *  multiple strangers whose brain matched it. */
export function twinsOf(target: Vision, wall: Vision[], minShared = 2): Twin[] {
  const cands = wall
    .filter(
      v =>
        v.id !== target.id &&
        v.promptId === target.promptId &&
        !!v.imageUrl &&
        // a person is not their own twin
        !(target.userId && v.userId && v.userId === target.userId),
    )
    .map(v => {
      const shared = sharedDims(target.vector, v.vector);
      const total = Math.min(target.vector.length, v.vector.length);
      return { vision: v, shared, sync: syncScore(shared, total, target.id + v.id) };
    })
    .filter(t => t.shared >= minShared)
    .sort((a, b) => b.shared - a.shared || b.sync - a.sync);

  const seen = new Set<string>();
  const out: Twin[] = [];
  for (const t of cands) {
    const key = t.vision.userId || t.vision.id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

/** Make a variant vector that shares all-but-one dimension with mine (3/4) —
 *  used for the player's alter-ego twin (the same vision, seen a little
 *  differently). */
export function variantVector(mine: Vector, optionCounts: number[]): Vector {
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
