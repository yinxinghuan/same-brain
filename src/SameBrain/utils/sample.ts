import type { BrainPrompt } from '../data/prompts';

// Each dimension carries a POOL of options but we only show a handful per draw.
// Which subset you see is sampled deterministically from the window — so:
//   • everyone in the same window sees the same palette (the wall stays coherent),
//   • a theme that comes around again in a later window shows a DIFFERENT subset,
// which keeps draws from ever feeling identical. The chosen option is stored by
// its stable POOL index (not its on-screen position), so matching/compose/frame
// stay correct no matter what subset was displayed.
export const DISPLAY_OPTIONS = 6;

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** For each dimension, the pool indices to display this window (≤ DISPLAY_OPTIONS). */
export function sampledIndices(prompt: BrainPrompt, win: number): number[][] {
  return prompt.dims.map(dim => {
    const n = dim.options.length;
    const all = Array.from({ length: n }, (_, i) => i);
    if (n <= DISPLAY_OPTIONS) return all;
    const rnd = mulberry32(hashStr(`${win}|${prompt.id}|${dim.key}`));
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, DISPLAY_OPTIONS);
  });
}
