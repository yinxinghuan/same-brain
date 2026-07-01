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
  wallEmptyOpen: { en: 'Open in AlterU to see strangers sync.', zh: '在 AlterU 中打开，看陌生人同步', es: 'Abre en AlterU para ver mentes en sync.', pt: 'Abra no AlterU para ver mentes em sync.' },
  wallEmptyFirst: { en: 'No twins yet — you could be the first.', zh: '还没有双胞胎，你可以当第一个', es: 'Aún no hay gemelos — sé el primero.', pt: 'Ainda não há gêmeos — seja o primeiro.' },
  retry: { en: 'That vision slipped away. Try again.', zh: '这幅画跑掉了，再试一次', es: 'Esa visión se escapó. Inténtalo de nuevo.', pt: 'Essa visão escapou. Tente de novo.' },
  alterEgoHead: { en: 'Meet your alter ego', zh: '遇见另一个你', es: 'Conoce a tu álter ego', pt: 'Conheça seu alter ego' },
  alterEgoLine: { en: 'Your alter ego pictured it too.', zh: '另一个你也是这么想的。', es: 'Tu álter ego también lo imaginó así.', pt: 'Seu alter ego também imaginou assim.' },
  alterEgoLabel: { en: 'Your alter ego', zh: '另一个你', es: 'Tu álter ego', pt: 'Seu alter ego' },
  alterEgoHint: { en: 'Strangers who think like you are coming. We’ll ping you when one syncs.', zh: '和你想到一块儿的陌生人正在路上，有人撞中会通知你。', es: 'Pronto llegarán desconocidos que piensan como tú. Te avisaremos.', pt: 'Em breve chegarão estranhos que pensam como você. Avisaremos.' },
  like: { en: 'Same brain', zh: '同款脑子', es: 'Misma mente', pt: 'Mesma mente' },
  liked: { en: 'Loved', zh: '已喜欢', es: 'Te gustó', pt: 'Curtido' },
  twinsHead: { en: 'Same brain as this', zh: '和这张同款脑子的人', es: 'Misma mente que esta', pt: 'Mesma mente que esta' },
  twinsNone: { en: 'No twin yet — picture this prompt to be the first.', zh: '还没有双胞胎——画出同款来当第一个', es: 'Aún no hay gemelos — sé el primero en imaginarlo.', pt: 'Ainda não há gêmeos — seja o primeiro a imaginar.' },
  frameTip: { en: 'Same pick = same frame', zh: '同款选择 = 同款相框', es: 'Misma elección = mismo marco', pt: 'Mesma escolha = mesmo quadro' },
  sameFrame: { en: 'Same frame', zh: '同款相框', es: 'Mismo marco', pt: 'Mesmo quadro' },
  sameFrameReveal: { en: 'You even share a frame', zh: '你们连相框都一样', es: 'Hasta comparten marco', pt: 'Vocês até dividem o quadro' },
  // ── ritual cadence (one vision per 3-hour window — keep copy in sync with WINDOW_HOURS) ──
  introCadence: { en: 'One vision this window · new theme every 3h', zh: '本窗口仅一次 · 每 3 小时换新题', es: 'Una visión por ventana · tema nuevo cada 3 h', pt: 'Uma visão por janela · tema novo a cada 3h' },
  lockTitle: { en: 'This window’s vision is sealed', zh: '这个窗口的显影已封存', es: 'Tu visión de esta ventana está sellada', pt: 'A visão desta janela está selada' },
  nextReading: { en: 'Next reading in', zh: '下一次显影', es: 'Próxima lectura en', pt: 'Próxima leitura em' },
  nextTheme: { en: 'Next theme', zh: '下一个主题', es: 'Próximo tema', pt: 'Próximo tema' },
  ritualRule: { en: 'One vision per window. A new theme opens every 3 hours.', zh: '每个窗口只显影一次，每 3 小时开启一个新主题。', es: 'Una visión por ventana. Un tema nuevo cada 3 horas.', pt: 'Uma visão por janela. Um tema novo a cada 3 horas.' },
  sealedNote: { en: 'Sealed — your one vision this window.', zh: '已封存 · 这个窗口的唯一一次显影。', es: 'Sellada — tu única visión de esta ventana.', pt: 'Selada — sua única visão desta janela.' },
  // ── guestbook (public notes left on a vision) ──
  notesHead: { en: 'Notes', zh: '留言', es: 'Notas', pt: 'Recados' },
  notePlaceholder: { en: 'Leave a note…', zh: '写句留言…', es: 'Deja una nota…', pt: 'Deixe um recado…' },
  noteSend: { en: 'Send', zh: '发送', es: 'Enviar', pt: 'Enviar' },
  noteEmpty: { en: 'No notes yet — be the first.', zh: '还没有留言——来当第一个', es: 'Aún no hay notas — sé el primero.', pt: 'Ainda não há recados — seja o primeiro.' },
  noteSignedOut: { en: 'Open in AlterU to leave a note.', zh: '在 AlterU 中打开才能留言', es: 'Abre en AlterU para dejar una nota.', pt: 'Abra no AlterU para deixar um recado.' },
  downloadAlterU: { en: 'Get AlterU on the App Store', zh: '下载 AlterU', es: 'Obtén AlterU en App Store', pt: 'Baixe o AlterU na App Store' },
};

export function t(key: keyof typeof STRINGS): string {
  const s = STRINGS[key];
  return s ? loc(s) : (key as string);
}
