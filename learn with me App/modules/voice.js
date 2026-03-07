// ============================================================
// VOICE WORD GAME MODULE — Screen 10
// Child sees an emoji and says the Hebrew word out loud.
// Web Speech API (he-IL); 3 word-bubble buttons as touch fallback.
// If speech not available, fallback mode shows only buttons.
// ============================================================

const VoiceGame = (() => {
  // Content: emoji + Hebrew word + romanised label for speech matching
  const CONTENT = [
    { emoji:'🦁', word:'אֲרִי',    spoken:'ארי' },
    { emoji:'🏠', word:'בַּיִת',   spoken:'בית' },
    { emoji:'🐪', word:'גָּמָל',   spoken:'גמל' },
    { emoji:'🐟', word:'דָּג',     spoken:'דג'  },
    { emoji:'🌹', word:'וֶרֶד',    spoken:'ורד' },
    { emoji:'🐱', word:'חָתוּל',   spoken:'חתול'},
    { emoji:'👦', word:'יֶלֶד',    spoken:'ילד' },
    { emoji:'🐶', word:'כֶּלֶב',   spoken:'כלב' },
    { emoji:'❤️', word:'לֵב',      spoken:'לב'  },
    { emoji:'🐍', word:'נָחָשׁ',   spoken:'נחש' },
    { emoji:'🐴', word:'סוּס',     spoken:'סוס' },
    { emoji:'🐘', word:'פִּיל',    spoken:'פיל' },
    { emoji:'🐒', word:'קוֹף',     spoken:'קוף' },
    { emoji:'🚂', word:'רַכֶּבֶת', spoken:'רכבת'},
    { emoji:'☀️', word:'שֶׁמֶשׁ',  spoken:'שמש' },
    { emoji:'🍎', word:'תַּפּוּחַ', spoken:'תפוח'},
  ];

  let sessionOrder = [];
  let currentIdx   = 0;
  let recognition  = null;
  let listening    = false;
  let answered     = false;
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
    Progress.recordModuleCompletion('voice');
    Speech.speak(Lang.strings().journeyMsgs[Math.min(_journeyCount - 1, 2)]);
    setTimeout(() => Journey.start('voice-journey', 6, _journeyDone), 1400);
  }

  function init() {
    sessionOrder  = _shuffle([...Array(CONTENT.length).keys()]);
    currentIdx    = 0;
    answered      = false;
    _journeyCount = 0;
    Journey.start('voice-journey', 6, _journeyDone);
    _stopRecognition();
    _renderQuestion();
  }

  function _renderQuestion() {
    answered = false;
    const item = CONTENT[sessionOrder[currentIdx % sessionOrder.length]];

    // Subject emoji
    const emoji = document.getElementById('voice-emoji');
    if (emoji) emoji.textContent = item.emoji;

    // Task label
    const task = document.getElementById('voice-task');
    if (task) task.textContent = Lang.t('voiceTask');

    // Hide result banner
    const result = document.getElementById('voice-result');
    if (result) result.style.display = 'none';

    // Build 3 word-bubble choices (correct + 2 distractors)
    const others   = sessionOrder
      .filter((_, i) => i !== currentIdx % sessionOrder.length)
      .slice(0, 5);
    const distractors = _shuffle(others).slice(0, 2)
      .map(i => CONTENT[i]);
    const choices = _shuffle([item, ...distractors]);

    const bubblesEl = document.getElementById('voice-bubbles');
    if (bubblesEl) {
      bubblesEl.innerHTML = '';
      choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'voice-bubble';
        btn.textContent = c.word;
        btn.onclick = () => _handleChoice(c.spoken === item.spoken, item);
        bubblesEl.appendChild(btn);
      });
    }

    // Mic orb status
    _setMicState('idle');

    // Auto-play TTS and start listening
    Speech.speak(item.word);
    setTimeout(() => _startListening(item), 1200);
  }

  function _setMicState(state) {
    const orb = document.getElementById('voice-mic-orb');
    const lbl = document.getElementById('voice-mic-label');
    if (!orb) return;
    orb.className = 'voice-mic-orb ' + state;
    if (lbl) {
      lbl.textContent = state === 'listening' ? Lang.t('voiceListen') : Lang.t('voiceTask');
    }
  }

  function _startListening(item) {
    if (answered) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // No speech API — rely on buttons only
      _setMicState('unavailable');
      return;
    }

    _stopRecognition();
    recognition = new SpeechRecognition();
    recognition.lang = 'he-IL';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    recognition.onstart = () => {
      listening = true;
      _setMicState('listening');
    };

    recognition.onresult = (event) => {
      listening = false;
      if (answered) return;
      const results = Array.from(event.results[0]);
      const heard   = results.map(r => r.transcript.trim()).join(' ');
      const correct = _checkSpeech(heard, item.spoken);
      _handleChoice(correct, item, heard);
    };

    recognition.onerror = () => {
      listening = false;
      _setMicState('idle');
    };

    recognition.onend = () => {
      listening = false;
      if (!answered) _setMicState('idle');
    };

    try { recognition.start(); } catch (e) { _setMicState('idle'); }
  }

  function _stopRecognition() {
    if (recognition) {
      try { recognition.abort(); } catch (e) {}
      recognition = null;
    }
    listening = false;
  }

  // Check if spoken text matches the target word (strip nikud, compare base consonants)
  function _checkSpeech(heard, target) {
    const strip = s => s.replace(/[\u0591-\u05C7]/g, '').replace(/\s/g, '');
    return strip(heard).includes(strip(target)) || strip(target).includes(strip(heard));
  }

  function _handleChoice(isCorrect, item, spokenText) {
    if (answered) return;
    answered = true;
    _stopRecognition();

    // Highlight correct bubble
    document.querySelectorAll('.voice-bubble').forEach(btn => {
      const strip = s => s.replace(/[\u0591-\u05C7]/g, '');
      if (strip(btn.textContent) === strip(item.word)) {
        btn.classList.add(isCorrect ? 'correct' : 'reveal');
      }
    });

    if (isCorrect) {
      _setMicState('correct');
      Speech.speak(Theme.getPraise());
      App.addStar();
      Confetti.burst();
      Progress.record('voice', item.spoken, true);
      Journey.advance();
    } else {
      _setMicState('wrong');
      Speech.speak(Lang.ta());
      Progress.record('voice', item.spoken, false);
    }

    const result = document.getElementById('voice-result');
    if (result) {
      result.style.display = 'flex';
      result.textContent = isCorrect ? Lang.t('voiceCorrect') : item.word;
      result.className = 'voice-result ' + (isCorrect ? 'correct' : 'wrong');
    }

    setTimeout(() => {
      currentIdx++;
      _renderQuestion();
    }, isCorrect ? 1400 : 1800);
  }

  // Tap on the mic orb manually restarts listening
  function tapMic() {
    if (answered) return;
    const item = CONTENT[sessionOrder[currentIdx % sessionOrder.length]];
    Speech.speak(item.word);
    setTimeout(() => _startListening(item), 800);
  }

  function cleanup() {
    _stopRecognition();
  }

  return { init, tapMic, cleanup };
})();
