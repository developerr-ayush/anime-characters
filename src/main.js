import { trios, chars } from './data.js';

// ============= STATE =============
let currentTrioIdx = 0;
const placements = {};
let trioPlacements = {};
let selectedCard = null;

// ============= ELEMENTS =============
const charactersEl     = document.getElementById('characters');
const zonesEls         = document.querySelectorAll('.zone');
const roundNameEl      = document.getElementById('roundName');
const trioCounterEl    = document.getElementById('trioCounter');
const progressFillEl   = document.getElementById('progressFill');
const hintEl           = document.getElementById('hint');
const nextBtn          = document.getElementById('nextBtn');
const resetBtn         = document.getElementById('resetBtn');
const restartBtn       = document.getElementById('restartBtn');
const gameEl           = document.getElementById('game');
const summaryEl        = document.getElementById('summary');
const summaryContentEl = document.getElementById('summaryContent');

// ============= HELPERS =============
const initialsOf = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const safeImg    = (filename) => encodeURI(filename);

function updateHint() {
  const placed = Object.keys(trioPlacements).length;
  if (placed === 3) {
    hintEl.innerHTML = `<span class="hint-icon">✅</span><span>All placed — tap Next!</span>`;
    hintEl.classList.remove('action');
  } else if (selectedCard) {
    hintEl.innerHTML = `<span class="hint-icon">✨</span><span>"${selectedCard.dataset.name}" selected — tap a zone</span>`;
    hintEl.classList.add('action');
  } else {
    hintEl.innerHTML = `<span class="hint-icon">👆</span><span>Tap a character, then tap a zone</span>`;
    hintEl.classList.remove('action');
  }
}

// ============= RENDER =============
function renderTrio() {
  const trio = trios[currentTrioIdx];
  roundNameEl.textContent  = trio.round;
  trioCounterEl.textContent = `Trio ${currentTrioIdx + 1} / ${trios.length}`;
  progressFillEl.style.width = `${(currentTrioIdx / trios.length) * 100}%`;

  charactersEl.innerHTML = trio.characters.map((name) => {
    const c = chars[name];
    const fallback = initialsOf(name);
    return `
      <div class="char-card" draggable="true" data-name="${name}">
        <img class="char-img" src="${safeImg(c.img)}" alt="${name}"
             onerror="this.outerHTML='<div class=&quot;char-img-fallback&quot;>${fallback}</div>'">
        <div class="char-selected-badge">Selected</div>
        <div class="char-overlay">
          <div class="char-name">${name}</div>
          <div class="char-anime">${c.anime}</div>
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
  nextBtn.textContent = currentTrioIdx === trios.length - 1 ? 'See Results 🎬' : 'Next →';

  attachCardHandlers();
  updateHint();
}

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
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', card.dataset.name);
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });
}

// ============= ZONES =============
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

// ============= PLACE =============
function placeCharacter(name, zone) {
  if (Object.values(trioPlacements).includes(name)) return;
  const z = zone.dataset.zone;

  const card = document.querySelector(`.char-card[data-name="${CSS.escape(name)}"]`);
  if (card) {
    card.dataset.placed = 'true';
    card.classList.remove('selected');
  }

  trioPlacements[z] = name;
  placements[`${currentTrioIdx}::${name}`] = z;

  const c     = chars[name];
  const emoji = z === 'date' ? '💕' : z === 'marry' ? '💍' : '💀';
  const fallback = initialsOf(name);

  zone.classList.add('filled');
  zone.classList.remove('armed');
  zone.innerHTML = `
    <div class="placed-card">
      <img src="${safeImg(c.img)}" alt="${name}"
           onerror="this.outerHTML='<div class=&quot;placed-fallback&quot;>${fallback}</div>'">
      <div class="placed-emoji">${emoji}</div>
      <div class="placed-name">${name}</div>
    </div>
  `;

  if (Object.keys(trioPlacements).length === 3) nextBtn.disabled = false;
}

// ============= CONTROLS =============
nextBtn.addEventListener('click', () => {
  if (currentTrioIdx < trios.length - 1) {
    currentTrioIdx++;
    renderTrio();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showSummary();
  }
});

resetBtn.addEventListener('click', () => {
  trios[currentTrioIdx].characters.forEach(name => {
    delete placements[`${currentTrioIdx}::${name}`];
  });
  renderTrio();
});

restartBtn.addEventListener('click', () => {
  currentTrioIdx = 0;
  Object.keys(placements).forEach(k => delete placements[k]);
  summaryEl.classList.add('hidden');
  gameEl.classList.remove('hidden');
  renderTrio();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============= SUMMARY =============
function showSummary() {
  gameEl.classList.add('hidden');
  summaryEl.classList.remove('hidden');
  progressFillEl.style.width = '100%';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const byRound = {};
  trios.forEach((trio, idx) => {
    if (!byRound[trio.round]) byRound[trio.round] = [];
    trio.characters.forEach(name => {
      const verdict = placements[`${idx}::${name}`];
      if (verdict) byRound[trio.round].push({
        name, verdict, anime: chars[name].anime, img: chars[name].img,
      });
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
      html += `
        <div class="summary-card">
          <span class="verdict-chip ${item.verdict}">${label}</span>
          <div class="summary-card-img-wrap">
            <img src="${safeImg(item.img)}" alt="${item.name}"
                 onerror="this.outerHTML='<div class=&quot;summary-card-fallback&quot;>${fallback}</div>'">
          </div>
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
renderTrio();
