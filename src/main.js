import { gameModes, eyesPacks, chars } from './data.js';

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
  eyesScreenEl.classList.add('hidden');
  eyesSummaryEl.classList.add('hidden');
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
  `;

  modeGridEl.querySelectorAll('[data-game="dmk"]').forEach(card => {
    card.addEventListener('click', () => startMode(card.dataset.mode));
  });
  modeGridEl.querySelectorAll('[data-game="eyes"]').forEach(card => {
    card.addEventListener('click', () => startEyesPack(card.dataset.pack));
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

// ============= INIT =============
showHome();
