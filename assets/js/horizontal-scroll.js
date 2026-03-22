/* ══════════════════════════════════════ HORIZONTAL SCROLL — GSAP SMOOTH */

(function () {

  const instances = {};

  function enable(panelId) {
    if (window.innerWidth <= 768) return;
    if (instances[panelId]) return;

    const panel     = document.getElementById(panelId);
    const container = panel && panel.querySelector('.project-media--hscroll');
    const track     = panel && panel.querySelector('.hscroll-track');
    if (!panel || !container || !track) return;

    container.style.pointerEvents = 'auto';
    track.style.pointerEvents     = 'auto';

    gsap.set(track, { x: 0 });

    const state = {
      current:  0,   /* posición renderizada */
      target:   0,   /* posición deseada */
      velocity: 0,   /* inercia acumulada */
    };
    instances[panelId] = state;

    const setX = gsap.quickSetter(track, 'x', 'px');

    function getMax() {
      const children = [...track.children];
      const gap      = parseFloat(getComputedStyle(track).gap) || 10;
      const paddingL = parseFloat(getComputedStyle(track).paddingLeft)  || 0;
      const paddingR = parseFloat(getComputedStyle(track).paddingRight) || 0;
      const totalW   = children.reduce((s, el) => s + el.offsetWidth, 0)
                       + gap * (children.length - 1)
                       + paddingL + paddingR;
      return Math.max(0, totalW - container.clientWidth);
    }

    function onWheel(e) {
      e.preventDefault();
      e.stopPropagation();
      const delta  = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const max    = getMax();
      state.target = Math.max(0, Math.min(max, state.target + delta * 1.6));
    }

    container.addEventListener('wheel', onWheel, { passive: false });
    state.off = () => container.removeEventListener('wheel', onWheel);

    /* ticker GSAP — lerp suave cada frame */
    const LERP = 0.18;
    function tick() {
      const diff = state.target - state.current;
      if (Math.abs(diff) < 0.05) {
        state.current = state.target;
      } else {
        state.current += diff * LERP;
      }
      setX(-state.current);
    }

    gsap.ticker.add(tick);
    state.tickOff = () => gsap.ticker.remove(tick);

    console.log('[HScroll] enabled:', panelId, '— max:', getMax());
  }

  function disable(panelId) {
    const s = instances[panelId];
    if (!s) return;
    s.off     && s.off();
    s.tickOff && s.tickOff();
    const track = document.querySelector(`#${panelId} .hscroll-track`);
    if (track) gsap.set(track, { x: 0 });
    delete instances[panelId];
  }

  function resetToStart(panelId, onComplete) {
    const s = instances[panelId];
    if (!s || s.current < 2) { onComplete && onComplete(); return; }

    /* animar target y current juntos hacia 0 */
    gsap.to(s, {
      target:  0,
      current: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => { onComplete && onComplete(); }
    });
  }

  window.HScroll = { enable, disable, resetToStart };

})();