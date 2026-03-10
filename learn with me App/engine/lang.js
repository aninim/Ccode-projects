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
})();
