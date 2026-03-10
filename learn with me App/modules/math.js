// ============================================================
// MATH MODULE — Screen: math-quiz
// Tier 0 (3–4): count emoji objects 1–5
// Tier 1 (5–6): addition, sums ≤ 10
// ============================================================
const MathQuiz = (() => {
  let _q         = null;
  let _answered  = false;
  let _journeyCount = 0;

  function _getAge() { return parseInt(localStorage.getItem('ylmd_age') || '0'); }

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

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
      grid.appendChild(btn);
    });
  }

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
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#math-choices .choice-btn').forEach(b => {
          if (parseInt(b.textContent) === _q.answer) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#math-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          _render();
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
