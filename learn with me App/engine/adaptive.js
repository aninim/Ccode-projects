// ============================================================
// ADAPTIVE ENGINE — Phase 4
// Weighted question pool based on per-item accuracy history.
// Items the child struggles with (< 70% correct) appear twice as often.
// Items with no history appear at normal weight (new = neutral).
// ============================================================

const Adaptive = (() => {
  const STORAGE_KEY      = 'ylmd_progress';
  const WEIGHT_THRESHOLD = 0.70; // below this → double weight

  function _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  // Build a pool of indices into the items array.
  // category: 'letters' | 'numbers' | 'shapes' | 'colors' | 'letters_trace'
  // items: the full data array
  // keyFn: function(item) → the string key used in progress storage
  function buildPool(category, items, keyFn) {
    const stored = _load();
    const pool   = [];

    items.forEach((item, i) => {
      pool.push(i);
      const entry = stored[category]?.[keyFn(item)];
      // Only double if we have real attempt data AND accuracy is below threshold
      if (entry && entry.attempts > 0 && entry.correct / entry.attempts < WEIGHT_THRESHOLD) {
        pool.push(i);
      }
    });

    return pool;
  }

  return { buildPool };
})();
