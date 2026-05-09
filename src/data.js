// ============= GAME MODES =============
export const gameModes = [
  {
    id: 'same-universe',
    title: 'Same Universe',
    emoji: '🔥',
    description: 'Hardest choices — same squad, pick their fate',
    tags: ['Male', 'Heroes'],
    accent: 'pink',
    trios: [
      { round: '🍜 Naruto Universe', characters: ['Naruto', 'Sasuke', 'Kakashi'] },
      { round: '⚓ One Piece',        characters: ['Luffy', 'Zoro', 'Sanji'] },
      { round: '👁️ Jujutsu Kaisen',  characters: ['Satoru Gojo', 'Nanami', 'Geto'] },
    ],
  },
  {
    id: 'villain-edition',
    title: 'Villain Edition',
    emoji: '😈',
    description: 'Pure evil — no heroes, no right answer',
    tags: ['Male', 'Villains'],
    accent: 'red',
    trios: [
      { round: '🔥 Naruto Villains',    characters: ['Madara', 'Pain', 'Obito'] },
      { round: '💀 Crossover Evil',     characters: ['Griffith', 'Dio', 'Light Yagami'] },
    ],
  },
  {
    id: 'crossover-chaos',
    title: 'Crossover Chaos',
    emoji: '🤯',
    description: 'Universes collide — who gets the date?',
    tags: ['Male', 'Mix'],
    accent: 'purple',
    trios: [
      { round: '⚡ Icons Collide',  characters: ['Levi', 'Vegeta', 'Itachi'] },
      { round: '🌀 Best of the Best', characters: ['Sasuke', 'Luffy', 'Satoru Gojo'] },
    ],
  },
  {
    id: 'impossible-choice',
    title: 'Impossible Choice',
    emoji: '😤',
    description: 'Fan favorites only — this will tear you apart',
    tags: ['Female', 'Fan Favs'],
    accent: 'gold',
    trios: [
      { round: '😤 Impossible Choice', characters: ['Zero Two', 'Yor Forger', 'Makima'] },
      { round: '😤 Impossible Choice', characters: ['Hinata Hyuga', 'Sakura Haruno', 'Tsunade'] },
      { round: '😤 Impossible Choice', characters: ['Nami', 'Nico Robin', 'Boa Hancock'] },
      { round: '😤 Impossible Choice', characters: ['Rem', 'Ram', 'Emilia'] },
    ],
  },
  {
    id: 'waifu-wars',
    title: 'Waifu Wars',
    emoji: '💀',
    description: 'The community will fight over this one',
    tags: ['Female', 'Mix'],
    accent: 'green',
    trios: [
      { round: '💀 Waifu Wars', characters: ['Nezuko Kamado', 'Nobara Kugisaki', 'Maki Zenin'] },
      { round: '💀 Waifu Wars', characters: ['Mikasa Ackerman', 'Historia Reiss', 'Sasha Braus'] },
      { round: '💀 Powerhouse Trio', characters: ['Albedo', 'Shalltear', 'Satoru Gojo'] },
    ],
  },
  {
    id: 'villain-waifus',
    title: 'Villain Waifus',
    emoji: '🔥',
    description: 'Dangerous women — pick your doom',
    tags: ['Female', 'Villains'],
    accent: 'red',
    trios: [
      { round: '🔥 Villain Edition', characters: ['Makima', 'Toga Himiko', 'Esdeath'] },
    ],
  },
  {
    id: 'betrayal-round',
    title: 'Betrayal Round',
    emoji: '😭',
    description: 'Characters who broke our hearts — justice time',
    tags: ['Female', 'Mix'],
    accent: 'blue',
    trios: [
      { round: '😭 Betrayal Round', characters: ['Sakura Haruno', 'Orihime Inoue', 'Serena'] },
    ],
  },
];

// ============= ALL CHARACTERS =============
export const chars = {
  // ---- Naruto ----
  'Naruto':         { img: 'images/how-to-draw-naruto-20.png', anime: 'Naruto' },
  'Sasuke':         { img: 'images/sasuke.png',        anime: 'Naruto' },
  'Kakashi':        { img: 'images/kakashi.webp',       anime: 'Naruto' },
  'Madara':         { img: 'images/madara.avif',        anime: 'Naruto' },
  'Pain':           { img: null,                         anime: 'Naruto' },
  'Obito':          { img: 'images/obito.png',          anime: 'Naruto' },
  'Itachi':         { img: 'images/itachi.webp',        anime: 'Naruto' },

  // ---- One Piece ----
  'Luffy':          { img: 'images/luffy.png',          anime: 'One Piece' },
  'Zoro':           { img: 'images/zoro.png',           anime: 'One Piece' },
  'Sanji':          { img: 'images/sanji.webp',         anime: 'One Piece' },
  'Nami':           { img: 'images/nami.jpg',           anime: 'One Piece' },
  'Nico Robin':     { img: 'images/nico-robin.png',     anime: 'One Piece' },
  'Boa Hancock':    { img: 'images/boa-hancock.jpg',    anime: 'One Piece' },

  // ---- Jujutsu Kaisen ----
  'Satoru Gojo':    { img: 'images/gojo.webp',          anime: 'Jujutsu Kaisen' },
  'Nanami':         { img: null,                         anime: 'Jujutsu Kaisen' },
  'Geto':           { img: 'images/geto.webp',          anime: 'Jujutsu Kaisen' },
  'Nobara Kugisaki':{ img: 'images/nobara.png',         anime: 'Jujutsu Kaisen' },
  'Maki Zenin':     { img: 'images/maki-zenin.jpeg',    anime: 'Jujutsu Kaisen' },

  // ---- Attack on Titan ----
  'Levi':           { img: 'images/levi.jpg',           anime: 'Attack on Titan' },
  'Mikasa Ackerman':{ img: 'images/mikasa.jpg',         anime: 'Attack on Titan' },
  'Historia Reiss': { img: 'images/historia.jpg',       anime: 'Attack on Titan' },
  'Sasha Braus':    { img: 'images/sasha.jpg',          anime: 'Attack on Titan' },

  // ---- Dragon Ball ----
  'Vegeta':         { img: null,                         anime: 'Dragon Ball Z' },

  // ---- Crossover Villains ----
  'Griffith':       { img: 'images/griffith.webp',      anime: 'Berserk' },
  'Dio':            { img: null,                         anime: "JoJo's Bizarre Adventure" },
  'Light Yagami':   { img: 'images/light-yagami.png',   anime: 'Death Note' },

  // ---- Re:Zero ----
  'Rem':            { img: 'images/rem.jpg',            anime: 'Re:Zero' },
  'Ram':            { img: 'images/ram.jpg',            anime: 'Re:Zero' },
  'Emilia':         { img: 'images/emilia.jpg',         anime: 'Re:Zero' },

  // ---- Demon Slayer ----
  'Nezuko Kamado':  { img: 'images/nezuko.jpeg',        anime: 'Demon Slayer' },

  // ---- Overlord ----
  'Albedo':         { img: 'images/albedo.jpg',         anime: 'Overlord' },
  'Shalltear':      { img: 'images/shalltear.jpeg',     anime: 'Overlord' },

  // ---- Darling in the Franxx ----
  'Zero Two':       { img: 'images/zero-two.jpg',       anime: 'Darling in the FranXX' },

  // ---- Spy x Family ----
  'Yor Forger':     { img: 'images/yor.jpg',            anime: 'Spy x Family' },

  // ---- Chainsaw Man ----
  'Makima':         { img: 'images/makima.jpg',         anime: 'Chainsaw Man' },

  // ---- Naruto (female) ----
  'Hinata Hyuga':   { img: 'images/hinata.jpg',         anime: 'Naruto' },
  'Sakura Haruno':  { img: 'images/sakura.jpg',         anime: 'Naruto' },
  'Tsunade':        { img: 'images/tsunade.jpg',        anime: 'Naruto' },

  // ---- My Hero Academia ----
  'Toga Himiko':    { img: 'images/toga.jpg',           anime: 'My Hero Academia' },

  // ---- Akame ga Kill ----
  'Esdeath':        { img: 'images/esdeath.jpg',        anime: 'Akame ga Kill' },

  // ---- Bleach ----
  'Orihime Inoue':  { img: 'images/orihime.jpg',        anime: 'Bleach' },

  // ---- Pokémon ----
  'Serena':         { img: 'images/serena.jpg',         anime: 'Pokémon' },
};
