// ============================================================
// INPUT ENGINE — unified touch/mouse/gamepad handler
// Events emitted: DRAW_START, DRAW, DRAW_END
// Usage:
//   Input.on('DRAW', fn)          — subscribe
//   Input.off('DRAW', fn)         — unsubscribe
//   const detach = Input.attachCanvas(canvas)  — wire a canvas element
// ============================================================
const Input = (() => {
  const _listeners = {};

  function on(event, fn) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(fn);
  }

  function off(event, fn) {
    if (!_listeners[event]) return;
    _listeners[event] = _listeners[event].filter(f => f !== fn);
  }

  function _emit(event, data) {
    (_listeners[event] || []).forEach(fn => fn(data));
  }

  // Resolve coordinates relative to canvas top-left, clamped to canvas bounds
  function _coords(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.max(0, Math.min(canvas.width,  (clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(canvas.height, (clientY - rect.top)  * scaleY)),
    };
  }

  // Attach canvas for drawing events — returns a detach function
  function attachCanvas(canvas) {
    let drawing = false;

    function onStart(e) {
      e.preventDefault();
      drawing = true;
      const src = e.touches ? e.touches[0] : e;
      const pos = _coords(canvas, src.clientX, src.clientY);
      _emit('DRAW_START', { ...pos, source: e.touches ? 'touch' : 'mouse' });
    }

    function onMove(e) {
      if (!drawing) return;
      e.preventDefault();
      const src = e.touches ? e.touches[0] : e;
      const pos = _coords(canvas, src.clientX, src.clientY);
      _emit('DRAW', { ...pos, source: e.touches ? 'touch' : 'mouse' });
    }

    function onEnd(e) {
      if (!drawing) return;
      drawing = false;
      _emit('DRAW_END', { source: e.touches ? 'touch' : 'mouse' });
    }

    canvas.addEventListener('mousedown',   onStart, { passive: false });
    canvas.addEventListener('mousemove',   onMove,  { passive: false });
    canvas.addEventListener('mouseup',     onEnd);
    canvas.addEventListener('touchstart',  onStart, { passive: false });
    canvas.addEventListener('touchmove',   onMove,  { passive: false });
    canvas.addEventListener('touchend',    onEnd);
    canvas.addEventListener('touchcancel', onEnd);
    // End draw if pointer leaves window (prevents stuck state)
    document.addEventListener('mouseup', onEnd);

    return function detach() {
      canvas.removeEventListener('mousedown',   onStart);
      canvas.removeEventListener('mousemove',   onMove);
      canvas.removeEventListener('mouseup',     onEnd);
      canvas.removeEventListener('touchstart',  onStart);
      canvas.removeEventListener('touchmove',   onMove);
      canvas.removeEventListener('touchend',    onEnd);
      canvas.removeEventListener('touchcancel', onEnd);
      document.removeEventListener('mouseup',   onEnd);
    };
  }

  return { on, off, attachCanvas };
})();
