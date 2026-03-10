// ============================================================
<<<<<<< HEAD
// COLORS MODULE — Screen: colors-quiz
// Color swatch display, pick the Hebrew color name
// ============================================================
const ColorsQuiz = (() => {
  const COLORS = [
    { hex:'#FF3B30', name:'אָדֹם',   nameEn:'Red'    },
    { hex:'#FF9500', name:'כָּתֹם',  nameEn:'Orange' },
    { hex:'#FFCC00', name:'צָהֹב',   nameEn:'Yellow' },
    { hex:'#34C759', name:'יָרֹק',   nameEn:'Green'  },
    { hex:'#007AFF', name:'כָּחֹל',  nameEn:'Blue'   },
    { hex:'#AF52DE', name:'סָגֹל',   nameEn:'Purple' },
    { hex:'#FF2D55', name:'וָרֹד',   nameEn:'Pink'   },
    { hex:'#A2845E', name:'חוּם',    nameEn:'Brown'  },
    { hex:'#1C1C1E', name:'שָׁחֹר',  nameEn:'Black'  },
    { hex:'#F2F2F7', name:'לָבָן',   nameEn:'White'  },
  ];

  let _pool      = [];
  let _idx       = 0;
  let _answered  = false;
=======
// COLORS MODULE — Phase 3
// 8 basic colors in Hebrew, recognition quiz
// ============================================================

const COLORS_DATA = [
  { id:'red',    name:'אָדֹם',  hex:'#EF476F' },
  { id:'blue',   name:'כָּחֹל', hex:'#3A86FF' },
  { id:'yellow', name:'צָהֹב',  hex:'#FFD166' },
  { id:'green',  name:'יָרֹק',  hex:'#06D6A0' },
  { id:'orange', name:'כָּתֹם', hex:'#FF6B35' },
  { id:'purple', name:'סָגֹל',  hex:'#A78BFA' },
  { id:'pink',   name:'וָרֹד',  hex:'#FF85A1' },
  { id:'black',  name:'שָׁחֹר', hex:'#1A1A2E' },
];

const ColorsQuiz = (() => {
  let sessionOrder  = [];
  let currentIdx    = 0;
  let answered      = false;
>>>>>>> fix/bug01-audio01
  let _journeyCount = 0;

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
    Progress.recordModuleCompletion('colors');
    const msgs = Lang.strings().journeyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
<<<<<<< HEAD
    setTimeout(() => Journey.start('colors-journey', 6, _journeyDone), 1400);
  }

  function init() {
    _pool         = _shuffle(Adaptive.buildPool('colors', COLORS, c => c.nameEn));
    _idx          = 0;
    _answered     = false;
    _journeyCount = 0;
    Journey.start('colors-journey', 6, _journeyDone);
    _render();
    Speech.speak(Lang.isHe() ? 'איזה צבע?' : 'Which color?');
  }

  function _render() {
    _answered = false;
    const target = COLORS[_pool[_idx % _pool.length]];

    const swatch = document.getElementById('color-display');
    swatch.style.background = target.hex;
    swatch.style.border = target.hex === '#F2F2F7'
      ? '3px solid rgba(0,0,0,0.15)' : 'none';

    document.getElementById('color-name-label').textContent = '';
    Speech.speak(target.name);

    const wrongs  = _shuffle(COLORS.filter(c => c.nameEn !== target.nameEn)).slice(0, 3);
=======
    setTimeout(() => Journey.start('colors-journey', 8, _journeyDone), 1400);
  }

  function init() {
    sessionOrder  = _shuffle(Adaptive.buildPool('colors', COLORS_DATA, c => c.id));
    currentIdx    = 0;
    _journeyCount = 0;
    Journey.start('colors-journey', 8, _journeyDone);
    _renderQuestion();
  }

  function _renderQuestion() {
    answered = false;
    const target = COLORS_DATA[sessionOrder[currentIdx % sessionOrder.length]];
    const level  = Math.min(_journeyCount, 2);

    const display = document.getElementById('color-display');
    const nameEl  = document.getElementById('color-name-label');

    if (level >= 2) {
      // Round 3+: Hebrew word only (black text) — must match word to color swatch
      display.textContent       = target.name;
      display.style.background  = '#FFF9F0';
      display.style.border      = '3px dashed #ccc';
      display.style.color       = '#1A1A2E';
      display.style.fontSize    = 'clamp(2rem, 8vw, 3rem)';
      nameEl.textContent = '';
      Speech.speak(target.name);
      setTimeout(() => Speech.speak(target.name), 1800);
    } else if (level >= 1) {
      // Round 2: colored swatch only — no name text
      display.textContent       = '';
      display.style.background  = target.hex;
      display.style.border      = 'none';
      display.style.color       = 'transparent';
      display.style.fontSize    = '1rem';
      nameEl.textContent = '';
      Speech.speak(target.name);
    } else {
      // Round 1: colored swatch + Hebrew name below
      display.textContent       = '';
      display.style.background  = target.hex;
      display.style.border      = 'none';
      display.style.color       = 'transparent';
      display.style.fontSize    = '1rem';
      nameEl.textContent = target.name;
      Speech.speak(target.name);
    }

    // 4-choice grid — each button is a colored swatch
    const wrongs  = _shuffle(COLORS_DATA.filter(c => c.id !== target.id)).slice(0, 3);
>>>>>>> fix/bug01-audio01
    const choices = _shuffle([target, ...wrongs]);
    const grid    = document.getElementById('colors-choices');
    grid.innerHTML = '';
    choices.forEach(item => {
      const btn = document.createElement('button');
<<<<<<< HEAD
      btn.className   = 'choice-btn';
      btn.textContent = Lang.isHe() ? item.name : item.nameEn;
      btn.onclick     = () => _handle(btn, item.nameEn === target.nameEn, target);
=======
      btn.className            = 'color-choice-btn';
      btn.style.background     = item.hex;
      btn.dataset.colorId      = item.id;
      // Level 0: show name label inside swatch
      if (level === 0) {
        const span = document.createElement('span');
        span.className   = 'color-btn-name';
        span.textContent = item.name;
        btn.appendChild(span);
      }
      btn.onclick = () => _handleChoice(btn, item.id === target.id, target);
>>>>>>> fix/bug01-audio01
      grid.appendChild(btn);
    });
  }

<<<<<<< HEAD
  function _handle(btn, isCorrect, target) {
    if (_answered) return;
    _answered = true;

    if (isCorrect) {
      btn.classList.add('correct');
      document.getElementById('color-name-label').textContent =
        Lang.isHe() ? target.name : target.nameEn;
      Progress.record('colors', target.nameEn, true);
      Claude.trackCorrect('colors', target.nameEn);
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      Journey.advance();
      setTimeout(() => { btn.classList.remove('correct'); _idx++; _render(); }, 1300);
    } else {
      btn.classList.add('wrong');
      Progress.record('colors', target.nameEn, false);
      Claude.trackWrong('colors', target.nameEn, btn.textContent);
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#colors-choices .choice-btn').forEach(b => {
          const label = Lang.isHe() ? target.name : target.nameEn;
          if (b.textContent === label) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#colors-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          _idx++;
          _render();
=======
  function _handleChoice(btn, isCorrect, target) {
    if (answered) return;
    answered = true;

    if (isCorrect) {
      btn.classList.add('correct');
      Progress.record('colors', target.id, true);
      Claude.trackCorrect('colors', target.id);
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      const journeyDone = Journey.advance();
      const delay = journeyDone ? 2600 : 1300;
      setTimeout(() => { btn.classList.remove('correct'); currentIdx++; _renderQuestion(); }, delay);
    } else {
      btn.classList.add('wrong');
      Progress.record('colors', target.id, false);
      Claude.trackWrong('colors', target.id, target.name);
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#colors-choices .color-choice-btn').forEach(b => {
          if (b.dataset.colorId === target.id) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#colors-choices .color-choice-btn').forEach(b => b.classList.remove('correct'));
          currentIdx++;
          _renderQuestion();
>>>>>>> fix/bug01-audio01
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
