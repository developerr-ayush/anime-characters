// ============= EYES GUESS FOLDER =============
// One eye-crop + one reveal photo per character, named to match the
// `chars` keys exactly: "Eye <Name>.png" and "<Name> (2).png".
export const EYES_FOLDER = 'Anime Characters By Their Eyes Random';

// ============= QUESTION BANK =============
export const QBANK_CATEGORIES = ['All', 'Power Scaling', 'Best Girl/Boy', 'Ships', 'Character Debate', 'Isekai', 'Fan Culture', 'Overrated/Underrated', 'General', 'Would You Rather'];

export const qbankQuestions = [
  { id: 1, text: 'Naruto vs Bleach — who wins?', category: 'Power Scaling', viral: true },
  { id: 2, text: "Who's more powerful — Saitama or Goku?", category: 'Power Scaling', viral: true },
  { id: 3, text: 'Gojo vs Naruto (Baryon Mode) — who takes it?', category: 'Power Scaling', viral: true },
  { id: 4, text: "Luffy's Gear 5 vs Goku's Ultra Instinct — who wins?", category: 'Power Scaling', viral: true },
  { id: 5, text: 'Itachi vs Madara — who was really stronger?', category: 'Power Scaling', viral: true },
  { id: 6, text: 'Is Saitama actually boring because he\'s too strong?', category: 'Power Scaling', viral: true },
  { id: 7, text: 'Who had the better redemption arc — Vegeta or Zuko?', category: 'Power Scaling', viral: true },
  { id: 8, text: 'Sharingan or Nen — which power system is actually better?', category: 'Power Scaling', viral: true },
  { id: 9, text: 'Best girl in Rent-a-Girlfriend — Chizuru, Ruka, Sumi, or Mami?', category: 'Best Girl/Boy', viral: true },
  { id: 10, text: 'Hinata or Sakura — who actually deserved Naruto?', category: 'Ships', viral: true },
  { id: 11, text: 'NaruSasu vs NaruHina — which relationship mattered more?', category: 'Ships', viral: true },
  { id: 12, text: 'Nezuko or Shinobu — who\'s the better Demon Slayer girl?', category: 'Best Girl/Boy', viral: true },
  { id: 13, text: 'Emilia or Rem — who should Subaru actually end up with?', category: 'Ships', viral: true },
  { id: 14, text: 'Was Gojo\'s death right or wrong for the story?', category: 'Character Debate', viral: true },
  { id: 15, text: 'Light Yagami — hero or villain?', category: 'Character Debate', viral: true },
  { id: 16, text: 'Is Eren Yeager a hero or the real villain of AOT?', category: 'Character Debate', viral: true },
  { id: 17, text: 'Was Itachi\'s sacrifice worth it, or was it bad writing?', category: 'Character Debate', viral: true },
  { id: 18, text: 'Sasuke — most overrated character in anime history?', category: 'Character Debate', viral: true },
  { id: 19, text: 'Is Rudeus from Mushoku Tensei too problematic to root for?', category: 'Isekai', viral: true },
  { id: 20, text: 'Is Subaru the best-written isekai protagonist, or just insufferable?', category: 'Isekai', viral: true },
  { id: 21, text: 'Konosuba vs Re:Zero — which isekai actually did the genre better?', category: 'Isekai', viral: true },
  { id: 22, text: 'Solo Leveling — is it even real isekai, or just a power fantasy?', category: 'Isekai', viral: true },
  { id: 23, text: 'Is "reborn as a noble/villainess" isekai just lazy writing at this point?', category: 'Isekai', viral: true },
  { id: 24, text: 'Isekai anime — creative genre or lazy writing?', category: 'Isekai', viral: true },
  { id: 25, text: 'Dub watchers — disrespectful or valid?', category: 'Fan Culture', viral: true },
  { id: 26, text: 'Hindi dub anime — cringe or underrated?', category: 'Fan Culture', viral: true },
  { id: 27, text: 'Anime-only fans — equal fans or lesser fans than manga readers?', category: 'Fan Culture', viral: true },
  { id: 28, text: 'Spoilers in comments — acceptable or criminal?', category: 'Fan Culture', viral: true },
  { id: 29, text: 'Is gatekeeping "true fans" from casual fans toxic or necessary?', category: 'Fan Culture', viral: true },
  { id: 30, text: 'Filler episodes — necessary pacing or pure ruin?', category: 'Fan Culture', viral: false },
  { id: 31, text: 'AOT ending — satisfying or disappointing?', category: 'Overrated/Underrated', viral: true },
  { id: 32, text: 'Did Solo Leveling deserve Anime of the Year over Frieren?', category: 'Overrated/Underrated', viral: true },
  { id: 33, text: 'Demon Slayer — overrated or deserved?', category: 'Overrated/Underrated', viral: true },
  { id: 34, text: 'Is Frieren actually boring, or peak "atmosphere over action"?', category: 'Overrated/Underrated', viral: true },
  { id: 35, text: 'Is Attack on Titan the most overrated anime of the decade?', category: 'Overrated/Underrated', viral: true },
  { id: 36, text: "Does One Piece's pacing make it unwatchable for new fans in 2026?", category: 'Overrated/Underrated', viral: true },
  { id: 37, text: 'Jujutsu Kaisen vs Chainsaw Man — which is the better "modern shonen"?', category: 'Overrated/Underrated', viral: true },
  { id: 38, text: 'Is Blue Lock actually peak sports anime or just overhyped?', category: 'Overrated/Underrated', viral: true },
  { id: 39, text: "Is JJK Season 3's Maki episode peak cinema or style over substance?", category: 'Overrated/Underrated', viral: true },
  { id: 40, text: 'Should fanservice in anime be reduced?', category: 'Character Debate', viral: true },
  { id: 41, text: "One Piece's female character designs — art style or sexist?", category: 'Character Debate', viral: true },
  { id: 42, text: "Are JJK's female characters wasted potential or handled fine?", category: 'Character Debate', viral: true },
  { id: 43, text: 'Old-school anime vs new-gen anime — which era actually wins?', category: 'General', viral: true },
  { id: 44, text: 'Would you rather watch dubbed anime forever or never get a new anime again?', category: 'Would You Rather', viral: true },
  { id: 45, text: 'Would you rather have every anime spoiled forever or miss every premiere?', category: 'Would You Rather', viral: true },
  { id: 46, text: "Would you rather have Gojo's Infinity or Luffy's Gear 5?", category: 'Would You Rather', viral: true },
  { id: 47, text: 'Would you rather be strongest in the Naruto world alone, or an average Straw Hat?', category: 'Would You Rather', viral: true },
  { id: 48, text: 'Would you rather join UA High with no Quirk or Hogwarts with no magic?', category: 'Would You Rather', viral: true },
  { id: 49, text: 'Would you rather save Neji or save Ace?', category: 'Would You Rather', viral: true },
  { id: 50, text: 'Would you rather have Devil Fruit powers but never swim again, or stay normal forever?', category: 'Would You Rather', viral: true },
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
  'Rem': { img: 'images/Rem Rezero.jpg', anime: 'Re:Zero' },
  'Ram': { img: 'images/Ram Rezero.jpg', anime: 'Re:Zero' },
  'Emilia': { img: 'images/Emilia Rezero.jpg', anime: 'Re:Zero' },

  // ---- Demon Slayer ----
  'Nezuko Kamado': { img: 'images/Nezuko Kamado.jpg', anime: 'Demon Slayer' },
  'Zenitsu Agatsuma': { img: 'images/Zenitsu.jpg', anime: 'Demon Slayer' },
  'Inosuke Hashibira': { img: 'images/inosuke.png', anime: 'Demon Slayer' },
  'Giyuu Tomioka': { img: 'images/Giyuu.jpg', anime: 'Demon Slayer' },
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
  'Makima': { img: 'images/Makima CSM.jpg', anime: 'Chainsaw Man' },

  // ---- Naruto (female) ----
  'Hinata Hyuga': { img: 'images/Hinata.jpg', anime: 'Naruto' },
  'Sakura Haruno': { img: 'images/Sakura Haruno.jpg', anime: 'Naruto' },
  'Tsunade': { img: 'images/Tsunade Naruto.jpg', anime: 'Naruto' },

  // ---- My Hero Academia ----
  'Toga Himiko': { img: 'images/Toga Himiko.jpg', anime: 'My Hero Academia' },

  // ---- Akame ga Kill ----
  'Esdeath': { img: 'images/Esdeath AGK.jpg', anime: 'Akame ga Kill' },

  // ---- Bleach ----
  'Orihime Inoue': { img: 'images/Orihime Inoue.jpg', anime: 'Bleach' },

  // ---- Pokémon ----
  'Serena': { img: 'images/Serena Pokemon.jpg', anime: 'Pokémon' },

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
  'Rudeus Greyrat': { img: 'images/Rudeus Greyrat.jpg', anime: 'Mushoku Tensei' },
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
  'Kousei Arima': { img: 'images/Kousei Arima.jpg', anime: 'Your Lie in April' },

  // ---- The Apothecary Diaries ----
  'Maomao': { img: 'images/Maomao.jpg', anime: 'The Apothecary Diaries' },

  // ---- My Dress-Up Darling ----
  'Marin Kitagawa': { img: 'images/Marin kitagawa.jpg', anime: 'My Dress-Up Darling' },

  // ---- Attack on Titan (more) ----
  'Eren Yeager': { img: 'images/eren.jpg', anime: 'Attack on Titan' },
};
