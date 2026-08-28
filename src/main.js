import { EYES_FOLDER, chars, qbankQuestions, QBANK_CATEGORIES } from './data.js';

// ============= STATE =============
let activeTrios      = [];
let currentTrioIdx   = 0;
const placements     = {};
let trioPlacements   = {};
let selectedCard     = null;

// ============= ELEMENTS =============
const homeEl           = document.getElementById('home');
const gameEl            = document.getElementById('game');
const summaryEl        = document.getElementById('summary');
const eyesScreenEl     = document.getElementById('eyes-screen');
const eyesSummaryEl    = document.getElementById('eyes-summary');
const tinderScreenEl   = document.getElementById('tinder-screen');
const tinderSummaryEl  = document.getElementById('tinder-summary');
const charactersEl     = document.getElementById('characters');
const zonesEls         = document.querySelectorAll('.zone');
const modeTitleEl      = document.getElementById('modeTitle');
const roundNameEl      = document.getElementById('roundName');
const trioCounterEl    = document.getElementById('trioCounter');
const progressFillEl   = document.getElementById('progressFill');
const hintEl           = document.getElementById('hint');
const pdotsEl          = document.getElementById('pdots');
const nextBtn          = document.getElementById('nextBtn');
const resetBtn         = document.getElementById('resetBtn');
const backBtn          = document.getElementById('backBtn');
const summaryContentEl = document.getElementById('summaryContent');
const playAgainBtn     = document.getElementById('playAgainBtn');
const homeBtn          = document.getElementById('homeBtn');
const qbankEl          = document.getElementById('qbank');

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
  qbankEl.classList.add('hidden');
  screen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============= HOME SCREEN =============
function showHome() {
  showScreen(homeEl);
}

document.getElementById('dmkStartBtn').addEventListener('click', startDMK);
document.getElementById('eyesStartBtn').addEventListener('click', startEyesGame);
document.getElementById('qbankStartBtn').addEventListener('click', startQbank);
document.getElementById('tinderStartBtn').addEventListener('click', startTinder);

// ============= START DATE · MARRY · KILL =============
const DMK_ROUNDS = 6;

function buildRandomTrios() {
  const pool = shuffle(Object.keys(chars)).slice(0, DMK_ROUNDS * 3);
  const trios = [];
  for (let i = 0; i < pool.length; i += 3) {
    const characters = pool.slice(i, i + 3);
    const animes = [...new Set(characters.map(n => chars[n]?.anime).filter(Boolean))];
    const round = animes.length > 2 ? `${animes.slice(0, 2).join(' × ')} +${animes.length - 2}` : animes.join(' × ');
    trios.push({ round, characters });
  }
  return trios;
}

function startDMK() {
  activeTrios    = buildRandomTrios();
  currentTrioIdx = 0;
  Object.keys(placements).forEach(k => delete placements[k]);

  modeTitleEl.textContent = '💕 Date · Marry · Kill';
  showScreen(gameEl);
  renderTrio();
}

// ============= HINT =============
function updateHint() {
  const placed = Object.keys(trioPlacements).length;
  if (placed === 3) {
    hintEl.innerHTML = `<span class="text-base">✅</span><span>All placed — tap Next!</span>`;
    hintEl.classList.remove('is-action');
    hintEl.classList.add('is-complete');
  } else if (selectedCard) {
    hintEl.innerHTML = `<span class="text-base">✨</span><span>"${selectedCard.dataset.name}" — tap a zone</span>`;
    hintEl.classList.add('is-action');
    hintEl.classList.remove('is-complete');
  } else {
    hintEl.innerHTML = `<span class="text-base">👆</span><span>Tap a character, then tap a zone</span>`;
    hintEl.classList.remove('is-action');
    hintEl.classList.remove('is-complete');
  }
}

// ============= ZONE MARKUP HELPERS =============
const ZONE_META = {
  date:  { emoji: '💕', label: 'Date',  color: 'text-gold' },
  marry: { emoji: '💍', label: 'Marry', color: 'text-green' },
  kill:  { emoji: '💀', label: 'Kill',  color: 'text-red' },
};

function zoneIdleMarkup(z) {
  const m = ZONE_META[z];
  return `<div class="zone-icon text-2xl leading-none">${m.emoji}</div><div class="text-[11px] font-bold tracking-[0.1em] uppercase ${m.color}">${m.label}</div>`;
}

// ============= RENDER TRIO =============
function renderTrio() {
  const trio = activeTrios[currentTrioIdx];
  roundNameEl.textContent   = trio.round;
  trioCounterEl.textContent = `Trio ${currentTrioIdx + 1} / ${activeTrios.length}`;
  progressFillEl.style.width = `${(currentTrioIdx / activeTrios.length) * 100}%`;

  charactersEl.innerHTML = trio.characters.map((name, i) => {
    const c        = chars[name];
    const fallback = initialsOf(name);
    const imgSrc   = c && c.img ? safeImg(c.img) : null;
    const imgHtml  = imgSrc
      ? `<img class="char-img w-full h-full object-cover" src="${imgSrc}" alt="${name}"
              onerror="this.outerHTML='<div class=&quot;w-full h-full flex items-center justify-center font-bold text-white text-2xl&quot; style=&quot;${AVATAR_GRADIENT}&quot;>${fallback}</div>'">`
      : `<div class="w-full h-full flex items-center justify-center font-bold text-white text-2xl" style="${AVATAR_GRADIENT}">${fallback}</div>`;
    const anime = c ? c.anime : '';
    return `
      <div class="char-card relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-surface transition-colors duration-150 select-none active:scale-[0.96] anim-card-enter" style="animation-delay:${i * 0.04}s" draggable="true" data-name="${name}">
        ${imgHtml}
        <div class="char-selected-badge absolute top-2 left-2 bg-pink text-white text-[10px] font-bold px-2 py-[3px] rounded-full uppercase tracking-[0.08em] pointer-events-none">Selected</div>
        <div class="absolute inset-x-0 bottom-0 pt-8 px-2.5 pb-2 pointer-events-none" style="background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)">
          <div class="text-xs font-bold leading-tight text-white">${name}</div>
          <div class="text-[10px] text-white/55 mt-0.5">${anime}</div>
        </div>
      </div>
    `;
  }).join('');

  // Reset zones
  zonesEls.forEach(zone => {
    zone.classList.remove('is-filled', 'is-armed', 'is-drag-over');
    zone.innerHTML = zoneIdleMarkup(zone.dataset.zone);
  });

  // Reset placement dots
  if (pdotsEl) {
    pdotsEl.querySelectorAll('.pdot').forEach(d => d.classList.remove('is-filled'));
  }

  trioPlacements = {};
  selectedCard   = null;
  nextBtn.disabled    = true;
  nextBtn.textContent = currentTrioIdx === activeTrios.length - 1 ? 'See Results 🎬' : 'Next →';

  attachCardHandlers();
  updateHint();
}

// ============= CARD HANDLERS =============
function attachCardHandlers() {
  document.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.placed === 'true') return;
      if (selectedCard === card) {
        selectedCard.classList.remove('is-selected');
        selectedCard = null;
      } else {
        if (selectedCard) selectedCard.classList.remove('is-selected');
        selectedCard = card;
        card.classList.add('is-selected');
      }
      updateHint();
    });

    card.addEventListener('dragstart', e => {
      if (card.dataset.placed === 'true') { e.preventDefault(); return; }
      e.dataTransfer.setData('text/plain', card.dataset.name);
      e.dataTransfer.effectAllowed = 'move';
    });
  });
}

// ============= ZONE HANDLERS =============
zonesEls.forEach(zone => {
  zone.addEventListener('click', () => {
    if (zone.classList.contains('is-filled')) return;
    if (!selectedCard) {
      hintEl.innerHTML = `<span class="text-base">👆</span><span>First tap a character above</span>`;
      hintEl.classList.add('is-action');
      setTimeout(updateHint, 1500);
      return;
    }
    placeCharacter(selectedCard.dataset.name, zone);
    selectedCard.classList.remove('is-selected');
    selectedCard = null;
    updateHint();
  });

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    if (!zone.classList.contains('is-filled')) zone.classList.add('is-drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('is-drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('is-drag-over');
    if (zone.classList.contains('is-filled')) return;
    const name = e.dataTransfer.getData('text/plain');
    if (!name) return;
    placeCharacter(name, zone);
    if (selectedCard) { selectedCard.classList.remove('is-selected'); selectedCard = null; }
    updateHint();
  });
});

// Arm zones when a card is selected
const armedObserver = new MutationObserver(() => {
  zonesEls.forEach(z => {
    if (selectedCard && !z.classList.contains('is-filled')) z.classList.add('is-armed');
    else z.classList.remove('is-armed');
  });
});
armedObserver.observe(charactersEl, {
  attributes: true,
  subtree: true,
  attributeFilter: ['class'],
});

// ============= PLACE CHARACTER =============
function placeCharacter(name, zone) {
  if (Object.values(trioPlacements).includes(name)) return;
  const z    = zone.dataset.zone;
  const c    = chars[name];
  const emoji = ZONE_META[z].emoji;
  const fallback = initialsOf(name);

  const card = document.querySelector(`.char-card[data-name="${CSS.escape(name)}"]`);
  if (card) {
    card.dataset.placed = 'true';
    card.classList.add('is-placed');
    card.classList.remove('is-selected');
  }

  trioPlacements[z] = name;
  placements[`${currentTrioIdx}::${name}`] = z;

  const imgSrc    = c && c.img ? safeImg(c.img) : null;
  const imgHtml   = imgSrc
    ? `<img class="w-full h-full object-cover" src="${imgSrc}" alt="${name}"
            onerror="this.outerHTML='<div class=&quot;w-full h-full flex items-center justify-center font-bold text-white text-lg&quot; style=&quot;${AVATAR_GRADIENT}&quot;>${fallback}</div>'">`
    : `<div class="w-full h-full flex items-center justify-center font-bold text-white text-lg" style="${AVATAR_GRADIENT}">${fallback}</div>`;

  zone.classList.add('is-filled');
  zone.classList.remove('is-armed');
  zone.innerHTML = `
    <div class="anim-zone-fill relative w-full h-full">
      ${imgHtml}
      <div class="absolute top-[7px] right-[7px] w-6 h-6 rounded-full bg-black/55 flex items-center justify-center text-xs">${emoji}</div>
      <div class="absolute inset-x-0 bottom-0 px-2 pb-2 pt-6 text-[11px] font-bold text-white leading-tight" style="background: linear-gradient(to top, rgba(0,0,0,0.85), transparent)">${name}</div>
    </div>
  `;

  // Update placement dot
  if (pdotsEl) {
    const dot = pdotsEl.querySelector(`.pdot[data-zone="${z}"]`);
    if (dot) dot.classList.add('is-filled');
  }

  vibrate();

  if (Object.keys(trioPlacements).length === 3) {
    nextBtn.disabled = false;
    nextBtn.classList.add('anim-btn-ready');
  }
}

// ============= CONTROLS =============
nextBtn.addEventListener('click', () => {
  if (currentTrioIdx < activeTrios.length - 1) {
    currentTrioIdx++;
    renderTrio();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showSummary();
  }
});

resetBtn.addEventListener('click', () => {
  activeTrios[currentTrioIdx].characters.forEach(name => {
    delete placements[`${currentTrioIdx}::${name}`];
  });
  renderTrio();
});

backBtn.addEventListener('click', showHome);
homeBtn.addEventListener('click', showHome);

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

  const byRound = {};
  activeTrios.forEach((trio, idx) => {
    if (!byRound[trio.round]) byRound[trio.round] = [];
    trio.characters.forEach(name => {
      const verdict = placements[`${idx}::${name}`];
      if (verdict) {
        const c = chars[name] || {};
        byRound[trio.round].push({ name, verdict, anime: c.anime || '', img: c.img || null });
      }
    });
  });

  let html = '';
  for (const [round, items] of Object.entries(byRound)) {
    html += `
      <div class="mb-7">
        <div class="text-[11px] font-bold tracking-[0.12em] uppercase text-ink-faint pb-2 mb-2.5 border-b border-white/10">${round}</div>
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
const eyesGotEl      = document.getElementById('eyesGotScore');
const eyesMissedEl   = document.getElementById('eyesMissedScore');
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
const eyesBackBtn    = document.getElementById('eyesBackBtn');
const eyesPlayAgainBtn = document.getElementById('eyesPlayAgainBtn');
const eyesHomeBtn    = document.getElementById('eyesHomeBtn');
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
  eyesGotEl.textContent      = eyesGot;
  eyesMissedEl.textContent   = eyesMissed;

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
  if (got) eyesGot++; else eyesMissed++;

  // Animate the changed score counter
  const scoreEl = got ? eyesGotEl : eyesMissedEl;
  scoreEl.textContent = got ? eyesGot : eyesMissed;
  scoreEl.classList.remove('anim-score-pop');
  void scoreEl.offsetWidth; // force reflow
  scoreEl.classList.add('anim-score-pop');

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
eyesBackBtn.addEventListener('click', showHome);
eyesHomeBtn.addEventListener('click', showHome);
eyesPlayAgainBtn.addEventListener('click', startEyesGame);

// ============= ANIME TINDER =============
// Reuses the exact same vertical "reveal" cards from the Eyes game — they're
// already framed as name+anime cards, perfect for a swipe deck as-is.
const TINDER_ROUNDS = 20;

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
const tinderBackBtn    = document.getElementById('tinderBackBtn');
const tinderHomeBtn    = document.getElementById('tinderHomeBtn');
const tinderPlayAgainBtn = document.getElementById('tinderPlayAgainBtn');
const tinderSummaryScoreEl = document.getElementById('tinderSummaryScore');
const tinderMatchesGridEl  = document.getElementById('tinderMatchesGrid');

function startTinder() {
  tinderDeck    = shuffle(Object.keys(chars)).slice(0, TINDER_ROUNDS);
  tinderIdx     = 0;
  tinderMatches = [];
  showScreen(tinderScreenEl);
  renderTinderCard();
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
tinderBackBtn.addEventListener('click', showHome);
tinderHomeBtn.addEventListener('click', showHome);
tinderPlayAgainBtn.addEventListener('click', startTinder);

// ============= KEYBOARD SHORTCUTS =============
document.addEventListener('keydown', e => {
  // Ignore when typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const key = e.key.toLowerCase();

  // Close modal
  if (key === 'escape') {
    const modal = document.getElementById('qbankJsonModal');
    if (modal && !modal.classList.contains('hidden')) {
      closeQbankJsonViewer();
      return;
    }
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

  // DMK game shortcuts
  if (!gameEl.classList.contains('hidden')) {
    if ((key === 'enter' || key === ' ') && !nextBtn.disabled) {
      e.preventDefault();
      nextBtn.click();
      return;
    }
    if (key === 'escape' && selectedCard) {
      selectedCard.classList.remove('is-selected');
      selectedCard = null;
      updateHint();
    }
  }
});

function loadQbankShots() {
  try {
    const raw = localStorage.getItem('qbank_shots');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveQbankShots() {
  localStorage.setItem('qbank_shots', JSON.stringify(qbankShotData));
}

// ============= QUESTION BANK =============
let qbankItems    = qbankQuestions.map(q => ({ ...q })); // mutable session copy
let qbankShotData = loadQbankShots();                     // { [id]: { count, shots: string[] } }
let qbankFilter   = 'All';
let qbankChecked  = {};
let qbankDragId   = null;

const QBANK_CAT_PILL = 'text-ink-dim bg-white/5';
const QBANK_FILTER_ACTIVE = 'bg-ink border-transparent text-bg';

const QCARD_BTN = 'w-9 h-9 rounded-lg border border-white/10 bg-transparent text-ink-faint cursor-pointer text-sm flex items-center justify-center font-sans transition-colors duration-150 hover:bg-white/5 hover:text-ink';

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
    const shotCount = qbankShotData[q.id]?.count ?? 0;
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
  const now = new Date().toISOString();
  if (!qbankShotData[id]) qbankShotData[id] = { count: 0, shots: [] };
  qbankShotData[id].count++;
  qbankShotData[id].shots.push(now);
  saveQbankShots();

  // Surgically update the shoot button (no full list rerender)
  const btn = card.querySelector('.qbtn-shoot');
  if (btn) {
    btn.classList.add('is-has-shots');
    const countEl = btn.querySelector('.shoot-count');
    if (countEl) {
      countEl.textContent = qbankShotData[id].count;
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

// ============= JSON DATA VIEWER =============
function buildQbankJsonData() {
  const allIds = Object.keys(qbankShotData).map(Number);
  const questions = allIds
    .filter(id => qbankShotData[id]?.count > 0)
    .map(id => {
      const data = qbankShotData[id];
      const q    = qbankItems.find(q => q.id === id) || qbankQuestions.find(q => q.id === id);
      return {
        id,
        question:  q?.text     ?? '(deleted question)',
        category:  q?.category ?? 'Unknown',
        viral:     q?.viral    ?? false,
        shotCount: data.count,
        shotAt:    data.shots.map(ts => {
          const d = new Date(ts);
          return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }),
      };
    })
    .sort((a, b) => b.shotCount - a.shotCount);

  const totalShots = questions.reduce((s, q) => s + q.shotCount, 0);
  return {
    summary: {
      totalShots,
      totalQuestionsUsed: questions.length,
      exportedAt: new Date().toLocaleString(),
    },
    questions,
  };
}

function syntaxHighlightJson(json) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    match => {
      if (/^"/.test(match)) {
        return `<span class="${/:$/.test(match) ? 'text-ink' : 'text-[#4ade80]'}">${match}</span>`;
      }
      if (/true|false/.test(match)) return `<span class="text-[#a855f7]">${match}</span>`;
      if (/null/.test(match))       return `<span class="text-ink-faint">${match}</span>`;
      return `<span class="text-[#22d3ee]">${match}</span>`;
    }
  );
}

function openQbankJsonViewer() {
  const modal   = document.getElementById('qbankJsonModal');
  const pre     = document.getElementById('qbankJsonPre');
  const summary = document.getElementById('qbankJsonSummary');
  const data    = buildQbankJsonData();

  // Summary strip
  summary.innerHTML = `
    <div class="flex-1 px-4 py-3 text-center border-r border-white/[0.07]">
      <span class="block text-[1.6rem] font-black leading-none tracking-[-0.04em] text-ink">${data.summary.totalShots}</span>
      <span class="block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-faint mt-1">Total Shots</span>
    </div>
    <div class="flex-1 px-4 py-3 text-center border-r border-white/[0.07]">
      <span class="block text-[1.6rem] font-black leading-none tracking-[-0.04em] text-ink">${data.summary.totalQuestionsUsed}</span>
      <span class="block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-faint mt-1">Questions Used</span>
    </div>
    <div class="flex-1 px-4 py-3 text-center">
      <span class="block text-[1.6rem] font-black leading-none tracking-[-0.04em] text-ink">${qbankItems.length}</span>
      <span class="block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-faint mt-1">In Bank</span>
    </div>
  `;

  // JSON with syntax highlighting
  const raw = JSON.stringify(data, null, 2);
  pre.innerHTML = syntaxHighlightJson(raw);

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeQbankJsonViewer() {
  document.getElementById('qbankJsonModal').classList.add('hidden');
  document.body.style.overflow = '';
}

async function qbankCopyJson() {
  const data = buildQbankJsonData();
  const text = JSON.stringify(data, null, 2);
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
    document.body.removeChild(ta);
    btn.textContent = '✓ Copied!';
  }
  setTimeout(() => { btn.textContent = 'Copy JSON'; }, 2200);
}

let _clearConfirmTimer = null;
function qbankClearData() {
  const btn = document.getElementById('qbankJsonClear');
  if (btn.dataset.confirming === '1') {
    // Second click — actually clear
    qbankShotData = {};
    localStorage.removeItem('qbank_shots');
    clearTimeout(_clearConfirmTimer);
    btn.textContent = 'Clear All';
    btn.dataset.confirming = '0';
    openQbankJsonViewer(); // refresh view
    renderQbankList();     // reset shot counts on cards
  } else {
    btn.textContent = 'Confirm? ⚠️';
    btn.dataset.confirming = '1';
    _clearConfirmTimer = setTimeout(() => {
      btn.textContent = 'Clear All';
      btn.dataset.confirming = '0';
    }, 3000);
  }
}

document.getElementById('qbankViewJson').addEventListener('click', openQbankJsonViewer);
document.getElementById('qbankJsonClose').addEventListener('click', closeQbankJsonViewer);
document.getElementById('qbankModalBackdrop').addEventListener('click', closeQbankJsonViewer);
document.getElementById('qbankJsonCopy').addEventListener('click', qbankCopyJson);
document.getElementById('qbankJsonClear').addEventListener('click', qbankClearData);

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

document.getElementById('qbankBackBtn').addEventListener('click', showHome);
document.getElementById('qbankAddBtn').addEventListener('click', qbankAddQuestion);
document.getElementById('qbankInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) qbankAddQuestion();
});

// ============= INIT =============
preloadAllImages()
  .catch(() => {})
  .finally(showHome);
