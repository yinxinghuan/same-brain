import type { BrainPrompt } from '../data/prompts';
import type { Vector } from '../types';
import { loc } from '../i18n';

/** Turn a player's tap choices into the gen-image prompt for their vision. */
export function composePrompt(prompt: BrainPrompt, vector: Vector): string {
  const frags = prompt.dims.map((dim, i) => dim.options[vector[i]]?.frag ?? '');
  return prompt.compose(frags);
}

/** Short localized label of a vector, e.g. "Neon loft · Hot pink · Vinyl · 3am neon". */
export function vectorLabel(prompt: BrainPrompt, vector: Vector): string {
  return prompt.dims
    .map((dim, i) => {
      const opt = dim.options[vector[i]];
      return opt ? loc(opt.labels) : '';
    })
    .filter(Boolean)
    .join(' · ');
}
