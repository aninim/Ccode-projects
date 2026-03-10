// ============================================================
// ENGINEERING MODULE — Screen: engineering-quiz
// 8 tools · Levels: 0=emoji+label, 1=emoji only, 2=reversed (name→emoji)
// ============================================================
const EngineeringQuiz = (() => {
  const TOOLS = [
    { tool:'🔨', name:'פַּטִּישׁ',     nameEn:'Hammer'      },
    { tool:'🔧', name:'מַפְתֵּחַ',    nameEn:'Wrench'      },
    { tool:'✂️', name:'מִסְפָּרַיִם', nameEn:'Scissors'    },
    { tool:'📏', name:'סַרְגֵּל',     nameEn:'Ruler'       },
    { tool:'🔩', name:'בֹּרֶג',       nameEn:'Screw'       },
    { tool:'🪛', name:'מַבְרֵג',      nameEn:'Screwdriver' },
    { tool:'🪚', name:'מְסוֹר',       nameEn:'Saw'         },
    { tool:'🧲', name:'מַגְנֵט',      nameEn:'Magnet'      },
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

  function _getLevel() { return Math.min(_journeyCount, 2); }

  function _journeyDone() {
    _journeyCount++;
    Confetti.burst();
    Progress.recordModuleCompletion('engineering');
    const msgs = Lang.strings().journeyMsgs;
    Speech.speak(msgs[Math.min(_journeyCount - 1, msgs.length - 1)]);
    setTimeout(() => Journey.start('engineering-journey', 6, _journeyDone), 1400);
  }

  function init() {
    _pool         = _shuffle(Adaptive.buildPool('engineering', TOOLS, t => t.nameEn));
    _idx          = 0;
    _answered     = false;
    _journeyCount = 0;
    Journey.start('engineering-journey', 6, _journeyDone);
    _render();
    Speech.speak(Lang.isHe() ? 'איזה כלי?' : 'Which tool?');
  }

  function _render() {
    _answered = false;
    const level  = _getLevel();
    const target = TOOLS[_pool[_idx % _pool.length]];

    if (level < 2) {
      // Show emoji, pick name
      document.getElementById('engineering-display').textContent = target.tool;
      document.getElementById('engineering-label').textContent   =
        level === 0 ? (Lang.isHe() ? target.name : target.nameEn) : '';
      Speech.speak(target.name);

      const wrongs  = _shuffle(TOOLS.filter(t => t.nameEn !== target.nameEn)).slice(0, 3);
      const choices = _shuffle([target, ...wrongs]);
      const grid    = document.getElementById('engineering-choices');
      grid.innerHTML = '';
      choices.forEach(item => {
        const btn = document.createElement('button');
        btn.className   = 'choice-btn';
        btn.textContent = Lang.isHe() ? item.name : item.nameEn;
        btn.onclick     = () => _handle(btn, item.nameEn === target.nameEn, target, false);
        grid.appendChild(btn);
      });
    } else {
      // Reversed: show name, pick emoji
      document.getElementById('engineering-display').textContent = '';
      document.getElementById('engineering-label').textContent   =
        Lang.isHe() ? target.name : target.nameEn;
      Speech.speak(target.name);

      const wrongs  = _shuffle(TOOLS.filter(t => t.nameEn !== target.nameEn)).slice(0, 3);
      const choices = _shuffle([target, ...wrongs]);
      const grid    = document.getElementById('engineering-choices');
      grid.innerHTML = '';
      choices.forEach(item => {
        const btn = document.createElement('button');
        btn.className   = 'choice-btn';
        btn.textContent = item.tool;
        btn.onclick     = () => _handle(btn, item.nameEn === target.nameEn, target, true);
        grid.appendChild(btn);
      });
    }
  }

  function _handle(btn, isCorrect, target, reversed) {
    if (_answered) return;
    _answered = true;
    const correctLabel = reversed
      ? target.tool
      : (Lang.isHe() ? target.name : target.nameEn);

    if (isCorrect) {
      btn.classList.add('correct');
      Progress.record('engineering', target.nameEn, true);
      Claude.trackCorrect('engineering', target.nameEn);
      Speech.speak(Lang.p());
      App.addStar();
      Confetti.burst();
      Journey.advance();
      setTimeout(() => { btn.classList.remove('correct'); _idx++; _render(); }, 1300);
    } else {
      btn.classList.add('wrong');
      Progress.record('engineering', target.nameEn, false);
      Claude.trackWrong('engineering', target.nameEn, btn.textContent);
      Speech.speak(Lang.ta());
      setTimeout(() => {
        btn.classList.remove('wrong');
        document.querySelectorAll('#engineering-choices .choice-btn').forEach(b => {
          if (b.textContent === correctLabel) b.classList.add('correct');
        });
        setTimeout(() => {
          document.querySelectorAll('#engineering-choices .choice-btn').forEach(b => b.classList.remove('correct'));
          _idx++;
          _render();
        }, 1000);
      }, 800);
    }
  }

  return { init };
})();
