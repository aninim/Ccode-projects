// ============================================================
// CLAUDE API WRAPPER — Phase 6
// Used ONLY for adaptive hints after 2 wrong answers on same item.
// API key stored in localStorage key 'ylmd_api_key'.
// Never called on every question. Responses cached locally.
// ============================================================

const Claude = (() => {
  const API_URL    = 'https://api.anthropic.com/v1/messages';
  const MODEL      = 'claude-sonnet-4-20250514';
  const KEY_STORE  = 'ylmd_api_key';
  const CACHE_STORE= 'ylmd_claude_cache';
  const SYSTEM     = 'אתה עוזר חם ומעודד שמלמד ילדים בגיל 4–7. דבר עברית פשוטה בלבד. עד 2 משפטים קצרים. תמיד מעודד ואוהב.';

  // Per-session wrong-answer streak per item
  const _sessionWrongs = {};

  function _key()   { return localStorage.getItem(KEY_STORE) || ''; }
  function _cache() { try { return JSON.parse(localStorage.getItem(CACHE_STORE)) || {}; } catch { return {}; } }
  function _saveCache(c) { localStorage.setItem(CACHE_STORE, JSON.stringify(c)); }

  async function _call(prompt) {
    const apiKey = _key();
    if (!apiKey) return null;

    const cache = _cache();
    if (cache[prompt]) return cache[prompt];

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model:      MODEL,
          max_tokens: 120,
          system:     SYSTEM,
          messages:   [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.content?.[0]?.text?.trim() || null;
      if (text) {
        const updated = _cache();
        updated[prompt] = text;
        const keys = Object.keys(updated);
        if (keys.length > 100) delete updated[keys[0]];
        _saveCache(updated);
      }
      return text;
    } catch {
      return null;
    }
  }

  async function _hint(category, displayValue) {
    const prompts = {
      letters:     `ילד ניסה פעמיים ולא הצליח לזהות את האות "${displayValue}". תן רמז קצר ועוזר.`,
      numbers:     `ילד ניסה פעמיים ולא הצליח לזהות את המספר "${displayValue}". תן רמז קצר ועוזר.`,
      shapes:      `ילד ניסה פעמיים ולא הצליח לזהות את הצורה "${displayValue}". תן רמז קצר ועוזר.`,
      colors:      `ילד ניסה פעמיים ולא הצליח לזהות את הצבע "${displayValue}". תן רמז קצר ועוזר.`,
      math:        `ילד ניסה פעמיים ולא הצליח לפתור את התרגיל "${displayValue}". תן רמז קצר ועוזר.`,
      engineering: `ילד ניסה פעמיים ולא הצליח לזהות את הכלי "${displayValue}". תן רמז קצר ועוזר.`,
    };
    const text = await _call(prompts[category] || `תן רמז עוזר: ${displayValue}`);
    if (text) Speech.speak(text);
  }

  // Call from _handleChoice after recording a WRONG answer.
  // After 2 wrongs on the same item in a session → fires a Claude hint.
  function trackWrong(category, key, displayValue) {
    if (!_key()) return;
    const id = category + ':' + key;
    _sessionWrongs[id] = (_sessionWrongs[id] || 0) + 1;
    if (_sessionWrongs[id] >= 2) {
      _sessionWrongs[id] = 0; // reset so it doesn't fire on every subsequent wrong
      _hint(category, displayValue);
    }
  }

  // Call from _handleChoice after a CORRECT answer — resets the streak.
  function trackCorrect(category, key) {
    delete _sessionWrongs[category + ':' + key];
  }

  // Save API key from settings UI
  function setKey(key) { localStorage.setItem(KEY_STORE, key.trim()); }
  function isConfigured() { return !!_key(); }
  function getKey() { return _key(); }

  return { trackWrong, trackCorrect, setKey, isConfigured, getKey };
})();
