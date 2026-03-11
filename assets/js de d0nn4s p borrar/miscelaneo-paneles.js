
document.addEventListener('DOMContentLoaded', () => {

  let activeCloseFn = null; // referencia global al panel abierto

  /* =====================================================
     IMAGE PANEL FACTORY (fade + click L/R)
  ===================================================== */

  function initImagePanel({
    containerId,
    closeBtnId,
    imageClass
  }) {
    const container = document.getElementById(containerId);
    const closeBtn  = document.getElementById(closeBtnId);
    const images    = [...document.querySelectorAll(`.${imageClass}`)];

    if (!container || !images.length) return;

    let currentIndex = 0;
    let isAnimating  = false;

    images.forEach(img => {
      img.style.opacity = 0;
      img.style.transition = 'opacity 0.35s ease';
      img.style.position = 'absolute';
      img.style.inset = 0;
      img.style.display = 'block';
    });

    const getRealIndex = i => images.length - 1 - i;

    function showImage(i) {
      if (isAnimating) return;
      isAnimating = true;

      const real = getRealIndex(i);

      images.forEach((img, idx) => {
        img.style.opacity = idx === real ? 1 : 0;
      });

      setTimeout(() => {
        isAnimating = false;
      }, 360);
    }

    showImage(currentIndex);

    container.addEventListener('click', e => {
      if (closeBtn && e.target.closest(`#${closeBtnId}`)) return;

      const { left, width } = container.getBoundingClientRect();
      const isNext = e.clientX > left + width / 2;

      currentIndex = isNext
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;

      showImage(currentIndex);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', e => e.stopPropagation());
    }
  }

  /* =====================================================
     GSAP PANEL FACTORY + ESC SUPPORT
  ===================================================== */

  function initGsapPanel({
    openBtnId,
    closeBtnId,
    panelId,
    bgId
  }) {
    const openBtn  = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);
    const panel    = document.getElementById(panelId);
    const bg       = document.getElementById(bgId);

    if (!openBtn || !closeBtn || !panel || !bg || !window.gsap) return;

    let isOpen = false;

    gsap.set(bg, {
      y: '100%',
      pointerEvents: 'none'
    });

    gsap.set(panel, {
      y: '120%',
      pointerEvents: 'none'
    });

    function openPanel() {
      if (isOpen) return;
      isOpen = true;

      activeCloseFn = closePanel;

      const tl = gsap.timeline();
      tl.to(panel, {
        y: '-5%',
        duration: 0.05,
        ease: 'power4.out',
        pointerEvents: 'auto'
      });
      tl.to(panel, {
        y: '0%',
        duration: 0.4,
        ease: 'power2.out'
      });
    }

    function closePanel() {
      if (!isOpen) return;
      isOpen = false;

      activeCloseFn = null;

      gsap.to(panel, {
        y: '120%',
        duration: 0.55,
        ease: 'power3.in',
        pointerEvents: 'none'
      });
    }

    openBtn.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
  }

  /* =====================================================
     GLOBAL ESC HANDLER
  ===================================================== */

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && typeof activeCloseFn === 'function') {
      activeCloseFn();
    }
  });

  /* =====================================================
     INIT — IMAGE PANELS
  ===================================================== */

  initImagePanel({
    containerId: 'ai-misc',
    closeBtnId: 'close-ai-misc',
    imageClass: 'ai-miscelaneo'
  });

  initImagePanel({
    containerId: 'ai-misc2-panel',
    closeBtnId: 'close-ai-misc2',
    imageClass: 'ai-misc2'
  });

  initImagePanel({
    containerId: 'ai-byn-panel',
    closeBtnId: 'close-ai-byn',
    imageClass: 'ai-byn'
  });

  initImagePanel({
    containerId: 'ai-sombras-panel',
    closeBtnId: 'close-ai-sombras',
    imageClass: 'ai-sombras'
  });



  /* =====================================================
     INIT — GSAP PANELS
  ===================================================== */

  initGsapPanel({
    openBtnId: 'ai-misc-call',
    closeBtnId: 'close-ai-misc',
    panelId: 'ai-misc',
    bgId: 'ai-misc-bg'
  });

  initGsapPanel({
    openBtnId: 'ai-misc2-call',
    closeBtnId: 'close-ai-misc2',
    panelId: 'ai-misc2-panel',
    bgId: 'ai-misc2-bg'
  });

  initGsapPanel({
    openBtnId: 'ai-byn-call',
    closeBtnId: 'close-ai-byn',
    panelId: 'ai-byn-panel',
    bgId: 'ai-byn-bg'
  });

  initGsapPanel({
    openBtnId: 'ai-sombras-call',
    closeBtnId: 'close-ai-sombras',
    panelId: 'ai-sombras-panel',
    bgId: 'ai-sombras-bg'
  });

});
