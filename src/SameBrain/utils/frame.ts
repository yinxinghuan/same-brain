import type { Vector } from '../types';

// The outer frame of a vision is part of its identity: it's derived
// deterministically from the player's tap choices, so two people who pictured
// the same thing get the SAME frame. On the wall you can literally spot
// like-minded brains by their matching frames — the frame is another axis of
// "same brain", not just decoration.
export const FRAMES = ['polaroid', 'film', 'stamp', 'postcard', 'neon', 'tape'] as const;
export type Frame = (typeof FRAMES)[number];

/** Stable frame for a vector. Identical choices → identical frame. */
export function frameFor(vector: Vector): Frame {
  let h = 2166136261;
  for (const n of vector) {
    h ^= n + 1;
    h = Math.imul(h, 16777619);
  }
  return FRAMES[(h >>> 0) % FRAMES.length];
}
