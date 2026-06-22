// Same Brain — core types.

/** One chosen option index per dimension (length === prompt.dims.length). */
export type Vector = number[];

export interface Vision {
  /** Unique id for this vision. */
  id: string;
  /** Which daily prompt this answers. */
  promptId: string;
  /** The player's tap choices — the thing matching is computed on. */
  vector: Vector;
  /** gen-image result URL (the beautiful surface). */
  imageUrl: string;
  createdAt: number;
  /** Set when this vision belongs to a real stranger (from the wall). */
  userId?: string;
  userName?: string;
  /** Either an https avatar url or an emoji glyph. */
  userAvatarUrl?: string;
  /** True when the partner is the player's own AI alter ego — the honest
   *  cold-start fallback shown until a real stranger twin exists. Never a
   *  fabricated user: it's the player themselves, so it has no profile to open
   *  and never triggers a notify. */
  alterEgo?: boolean;
  /** True for curated cold-start seed visions attributed to a REAL house
   *  account (real, tappable profile — not a fabricated user). Matched only
   *  when no real stranger is available, and deprioritized as the wall fills. */
  seed?: boolean;
}

export interface Match {
  partner: Vision;
  /** 0-100 sync score. */
  sync: number;
  /** How many of the 4 dimensions matched exactly. */
  sharedDims: number;
}

export interface SameBrainSave {
  /** My own visions, newest first (capped). */
  visions: Vision[];
  plays: number;
  bestSync: number;
  /** Vision ids I've hearted on the Twin visions wall. */
  likes?: string[];
  /** Ritual window index of my most recent draw — gates one draw per window. */
  lastDrawWindow?: number;
}

export type Phase = 'boot' | 'intro' | 'picking' | 'developing' | 'reveal' | 'wall' | 'locked';
