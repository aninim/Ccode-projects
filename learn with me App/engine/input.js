// ============================================================
// INPUT ENGINE — unified touch/mouse/gamepad handler
// Dispatches typed action events; canvas drawing uses DRAW_START / DRAW / DRAW_END
// Phase 5: Gamepad API polling added (standard layout mapping)
// ============================================================
const Input = (() => {
  const listeners = {};
  let   _polling  = false;
  const _prevBtns = {}; // gamepadIndex → bool[]

  function on(type, handler) {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(handler);
  }

  function off(type, handler) {
    if (!listeners[type]) return;
    listeners[type] = listeners[type].filter(h => h !== handler);
  }

  function dispatch(event) {
    (listeners[event.type] || []).forEach(h => h(event));
  }

  // ---- Canvas helpers ------------------------------------------------

  function _pos(e, el) {
    const rect   = el.getBoundingClientRect();
    const src    = e.touches ? (e.touches[0] || e.changedTouches[0]) : e;
    const scaleX = el.width  / rect.width;
    const scaleY = el.height / rect.height;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    };
  }

  function attachCanvas(canvas) {
    function onStart(e) {
      e.preventDefault();
      dispatch({ type: 'DRAW_START', ...(_pos(e, canvas)), source: e.touches ? 'touch' : 'mouse' });
    }
    function onMove(e) {
      e.preventDefault();
      if (!e.touches && e.buttons === 0) return;
      dispatch({ type: 'DRAW', ...(_pos(e, canvas)), source: e.touches ? 'touch' : 'mouse' });
    }
    function onEnd(e) {
      e.preventDefault();
      dispatch({ type: 'DRAW_END', source: e.touches ? 'touch' : 'mouse' });
    }

    canvas.addEventListener('touchstart',  onStart, { passive: false });
    canvas.addEventListener('touchmove',   onMove,  { passive: false });
    canvas.addEventListener('touchend',    onEnd,   { passive: false });
    canvas.addEventListener('touchcancel', onEnd,   { passive: false });
    canvas.addEventListener('mousedown',   onStart);
    canvas.addEventListener('mousemove',   onMove);
    canvas.addEventListener('mouseup',     onEnd);
    // If mouse is released outside the canvas, still end the stroke
    document.addEventListener('mouseup',   onEnd);

    return function cleanup() {
      canvas.removeEventListener('touchstart',  onStart);
      canvas.removeEventListener('touchmove',   onMove);
      canvas.removeEventListener('touchend',    onEnd);
      canvas.removeEventListener('touchcancel', onEnd);
      canvas.removeEventListener('mousedown',   onStart);
      canvas.removeEventListener('mousemove',   onMove);
      canvas.removeEventListener('mouseup',     onEnd);
      document.removeEventListener('mouseup',   onEnd);
    };
  }

  // ---- Gamepad -------------------------------------------------------
  // Standard Gamepad Layout (most controllers):
  //   0  = A (south)       → confirm / click focused element
  //   1  = B (east)        → back / home
  //   8  = Select          → home
  //   9  = Start           → home
  //   12 = D-pad up        → navigate focus up/left
  //   13 = D-pad down      → navigate focus down/right
  //   14 = D-pad left      → navigate focus left
  //   15 = D-pad right     → navigate focus right

  function _startPolling() {
    if (_polling) return;
    _polling = true;
    requestAnimationFrame(_poll);
  }

  function _poll() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of gamepads) {
      if (!gp) continue;
      if (!_prevBtns[gp.index]) _prevBtns[gp.index] = new Array(gp.buttons.length).fill(false);
      const prev = _prevBtns[gp.index];
      gp.buttons.forEach((btn, i) => {
        if (btn.pressed && !prev[i]) _handleButton(i);
        prev[i] = btn.pressed;
      });
    }
    requestAnimationFrame(_poll);
  }

  function _handleButton(idx) {
    switch (idx) {
      case 0:  // A — confirm
        dispatch({ type: 'SELECT', source: 'gamepad' });
        if (document.activeElement && document.activeElement !== document.body) {
          document.activeElement.click();
        } else {
          const first = _choiceButtons()[0];
          if (first) { first.focus(); first.click(); }
        }
        break;
      case 1:   // B — back
      case 8:   // Select
      case 9:   // Start
        dispatch({ type: 'BACK', source: 'gamepad' });
        if (typeof App !== 'undefined') App.show('home');
        break;
      case 12:  // D-pad up
      case 14:  // D-pad left
        _moveFocus(-1);
        break;
      case 13:  // D-pad down
      case 15:  // D-pad right
        _moveFocus(1);
        break;
    }
  }

  function _choiceButtons() {
    const screen = document.querySelector('.screen.active');
    if (!screen) return [];
    return Array.from(screen.querySelectorAll('button:not(.back-btn):not(.trace-btn)'));
  }

  function _moveFocus(dir) {
    const btns = _choiceButtons();
    if (!btns.length) return;
    const cur  = btns.indexOf(document.activeElement);
    const next = cur === -1
      ? (dir > 0 ? btns[0] : btns[btns.length - 1])
      : btns[(cur + dir + btns.length) % btns.length];
    next.focus();
    dispatch({ type: 'NAVIGATE', source: 'gamepad' });
  }

  window.addEventListener('gamepadconnected', () => {
    _startPolling();
    dispatch({ type: 'GAMEPAD_CONNECTED', source: 'gamepad' });
  });

  window.addEventListener('gamepaddisconnected', e => {
    delete _prevBtns[e.gamepad.index];
  });

  return { on, off, dispatch, attachCanvas };
})();
