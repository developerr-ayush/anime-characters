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
  { id: 1,  text: 'Are long running anime better than shorter anime in the recent era?',                                                                           category: 'Industry',      viral: true  },
  { id: 2,  text: 'Why does Rent-a-Girlfriend have so many seasons?',                                                                                              category: 'Controversial', viral: true  },
  { id: 3,  text: 'Do you think fanservice in anime should be decreased?',                                                                                         category: 'Controversial', viral: true  },
  { id: 4,  text: 'Which is better — a weaker protagonist or one who is the strongest in their own verse?',                                                        category: 'Power Scaling', viral: false },
  { id: 5,  text: 'What is your favorite genre in anime?',                                                                                                         category: 'General',       viral: false },
  { id: 6,  text: 'Who is more powerful — Saitama or Goku?',                                                                                                      category: 'Power Scaling', viral: true  },
  { id: 7,  text: 'Is anime becoming too mainstream?',                                                                                                             category: 'Controversial', viral: true  },
  { id: 8,  text: 'Do you like younger protagonists or adult protagonists?',                                                                                       category: 'General',       viral: false },
  { id: 9,  text: 'Who is the best girl in Rent-a-Girlfriend — Chizuru, Ruka, Sumi, or Mami?',                                                                   category: 'Controversial', viral: true  },
  { id: 10, text: 'Did Solo Leveling deserve Anime of the Year over Frieren at the Crunchyroll Awards?',                                                           category: 'Controversial', viral: true  },
  { id: 11, text: "Is JJK Season 3's Maki episode peak cinema or style over substance?",                                                                           category: 'Controversial', viral: true  },
  { id: 12, text: 'Should anime studios be allowed to use AI in their production pipeline?',                                                                       category: 'Industry',      viral: true  },
  { id: 13, text: 'Is One Piece sexist with the way it designs its female characters?',                                                                            category: 'Controversial', viral: true  },
  { id: 14, text: 'Should manhwa and web novels from Korea or China even be adapted into anime?',                                                                  category: 'Industry',      viral: true  },
  { id: 15, text: 'Is Crunchyroll destroying the anime community with its price hikes and monopoly?',                                                              category: 'Industry',      viral: true  },
  { id: 16, text: 'Did JJK completely waste its female characters like Nobara and Maki by the end?',                                                               category: 'Controversial', viral: true  },
  { id: 17, text: 'Is the anime adaptation always better than reading the manga or light novel?',                                                                  category: 'General',       viral: false },
  { id: 18, text: 'Should anime be strictly faithful to the source material or can studios innovate?',                                                             category: 'Industry',      viral: false },
  { id: 19, text: 'Is Demon Slayer just a pretty anime with zero substance, or does it actually deserve its hype?',                                                category: 'Controversial', viral: true  },
  { id: 20, text: 'Sub vs Dub — is watching dubbed anime actually disrespectful to the creators?',                                                                 category: 'Controversial', viral: true  },
  { id: 21, text: 'Is Mushoku Tensei a masterpiece or should it be cancelled for its problematic protagonist?',                                                    category: 'Controversial', viral: true  },
  { id: 22, text: 'Is isekai as a genre just lazy writing and wish fulfillment at this point?',                                                                    category: 'Controversial', viral: true  },
  { id: 23, text: 'Are anime-only watchers lesser fans than people who read the manga?',                                                                           category: 'Controversial', viral: true  },
  { id: 24, text: 'Old school anime era (Naruto, Bleach, DBZ) vs modern anime — which era was actually better?',                                                  category: 'Controversial', viral: true  },
  { id: 25, text: 'Is Blue Lock genuinely peak sports anime, or the most overrated show of the decade?',                                                           category: 'Controversial', viral: true  },
  { id: 26, text: 'Should manga readers be banned from anime discussion threads to prevent spoilers?',                                                             category: 'Industry',      viral: false },
  { id: 27, text: 'Is Dandadan the most creative anime in years, or is it just fanservice with a weird plot?',                                                     category: 'Controversial', viral: true  },
  { id: 28, text: 'The Demon Slayer creator didn\'t get paid fairly despite the franchise making billions — is the anime industry exploiting its creators?',       category: 'Industry',      viral: true  },
  { id: 29, text: 'Why are most romance anime just romance for lonely people?',                                                                                    category: 'Controversial', viral: true  },
  { id: 30, text: 'Who is your favourite male/female duo in anime?',                                                                                               category: 'General',       viral: false },
  { id: 31, text: 'What is one anime that is popular but still never gets talked about in general discussions?',                                                   category: 'General',       viral: false },
  { id: 32, text: 'What is one anime everyone loves that you genuinely couldn\'t get into?',                                                                       category: 'Controversial', viral: true  },
];

// ============= ALL CHARACTERS =============
export const chars = {
  // ---- Naruto ----
  'Naruto':         { img: 'images/Naruto Uzumaki.jpg', anime: 'Naruto' },
  'Sasuke':         { img: 'images/Sasuke Uchiha.png',        anime: 'Naruto' },
  'Kakashi':        { img: 'images/Kakashi Hatake.webp',       anime: 'Naruto' },
  'Madara':         { img: 'images/Madara Uchiha.avif',        anime: 'Naruto' },
  'Pain':           { img: 'images/Pain.png',                         anime: 'Naruto' },
  'Obito':          { img: 'images/Obito Uchiha.png',          anime: 'Naruto' },
  'Itachi':         { img: 'images/Itachi Uchiha.webp',        anime: 'Naruto' },

  // ---- One Piece ----
  'Luffy':          { img: 'images/Monkey D. Luffy.png',          anime: 'One Piece' },
  'Zoro':           { img: 'images/Roronoa Zoro.png',           anime: 'One Piece' },
  'Sanji':          { img: 'images/Sanji.webp',         anime: 'One Piece' },
  'Nami':           { img: 'images/Nami.webp',           anime: 'One Piece' },
  'Nico Robin':     { img: 'images/Nico Robin.png',     anime: 'One Piece' },
  'Boa Hancock':    { img: 'images/Boa Hancock.jpg',    anime: 'One Piece' },

  // ---- Jujutsu Kaisen ----
  'Satoru Gojo':    { img: 'images/Satoru Gojo.webp',          anime: 'Jujutsu Kaisen' },
  'Nanami':         { img: 'images/Nanami.jpg',                         anime: 'Jujutsu Kaisen' },
  'Geto':           { img: 'images/Suguru Geto.webp',          anime: 'Jujutsu Kaisen' },
  'Nobara Kugisaki':{ img: 'images/Nobara Kugisaki.png',         anime: 'Jujutsu Kaisen' },
  'Maki Zenin':     { img: 'images/Maki Zenin.jpg',    anime: 'Jujutsu Kaisen' },

  // ---- Attack on Titan ----
  'Levi':           { img: 'images/Levi Ackerman.jpg',           anime: 'Attack on Titan' },
  'Mikasa Ackerman':{ img: 'images/Mikasa Ackerman.jpg',         anime: 'Attack on Titan' },
  'Historia Reiss': { img: 'images/Historia Reiss.jpg',       anime: 'Attack on Titan' },
  'Sasha Braus':    { img: 'images/Sasha Braus.jpg',          anime: 'Attack on Titan' },

  // ---- Dragon Ball ----
  'Vegeta':         { img: 'images/Vegeta.jpg',                         anime: 'Dragon Ball Z' },

  // ---- Crossover Villains ----
  'Griffith':       { img: 'images/Griffith.webp',      anime: 'Berserk' },
  'Dio':            { img: 'images/Dio Brando.jpeg',                         anime: "JoJo's Bizarre Adventure" },
  'Light Yagami':   { img: 'images/Light Yagami.png',   anime: 'Death Note' },

  // ---- Re:Zero ----
  'Rem':            { img: 'images/Rem.jpg',            anime: 'Re:Zero' },
  'Ram':            { img: 'images/Ram.jpg',            anime: 'Re:Zero' },
  'Emilia':         { img: 'images/Emilia.jpg',         anime: 'Re:Zero' },

  // ---- Demon Slayer ----
  'Nezuko Kamado':  { img: 'images/Nezuko Kamado.jpg',        anime: 'Demon Slayer' },

  // ---- Overlord ----
  'Albedo':         { img: 'images/Albedo.jpeg',         anime: 'Overlord' },
  'Shalltear':      { img: 'images/Shalltear Bloodfallen.jpg',     anime: 'Overlord' },

  // ---- Darling in the Franxx ----
  'Zero Two':       { img: 'images/Zero Two.jpg',       anime: 'Darling in the FranXX' },

  // ---- Spy x Family ----
  'Yor Forger':     { img: 'images/Yor Forger.jpg',            anime: 'Spy x Family' },

  // ---- Chainsaw Man ----
  'Makima':         { img: 'images/Makima.jpg',         anime: 'Chainsaw Man' },

  // ---- Naruto (female) ----
  'Hinata Hyuga':   { img: 'images/Hinata Hyuga.jpg',         anime: 'Naruto' },
  'Sakura Haruno':  { img: 'images/Sakura Haruno.jpg',         anime: 'Naruto' },
  'Tsunade':        { img: 'images/Tsunade.jpg',        anime: 'Naruto' },

  // ---- My Hero Academia ----
  'Toga Himiko':    { img: 'images/Toga Himiko.jpg',           anime: 'My Hero Academia' },

  // ---- Akame ga Kill ----
  'Esdeath':        { img: 'images/Esdeath.jpg',        anime: 'Akame ga Kill' },

  // ---- Bleach ----
  'Orihime Inoue':  { img: 'images/Orihime Inoue.jpg',        anime: 'Bleach' },

  // ---- Pokémon ----
  'Serena':         { img: 'images/Serena.jpg',         anime: 'Pokémon' },
};
