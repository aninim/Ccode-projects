// ============================================================
<<<<<<< HEAD
// ADAPTIVE ENGINE — weighted question pool
// Items with accuracy < 70% appear twice as often.
// Usage:
//   const pool = Adaptive.buildPool('letters', LETTERS, item => item.letter);
//   // Returns shuffled array of indices into `items`
// ============================================================
const Adaptive = (() => {

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Returns a shuffled index array. Weak items (accuracy < 0.7) appear twice.
  function buildPool(category, items, keyFn) {
    const indices = [];
    items.forEach((item, idx) => {
      indices.push(idx);
      const acc = Progress.getAccuracy(category, keyFn(item));
      if (acc < 0.70) indices.push(idx); // double weight for weak items
    });
    return _shuffle(indices);
=======
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
>>>>>>> fix/bug01-audio01
  }

  return { buildPool };
})();
