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
    let filmSlots = [];

    /* todas apiladas, invisibles */
    images.forEach(img => {
      gsap.set(img, { opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' });
    });

    /* mostrar primera */
    gsap.set(images[0], { opacity: 1 });

    function renderFilmstrip(animated) {
      if (!filmSlots.length) return;
      const sw         = window.innerWidth;
      const tw         = 52;
      const cx         = sw / 2 - 25;
      const centerSlot = Math.floor(filmSlots.length / 2);
      filmSlots.forEach(({ el, srcIdx }, si) => {
        const x        = cx + (si - centerSlot) * tw;
        const isActive = srcIdx === current;
        if (!animated) gsap.set(el, { x });
        else           gsap.to(el,  { x, duration: 0.35, ease: 'power2.out' });
        el.classList.toggle('is-active', isActive);
      });
    }

    if (window.innerWidth <= 768) {
      const sw    = window.innerWidth;
      const tw    = 52;
      const slots = Math.ceil(sw / tw) + 4;
      const strip = document.createElement('div');
      strip.className = 'carousel-filmstrip';

      for (let si = 0; si < slots; si++) {
        const srcIdx = si % images.length;
        const el     = document.createElement('img');
        el.src       = images[srcIdx].getAttribute('src') || images[srcIdx].dataset.src || '';
        el.loading   = 'eager';
        strip.appendChild(el);
        filmSlots.push({ el, srcIdx });
      }

      const centerSlot = Math.floor(slots / 2);
      if (centerSlot > 0) {
        for (let k = 0; k < centerSlot; k++) filmSlots.unshift(filmSlots.pop());
      }
      filmSlots.forEach((s, si) => {
        s.srcIdx = ((si - centerSlot) % images.length + images.length * 100) % images.length;
        s.el.src = images[s.srcIdx].getAttribute('src') || images[s.srcIdx].dataset.src || '';
        s.el.classList.toggle('is-active', s.srcIdx === current);
      });

      content.insertAdjacentElement('afterend', strip);
      requestAnimationFrame(() => renderFilmstrip(false));

      strip.addEventListener('click', e => {
        const clickedEl = e.target.closest('img');
        if (!clickedEl) return;
        const slot = filmSlots.find(s => s.el === clickedEl);
        if (slot) show(slot.srcIdx);
      });
    }

    function show(i) {
      if (animating || i === current) return;
      animating = true;

      gsap.to(images[current], { opacity: 0, duration: 0.35, ease: 'power1.out' });
      gsap.to(images[i], {
        opacity: 1, duration: 0.35, ease: 'power1.in',
        onComplete: () => { animating = false; }
      });

      current = i;

      if (filmSlots.length) {
        const centerSlot = Math.floor(filmSlots.length / 2);
        let best = -1, bestDist = Infinity;
        filmSlots.forEach((s, si) => {
          if (s.srcIdx === current) {
            const d = Math.abs(si - centerSlot);
            if (d < bestDist) { bestDist = d; best = si; }
          }
        });
        if (best !== -1 && best !== centerSlot) {
          const rot = best - centerSlot;
          if (rot > 0) for (let k = 0; k < rot; k++) filmSlots.push(filmSlots.shift());
          else         for (let k = 0; k < -rot; k++) filmSlots.unshift(filmSlots.pop());
          filmSlots.forEach((s, si) => {
            s.srcIdx = ((current + (si - centerSlot)) % images.length + images.length * 100) % images.length;
            s.el.src = images[s.srcIdx].getAttribute('src') || images[s.srcIdx].dataset.src || '';
          });
        }
        renderFilmstrip(true);
      }
    }

    /* pointer-events propio para no depender del padre */
    content.style.pointerEvents = 'auto';

    content.addEventListener('click', e => {
      if (e.target.closest('.panel-close')) return;
      if (e.target.closest('.carousel-filmstrip')) return;

      const { left, width } = content.getBoundingClientRect();
      const goNext = e.clientX > left + width / 2;

      const next = goNext
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;

      show(next);
    });

    /* swipe on mobile */
    let touchStartX = 0;
    content.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    content.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) < 40) return;
      const next = dx < 0
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;
      show(next);
    }, { passive: true });
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

    /* ── Mobile filmstrip ── */
    /* filmSlots: array of {el, srcIdx} — enough slots to cover 3x viewport */
    let filmSlots = [];

    function renderFilmstrip(animated) {
      if (!filmSlots.length) return;
      const sw   = window.innerWidth;
      const tw   = 52;
      const cx   = sw / 2 - 25;
      const total = filmSlots.length;
      /* center slot index in filmSlots array */
      const centerSlot = Math.floor(total / 2);
      filmSlots.forEach(({ el, srcIdx }, si) => {
        /* offset of this slot from the one that holds the active image */
        const slotOff = si - centerSlot;
        const x = cx + slotOff * tw;
        const isActive = srcIdx === current;
        if (!animated) gsap.set(el, { x });
        else           gsap.to(el,  { x, duration: 0.35, ease: 'power2.out' });
        el.classList.toggle('is-active', isActive);
      });
    }

    function shiftFilmstrip() {
      /* rotate filmSlots so the active image is always at centerSlot */
      if (!filmSlots.length) return;
      const total      = filmSlots.length;
      const centerSlot = Math.floor(total / 2);
      /* find which slot currently has current image */
      const curPos = filmSlots.findIndex(s => s.srcIdx === current);
      if (curPos === -1) return;
      /* rotate array so curPos → centerSlot */
      const rot = curPos - centerSlot;
      if (rot === 0) return;
      if (rot > 0) {
        for (let k = 0; k < rot; k++) filmSlots.push(filmSlots.shift());
      } else {
        for (let k = 0; k < -rot; k++) filmSlots.unshift(filmSlots.pop());
      }
      /* update src on shifted slots to maintain looping sequence */
      filmSlots.forEach((s, si) => {
        const newSrcIdx = ((centerSlot - (Math.floor(total/2) - si) % images.length) + images.length * 100) % images.length;
        s.srcIdx = (((si - centerSlot) % images.length) + images.length * 100) % images.length;
        s.el.src = images[s.srcIdx].getAttribute('src') || images[s.srcIdx].dataset.src || '';
        s.el.classList.toggle('is-active', s.srcIdx === current);
      });
    }

    if (window.innerWidth <= 768) {
      const sw    = window.innerWidth;
      const tw    = 52;
      const slots = Math.max(images.length, Math.ceil(sw / tw) + 4);
      const strip = document.createElement('div');
      strip.className = 'carousel-filmstrip';

      for (let si = 0; si < slots; si++) {
        const srcIdx = si % images.length;
        const img    = images[srcIdx];
        const el     = document.createElement('img');
        el.src       = img.getAttribute('src') || img.dataset.src || '';
        el.loading   = 'eager';
        strip.appendChild(el);
        filmSlots.push({ el, srcIdx });
      }

      /* rotate so active image (current=0) is at centerSlot */
      const centerSlot = Math.floor(slots / 2);
      const rot = 0 - centerSlot; /* current=0 is at slot 0, move to centerSlot */
      if (rot < 0) {
        for (let k = 0; k < -rot; k++) filmSlots.unshift(filmSlots.pop());
      }
      /* update srcIdx after rotation */
      filmSlots.forEach((s, si) => {
        s.srcIdx = ((si - centerSlot) % images.length + images.length * 100) % images.length;
        s.el.src = images[s.srcIdx].getAttribute('src') || images[s.srcIdx].dataset.src || '';
        s.el.classList.toggle('is-active', s.srcIdx === current);
      });

      container.insertAdjacentElement('afterend', strip);
      requestAnimationFrame(() => renderFilmstrip(false));

      strip.addEventListener('click', e => {
        const clickedEl = e.target.closest('img');
        if (!clickedEl) return;
        const slot = filmSlots.find(s => s.el === clickedEl);
        if (slot) show(slot.srcIdx);
      });
    }

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
      /* update filmstrip: rotate slots so active srcIdx is at center, then render */
      if (filmSlots.length) {
        const total      = filmSlots.length;
        const centerSlot = Math.floor(total / 2);
        /* find the slot closest to center that has the current srcIdx */
        let best = -1, bestDist = Infinity;
        filmSlots.forEach((s, si) => {
          if (s.srcIdx === current) {
            const d = Math.abs(si - centerSlot);
            if (d < bestDist) { bestDist = d; best = si; }
          }
        });
        if (best !== -1 && best !== centerSlot) {
          const rot = best - centerSlot;
          if (rot > 0) for (let k = 0; k < rot; k++) filmSlots.push(filmSlots.shift());
          else         for (let k = 0; k < -rot; k++) filmSlots.unshift(filmSlots.pop());
          /* reassign srcIdx after rotation */
          filmSlots.forEach((s, si) => {
            s.srcIdx = ((current + (si - centerSlot)) % images.length + images.length * 100) % images.length;
            s.el.src = images[s.srcIdx].getAttribute('src') || images[s.srcIdx].dataset.src || '';
          });
        }
        renderFilmstrip(true);
      }
    }

    if (!clickTarget) return;
    clickTarget.style.pointerEvents = 'auto';

    clickTarget.addEventListener('click', e => {
      if (e.target.closest('.panel-close')) return;
      if (e.target.closest('.carousel-filmstrip')) return;
      const { left, width } = clickTarget.getBoundingClientRect();
      const goNext = e.clientX > left + width / 2;
      const next = goNext
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;
      show(next);
    });

    /* swipe on mobile */
    let touchStartX = 0;
    clickTarget.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    clickTarget.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) < 40) return;
      const next = dx < 0
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;
      show(next);
    }, { passive: true });
  }

  /* ── Panel navigation element (created once, moved into each active panel) ── */
  const panelNavEl = document.createElement('div');
  panelNavEl.id = 'panel-nav';
  panelNavEl.innerHTML =
    '<button class="panel-nav-btn" id="panel-nav-prev">&lt;</button>' +
    '<span class="page-lang-sep">/</span>' +
    '<button class="panel-nav-btn" id="panel-nav-next">&gt;</button>';

  /* ── Panel registry & navigation ── */
  const panelRegistry = [];
  let   currentOpenIdx = null;
  let   isNavigating   = false;

  function navigatePanel(dir) {
    if (currentOpenIdx === null || isNavigating) return;
    isNavigating = true;

    const fromIdx   = currentOpenIdx;
    const toIdx     = (currentOpenIdx + dir + panelRegistry.length) % panelRegistry.length;
    const fromEntry = panelRegistry[fromIdx];
    const toEntry   = panelRegistry[toIdx];

    /* update state — bypass normal open/close guards */
    fromEntry.setOpen(false);
    toEntry.setOpen(true);
    currentOpenIdx = toIdx;

    /* closeStack */
    const si = closeStack.indexOf(fromEntry.closeFn);
    if (si !== -1) closeStack.splice(si, 1);
    closeStack.push(toEntry.closeFn);

    if (window._playPanelSound) window._playPanelSound();

    /* disable hscroll on departing panel */
    if (fromEntry.panel.querySelector('.hscroll-track') && window.HScroll && window.innerWidth > 768) {
      HScroll.disable(fromEntry.panelId);
    }

    /* lazy-load arriving panel */
    lazyLoad(toEntry.panel, toEntry.type);
    if (window.innerWidth <= 768) {
      const info = toEntry.panel.querySelector('.project-info');
      if (info) requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--info-height', info.offsetHeight + 'px');
      });
    }
    if (toEntry.panel.querySelector('.hscroll-track') && window.HScroll && window.innerWidth > 768) {
      gsap.delayedCall(1.0, () => HScroll.enable(toEntry.panelId));
    }

    /* move nav arrows into arriving panel */
    toEntry.panel.appendChild(panelNavEl);

    /* direction: next (dir>0) → from exits left, to enters from right
                  prev (dir<0) → from exits right, to enters from left */
    const exitX  = dir > 0 ? '-100%' : '100%';
    const enterX = dir > 0 ?  '100%' : '-100%';

    /* bg: snap arriving bg into place immediately (it's behind the panel) */
    gsap.set(toEntry.bg,   { y: '0%', pointerEvents: 'auto' });
    gsap.set(toEntry.panel, { x: enterX, y: '0%' });

    /* animate panels: departing slides horizontally out, arriving slides in */
    gsap.timeline({ onComplete: () => { isNavigating = false; } })
      .to(fromEntry.panel, { x: exitX,  duration: 0.55, ease: 'power3.inOut', pointerEvents: 'none' }, 0)
      .to(fromEntry.bg,    { y: '100%', duration: 0.55, ease: 'power3.inOut', pointerEvents: 'none' }, 0)
      .to(toEntry.panel,   { x: '0%',  duration: 0.55, ease: 'power3.inOut', pointerEvents: 'auto' }, 0)
      .set(fromEntry.panel, { x: '0%', y: '100%' }); /* reset from-panel for future use */
  }

  /* ── Panel factory ── */
  function initPanel(floatImg) {
    const panelId  = floatImg.dataset.panel;
    if (!panelId) return;

    const panel    = document.getElementById(panelId);
    const bg       = document.getElementById(panelId.replace('-panel', '-bg'));
    const closeBtn = panel ? panel.querySelector('.panel-close') : null;
    const type     = floatImg.dataset.type || null;

    if (!panel || !bg || !closeBtn) return;

    const registryIdx = panelRegistry.length;
    const entry = { panel, bg, panelId, type, isOpen: false, closeFn: null, setOpen: null };
    panelRegistry.push(entry);

    entry.setOpen = (v) => { entry.isOpen = v; };

    gsap.set([panel, bg], { y: '100%', pointerEvents: 'none' });

    function open() {
      if (entry.isOpen) return;
      entry.setOpen(true);
      currentOpenIdx = registryIdx;
      if (window._playPanelSound) window._playPanelSound();
      closeStack.push(closePanel);

      lazyLoad(panel, type);

      if (window.innerWidth <= 768) {
        const info = panel.querySelector('.project-info');
        if (info) requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--info-height', info.offsetHeight + 'px');
        });
      }

      if (panel.querySelector('.hscroll-track') && window.HScroll && window.innerWidth > 768) {
        gsap.delayedCall(1.15, () => HScroll.enable(panelId));
      }

      /* move nav arrows into this panel */
      panel.appendChild(panelNavEl);
      panelNavEl.classList.add('is-open');

      gsap.timeline()
        .to(bg,    { y: '0%', duration: 0.48, ease: 'power2.out', pointerEvents: 'auto' })
        .to(panel, { y: '0%', duration: 1.12, ease: 'power4.out', pointerEvents: 'auto' }, '-=0.2');
    }

    function closePanel() {
      if (!entry.isOpen) return;
      entry.setOpen(false);
      if (currentOpenIdx === registryIdx) currentOpenIdx = null;
      panelNavEl.classList.remove('is-open');
      if (window._playPanelSound) window._playPanelSound();
      const idx = closeStack.indexOf(closePanel);
      if (idx !== -1) closeStack.splice(idx, 1);

      function animateClose() {
        if (window.HScroll) HScroll.disable(panelId);
        gsap.to(panel, { y: '100%', duration: 0.8, ease: 'power3.in', pointerEvents: 'none' });
        gsap.to(bg,    { y: '100%', duration: 0.8, ease: 'power3.in', pointerEvents: 'none', delay: 0.1 });
      }

      if (panel.querySelector('.hscroll-track') && window.HScroll && window.innerWidth > 768) {
        HScroll.resetToStart(panelId, animateClose);
      } else {
        animateClose();
      }
    }

    entry.closeFn = closePanel;

    floatImg.addEventListener('click', open);
    closeBtn.addEventListener('click', closePanel);

    /* ── Panel-level swipe → navigate between projects ── */
    let panelTouchX = 0;
    panel.addEventListener('touchstart', e => {
      panelTouchX = e.touches[0].clientX;
    }, { passive: true });
    panel.addEventListener('touchend', e => {
      if (!entry.isOpen) return;
      /* ignore swipes that originated inside image/carousel/filmstrip/info areas */
      if (e.target.closest('.project-carousel, .split-carousel, .hscroll-track, .carousel-filmstrip, .project-info, .panel-close, #panel-nav')) return;
      const dx = e.changedTouches[0].clientX - panelTouchX;
      if (Math.abs(dx) < 50) return;
      navigatePanel(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  document.querySelectorAll('.float-img[data-panel]').forEach(initPanel);

  /* expose close-all for external use (e.g. contact-bio panel) */
  window._panelCloseAll = () => { [...closeStack].forEach(fn => fn()); };

  /* ── Wire navigation arrows ── */
  panelNavEl.querySelector('#panel-nav-prev').addEventListener('click', () => navigatePanel(-1));
  panelNavEl.querySelector('#panel-nav-next').addEventListener('click', () => navigatePanel(1));

})();