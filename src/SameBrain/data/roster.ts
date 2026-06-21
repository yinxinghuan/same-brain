// Cold-start phantom partner names. When no real stranger on the wall shares
// your prompt yet, Same Brain conjures a believable "brain twin" so the very
// first player still gets the payoff. Avatars render as gradient monograms
// (no emoji); real wall users carry their head_url instead.

export const ROSTER: string[] = [
  'mxxnchild', 'velvet.io', 'kai_runs', 'soft.static', 'juno', 'pixel_witch',
  'theo.wav', 'late.bloomer', 'noir_noir', 'sage', 'feralcam', 'mira_nova',
  'dusk.echo', 'cobalt', 'honeysynth', 'rook',
];

export function randomRoster(): string {
  return ROSTER[Math.floor(Math.random() * ROSTER.length)];
}
