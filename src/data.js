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
      { round: '⚓ One Piece', characters: ['Luffy', 'Zoro', 'Sanji'] },
      { round: '👁️ Jujutsu Kaisen', characters: ['Satoru Gojo', 'Nanami', 'Geto'] },
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
      { round: '🔥 Naruto Villains', characters: ['Madara', 'Pain', 'Obito'] },
      { round: '💀 Crossover Evil', characters: ['Griffith', 'Dio', 'Light Yagami'] },
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
      { round: '⚡ Icons Collide', characters: ['Levi', 'Vegeta', 'Itachi'] },
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

// ============= EYES GUESS PACKS =============
export const eyesPacks = [
  {
    id: 'female-eyes-1',
    title: 'Female Characters',
    pack: 'Pack 1',
    emoji: '👁️',
    description: 'Identify these female characters by their eyes alone',
    tags: ['Female'],
    accent: 'pink',
    folder: 'Anime Female Characters by eyes',
    pairCount: 8,
  },
  {
    id: 'male-eyes-1',
    title: 'Male Characters',
    pack: 'Pack 1',
    emoji: '👁️',
    description: 'Identify these male characters by their eyes alone',
    tags: ['Male'],
    accent: 'blue',
    folder: 'Anime Male Characters by eyes',
    pairCount: 8,
  },
  {
    id: 'female-eyes-2',
    title: 'Female Characters',
    pack: 'Pack 2',
    emoji: '🎯',
    description: 'Harder pack — more female characters to identify',
    tags: ['Female'],
    accent: 'purple',
    folder: 'Guess Female Anime characters by eyes',
    pairCount: 9,
  },
  {
    id: 'male-eyes-2',
    title: 'Male Characters',
    pack: 'Pack 2',
    emoji: '🎯',
    description: 'Level up — trickier male characters to guess',
    tags: ['Male'],
    accent: 'green',
    folder: 'Guess Male Anime characters by eyes',
    pairCount: 10,
  },
  {
    id: 'anime-eyes-1',
    title: 'Anime Characters',
    pack: 'Pack 1',
    emoji: '👁️',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 1',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-2',
    title: 'Anime Characters',
    pack: 'Pack 2',
    emoji: '🎯',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 2',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-3',
    title: 'Anime Characters',
    pack: 'Pack 3',
    emoji: '👁️',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 3',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-4',
    title: 'Anime Characters',
    pack: 'Pack 4',
    emoji: '🎯',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 4',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-5',
    title: 'Anime Characters',
    pack: 'Pack 5',
    emoji: '👁️',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 5',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-6',
    title: 'Anime Characters',
    pack: 'Pack 6',
    emoji: '🎯',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 6',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-7',
    title: 'Anime Characters',
    pack: 'Pack 7',
    emoji: '👁️',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 7',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-8',
    title: 'Anime Characters',
    pack: 'Pack 8',
    emoji: '🎯',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 8',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-9',
    title: 'Anime Characters',
    pack: 'Pack 9',
    emoji: '👁️',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 9',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-10',
    title: 'Anime Characters',
    pack: 'Pack 10',
    emoji: '🎯',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 10',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-11',
    title: 'Anime Characters',
    pack: 'Pack 11',
    emoji: '👁️',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 11',
    pairCount: 5,
  },
  {
    id: 'anime-eyes-12',
    title: 'Anime Characters',
    pack: 'Pack 12',
    emoji: '🎯',
    description: 'Identify these anime characters by their eyes alone',
    tags: ['Mixed'],
    accent: 'orange',
    folder: 'anime characters by looking at eyes 12',
    pairCount: 4,
  },
];

// ============= QUESTION BANK =============
export const QBANK_CATEGORIES = ['All', 'Controversial', 'Power Scaling', 'Industry', 'General'];

export const qbankQuestions = [
  { id: 1, text: 'Are long running anime better than shorter anime in the recent era?', category: 'Industry', viral: true },
  { id: 2, text: 'Why does Rent-a-Girlfriend have so many seasons?', category: 'Controversial', viral: true },
  { id: 3, text: 'Do you think fanservice in anime should be decreased?', category: 'Controversial', viral: true },
  { id: 4, text: 'Which is better — a weaker protagonist or one who is the strongest in their own verse?', category: 'Power Scaling', viral: false },
  { id: 5, text: 'What is your favorite genre in anime?', category: 'General', viral: false },
  { id: 6, text: 'Who is more powerful — Saitama or Goku?', category: 'Power Scaling', viral: true },
  { id: 7, text: 'Is anime becoming too mainstream?', category: 'Controversial', viral: true },
  { id: 8, text: 'Do you like younger protagonists or adult protagonists?', category: 'General', viral: false },
  { id: 9, text: 'Who is the best girl in Rent-a-Girlfriend — Chizuru, Ruka, Sumi, or Mami?', category: 'Controversial', viral: true },
  { id: 10, text: 'Did Solo Leveling deserve Anime of the Year over Frieren at the Crunchyroll Awards?', category: 'Controversial', viral: true },
  { id: 11, text: "Is JJK Season 3's Maki episode peak cinema or style over substance?", category: 'Controversial', viral: true },
  { id: 12, text: 'Should anime studios be allowed to use AI in their production pipeline?', category: 'Industry', viral: true },
  { id: 13, text: 'One Piece female designs — Sexist or Art Style?', category: 'Controversial', viral: true },
  { id: 14, text: 'Should manhwa and web novels from Korea or China even be adapted into anime?', category: 'Industry', viral: true },
  { id: 15, text: 'Crunchyroll — Monopoly or Necessity?', category: 'Industry', viral: true },
  { id: 16, text: 'JJK female characters — Wasted or Fine?', category: 'Controversial', viral: true },
  { id: 17, text: 'Demon Slayer — Overrated or Deserved?', category: 'Controversial', viral: true },
  { id: 18, text: 'Mushoku Tensei — Masterpiece or Garbage?', category: 'Controversial', viral: true },
  { id: 19, text: 'Old anime vs New anime — which wins?', category: 'Controversial', viral: true },
  { id: 20, text: 'Anime industry — Exploitative or Fair?', category: 'Industry', viral: true },
  { id: 21, text: 'Manhwa adaptations — Yes or No?', category: 'Industry', viral: true },
  { id: 22, text: 'Dub watchers — Disrespectful or Valid?', category: 'Controversial', viral: true },
  { id: 23, text: 'Isekai — Creative or Lazy?', category: 'Controversial', viral: true },
  { id: 24, text: 'Anime-only fans — Equal or Lesser?', category: 'Controversial', viral: true },
  { id: 25, text: 'Blue Lock — Peak or Overrated?', category: 'Controversial', viral: true },
  { id: 26, text: 'Dandadan — Genius or Fanservice?', category: 'Controversial', viral: true },
  { id: 27, text: 'Gojo\'s death — Right or Wrong?', category: 'Controversial', viral: true },
  { id: 28, text: 'One Piece — Worth starting or Skip?', category: 'General', viral: true },
  { id: 29, text: 'AOT ending — Satisfying or Disappointing?', category: 'Controversial', viral: true },
  { id: 30, text: 'Naruto vs Bleach — who wins?', category: 'Controversial', viral: true },
  { id: 31, text: 'Studio MAPPA — Saving anime or Destroying it?', category: 'Industry', viral: true },
  { id: 32, text: 'Filler episodes — Necessary or Ruinous?', category: 'General', viral: false },
  { id: 33, text: 'Chainsaw Man anime — Hit or Flop?', category: 'Controversial', viral: true },
  { id: 34, text: 'Spoilers in comments — Acceptable or Criminal?', category: 'General', viral: true },
  { id: 35, text: 'Pirating anime — Justified or Wrong?', category: 'Industry', viral: true },
  { id: 36, text: 'would you rather watch Dub forever OR no new anime ever?', category: 'General', viral: true },
  { id: 37, text: 'would you rather have MAPPA animates everything OR Toei animates everything?', category: 'Industry', viral: true },
  { id: 38, text: "would you rather have Gojo's Infinity OR Luffy's Gear 5?", category: 'Power', viral: true },
  { id: 39, text: 'would you rather have Sharingan OR Nen?', category: 'Power', viral: true },
  { id: 40, text: 'would you rather save Neji OR save Ace?', category: 'Characters', viral: true },
  { id: 41, text: 'would you rather Devil Fruit but never swim OR stay normal forever?', category: 'Power', viral: true },
  { id: 42, text: 'would you rather be strongest in Naruto world alone OR average with the Straw Hats?', category: 'General', viral: true },
  { id: 43, text: 'would you rather join UA High with no Quirk OR join Hogwarts with no magic?', category: 'General', viral: true },
  { id: 44, text: 'would you rather know every spoiler forever OR miss every anime premiere?', category: 'General', viral: true },
  { id: 45, text: 'would you rather spawn in AoT world OR Berserk world?', category: 'General', viral: true },
];

// ============= ALL CHARACTERS =============
export const chars = {
  // ---- Naruto ----
  'Naruto': { img: 'images/Naruto Uzumaki.jpg', anime: 'Naruto' },
  'Sasuke': { img: 'images/Sasuke Uchiha.png', anime: 'Naruto' },
  'Kakashi': { img: 'images/Kakashi Hatake.webp', anime: 'Naruto' },
  'Madara': { img: 'images/Madara Uchiha.avif', anime: 'Naruto' },
  'Pain': { img: 'images/Pain.png', anime: 'Naruto' },
  'Obito': { img: 'images/Obito Uchiha.png', anime: 'Naruto' },
  'Itachi': { img: 'images/Itachi Uchiha.webp', anime: 'Naruto' },

  // ---- One Piece ----
  'Luffy': { img: 'images/Monkey D. Luffy.png', anime: 'One Piece' },
  'Zoro': { img: 'images/Roronoa Zoro.png', anime: 'One Piece' },
  'Sanji': { img: 'images/Sanji.webp', anime: 'One Piece' },
  'Nami': { img: 'images/Nami.webp', anime: 'One Piece' },
  'Nico Robin': { img: 'images/Nico Robin.png', anime: 'One Piece' },
  'Boa Hancock': { img: 'images/Boa Hancock.jpg', anime: 'One Piece' },

  // ---- Jujutsu Kaisen ----
  'Satoru Gojo': { img: 'images/Satoru Gojo.webp', anime: 'Jujutsu Kaisen' },
  'Nanami': { img: 'images/Nanami.jpg', anime: 'Jujutsu Kaisen' },
  'Geto': { img: 'images/Suguru Geto.webp', anime: 'Jujutsu Kaisen' },
  'Nobara Kugisaki': { img: 'images/Nobara Kugisaki.png', anime: 'Jujutsu Kaisen' },
  'Maki Zenin': { img: 'images/Maki Zenin.jpg', anime: 'Jujutsu Kaisen' },

  // ---- Attack on Titan ----
  'Levi': { img: 'images/Levi Ackerman.jpg', anime: 'Attack on Titan' },
  'Mikasa Ackerman': { img: 'images/Mikasa Ackerman.jpg', anime: 'Attack on Titan' },
  'Historia Reiss': { img: 'images/Historia Reiss.jpg', anime: 'Attack on Titan' },
  'Sasha Braus': { img: 'images/Sasha Braus.jpg', anime: 'Attack on Titan' },

  // ---- Dragon Ball ----
  'Vegeta': { img: 'images/Vegeta.jpg', anime: 'Dragon Ball Z' },

  // ---- Crossover Villains ----
  'Griffith': { img: 'images/Griffith.webp', anime: 'Berserk' },
  'Dio': { img: 'images/Dio Brando.jpeg', anime: "JoJo's Bizarre Adventure" },
  'Light Yagami': { img: 'images/Light Yagami.png', anime: 'Death Note' },

  // ---- Re:Zero ----
  'Rem': { img: 'images/Rem.jpg', anime: 'Re:Zero' },
  'Ram': { img: 'images/Ram.jpg', anime: 'Re:Zero' },
  'Emilia': { img: 'images/Emilia.jpg', anime: 'Re:Zero' },

  // ---- Demon Slayer ----
  'Nezuko Kamado': { img: 'images/Nezuko Kamado.jpg', anime: 'Demon Slayer' },

  // ---- Overlord ----
  'Albedo': { img: 'images/Albedo.jpeg', anime: 'Overlord' },
  'Shalltear': { img: 'images/Shalltear Bloodfallen.jpg', anime: 'Overlord' },

  // ---- Darling in the Franxx ----
  'Zero Two': { img: 'images/Zero Two.jpg', anime: 'Darling in the FranXX' },

  // ---- Spy x Family ----
  'Yor Forger': { img: 'images/Yor Forger.jpg', anime: 'Spy x Family' },

  // ---- Chainsaw Man ----
  'Makima': { img: 'images/Makima.jpg', anime: 'Chainsaw Man' },

  // ---- Naruto (female) ----
  'Hinata Hyuga': { img: 'images/Hinata Hyuga.jpg', anime: 'Naruto' },
  'Sakura Haruno': { img: 'images/Sakura Haruno.jpg', anime: 'Naruto' },
  'Tsunade': { img: 'images/Tsunade.jpg', anime: 'Naruto' },

  // ---- My Hero Academia ----
  'Toga Himiko': { img: 'images/Toga Himiko.jpg', anime: 'My Hero Academia' },

  // ---- Akame ga Kill ----
  'Esdeath': { img: 'images/Esdeath.jpg', anime: 'Akame ga Kill' },

  // ---- Bleach ----
  'Orihime Inoue': { img: 'images/Orihime Inoue.jpg', anime: 'Bleach' },

  // ---- Pokémon ----
  'Serena': { img: 'images/Serena.jpg', anime: 'Pokémon' },
};
