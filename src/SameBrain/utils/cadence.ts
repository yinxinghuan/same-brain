// The ritual heartbeat. Time is sliced into fixed windows; each window opens a
// NEW theme and grants exactly ONE vision. After you draw, you're sealed until
// the next window — a countdown shows when the next reading unlocks. This is
// what gives each draw weight instead of being an infinite replay.
//
// Windows are global (everyone worldwide shares the same window → same theme),
// so the wall stays coherent per window.

export const WINDOW_HOURS = 3;
const WINDOW_MS = WINDOW_HOURS * 60 * 60 * 1000;

/** Index of the window containing `now` (monotonic, global). */
export function windowIndex(now: number = Date.now()): number {
  return Math.floor(now / WINDOW_MS);
}

/** Epoch ms when the next window opens. */
export function nextWindowStart(now: number = Date.now()): number {
  return (windowIndex(now) + 1) * WINDOW_MS;
}

/** Milliseconds until the next window opens (≥ 0). */
export function msToNextWindow(now: number = Date.now()): number {
  return Math.max(0, nextWindowStart(now) - now);
}

/** "H:MM:SS" countdown string from a millisecond remainder. */
export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${h}:${pad(m)}:${pad(sec)}`;
}
