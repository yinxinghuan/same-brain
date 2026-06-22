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
      {
        key: 'view',
        ask: ask('The view outside?', '窗外是什么？', '¿La vista afuera?', 'A vista lá fora?'),
        options: [
          o('citynight', 'City', '都市', 'Ciudad', 'Cidade', 'a glittering city skyline outside the windows'),
          o('coast', 'Ocean', '海洋', 'Océano', 'Oceano', 'an endless moonlit ocean outside the windows'),
          o('forest', 'Forest', '森林', 'Bosque', 'Floresta', 'a misty ancient forest outside the windows'),
          o('desert', 'Desert', '沙漠', 'Desierto', 'Deserto', 'rolling desert dunes outside the windows'),
          o('mountains', 'Mountains', '山脉', 'Montañas', 'Montanhas', 'snowy mountain peaks outside the windows'),
          o('starfield', 'Stars', '星空', 'Estrellas', 'Estrelas', 'a vast field of stars outside the windows'),
        ],
      },
    ],
    compose: ([place, color, object, light, view]) =>
      `A secret hideout: ${place}, ${color}, featuring ${object}, ${light}, ${view}. ${STYLE}`,
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
      {
        key: 'hour',
        ask: ask('What time is it?', '几点了？', '¿Qué hora es?', 'Que horas são?'),
        options: [
          o('sun-golden', 'Golden hour', '黄昏', 'Hora dorada', 'Hora dourada', 'at warm golden hour'),
          o('moon3am', '3am', '凌晨', 'Las 3am', '3h da manhã', 'under a 3am moon'),
          o('dusk', 'Dusk', '黄昏', 'Atardecer', 'Crepúsculo', 'at hazy violet dusk'),
          o('storm', 'Storm', '雷暴', 'Tormenta', 'Tempestade', 'in the middle of a thunderstorm'),
          o('fog', 'Fog', '晨雾', 'Niebla', 'Névoa', 'through low morning fog'),
          o('aurora', 'Aurora', '极光', 'Aurora', 'Aurora', 'beneath a glowing aurora'),
        ],
      },
    ],
    compose: ([vehicle, color, detail, setting, hour]) =>
      `${color} ${vehicle}, ${detail}, ${setting}, ${hour}. ${STYLE}`,
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
      {
        key: 'realm',
        ask: ask('Where does it roam?', '它栖息在哪？', '¿Dónde habita?', 'Onde habita?'),
        options: [
          o('forest', 'Forest', '森林', 'Bosque', 'Floresta', 'in an ancient moonlit forest'),
          o('mountains', 'Peaks', '高山', 'Cumbres', 'Cumes', 'among towering snowy peaks'),
          o('starfield', 'Cosmos', '星海', 'Cosmos', 'Cosmos', 'drifting among the stars'),
          o('desert', 'Desert', '荒漠', 'Desierto', 'Deserto', 'across an endless desert'),
          o('coast', 'Coast', '海岸', 'Costa', 'Costa', 'along a wild crashing coast'),
          o('citynight', 'City', '都市', 'Ciudad', 'Cidade', 'prowling a neon-lit city'),
        ],
      },
    ],
    compose: ([creature, element, color, mood, realm]) =>
      `${creature}, ${mood}, ${element}, ${color}, ${realm}, epic fantasy portrait. ${STYLE}`,
  },

  {
    id: 'power',
    setup: {
      en: 'Your alter ego has one secret superpower…',
      zh: '你那个「另一个自己」有一项秘密超能力…',
      es: 'Tu álter ego tiene un superpoder secreto…',
      pt: 'Seu alter ego tem um superpoder secreto…',
    },
    dims: [
      {
        key: 'power',
        ask: ask("What's the power?", '是什么能力？', '¿Cuál es el poder?', 'Qual é o poder?'),
        options: [
          o('flight', 'Flight', '飞行', 'Vuelo', 'Voo', 'soaring in flight high above the clouds'),
          o('teleport', 'Teleport', '瞬移', 'Teletransporte', 'Teletransporte', 'vanishing through a swirling teleport portal'),
          o('firebolt', 'Firebolt', '火焰', 'Bola de fuego', 'Bola de fogo', 'hurling a firebolt from an open palm'),
          o('timestop', 'Time stop', '停止时间', 'Parar el tiempo', 'Parar o tempo', 'freezing time to a standstill'),
          o('invisible', 'Invisible', '隐身', 'Invisible', 'Invisível', 'fading into total invisibility'),
          o('telekinesis', 'Telekinesis', '念力', 'Telequinesis', 'Telecinese', 'lifting objects with telekinesis'),
          o('shapeshift', 'Shapeshift', '变形', 'Metamorfosis', 'Metamorfose', 'shapeshifting into another form mid-morph'),
          o('mindwave', 'Mind reading', '读心', 'Leer la mente', 'Ler a mente', 'sending out psychic mind-reading waves'),
        ],
      },
      {
        key: 'aura',
        ask: ask('Aura color?', '光环颜色？', '¿Color del aura?', 'Cor da aura?'),
        options: [
          col('pink', 'a hot pink aura'),
          col('cyan', 'an electric cyan aura'),
          col('gold', 'a golden aura'),
          col('crimson', 'a crimson aura'),
          col('violet', 'a cosmic violet aura'),
          col('jade', 'a jade-green aura'),
          col('mint', 'a soft mint aura'),
          col('noir', 'a stark black-and-white aura'),
        ],
      },
      {
        key: 'source',
        ask: ask('Fueled by?', '由什么驱动？', '¿Alimentado por?', 'Alimentado por?'),
        options: [
          o('fire', 'Fire', '烈火', 'Fuego', 'Fogo', 'fueled by crackling fire'),
          o('lightning', 'Lightning', '闪电', 'Rayo', 'Raio', 'fueled by lightning'),
          o('frost', 'Frost', '寒霜', 'Escarcha', 'Geada', 'fueled by biting frost'),
          o('moonlight', 'Moonlight', '月光', 'Luz de luna', 'Luar', 'fueled by moonlight'),
          o('bloom', 'Bloom', '花海', 'Floración', 'Floração', 'fueled by blooming flowers'),
          o('embers', 'Embers', '余烬', 'Brasas', 'Brasas', 'fueled by glowing embers'),
          o('stardust', 'Stardust', '星尘', 'Polvo estelar', 'Poeira estelar', 'fueled by cosmic stardust'),
          o('water', 'Water', '流水', 'Agua', 'Água', 'fueled by surging water'),
        ],
      },
      {
        key: 'sigil',
        ask: ask('Their emblem?', '他们的徽记？', '¿Su emblema?', 'O emblema deles?'),
        options: [
          o('sigilstar', 'Star', '星徽', 'Estrella', 'Estrela', 'a glowing star emblem'),
          o('sigileye', 'Eye', '神眼', 'Ojo', 'Olho', 'a glowing all-seeing eye emblem'),
          o('sigilcrown', 'Crown', '王冠', 'Corona', 'Coroa', 'a glowing crown emblem'),
          o('sigilspiral', 'Spiral', '螺旋', 'Espiral', 'Espiral', 'a glowing spiral emblem'),
          o('sigilwings', 'Wings', '羽翼', 'Alas', 'Asas', 'a glowing winged emblem'),
          o('skull', 'Skull', '骷髅', 'Calavera', 'Caveira', 'a glowing skull emblem'),
          o('lightning', 'Bolt', '雷纹', 'Rayo', 'Raio', 'a glowing lightning-bolt emblem'),
          o('moon3am', 'Moon', '弦月', 'Luna', 'Lua', 'a glowing crescent-moon emblem'),
        ],
      },
      {
        key: 'vibe',
        ask: ask('The vibe?', '什么气场？', '¿La onda?', 'A vibe?'),
        options: [
          o('regal', 'Regal', '威严', 'Majestuoso', 'Majestoso', 'regal and unstoppable'),
          o('fierce', 'Fierce', '凶悍', 'Feroz', 'Feroz', 'fierce and battle-ready'),
          o('serene', 'Serene', '安宁', 'Sereno', 'Sereno', 'serene and untouchable'),
          o('mischief', 'Mischief', '狡黠', 'Travieso', 'Travesso', 'mischievous and sly'),
          o('dreamy', 'Dreamy', '梦幻', 'Soñador', 'Sonhador', 'dreamy and otherworldly'),
          o('mystery', 'Mystery', '神秘', 'Misterio', 'Mistério', 'mysterious and masked'),
          o('playful', 'Playful', '顽皮', 'Juguetón', 'Brincalhão', 'playful and full of energy'),
          o('brooding', 'Brooding', '阴郁', 'Sombrío', 'Melancólico', 'brooding and storm-tempered'),
        ],
      },
    ],
    compose: ([power, aura, source, sigil, vibe]) =>
      `An epic superhero portrait: a figure using the power of ${power}, ${vibe}, wrapped in ${aura}, fueled by ${source}, their ${sigil} glowing. ${STYLE}`,
  },

  {
    id: 'world',
    setup: {
      en: 'Your alter ego comes from another world. It\'s…',
      zh: '你那个「另一个自己」来自另一个世界，那里…',
      es: 'Tu álter ego viene de otro mundo. Es…',
      pt: 'Seu alter ego vem de outro mundo. É…',
    },
    dims: [
      {
        key: 'terrain',
        ask: ask('The land?', '是什么地貌？', '¿La tierra?', 'A terra?'),
        options: [
          o('mountains', 'Mountains', '高山', 'Montañas', 'Montanhas', 'jagged snowy mountains'),
          o('forest', 'Forest', '森林', 'Bosque', 'Floresta', 'a vast ancient forest'),
          o('desert', 'Desert', '沙漠', 'Desierto', 'Deserto', 'rolling endless desert dunes'),
          o('coast', 'Coast', '海岸', 'Costa', 'Costa', 'a wild crashing coastline'),
          o('starfield', 'Cosmos', '星海', 'Cosmos', 'Cosmos', 'a star-strewn cosmic expanse'),
          o('seadome', 'Undersea', '海底', 'Submarino', 'Submarino', 'a glowing undersea world'),
          o('volcano', 'Volcanoes', '火山', 'Volcanes', 'Vulcões', 'an erupting volcanic range'),
          o('floatingisland', 'Sky isles', '浮空岛', 'Islas flotantes', 'Ilhas flutuantes', 'floating islands in the sky'),
        ],
      },
      {
        key: 'sky',
        ask: ask("The sky's color?", '天空什么颜色？', '¿Color del cielo?', 'Cor do céu?'),
        options: [
          col('pink', 'under a hot pink sky'),
          col('cyan', 'under an electric cyan sky'),
          col('gold', 'under a golden sky'),
          col('crimson', 'under a crimson sky'),
          col('violet', 'under a cosmic violet sky'),
          col('jade', 'under a jade-green sky'),
          col('mint', 'under a soft mint sky'),
          col('noir', 'under a stark black-and-white sky'),
        ],
      },
      {
        key: 'structure',
        ask: ask("What's built there?", '那里建着什么？', '¿Qué hay construido?', 'O que há construído?'),
        options: [
          o('loft', 'Towers', '高塔', 'Torres', 'Torres', 'dotted with towering glass spires'),
          o('cabin', 'Cabins', '木屋', 'Cabañas', 'Cabanas', 'scattered with wooden cabins'),
          o('lighthouse', 'Lighthouse', '灯塔', 'Faro', 'Farol', 'a lone lighthouse on the cliffs'),
          o('windmill', 'Windmills', '风车', 'Molinos', 'Moinhos', 'lined with old stone windmills'),
          o('treehouse', 'Treehouses', '树屋', 'Casas del árbol', 'Casas na árvore', 'crowded with hanging treehouses'),
          o('seadome', 'Domes', '穹顶', 'Cúpulas', 'Cúpulas', 'crowned with glass domes'),
          o('arcade', 'Neon city', '霓虹城', 'Ciudad de neón', 'Cidade de neon', 'a sprawling neon-lit city'),
          o('subway', 'Ruins', '废墟', 'Ruinas', 'Ruínas', 'scattered with forgotten ruins'),
        ],
      },
      {
        key: 'weather',
        ask: ask('The weather?', '是什么天气？', '¿El clima?', 'O clima?'),
        options: [
          o('sun-golden', 'Golden', '金光', 'Dorado', 'Dourado', 'bathed in golden light'),
          o('storm', 'Storm', '雷暴', 'Tormenta', 'Tempestade', 'torn by a thunderstorm'),
          o('fog', 'Fog', '浓雾', 'Niebla', 'Névoa', 'shrouded in drifting fog'),
          o('aurora', 'Aurora', '极光', 'Aurora', 'Aurora', 'lit by a sky-wide aurora'),
          o('frost', 'Frost', '冰封', 'Escarcha', 'Geada', 'gripped by glittering frost'),
          o('bloom', 'Bloom', '花季', 'Floración', 'Floração', 'awash in drifting blossoms'),
          o('comet', 'Comet', '彗星', 'Cometa', 'Cometa', 'streaked by a falling comet'),
          o('rainstorm', 'Rain', '暴雨', 'Lluvia', 'Chuva', 'soaked in pouring rain'),
        ],
      },
      {
        key: 'beast',
        ask: ask('What roams it?', '什么生灵游荡其间？', '¿Qué lo recorre?', 'O que percorre?'),
        options: [
          o('dragon', 'Dragons', '巨龙', 'Dragones', 'Dragões', 'roamed by great dragons'),
          o('fox', 'Foxes', '狐狸', 'Zorros', 'Raposas', 'home to clever foxes'),
          o('wolf', 'Wolves', '狼群', 'Lobos', 'Lobos', 'home to roaming wolves'),
          o('falcon', 'Falcons', '猎隼', 'Halcones', 'Falcões', 'circled by soaring falcons'),
          o('stag', 'Stags', '雄鹿', 'Ciervos', 'Cervos', 'wandered by noble stags'),
          o('jellyfish', 'Jellyfish', '水母', 'Medusas', 'Águas-vivas', 'drifting with luminous jellyfish'),
          o('octopus', 'Octopus', '章鱼', 'Pulpos', 'Polvos', 'home to iridescent octopuses'),
          o('moth', 'Moths', '飞蛾', 'Polillas', 'Mariposas', 'aglow with giant luminous moths'),
        ],
      },
    ],
    compose: ([terrain, sky, structure, weather, beast]) =>
      `A breathtaking fantasy world vista: ${terrain}, ${structure}, ${weather}, ${sky}, ${beast}. Epic wide establishing shot. ${STYLE}`,
  },

  {
    id: 'look',
    setup: {
      en: 'Your alter ego walks in. The signature look is…',
      zh: '你那个「另一个自己」走了进来，标志性的造型是…',
      es: 'Tu álter ego entra. El look distintivo es…',
      pt: 'Seu alter ego entra. O visual marcante é…',
    },
    dims: [
      {
        key: 'garment',
        ask: ask('The outfit?', '什么穿搭？', '¿El atuendo?', 'A roupa?'),
        options: [
          o('trenchcoat', 'Trench', '风衣', 'Trinchera', 'Trench', 'a belted trench coat'),
          o('hoodie', 'Hoodie', '连帽衫', 'Sudadera', 'Moletom', 'an oversized hoodie'),
          o('kimono', 'Kimono', '和服', 'Kimono', 'Quimono', 'a flowing kimono robe'),
          o('armor', 'Armor', '铠甲', 'Armadura', 'Armadura', 'a gleaming plate breastplate'),
          o('gown', 'Gown', '礼服', 'Vestido', 'Vestido', 'a flowing evening gown'),
          o('leatherjacket', 'Leather', '皮夹克', 'Cuero', 'Couro', 'a biker leather jacket'),
          o('cloak', 'Cloak', '斗篷', 'Capa', 'Capa', 'a hooded cloak'),
          o('jumpsuit', 'Jumpsuit', '连体衣', 'Mono', 'Macacão', 'a sleek one-piece jumpsuit'),
        ],
      },
      {
        key: 'palette',
        ask: ask('The palette?', '什么色调？', '¿La paleta?', 'A paleta?'),
        options: [
          col('pink', 'hot pink'),
          col('cyan', 'electric cyan'),
          col('gold', 'gold'),
          col('crimson', 'crimson'),
          col('violet', 'cosmic violet'),
          col('jade', 'jade green'),
          col('mint', 'soft mint'),
          col('noir', 'black and white'),
        ],
      },
      {
        key: 'accessory',
        ask: ask('The accessory?', '什么配饰？', '¿El accesorio?', 'O acessório?'),
        options: [
          o('sunglasses', 'Shades', '墨镜', 'Gafas', 'Óculos', 'oversized sunglasses'),
          o('fedora', 'Fedora', '礼帽', 'Fedora', 'Fedora', 'a wide-brim fedora'),
          o('necklace', 'Necklace', '项链', 'Collar', 'Colar', 'a pendant necklace'),
          o('gloves', 'Gloves', '手套', 'Guantes', 'Luvas', 'sleek long gloves'),
          o('eyemask', 'Eye mask', '眼罩', 'Antifaz', 'Máscara', 'a masquerade eye mask'),
          o('scarf', 'Scarf', '围巾', 'Bufanda', 'Cachecol', 'a draped silk scarf'),
          o('earrings', 'Earrings', '耳环', 'Aretes', 'Brincos', 'dangling drop earrings'),
          o('handbag', 'Handbag', '手袋', 'Bolso', 'Bolsa', 'a statement handbag'),
        ],
      },
      {
        key: 'backdrop',
        ask: ask('The backdrop?', '什么背景？', '¿El fondo?', 'O cenário?'),
        options: [
          o('citynight', 'City', '都市', 'Ciudad', 'Cidade', 'on a neon-lit city street'),
          o('coast', 'Coast', '海岸', 'Costa', 'Costa', 'on a sunset beach'),
          o('desert', 'Desert', '沙漠', 'Desierto', 'Deserto', 'in an open desert at dusk'),
          o('forest', 'Forest', '森林', 'Bosque', 'Floresta', 'in a misty ancient forest'),
          o('bridge', 'Bridge', '大桥', 'Puente', 'Ponte', 'on a glowing suspension bridge'),
          o('starfield', 'Stars', '星空', 'Estrellas', 'Estrelas', 'against a field of stars'),
          o('mountains', 'Mountains', '雪山', 'Montañas', 'Montanhas', 'before snowy mountain peaks'),
          o('rainstorm', 'Rain', '暴雨', 'Lluvia', 'Chuva', 'in a pouring rainstorm'),
        ],
      },
      {
        key: 'vibe',
        ask: ask('The vibe?', '什么气场？', '¿La onda?', 'A vibe?'),
        options: [
          o('regal', 'Regal', '威严', 'Majestuoso', 'Majestoso', 'looking regal and striking'),
          o('fierce', 'Fierce', '凶悍', 'Feroz', 'Feroz', 'looking fierce'),
          o('serene', 'Serene', '安宁', 'Sereno', 'Sereno', 'looking serene and poised'),
          o('mischief', 'Mischief', '狡黠', 'Travieso', 'Travesso', 'looking mischievous'),
          o('dreamy', 'Dreamy', '梦幻', 'Soñador', 'Sonhador', 'looking dreamy and soft'),
          o('mystery', 'Mystery', '神秘', 'Misterio', 'Mistério', 'looking mysterious'),
          o('playful', 'Playful', '顽皮', 'Juguetón', 'Brincalhão', 'looking playful'),
          o('brooding', 'Brooding', '阴郁', 'Sombrío', 'Melancólico', 'looking brooding'),
        ],
      },
    ],
    compose: ([garment, palette, accessory, backdrop, vibe]) =>
      `Full-body high-fashion editorial portrait, wearing ${garment} in ${palette}, accessorized with ${accessory}, ${vibe}, ${backdrop}. ${STYLE}`,
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
