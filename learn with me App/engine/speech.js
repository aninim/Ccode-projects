<<<<<<< HEAD
// ============================================================
// SPEECH ENGINE — Web Speech API wrapper
// AUDIO-01: age-tier based rate (tier 0=3-4: 0.70, tier 1=5-6: 0.80)
// 150ms pre-roll delay prevents clipped first syllable on Chrome
// ============================================================
const Speech = (() => {
  let _voice = null;
  let _ready  = false;

  function _getRate() {
    const age = localStorage.getItem('ylmd_age') || '0';
    return age === '0' ? 0.70 : 0.80;
  }

  function _loadVoice() {
    const voices = speechSynthesis.getVoices();
    _voice = voices.find(v => v.lang === 'he-IL') ||
             voices.find(v => v.lang.startsWith('he')) ||
             null;
    _ready = true;
  }

  function init() {
    if (typeof speechSynthesis === 'undefined') return;
    // Chrome loads voices asynchronously
    if (speechSynthesis.getVoices().length > 0) {
      _loadVoice();
    } else {
      speechSynthesis.addEventListener('voiceschanged', _loadVoice, { once: true });
    }
  }

  function speak(text, opts) {
    if (typeof speechSynthesis === 'undefined' || !text) return;
    // 150ms pre-roll: prevents first-syllable clip on Chrome/Edge
    setTimeout(() => {
      speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(String(text));
      utt.lang  = (opts && opts.lang)  || 'he-IL';
      utt.rate  = (opts && opts.rate)  || _getRate();
      utt.pitch = (opts && opts.pitch) || 1.1;
      if (_voice) utt.voice = _voice;
      speechSynthesis.speak(utt);
    }, 150);
=======
// Speech engine — Web Speech API wrapper
// Auto-detects Hebrew vs English text and picks the appropriate voice
const Speech = (() => {
  let heVoice = null;

  function _hasHebrew(text) {
    return /[\u0590-\u05FF]/.test(text);
  }

  function _pickBestVoice(voices) {
    const he = voices.filter(v => v.lang.startsWith('he'));
    if (he.length === 0) return null;
    const neural = he.find(v => /online|natural|neural|wavenet|avital|asaf/i.test(v.name));
    if (neural) return neural;
    const google = he.find(v => /google/i.test(v.name));
    if (google) return google;
    return he[0];
  }

  function init() {
    function loadVoices() {
      heVoice = _pickBestVoice(speechSynthesis.getVoices());
    }
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function speak(text, opts = {}) {
    if (!text) return;
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    if (_hasHebrew(text)) {
      const age        = localStorage.getItem('ylmd_age') || '5-6';
      const defaultRate = age === '3-4' ? 0.70 : 0.80;  // slower for younger kids
      utt.lang  = 'he-IL';
      utt.rate  = opts.rate  ?? defaultRate;
      utt.pitch = opts.pitch ?? 1.05;
      if (heVoice) utt.voice = heVoice;
    } else {
      utt.lang  = 'en-US';
      utt.rate  = opts.rate  ?? 0.95;
      utt.pitch = opts.pitch ?? 1.0;
    }
    // 150ms pre-roll silence — prevents first phoneme being clipped on some devices
    setTimeout(() => speechSynthesis.speak(utt), 150);
>>>>>>> fix/bug01-audio01
  }

  return { init, speak };
})();
