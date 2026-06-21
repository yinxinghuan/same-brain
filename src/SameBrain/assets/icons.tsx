// Custom SVG icon set for Same Brain. One unified minimal line style:
// 24×24 grid, currentColor stroke, no fill — so every glyph tints with the
// surrounding text color and stays crisp at tile size. No emoji anywhere.
import type { ReactNode } from 'react';

const ICONS: Record<string, ReactNode> = {
  // ── hideout · place ──────────────────────────────────────
  loft: (<>
    <rect x="3.5" y="9" width="6" height="11.5" rx="1" />
    <rect x="11" y="4" width="9.5" height="16.5" rx="1" />
    <path d="M5 12h3M5 15h3M5 18h3M13.5 7.5h1.5M17.5 7.5h1.5M13.5 11.5h1.5M17.5 11.5h1.5M13.5 15.5h1.5M17.5 15.5h1.5" />
  </>),
  trailer: (<>
    <rect x="3" y="9" width="16" height="7" rx="3.5" />
    <path d="M6 12.5h8M19 12h2" />
    <circle cx="8" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
  </>),
  treehouse: (<>
    <path d="M12 21v-7" />
    <circle cx="12" cy="9" r="6" />
    <path d="M9.5 14.5v-3L12 9.5l2.5 2v3z" />
  </>),
  seadome: (<>
    <path d="M4 13a8 8 0 0 1 16 0" />
    <path d="M12 5v8M4 13h16" />
    <path d="M3 17.5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0" />
  </>),
  cabin: (<>
    <path d="M5 20v-8.5l5-4 5 4V20z" />
    <path d="M3 11.5 10 6l7 5.5" />
    <rect x="8.5" y="14.5" width="3" height="5.5" />
  </>),
  subway: (<>
    <rect x="5" y="4" width="14" height="15" rx="3" />
    <path d="M5 9.5h14" />
    <rect x="7.5" y="6" width="4" height="2.5" rx=".5" /><rect x="12.5" y="6" width="4" height="2.5" rx=".5" />
    <circle cx="9" cy="13.5" r="1" /><circle cx="15" cy="13.5" r="1" />
    <path d="M8 19l-1.5 2M16 19l1.5 2" />
  </>),

  // ── hideout · object ─────────────────────────────────────
  vinyl: (<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.3" /></>),
  neonsign: (<>
    <rect x="4" y="5" width="16" height="9" rx="2" />
    <path d="M12 14v6M8 20h8" />
    <path d="M12.5 7.5l-2 3h2.2l-1 2.5" />
  </>),
  plants: (<>
    <path d="M8.5 21h7l-1-6h-5z" />
    <path d="M12 15c0-3-2-5-5-5 0 3 2 5 5 5z" />
    <path d="M12 15c0-4 2.2-6 5-6 0 4-2.2 6-5 6z" />
    <path d="M12 15V9" />
  </>),
  motorcycle: (<>
    <circle cx="6" cy="16" r="3" /><circle cx="18" cy="16" r="3" />
    <path d="M6 16l3-5h6l2 5M9 11l-1.5-2H10" />
  </>),
  telescope: (<>
    <path d="M4.5 16.5l9-9 3 3-9 9z" />
    <path d="M9 15l-3 5.5M11.5 17.5l2.5 3" />
    <path d="M4.5 16.5l-1.5 2.5 2.5-1" />
  </>),
  arcade: (<>
    <rect x="6" y="3" width="12" height="18" rx="2" />
    <rect x="8.5" y="6" width="7" height="5" rx="1" />
    <circle cx="10" cy="14.5" r="1" /><circle cx="13.8" cy="14.5" r="1" />
    <path d="M8.5 18h7" />
  </>),

  // ── hideout · light ──────────────────────────────────────
  moon3am: (<>
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
    <path d="M6 5.5l.6 1.6L8.2 7.7l-1.6.6L6 9.9l-.6-1.6L3.8 7.7l1.6-.6z" />
  </>),
  'sun-golden': (<>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
  </>),
  fog: (<>
    <path d="M4 8c2-1 4 1 6 0s4-1 6 0" />
    <path d="M5 12c2-1 4 1 6 0s4-1 6 0" />
    <path d="M4 16c2-1 4 1 6 0s4-1 6 0" />
  </>),
  storm: (<>
    <path d="M7 14a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 1.5A3.5 3.5 0 0 1 17 14z" />
    <path d="M12 13l-2 4h3l-2 4" />
  </>),
  dusk: (<>
    <path d="M5 16a7 7 0 0 1 14 0M3 16h18" />
    <path d="M12 4.5v3M5.5 8L7 9.5M18.5 8L17 9.5" />
  </>),
  candle: (<>
    <rect x="9" y="10" width="6" height="11" rx="1" />
    <path d="M12 10V7" />
    <path d="M12 3c2 2 2 4 0 4s-2-2 0-4z" />
  </>),

  // ── ride · vehicle ───────────────────────────────────────
  supercar: (<>
    <path d="M3 15.5l3-4h9l4 3 2 1v2.5H3z" />
    <path d="M7 11.5l1.5-2h5l2 2" />
    <circle cx="7.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" />
  </>),
  ufo: (<>
    <ellipse cx="12" cy="13" rx="9" ry="3.5" />
    <path d="M8 11a4 3 0 0 1 8 0" />
    <path d="M9 18l-1 3M12 18.5V21.5M15 18l1 3" />
  </>),
  vespa: (<>
    <circle cx="6" cy="17" r="2.5" /><circle cx="18" cy="17" r="2.5" />
    <path d="M6 17l2-6h4c2 0 2 3 4 3l2 3" />
    <path d="M8 11l-2-2h3" />
  </>),
  horse: (<>
    <path d="M6 20c0-5 1-8.5 4-10.5l-1.5-3 3.5 2 3.5 1c1.3.4 1.3 2 .2 2.7l-1.7 1c.2 3-1 5.8-2.7 6.8" />
    <circle cx="13.5" cy="9" r=".6" />
  </>),
  bmx: (<>
    <circle cx="6" cy="16" r="4" /><circle cx="18" cy="16" r="4" />
    <path d="M6 16l4-6h6M10 10l4 6M14 10h3.5" />
  </>),
  speedboat: (<>
    <path d="M3 15h17l-2.5 4H6.5z" />
    <path d="M8 15l1-4h4l2 4" />
    <path d="M20 13c1.6 0 2.8-1 2.8-1" />
  </>),

  // ── ride · detail ────────────────────────────────────────
  flames: (<><path d="M12 21c4 0 6-3 6-6 0-3-2-4-2-7-3 2-3 4-3 4s-1-2-1-5c-4 2-6 5-6 8 0 3 2 6 6 6z" /></>),
  chrome: (<>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
  </>),
  holo: (<>
    <path d="M12 4l8 14H4z" />
    <path d="M12 4l-2.5 14M12 4l2.5 14M8 18h8" />
  </>),
  floral: (<>
    <circle cx="12" cy="12" r="2" />
    <path d="M12 10c0-3 4-3 4 0M12 14c0 3-4 3-4 0M10 12c-3 0-3-4 0-4M14 12c3 0 3 4 0 4" />
  </>),
  skull: (<>
    <path d="M5 11.5a7 7 0 0 1 14 0V14l-1.5 1.5h-11L5 14z" />
    <circle cx="9.2" cy="11.5" r="1.4" /><circle cx="14.8" cy="11.5" r="1.4" />
    <path d="M9.5 17v2M12 16.5v3M14.5 17v2" />
  </>),
  patina: (<>
    <path d="M6 4.5v8.5M10 4.5v11.5M14 4.5v7.5M18 4.5v10" />
    <circle cx="6" cy="15" r="1" /><circle cx="14" cy="14" r="1" /><circle cx="18" cy="16.5" r="1" />
  </>),

  // ── ride · setting ───────────────────────────────────────
  citynight: (<>
    <path d="M3 20v-9l3-2v3l4-3v5l4-3v9M3 20h11" />
    <path d="M18 7a3 3 0 1 0 1.5 5.6A4 4 0 1 1 18 7z" />
  </>),
  coast: (<>
    <circle cx="16.5" cy="8" r="2.5" />
    <path d="M6 17c0-4 1.5-7 4-8.5" />
    <path d="M10 8.5c-2-1-4 0-5.5 1.5M10 8.5c0-2.2 1.3-3.5 3.3-3.5M10 8.5c2-1 4.3 0 4.3 2.2" />
    <path d="M3 18.5c2-1.4 4-1.4 6 0s4 1.4 6 0 4-1.4 6 0" />
  </>),
  desert: (<>
    <circle cx="16.5" cy="7" r="2.3" />
    <path d="M10 19v-7M10 15.5H8v-2.2h2M10 13.5h2v-3h-2" />
    <path d="M3 19c3-3 6-3 9 0s6 3 9 0" />
  </>),
  forest: (<>
    <path d="M8 4l3 5H9.2l3 5H4l3-5H5z" />
    <path d="M16.5 7.5l2.2 3.7H17l2.2 3.8H13" />
    <path d="M8 14v5.5M16.5 15v4.5" />
  </>),
  bridge: (<>
    <path d="M2 16.5h20M6 16.5V7M18 16.5V7" />
    <path d="M6 7c4 4 8 4 12 0M6 7l-4 6M18 7l4 6" />
    <path d="M9.5 16.5v-4.2M12 16.5v-5M14.5 16.5v-4.2" />
  </>),
  starfield: (<>
    <path d="M9 5l1.2 3.3L13.5 9.5l-3.3 1.2L9 14l-1.2-3.3L4.5 9.5l3.3-1.2z" />
    <circle cx="17" cy="7" r="1" /><circle cx="18.5" cy="14" r="1" /><circle cx="6" cy="18.5" r="1" /><circle cx="13.5" cy="17.5" r="1" />
  </>),

  // ── creature · creature ──────────────────────────────────
  dragon: (<>
    <path d="M4 17c3 1 6 .5 8-1.5 1.5 1.8 4 1.5 5.5-.3 1.2-1.4 1.5-3.3.7-5l1.8-2-3 .2c-1.3-1.8-3.8-2.6-6.4-1.7C5.4 7.6 3.7 10.4 4 13.4z" />
    <circle cx="14" cy="9.5" r=".7" />
    <path d="M17 6.5l2-1.5-.3 2.4" />
  </>),
  fox: (<>
    <path d="M4 7l4.5 3M20 7l-4.5 3" />
    <path d="M5 7.5c0 6 3 9.5 7 9.5s7-3.5 7-9.5l-3 2-4-2-4 2z" />
    <circle cx="9.5" cy="11" r=".7" /><circle cx="14.5" cy="11" r=".7" />
    <path d="M12 13.5v1" />
  </>),
  octopus: (<>
    <path d="M7 11.5a5 5 0 0 1 10 0V13H7z" />
    <circle cx="10" cy="10.5" r=".7" /><circle cx="14" cy="10.5" r=".7" />
    <path d="M7 13c-1 2-1 4 0 5.5M10 13v5.5M14 13v5.5M17 13c1 2 1 4 0 5.5" />
  </>),
  moth: (<>
    <path d="M12 8c-4-4-9-2-9 2.2C3 14 8 15.5 12 12M12 8c4-4 9-2 9 2.2C21 14 16 15.5 12 12" />
    <path d="M12 7.5v9.5M12 7.5l-2-3M12 7.5l2-3" />
  </>),
  wolf: (<>
    <path d="M5 6l3 4M19 6l-3 4" />
    <path d="M6 8c-1 5.5 1 9.5 4 10.5 1-3 3-3 4 0 3-1 5-5 4-10.5l-3 2-3-1-3 1z" />
    <circle cx="9.5" cy="11.5" r=".7" /><circle cx="14.5" cy="11.5" r=".7" />
  </>),
  falcon: (<>
    <path d="M3 9c4 1 6 3 9 3s5-2 9-3c-3 4.5-5 6.5-9 6.5S6 13.5 3 9z" />
    <path d="M12 12.2v3.3" />
  </>),

  // ── creature · element ───────────────────────────────────
  fire: (<><path d="M12 21c3.5 0 6-2.5 6-6 0-3.5-3-5-3-8-2 1.5-2.5 3.5-2.5 3.5S11 8 11 5c-3 2-5 5-5 8 0 3.5 2.5 8 6 8z" /></>),
  water: (<><path d="M12 4c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z" /></>),
  lightning: (<><path d="M13 3L5 13.5h5l-1 7.5 8-11h-5z" /></>),
  moonlight: (<><path d="M20 13.5A7.5 7.5 0 1 1 10.5 4 6 6 0 0 0 20 13.5z" /></>),
  bloom: (<>
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="7" r="1.6" /><circle cx="12" cy="17" r="1.6" /><circle cx="7" cy="12" r="1.6" /><circle cx="17" cy="12" r="1.6" /><circle cx="8.5" cy="8.5" r="1.6" /><circle cx="15.5" cy="15.5" r="1.6" />
  </>),
  frost: (<>
    <path d="M12 3v18M3.6 7.5l16.8 9M20.4 7.5L3.6 16.5" />
    <path d="M12 6.5l-2 1.5M12 6.5l2 1.5M12 17.5l-2-1.5M12 17.5l2-1.5" />
  </>),

  // ── creature · mood ──────────────────────────────────────
  regal: (<><path d="M4 18h16M5 18l-1-9 4.5 3.2L12 5.5l3.5 6.7L20 9l-1 9z" /></>),
  mischief: (<>
    <path d="M3 9c3-1 6-1 9 0 3-1 6-1 9 0-1 5.2-4 6.3-6 5.3-1-.5-2-1.8-3-1.8s-2 1.3-3 1.8c-2 1-5-.1-6-5.3z" />
    <circle cx="8" cy="11" r="1" /><circle cx="16" cy="11" r="1" />
  </>),
  serene: (<>
    <path d="M12 20c5-2 8.5-6.5 8.5-12.5-6 0-10.5 3.2-11.5 7.5" />
    <path d="M4 20c0-5.5 3.2-9.7 8.5-11.8" />
  </>),
  fierce: (<>
    <path d="M5 5l9 9M5 7l2-2M13.5 13.5l3 3-1 3-2.5-1z" />
    <path d="M19 5l-9 9M19 7l-2-2M10.5 13.5l-3 3 1 3 2.5-1z" />
  </>),
  dreamy: (<>
    <path d="M6 16a3.5 3.5 0 0 1 .5-7 5 5 0 0 1 9.5 1A3 3 0 0 1 16 16z" />
    <path d="M15 18.5h3l-3 3h3" />
  </>),
  mystery: (<>
    <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
    <circle cx="12" cy="12" r="2.5" />
  </>),

  // ── brand / ui marks ─────────────────────────────────────
  brain: (<>
    <path d="M12 5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3 3 0 0 0 9 18a3 3 0 0 0 3 1 3 3 0 0 0 3-1 3 3 0 0 0 2-4.8A3 3 0 0 0 15 8a3 3 0 0 0-3-3z" />
    <path d="M12 5.5v13M9 9.5c1 .6 2 .6 3 0M9 14c1 .6 2 .6 3 0" />
  </>),
  tap: (<>
    <path d="M10 9V5.5a1.6 1.6 0 0 1 3.2 0V11l3 .6c1 .2 1.6 1.1 1.4 2.1l-.6 3.2c-.2 1.2-1.3 2.1-2.5 2.1H12c-1 0-2-.5-2.6-1.4L6 14c-.6-.9-.4-1.8.5-2.2.8-.4 1.7 0 2.1.7z" />
  </>),
};

export function Icon({
  name,
  size = 32,
  strokeWidth = 1.8,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  const g = ICONS[name];
  if (!g) return null;
  return (
    <svg
      className="sb-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {g}
    </svg>
  );
}

/** Solid color tile. `noir` renders a split black/white swatch. */
export function ColorSwatch({ hex, size = 34 }: { hex: string; size?: number }) {
  const noir = hex === 'noir';
  return (
    <span
      className="sb-swatch"
      style={{
        width: size,
        height: size,
        background: noir
          ? 'linear-gradient(135deg,#0d0d12 0 50%,#e8e8f0 50% 100%)'
          : hex,
      }}
    />
  );
}

function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}

/** Gradient initial circle — avatar fallback when there's no head_url. */
export function Monogram({ name, size = 22 }: { name: string; size?: number }) {
  const h = hashHue(name || '?');
  const initial = (name.match(/[a-zA-Z0-9]/)?.[0] || name.charAt(0) || '?').toUpperCase();
  return (
    <span
      className="sb-mono"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: `linear-gradient(135deg, hsl(${h} 80% 62%), hsl(${(h + 50) % 360} 80% 56%))`,
      }}
    >
      {initial}
    </span>
  );
}
