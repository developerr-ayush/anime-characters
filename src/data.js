// ============= EYES GUESS SOURCES =============
// Raw pair-image folders. The game pools every pair across all of these
// and deals a random subset each playthrough — no separate pack picker.
export const eyesSources = [
  { folder: 'Anime Female Characters by eyes', pairCount: 8 },
  { folder: 'Anime Male Characters by eyes', pairCount: 8 },
  { folder: 'Guess Female Anime characters by eyes', pairCount: 9 },
  { folder: 'Guess Male Anime characters by eyes', pairCount: 10 },
  { folder: 'anime characters by looking at eyes 1', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 2', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 3', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 4', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 5', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 6', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 7', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 8', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 9', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 10', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 11', pairCount: 5 },
  { folder: 'anime characters by looking at eyes 12', pairCount: 4 },
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
  { id: 36, text: 'would you rather watch Dub forever OR no new anime ever?', category: 'Would You Rather', viral: true },
  { id: 37, text: 'would you rather have MAPPA animates everything OR Toei animates everything?', category: 'Would You Rather', viral: true },
  { id: 38, text: "would you rather have Gojo's Infinity OR Luffy's Gear 5?", category: 'Would You Rather', viral: true },
  { id: 39, text: 'would you rather have Sharingan OR Nen?', category: 'Would You Rather', viral: true },
  { id: 40, text: 'would you rather save Neji OR save Ace?', category: 'Would You Rather', viral: true },
  { id: 41, text: 'would you rather Devil Fruit but never swim OR stay normal forever?', category: 'Would You Rather', viral: true },
  { id: 42, text: 'would you rather be strongest in Naruto world alone OR average with the Straw Hats?', category: 'Would You Rather', viral: true },
  { id: 43, text: 'would you rather join UA High with no Quirk OR join Hogwarts with no magic?', category: 'Would You Rather', viral: true },
  { id: 44, text: 'would you rather know every spoiler forever OR miss every anime premiere?', category: 'Would You Rather', viral: true },
  { id: 45, text: 'would you rather spawn in AoT world OR Berserk world?', category: 'Would You Rather', viral: true },
];

// ============= ALL CHARACTERS =============
export const chars = {
  // ---- Naruto ----
  'Naruto': { img: 'images/Naruto.jpg', anime: 'Naruto' },
  'Sasuke': { img: 'images/Sasuke Uchiha.jpg', anime: 'Naruto' },
  'Kakashi': { img: 'images/Kakashi Hatake.jpg', anime: 'Naruto' },
  'Madara': { img: 'images/Madara Uchiha.avif', anime: 'Naruto' },
  'Pain': { img: 'images/Pain.jpg', anime: 'Naruto' },
  'Obito': { img: 'images/Obito Uchiha.png', anime: 'Naruto' },
  'Itachi': { img: 'images/Itachi Uchiha.webp', anime: 'Naruto' },

  // ---- One Piece ----
  'Luffy': { img: 'images/Monkey D. Luffy.png', anime: 'One Piece' },
  'Zoro': { img: 'images/Roronoa Zoro.png', anime: 'One Piece' },
  'Sanji': { img: 'images/Sanji.jpg', anime: 'One Piece' },
  'Nami': { img: 'images/Nami.jpg', anime: 'One Piece' },
  'Nico Robin': { img: 'images/Nico Robin.png', anime: 'One Piece' },
  'Boa Hancock': { img: 'images/Boa Hancock.jpg', anime: 'One Piece' },

  // ---- Jujutsu Kaisen ----
  'Satoru Gojo': { img: 'images/Satoru Gojo.webp', anime: 'Jujutsu Kaisen' },
  'Nanami': { img: 'images/Nanami.jpg', anime: 'Jujutsu Kaisen' },
  'Geto': { img: 'images/Suguru Geto.webp', anime: 'Jujutsu Kaisen' },
  'Nobara Kugisaki': { img: 'images/Nobara Kugisaki.png', anime: 'Jujutsu Kaisen' },
  'Maki Zenin': { img: 'images/Maki Zenin.jpg', anime: 'Jujutsu Kaisen' },

  // ---- Attack on Titan ----
  'Levi': { img: 'images/Levi.jpg', anime: 'Attack on Titan' },
  'Mikasa Ackerman': { img: 'images/Mikasa.jpg', anime: 'Attack on Titan' },
  'Historia Reiss': { img: 'images/Historia Reiss.jpg', anime: 'Attack on Titan' },
  'Sasha Braus': { img: 'images/Sasha Braus.jpg', anime: 'Attack on Titan' },

  // ---- Dragon Ball ----
  'Vegeta': { img: 'images/Vegeta.jpg', anime: 'Dragon Ball Z' },

  // ---- Crossover Villains ----
  'Griffith': { img: 'images/Griffith.jpg', anime: 'Berserk' },
  'Dio': { img: 'images/Dio Brando.jpeg', anime: "JoJo's Bizarre Adventure" },
  'Light Yagami': { img: 'images/Light Yagami.jpg', anime: 'Death Note' },

  // ---- Re:Zero ----
  'Rem': { img: 'images/Rem.jpg', anime: 'Re:Zero' },
  'Ram': { img: 'images/Ram.jpg', anime: 'Re:Zero' },
  'Emilia': { img: 'images/Emilia.jpg', anime: 'Re:Zero' },

  // ---- Demon Slayer ----
  'Nezuko Kamado': { img: 'images/nezuko kamado.jpg', anime: 'Demon Slayer' },
  'Zenitsu Agatsuma': { img: 'images/Zenitsu.jpg', anime: 'Demon Slayer' },
  'Inosuke Hashibira': { img: 'images/inosuke.png', anime: 'Demon Slayer' },
  'Giyuu Tomioka': { img: 'images/𝐓𝐨𝐦𝐢𝐨𝐤𝐚 𝐆𝐢𝐲𝐮𝐮.jpg', anime: 'Demon Slayer' },
  'Kyojuro Rengoku': { img: 'images/Kyojuro Rengoku.webp', anime: 'Demon Slayer' },
  'Shinobu Kocho': { img: 'images/Shinobu Kocho.jpg', anime: 'Demon Slayer' },
  'Mitsuri Kanroji': { img: 'images/KANROJI MITSURI.jpg', anime: 'Demon Slayer' },
  'Kanao Tsuyuri': { img: 'images/Kanao Tsuyuri.webp', anime: 'Demon Slayer' },
  'Muichiro Tokito': { img: 'images/Muichiro Tokito.jpg', anime: 'Demon Slayer' },

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
  'Hinata Hyuga': { img: 'images/Hinata.jpg', anime: 'Naruto' },
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

  // ---- Dragon Ball ----
  'Goku': { img: 'images/Goku.jpg', anime: 'Dragon Ball Z' },
  'Bulma': { img: 'images/Bulma.jpg', anime: 'Dragon Ball' },
  'Beerus': { img: 'images/Beerus.jpg', anime: 'Dragon Ball Super' },
  'Frieza': { img: 'images/Frieza.jpg', anime: 'Dragon Ball Z' },
  'Cell': { img: 'images/Cell DBZ.jpg', anime: 'Dragon Ball Z' },
  'Jiren': { img: 'images/Jiren.jpg', anime: 'Dragon Ball Super' },

  // ---- Naruto (more) ----
  'Gaara': { img: 'images/Gara naruto.jpg', anime: 'Naruto' },
  'Ino Yamanaka': { img: 'images/Ino Yamanaka .jpg', anime: 'Naruto' },
  'Jiraiya': { img: 'images/Jiraiya.jpg', anime: 'Naruto' },

  // ---- Jujutsu Kaisen (more) ----
  'Yuji Itadori': { img: 'images/Itadori yuuji.jpg', anime: 'Jujutsu Kaisen' },
  'Ryomen Sukuna': { img: 'images/Sukuna.jpg', anime: 'Jujutsu Kaisen' },

  // ---- My Hero Academia (more) ----
  'Izuku Midoriya': { img: 'images/Izuku Midoriya.png', anime: 'My Hero Academia' },
  'Katsuki Bakugo': { img: 'images/Katsuki Bakugo.avif', anime: 'My Hero Academia' },
  'Shoto Todoroki': { img: 'images/Shoto Todoroki.jpg', anime: 'My Hero Academia' },
  'Midnight': { img: 'images/Midnight.jpg', anime: 'My Hero Academia' },

  // ---- Spy x Family (more) ----
  'Anya Forger': { img: 'images/Anya Forger.avif', anime: 'Spy x Family' },
  'Loid Forger': { img: 'images/Loid Forger.webp', anime: 'Spy x Family' },

  // ---- Chainsaw Man (more) ----
  'Reze': { img: 'images/Reze.jpg', anime: 'Chainsaw Man' },

  // ---- Mushoku Tensei ----
  'Rudeus Greyrat': { img: 'images/𝙍𝙪𝙙𝙚𝙪𝙨 𝙂𝙧𝙚𝙮𝙧𝙖𝙩.jpg', anime: 'Mushoku Tensei' },
  'Roxy Migurdia': { img: 'images/Roxy Migurdia.jpg', anime: 'Mushoku Tensei' },
  'Sylphiette': { img: 'images/Sylphiette.jpg', anime: 'Mushoku Tensei' },

  // ---- Re:Zero (more) ----
  'Subaru Natsuki': { img: 'images/subaru natsuki.jpg', anime: 'Re:Zero' },

  // ---- Death Note (more) ----
  'L': { img: 'images/L (Death Note).jpg', anime: 'Death Note' },

  // ---- Bleach (more) ----
  'Toshiro Hitsugaya': { img: 'images/Toshiro Hitsugaya.webp', anime: 'Bleach' },

  // ---- Future Diary ----
  'Yuno Gasai': { img: 'images/Yuno Gasai.jpg', anime: 'Future Diary' },

  // ---- Solo Leveling ----
  'Sung Jin-Woo': { img: 'images/Sung Jin Woo.jpg', anime: 'Solo Leveling' },

  // ---- Your Lie in April ----
  'Kousei Arima': { img: 'images/Kōsei Arima.jpg', anime: 'Your Lie in April' },

  // ---- The Apothecary Diaries ----
  'Maomao': { img: 'images/Maomao.jpg', anime: 'The Apothecary Diaries' },

  // ---- My Dress-Up Darling ----
  'Marin Kitagawa': { img: 'images/Marin kitagawa.jpg', anime: 'My Dress-Up Darling' },

  // ---- Attack on Titan (more) ----
  'Eren Yeager': { img: 'images/eren.jpg', anime: 'Attack on Titan' },
};
