import { trios, chars } from './data.js';

// ============= STATE =============
let currentTrioIdx = 0;
const placements = {};  // { '0::Zero Two': 'date', ... }
let trioPlacements = {}; // current trio: { date: 'Zero Two', ... }
let selectedCard = null;

// ============= ELEMENTS =============
const charactersEl  = document.getElementById('characters');
const zonesEls      = document.querySelectorAll('.zone');
const roundNameEl   = document.getElementById('roundName');
const trioCounterEl = document.getElementById('trioCounter');
const progressFillEl= document.getElementById('progressFill');
const hintEl        = document.getElementById('hint');
const nextBtn       = document.getElementById('nextBtn');
const resetBtn      = document.getElementById('resetBtn');
const restartBtn    = document.getElementById('restartBtn');
const gameEl        = document.getElementById('game');
const summaryEl     = document.getElementById('summary');
const summaryContentEl = document.getElementById('summaryContent');

// ============= HELPERS =============
const initialsOf = (name) => name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
const safeImg    = (filename) => encodeURI(filename);

function updateHint() {
  const placedCount = Object.keys(trioPlacements).length;
  if (placedCount === 3) {
    hintEl.textContent = '✅ All three placed — tap Next →';
    hintEl.classList.remove('action');
  } else if (selectedCard) {
    hintEl.textContent = `✨ "${selectedCard.dataset.name}" selected — tap Date, Marry or Kill`;
    hintEl.classList.add('action');
  } else {
    hintEl.textContent = '👆 Tap a character, then tap a zone — or drag & drop';
    hintEl.classList.remove('action');
  }
}

// ============= RENDER =============
function renderTrio() {
  const trio = trios[currentTrioIdx];
  roundNameEl.textContent = trio.round;
  trioCounterEl.textContent = `Trio ${currentTrioIdx + 1} / ${trios.length}`;
  progressFillEl.style.width = `${(currentTrioIdx / trios.length) * 100}%`;

  charactersEl.innerHTML = trio.characters.map((name) => {
    const c = chars[name];
    return `
      <div class="char-card group relative rounded-2xl overflow-hidden border-2 border-brand-border cursor-pointer transition-all duration-300 hover:border-brand-pink hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-pink/20 active:scale-95" draggable="true" data-name="${name}">
        <img class="w-full h-full object-cover bg-gradient-to-br from-brand-border to-bg-card" src="${safeImg(c.img)}" alt="${name}"
             onerror="this.outerHTML='<div class=&quot;w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-pink to-brand-blue text-2xl font-black text-white&quot;>${initialsOf(name)}</div>'">
        <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-pink text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-[.selected]:opacity-100 transition-opacity">selected</div>
        <div class="char-info absolute inset-x-0 bottom-0 p-3 pt-10 pointer-events-none">
          <div class="text-xs sm:text-sm font-black leading-tight text-white drop-shadow-md">${name}</div>
          <div class="text-[10px] sm:text-xs text-text-dim drop-shadow-md mt-0.5">${c.anime}</div>
        </div>
      </div>
    `;
  }).join('');

  // Reset zones
  zonesEls.forEach(zone => {
    const z = zone.dataset.zone;
    const emoji = z === 'date' ? '💕' : z === 'marry' ? '💍' : '💀';
    const label = z[0].toUpperCase() + z.slice(1);
    const colorClass = z === 'date' ? 'text-brand-gold' : z === 'marry' ? 'text-brand-green' : 'text-brand-red';
    const borderClass = z === 'date' ? 'border-brand-gold/40' : z === 'marry' ? 'border-brand-green/40' : 'border-brand-red/40';
    
    zone.className = `zone group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed ${borderClass} bg-bg-card/40 transition-all duration-200 cursor-pointer active:scale-95`;
    zone.innerHTML = `<div class="text-3xl sm:text-4xl">${emoji}</div><div class="text-xs sm:text-sm font-bold uppercase tracking-wider ${colorClass}">${label}</div>`;
  });

  trioPlacements = {};
  selectedCard = null;
  nextBtn.disabled = true;
  nextBtn.textContent = currentTrioIdx === trios.length - 1 ? 'See results 🎬' : 'Next →';

  attachCardHandlers();
  updateHint();
}

function attachCardHandlers() {
  document.querySelectorAll('.char-card').forEach(card => {
    // ----- Tap to select -----
    card.addEventListener('click', () => {
      if (card.dataset.placed === 'true') return;
      if (selectedCard === card) {
        selectedCard.classList.remove('selected', 'ring-2', 'ring-brand-pink');
        selectedCard = null;
      } else {
        if (selectedCard) selectedCard.classList.remove('selected', 'ring-2', 'ring-brand-pink');
        selectedCard = card;
        card.classList.add('selected', 'ring-2', 'ring-brand-pink');
      }
      updateHint();
    });

    // ----- HTML5 drag (desktop) -----
    card.addEventListener('dragstart', e => {
      if (card.dataset.placed === 'true') { e.preventDefault(); return; }
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', card.dataset.name);
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });
}

// ----- Zones: tap-to-place + drag-and-drop -----
zonesEls.forEach(zone => {
  zone.addEventListener('click', () => {
    if (zone.classList.contains('filled')) return;
    if (!selectedCard) {
      // gentle nudge
      hintEl.textContent = '👆 First tap a character above';
      hintEl.classList.add('action');
      setTimeout(updateHint, 1400);
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

// Sync "armed" state on zones when a card is selected
const armedObserver = new MutationObserver(() => {
  zonesEls.forEach(z => {
    if (selectedCard && !z.classList.contains('filled')) z.classList.add('armed');
    else z.classList.remove('armed');
  });
});
armedObserver.observe(charactersEl, { attributes: true, subtree: true, attributeFilter: ['class'] });

// ============= PLACE =============
function placeCharacter(name, zone) {
  if (Object.values(trioPlacements).includes(name)) return;
  const z = zone.dataset.zone;

  // Mark source card placed
  const card = document.querySelector(`.char-card[data-name="${CSS.escape(name)}"]`);
  if (card) {
    card.dataset.placed = 'true';
    card.classList.add('opacity-25', 'pointer-events-none', 'scale-95');
    card.classList.remove('hover:border-brand-pink', 'hover:-translate-y-1', 'cursor-pointer');
  }

  trioPlacements[z] = name;
  placements[`${currentTrioIdx}::${name}`] = z;

  const c = chars[name];
  const emoji = z === 'date' ? '💕' : z === 'marry' ? '💍' : '💀';
  const borderClass = z === 'date' ? 'border-brand-gold' : z === 'marry' ? 'border-brand-green' : 'border-brand-red';
  
  zone.className = `zone filled relative overflow-hidden rounded-2xl border-2 ${borderClass} bg-bg-card transition-all duration-300`;
  zone.innerHTML = `
    <div class="relative w-full h-full group">
      <img src="${safeImg(c.img)}" alt="${name}" class="w-full h-full object-cover"
           onerror="this.outerHTML='<div class=&quot;w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-pink to-brand-blue text-lg font-black text-white&quot;>${initialsOf(name)}</div>'">
      <div class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-sm border border-white/10">${emoji}</div>
      <div class="absolute inset-x-0 bottom-0 p-2 pt-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
        <div class="text-[10px] font-bold text-white leading-tight truncate">${name}</div>
      </div>
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
  // wipe placements for this trio only
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
      if (verdict) byRound[trio.round].push({ name, verdict, anime: chars[name].anime, img: chars[name].img });
    });
  });

  let html = '';
  for (const [round, items] of Object.entries(byRound)) {
    html += `
      <div class="summary-section space-y-4">
        <h3 class="text-xl font-bold text-brand-blue/80 border-b border-brand-border pb-2">${round}</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
    `;
    items.forEach(item => {
      const label = item.verdict === 'date' ? '💕 Date' : item.verdict === 'marry' ? '💍 Marry' : '💀 Kill';
      const colorClass = item.verdict === 'date' ? 'text-brand-gold' : item.verdict === 'marry' ? 'text-brand-green' : 'text-brand-red';
      const borderClass = item.verdict === 'date' ? 'border-brand-gold' : item.verdict === 'marry' ? 'border-brand-green' : 'border-brand-red';
      
      html += `
        <div class="relative rounded-xl overflow-hidden border border-brand-border bg-bg-card group hover:border-brand-pink transition-colors">
          <div class="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-wider ${colorClass}">
            ${label}
          </div>
          <div class="aspect-square overflow-hidden">
            <img src="${safeImg(item.img)}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 onerror="this.outerHTML='<div class=&quot;w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-pink to-brand-blue text-xl font-black text-white&quot;>${initialsOf(item.name)}</div>'">
          </div>
          <div class="p-2.5 text-center">
            <div class="text-xs font-bold text-white truncate">${item.name}</div>
            <div class="text-[9px] text-text-dim truncate mt-0.5">${item.anime}</div>
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
