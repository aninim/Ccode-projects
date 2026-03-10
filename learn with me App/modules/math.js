// ============================================================
<<<<<<< HEAD
// MATH MODULE — Screen: math-quiz
// Tier 0 (3–4): count emoji objects 1–5
// Tier 1 (5–6): addition, sums ≤ 10
// ============================================================
const MathQuiz = (() => {
  let _q         = null;
  let _answered  = false;
  let _journeyCount = 0;

  function _getAge() { return parseInt(localStorage.getItem('ylmd_age') || '0'); }
=======
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
>>>>>>> fix/bug01-audio01

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

<<<<<<< HEAD
  // Generate a question object { display, answer, distractors }
  function _makeQuestion() {
    const age = _getAge();
    if (age === 0) {
      // Counting: show N emoji, pick number
      const EMOJI = ['🍎','🐢','⭐','🐶','🦋'];
      const emoji = EMOJI[Math.floor(Math.random() * EMOJI.length)];
      const n     = 1 + Math.floor(Math.random() * 5);
      const display = emoji.repeat(n);
      const answer  = n;
      // Nearby distractors
      const d = new Set();
      while (d.size < 3) {
        let v = n + Math.floor(Math.random() * 3) - 1;
        if (v < 1) v = n + 1;
        if (v > 5) v = n - 1;
        if (v !== n && v >= 1 && v <= 5) d.add(v);
      }
      return { display, answer, distractors: [...d] };
    } else {
      // Addition: a + b, sum ≤ 10
      const a = 1 + Math.floor(Math.random() * 5);
      const b = 1 + Math.floor(Math.random() * Math.min(5, 10 - a));
      const answer  = a + b;
      const display = `${a} + ${b} = ?`;
      const d = new Set();
      while (d.size < 3) {
        let v = answer + Math.floor(Math.random() * 5) - 2;
        if (v < 1) v = answer + 2;
        if (v > 10) v = answer - 2;
        if (v !== answer && v >= 1 && v <= 10) d.add(v);
      }
      return { display, answer, distractors: [...d] };
=======
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
>>>>>>> fix/bug01-audio01
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
<<<<<<< HEAD
    _journeyCount = 0;
    Journey.start('math-journey', 6, _journeyDone);
    _render();
    Speech.speak(Lang.isHe() ? 'כמה?' : 'How many?');
  }

  function _render() {
    _answered = false;
    _q        = _makeQuestion();

    document.getElementById('math-display').textContent = _q.display;

    const choices = _shuffle([_q.answer, ..._q.distractors]);
    const grid    = document.getElementById('math-choices');
    grid.innerHTML = '';
    choices.forEach(val => {
      const btn = document.createElement('button');
      btn.className   = 'choice-btn';
      btn.textContent = val;
      btn.onclick     = () => _handle(btn, val === _q.answer);
=======
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
      // Show emoji row
      display.innerHTML = `<div class="math-emoji-row">${(_question.displayEmoji + ' ').repeat(_question.displayCount).trim()}</div><div class="math-question-text">כמה?</div>`;
    } else {
      display.innerHTML = `<div class="math-equation">${_question.equation}</div>`;
    }

    const grid = document.getElementById('math-choices');
    grid.innerHTML = '';
    _question.choices.forEach(num => {
      const btn = document.createElement('button');
      btn.className   = 'choice-btn';
      btn.textContent = num;
      btn.style.fontSize = '2.4rem';
      btn.onclick = () => _handleChoice(btn, num === _question.answer);
>>>>>>> fix/bug01-audio01
      grid.appendChild(btn);
    });
  }

<<<<<<< HEAD
  function _handle(btn, isCorrect) {
    if (_answered) return;
    _answered = true;

    if (isCorrect) {
      btn.classList.add('correct');
      Progress.record('math', String(_q.answer), true);
      Claude.trackCorrect('math', String(_q.answer));
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      Journey.advance();
      setTimeout(() => { btn.classList.remove('correct'); _render(); }, 1300);
    } else {
      btn.classList.add('wrong');
      Progress.record('math', String(_q.answer), false);
      Claude.trackWrong('math', String(_q.answer), String(btn.textContent));
=======
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
>>>>>>> fix/bug01-audio01
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#math-choices .choice-btn').forEach(b => {
<<<<<<< HEAD
          if (parseInt(b.textContent) === _q.answer) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#math-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          _render();
=======
          if (Number(b.textContent) === _question.answer) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#math-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          currentIdx++;
          _renderQuestion();
>>>>>>> fix/bug01-audio01
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
