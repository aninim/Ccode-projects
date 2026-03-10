// ============================================================
// MATH MODULE
// Age-tiered arithmetic quiz.
// Tier 0 (age 3–4): counting emoji objects (1–5)
// Tier 1 (age 5–6): addition, sum ≤ 10
// Tier 2 (age 7–8): addition + subtraction, values ≤ 20
// ============================================================

const COUNT_EMOJIS = ['🍎','🌟','🎈','🐶','🌺','🏐','🦋','🎵','🍕','🎁','🐸','🍩'];

const MathQuiz = (() => {
  let currentIdx    = 0;
  let answered      = false;
  let _journeyCount = 0;
  let _question     = null;

  function _tier() {
    const age = parseInt(localStorage.getItem('ylmd_age') || '1');
    // Within each tier, journey count can push to harder sub-tier
    return Math.min(age + Math.floor(_journeyCount / 2), 2);
  }

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _nearbyWrongs(correct, min, max, count) {
    const wrongs = new Set();
    let tries = 0;
    while (wrongs.size < count && tries < 60) {
      const delta = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const w = correct + delta;
      if (w !== correct && w >= min && w <= max) wrongs.add(w);
      tries++;
    }
    // Fill if not enough
    for (let v = min; v <= max && wrongs.size < count; v++) {
      if (v !== correct) wrongs.add(v);
    }
    return [...wrongs].slice(0, count);
  }

  function _generate() {
    const tier = _tier();

    if (tier === 0) {
      // Counting: show N emojis, answer is N (1–5)
      const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
      const n     = 1 + Math.floor(Math.random() * 5);
      return {
        displayEmoji: emoji,
        displayCount: n,
        equation: null,
        answer: n,
        choices: _shuffle([n, ..._nearbyWrongs(n, 1, 8, 3)]),
        type: 'count',
      };
    }

    if (tier === 1) {
      // Addition, sum ≤ 10
      const a = 1 + Math.floor(Math.random() * 5);
      const b = 1 + Math.floor(Math.random() * (10 - a));
      const answer = a + b;
      return {
        displayEmoji: null,
        equation: `${a} + ${b} = ?`,
        answer,
        choices: _shuffle([answer, ..._nearbyWrongs(answer, 1, 12, 3)]),
        type: 'add',
      };
    }

    // Tier 2: addition/subtraction ≤ 20
    const op = Math.random() > 0.4 ? '+' : '-';
    if (op === '+') {
      const a = 2 + Math.floor(Math.random() * 10);
      const b = 2 + Math.floor(Math.random() * (20 - a));
      const answer = a + b;
      return {
        displayEmoji: null,
        equation: `${a} + ${b} = ?`,
        answer,
        choices: _shuffle([answer, ..._nearbyWrongs(answer, 1, 22, 3)]),
        type: 'add',
      };
    } else {
      const answer = 1 + Math.floor(Math.random() * 10);
      const b = 1 + Math.floor(Math.random() * 8);
      const a = answer + b;
      return {
        displayEmoji: null,
        equation: `${a} − ${b} = ?`,
        answer,
        choices: _shuffle([answer, ..._nearbyWrongs(answer, 0, 20, 3)]),
        type: 'sub',
      };
    }
  }

  function _journeyDone() {
    _journeyCount++;
    Confetti.burst();
    Progress.recordModuleCompletion('math');
    const msgs = Lang.strings().journeyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
    setTimeout(() => Journey.start('math-journey', 6, _journeyDone), 1400);
  }

  function init() {
    currentIdx    = 0;
    _journeyCount = 0;
    Journey.start('math-journey', 6, _journeyDone);
    _renderQuestion();
  }

  function _renderQuestion() {
    answered  = false;
    _question = _generate();

    const display = document.getElementById('math-display');
    if (_question.type === 'count') {
      display.innerHTML = `<div style="font-size:clamp(2rem,8vw,3rem);letter-spacing:0.1em;">${(_question.displayEmoji + ' ').repeat(_question.displayCount).trim()}</div><div style="font-size:1.1rem;color:var(--text-muted);margin-top:0.3rem;">${Lang.isHe() ? 'כמה?' : 'How many?'}</div>`;
    } else {
      display.innerHTML = `<div style="font-size:clamp(2.2rem,8vw,3.5rem);font-family:'Varela Round',sans-serif;">${_question.equation}</div>`;
    }

    const grid = document.getElementById('math-choices');
    grid.innerHTML = '';
    _question.choices.forEach(num => {
      const btn = document.createElement('button');
      btn.className   = 'choice-btn';
      btn.textContent = num;
      btn.style.fontSize = '2.4rem';
      btn.onclick = () => _handleChoice(btn, num === _question.answer);
      grid.appendChild(btn);
    });
  }

  function _handleChoice(btn, isCorrect) {
    if (answered) return;
    answered = true;

    if (isCorrect) {
      btn.classList.add('correct');
      Progress.record('math', String(_question.answer), true);
      Claude.trackCorrect('math', String(_question.answer));
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      const journeyDone = Journey.advance();
      const delay = journeyDone ? 2600 : 1300;
      setTimeout(() => { btn.classList.remove('correct'); currentIdx++; _renderQuestion(); }, delay);
    } else {
      btn.classList.add('wrong');
      Progress.record('math', String(_question.answer), false);
      Claude.trackWrong('math', String(_question.answer), String(_question.answer));
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#math-choices .choice-btn').forEach(b => {
          if (Number(b.textContent) === _question.answer) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#math-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          currentIdx++;
          _renderQuestion();
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
