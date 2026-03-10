// ============================================================
// SHAPES MODULE — Screen: shapes-quiz
// 2D shapes for both age tiers, with emoji display
// ============================================================
const ShapesQuiz = (() => {
  const SHAPES = [
    { shape:'⬤',  name:'עִגּוּל',   nameEn:'Circle'   },
    { shape:'■',  name:'רִיבּוּעַ',  nameEn:'Square'   },
    { shape:'▲',  name:'מְשֻׁלָּשׁ', nameEn:'Triangle' },
    { shape:'▬',  name:'מַלְבֵּן',   nameEn:'Rectangle'},
    { shape:'⬟',  name:'מְעַיָּן',   nameEn:'Diamond'  },
    { shape:'⭐', name:'כּוֹכָב',    nameEn:'Star'     },
    { shape:'❤️', name:'לֵב',       nameEn:'Heart'    },
    { shape:'🌙', name:'יָרֵחַ',    nameEn:'Moon'     },
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
    Progress.recordModuleCompletion('shapes');
    const msgs = Lang.strings().journeyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
    setTimeout(() => Journey.start('shapes-journey', 6, _journeyDone), 1400);
  }

  function init() {
    _pool         = _shuffle(Adaptive.buildPool('shapes', SHAPES, s => s.nameEn));
    _idx          = 0;
    _answered     = false;
    _journeyCount = 0;
    Journey.start('shapes-journey', 6, _journeyDone);
    _render();
    Speech.speak(Lang.isHe() ? 'איזו צורה?' : 'Which shape?');
  }

  function _render() {
    _answered = false;
    const target = SHAPES[_pool[_idx % _pool.length]];

    document.getElementById('shape-display').textContent = target.shape;
    Speech.speak(target.name);

    const wrongs  = _shuffle(SHAPES.filter(s => s.nameEn !== target.nameEn)).slice(0, 3);
    const choices = _shuffle([target, ...wrongs]);
    const grid    = document.getElementById('shapes-choices');
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
      Progress.record('shapes', target.nameEn, true);
      Claude.trackCorrect('shapes', target.nameEn);
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      Journey.advance();
      setTimeout(() => { btn.classList.remove('correct'); _idx++; _render(); }, 1300);
    } else {
      btn.classList.add('wrong');
      Progress.record('shapes', target.nameEn, false);
      Claude.trackWrong('shapes', target.nameEn, btn.textContent);
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#shapes-choices .choice-btn').forEach(b => {
          const label = Lang.isHe() ? target.name : target.nameEn;
          if (b.textContent === label) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#shapes-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          _idx++;
          _render();
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
