// ============================================================
// LETTERS MODULE — Phase 1 (Quiz) + Phase 2 (Tracing)
// Tracing logic lives here per spec — no separate tracing.js
// ============================================================

// ---- Letter data ----
const LETTERS = [
  { letter:'א', name:'אָלֶף',  word:'אֲרִי',    emoji:'🦁' },
  { letter:'ב', name:'בֵּית',  word:'בַּיִת',   emoji:'🏠' },
  { letter:'ג', name:'גִּימֶל', word:'גָּמָל',   emoji:'🐪' },
  { letter:'ד', name:'דָּלֶת',  word:'דָּג',     emoji:'🐟' },
  { letter:'ה', name:'הֵא',    word:'הַר',      emoji:'⛰️' },
  { letter:'ו', name:'וָו',    word:'וֶרֶד',    emoji:'🌹' },
  { letter:'ז', name:'זַיִן',  word:'זֶבְרָה',  emoji:'🦓' },
  { letter:'ח', name:'חֵית',   word:'חָתוּל',   emoji:'🐱' },
  { letter:'ט', name:'טֵית',   word:'טַיִס',    emoji:'✈️' },
  { letter:'י', name:'יוֹד',   word:'יֶלֶד',    emoji:'👦' },
  { letter:'כ', name:'כַּף',   word:'כֶּלֶב',   emoji:'🐶' },
  { letter:'ל', name:'לָמֶד',  word:'לֵב',      emoji:'❤️' },
  { letter:'מ', name:'מֵם',    word:'מָגֵן',    emoji:'🛡️' },
  { letter:'נ', name:'נוּן',   word:'נָחָשׁ',   emoji:'🐍' },
  { letter:'ס', name:'סָמֶך',  word:'סוּס',     emoji:'🐴' },
  { letter:'ע', name:'עַיִן',  word:'עֵץ',      emoji:'🌳' },
  { letter:'פ', name:'פֵּא',   word:'פִּיל',    emoji:'🐘' },
  { letter:'צ', name:'צָדִי',  word:'צִפּוֹר',  emoji:'🐦' },
  { letter:'ק', name:'קוֹף',   word:'קוֹף',     emoji:'🐒' },
  { letter:'ר', name:'רֵישׁ',  word:'רַכֶּבֶת', emoji:'🚂' },
  { letter:'ש', name:'שִׁין',  word:'שֶׁמֶשׁ',  emoji:'☀️' },
  { letter:'ת', name:'תָּו',   word:'תַּפּוּחַ', emoji:'🍎' },
];

// ---- Stroke paths for tracing ----
// Coordinates are normalized [0-1] within a square canvas.
// Each entry has an array of strokes; each stroke is a polyline (array of [x,y]).
// Writing direction: generally right-to-left for Hebrew.
const LETTER_STROKES = {
  'א': { strokes: [
    [[0.75,0.20],[0.58,0.45]],                               // Upper-right arm
    [[0.68,0.18],[0.50,0.50],[0.32,0.82]],                   // Main diagonal
    [[0.42,0.55],[0.22,0.80]],                               // Lower-left arm
  ]},
  'ב': { strokes: [
    [[0.75,0.25],[0.25,0.25],[0.25,0.73],[0.75,0.73]],       // Cup: top-left-bottom
  ]},
  'ג': { strokes: [
    [[0.72,0.25],[0.25,0.25],[0.25,0.75],[0.48,0.75]],       // Top-left-down + short foot
  ]},
  'ד': { strokes: [
    [[0.72,0.25],[0.25,0.25]],                               // Top bar: right→left ✓
    [[0.72,0.25],[0.72,0.75]],                               // Right vertical: top→bottom
  ]},
  'ה': { strokes: [
    [[0.72,0.25],[0.72,0.75]],                               // Right full vertical
    [[0.72,0.40],[0.28,0.40]],                               // Horizontal bridge
    [[0.28,0.40],[0.28,0.75]],                               // Left lower vertical
  ]},
  'ו': { strokes: [
    [[0.50,0.22],[0.50,0.80]],                               // Single vertical
  ]},
  'ז': { strokes: [
    [[0.72,0.25],[0.25,0.25],[0.58,0.80]],                   // Top bar right→left, then diagonal ✓
  ]},
  'ח': { strokes: [
    [[0.72,0.25],[0.72,0.75]],                               // Right vertical
    [[0.72,0.38],[0.28,0.38]],                               // Bridge
    [[0.28,0.25],[0.28,0.75]],                               // Left vertical
  ]},
  'ט': { strokes: [
    [[0.72,0.28],[0.28,0.28],[0.28,0.72],[0.72,0.72],[0.72,0.28]], // Outer box
    [[0.60,0.28],[0.60,0.65]],                               // Inner right stroke
  ]},
  'י': { strokes: [
    [[0.60,0.20],[0.50,0.35],[0.42,0.55]],                   // Small curved stroke
  ]},
  'כ': { strokes: [
    [[0.72,0.25],[0.25,0.25],[0.25,0.72],[0.68,0.62]],       // C-shape
  ]},
  'ל': { strokes: [
    [[0.52,0.15],[0.52,0.45],[0.38,0.60],[0.35,0.78]],       // Upward hook then down-left
  ]},
  'מ': { strokes: [
    [[0.72,0.25],[0.28,0.25],[0.28,0.68],[0.50,0.80],[0.72,0.68],[0.72,0.25]], // Closed shape
  ]},
  'נ': { strokes: [
    [[0.65,0.25],[0.65,0.60],[0.48,0.73],[0.28,0.73]],       // Stem curving left
  ]},
  'ס': { strokes: [
    [[0.65,0.30],[0.65,0.70],[0.50,0.80],[0.30,0.70],[0.30,0.30],[0.50,0.20],[0.65,0.30]], // Oval
  ]},
  'ע': { strokes: [
    [[0.25,0.25],[0.38,0.58],[0.50,0.72]],                   // Left arm down
    [[0.75,0.25],[0.62,0.58],[0.50,0.72]],                   // Right arm down
  ]},
  'פ': { strokes: [
    [[0.72,0.25],[0.28,0.25],[0.28,0.55],[0.50,0.63],[0.72,0.55],[0.72,0.25]], // Arch
    [[0.50,0.63],[0.50,0.82]],                               // Stem
  ]},
  'צ': { strokes: [
    [[0.42,0.25],[0.42,0.62]],                               // Left stem
    [[0.68,0.25],[0.68,0.55],[0.42,0.62],[0.55,0.82]],       // Right arm + foot
  ]},
  'ק': { strokes: [
    [[0.65,0.25],[0.28,0.25],[0.28,0.65],[0.65,0.65],[0.65,0.25]], // Top box
    [[0.65,0.25],[0.65,0.85]],                               // Right stem below baseline
  ]},
  'ר': { strokes: [
    [[0.72,0.25],[0.25,0.25]],                               // Top bar: right→left ✓
    [[0.72,0.25],[0.72,0.75]],                               // Right vertical: top→bottom
  ]},
  'ש': { strokes: [
    [[0.78,0.25],[0.22,0.25]],                               // Top horizontal: right→left ✓
    [[0.22,0.25],[0.22,0.75]],                               // Left vertical
    [[0.50,0.25],[0.50,0.75]],                               // Middle vertical
    [[0.78,0.25],[0.78,0.75]],                               // Right vertical
  ]},
  'ת': { strokes: [
    [[0.72,0.25],[0.22,0.25],[0.22,0.75]],                   // Left leg (reversed-L)
    [[0.72,0.25],[0.72,0.75]],                               // Right leg
  ]},
};

// ============================================================
// LETTERS QUIZ — Phase 1
// ============================================================
const LettersQuiz = (() => {
  let sessionOrder = [];
  let currentIdx   = 0;
  let answered     = false;
  let wrongCount   = 0;  // tracks wrong attempts per question (reset each new question)

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let _journeyCount = 0;

  function _journeyDone() {
    _journeyCount++;
    Confetti.burst();
    Progress.recordModuleCompletion('letters');
    const msgs = Lang.strings().journeyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
    setTimeout(() => Journey.start('letters-journey', 6, _journeyDone), 1400);
  }

  function init() {
    sessionOrder  = _shuffle(Adaptive.buildPool('letters', LETTERS, a => a.letter));
    currentIdx    = 0;
    _journeyCount = 0;
    Journey.start('letters-journey', 6, _journeyDone);
    _renderQuestion();
  }

  function _renderQuestion() {
    answered   = false;
    wrongCount = 0;
    const target = LETTERS[sessionOrder[currentIdx % sessionOrder.length]];
    const level  = Math.min(_journeyCount, 2);

    if (level >= 2) {
      // Round 3+: audio only
      document.getElementById('quiz-letter').textContent = '🎧';
      document.getElementById('quiz-word').textContent   = Lang.t('listenAndFind');
      Speech.speak(target.name);
      setTimeout(() => Speech.speak(target.name), 1800);
    } else if (level >= 1) {
      // Round 2: letter only, no word/emoji
      document.getElementById('quiz-letter').textContent = target.letter;
      document.getElementById('quiz-word').textContent   = '';
      Speech.speak(target.name);
    } else {
      // Round 1: full hints
      document.getElementById('quiz-letter').textContent = target.letter;
      document.getElementById('quiz-word').textContent   = target.emoji + '  ' + target.word;
      Speech.speak(target.name);
    }

    // Build 4-choice grid
    const wrongs  = _shuffle(LETTERS.filter(l => l.letter !== target.letter)).slice(0, 3);
    const choices = _shuffle([target, ...wrongs]);
    const grid    = document.getElementById('letters-choices');
    grid.innerHTML = '';
    choices.forEach(item => {
      const btn = document.createElement('button');
      btn.className   = 'choice-btn';
      btn.textContent = item.letter;
      btn.onclick     = () => _handleChoice(btn, item.letter === target.letter, target);
      grid.appendChild(btn);
    });
  }

  function _handleChoice(btn, isCorrect, target) {
    if (answered) return;
    answered = true;

    if (isCorrect) {
      btn.classList.add('correct');
      Progress.record('letters', target.letter, true);
      Claude.trackCorrect('letters', target.letter);
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      const journeyDone = Journey.advance();
      const delay = journeyDone ? 2600 : 1300;
      setTimeout(() => { btn.classList.remove('correct'); currentIdx++; _renderQuestion(); }, delay);
    } else {
      wrongCount++;
      btn.classList.add('wrong');
      Progress.record('letters', target.letter, false);
      Claude.trackWrong('letters', target.letter, target.letter);
      Speech.speak(Lang.ta());

      const age = localStorage.getItem('ylmd_age') || '5-6';
      const isRetryAllowed = age === '5-6' && wrongCount < 2;

      if (isRetryAllowed) {
        // Age 5–6, first wrong: flash red then unlock for one retry
        setTimeout(() => {
          btn.classList.remove('wrong');
          answered = false;
        }, 700);
      } else {
        // Age 3–4 (any wrong) or age 5–6 second wrong: reveal correct then advance
        setTimeout(() => {
          btn.classList.remove('wrong');
          document.querySelectorAll('#letters-choices .choice-btn').forEach(b => {
            if (b.textContent === target.letter) b.classList.add('correct');
          });
          setTimeout(() => {
            document.querySelectorAll('#letters-choices .choice-btn').forEach(b => b.classList.remove('correct'));
            currentIdx++;
            _renderQuestion();
          }, 1000);
        }, 800);
      }
    }
  }

  return { init };
})();

// ============================================================
// TRACING MODULE — Phase 2
// ============================================================
const Tracing = (() => {
  const SCORE_THRESHOLD = 0.62; // combined score to pass
  const TOLERANCE_RATIO = 0.09; // 9% of canvas size (~27px on 300px) — still child-friendly
  const MIN_ACCURACY    = 0.44; // minimum % of drawn points on the letter (blocks random scribbling)
  const MIN_COVERAGE    = 0.40; // minimum % of the letter that must be covered

  let canvas, ctx, canvasSize;
  let currentIdx    = 0;
  let sessionScore  = {};   // letter → correct count this session
  let _journeyCount = 0;    // how many journeys completed → controls difficulty
  let userPoints    = [];
  let isDrawing     = false;
  let scoreTimer    = null;
  let detachDom     = null;
  let _modeOverride = null; // set by phase-pill clicks; null = auto
  let _showNikud    = true; // nikud toggle state

  function _traceJourneyDone() {
    _journeyCount++;
    Confetti.burst();
    Progress.recordModuleCompletion('tracing');
    const msgs = Lang.strings().traceJourneyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
    setTimeout(() => Journey.start('trace-journey', 6, _traceJourneyDone), 1400);
  }

  // Named handlers so we can off() them cleanly
  // Rotate through warm, child-friendly colors for each letter
  const _inkColors = ['#FF6B35','#A78BFA','#00B4A6','#EF476F','#FFB703','#06D6A0'];

  function _onDrawStart(e) {
    isDrawing = true;
    if (scoreTimer) { clearTimeout(scoreTimer); scoreTimer = null; }
    // Clamp to canvas bounds — prevents bezier control points going off-canvas
    const cx = Math.max(0, Math.min(canvasSize - 1, e.x));
    const cy = Math.max(0, Math.min(canvasSize - 1, e.y));
    userPoints.push([cx, cy]);
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = _inkColors[currentIdx % _inkColors.length];
    ctx.lineWidth   = Math.max(7, canvasSize * 0.028);
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
  }
  function _onDraw(e) {
    if (!isDrawing) return;
    // Clamp to canvas bounds — prevents stroke snapping to edge on fast swipes
    const cx = Math.max(0, Math.min(canvasSize - 1, e.x));
    const cy = Math.max(0, Math.min(canvasSize - 1, e.y));
    // Quadratic Bezier smoothing: draw through prev point to midpoint.
    // This snaps shaky input into smooth curves in real time.
    const prev = userPoints[userPoints.length - 1];
    userPoints.push([cx, cy]);
    const midX = (prev[0] + cx) / 2;
    const midY = (prev[1] + cy) / 2;
    ctx.quadraticCurveTo(prev[0], prev[1], midX, midY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(midX, midY);
  }
  function _onDrawEnd() {
    if (!isDrawing) return;
    isDrawing = false;
    if (userPoints.length >= 6) {
      scoreTimer = setTimeout(_score, 1800); // auto-score after 1.8s of inactivity
    }
  }

  function init() {
    canvas     = document.getElementById('trace-canvas');
    ctx        = canvas.getContext('2d');

    // Responsive canvas size
    canvasSize = Math.min(
      Math.floor(window.innerWidth  * 0.82),
      Math.floor(window.innerHeight * 0.48),
      340
    );
    canvas.width  = canvasSize;
    canvas.height = canvasSize;
    canvas.style.width  = canvasSize + 'px';
    canvas.style.height = canvasSize + 'px';

    currentIdx    = 0;
    sessionScore  = {};
    _journeyCount = 0;
    userPoints    = [];
    isDrawing     = false;
    _maskCache    = null; // reset if canvas size changed
    _modeOverride = null;
    _showNikud    = true;
    Journey.start('trace-journey', 6, _traceJourneyDone);

    // Attach DOM events
    if (detachDom) detachDom();
    detachDom = Input.attachCanvas(canvas);

    Input.on('DRAW_START', _onDrawStart);
    Input.on('DRAW',       _onDraw);
    Input.on('DRAW_END',   _onDrawEnd);

    _renderLetter();
  }

  function cleanup() {
    if (scoreTimer) { clearTimeout(scoreTimer); scoreTimer = null; }
    Input.off('DRAW_START', _onDrawStart);
    Input.off('DRAW',       _onDraw);
    Input.off('DRAW_END',   _onDrawEnd);
    if (detachDom) { detachDom(); detachDom = null; }
  }

  function _mode(letter) {
    // Manual override via phase pills takes precedence
    if (_modeOverride) return _modeOverride;
    // Journey count sets the floor difficulty for all letters;
    // per-letter session score can push it higher within a journey.
    const sessionLevel   = sessionScore[letter] || 0;
    const effectiveLevel = Math.max(sessionLevel, _journeyCount);
    if (effectiveLevel >= 2) return 'free';
    if (effectiveLevel >= 1) return 'faded';
    return 'guided';
  }

  function _renderLetter() {
    const data   = LETTERS[currentIdx];
    const letter = data.letter;
    const mode   = _mode(letter);

    // Sync clickable phase pills
    const modeMap = Lang.strings().modes;
    ['guided','faded','free'].forEach(m => {
      const btn = document.getElementById('trace-pill-' + m);
      if (btn) {
        btn.textContent = modeMap[m];
        btn.classList.toggle('active', m === mode);
      }
    });

    // Letter display with optional nikud strip
    const displayName = _showNikud ? data.name : _stripNikud(data.name);
    document.getElementById('trace-letter-display').textContent = data.emoji + '  ' + displayName;

    // Render letter chips (first 8 letters visible)
    _renderLetterChips();

    userPoints = [];
    _drawGuide(letter, mode);

    Speech.speak(Lang.t('traceTip') + '  ' + data.name);
  }

  // Strip Unicode nikud marks (U+0591–U+05C7) from a Hebrew string
  function _stripNikud(str) {
    return str.replace(/[\u0591-\u05C7]/g, '');
  }

  // Render the letter progress chips strip (first 8 letters)
  function _renderLetterChips() {
    const container = document.getElementById('trace-letter-chips');
    if (!container) return;
    container.innerHTML = '';
    const visibleCount = 8;
    const start = Math.max(0, currentIdx - Math.floor(visibleCount / 2));
    const end   = Math.min(LETTERS.length, start + visibleCount);
    for (let i = start; i < end; i++) {
      const chip = document.createElement('div');
      const isDone    = i < currentIdx;
      const isCurrent = i === currentIdx;
      chip.className = 'letter-chip' + (isDone ? ' done' : isCurrent ? ' current' : '');
      chip.textContent = LETTERS[i].letter;
      container.appendChild(chip);
    }
  }

  function _drawGuide(letter, mode) {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (mode !== 'free') {
      // Render the actual Hebrew letter as the tracing guide
      const alpha = mode === 'guided' ? 0.18 : 0.08;
      ctx.globalAlpha  = alpha;
      ctx.fillStyle    = '#1A1A2E';
      ctx.font         = `bold ${Math.floor(canvasSize * 0.76)}px "Varela Round", "Rubik", sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter, canvasSize / 2, canvasSize * 0.52);
      ctx.globalAlpha  = 1.0;
      ctx.textAlign    = 'start';
      ctx.textBaseline = 'alphabetic';
    }

    // Guided mode: start dot + direction arrow from stroke path hint
    if (mode === 'guided') {
      const sd = LETTER_STROKES[letter];
      if (sd && sd.strokes[0] && sd.strokes[0].length >= 2) {
        const s  = sd.strokes[0];
        const sx = s[0][0] * canvasSize, sy = s[0][1] * canvasSize;
        const ex = s[1][0] * canvasSize, ey = s[1][1] * canvasSize;
        ctx.fillStyle = '#FF6B35';
        ctx.beginPath();
        ctx.arc(sx, sy, canvasSize * 0.035, 0, Math.PI * 2);
        ctx.fill();
        _drawArrow(sx, sy, ex, ey, '#FF6B35');
      }
    }
  }

  function _drawArrow(x1, y1, x2, y2, color) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const as = canvasSize * 0.038; // arrow size
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(mx + ux * as,               my + uy * as);
    ctx.lineTo(mx - ux * as - uy * as * 0.5, my - uy * as + ux * as * 0.5);
    ctx.lineTo(mx - ux * as + uy * as * 0.5, my - uy * as - ux * as * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  // Render the letter to an offscreen canvas and return its alpha pixel data.
  // Cached per letter so we don't re-render on every stroke.
  let _maskCache = null;
  function _getLetterMask(letter) {
    if (_maskCache && _maskCache.letter === letter && _maskCache.size === canvasSize) {
      return _maskCache.data;
    }
    const off    = document.createElement('canvas');
    off.width    = off.height = canvasSize;
    const offCtx = off.getContext('2d');
    offCtx.fillStyle    = '#000';
    offCtx.font         = `bold ${Math.floor(canvasSize * 0.76)}px "Varela Round", "Rubik", sans-serif`;
    offCtx.textAlign    = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(letter, canvasSize / 2, canvasSize * 0.52);
    const data = offCtx.getImageData(0, 0, canvasSize, canvasSize).data;
    _maskCache = { letter, size: canvasSize, data };
    return data;
  }

  // True if point (px,py) falls within tolerance of any letter pixel in mask.
  function _pointOnLetter(px, py, mask, tol) {
    const xi = Math.round(px), yi = Math.round(py);
    const step = Math.max(1, Math.floor(tol / 3));
    for (let dy = -tol; dy <= tol; dy += step) {
      for (let dx = -tol; dx <= tol; dx += step) {
        if (dx * dx + dy * dy > tol * tol) continue;
        const nx = xi + dx, ny = yi + dy;
        if (nx < 0 || nx >= canvasSize || ny < 0 || ny >= canvasSize) continue;
        if (mask[(ny * canvasSize + nx) * 4 + 3] > 30) return true;
      }
    }
    return false;
  }

  function _score() {
    if (userPoints.length < 6) return;
    const letter = LETTERS[currentIdx].letter;
    const mask   = _getLetterMask(letter);
    const tol    = Math.round(canvasSize * TOLERANCE_RATIO);

    // Accuracy: % of user points that land on the letter
    let onLetter = 0;
    for (const [px, py] of userPoints) {
      if (_pointOnLetter(px, py, mask, tol)) onLetter++;
    }
    const accuracy = onLetter / userPoints.length;

    // Coverage: sample every 4th pixel of the letter; check if user drew over it
    let letterPts = 0, covered = 0;
    for (let y = 0; y < canvasSize; y += 4) {
      for (let x = 0; x < canvasSize; x += 4) {
        if (mask[(y * canvasSize + x) * 4 + 3] <= 30) continue;
        letterPts++;
        for (const [px, py] of userPoints) {
          if (Math.hypot(px - x, py - y) <= tol) { covered++; break; }
        }
      }
    }
    const coverage = letterPts > 0 ? covered / letterPts : 0;

    const score = accuracy * 0.40 + coverage * 0.60;

    // Hard gate: blocks random scribbling even if the combined score would pass
    if (accuracy < MIN_ACCURACY || coverage < MIN_COVERAGE) {
      Progress.record('letters_trace', LETTERS[currentIdx].letter, false);
      Speech.speak(Lang.t('traceTryAgain'));
      _flashGuide(LETTERS[currentIdx].letter);
      return;
    }

    if (score >= SCORE_THRESHOLD) {
      sessionScore[letter] = (sessionScore[letter] || 0) + 1;
      Progress.record('letters_trace', letter, true);
      App.addStar();
      Confetti.burst();
      Speech.speak(Lang.t('traceGood'));
      _showSuccess();
      const journeyDone = Journey.advance();
      setTimeout(() => next(), journeyDone ? 2800 : 1900);
    } else {
      Progress.record('letters_trace', letter, false);
      Speech.speak(Lang.t('traceTryAgain'));
      _flashGuide(letter);
    }
  }

  function _showSuccess() {
    ctx.fillStyle = 'rgba(6,214,160,0.25)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle   = '#06D6A0';
    ctx.font        = `bold ${canvasSize * 0.28}px Varela Round, sans-serif`;
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓', canvasSize / 2, canvasSize / 2);
    ctx.globalAlpha  = 1.0;
    ctx.textAlign    = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  function _flashGuide(letter) {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    const sd = LETTER_STROKES[letter];
    if (!sd) return;
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth   = canvasSize * 0.06;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    sd.strokes.forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0][0] * canvasSize, stroke[0][1] * canvasSize);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i][0] * canvasSize, stroke[i][1] * canvasSize);
      }
      ctx.stroke();
    });
    ctx.globalAlpha = 1.0;

    setTimeout(() => {
      userPoints = [];
      _drawGuide(letter, _mode(letter));
    }, 1300);
  }

  function clear() {
    if (scoreTimer) { clearTimeout(scoreTimer); scoreTimer = null; }
    userPoints = [];
    _drawGuide(LETTERS[currentIdx].letter, _mode(LETTERS[currentIdx].letter));
  }

  function next() {
    if (scoreTimer) { clearTimeout(scoreTimer); scoreTimer = null; }
    currentIdx = (currentIdx + 1) % LETTERS.length;
    _renderLetter();
  }

  // Called by phase pill buttons — overrides auto-difficulty
  function setMode(mode) {
    _modeOverride = mode;
    if (scoreTimer) { clearTimeout(scoreTimer); scoreTimer = null; }
    userPoints = [];
    _renderLetter(); // redraws guide + syncs pills
  }

  // Toggle nikud display on letter name
  function toggleNikud() {
    _showNikud = !_showNikud;
    const btn = document.getElementById('nikud-toggle');
    if (btn) {
      btn.classList.toggle('on', _showNikud);
      const s = Lang.strings();
      btn.textContent = _showNikud ? (s.nikudOn || 'ניקוד ✓') : (s.nikudOff || 'ניקוד ✗');
    }
    _renderLetter();
  }

  return { init, cleanup, clear, next, setMode, toggleNikud };
})();
