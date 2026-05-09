import { gameModes, eyesPacks, chars, qbankQuestions, QBANK_CATEGORIES } from './data.js';

// ============= STATE =============
let activeTrios      = [];
let activeMode       = null;
let currentTrioIdx   = 0;
const placements     = {};
let trioPlacements   = {};
let selectedCard     = null;

// ============= ELEMENTS =============
const homeEl           = document.getElementById('home');
const gameEl           = document.getElementById('game');
const summaryEl        = document.getElementById('summary');
const eyesScreenEl     = document.getElementById('eyes-screen');
const eyesSummaryEl    = document.getElementById('eyes-summary');
const modeGridEl       = document.getElementById('modeGrid');
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

function collectAllImageUrls() {
  const urls = new Set();
  Object.values(chars).forEach(c => {
    const src = safeImg(c?.img);
    if (src) urls.add(src);
  });
  eyesPacks.forEach(pack => {
    const base = pack.folder.split('/').map(encodeURIComponent).join('/');
    const total = pack.pairCount * 2;
    for (let i = 1; i <= total; i++) {
      urls.add(`${base}/${i}.jpg`);
    }
  });
  return [...urls];
}

function preloadAllImages() {
  const urls = collectAllImageUrls();
  return Promise.all(urls.map(preloadImage));
}

function tagClass(tag) {
  const map = {
    'Male':      'tag-male',
    'Female':    'tag-female',
    'Mix':       'tag-mix',
    'Heroes':    'tag-heroes',
    'Villains':  'tag-villains',
    'Fan Favs':  'tag-fan-favs',
  };
  return map[tag] || 'tag-mix';
}

// ============= SCREEN MANAGEMENT =============
function showScreen(screen) {
  homeEl.classList.add('hidden');
  gameEl.classList.add('hidden');
  summaryEl.classList.add('hidden');
  eyesScreenEl.classList.add('hidden');
  eyesSummaryEl.classList.add('hidden');
  qbankEl.classList.add('hidden');
  screen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============= HOME SCREEN =============
function showHome() {
  modeGridEl.innerHTML = `
    <div class="home-section-label">💕 Date · Marry · Kill</div>
    ${gameModes.map(mode => {
      const tagPills = mode.tags.map(t => `<span class="tag-pill ${tagClass(t)}">${t}</span>`).join('');
      const roundCount = mode.trios.length;
      return `
        <button class="mode-card" data-accent="${mode.accent}" data-mode="${mode.id}" data-game="dmk" type="button">
          <div class="mode-card-emoji">${mode.emoji}</div>
          <div class="mode-card-title">${mode.title}</div>
          <div class="mode-card-desc">${mode.description}</div>
          <div class="mode-card-footer">
            <div class="tag-pills">${tagPills}</div>
            <span class="mode-card-rounds">${roundCount} round${roundCount !== 1 ? 's' : ''}</span>
          </div>
        </button>
      `;
    }).join('')}

    <div class="home-section-label home-section-label--eyes">👁️ Guess by Eyes</div>
    ${eyesPacks.map(pack => {
      const tagPills = pack.tags.map(t => `<span class="tag-pill ${tagClass(t)}">${t}</span>`).join('');
      return `
        <button class="mode-card" data-accent="${pack.accent}" data-pack="${pack.id}" data-game="eyes" type="button">
          <div class="mode-card-emoji">${pack.emoji}</div>
          <div class="mode-card-title">${pack.title}</div>
          <div class="mode-card-pack-badge">${pack.pack}</div>
          <div class="mode-card-desc">${pack.description}</div>
          <div class="mode-card-footer">
            <div class="tag-pills">${tagPills}</div>
            <span class="mode-card-rounds">${pack.pairCount} pairs</span>
          </div>
        </button>
      `;
    }).join('')}

    <div class="home-section-label home-section-label--qbank">📋 Street Interview</div>
    <button class="mode-card mode-card--wide" data-accent="blue" data-game="qbank" type="button">
      <div class="mode-card-emoji">🎌</div>
      <div class="mode-card-title">Comic Con 2026 · Question Bank</div>
      <div class="mode-card-desc">32 curated anime discussion questions — filter by category, track what's been asked, drag to reorder</div>
      <div class="mode-card-footer">
        <div class="tag-pills">
          <span class="tag-pill tag-villains">Controversial</span>
          <span class="tag-pill tag-mix">Industry</span>
          <span class="tag-pill tag-heroes">General</span>
        </div>
        <span class="mode-card-rounds">${qbankQuestions.length} questions</span>
      </div>
    </button>
  `;

  modeGridEl.querySelectorAll('[data-game="dmk"]').forEach(card => {
    card.addEventListener('click', () => startMode(card.dataset.mode));
  });
  modeGridEl.querySelectorAll('[data-game="eyes"]').forEach(card => {
    card.addEventListener('click', () => startEyesPack(card.dataset.pack));
  });
  modeGridEl.querySelector('[data-game="qbank"]')
    .addEventListener('click', startQbank);

  showScreen(homeEl);
}

// ============= START A MODE =============
function startMode(modeId) {
  activeMode   = gameModes.find(m => m.id === modeId);
  activeTrios  = activeMode.trios;
  currentTrioIdx = 0;
  Object.keys(placements).forEach(k => delete placements[k]);

  modeTitleEl.textContent = `${activeMode.emoji} ${activeMode.title}`;
  showScreen(gameEl);
  renderTrio();
}

// ============= HINT =============
function updateHint() {
  const placed = Object.keys(trioPlacements).length;
  if (placed === 3) {
    hintEl.innerHTML = `<span class="hint-icon">✅</span><span>All placed — tap Next!</span>`;
    hintEl.classList.remove('action');
    hintEl.classList.add('complete');
  } else if (selectedCard) {
    hintEl.innerHTML = `<span class="hint-icon">✨</span><span>"${selectedCard.dataset.name}" — tap a zone</span>`;
    hintEl.classList.add('action');
    hintEl.classList.remove('complete');
  } else {
    hintEl.innerHTML = `<span class="hint-icon">👆</span><span>Tap a character, then tap a zone</span>`;
    hintEl.classList.remove('action');
    hintEl.classList.remove('complete');
  }
}

// ============= RENDER TRIO =============
function renderTrio() {
  const trio = activeTrios[currentTrioIdx];
  roundNameEl.textContent   = trio.round;
  trioCounterEl.textContent = `Trio ${currentTrioIdx + 1} / ${activeTrios.length}`;
  progressFillEl.style.width = `${(currentTrioIdx / activeTrios.length) * 100}%`;

  charactersEl.innerHTML = trio.characters.map((name) => {
    const c        = chars[name];
    const fallback = initialsOf(name);
    const imgSrc   = c && c.img ? safeImg(c.img) : null;
    const imgHtml  = imgSrc
      ? `<img class="char-img" src="${imgSrc}" alt="${name}"
              onerror="this.outerHTML='<div class=&quot;char-img-fallback&quot;>${fallback}</div>'">`
      : `<div class="char-img-fallback">${fallback}</div>`;
    const anime = c ? c.anime : '';
    return `
      <div class="char-card" draggable="true" data-name="${name}">
        ${imgHtml}
        <div class="char-selected-badge">Selected</div>
        <div class="char-overlay">
          <div class="char-name">${name}</div>
          <div class="char-anime">${anime}</div>
        </div>
      </div>
    `;
  }).join('');

  // Reset zones
  zonesEls.forEach(zone => {
    const z     = zone.dataset.zone;
    const emoji = z === 'date' ? '💕' : z === 'marry' ? '💍' : '💀';
    const label = z[0].toUpperCase() + z.slice(1);
    zone.classList.remove('filled', 'armed', 'drag-over');
    zone.innerHTML = `<div class="zone-icon">${emoji}</div><div class="zone-label">${label}</div>`;
  });

  // Reset placement dots
  if (pdotsEl) {
    pdotsEl.querySelectorAll('.pdot').forEach(d => {
      d.classList.remove('filled-date', 'filled-marry', 'filled-kill');
    });
  }

  trioPlacements = {};
  selectedCard   = null;
  nextBtn.disabled    = true;
  nextBtn.classList.remove('ready');
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
        selectedCard.classList.remove('selected');
        selectedCard = null;
      } else {
        if (selectedCard) selectedCard.classList.remove('selected');
        selectedCard = card;
        card.classList.add('selected');
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
    if (zone.classList.contains('filled')) return;
    if (!selectedCard) {
      hintEl.innerHTML = `<span class="hint-icon">👆</span><span>First tap a character above</span>`;
      hintEl.classList.add('action');
      setTimeout(updateHint, 1500);
      return;
    }
    placeCharacter(selectedCard.dataset.name, zone);
    selectedCard.classList.remove('selected');
    selectedCard = null;
    updateHint();
  });

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    if (!zone.classList.contains('filled')) zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    if (zone.classList.contains('filled')) return;
    const name = e.dataTransfer.getData('text/plain');
    if (!name) return;
    placeCharacter(name, zone);
    if (selectedCard) { selectedCard.classList.remove('selected'); selectedCard = null; }
    updateHint();
  });
});

// Arm zones when a card is selected
const armedObserver = new MutationObserver(() => {
  zonesEls.forEach(z => {
    if (selectedCard && !z.classList.contains('filled')) z.classList.add('armed');
    else z.classList.remove('armed');
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
  const emoji = z === 'date' ? '💕' : z === 'marry' ? '💍' : '💀';
  const fallback = initialsOf(name);

  const card = document.querySelector(`.char-card[data-name="${CSS.escape(name)}"]`);
  if (card) {
    card.dataset.placed = 'true';
    card.classList.remove('selected');
  }

  trioPlacements[z] = name;
  placements[`${currentTrioIdx}::${name}`] = z;

  const imgSrc    = c && c.img ? safeImg(c.img) : null;
  const imgHtml   = imgSrc
    ? `<img src="${imgSrc}" alt="${name}"
            onerror="this.outerHTML='<div class=&quot;placed-fallback&quot;>${fallback}</div>'">`
    : `<div class="placed-fallback">${fallback}</div>`;

  zone.classList.add('filled');
  zone.classList.remove('armed');
  zone.innerHTML = `
    <div class="placed-card">
      ${imgHtml}
      <div class="placed-emoji">${emoji}</div>
      <div class="placed-name">${name}</div>
    </div>
  `;

  // Update placement dot
  if (pdotsEl) {
    const dot = pdotsEl.querySelector(`.pdot[data-zone="${z}"]`);
    if (dot) {
      dot.classList.remove('filled-date', 'filled-marry', 'filled-kill');
      dot.classList.add(`filled-${z}`);
    }
  }

  vibrate();

  if (Object.keys(trioPlacements).length === 3) {
    nextBtn.disabled = false;
    nextBtn.classList.add('ready');
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

playAgainBtn.addEventListener('click', () => {
  startMode(activeMode.id);
});

// ============= SUMMARY =============
function showSummary() {
  progressFillEl.style.width = '100%';
  showScreen(summaryEl);

  // Populate tally counts
  const counts = { date: 0, marry: 0, kill: 0 };
  Object.values(placements).forEach(v => counts[v]++);
  const tallyEl = document.getElementById('summaryTally');
  if (tallyEl) {
    tallyEl.innerHTML = `
      <div class="tally-item tally-date">
        <span class="tally-emoji">💕</span>
        <span class="tally-num">${counts.date}</span>
        <span class="tally-label">Dated</span>
      </div>
      <div class="tally-item tally-marry">
        <span class="tally-emoji">💍</span>
        <span class="tally-num">${counts.marry}</span>
        <span class="tally-label">Married</span>
      </div>
      <div class="tally-item tally-kill">
        <span class="tally-emoji">💀</span>
        <span class="tally-num">${counts.kill}</span>
        <span class="tally-label">Killed</span>
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
      <div class="summary-section">
        <div class="summary-section-title">${round}</div>
        <div class="summary-grid">
    `;
    items.forEach(item => {
      const label    = item.verdict === 'date' ? '💕 Date' : item.verdict === 'marry' ? '💍 Marry' : '💀 Kill';
      const fallback = initialsOf(item.name);
      const imgSrc   = item.img ? safeImg(item.img) : null;
      const imgHtml  = imgSrc
        ? `<img src="${imgSrc}" alt="${item.name}"
                onerror="this.outerHTML='<div class=&quot;summary-card-fallback&quot;>${fallback}</div>'">`
        : `<div class="summary-card-fallback">${fallback}</div>`;
      html += `
        <div class="summary-card">
          <span class="verdict-chip ${item.verdict}">${label}</span>
          <div class="summary-card-img-wrap">${imgHtml}</div>
          <div class="summary-card-info">
            <div class="summary-card-name">${item.name}</div>
            <div class="summary-card-anime">${item.anime}</div>
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
  }
  summaryContentEl.innerHTML = html;
}

// ============= EYES GAME =============
let activePack     = null;
let eyesIdx        = 0;
let eyesGot        = 0;
let eyesMissed     = 0;
let eyesRevealed   = false;

const eyesTitleEl    = document.getElementById('eyesTitle');
const eyesPackEl     = document.getElementById('eyesPack');
const eyesCounterEl  = document.getElementById('eyesCounter');
const eyesProgressEl = document.getElementById('eyesProgress');
const eyesGotEl      = document.getElementById('eyesGotScore');
const eyesMissedEl   = document.getElementById('eyesMissedScore');
const eyesCardEl     = document.getElementById('eyesCard');
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

function startEyesPack(packId) {
  activePack   = eyesPacks.find(p => p.id === packId);
  eyesIdx      = 0;
  eyesGot      = 0;
  eyesMissed   = 0;
  eyesRevealed = false;

  eyesTitleEl.textContent = `${activePack.emoji} ${activePack.title}`;
  eyesPackEl.textContent  = activePack.pack;
  showScreen(eyesScreenEl);
  renderEyesCard();
}

function renderEyesCard() {
  const pairNum  = eyesIdx + 1;                    // 1-based pair index
  const eyeFile  = (eyesIdx * 2 + 1);              // odd  (1, 3, 5 …)
  const faceFile = (eyesIdx * 2 + 2);              // even (2, 4, 6 …)
  const base     = activePack.folder.split('/').map(encodeURIComponent).join('/');

  eyesCounterEl.textContent  = `${pairNum} / ${activePack.pairCount}`;
  eyesProgressEl.style.width = `${(eyesIdx / activePack.pairCount) * 100}%`;
  eyesGotEl.textContent      = eyesGot;
  eyesMissedEl.textContent   = eyesMissed;

  // Pre-load both images
  eyesImgEl.src = `${base}/${eyeFile}.jpg`;
  faceImgEl.src = `${base}/${faceFile}.jpg`;

  // Reset reveal state
  eyesRevealed = false;
  eyesLayerEl.classList.remove('hidden');
  faceLayerEl.classList.add('hidden');
  eyesCardEl.classList.remove('revealed');
  preRevealEl.classList.remove('hidden');
  postRevealEl.classList.add('hidden');
}

function revealEyes() {
  if (eyesRevealed) return;
  eyesRevealed = true;

  eyesCardEl.classList.add('revealed');

  // After flip animation, switch layers
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
  scoreEl.classList.remove('score-pop');
  void scoreEl.offsetWidth; // force reflow
  scoreEl.classList.add('score-pop');

  vibrate(got ? [10, 30, 10] : [20]);

  eyesIdx++;

  if (eyesIdx >= activePack.pairCount) {
    showEyesSummary();
  } else {
    renderEyesCard();
  }
}

function showEyesSummary() {
  eyesProgressEl.style.width = '100%';
  const total    = activePack.pairCount;
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
gotItBtn.addEventListener('click', () => scoreEyes(true));
missedBtn.addEventListener('click', () => scoreEyes(false));
eyesBackBtn.addEventListener('click', showHome);
eyesHomeBtn.addEventListener('click', showHome);
eyesPlayAgainBtn.addEventListener('click', () => startEyesPack(activePack.id));

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
    if (key === 'r' && !eyesRevealed) { revealEyes(); return; }
    if (key === 'g' && eyesRevealed)  { scoreEyes(true); return; }
    if (key === 'm' && eyesRevealed)  { scoreEyes(false); return; }
  }

  // DMK game shortcuts
  if (!gameEl.classList.contains('hidden')) {
    if ((key === 'enter' || key === ' ') && !nextBtn.disabled) {
      e.preventDefault();
      nextBtn.click();
      return;
    }
    if (key === 'escape' && selectedCard) {
      selectedCard.classList.remove('selected');
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

const QBANK_CAT_CLASS = {
  'Controversial': 'qcat-controversial',
  'Power Scaling': 'qcat-power',
  'Industry':      'qcat-industry',
  'General':       'qcat-general',
};

const QBANK_FILTER_CLASS = {
  'All':           'qf-all',
  'Controversial': 'qf-controversial',
  'Power Scaling': 'qf-power',
  'Industry':      'qf-industry',
  'General':       'qf-general',
};

const QBANK_STAT_COLOR = {
  'Controversial': 'var(--qc-controversial)',
  'Power Scaling': 'var(--qc-power)',
  'Industry':      'var(--qc-industry)',
  'General':       'var(--qc-general)',
};

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
  if (metaEl) metaEl.textContent = `${qbankItems.length} questions · ${asked} asked · Drag to reorder`;
}

function renderQbankFilters() {
  const filtersEl = document.getElementById('qbankFilters');
  if (!filtersEl) return;
  filtersEl.innerHTML = QBANK_CATEGORIES.map(cat => {
    const isActive = qbankFilter === cat;
    const cls = isActive ? QBANK_FILTER_CLASS[cat] : 'qf-inactive';
    return `<button class="qbank-filter-btn ${cls}" data-cat="${cat}">${cat}</button>`;
  }).join('');
  filtersEl.querySelectorAll('.qbank-filter-btn').forEach(btn => {
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
      <div class="qbank-empty">
        <span class="qbank-empty-icon">📭</span>
        No questions in this category yet.
      </div>`;
    return;
  }

  listEl.innerHTML = filtered.map((q, i) => {
    const checked   = !!qbankChecked[q.id];
    const catCls    = QBANK_CAT_CLASS[q.category] || 'qcat-general';
    const shotCount = qbankShotData[q.id]?.count ?? 0;
    const hasShots  = shotCount > 0;
    return `
      <div class="qcard${checked ? ' qcard-checked' : ''}" data-id="${q.id}" draggable="true">
        <div class="qcard-num">${i + 1}</div>
        <div class="qcard-body">
          <div class="qcard-text">${q.text}</div>
          <div class="qcard-tags">
            <span class="qcat-pill ${catCls}">${q.category}</span>
            ${q.viral ? '<span class="qviral-pill">🔥 Viral Pick</span>' : ''}
          </div>
        </div>
        <div class="qcard-actions">
          <button class="qcard-btn qbtn-shoot${hasShots ? ' has-shots' : ''}" data-id="${q.id}" title="Record a shot for this question">
            🎬 <span class="shoot-count">${shotCount}</span>
          </button>
          <button class="qcard-btn qbtn-check${checked ? ' active' : ''}" data-id="${q.id}" title="Mark as asked">✓</button>
          <button class="qcard-btn qbtn-del" data-id="${q.id}" title="Delete">✕</button>
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

    // Drag to reorder
    card.addEventListener('dragstart', () => {
      qbankDragId = id;
    });
    card.addEventListener('dragend', () => {
      qbankDragId = null;
      card.classList.remove('qcard-drag-over');
    });
    card.addEventListener('dragover', e => {
      e.preventDefault();
      if (qbankDragId != null && qbankDragId !== id) card.classList.add('qcard-drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('qcard-drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('qcard-drag-over');
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

function qbankToggleCheck(id, card) {
  qbankChecked[id] = !qbankChecked[id];
  const checked = qbankChecked[id];
  card.classList.toggle('qcard-checked', checked);
  const checkBtn = card.querySelector('.qbtn-check');
  if (checkBtn) checkBtn.classList.toggle('active', checked);
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
    btn.classList.add('has-shots');
    const countEl = btn.querySelector('.shoot-count');
    if (countEl) {
      countEl.textContent = qbankShotData[id].count;
      countEl.classList.remove('shoot-pop');
      void countEl.offsetWidth; // force reflow for animation replay
      countEl.classList.add('shoot-pop');
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
    document.querySelectorAll('.qcard').forEach((c, i) => {
      const n = c.querySelector('.qcard-num');
      if (n) n.textContent = i + 1;
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
      return `<div class="qbank-stat"><b style="color:${QBANK_STAT_COLOR[cat]}">${count}</b> ${cat}</div>`;
    }),
    `<div class="qbank-stat"><b style="color:var(--qc-controversial)">${viral}</b> Viral</div>`,
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
        return `<span class="${/:$/.test(match) ? 'json-key' : 'json-str'}">${match}</span>`;
      }
      if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`;
      if (/null/.test(match))       return `<span class="json-null">${match}</span>`;
      return `<span class="json-num">${match}</span>`;
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
    <div class="qjs-stat">
      <span class="qjs-num" style="color:var(--qc-industry)">${data.summary.totalShots}</span>
      <span class="qjs-label">Total Shots</span>
    </div>
    <div class="qjs-stat">
      <span class="qjs-num" style="color:var(--qc-power)">${data.summary.totalQuestionsUsed}</span>
      <span class="qjs-label">Questions Used</span>
    </div>
    <div class="qjs-stat">
      <span class="qjs-num" style="color:var(--qc-general)">${qbankItems.length}</span>
      <span class="qjs-label">In Bank</span>
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
    input.style.borderColor = 'var(--qc-controversial)';
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
