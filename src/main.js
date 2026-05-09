import { gameModes, chars } from './data.js';

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
const modeGridEl       = document.getElementById('modeGrid');
const charactersEl     = document.getElementById('characters');
const zonesEls         = document.querySelectorAll('.zone');
const modeTitleEl      = document.getElementById('modeTitle');
const roundNameEl      = document.getElementById('roundName');
const trioCounterEl    = document.getElementById('trioCounter');
const progressFillEl   = document.getElementById('progressFill');
const hintEl           = document.getElementById('hint');
const nextBtn          = document.getElementById('nextBtn');
const resetBtn         = document.getElementById('resetBtn');
const backBtn          = document.getElementById('backBtn');
const summaryContentEl = document.getElementById('summaryContent');
const playAgainBtn     = document.getElementById('playAgainBtn');
const homeBtn          = document.getElementById('homeBtn');

// ============= HELPERS =============
const initialsOf = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const safeImg    = (src)  => src ? encodeURI(src) : null;

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
  screen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============= HOME SCREEN =============
function showHome() {
  modeGridEl.innerHTML = gameModes.map(mode => {
    const tagPills = mode.tags
      .map(t => `<span class="tag-pill ${tagClass(t)}">${t}</span>`)
      .join('');
    const roundCount = mode.trios.length;
    return `
      <button class="mode-card" data-accent="${mode.accent}" data-mode="${mode.id}" type="button">
        <div class="mode-card-emoji">${mode.emoji}</div>
        <div class="mode-card-title">${mode.title}</div>
        <div class="mode-card-desc">${mode.description}</div>
        <div class="mode-card-footer">
          <div class="tag-pills">${tagPills}</div>
          <span class="mode-card-rounds">${roundCount} round${roundCount !== 1 ? 's' : ''}</span>
        </div>
      </button>
    `;
  }).join('');

  modeGridEl.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => startMode(card.dataset.mode));
  });

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
  } else if (selectedCard) {
    hintEl.innerHTML = `<span class="hint-icon">✨</span><span>"${selectedCard.dataset.name}" — tap a zone</span>`;
    hintEl.classList.add('action');
  } else {
    hintEl.innerHTML = `<span class="hint-icon">👆</span><span>Tap a character, then tap a zone</span>`;
    hintEl.classList.remove('action');
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
              onerror="this.outerHTML='<div class=\\"char-img-fallback\\">${fallback}</div>'">`
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
            onerror="this.outerHTML='<div class=\\"placed-fallback\\">${fallback}</div>'">`
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

  if (Object.keys(trioPlacements).length === 3) nextBtn.disabled = false;
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
                onerror="this.outerHTML='<div class=\\"summary-card-fallback\\">${fallback}</div>'">`
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

// ============= INIT =============
showHome();
