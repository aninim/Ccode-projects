// ============================================================
// MEMORY MATCH MODULE — Screen 11
// 2×4 card grid, adaptive pair count by age group.
// Ages 3–4: 4 cards (2 pairs) · 5–6: 8 cards (4 pairs) · 7–8: 12 cards (6 pairs)
// Content pools: animals, Hebrew letters, shapes
// ============================================================

const MemoryMatch = (() => {
  // Content pool — animals for all ages, expandable
  const ANIMALS = ['🦁','🐘','🐬','🦊','🐧','🦋'];

  // For 7–8 age we also mix in Hebrew letters
  const LETTER_PAIRS = ['א','ב','ג','ד','ה','ו'];

  let cards = [];       // emoji/letter per card position
  let flipped = [];     // indices of currently face-up (not yet matched) cards
  let matched = [];     // indices of fully matched cards
  let lockBoard = false;
  let pairsFound = 0;
  let totalPairs = 0;
  let _journeyCount = 0;

  function _getPairCount() {
    const age = parseInt(localStorage.getItem('ylmd_age') || '0');
    if (age === 0) return 2;   // 3–4: 4 cards
    if (age === 1) return 4;   // 5–6: 8 cards
    return 6;                  // 7–8: 12 cards
  }

  function _getPool(n) {
    const age = parseInt(localStorage.getItem('ylmd_age') || '0');
    if (age >= 2) {
      // Mix animals and letters for oldest group
      return [...ANIMALS, ...LETTER_PAIRS].slice(0, n);
    }
    return ANIMALS.slice(0, n);
  }

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _journeyDone() {
    _journeyCount++;
    Confetti.burst();
    Progress.recordModuleCompletion('memory');
    Speech.speak(Lang.strings().journeyMsgs[Math.min(_journeyCount - 1, 2)]);
    setTimeout(() => {
      pairsFound = 0; flipped = []; matched = []; lockBoard = false;
      const pool = _getPool(totalPairs);
      cards = _shuffle([...pool, ...pool]);
      Journey.start('memory-journey', totalPairs, _journeyDone);
      _render();
      Speech.speak(Lang.t('memoryTask'));
    }, 1400);
  }

  function init() {
    totalPairs   = _getPairCount();
    pairsFound   = 0;
    flipped      = [];
    matched      = [];
    lockBoard    = false;
    _journeyCount = 0;

    const pool = _getPool(totalPairs);
    cards = _shuffle([...pool, ...pool]);

    Journey.start('memory-journey', totalPairs, _journeyDone);
    _render();
    Speech.speak(Lang.t('memoryTask'));
  }

  function _render() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Always 2 columns; rows = totalPairs
    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';

    cards.forEach((face, i) => {
      const isMatched = matched.includes(i);
      const isFaceUp  = flipped.includes(i) || isMatched;

      const card = document.createElement('div');
      card.className = 'memory-card' +
        (isMatched ? ' matched' : '') +
        (isFaceUp  ? ' face-up' : '');
      card.dataset.index = i;

      const front = document.createElement('div');
      front.className = 'mc-front';
      front.textContent = face;

      const back = document.createElement('div');
      back.className = 'mc-back';
      back.textContent = '🃏';

      card.appendChild(back);
      card.appendChild(front);

      if (!isMatched) {
        card.addEventListener('click', () => _flipCard(i));
      }
      grid.appendChild(card);
    });

    // Update reward banner
    const reward = document.getElementById('memory-reward');
    if (reward) {
      if (pairsFound > 0) {
        const remaining = totalPairs - pairsFound;
        reward.style.display = 'flex';
        reward.querySelector('.mr-title').textContent =
          Lang.t('memoryFound') + ' +2 ⭐';
        reward.querySelector('.mr-sub').textContent =
          remaining > 0
            ? `${remaining} ${Lang.t('memoryPairsLeft')}`
            : Lang.t('memoryComplete');
      } else {
        reward.style.display = 'none';
      }
    }
  }

  function _flipCard(index) {
    if (lockBoard) return;
    if (flipped.includes(index)) return;
    if (matched.includes(index)) return;
    if (flipped.length >= 2) return;

    flipped.push(index);
    _render();
    Speech.speak(cards[index]);

    if (flipped.length === 2) {
      lockBoard = true;
      setTimeout(_checkMatch, 900);
    }
  }

  function _checkMatch() {
    const [a, b] = flipped;
    if (cards[a] === cards[b]) {
      // Match!
      matched.push(a, b);
      pairsFound++;
      // Record correct answer (adds 1 to totalStars in progress store)
      Progress.record('memory', cards[a], true);
      App.addStar();
      Speech.speak(Theme.getPraise());
      flipped = [];
      lockBoard = false;
      _render();
      Journey.advance();
    } else {
      // No match — flip back after brief pause
      _render();
      setTimeout(() => {
        flipped = [];
        lockBoard = false;
        _render();
      }, 700);
    }
  }

  return { init };
})();
