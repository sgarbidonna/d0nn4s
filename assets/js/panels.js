/* ══════════════════════════════════════ PANEL CONTROLLER */

(function () {
  if (typeof gsap === 'undefined') return;

  /* pila de closers — ESC cierra el último abierto */
  const closeStack = [];

  /* ── ESC global ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && closeStack.length) {
      closeStack[closeStack.length - 1]();
    }
  });

  /* ── Lazy load ──
     Imágenes con data-src se cargan la primera vez que se abre el panel.
     Si el panel es type="misc", inicializa el carousel al cargar.
  */
  function lazyLoad(panel, type) {
    /* ── misc carousel (panel-content) ── */
    const content = panel.querySelector('.panel-content');
    if (content && content.dataset.lazyLoaded !== 'true') {
      content.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      content.dataset.lazyLoaded = 'true';
      if (type === 'misc') initCarousel(panel);
    }

    /* ── project carousel (project-carousel) ── */
    const projCarousel = panel.querySelector('.project-carousel');
    if (projCarousel && projCarousel.dataset.lazyLoaded !== 'true') {
      projCarousel.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      projCarousel.dataset.lazyLoaded = 'true';
      initProjectCarousel(panel, projCarousel, panel.querySelector('.project-media--carousel'));
    }

    /* ── split carousel (split-carousel) ── */
    const splitCarousel = panel.querySelector('.split-carousel');
    if (splitCarousel && splitCarousel.dataset.lazyLoaded !== 'true') {
      splitCarousel.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      splitCarousel.dataset.lazyLoaded = 'true';
      initProjectCarousel(panel, splitCarousel, splitCarousel);
    }

    /* ── iframes fuera de hscroll (split-video, etc.) ── */
    panel.querySelectorAll('.project-media:not(.project-media--hscroll) iframe[data-src]').forEach(iframe => {
      iframe.src = iframe.dataset.src;
      iframe.removeAttribute('data-src');
    });

    /* ── hscroll: init carousels dentro de cada sección ── */
    const hscrollTrack = panel.querySelector('.hscroll-track');
    if (hscrollTrack && hscrollTrack.dataset.lazyLoaded !== 'true') {
      hscrollTrack.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      hscrollTrack.querySelectorAll('iframe[data-src]').forEach(iframe => {
        iframe.src = iframe.dataset.src;
        iframe.removeAttribute('data-src');
      });

      /* ── stickySection dynamic iframes ── */
      const stickySections = panel.querySelectorAll('[class*="stickySection_"]');
      stickySections.forEach(section => {
        const stickyClass  = [...section.classList].find(c => c.startsWith('stickySection_'));
        const scrollClass  = stickyClass.replace('stickySection_', 'scroll_section_');
        const scrollEl     = section.querySelector('.' + scrollClass);
        if (!scrollEl || scrollEl.querySelector('iframe')) return;

        const iframe = document.createElement('iframe');
        iframe.src              = section.dataset.iframeSrc;
        iframe.title            = section.dataset.iframeTitle || '';
        iframe.frameBorder      = '0';
        iframe.allow            = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen  = true;
        iframe.id               = 'youtube';
        scrollEl.appendChild(iframe);
      });
      hscrollTrack.dataset.lazyLoaded = 'true';
      hscrollTrack.querySelectorAll('.split-carousel').forEach(sc => {
        if (sc.dataset.lazyLoaded !== 'true') {
          sc.dataset.lazyLoaded = 'true';
          initProjectCarousel(panel, sc, sc);
        }
      });
    }
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

  /* ── Carousel dentro de is-project / split ──
     clickTarget: el elemento que recibe el click (media o split-carousel)
  */
  function initProjectCarousel(panel, container, clickTarget) {
    const images = [...container.querySelectorAll('.carousel-img')];
    if (!images.length) return;

    let current   = 0;
    let animating = false;

    images[0].classList.add('is-active');
    gsap.set(images[0], { opacity: 1 });
    images.slice(1).forEach(img => gsap.set(img, { opacity: 0 }));

    function show(i) {
      if (animating || i === current) return;
      animating = true;
      gsap.to(images[current], { opacity: 0, duration: 0.35, ease: 'power1.out' });
      images[current].classList.remove('is-active');
      gsap.to(images[i], {
        opacity: 1, duration: 0.35, ease: 'power1.in',
        onComplete: () => { animating = false; }
      });
      images[i].classList.add('is-active');
      current = i;
    }

    if (!clickTarget) return;
    clickTarget.style.pointerEvents = 'auto';

    clickTarget.addEventListener('click', e => {
      if (e.target.closest('.panel-close')) return;
      const { left, width } = clickTarget.getBoundingClientRect();
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
      isOpen = true;
      closeStack.push(closePanel);

      lazyLoad(panel, type);

      /* activar scroll horizontal cuando el panel ya es visible */
      if (panel.querySelector('.hscroll-track') && window.HScroll) {
        gsap.delayedCall(1.15, () => HScroll.enable(panelId));
      }

      gsap.timeline()
        .to(bg,    { y: '0%', duration: 0.48, ease: 'power2.out', pointerEvents: 'auto' })
        .to(panel, { y: '0%', duration: 1.12, ease: 'power4.out', pointerEvents: 'auto' }, '-=0.2');
    }

    function closePanel() {
      if (!isOpen) return;
      isOpen = false;
      const idx = closeStack.indexOf(closePanel);
      if (idx !== -1) closeStack.splice(idx, 1);

      function animateClose() {
        if (window.HScroll) HScroll.disable(panelId);
        gsap.to(panel, { y: '100%', duration: 0.8, ease: 'power3.in', pointerEvents: 'none' });
        gsap.to(bg,    { y: '100%', duration: 0.8, ease: 'power3.in', pointerEvents: 'none', delay: 0.1 });
      }

      /* reset suave del scroll horizontal antes de cerrar */
      if (panel.querySelector('.hscroll-track') && window.HScroll) {
        HScroll.resetToStart(panelId, animateClose);
      } else {
        animateClose();
      }
    }

    floatImg.addEventListener('click', open);
    close.addEventListener('click',   closePanel);
  }

  document.querySelectorAll('.float-img[data-panel]').forEach(initPanel);

  /* expose close-all for external use (e.g. contact-bio panel) */
  window._panelCloseAll = () => { [...closeStack].forEach(fn => fn()); };

})();