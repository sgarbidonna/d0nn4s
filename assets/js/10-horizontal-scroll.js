/* MDW Horizontal Scroll — wheel based con GSAP */

/* =========================================================
   MDW HORIZONTAL SCROLL
   GSAP · WHEEL BASED · PANEL INTERNAL
========================================================= */
window.MDWHorizontalScroll = (function () {

  let enabled = false;
  let panel, track;
  let currentX = 0;
  let targetX  = 0;
  let maxX     = 0;
  let wheelSpeed = 1.2;
  let ease = 0.12;

  let setX;
  let rafId;

  /* =========================
     INIT
  ========================= */

  function init(panelSelector) {
    if (enabled) return;

    panel = document.querySelector(panelSelector);
    if (!panel) return;

    track = panel.querySelector('.mdw-horizontal-scroll .e-con, .mdw-horizontal-scroll .e-container');
    if (!track) {
      console.warn('[MDW] track not found');
      return;
    }

    computeBounds();
    setupGSAP();

    panel.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', computeBounds);

    enabled = true;
    loop();
  }

  /* =========================
     DESTROY
  ========================= */

  function destroy() {
    if (!enabled) return;

    panel.removeEventListener('wheel', onWheel);
    window.removeEventListener('resize', computeBounds);

    cancelAnimationFrame(rafId);

    gsap.set(track, { x: 0 });

    currentX = targetX = maxX = 0;
    panel = track = null;
    enabled = false;
  }

  /* =========================
     CORE
  ========================= */

  function computeBounds() {
    const panelW = panel.clientWidth;

    let totalW = 0;
    [...track.children].forEach(el => {
      totalW += el.offsetWidth;
    });

    maxX = Math.max(0, totalW - panelW);
    targetX = gsap.utils.clamp(0, maxX, targetX);
  }

  function setupGSAP() {
    setX = gsap.quickSetter(track, 'x', 'px');
  }

  function onWheel(e) {
    if (!enabled) return;

    e.preventDefault();

    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX)
      ? e.deltaY
      : e.deltaX;

    targetX += delta * wheelSpeed;
    targetX = gsap.utils.clamp(0, maxX, targetX);
  }

  function loop() {
    currentX += (targetX - currentX) * ease;
    setX(-currentX);

    rafId = requestAnimationFrame(loop);
  }

  /* =========================
     PUBLIC API
  ========================= */

  return {
    init,
    destroy
  };

})();
