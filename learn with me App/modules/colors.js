// ============================================================
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
      // Round 3+: Hebrew word only — must match word to color swatch
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
    const choices = _shuffle([target, ...wrongs]);
    const grid    = document.getElementById('colors-choices');
    grid.innerHTML = '';
    choices.forEach(item => {
      const btn = document.createElement('button');
      btn.className            = 'choice-btn';
      btn.style.background     = item.hex;
      btn.style.minHeight      = '96px';
      btn.style.border         = '3px solid rgba(255,255,255,0.3)';
      btn.dataset.colorId      = item.id;
      // Level 0: show name label inside swatch
      if (level === 0) {
        const span = document.createElement('span');
        span.style.cssText = 'color:white;font-weight:800;text-shadow:0 1px 3px rgba(0,0,0,0.5);font-size:clamp(0.9rem,3.5vw,1.2rem);';
        span.textContent = item.name;
        btn.appendChild(span);
      }
      btn.onclick = () => _handleChoice(btn, item.id === target.id, target);
      grid.appendChild(btn);
    });
  }

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
        document.querySelectorAll('#colors-choices .choice-btn').forEach(b => {
          if (b.dataset.colorId === target.id) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#colors-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          currentIdx++;
          _renderQuestion();
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
