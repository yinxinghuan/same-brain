import type { Loc } from '../i18n';

export interface ColorDef {
  hex: string; // real hex, or the sentinel 'noir' for a split swatch
  label: Loc;
}

export const COLORS: Record<string, ColorDef> = {
  pink: { hex: '#ff5da2', label: { en: 'Hot pink', zh: '热粉', es: 'Rosa neón', pt: 'Rosa neon' } },
  cyan: { hex: '#3ee0ff', label: { en: 'Cyan', zh: '青蓝', es: 'Cian', pt: 'Ciano' } },
  gold: { hex: '#ffd24a', label: { en: 'Gold', zh: '金色', es: 'Dorado', pt: 'Dourado' } },
  crimson: { hex: '#ff4d5e', label: { en: 'Crimson', zh: '猩红', es: 'Carmesí', pt: 'Carmesim' } },
  mint: { hex: '#7cf5b0', label: { en: 'Mint', zh: '薄荷绿', es: 'Menta', pt: 'Menta' } },
  noir: { hex: 'noir', label: { en: 'Noir', zh: '黑白', es: 'Noir', pt: 'Preto e branco' } },
  matteblack: { hex: '#2a2a36', label: { en: 'Matte black', zh: '哑光黑', es: 'Negro mate', pt: 'Preto fosco' } },
  jade: { hex: '#2fd29a', label: { en: 'Jade', zh: '翡翠', es: 'Jade', pt: 'Jade' } },
  violet: { hex: '#9b6cff', label: { en: 'Violet', zh: '紫罗兰', es: 'Violeta', pt: 'Violeta' } },
};
