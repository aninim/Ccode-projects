<<<<<<< HEAD
// Language engine — wraps HE/EN string tables
// Depends on: i18n/he.js (HE), i18n/en.js (EN) loaded before this file
const Lang = (() => {
  const STORE = 'ylmd_lang';
  let _s = null; // active strings object

  function init() { _s = (localStorage.getItem(STORE) === 'en') ? EN : HE; }
  function get()  { return localStorage.getItem(STORE) || 'he'; }
  function isHe() { return get() === 'he'; }

  function set(code) {
    localStorage.setItem(STORE, code);
    _s = (code === 'en') ? EN : HE;
  }

  function strings() { if (!_s) init(); return _s; }
  function t(key)    { return strings()[key] || key; }

  // Random praise string
  function p() {
    const list = strings().praise;
    return list[Math.floor(Math.random() * list.length)];
  }

  // Random try-again string
  function ta() {
    const list = strings().tryAgain;
    return list[Math.floor(Math.random() * list.length)];
  }

  return { init, get, set, isHe, t, strings, p, ta };
=======
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
>>>>>>> fix/bug01-audio01
})();
