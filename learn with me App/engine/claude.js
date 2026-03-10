// ============================================================
// CLAUDE API ENGINE — hints after repeated wrong answers
// API key stored in localStorage (never committed)
// Called ONLY when child is stuck (2+ wrong on same item)
// ============================================================
const Claude = (() => {
  const KEY_STORE  = 'ylmd_claude_key';
  const WRONG_STORE = 'ylmd_claude_wrong';
  const WRONG_THRESHOLD = 2; // trigger hint after N wrong answers

  function getKey() { return localStorage.getItem(KEY_STORE) || ''; }
  function setKey(key) { localStorage.setItem(KEY_STORE, key.trim()); }

  function _loadWrong() {
    try { return JSON.parse(localStorage.getItem(WRONG_STORE)) || {}; }
    catch { return {}; }
  }

  function _saveWrong(data) {
    localStorage.setItem(WRONG_STORE, JSON.stringify(data));
  }

  function trackWrong(module, item, answer) {
    const data = _loadWrong();
    const k = `${module}|${item}`;
    data[k] = (data[k] || 0) + 1;
    _saveWrong(data);
    if (data[k] >= WRONG_THRESHOLD) {
      _fetchHint(module, item);
    }
  }

  function trackCorrect(module, item) {
    const data = _loadWrong();
    const k = `${module}|${item}`;
    delete data[k];
    _saveWrong(data);
  }

  async function _fetchHint(module, item) {
    const key = getKey();
    if (!key) return; // no API key — silently skip
    const prompt = `אתה עוזר חינוכי עברי לילד בגיל 3-6. הילד טועה שוב ושוב ב${module}: "${item}". תן רמז עידוד קצר בעברית פשוטה, משפט אחד לכל היותר.`;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 80,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) return;
      const json = await res.json();
      const hint = json?.content?.[0]?.text;
      if (hint && typeof Speech !== 'undefined') Speech.speak(hint);
    } catch {
      // Network error — silently skip, no dead ends
    }
  }

  return { getKey, setKey, trackWrong, trackCorrect };
})();
