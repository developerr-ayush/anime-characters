import { EYES_FOLDER, chars, qbankQuestions, QBANK_CATEGORIES, POKEMON_FOLDER, pokemonList } from './data.js';

// ============= STATE =============
let dmkDeck          = [];
let dmkIdx           = 0;
const placements     = {};

// ============= ELEMENTS =============
const homeEl           = document.getElementById('home');
const gameEl            = document.getElementById('game');
const summaryEl        = document.getElementById('summary');
const eyesScreenEl     = document.getElementById('eyes-screen');
const eyesSummaryEl    = document.getElementById('eyes-summary');
const tinderScreenEl   = document.getElementById('tinder-screen');
const tinderSummaryEl  = document.getElementById('tinder-summary');
const pokeScreenEl     = document.getElementById('poke-screen');
const pokeSummaryEl    = document.getElementById('poke-summary');
const dmkStackEl       = document.getElementById('dmkStack');
const modeTitleEl      = document.getElementById('modeTitle');
const dmkCounterEl     = document.getElementById('dmkCounter');
const progressFillEl   = document.getElementById('progressFill');
const summaryContentEl = document.getElementById('summaryContent');
const playAgainBtn     = document.getElementById('playAgainBtn');
const qbankEl          = document.getElementById('qbank');
const statsScreenEl    = document.getElementById('statsScreen');

// ============= HELPERS =============
const initialsOf = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const safeImg    = (src)  => src ? encodeURI(src) : null;
const vibrate    = (ms = 14) => { try { navigator.vibrate?.(ms); } catch {} };

const AVATAR_GRADIENT = 'background: var(--color-surface-2)';
const TEXT_SHADOW_SOFT = 'text-shadow: 0 1px 8px rgba(0,0,0,0.8)';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const preloadedImages = new Set();

const preloadImage = (src) => {
  if (!src || preloadedImages.has(src)) return Promise.resolve();
  preloadedImages.add(src);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
};

function eyesImagePaths(name) {
  const base = EYES_FOLDER.split('/').map(encodeURIComponent).join('/');
  return {
    eye:  `${base}/${encodeURIComponent('Eye ' + name + '.png')}`,
    face: `${base}/${encodeURIComponent(name + ' (2).png')}`,
  };
}

function pokeImagePath(entry, kind) {
  const base = POKEMON_FOLDER.split('/').map(encodeURIComponent).join('/');
  return `${base}/${encodeURIComponent(entry[kind])}`;
}

function collectAllImageUrls() {
  const urls = new Set();
  Object.values(chars).forEach(c => {
    const src = safeImg(c?.img);
    if (src) urls.add(src);
  });
  Object.keys(chars).forEach(name => {
    const { eye, face } = eyesImagePaths(name);
    urls.add(eye);
    urls.add(face);
  });
  pokemonList.forEach(p => {
    urls.add(pokeImagePath(p, 'drawing'));
    urls.add(pokeImagePath(p, 'reveal'));
  });
  return [...urls];
}

function preloadAllImages() {
  const urls = collectAllImageUrls();
  return Promise.all(urls.map(preloadImage));
}

// ============= SCREEN MANAGEMENT =============
function showScreen(screen) {
  homeEl.classList.add('hidden');
  gameEl.classList.add('hidden');
  summaryEl.classList.add('hidden');
  eyesScreenEl.classList.add('hidden');
  eyesSummaryEl.classList.add('hidden');
  tinderScreenEl.classList.add('hidden');
  tinderSummaryEl.classList.add('hidden');
  pokeScreenEl.classList.add('hidden');
  pokeSummaryEl.classList.add('hidden');
  qbankEl.classList.add('hidden');
  statsScreenEl.classList.add('hidden');
  screen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============= HOME SCREEN =============
function showHome() {
  showScreen(homeEl);
}

// ============= HAMBURGER MENU =============
// Houses navigation (Home, jump-to-mode) and the shoot session controls, so
// every game screen — especially the ones being filmed — stays uncluttered.
const menuBtn      = document.getElementById('menuBtn');
const menuOverlay  = document.getElementById('menuOverlay');
const menuDrawer   = document.getElementById('menuDrawer');
const menuCloseBtn = document.getElementById('menuCloseBtn');
const menuHomeBtn  = document.getElementById('menuHomeBtn');
const menuStatsBtn = document.getElementById('menuStatsBtn');

function openMenu() {
  menuOverlay.classList.remove('hidden');
  menuDrawer.classList.remove('-translate-x-full');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuOverlay.classList.add('hidden');
  menuDrawer.classList.add('-translate-x-full');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openMenu);
menuCloseBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);
menuHomeBtn.addEventListener('click', () => { closeMenu(); showHome(); });
menuStatsBtn.addEventListener('click', () => { closeMenu(); showStatsScreen(); });

const MENU_NAV_STARTERS = { dmk: startDMK, eyes: startEyesGame, tinder: startTinder, poke: startPokeGame, qbank: startQbank };
document.querySelectorAll('.menu-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    closeMenu();
    MENU_NAV_STARTERS[btn.dataset.nav]?.();
  });
});

document.getElementById('dmkStartBtn').addEventListener('click', startDMK);
document.getElementById('eyesStartBtn').addEventListener('click', startEyesGame);
document.getElementById('qbankStartBtn').addEventListener('click', startQbank);
document.getElementById('tinderStartBtn').addEventListener('click', startTinder);
document.getElementById('pokeStartBtn').addEventListener('click', startPokeGame);

// ============= START DATE · MARRY · KILL =============
const DMK_TOTAL = 15;

function buildDmkDeck() {
  return shuffle(Object.keys(chars)).slice(0, DMK_TOTAL);
}

function startDMK() {
  dmkDeck = buildDmkDeck();
  dmkIdx  = 0;
  Object.keys(placements).forEach(k => delete placements[k]);

  modeTitleEl.textContent = '💕 Date · Marry · Kill';
  showScreen(gameEl);
  renderDmkCard();
}

// ============= ZONE META =============
const ZONE_META = {
  date:  { emoji: '💕', label: 'Date',  color: 'text-gold' },
  marry: { emoji: '💍', label: 'Marry', color: 'text-green' },
  kill:  { emoji: '💀', label: 'Kill',  color: 'text-red' },
};

const DMK_KILL_BTN  = document.getElementById('dmkKillBtn');
const DMK_MARRY_BTN = document.getElementById('dmkMarryBtn');
const DMK_DATE_BTN  = document.getElementById('dmkDateBtn');
const DMK_ZONE_BTNS = { kill: DMK_KILL_BTN, marry: DMK_MARRY_BTN, date: DMK_DATE_BTN };

// ============= RENDER CARD (flat deck — no trio grouping, every verdict is reusable) =============
function renderDmkCard() {
  dmkCounterEl.textContent   = `${dmkIdx + 1} / ${dmkDeck.length}`;
  progressFillEl.style.width = `${(dmkIdx / dmkDeck.length) * 100}%`;
  renderCardStack();
}

function renderCardStack() {
  const visible = dmkDeck.slice(dmkIdx, dmkIdx + 3);

  dmkStackEl.innerHTML = visible.map((name, idx) => {
    const c        = chars[name];
    const fallback = initialsOf(name);
    const imgSrc   = c && c.img ? safeImg(c.img) : null;
    const imgHtml  = imgSrc
      ? `<img class="w-full h-full object-cover" src="${imgSrc}" alt="${name}" draggable="false"
              onerror="this.outerHTML='<div class=&quot;w-full h-full flex items-center justify-center font-bold text-white text-2xl&quot; style=&quot;${AVATAR_GRADIENT}&quot;>${fallback}</div>'">`
      : `<div class="w-full h-full flex items-center justify-center font-bold text-white text-2xl" style="${AVATAR_GRADIENT}">${fallback}</div>`;
    const isTop = idx === 0;

    return `
      <div class="dmk-card absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-surface select-none anim-card-enter ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}"
           style="transform: translateY(${idx * 10}px) scale(${1 - idx * 0.04}); z-index:${10 - idx}"
           data-name="${name}" ${isTop ? 'data-top="true"' : ''}>
        ${imgHtml}
        <div class="absolute inset-x-0 bottom-0 pt-10 px-3 pb-3 pointer-events-none" style="background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)">
          <div class="text-sm font-bold leading-tight text-white">${name}</div>
          <div class="text-xs text-white/60 mt-0.5">${c ? c.anime : ''}</div>
        </div>
        ${isTop ? `
          <div class="absolute top-6 left-6 px-3 py-1 rounded-lg border-[3px] border-red text-red font-black text-xl uppercase -rotate-12 opacity-0 pointer-events-none" id="dmkStampKill">Kill</div>
          <div class="absolute top-6 right-6 px-3 py-1 rounded-lg border-[3px] border-gold text-gold font-black text-xl uppercase rotate-12 opacity-0 pointer-events-none" id="dmkStampDate">Date</div>
          <div class="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg border-[3px] border-green text-green font-black text-xl uppercase opacity-0 pointer-events-none" id="dmkStampMarry">Marry</div>
        ` : ''}
      </div>
    `;
  }).join('');

  attachDmkSwipeHandlers();
}

// ============= SWIPE TO CHOOSE (left = kill, right = date, up = marry) =============
let dmkSwipeStartX = null;
let dmkSwipeStartY = null;
let dmkSwipeDX = 0;
let dmkSwipeDY = 0;

function dmkDirectionForDrag() {
  const absX = Math.abs(dmkSwipeDX);
  const absY = Math.abs(dmkSwipeDY);
  if (absY > absX && dmkSwipeDY < 0) return { zone: 'marry', pull: Math.min(absY / SWIPE_THRESHOLD, 1) };
  if (dmkSwipeDX > 0)                return { zone: 'date',  pull: Math.min(absX / SWIPE_THRESHOLD, 1) };
  if (dmkSwipeDX < 0)                return { zone: 'kill',  pull: Math.min(absX / SWIPE_THRESHOLD, 1) };
  return { zone: null, pull: 0 };
}

function dmkResetStamps() {
  ['dmkStampKill', 'dmkStampDate', 'dmkStampMarry'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.opacity = '0';
  });
}

function onDmkSwipeMove(card, clientX, clientY) {
  if (dmkSwipeStartX === null) return;
  dmkSwipeDX = clientX - dmkSwipeStartX;
  dmkSwipeDY = clientY - dmkSwipeStartY;
  const rotate = dmkSwipeDX / 18;
  card.style.transform = `translate(${dmkSwipeDX}px, ${dmkSwipeDY}px) rotate(${rotate}deg)`;

  const { zone, pull } = dmkDirectionForDrag();
  dmkResetStamps();
  if (zone === 'marry') document.getElementById('dmkStampMarry').style.opacity = String(pull);
  if (zone === 'date')  document.getElementById('dmkStampDate').style.opacity  = String(pull);
  if (zone === 'kill')  document.getElementById('dmkStampKill').style.opacity  = String(pull);
}

function endDmkSwipe(card) {
  if (dmkSwipeStartX === null) return;
  card.style.transition = 'transform 0.25s ease';

  const { zone, pull } = dmkDirectionForDrag();
  const name = card.dataset.name;

  if (zone && pull >= 1) {
    const fly = zone === 'marry'
      ? 'translate(0px, -900px) rotate(0deg)'
      : zone === 'date'
        ? 'translate(700px, 60px) rotate(24deg)'
        : 'translate(-700px, 60px) rotate(-24deg)';
    card.style.transform = fly;
    setTimeout(() => commitDmkChoice(name, zone), 180);
  } else {
    card.style.transform = '';
    dmkResetStamps();
  }

  dmkSwipeStartX = null;
  dmkSwipeStartY = null;
  dmkSwipeDX = 0;
  dmkSwipeDY = 0;
}

function attachDmkSwipeHandlers() {
  const card = dmkStackEl.querySelector('.dmk-card[data-top="true"]');
  if (!card) return;

  card.addEventListener('pointerdown', e => {
    if (!e.isPrimary) return;
    e.preventDefault();
    dmkSwipeStartX = e.clientX;
    dmkSwipeStartY = e.clientY;
    card.style.transition = 'none';
    card.setPointerCapture(e.pointerId);
  });
  card.addEventListener('pointermove', e => onDmkSwipeMove(card, e.clientX, e.clientY));
  card.addEventListener('pointerup', () => endDmkSwipe(card));
  card.addEventListener('pointercancel', () => endDmkSwipe(card));
}

// ============= COMMIT A CHOICE (from swipe or tap) =============
function commitDmkChoice(name, zone) {
  placements[name] = zone;
  logShot('dmk', name, name, `${ZONE_META[zone].emoji} ${ZONE_META[zone].label}`);
  vibrate([10, 30, 10]);

  dmkIdx++;
  if (dmkIdx >= dmkDeck.length) {
    showSummary();
  } else {
    renderDmkCard();
  }
}

// ============= TAP FALLBACK BUTTONS =============
Object.entries(DMK_ZONE_BTNS).forEach(([zone, btn]) => {
  btn.addEventListener('click', () => {
    if (dmkIdx >= dmkDeck.length) return;
    commitDmkChoice(dmkDeck[dmkIdx], zone);
  });
});

playAgainBtn.addEventListener('click', startDMK);

// ============= SUMMARY =============
const VERDICT_META = {
  date:  { label: '💕 Date',  color: 'text-gold' },
  marry: { label: '💍 Marry', color: 'text-green' },
  kill:  { label: '💀 Kill',  color: 'text-red' },
};

function showSummary() {
  progressFillEl.style.width = '100%';
  showScreen(summaryEl);

  // Populate tally counts
  const counts = { date: 0, marry: 0, kill: 0 };
  Object.values(placements).forEach(v => counts[v]++);
  const tallyEl = document.getElementById('summaryTally');
  if (tallyEl) {
    tallyEl.innerHTML = `
      <div class="flex flex-col items-center gap-1 pt-4 px-3 pb-3.5 rounded-2xl bg-surface border border-white/10 text-center anim-card-enter" style="animation-delay:0.03s">
        <span class="text-xl leading-none">💕</span>
        <span class="text-[1.8rem] font-extrabold leading-none tracking-[-0.02em] text-gold">${counts.date}</span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Dated</span>
      </div>
      <div class="flex flex-col items-center gap-1 pt-4 px-3 pb-3.5 rounded-2xl bg-surface border border-white/10 text-center anim-card-enter" style="animation-delay:0.07s">
        <span class="text-xl leading-none">💍</span>
        <span class="text-[1.8rem] font-extrabold leading-none tracking-[-0.02em] text-green">${counts.marry}</span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Married</span>
      </div>
      <div class="flex flex-col items-center gap-1 pt-4 px-3 pb-3.5 rounded-2xl bg-surface border border-white/10 text-center anim-card-enter" style="animation-delay:0.11s">
        <span class="text-xl leading-none">💀</span>
        <span class="text-[1.8rem] font-extrabold leading-none tracking-[-0.02em] text-red">${counts.kill}</span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Killed</span>
      </div>
    `;
  }

  const byVerdict = { date: [], marry: [], kill: [] };
  Object.entries(placements).forEach(([name, verdict]) => {
    const c = chars[name] || {};
    byVerdict[verdict]?.push({ name, verdict, anime: c.anime || '', img: c.img || null });
  });

  let html = '';
  for (const verdict of ['date', 'marry', 'kill']) {
    const items = byVerdict[verdict];
    if (items.length === 0) continue;
    html += `
      <div class="mb-7">
        <div class="text-[11px] font-bold tracking-[0.12em] uppercase text-ink-faint pb-2 mb-2.5 border-b border-white/10">${VERDICT_META[verdict].label}</div>
        <div class="grid grid-cols-3 gap-2.5">
    `;
    items.forEach(item => {
      const v        = VERDICT_META[item.verdict];
      const fallback = initialsOf(item.name);
      const imgSrc   = item.img ? safeImg(item.img) : null;
      const imgHtml  = imgSrc
        ? `<img class="w-full h-full object-cover" src="${imgSrc}" alt="${item.name}"
                onerror="this.outerHTML='<div class=&quot;w-full h-full flex items-center justify-center font-bold text-white text-lg&quot; style=&quot;${AVATAR_GRADIENT}&quot;>${fallback}</div>'">`
        : `<div class="w-full h-full flex items-center justify-center font-bold text-white text-lg" style="${AVATAR_GRADIENT}">${fallback}</div>`;
      html += `
        <div class="summary-card relative rounded-xl overflow-hidden bg-surface border border-white/10 transition-colors duration-150">
          <span class="absolute top-1.5 left-1.5 z-10 px-2 py-[3px] rounded-full text-[10px] font-bold uppercase tracking-[0.05em] bg-black/70 ${v.color}">${v.label}</span>
          <div class="summary-card-img-wrap aspect-square overflow-hidden">${imgHtml}</div>
          <div class="px-2 pt-1.5 pb-2">
            <div class="text-xs font-bold text-ink leading-tight truncate">${item.name}</div>
            <div class="text-[10px] text-ink-faint mt-0.5 truncate">${item.anime}</div>
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
  }
  summaryContentEl.innerHTML = html;
}

// ============= EYES GAME =============
const EYES_ROUNDS = 10;

let activeEyesPairs = [];
let eyesIdx        = 0;
let eyesGot        = 0;
let eyesMissed     = 0;
let eyesRevealed   = false;
let eyesHintUsed   = false;

const eyesCounterEl  = document.getElementById('eyesCounter');
const eyesProgressEl = document.getElementById('eyesProgress');
const eyesMysteryTextEl = document.getElementById('eyesMysteryText');
const hintBtn        = document.getElementById('hintBtn');
const eyesCardEl     = document.getElementById('eyesCard');
const stampGotEl     = document.getElementById('stampGot');
const stampMissedEl  = document.getElementById('stampMissed');
const eyesLayerEl    = document.getElementById('eyesLayer');
const faceLayerEl    = document.getElementById('faceLayer');
const eyesImgEl      = document.getElementById('eyesImg');
const faceImgEl      = document.getElementById('faceImg');
const preRevealEl    = document.getElementById('preReveal');
const postRevealEl   = document.getElementById('postReveal');
const revealBtn      = document.getElementById('revealBtn');
const gotItBtn       = document.getElementById('gotItBtn');
const missedBtn      = document.getElementById('missedBtn');
const eyesPlayAgainBtn = document.getElementById('eyesPlayAgainBtn');
const eyesFinalGotEl    = document.getElementById('eyesFinalGot');
const eyesFinalMissedEl = document.getElementById('eyesFinalMissed');
const eyesSummaryTitleEl = document.getElementById('eyesSummaryTitle');
const eyesSummaryScoreEl = document.getElementById('eyesSummaryScore');
const eyesSummaryEmojiEl = document.getElementById('eyesSummaryEmoji');

function buildEyesPool() {
  const allPairs = Object.keys(chars).map(name => ({ name, ...eyesImagePaths(name) }));
  return shuffle(allPairs).slice(0, EYES_ROUNDS);
}

function startEyesGame() {
  activeEyesPairs = buildEyesPool();
  eyesIdx      = 0;
  eyesGot      = 0;
  eyesMissed   = 0;
  eyesRevealed = false;

  showScreen(eyesScreenEl);
  renderEyesCard();
}

function renderEyesCard() {
  const pair = activeEyesPairs[eyesIdx];

  eyesCounterEl.textContent  = `${eyesIdx + 1} / ${activeEyesPairs.length}`;
  eyesProgressEl.style.width = `${(eyesIdx / activeEyesPairs.length) * 100}%`;

  // Pre-load both images
  eyesImgEl.src = pair.eye;
  faceImgEl.src = pair.face;

  // Reset reveal + hint state
  eyesRevealed = false;
  eyesHintUsed = false;
  eyesMysteryTextEl.textContent = '👁️ Who is this?';
  hintBtn.disabled = false;
  eyesLayerEl.classList.remove('hidden');
  faceLayerEl.classList.add('hidden');
  preRevealEl.classList.remove('hidden');
  postRevealEl.classList.add('hidden');

  // Reset any leftover swipe transform/stamps from the previous card
  eyesCardEl.style.transition = 'none';
  eyesCardEl.style.transform  = '';
  stampGotEl.style.opacity    = '0';
  stampMissedEl.style.opacity = '0';
}

function showHint() {
  if (eyesHintUsed || eyesRevealed) return;
  eyesHintUsed = true;
  const pair = activeEyesPairs[eyesIdx];
  eyesMysteryTextEl.textContent = `🎬 ${chars[pair.name]?.anime ?? '?'}`;
  hintBtn.disabled = true;
  vibrate(8);
}

function revealEyes() {
  if (eyesRevealed) return;
  eyesRevealed = true;

  // Layer swap happens after a brief beat so the reveal reads as a moment,
  // not an instant snap.
  setTimeout(() => {
    eyesLayerEl.classList.add('hidden');
    faceLayerEl.classList.remove('hidden');
  }, 300);

  preRevealEl.classList.add('hidden');
  postRevealEl.classList.remove('hidden');
}

function scoreEyes(got) {
  const pair = activeEyesPairs[eyesIdx];
  logShot('eyes', pair.name, pair.name, got ? '✅ Got it' : '❌ Missed');

  if (got) eyesGot++; else eyesMissed++;

  vibrate(got ? [10, 30, 10] : [20]);

  eyesIdx++;

  if (eyesIdx >= activeEyesPairs.length) {
    showEyesSummary();
  } else {
    renderEyesCard();
  }
}

// ============= SWIPE TO SCORE (Tinder-style) =============
// Only active once the card is revealed — dragging the eye-only card
// would be ambiguous (that's what the Reveal button is for).
let swipeStartX  = null;
let swipeDeltaX  = 0;
const SWIPE_THRESHOLD = 90;

function onSwipeMove(clientX) {
  if (swipeStartX === null) return;
  swipeDeltaX = clientX - swipeStartX;
  const rotate = swipeDeltaX / 18;
  eyesCardEl.style.transform = `translateX(${swipeDeltaX}px) rotate(${rotate}deg)`;
  const pull = Math.min(Math.abs(swipeDeltaX) / SWIPE_THRESHOLD, 1);
  stampGotEl.style.opacity    = swipeDeltaX > 0 ? String(pull) : '0';
  stampMissedEl.style.opacity = swipeDeltaX < 0 ? String(pull) : '0';
}

function endSwipe() {
  if (swipeStartX === null) return;
  eyesCardEl.style.transition = 'transform 0.25s ease';

  if (swipeDeltaX > SWIPE_THRESHOLD) {
    eyesCardEl.style.transform = `translateX(700px) rotate(24deg)`;
    setTimeout(() => scoreEyes(true), 180);
  } else if (swipeDeltaX < -SWIPE_THRESHOLD) {
    eyesCardEl.style.transform = `translateX(-700px) rotate(-24deg)`;
    setTimeout(() => scoreEyes(false), 180);
  } else {
    eyesCardEl.style.transform = '';
    stampGotEl.style.opacity    = '0';
    stampMissedEl.style.opacity = '0';
  }
  swipeStartX = null;
  swipeDeltaX = 0;
}

eyesCardEl.addEventListener('pointerdown', e => {
  if (!eyesRevealed || !e.isPrimary) return;
  e.preventDefault(); // stop the browser's native image-drag ghost preview
  swipeStartX = e.clientX;
  eyesCardEl.style.transition = 'none';
  eyesCardEl.setPointerCapture(e.pointerId);
});
eyesCardEl.addEventListener('pointermove', e => {
  if (!eyesRevealed) return;
  onSwipeMove(e.clientX);
});
eyesCardEl.addEventListener('pointerup', endSwipe);
eyesCardEl.addEventListener('pointercancel', endSwipe);

function showEyesSummary() {
  eyesProgressEl.style.width = '100%';
  const total    = activeEyesPairs.length;
  const pct      = Math.round((eyesGot / total) * 100);
  const emoji    = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '😅';
  const title    = pct >= 80 ? 'Impressive!' : pct >= 50 ? 'Not Bad!' : 'Keep Practicing!';

  eyesSummaryEmojiEl.textContent = emoji;
  eyesSummaryTitleEl.textContent = title;
  eyesSummaryScoreEl.textContent = `You got ${eyesGot} out of ${total}`;
  eyesFinalGotEl.textContent     = eyesGot;
  eyesFinalMissedEl.textContent  = eyesMissed;

  showScreen(eyesSummaryEl);
}

revealBtn.addEventListener('click', revealEyes);
hintBtn.addEventListener('click', showHint);
gotItBtn.addEventListener('click', () => scoreEyes(true));
missedBtn.addEventListener('click', () => scoreEyes(false));
eyesPlayAgainBtn.addEventListener('click', startEyesGame);

// ============= ANIME TINDER =============
// Reuses the exact same vertical "reveal" cards from the Eyes game — they're
// already framed as name+anime cards, perfect for a swipe deck as-is.
const TINDER_ROUNDS = 15;

let tinderDeck    = [];
let tinderIdx     = 0;
let tinderMatches = [];

const tinderCounterEl  = document.getElementById('tinderCounter');
const tinderProgressEl = document.getElementById('tinderProgress');
const tinderCardEl     = document.getElementById('tinderCard');
const tinderImgEl      = document.getElementById('tinderImg');
const tinderStampPassEl  = document.getElementById('tinderStampPass');
const tinderStampSmashEl = document.getElementById('tinderStampSmash');
const tinderPassBtn    = document.getElementById('tinderPassBtn');
const tinderSmashBtn   = document.getElementById('tinderSmashBtn');
const tinderPlayAgainBtn = document.getElementById('tinderPlayAgainBtn');
const tinderSummaryScoreEl = document.getElementById('tinderSummaryScore');
const tinderMatchesGridEl  = document.getElementById('tinderMatchesGrid');

function startTinder() {
  tinderDeck    = shuffle(Object.keys(chars)).slice(0, TINDER_ROUNDS);
  tinderIdx     = 0;
  tinderMatches = [];
  preloadTinderDeck();
  showScreen(tinderScreenEl);
  renderTinderCard();
}

// Warm the browser's image cache for the whole deck up front — without this,
// each swipe sets tinderImgEl.src to an image that hasn't been fetched/decoded
// yet, so the *previous* card's pixels stay on screen for a split second while
// the next one loads.
function preloadTinderDeck() {
  tinderDeck.forEach(name => {
    const img = new Image();
    img.src = eyesImagePaths(name).face;
  });
}

function renderTinderCard() {
  const name = tinderDeck[tinderIdx];
  tinderCounterEl.textContent  = `${tinderIdx + 1} / ${tinderDeck.length}`;
  tinderProgressEl.style.width = `${(tinderIdx / tinderDeck.length) * 100}%`;
  tinderImgEl.src = eyesImagePaths(name).face;

  tinderCardEl.style.transition = 'none';
  tinderCardEl.style.transform  = '';
  tinderStampSmashEl.style.opacity = '0';
  tinderStampPassEl.style.opacity  = '0';
}

function judgeTinder(smash) {
  const name = tinderDeck[tinderIdx];
  if (smash) tinderMatches.push(name);
  logShot('tinder', name, name, smash ? '🔥 Smash' : '👋 Pass');

  vibrate(smash ? [10, 30, 10] : [20]);

  tinderIdx++;
  if (tinderIdx >= tinderDeck.length) {
    showTinderSummary();
  } else {
    renderTinderCard();
  }
}

function showTinderSummary() {
  tinderProgressEl.style.width = '100%';
  tinderSummaryScoreEl.textContent = `You matched with ${tinderMatches.length} out of ${tinderDeck.length}`;

  tinderMatchesGridEl.innerHTML = tinderMatches.length === 0
    ? `<div class="col-span-3 text-center py-11 px-5 text-ink-faint text-sm">
        <span class="block text-4xl mb-3">💔</span>
        No matches this round — everyone got the pass.
      </div>`
    : tinderMatches.map(name => `
        <div class="relative rounded-xl overflow-hidden bg-surface border border-white/10 aspect-[9/16]">
          <img class="w-full h-full object-cover" src="${eyesImagePaths(name).face}" alt="${name}">
        </div>
      `).join('');

  showScreen(tinderSummaryEl);
}

// Swipe to judge — active immediately, no reveal step (unlike Eyes game).
let tinderSwipeStartX = null;
let tinderSwipeDeltaX = 0;

function onTinderSwipeMove(clientX) {
  if (tinderSwipeStartX === null) return;
  tinderSwipeDeltaX = clientX - tinderSwipeStartX;
  const rotate = tinderSwipeDeltaX / 18;
  tinderCardEl.style.transform = `translateX(${tinderSwipeDeltaX}px) rotate(${rotate}deg)`;
  const pull = Math.min(Math.abs(tinderSwipeDeltaX) / SWIPE_THRESHOLD, 1);
  tinderStampSmashEl.style.opacity = tinderSwipeDeltaX > 0 ? String(pull) : '0';
  tinderStampPassEl.style.opacity  = tinderSwipeDeltaX < 0 ? String(pull) : '0';
}

function endTinderSwipe() {
  if (tinderSwipeStartX === null) return;
  tinderCardEl.style.transition = 'transform 0.25s ease';

  if (tinderSwipeDeltaX > SWIPE_THRESHOLD) {
    tinderCardEl.style.transform = `translateX(700px) rotate(24deg)`;
    setTimeout(() => judgeTinder(true), 180);
  } else if (tinderSwipeDeltaX < -SWIPE_THRESHOLD) {
    tinderCardEl.style.transform = `translateX(-700px) rotate(-24deg)`;
    setTimeout(() => judgeTinder(false), 180);
  } else {
    tinderCardEl.style.transform = '';
    tinderStampSmashEl.style.opacity = '0';
    tinderStampPassEl.style.opacity  = '0';
  }
  tinderSwipeStartX = null;
  tinderSwipeDeltaX = 0;
}

tinderCardEl.addEventListener('pointerdown', e => {
  if (!e.isPrimary) return;
  e.preventDefault();
  tinderSwipeStartX = e.clientX;
  tinderCardEl.style.transition = 'none';
  tinderCardEl.setPointerCapture(e.pointerId);
});
tinderCardEl.addEventListener('pointermove', e => onTinderSwipeMove(e.clientX));
tinderCardEl.addEventListener('pointerup', endTinderSwipe);
tinderCardEl.addEventListener('pointercancel', endTinderSwipe);

tinderPassBtn.addEventListener('click', () => judgeTinder(false));
tinderSmashBtn.addEventListener('click', () => judgeTinder(true));
tinderPlayAgainBtn.addEventListener('click', startTinder);

// ============= GUESS THE POKEMON (DRAWING) =============
const POKE_ROUNDS = 10;

let pokeDeck     = [];
let pokeIdx      = 0;
let pokeGot      = 0;
let pokeMissed   = 0;
let pokeAnswered = false;

const pokeCounterEl     = document.getElementById('pokeCounter');
const pokeProgressEl    = document.getElementById('pokeProgress');
const pokeGotEl         = document.getElementById('pokeGotScore');
const pokeMissedEl      = document.getElementById('pokeMissedScore');
const pokeImgEl         = document.getElementById('pokeImg');
const pokeOptionsEl     = document.getElementById('pokeOptions');
const pokePlayAgainBtn  = document.getElementById('pokePlayAgainBtn');
const pokeSummaryEmojiEl = document.getElementById('pokeSummaryEmoji');
const pokeSummaryTitleEl = document.getElementById('pokeSummaryTitle');
const pokeSummaryScoreEl = document.getElementById('pokeSummaryScore');
const pokeFinalGotEl     = document.getElementById('pokeFinalGot');
const pokeFinalMissedEl  = document.getElementById('pokeFinalMissed');

function buildPokeDeck() {
  return shuffle(pokemonList).slice(0, POKE_ROUNDS);
}

function startPokeGame() {
  pokeDeck   = buildPokeDeck();
  pokeIdx    = 0;
  pokeGot    = 0;
  pokeMissed = 0;

  showScreen(pokeScreenEl);
  renderPokeCard();
}

// Three wrong names plus the correct one, shuffled — "give option with the
// drawing" instead of a free-text or binary got-it/missed guess.
function buildPokeChoices(correctEntry) {
  const distractors = shuffle(pokemonList.filter(p => p.name !== correctEntry.name)).slice(0, 3);
  return shuffle([correctEntry.name, ...distractors.map(p => p.name)]);
}

function renderPokeCard() {
  const entry = pokeDeck[pokeIdx];
  pokeAnswered = false;

  pokeCounterEl.textContent  = `${pokeIdx + 1} / ${pokeDeck.length}`;
  pokeProgressEl.style.width = `${(pokeIdx / pokeDeck.length) * 100}%`;
  pokeGotEl.textContent      = pokeGot;
  pokeMissedEl.textContent   = pokeMissed;
  pokeImgEl.src              = pokeImagePath(entry, 'drawing');

  const choices = buildPokeChoices(entry);
  pokeOptionsEl.innerHTML = choices.map(name => `
    <button class="poke-option rounded-xl font-bold text-sm py-3.5 border border-white/10 bg-surface text-ink transition-colors duration-150 active:scale-[0.97]" data-name="${name}" type="button">${name}</button>
  `).join('');

  pokeOptionsEl.querySelectorAll('.poke-option').forEach(btn => {
    btn.addEventListener('click', () => choosePokeOption(btn.dataset.name, entry));
  });
}

function choosePokeOption(name, entry) {
  if (pokeAnswered) return;
  pokeAnswered = true;

  const correct = name === entry.name;
  if (correct) pokeGot++; else pokeMissed++;
  pokeGotEl.textContent    = pokeGot;
  pokeMissedEl.textContent = pokeMissed;

  pokeOptionsEl.querySelectorAll('.poke-option').forEach(btn => {
    if (btn.dataset.name === entry.name) btn.classList.add('is-correct');
    else if (btn.dataset.name === name)  btn.classList.add('is-wrong');
  });

  // Reveal the real artwork so they see who it actually was
  pokeImgEl.src = pokeImagePath(entry, 'reveal');

  logShot('pokemon', entry.name, entry.name, correct ? '✅ Got it' : '❌ Missed');
  vibrate(correct ? [10, 30, 10] : [20]);

  pokeIdx++;
  setTimeout(() => {
    if (pokeIdx >= pokeDeck.length) {
      showPokeSummary();
    } else {
      renderPokeCard();
    }
  }, 1100);
}

function showPokeSummary() {
  pokeProgressEl.style.width = '100%';
  const total = pokeDeck.length;
  const pct   = Math.round((pokeGot / total) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '😅';
  const title = pct >= 80 ? 'Impressive!' : pct >= 50 ? 'Not Bad!' : 'Keep Practicing!';

  pokeSummaryEmojiEl.textContent = emoji;
  pokeSummaryTitleEl.textContent = title;
  pokeSummaryScoreEl.textContent = `You got ${pokeGot} out of ${total}`;
  pokeFinalGotEl.textContent     = pokeGot;
  pokeFinalMissedEl.textContent  = pokeMissed;

  showScreen(pokeSummaryEl);
}

pokePlayAgainBtn.addEventListener('click', startPokeGame);

// ============= KEYBOARD SHORTCUTS =============
document.addEventListener('keydown', e => {
  // Ignore when typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const key = e.key.toLowerCase();

  // Close the hamburger menu
  if (key === 'escape' && !menuOverlay.classList.contains('hidden')) {
    closeMenu();
    return;
  }

  // Eyes game shortcuts
  if (!eyesScreenEl.classList.contains('hidden')) {
    if (key === 'h' && !eyesRevealed) { showHint(); return; }
    if (key === 'r' && !eyesRevealed) { revealEyes(); return; }
    if (key === 'g' && eyesRevealed)  { scoreEyes(true); return; }
    if (key === 'm' && eyesRevealed)  { scoreEyes(false); return; }
  }

  // Anime Tinder shortcuts
  if (!tinderScreenEl.classList.contains('hidden')) {
    if (key === 's' || key === 'arrowright') { judgeTinder(true); return; }
    if (key === 'p' || key === 'arrowleft')  { judgeTinder(false); return; }
  }

  // Guess the Pokemon shortcuts — pick option 1-4
  if (!pokeScreenEl.classList.contains('hidden') && ['1', '2', '3', '4'].includes(key)) {
    const btn = pokeOptionsEl.querySelectorAll('.poke-option')[Number(key) - 1];
    btn?.click();
    return;
  }

  // DMK game shortcuts — mirrors the swipe directions (← kill, ↑ marry, → date)
  if (!gameEl.classList.contains('hidden')) {
    if (key === 'arrowleft' || key === 'k')  { DMK_KILL_BTN.click();  return; }
    if (key === 'arrowup' || key === 'm')    { DMK_MARRY_BTN.click(); return; }
    if (key === 'arrowright' || key === 'd') { DMK_DATE_BTN.click();  return; }
  }
});

// ============= SHOOT SESSIONS (global — shared by every game mode) =============
// A "session" is one continuous recording (one video file / one take of
// filming). Every recordable moment — a question asked, a character
// placed/swiped/guessed — logs how many seconds into that recording it
// happened, so during editing you can jump straight to that offset in the
// raw footage instead of hunting for it. Sessions live in localStorage —
// synced across devices by exporting/pasting JSON (see the Shoot Log
// modal), since editing always happens after the shoot, never live.
const SHOOT_SESSIONS_KEY = 'shoot_sessions';
const SHOT_KIND_META = {
  question: { emoji: '🎤' },
  dmk:      { emoji: '💘' },
  tinder:   { emoji: '🔥' },
  eyes:     { emoji: '👁️' },
};

function loadShootStore() {
  try {
    const raw = localStorage.getItem(SHOOT_SESSIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.sessions ? parsed : { activeSessionId: null, sessions: {} };
  } catch { return { activeSessionId: null, sessions: {} }; }
}

function saveShootStore() {
  localStorage.setItem(SHOOT_SESSIONS_KEY, JSON.stringify(shootStore));
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getActiveSession() {
  return shootStore.activeSessionId ? shootStore.sessions[shootStore.activeSessionId] || null : null;
}

function getShotCount(kind, refId) {
  return Object.values(shootStore.sessions)
    .reduce((sum, s) => sum + s.shots.filter(sh => sh.kind === kind && sh.refId === refId).length, 0);
}

// Logs one recordable moment at its elapsed offset into the active
// session. No-ops (and reports failure) when nothing is recording, so
// callers can decide whether that deserves a nudge or a silent skip.
function logShot(kind, refId, label, detail) {
  const session = getActiveSession();
  if (!session) return false;
  const offsetSeconds = Math.max(0, Math.round((Date.now() - new Date(session.startedAt).getTime()) / 1000));
  session.shots.push({ id: makeId(), kind, refId, label, detail, offsetSeconds, loggedAt: new Date().toISOString() });
  saveShootStore();
  return true;
}

function formatElapsed(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

let shootStore       = loadShootStore();
let shootTimerHandle = null;

// ============= QUESTION BANK =============
let qbankItems    = qbankQuestions.map(q => ({ ...q })); // mutable session copy
let qbankFilter   = 'All';
let qbankChecked  = {};
let qbankDragId   = null;

const QBANK_CAT_PILL = 'text-ink-dim bg-white/5';
const QBANK_FILTER_ACTIVE = 'bg-ink border-transparent text-bg';

const QCARD_BTN = 'w-9 h-9 rounded-lg border border-white/10 bg-transparent text-ink-faint cursor-pointer text-sm flex items-center justify-center font-sans transition-colors duration-150 hover:bg-white/5 hover:text-ink';

// ============= SHOOT SESSION BAR (persistent — visible on every screen) =============
function stopShootTimer() {
  if (shootTimerHandle) {
    clearInterval(shootTimerHandle);
    shootTimerHandle = null;
  }
}

function startShootTimer(session) {
  stopShootTimer();
  shootTimerHandle = setInterval(() => {
    const timerEls = document.querySelectorAll('.shoot-session-timer');
    if (timerEls.length === 0) { stopShootTimer(); return; }
    const text = formatElapsed((Date.now() - new Date(session.startedAt).getTime()) / 1000);
    timerEls.forEach(el => { el.textContent = text; });
  }, 1000);
}

function updateMenuRecDot() {
  const dot = document.getElementById('menuRecDot');
  if (dot) dot.classList.toggle('hidden', !getActiveSession());
}

// Rendered into every `.shoot-session-mount` in the DOM — a full one on Home
// (where you'd naturally hit "start rolling" before picking a game) and a
// compact one inside the ☰ menu drawer for every other screen, so gameplay
// screens being filmed stay uncluttered.
function renderShootSessionBar() {
  const mounts = document.querySelectorAll('.shoot-session-mount');
  const session = getActiveSession();
  updateMenuRecDot();

  if (!session) {
    stopShootTimer();
    mounts.forEach(el => {
      el.innerHTML = `
        <div class="flex gap-2 flex-wrap items-center">
          <input type="text" placeholder="Session label (e.g. Ep 4 shoot)" class="shoot-session-label flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-ink font-sans outline-none transition-colors duration-150 focus:border-white/25 placeholder:text-ink-faint">
          <button class="shoot-session-start btn px-4 py-2 text-sm rounded-lg bg-green text-white font-bold transition-transform duration-150 active:scale-[0.96]" type="button">▶ Start Rolling</button>
          <button class="shoot-log-open shrink-0 w-9 h-9 rounded-lg border border-white/10 bg-transparent text-ink-faint text-sm flex items-center justify-center transition-colors duration-150 hover:bg-white/5 hover:text-ink" title="View shoot log" type="button">📊</button>
        </div>
      `;
      el.querySelector('.shoot-session-start').addEventListener('click', () => startShootSession(el));
      el.querySelector('.shoot-session-label').addEventListener('keydown', e => {
        if (e.key === 'Enter') startShootSession(el);
      });
      el.querySelector('.shoot-log-open').addEventListener('click', () => { closeMenu(); showStatsScreen(); });
    });
    return;
  }

  const timerText = formatElapsed((Date.now() - new Date(session.startedAt).getTime()) / 1000);
  mounts.forEach(el => {
    el.innerHTML = `
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="w-2.5 h-2.5 rounded-full bg-red anim-rec-pulse shrink-0"></span>
          <div class="min-w-0">
            <div class="text-sm font-bold text-ink truncate">${session.label || 'Untitled session'}</div>
            <div class="text-[11px] text-ink-faint font-mono shoot-session-timer">${timerText}</div>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button class="shoot-log-open w-9 h-9 rounded-lg border border-white/10 bg-transparent text-ink-faint text-sm flex items-center justify-center transition-colors duration-150 hover:bg-white/5 hover:text-ink" title="View shoot log" type="button">📊</button>
          <button class="shoot-session-end px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold bg-red/10 border border-red/20 text-red transition-colors duration-150 hover:bg-red/20" type="button">⏹ End</button>
        </div>
      </div>
    `;
    el.querySelector('.shoot-session-end').addEventListener('click', endShootSession);
    el.querySelector('.shoot-log-open').addEventListener('click', () => { closeMenu(); showStatsScreen(); });
  });
  startShootTimer(session);
}

function startShootSession(mountEl) {
  const label = mountEl.querySelector('.shoot-session-label')?.value.trim() || '';

  const id = makeId();
  shootStore.sessions[id] = { id, label, startedAt: new Date().toISOString(), shots: [] };
  shootStore.activeSessionId = id;
  saveShootStore();
  vibrate([10, 30, 10]);
  renderShootSessionBar();
}

function endShootSession() {
  shootStore.activeSessionId = null;
  saveShootStore();
  vibrate(15);
  renderShootSessionBar();
}

function flashSessionBarAttention() {
  document.querySelectorAll('.shoot-session-mount').forEach(el => {
    el.style.transition = 'border-color 0.15s ease';
    el.style.borderColor = 'var(--color-red)';
    setTimeout(() => { el.style.borderColor = ''; }, 900);
  });
  vibrate([20, 20, 20]);
}

function startQbank() {
  showScreen(qbankEl);
  renderQbankFilters();
  renderQbankList();
  renderQbankMeta();
  renderQbankFooterStats();
}

function getFilteredQbank() {
  return qbankFilter === 'All'
    ? qbankItems
    : qbankItems.filter(q => q.category === qbankFilter);
}

function renderQbankMeta() {
  const asked = Object.values(qbankChecked).filter(Boolean).length;
  const metaEl = document.getElementById('qbankMeta');
  if (metaEl) metaEl.textContent = `${qbankItems.length} questions · ${asked} asked · Tap ▲▼ to reorder`;
}

function renderQbankFilters() {
  const filtersEl = document.getElementById('qbankFilters');
  if (!filtersEl) return;
  filtersEl.innerHTML = QBANK_CATEGORIES.map(cat => {
    const isActive = qbankFilter === cat;
    const cls = isActive
      ? QBANK_FILTER_ACTIVE
      : 'bg-transparent border-white/10 text-ink-dim hover:bg-white/5 hover:text-ink';
    return `<button class="shrink-0 min-h-9 px-3.5 rounded-full font-sans text-xs font-semibold cursor-pointer transition-colors duration-150 whitespace-nowrap flex items-center border ${cls}" data-cat="${cat}">${cat}</button>`;
  }).join('');
  filtersEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      qbankFilter = btn.dataset.cat;
      renderQbankFilters();
      renderQbankList();
    });
  });
}

function renderQbankList() {
  const listEl = document.getElementById('qbankList');
  if (!listEl) return;
  const filtered = getFilteredQbank();

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="text-center py-11 px-5 text-ink-faint text-sm">
        <span class="block text-4xl mb-3 grayscale-[0.4]">📭</span>
        No questions in this category yet.
      </div>`;
    return;
  }

  listEl.innerHTML = filtered.map((q, i) => {
    const checked   = !!qbankChecked[q.id];
    const shotCount = getShotCount('question', q.id);
    const hasShots  = shotCount > 0;
    const isFirst   = i === 0;
    const isLast    = i === filtered.length - 1;
    return `
      <div class="qcard${checked ? ' is-checked' : ''} bg-surface border border-white/10 rounded-2xl px-3.5 py-3 flex items-start gap-3 cursor-grab active:cursor-grabbing transition-colors duration-150 select-none" data-id="${q.id}" draggable="true">
        <div class="flex flex-col gap-1.5 shrink-0">
          <button class="qbtn-move w-9 h-4 rounded border border-white/10 bg-transparent text-ink-faint text-[9px] leading-none flex items-center justify-center transition-colors duration-150 hover:bg-white/5 hover:text-ink disabled:opacity-20 disabled:pointer-events-none" data-dir="up" data-id="${q.id}" ${isFirst ? 'disabled' : ''} title="Move up" aria-label="Move question up">▲</button>
          <div class="qcard-num min-w-7 h-7 rounded-lg bg-white/5 text-ink-faint flex items-center justify-center text-xs font-bold shrink-0">${i + 1}</div>
          <button class="qbtn-move w-9 h-4 rounded border border-white/10 bg-transparent text-ink-faint text-[9px] leading-none flex items-center justify-center transition-colors duration-150 hover:bg-white/5 hover:text-ink disabled:opacity-20 disabled:pointer-events-none" data-dir="down" data-id="${q.id}" ${isLast ? 'disabled' : ''} title="Move down" aria-label="Move question down">▼</button>
        </div>
        <div class="flex-1 min-w-0">
          <div class="qcard-text text-sm font-medium leading-snug text-ink transition-colors duration-150">${q.text}</div>
          <div class="flex gap-1.5 mt-2 items-center">
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-[0.03em] ${QBANK_CAT_PILL}">${q.viral ? '🔥 ' : ''}${q.category}</span>
          </div>
        </div>
        <div class="flex gap-1.5 shrink-0 self-start">
          <button class="qcard-btn qbtn-shoot${hasShots ? ' is-has-shots' : ''} ${QCARD_BTN} w-auto! px-2.5 gap-1 min-w-[48px] whitespace-nowrap" data-id="${q.id}" title="Record a shot for this question">
            🎬 <span class="shoot-count text-sm font-bold inline-block">${shotCount}</span>
          </button>
          <button class="qcard-btn qbtn-check${checked ? ' is-active' : ''} ${QCARD_BTN}" data-id="${q.id}" title="Mark as asked">✓</button>
          <button class="qcard-btn qbtn-del ${QCARD_BTN} hover:bg-red/10! hover:text-red!" data-id="${q.id}" title="Delete">✕</button>
        </div>
      </div>`;
  }).join('');

  // Attach per-card event handlers
  listEl.querySelectorAll('.qcard').forEach(card => {
    const id = Number(card.dataset.id);

    card.querySelector('.qbtn-check').addEventListener('click', e => {
      e.stopPropagation();
      qbankToggleCheck(id, card);
    });

    card.querySelector('.qbtn-shoot').addEventListener('click', e => {
      e.stopPropagation();
      qbankShoot(id, card);
    });

    card.querySelector('.qbtn-del').addEventListener('click', e => {
      e.stopPropagation();
      qbankDelete(id, card);
    });

    card.querySelectorAll('.qbtn-move').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        qbankMove(id, btn.dataset.dir);
      });
    });

    // Drag to reorder (mouse/trackpad — touch users get the ▲▼ buttons above)
    card.addEventListener('dragstart', () => {
      qbankDragId = id;
    });
    card.addEventListener('dragend', () => {
      qbankDragId = null;
      card.classList.remove('is-drag-target');
    });
    card.addEventListener('dragover', e => {
      e.preventDefault();
      if (qbankDragId != null && qbankDragId !== id) card.classList.add('is-drag-target');
    });
    card.addEventListener('dragleave', () => card.classList.remove('is-drag-target'));
    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('is-drag-target');
      if (qbankDragId == null || qbankDragId === id) return;
      const arr  = [...qbankItems];
      const from = arr.findIndex(q => q.id === qbankDragId);
      const to   = arr.findIndex(q => q.id === id);
      if (from === -1 || to === -1) return;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      qbankItems  = arr;
      qbankDragId = null;
      renderQbankList();
    });
  });
}

// Tap-friendly reorder for touch devices, where native HTML5 drag-and-drop
// doesn't fire. Swaps the item with its neighbor in the *filtered* view so
// the move always matches what's currently on screen.
function qbankMove(id, dir) {
  const filtered = getFilteredQbank();
  const filteredIdx = filtered.findIndex(q => q.id === id);
  const neighborIdx = dir === 'up' ? filteredIdx - 1 : filteredIdx + 1;
  if (filteredIdx === -1 || neighborIdx < 0 || neighborIdx >= filtered.length) return;

  const a = qbankItems.findIndex(q => q.id === id);
  const b = qbankItems.findIndex(q => q.id === filtered[neighborIdx].id);
  if (a === -1 || b === -1) return;

  [qbankItems[a], qbankItems[b]] = [qbankItems[b], qbankItems[a]];
  vibrate(8);
  renderQbankList();
}

function qbankToggleCheck(id, card) {
  qbankChecked[id] = !qbankChecked[id];
  const checked = qbankChecked[id];
  card.classList.toggle('is-checked', checked);
  const checkBtn = card.querySelector('.qbtn-check');
  if (checkBtn) checkBtn.classList.toggle('is-active', checked);
  vibrate(checked ? 10 : 6);
  renderQbankMeta();
}

function qbankShoot(id, card) {
  const q = qbankItems.find(item => item.id === id);
  const logged = logShot('question', id, q?.text ?? '(deleted question)', q?.category ?? 'Unknown');
  if (!logged) {
    flashSessionBarAttention();
    return;
  }

  // Surgically update the shoot button (no full list rerender)
  const btn = card.querySelector('.qbtn-shoot');
  if (btn) {
    btn.classList.add('is-has-shots');
    const countEl = btn.querySelector('.shoot-count');
    if (countEl) {
      countEl.textContent = getShotCount('question', id);
      countEl.classList.remove('anim-shoot-pop');
      void countEl.offsetWidth; // force reflow for animation replay
      countEl.classList.add('anim-shoot-pop');
    }
  }

  vibrate([12, 20, 12]);
}

function qbankDelete(id, card) {
  card.style.overflow = 'hidden';
  card.style.maxHeight = card.offsetHeight + 'px';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.2s ease, transform 0.2s ease, max-height 0.28s ease, padding 0.28s ease';
    card.style.opacity   = '0';
    card.style.transform = 'translateX(14px) scale(0.96)';
    card.style.maxHeight = '0';
    card.style.paddingTop    = '0';
    card.style.paddingBottom = '0';
  }));
  setTimeout(() => {
    qbankItems = qbankItems.filter(q => q.id !== id);
    delete qbankChecked[id];
    card.remove();
    // Renumber remaining cards
    document.querySelectorAll('.qcard-num').forEach((n, i) => {
      n.textContent = i + 1;
    });
    renderQbankMeta();
    renderQbankFooterStats();
  }, 310);
}

function renderQbankFooterStats() {
  const el = document.getElementById('qbankFooterStats');
  if (!el) return;
  const cats = QBANK_CATEGORIES.filter(c => c !== 'All');
  const viral = qbankItems.filter(q => q.viral).length;
  el.innerHTML = [
    ...cats.map(cat => {
      const count = qbankItems.filter(q => q.category === cat).length;
      return `<div class="text-[0.75rem] text-ink-faint"><b class="font-extrabold text-ink">${count}</b> ${cat}</div>`;
    }),
    `<div class="text-[0.75rem] text-ink-faint"><b class="font-extrabold text-ink">${viral}</b> Viral</div>`,
  ].join('');
}

// ============= SHOOT LOG VIEWER (all kinds: questions, DMK, Tinder, Eyes) =============
function renderShootLogRows() {
  const el = document.getElementById('shootLogView');
  if (!el) return;
  const sessions = Object.values(shootStore.sessions)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

  if (sessions.length === 0) {
    el.innerHTML = `<div class="text-center py-8 text-ink-faint text-sm">No shoot sessions logged yet — hit "▶ Start Rolling" up top.</div>`;
    return;
  }

  el.innerHTML = sessions.map(session => {
    const shots = [...session.shots].sort((a, b) => a.offsetSeconds - b.offsetSeconds);
    const rows  = shots.map(shot => {
      const kindEmoji = SHOT_KIND_META[shot.kind]?.emoji ?? '🎬';
      return `
        <div class="flex items-baseline gap-2.5 py-1.5 border-b border-white/[0.05] last:border-b-0">
          <span class="font-mono text-xs text-ink-dim shrink-0 w-14">${formatElapsed(shot.offsetSeconds)}</span>
          <span class="text-xs text-ink leading-snug">${kindEmoji} ${shot.label}${shot.detail ? ` <span class="text-ink-faint">· ${shot.detail}</span>` : ''}</span>
        </div>
      `;
    }).join('') || `<div class="py-3 text-xs text-ink-faint text-center">No shots logged in this session.</div>`;

    return `
      <div>
        <div class="flex items-center justify-between mb-1.5 gap-2">
          <span class="text-sm font-bold text-ink truncate">🎬 ${session.label || 'Untitled session'}</span>
          <span class="text-[10px] text-ink-faint shrink-0">${new Date(session.startedAt).toLocaleString()}</span>
        </div>
        <div class="rounded-xl bg-white/[0.03] border border-white/10 px-3">${rows}</div>
      </div>
    `;
  }).join('');
}

function showStatsScreen() {
  const summary = document.getElementById('qbankJsonSummary');
  const sessions   = Object.values(shootStore.sessions);
  const totalShots = sessions.reduce((sum, s) => sum + s.shots.length, 0);

  summary.innerHTML = `
    <div class="flex-1 px-4 py-3 text-center border-r border-white/[0.07]">
      <span class="block text-[1.6rem] font-black leading-none tracking-[-0.04em] text-ink">${totalShots}</span>
      <span class="block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-faint mt-1">Total Shots</span>
    </div>
    <div class="flex-1 px-4 py-3 text-center border-r border-white/[0.07]">
      <span class="block text-[1.6rem] font-black leading-none tracking-[-0.04em] text-ink">${sessions.length}</span>
      <span class="block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-faint mt-1">Sessions</span>
    </div>
    <div class="flex-1 px-4 py-3 text-center">
      <span class="block text-[1.6rem] font-black leading-none tracking-[-0.04em] text-ink">${qbankItems.length}</span>
      <span class="block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-faint mt-1">Questions Banked</span>
    </div>
  `;

  renderShootLogRows();
  document.getElementById('qbankImportInput').value = '';
  document.getElementById('qbankImportStatus').textContent = '';

  showScreen(statsScreenEl);
}

async function copyShootLogJson() {
  const text = JSON.stringify(shootStore, null, 2);
  const btn  = document.getElementById('qbankJsonCopy');
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = '✓ Copied!';
  } catch {
    // Fallback for insecure contexts
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    btn.textContent = '✓ Copied!';
  }
  setTimeout(() => { btn.textContent = 'Copy JSON'; }, 2200);
}

function downloadShootLogJson() {
  const text = JSON.stringify(shootStore, null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `shoot-log-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Merges shoot sessions pasted from another device. Sessions are matched by
// id and unioned; shots within a shared session are deduped by id — this is
// what lets you log on your phone while filming and pull it into the laptop
// you're editing on, with no server in between.
function mergeShootLog() {
  const input  = document.getElementById('qbankImportInput');
  const status = document.getElementById('qbankImportStatus');
  let incoming;
  try {
    incoming = JSON.parse(input.value.trim());
  } catch {
    status.textContent = '⚠️ Not valid JSON';
    status.className = 'text-xs text-red';
    return;
  }
  if (!incoming || typeof incoming.sessions !== 'object') {
    status.textContent = '⚠️ Unrecognized format';
    status.className = 'text-xs text-red';
    return;
  }

  let newSessions = 0;
  let newShots    = 0;
  Object.entries(incoming.sessions).forEach(([id, session]) => {
    const existing = shootStore.sessions[id];
    if (!existing) {
      shootStore.sessions[id] = session;
      newSessions++;
      newShots += session.shots.length;
      return;
    }
    const knownShotIds = new Set(existing.shots.map(s => s.id));
    session.shots.forEach(shot => {
      if (!knownShotIds.has(shot.id)) {
        existing.shots.push(shot);
        newShots++;
      }
    });
    existing.shots.sort((a, b) => a.offsetSeconds - b.offsetSeconds);
  });

  saveShootStore();
  input.value = '';
  status.textContent = `✓ Merged ${newSessions} new session(s), ${newShots} new shot(s)`;
  status.className = 'text-xs text-green';
  renderShootLogRows();
  renderQbankList();
}

let _clearConfirmTimer = null;
function clearShootLog() {
  const btn = document.getElementById('qbankJsonClear');
  if (btn.dataset.confirming === '1') {
    // Second click — actually clear
    shootStore = { activeSessionId: null, sessions: {} };
    saveShootStore();
    clearTimeout(_clearConfirmTimer);
    btn.textContent = 'Clear All';
    btn.dataset.confirming = '0';
    stopShootTimer();
    renderShootSessionBar();
    showStatsScreen();  // refresh view
    renderQbankList();   // reset shot counts on cards
  } else {
    btn.textContent = 'Confirm? ⚠️';
    btn.dataset.confirming = '1';
    _clearConfirmTimer = setTimeout(() => {
      btn.textContent = 'Clear All';
      btn.dataset.confirming = '0';
    }, 3000);
  }
}

document.getElementById('qbankJsonCopy').addEventListener('click', copyShootLogJson);
document.getElementById('qbankJsonDownload').addEventListener('click', downloadShootLogJson);
document.getElementById('qbankJsonClear').addEventListener('click', clearShootLog);
document.getElementById('qbankImportBtn').addEventListener('click', mergeShootLog);

function qbankAddQuestion() {
  const input = document.getElementById('qbankInput');
  const text  = input.value.trim();
  if (!text) {
    input.focus();
    input.style.borderColor = 'var(--color-qc-controversial)';
    setTimeout(() => { input.style.borderColor = ''; }, 1200);
    return;
  }
  const cat   = document.getElementById('qbankCatSelect').value;
  const viral = document.getElementById('qbankViralCheck').checked;
  qbankItems.push({ id: Date.now(), text, category: cat, viral });
  input.value = '';
  document.getElementById('qbankViralCheck').checked = false;
  renderQbankList();
  renderQbankMeta();
  renderQbankFooterStats();
  // Scroll to the newly added card
  setTimeout(() => {
    const listEl = document.getElementById('qbankList');
    listEl?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

document.getElementById('qbankAddBtn').addEventListener('click', qbankAddQuestion);
document.getElementById('qbankInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) qbankAddQuestion();
});

// ============= INIT =============
renderShootSessionBar();
preloadAllImages()
  .catch(() => {})
  .finally(showHome);
