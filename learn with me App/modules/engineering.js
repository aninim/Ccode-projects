// ============================================================
// ENGINEERING MODULE
// Tool recognition quiz with 3 difficulty levels.
// Level 0: see emoji + label → pick Hebrew name
// Level 1: see emoji only → pick Hebrew name
// Level 2: see Hebrew name → pick matching emoji (reversed!)
// ============================================================

const TOOLS = [
  { id:'hammer',      char:'🔨', name:'פַּטִּישׁ' },
  { id:'wrench',      char:'🔧', name:'מַפְתֵּחַ' },
  { id:'scissors',    char:'✂️', name:'מִסְפָּרַיִם' },
  { id:'screwdriver', char:'🪛', name:'מַבְרֵג' },
  { id:'saw',         char:'🪚', name:'מְנַסֵּר' },
  { id:'ruler',       char:'📏', name:'סַרְגֵּל' },
  { id:'ladder',      char:'🪜', name:'סוּלָּם' },
  { id:'gear',        char:'⚙️', name:'גַּלְגַּל שִׁינַּיִם' },
];

const EngineeringQuiz = (() => {
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
    Progress.recordModuleCompletion('engineering');
    const msgs = Lang.strings().journeyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
    setTimeout(() => Journey.start('engineering-journey', 8, _journeyDone), 1400);
  }

  function init() {
    sessionOrder  = _shuffle(Adaptive.buildPool('engineering', TOOLS, t => t.id));
    currentIdx    = 0;
    _journeyCount = 0;
    Journey.start('engineering-journey', 8, _journeyDone);
    _renderQuestion();
  }

  function _renderQuestion() {
    answered = false;
    const target = TOOLS[sessionOrder[currentIdx % sessionOrder.length]];
    const level  = Math.min(_journeyCount, 2);

    const display = document.getElementById('engineering-display');
    const label   = document.getElementById('engineering-label');

    const wrongs  = _shuffle(TOOLS.filter(t => t.id !== target.id)).slice(0, 3);
    const choices = _shuffle([target, ...wrongs]);
    const grid    = document.getElementById('engineering-choices');
    grid.innerHTML = '';

    if (level >= 2) {
      // Reversed: show Hebrew name → pick the right emoji
      display.textContent    = target.name;
      display.style.fontSize = 'clamp(1.8rem, 7vw, 3rem)';
      label.textContent      = '';
      Speech.speak(target.name);
      setTimeout(() => Speech.speak(target.name), 1800);

      // Choices: emoji buttons
      choices.forEach(item => {
        const btn = document.createElement('button');
        btn.className      = 'choice-btn';
        btn.style.fontSize = '3rem';
        btn.textContent    = item.char;
        btn.dataset.toolId = item.id;
        btn.onclick        = () => _handleChoice(btn, item.id === target.id, target, level);
        grid.appendChild(btn);
      });

    } else {
      // Level 0/1: show emoji → pick Hebrew name
      display.textContent    = target.char;
      display.style.fontSize = 'clamp(6rem, 20vw, 9rem)';
      label.textContent      = level === 0 ? target.name : '';
      Speech.speak(target.name);

      // Choices: name buttons
      choices.forEach(item => {
        const btn = document.createElement('button');
        btn.className      = 'choice-btn';
        btn.style.fontSize = 'clamp(1rem, 4vw, 1.4rem)';
        btn.textContent    = item.name;
        btn.dataset.toolId = item.id;
        btn.onclick        = () => _handleChoice(btn, item.id === target.id, target, level);
        grid.appendChild(btn);
      });
    }
  }

  function _handleChoice(btn, isCorrect, target, level) {
    if (answered) return;
    answered = true;

    if (isCorrect) {
      btn.classList.add('correct');
      Progress.record('engineering', target.id, true);
      Claude.trackCorrect('engineering', target.id);
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      const journeyDone = Journey.advance();
      const delay = journeyDone ? 2600 : 1300;
      setTimeout(() => { btn.classList.remove('correct'); currentIdx++; _renderQuestion(); }, delay);
    } else {
      btn.classList.add('wrong');
      Progress.record('engineering', target.id, false);
      Claude.trackWrong('engineering', target.id, target.name);
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#engineering-choices .choice-btn').forEach(b => {
          if (b.dataset.toolId === target.id) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#engineering-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          currentIdx++;
          _renderQuestion();
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
