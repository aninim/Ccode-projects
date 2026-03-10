// ============================================================
// SHAPES MODULE — Phase 3
// 6 basic shapes in Hebrew, recognition quiz
// ============================================================

const SHAPES = [
  { id:'circle',    char:'●', name:'עִיגּוּל',  color:'#FF6B35' },
  { id:'square',    char:'■', name:'רִיבּוּעַ',  color:'#00B4A6' },
  { id:'triangle',  char:'▲', name:'מְשֻׁלָּשׁ', color:'#A78BFA' },
  { id:'star',      char:'★', name:'כּוֹכָב',   color:'#FFD166' },
  { id:'heart',     char:'♥', name:'לֵב',      color:'#EF476F' },
  { id:'rectangle', char:'▬', name:'מַלְבֵּן',  color:'#06D6A0' },
];

const ShapesQuiz = (() => {
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
    Progress.recordModuleCompletion('shapes');
    const msgs = Lang.strings().journeyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
    setTimeout(() => Journey.start('shapes-journey', 6, _journeyDone), 1400);
  }

  function init() {
    sessionOrder  = _shuffle(Adaptive.buildPool('shapes', SHAPES, s => s.id));
    currentIdx    = 0;
    _journeyCount = 0;
    Journey.start('shapes-journey', 6, _journeyDone);
    _renderQuestion();
  }

  function _renderQuestion() {
    answered = false;
    const target = SHAPES[sessionOrder[currentIdx % sessionOrder.length]];
    const level  = Math.min(_journeyCount, 2);

    const display = document.getElementById('shape-display');

    if (level >= 2) {
      // Round 3+: audio only — hide shape, show headphones
      display.textContent = '🎧';
      display.style.color = '#1A1A2E';
      Speech.speak(target.name);
      setTimeout(() => Speech.speak(target.name), 1800);
    } else if (level >= 1) {
      // Round 2: monochrome shape — no color hint
      display.textContent = target.char;
      display.style.color = '#888';
      Speech.speak(target.name);
    } else {
      // Round 1: full color + name spoken
      display.textContent = target.char;
      display.style.color = target.color;
      Speech.speak(target.name);
    }

    // 4-choice grid — each button shows a shape character
    const wrongs  = _shuffle(SHAPES.filter(s => s.id !== target.id)).slice(0, 3);
    const choices = _shuffle([target, ...wrongs]);
    const grid    = document.getElementById('shapes-choices');
    grid.innerHTML = '';
    choices.forEach(item => {
      const btn = document.createElement('button');
      btn.className      = 'choice-btn';
      btn.style.color    = level >= 1 ? '#888' : item.color;
      btn.style.fontSize = 'clamp(2.2rem, 9vw, 3.5rem)';
      btn.textContent    = item.char;
      btn.onclick        = () => _handleChoice(btn, item.id === target.id, target);
      grid.appendChild(btn);
    });
  }

  function _handleChoice(btn, isCorrect, target) {
    if (answered) return;
    answered = true;

    if (isCorrect) {
      btn.classList.add('correct');
      Progress.record('shapes', target.id, true);
      Claude.trackCorrect('shapes', target.id);
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      const journeyDone = Journey.advance();
      const delay = journeyDone ? 2600 : 1300;
      setTimeout(() => { btn.classList.remove('correct'); currentIdx++; _renderQuestion(); }, delay);
    } else {
      btn.classList.add('wrong');
      Progress.record('shapes', target.id, false);
      Claude.trackWrong('shapes', target.id, target.name);
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#shapes-choices .choice-btn').forEach(b => {
          if (b.textContent === target.char) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#shapes-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          currentIdx++;
          _renderQuestion();
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
