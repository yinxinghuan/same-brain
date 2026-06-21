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
  /** Set when this vision belongs to a stranger (wall) or a phantom seed. */
  userId?: string;
  userName?: string;
  /** Either an https avatar url or an emoji glyph. */
  userAvatarUrl?: string;
  /** True for cold-start phantom partners (no real notify target). */
  phantom?: boolean;
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
}

export type Phase = 'intro' | 'picking' | 'developing' | 'reveal' | 'wall';
