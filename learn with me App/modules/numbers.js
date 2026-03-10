// ============================================================
<<<<<<< HEAD
// NUMBERS MODULE — Screen: numbers-quiz
// Tier 0 (3–4): numbers 1–5 · Tier 1+ (5–6): numbers 1–10
// Display: large numeral + emoji row + Hebrew word
// ============================================================
const NumbersQuiz = (() => {
  const NUMBERS = [
    { num:1,  word:'אֶחָד',    emoji:'⭐' },
    { num:2,  word:'שְׁתַּיִם', emoji:'👀' },
    { num:3,  word:'שָׁלוֹשׁ',  emoji:'🔺' },
    { num:4,  word:'אַרְבַּע',  emoji:'🍀' },
    { num:5,  word:'חָמֵשׁ',   emoji:'🖐️' },
    { num:6,  word:'שֵׁשׁ',    emoji:'❄️' },
    { num:7,  word:'שֶׁבַע',   emoji:'🌈' },
    { num:8,  word:'שְׁמוֹנֶה', emoji:'🕷️' },
    { num:9,  word:'תֵּשַׁע',   emoji:'🎱' },
    { num:10, word:'עֶשֶׂר',   emoji:'🔟' },
  ];

  let _pool      = [];
  let _idx       = 0;
  let _answered  = false;
  let _journeyCount = 0;

  function _getSet() {
    const age = parseInt(localStorage.getItem('ylmd_age') || '0');
    return age === 0 ? NUMBERS.slice(0, 5) : NUMBERS;
  }
=======
// NUMBERS MODULE — Phase 1 (Quiz)
// ============================================================

const NUMBERS = [
  { num:1,  word:'אֶחָד',    emoji:'⭐' },
  { num:2,  word:'שְׁתַּיִם', emoji:'👀' },
  { num:3,  word:'שָׁלוֹשׁ',  emoji:'🔺' },
  { num:4,  word:'אַרְבַּע',  emoji:'🍀' },
  { num:5,  word:'חָמֵשׁ',   emoji:'🖐️' },
  { num:6,  word:'שֵׁשׁ',    emoji:'❄️' },
  { num:7,  word:'שֶׁבַע',   emoji:'🌈' },
  { num:8,  word:'שְׁמוֹנֶה', emoji:'🕷️' },
  { num:9,  word:'תֵּשַׁע',   emoji:'🎱' },
  { num:10, word:'עֶשֶׂר',   emoji:'🔟' },
];

const NumbersQuiz = (() => {
  let sessionOrder = [];
  let currentIdx   = 0;
  let answered     = false;
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
=======
  let _journeyCount = 0;

>>>>>>> fix/bug01-audio01
  function _journeyDone() {
    _journeyCount++;
    Confetti.burst();
    Progress.recordModuleCompletion('numbers');
    const msgs = Lang.strings().journeyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
<<<<<<< HEAD
    setTimeout(() => Journey.start('numbers-journey', 6, _journeyDone), 1400);
  }

  function init() {
    const set  = _getSet();
    _pool      = _shuffle(Adaptive.buildPool('numbers', set, n => String(n.num)));
    _idx       = 0;
    _answered  = false;
    _journeyCount = 0;
    Journey.start('numbers-journey', 6, _journeyDone);
    _render();
    Speech.speak(Lang.isHe() ? 'איזה מספר?' : 'Which number?');
  }

  function _render() {
    _answered = false;
    const set    = _getSet();
    const target = set[_pool[_idx % _pool.length]];

    // Large numeral
    document.getElementById('num-display').textContent = target.num;

    // Emoji row
    document.getElementById('num-emojis').textContent = target.emoji.repeat(target.num);

    // Hebrew word
    document.getElementById('num-word').textContent = target.word;
    Speech.speak(target.word);

    // 4 choices — pick num value
    const wrongs  = _shuffle(set.filter(n => n.num !== target.num)).slice(0, 3);
=======
    setTimeout(() => Journey.start('numbers-journey', 5, _journeyDone), 1400);
  }

  function init() {
    sessionOrder  = _shuffle(Adaptive.buildPool('numbers', NUMBERS, n => String(n.num)));
    currentIdx    = 0;
    _journeyCount = 0;
    Journey.start('numbers-journey', 5, _journeyDone);
    _renderQuestion();
  }

  function _renderQuestion() {
    answered = false;
    const target = NUMBERS[sessionOrder[currentIdx % sessionOrder.length]];
    const level  = Math.min(_journeyCount, 2);

    if (level >= 2) {
      // Round 3+: audio only
      document.getElementById('num-display').textContent = '🎧';
      document.getElementById('num-emojis').textContent  = '';
      document.getElementById('num-word').textContent    = Lang.t('listenAndFind');
      Speech.speak(target.word);
      setTimeout(() => Speech.speak(target.word), 1800);
    } else if (level >= 1) {
      // Round 2: number only, no emojis or word
      document.getElementById('num-display').textContent = target.num;
      document.getElementById('num-emojis').textContent  = '';
      document.getElementById('num-word').textContent    = '';
      Speech.speak(target.word);
    } else {
      // Round 1: full hints
      document.getElementById('num-display').textContent = target.num;
      document.getElementById('num-emojis').textContent  = (target.emoji + ' ').repeat(target.num).trim();
      document.getElementById('num-word').textContent    = target.word;
      Speech.speak(target.word);
    }

    // 4-choice grid
    const wrongs  = _shuffle(NUMBERS.filter(n => n.num !== target.num)).slice(0, 3);
>>>>>>> fix/bug01-audio01
    const choices = _shuffle([target, ...wrongs]);
    const grid    = document.getElementById('numbers-choices');
    grid.innerHTML = '';
    choices.forEach(item => {
      const btn = document.createElement('button');
      btn.className   = 'choice-btn';
<<<<<<< HEAD
      btn.textContent = item.num;
      btn.onclick     = () => _handle(btn, item.num === target.num, target);
=======
      btn.style.fontSize = '2.2rem';
      btn.textContent = item.num;
      btn.onclick     = () => _handleChoice(btn, item.num === target.num, target);
>>>>>>> fix/bug01-audio01
      grid.appendChild(btn);
    });
  }

<<<<<<< HEAD
  function _handle(btn, isCorrect, target) {
    if (_answered) return;
    _answered = true;
=======
  function _handleChoice(btn, isCorrect, target) {
    if (answered) return;
    answered = true;
>>>>>>> fix/bug01-audio01

    if (isCorrect) {
      btn.classList.add('correct');
      Progress.record('numbers', String(target.num), true);
      Claude.trackCorrect('numbers', String(target.num));
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
<<<<<<< HEAD
      Journey.advance();
      setTimeout(() => { btn.classList.remove('correct'); _idx++; _render(); }, 1300);
    } else {
      btn.classList.add('wrong');
      Progress.record('numbers', String(target.num), false);
      Claude.trackWrong('numbers', String(target.num), String(btn.textContent));
=======
      const journeyDone = Journey.advance();
      const delay = journeyDone ? 2600 : 1300;
      setTimeout(() => { btn.classList.remove('correct'); currentIdx++; _renderQuestion(); }, delay);
    } else {
      btn.classList.add('wrong');
      Progress.record('numbers', String(target.num), false);
      Claude.trackWrong('numbers', String(target.num), String(target.num));
>>>>>>> fix/bug01-audio01
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#numbers-choices .choice-btn').forEach(b => {
<<<<<<< HEAD
          if (parseInt(b.textContent) === target.num) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#numbers-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          _idx++;
          _render();
=======
          if (b.textContent === String(target.num)) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#numbers-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          currentIdx++;
          _renderQuestion();
>>>>>>> fix/bug01-audio01
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
