// Language controller — HE / EN toggle
// Depends on: i18n/he.js and i18n/en.js being loaded first
const Lang = (() => {
  const KEY = 'ylmd_lang';
  let _code = 'he';

  function init() {
    _code = localStorage.getItem(KEY) || 'he';
  }

  function set(code) {
    _code = code;
    localStorage.setItem(KEY, code);
  }

  function get() { return _code; }

  function isHe() { return _code === 'he'; }

  // Full string object for current language
  function strings() {
    return _code === 'en' ? EN : HE;
  }

  // Random praise phrase in current language
  function p() {
    const arr = strings().praise;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Random try-again phrase in current language
  function ta() {
    const arr = strings().tryAgain;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Single string lookup — falls back to HE if key missing from EN
  function t(key) {
    return strings()[key] ?? HE[key] ?? key;
  }

  return { init, set, get, isHe, strings, p, ta, t };
})();
