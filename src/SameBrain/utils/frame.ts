import type { Vector } from '../types';
import { loc, type Loc } from '../i18n';

// The outer frame of a vision is part of its identity. It's keyed off the
// HEADLINE choice (the first dimension — the place / vehicle / creature), so
// everyone who pictured the same subject wears the SAME frame. On the wall you
// can literally spot like-minded brains by their matching frames, and the
// detail view calls it out — the frame is another axis of "same brain", not
// just decoration.
export const FRAMES = ['polaroid', 'film', 'stamp', 'postcard', 'neon', 'tape'] as const;
export type Frame = (typeof FRAMES)[number];

const NAMES: Record<Frame, Loc> = {
  polaroid: { en: 'Polaroid', zh: '拍立得', es: 'Polaroid', pt: 'Polaroid' },
  film: { en: 'Film', zh: '胶片', es: 'Película', pt: 'Filme' },
  stamp: { en: 'Stamp', zh: '邮票', es: 'Sello', pt: 'Selo' },
  postcard: { en: 'Postcard', zh: '明信片', es: 'Postal', pt: 'Postal' },
  neon: { en: 'Neon', zh: '霓虹', es: 'Neón', pt: 'Neon' },
  tape: { en: 'Taped', zh: '胶带', es: 'Cinta', pt: 'Fita' },
};

/** Stable frame for a vector — same headline choice → same frame. */
export function frameFor(vector: Vector): Frame {
  const i = vector.length ? vector[0] : 0;
  return FRAMES[(((i % FRAMES.length) + FRAMES.length) % FRAMES.length)];
}

/** Localized display name of a frame. */
export function frameName(f: Frame): string {
  return loc(NAMES[f]);
}
