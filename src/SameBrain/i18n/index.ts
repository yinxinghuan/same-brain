// Lightweight i18n. Product default is ENGLISH. Other locales are opt-in and
// auto-detected from the device, with English as the universal fallback.
export type Locale = 'en' | 'zh' | 'es' | 'pt';
export const LOCALES: Locale[] = ['en', 'zh', 'es', 'pt'];

/** A string in every supported language. `loc()` picks by current locale. */
export interface Loc {
  en: string;
  zh: string;
  es: string;
  pt: string;
}

function norm(raw: string): Locale | undefined {
  const l = raw.toLowerCase();
  if (l.startsWith('zh')) return 'zh';
  if (l.startsWith('es')) return 'es';
  if (l.startsWith('pt')) return 'pt';
  if (l.startsWith('en')) return 'en';
  return undefined;
}

function detectLocale(): Locale {
  // 1) explicit override (URL ?lang= or stored toggle)
  try {
    const q = new URLSearchParams(location.search).get('lang');
    const u = q && norm(q);
    if (u) return u;
  } catch {
    /* ignore */
  }
  try {
    const o = localStorage.getItem('same_brain_locale');
    const u = o && norm(o);
    if (u) return u;
  } catch {
    /* ignore */
  }
  // 2) device language(s)
  try {
    const langs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    for (const l of langs) {
      const u = norm(l);
      if (u) return u;
    }
  } catch {
    /* ignore */
  }
  return 'en'; // English-first; never auto-fall back to another language
}

export let locale: Locale = detectLocale();

export function setLocale(l: Locale) {
  locale = l;
  try {
    localStorage.setItem('same_brain_locale', l);
  } catch {
    /* ignore */
  }
}

/** Pick a string by the current locale, English fallback. */
export function loc(x: Loc): string {
  return x[locale] || x.en;
}

const STRINGS: Record<string, Loc> = {
  tapToThink: { en: 'tap to think', zh: '点一下开始想', es: 'toca para pensar', pt: 'toque para pensar' },
  reading: { en: 'Reading your mind…', zh: '正在读取你的脑电波…', es: 'Leyendo tu mente…', pt: 'Lendo sua mente…' },
  finding: { en: 'Finding a brain like yours…', zh: '正在寻找和你同款的脑子…', es: 'Buscando una mente como la tuya…', pt: 'Procurando uma mente como a sua…' },
  almost: { en: 'Almost…', zh: '马上好…', es: 'Casi…', pt: 'Quase…' },
  youMatched: { en: 'You think alike', zh: '你们想到一块儿了', es: 'Piensan igual', pt: 'Vocês pensam igual' },
  sync: { en: 'SYNC', zh: '同步', es: 'SYNC', pt: 'SYNC' },
  you: { en: 'YOU', zh: '你', es: 'TÚ', pt: 'VOCÊ' },
  syncedWith: { en: 'same brain as', zh: '同款脑子', es: 'misma mente que', pt: 'mesma mente que' },
  aStranger: { en: 'a stranger', zh: '某个陌生人', es: 'un desconocido', pt: 'um estranho' },
  again: { en: 'Play again', zh: '再来一次', es: 'Jugar otra vez', pt: 'Jogar de novo' },
  seeWall: { en: 'Twin visions', zh: '双胞胎墙', es: 'Visiones gemelas', pt: 'Visões gêmeas' },
  back: { en: 'Back', zh: '返回', es: 'Atrás', pt: 'Voltar' },
  wallTitle: { en: 'Twin visions', zh: '双胞胎墙', es: 'Visiones gemelas', pt: 'Visões gêmeas' },
  wallSub: { en: 'Strangers who pictured the same thing.', zh: '想到同一画面的陌生人们', es: 'Desconocidos que imaginaron lo mismo.', pt: 'Estranhos que imaginaram a mesma coisa.' },
  wallEmptyOpen: { en: 'Open in Aigram to see strangers sync.', zh: '在 Aigram 里打开，看陌生人同步', es: 'Abre en Aigram para ver mentes en sync.', pt: 'Abra no Aigram para ver mentes em sync.' },
  wallEmptyFirst: { en: 'No twins yet — you could be the first.', zh: '还没有双胞胎，你可以当第一个', es: 'Aún no hay gemelos — sé el primero.', pt: 'Ainda não há gêmeos — seja o primeiro.' },
  retry: { en: 'That vision slipped away. Try again.', zh: '这幅画跑掉了，再试一次', es: 'Esa visión se escapó. Inténtalo de nuevo.', pt: 'Essa visão escapou. Tente de novo.' },
};

export function t(key: keyof typeof STRINGS): string {
  const s = STRINGS[key];
  return s ? loc(s) : (key as string);
}
