// Speech engine — Web Speech API wrapper
// Auto-detects Hebrew vs English text and picks the appropriate voice
// AUDIO-01: age-tier based rate (tier 0=3-4: 0.70, tier 1=5-6: 0.80)
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

  function speak(text, opts) {
    if (!text) return;
    opts = opts || {};
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(String(text));
    if (_hasHebrew(String(text))) {
      const age         = localStorage.getItem('ylmd_age') || '0';
      const defaultRate = age === '0' ? 0.70 : 0.80;
      utt.lang  = 'he-IL';
      utt.rate  = opts.rate  !== undefined ? opts.rate  : defaultRate;
      utt.pitch = opts.pitch !== undefined ? opts.pitch : 1.05;
      if (heVoice) utt.voice = heVoice;
    } else {
      utt.lang  = 'en-US';
      utt.rate  = opts.rate  !== undefined ? opts.rate  : 0.95;
      utt.pitch = opts.pitch !== undefined ? opts.pitch : 1.0;
    }
    // 150ms pre-roll silence — prevents first phoneme being clipped on some devices
    setTimeout(() => speechSynthesis.speak(utt), 150);
  }

  return { init, speak };
})();
