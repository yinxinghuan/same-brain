// Curated cold-start seed visions. Every seed is attributed to ONE real account
// (the creator's) — a real, tappable Aigram profile, NOT a fabricated user. They
// keep the wall from being empty and give early players a real twin to match,
// and are deprioritized automatically once real strangers fill the wall.
//
// SEED_USER_ID must be the creator's real telegram_id. Until it is set, seeds
// stay INERT (seedVisions() returns []), so this can ship before the id is known.
import type { Vision } from '../types';

export const SEED_USER_ID = '618336286'; // creator's real telegram_id (real, tappable profile)

interface SeedDef {
  promptId: string;
  vector: number[];
  img: string; // relative to BASE_URL (public/)
}

const SEEDS: SeedDef[] = [
  { promptId: 'hideout', vector: [0, 0, 0, 0], img: 'seeds/seed-0.webp' },
  { promptId: 'hideout', vector: [2, 4, 2, 2], img: 'seeds/seed-1.webp' },
  { promptId: 'hideout', vector: [4, 5, 4, 1], img: 'seeds/seed-2.webp' },
  { promptId: 'hideout', vector: [3, 1, 5, 4], img: 'seeds/seed-3.webp' },
  { promptId: 'hideout', vector: [1, 3, 3, 3], img: 'seeds/seed-4.webp' },
  { promptId: 'hideout', vector: [5, 2, 1, 5], img: 'seeds/seed-5.webp' },
  { promptId: 'ride', vector: [0, 3, 0, 0], img: 'seeds/seed-6.webp' },
  { promptId: 'ride', vector: [1, 1, 2, 5], img: 'seeds/seed-7.webp' },
  { promptId: 'ride', vector: [2, 0, 3, 1], img: 'seeds/seed-8.webp' },
  { promptId: 'ride', vector: [3, 2, 4, 3], img: 'seeds/seed-9.webp' },
  { promptId: 'ride', vector: [4, 4, 1, 4], img: 'seeds/seed-10.webp' },
  { promptId: 'ride', vector: [5, 5, 5, 2], img: 'seeds/seed-11.webp' },
  { promptId: 'creature', vector: [0, 0, 3, 0], img: 'seeds/seed-12.webp' },
  { promptId: 'creature', vector: [1, 2, 2, 1], img: 'seeds/seed-13.webp' },
  { promptId: 'creature', vector: [2, 1, 1, 2], img: 'seeds/seed-14.webp' },
  { promptId: 'creature', vector: [3, 4, 0, 4], img: 'seeds/seed-15.webp' },
  { promptId: 'creature', vector: [4, 3, 5, 3], img: 'seeds/seed-16.webp' },
  { promptId: 'creature', vector: [5, 5, 4, 5], img: 'seeds/seed-17.webp' },
];

/** Seed visions as a Vision[], attributed to the real house account. Empty
 *  (inert) until SEED_USER_ID is set. */
export function seedVisions(): Vision[] {
  if (!SEED_USER_ID) return [];
  const base = import.meta.env.BASE_URL;
  return SEEDS.map((s, i) => ({
    id: 'seed-' + i,
    promptId: s.promptId,
    vector: s.vector,
    imageUrl: base + s.img,
    createdAt: 0,
    userId: SEED_USER_ID,
    seed: true,
  }));
}
