/* ══════════════════════════════════════ PANEL CONTROLLER */

(function () {
  if (typeof gsap === 'undefined') return;

  let activeClose = null;

  /* ── ESC global ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && typeof activeClose === 'function') activeClose();
  });

  /* ── Lazy load ──
     Imágenes con data-src se cargan la primera vez que se abre el panel.
     Si el panel es type="misc", inicializa el carousel al cargar.
  */
  function lazyLoad(panel, type) {
    const content = panel.querySelector('.panel-content');
    if (!content || content.dataset.lazyLoaded === 'true') return;

    content.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });

    content.dataset.lazyLoaded = 'true';

    if (type === 'misc') initCarousel(panel);
  }

  /* ── Carousel (misc) ──
     Click mitad izquierda → imagen anterior
     Click mitad derecha   → imagen siguiente
     Crossfade de opacidad entre imágenes
  */
  function initCarousel(panel) {
    const content = panel.querySelector('.panel-content');
    const images  = [...panel.querySelectorAll('.panel-img')];
    if (!content || !images.length) return;

    let current   = 0;
    let animating = false;

    /* todas apiladas, invisibles */
    images.forEach(img => {
      gsap.set(img, { opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' });
    });

    /* mostrar primera */
    gsap.set(images[0], { opacity: 1 });

    function show(i) {
      if (animating || i === current) return;
      animating = true;

      gsap.to(images[current], { opacity: 0, duration: 0.35, ease: 'power1.out' });
      gsap.to(images[i], {
        opacity: 1, duration: 0.35, ease: 'power1.in',
        onComplete: () => { animating = false; }
      });

      current = i;
    }

    /* pointer-events propio para no depender del padre */
    content.style.pointerEvents = 'auto';
    content.style.cursor        = 'pointer';

    content.addEventListener('click', e => {
      if (e.target.closest('.panel-close')) return;

      const { left, width } = content.getBoundingClientRect();
      const goNext = e.clientX > left + width / 2;

      const next = goNext
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;

      show(next);
    });
  }

  /* ── Panel factory ── */
  function initPanel(floatImg) {
    const panelId = floatImg.dataset.panel;
    if (!panelId) return;

    const panel = document.getElementById(panelId);
    const bg    = document.getElementById(panelId.replace('-panel', '-bg'));
    const close = panel ? panel.querySelector('.panel-close') : null;
    const type  = floatImg.dataset.type || null;

    if (!panel || !bg || !close) return;

    let isOpen = false;

    gsap.set([panel, bg], { y: '100%', pointerEvents: 'none' });

    function open() {
      if (isOpen) return;
      isOpen      = true;
      activeClose = closePanel;

      lazyLoad(panel, type);

      gsap.timeline()
        .to(bg,    { y: '0%', duration: 0.48, ease: 'power2.out', pointerEvents: 'auto' })
        .to(panel, { y: '0%', duration: 1.12, ease: 'power4.out', pointerEvents: 'auto' }, '-=0.2');
    }

    function closePanel() {
      if (!isOpen) return;
      isOpen      = false;
      activeClose = null;

      gsap.to(panel, { y: '100%', duration: 0.8, ease: 'power3.in', pointerEvents: 'none' });
      gsap.to(bg,    { y: '100%', duration: 0.8, ease: 'power3.in', pointerEvents: 'none', delay: 0.1 });
    }

    floatImg.addEventListener('click', open);
    close.addEventListener('click',   closePanel);
  }

  document.querySelectorAll('.float-img[data-panel]').forEach(initPanel);

})();