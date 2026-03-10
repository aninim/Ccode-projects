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
  }

  return { init, speak };
})();
