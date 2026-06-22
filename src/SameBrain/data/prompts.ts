// Same Brain — the daily prompts. Each prompt is a 4-dimension picker; every
// dimension carries an image fragment that composes into the gen-image prompt.
// Matching is computed on the chosen option INDICES (the vector). Tiles show a
// custom SVG glyph (or a color swatch) — never emoji. Labels are localized.
import type { Loc } from '../i18n';
import { COLORS } from './colors';

export interface DimOption {
  icon?: string;   // key into the SVG icon set
  color?: string;  // hex (or 'noir') — renders a color swatch instead of a glyph
  labels: Loc;
  frag: string;    // English phrase injected into the image prompt
}

export interface Dim {
  key: string;
  ask: Loc;
  options: DimOption[];
}

export interface BrainPrompt {
  id: string;
  setup: Loc;
  dims: Dim[]; // exactly 4
  compose: (frags: string[]) => string;
}

const STYLE =
  'Cinematic dreamy illustration, rich glowing atmosphere, highly detailed, vibrant, ' +
  'fills the entire square frame edge to edge, full-bleed, no border, no text, no watermark, no letterbox.';

// helpers to keep the table compact
const o = (icon: string, en: string, zh: string, es: string, pt: string, frag: string): DimOption =>
  ({ icon, labels: { en, zh, es, pt }, frag });
const col = (key: string, frag: string): DimOption =>
  ({ color: COLORS[key].hex, labels: COLORS[key].label, frag });
const ask = (en: string, zh: string, es: string, pt: string): Loc => ({ en, zh, es, pt });

export const PROMPTS: BrainPrompt[] = [
  {
    id: 'hideout',
    setup: {
      en: "Your alter ego's secret hideout looks like…",
      zh: '你那个「另一个自己」的秘密基地长什么样…',
      es: 'El escondite secreto de tu álter ego es…',
      pt: 'O esconderijo secreto do seu alter ego é…',
    },
    dims: [
      {
        key: 'place',
        ask: ask('Where is it?', '在哪里？', '¿Dónde está?', 'Onde fica?'),
        options: [
          o('loft', 'Neon loft', '霓虹阁楼', 'Loft de neón', 'Loft de neon', 'a high-rise neon city loft with floor-to-ceiling windows'),
          o('trailer', 'Desert trailer', '沙漠拖车', 'Tráiler del desierto', 'Trailer no deserto', 'a lone airstream trailer in the open desert'),
          o('treehouse', 'Treehouse', '树屋', 'Casa del árbol', 'Casa na árvore', 'a cozy treehouse high in an ancient forest'),
          o('seadome', 'Sea dome', '海底穹顶', 'Cúpula marina', 'Cúpula no mar', 'a glass dome lounge under the ocean surrounded by fish'),
          o('cabin', 'Cabin', '雪山小屋', 'Cabaña', 'Cabana', 'a wooden cabin on a snowy mountain ridge'),
          o('subway', 'Subway car', '废弃地铁', 'Vagón de metro', 'Vagão de metrô', 'a converted abandoned subway car hideout'),
          o('lighthouse', 'Lighthouse', '灯塔', 'Faro', 'Farol', 'a tall lighthouse on a rocky cliff over the crashing sea'),
          o('windmill', 'Windmill', '风车屋', 'Molino', 'Moinho', 'a cozy converted windmill in rolling green fields'),
        ],
      },
      {
        key: 'color',
        ask: ask('What color owns the room?', '什么颜色统治整个空间？', '¿Qué color domina?', 'Que cor domina?'),
        options: [
          col('pink', 'drenched in hot pink light'),
          col('cyan', 'glowing electric cyan'),
          col('gold', 'warm molten gold tones'),
          col('crimson', 'deep crimson red mood'),
          col('mint', 'soft mint green palette'),
          col('noir', 'moody black-and-white noir'),
          col('jade', 'bathed in deep jade green light'),
          col('violet', 'glowing in cosmic violet'),
        ],
      },
      {
        key: 'object',
        ask: ask('The one thing you HAD to have?', '非有不可的那一样东西？', '¿Qué objeto imprescindible?', 'O objeto indispensável?'),
        options: [
          o('vinyl', 'Vinyl', '黑胶', 'Vinilo', 'Vinil', 'a spinning vinyl record player'),
          o('neonsign', 'Neon sign', '霓虹牌', 'Letrero de neón', 'Letreiro de neon', 'a buzzing custom neon sign on the wall'),
          o('plants', 'Plants', '满屋植物', 'Plantas', 'Plantas', 'a jungle of hanging plants'),
          o('motorcycle', 'Motorcycle', '机车', 'Motocicleta', 'Moto', 'a vintage motorcycle parked inside'),
          o('telescope', 'Telescope', '望远镜', 'Telescopio', 'Telescópio', 'a huge brass telescope aimed at the sky'),
          o('arcade', 'Arcade', '街机', 'Arcade', 'Fliperama', 'a row of glowing arcade machines'),
          o('aquarium', 'Aquarium', '水族箱', 'Acuario', 'Aquário', 'a glowing wall-sized aquarium full of fish'),
          o('jukebox', 'Jukebox', '点唱机', 'Rocola', 'Jukebox', 'a glowing retro jukebox in the corner'),
        ],
      },
      {
        key: 'light',
        ask: ask('What time does it feel like?', '感觉像几点？', '¿Qué hora se siente?', 'Que horas parece?'),
        options: [
          o('moon3am', '3am neon', '凌晨霓虹', 'Neón 3am', 'Neon 3h', 'lit only by 3am neon glow'),
          o('sun-golden', 'Golden hour', '黄昏', 'Hora dorada', 'Hora dourada', 'bathed in golden hour sun'),
          o('fog', 'Foggy dawn', '雾晨', 'Amanecer brumoso', 'Alvorada com névoa', 'a soft foggy dawn'),
          o('storm', 'Storm', '雷暴夜', 'Tormenta', 'Tempestade', 'a midnight thunderstorm outside the windows'),
          o('dusk', 'Violet dusk', '紫色黄昏', 'Atardecer violeta', 'Crepúsculo violeta', 'a hazy violet dusk'),
          o('candle', 'Candlelit', '烛光', 'Luz de velas', 'Luz de velas', 'warm flickering candlelight'),
          o('aurora', 'Aurora', '极光', 'Aurora', 'Aurora', 'shimmering aurora lights through the windows'),
          o('comet', 'Comet', '彗星', 'Cometa', 'Cometa', 'a comet streaking across the night sky'),
        ],
      },
    ],
    compose: ([place, color, object, light]) =>
      `A secret hideout: ${place}, ${color}, featuring ${object}, ${light}. ${STYLE}`,
  },

  {
    id: 'ride',
    setup: {
      en: 'Your alter ego pulls up. The ride is a…',
      zh: '你那个「另一个自己」开车来了，那辆车是…',
      es: 'Tu álter ego llega. Su vehículo es…',
      pt: 'Seu alter ego chega. O veículo é…',
    },
    dims: [
      {
        key: 'vehicle',
        ask: ask('What are they driving?', '开的是什么？', '¿Qué conduce?', 'O que dirige?'),
        options: [
          o('supercar', 'Supercar', '超跑', 'Superdeportivo', 'Supercarro', 'a sleek low supercar'),
          o('ufo', 'UFO', '飞碟', 'OVNI', 'OVNI', 'a hovering chrome UFO'),
          o('vespa', 'Vespa', '小绵羊', 'Vespa', 'Lambreta', 'a retro vespa scooter'),
          o('horse', 'Horse', '骏马', 'Caballo', 'Cavalo', 'a galloping horse'),
          o('bmx', 'BMX', 'BMX', 'BMX', 'BMX', 'a stunt BMX bike'),
          o('speedboat', 'Speedboat', '快艇', 'Lancha', 'Lancha', 'a roaring speedboat'),
          o('balloon', 'Hot-air balloon', '热气球', 'Globo', 'Balão', 'a colorful hot-air balloon'),
          o('submarine', 'Submarine', '潜水艇', 'Submarino', 'Submarino', 'a sleek deep-sea submarine'),
        ],
      },
      {
        key: 'color',
        ask: ask('Paint job?', '什么涂装？', '¿Pintura?', 'Pintura?'),
        options: [
          col('pink', 'hot pink'),
          col('cyan', 'electric cyan'),
          col('gold', 'chrome gold'),
          col('crimson', 'crimson red'),
          col('mint', 'pastel mint'),
          col('matteblack', 'matte black'),
          col('jade', 'jade green'),
          col('violet', 'violet purple'),
        ],
      },
      {
        key: 'detail',
        ask: ask('The signature touch?', '标志性的细节？', '¿El toque distintivo?', 'O toque marcante?'),
        options: [
          o('flames', 'Flames', '火焰', 'Llamas', 'Chamas', 'painted with racing flames'),
          o('chrome', 'Chrome', '镀铬', 'Cromo', 'Cromado', 'dripping with chrome trim'),
          o('holo', 'Holo', '镭射', 'Holo', 'Holo', 'a holographic iridescent finish'),
          o('floral', 'Floral', '花卉', 'Floral', 'Floral', 'covered in floral decals'),
          o('skull', 'Skull', '骷髅', 'Calavera', 'Caveira', 'a bold skull emblem'),
          o('patina', 'Patina', '锈迹', 'Pátina', 'Pátina', 'a rugged rusty patina'),
          o('pinstripes', 'Pinstripes', '条纹', 'Rayas', 'Listras', 'bold racing pinstripes down the side'),
          o('gemstud', 'Jeweled', '宝石', 'Joyas', 'Joias', 'studded with sparkling jewels'),
        ],
      },
      {
        key: 'setting',
        ask: ask('Where are you headed?', '要去哪？', '¿A dónde van?', 'Para onde vão?'),
        options: [
          o('citynight', 'City night', '夜城', 'Ciudad nocturna', 'Cidade à noite', 'tearing through a neon city night'),
          o('coast', 'Coast', '海岸', 'Costa', 'Costa', 'cruising a sunset coastal highway'),
          o('desert', 'Desert', '沙漠', 'Desierto', 'Deserto', 'crossing an empty desert highway'),
          o('forest', 'Forest', '森林', 'Bosque', 'Floresta', 'on a misty forest road'),
          o('bridge', 'Bridge', '大桥', 'Puente', 'Ponte', 'over a glowing suspension bridge'),
          o('starfield', 'Starfield', '星海', 'Campo estelar', 'Campo de estrelas', 'floating through a starfield'),
          o('mountains', 'Mountains', '雪山', 'Montañas', 'Montanhas', 'climbing a winding snow-capped mountain pass'),
          o('rainstorm', 'Rainstorm', '暴雨', 'Tormenta', 'Tempestade', 'speeding through a pouring rainstorm'),
        ],
      },
    ],
    compose: ([vehicle, color, detail, setting]) =>
      `${color} ${vehicle}, ${detail}, ${setting}. ${STYLE}`,
  },

  {
    id: 'creature',
    setup: {
      en: 'In another life your alter ego is a…',
      zh: '在另一种人生里，你那个「另一个自己」是一只…',
      es: 'En otra vida tu álter ego es un…',
      pt: 'Em outra vida seu alter ego é um…',
    },
    dims: [
      {
        key: 'creature',
        ask: ask('Which creature?', '哪种生灵？', '¿Qué criatura?', 'Qual criatura?'),
        options: [
          o('dragon', 'Dragon', '龙', 'Dragón', 'Dragão', 'a majestic dragon'),
          o('fox', 'Fox', '狐狸', 'Zorro', 'Raposa', 'a clever fox'),
          o('octopus', 'Octopus', '章鱼', 'Pulpo', 'Polvo', 'an iridescent octopus'),
          o('moth', 'Moth', '飞蛾', 'Polilla', 'Mariposa', 'a giant luminous moth'),
          o('wolf', 'Wolf', '狼', 'Lobo', 'Lobo', 'a lone wolf'),
          o('falcon', 'Falcon', '猎隼', 'Halcón', 'Falcão', 'a soaring falcon'),
          o('jellyfish', 'Jellyfish', '水母', 'Medusa', 'Água-viva', 'a luminous drifting jellyfish'),
          o('stag', 'Stag', '雄鹿', 'Ciervo', 'Cervo', 'a noble antlered stag'),
        ],
      },
      {
        key: 'element',
        ask: ask('Wreathed in what?', '被什么环绕？', '¿Envuelto en qué?', 'Envolto em quê?'),
        options: [
          o('fire', 'Fire', '烈火', 'Fuego', 'Fogo', 'wreathed in fire'),
          o('water', 'Water', '流水', 'Agua', 'Água', 'flowing with water'),
          o('lightning', 'Lightning', '闪电', 'Rayo', 'Raio', 'crackling with lightning'),
          o('moonlight', 'Moonlight', '月光', 'Luz de luna', 'Luar', 'glowing in moonlight'),
          o('bloom', 'Bloom', '花海', 'Floración', 'Floração', 'surrounded by blooming flowers'),
          o('frost', 'Frost', '寒霜', 'Escarcha', 'Geada', 'laced with frost and ice'),
          o('embers', 'Embers', '余烬', 'Brasas', 'Brasas', 'drifting in glowing embers and sparks'),
          o('stardust', 'Stardust', '星尘', 'Polvo estelar', 'Poeira estelar', 'sprinkled with cosmic stardust'),
        ],
      },
      {
        key: 'color',
        ask: ask('Its color?', '它的颜色？', '¿Su color?', 'Sua cor?'),
        options: [
          col('pink', 'in a hot pink palette'),
          col('cyan', 'in electric cyan'),
          col('gold', 'in radiant gold'),
          col('crimson', 'in deep crimson'),
          col('jade', 'in jade green'),
          col('violet', 'in cosmic violet'),
          col('mint', 'in soft mint green'),
          col('noir', 'in stark black and white'),
        ],
      },
      {
        key: 'mood',
        ask: ask('Its vibe?', '它的气场？', '¿Su onda?', 'Sua vibe?'),
        options: [
          o('regal', 'Regal', '威严', 'Majestuoso', 'Majestoso', 'regal and proud'),
          o('mischief', 'Mischief', '狡黠', 'Travieso', 'Travesso', 'mischievous and sly'),
          o('serene', 'Serene', '安宁', 'Sereno', 'Sereno', 'serene and gentle'),
          o('fierce', 'Fierce', '凶悍', 'Feroz', 'Feroz', 'fierce and battle-ready'),
          o('dreamy', 'Dreamy', '梦幻', 'Soñador', 'Sonhador', 'sleepy and dreamlike'),
          o('mystery', 'Mystery', '神秘', 'Misterio', 'Mistério', 'mysterious and masked'),
          o('playful', 'Playful', '顽皮', 'Juguetón', 'Brincalhão', 'playful and full of energy'),
          o('brooding', 'Brooding', '阴郁', 'Sombrío', 'Melancólico', 'brooding and storm-tempered'),
        ],
      },
    ],
    compose: ([creature, element, color, mood]) =>
      `${creature}, ${mood}, ${element}, ${color}, epic fantasy portrait. ${STYLE}`,
  },
];

/** Daily prompt — rotates on UTC day boundary. */
export function todaysPrompt(): BrainPrompt {
  const day = Math.floor(Date.now() / 86_400_000);
  return PROMPTS[day % PROMPTS.length];
}

/** The theme for a given ritual window — a new one each window. */
export function promptForWindow(window: number): BrainPrompt {
  const n = PROMPTS.length;
  return PROMPTS[((window % n) + n) % n];
}

export function promptById(id: string): BrainPrompt {
  return PROMPTS.find(p => p.id === id) || PROMPTS[0];
}
