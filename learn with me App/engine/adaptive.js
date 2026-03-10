// ============================================================
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
  }

  return { buildPool };
})();
