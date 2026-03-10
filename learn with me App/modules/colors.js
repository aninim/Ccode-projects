// ============================================================
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
    const choices = _shuffle([target, ...wrongs]);
    const grid    = document.getElementById('colors-choices');
    grid.innerHTML = '';
    choices.forEach(item => {
      const btn = document.createElement('button');
      btn.className   = 'choice-btn';
      btn.textContent = Lang.isHe() ? item.name : item.nameEn;
      btn.onclick     = () => _handle(btn, item.nameEn === target.nameEn, target);
      grid.appendChild(btn);
    });
  }

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
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
