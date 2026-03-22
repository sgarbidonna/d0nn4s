/* ══════════════════════════════════════ PRELOADER */
(function () {
  const preloader = document.getElementById('preloader');
  const text1     = document.getElementById('loader-text');
  const text2     = document.getElementById('loader-text-2');
  const letters1  = text1.querySelectorAll('span:not(.space)');
  const letters2  = text2.querySelectorAll('span:not(.space)');
  const space1    = document.getElementById('the-space');
  const space2    = document.getElementById('the-space-2');
  const barWrap   = document.getElementById('loader-bar-wrap');
  const line      = document.getElementById('loader-line');
  const site      = document.getElementById('site');

  /* ── spread helper ── */
  function setSpace(textEl, spaceEl, content) {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:inherit;font-size:inherit;font-weight:inherit;letter-spacing:inherit;text-transform:uppercase;';
    probe.textContent = content;
    textEl.appendChild(probe);
    const lettersW = probe.offsetWidth;
    textEl.removeChild(probe);
    const padding = window.innerWidth <= 768 ? 48 : 104; /* 24px each side on mobile */
    const spread = window.innerWidth - lettersW - padding;
    spaceEl.style.width = Math.max(spread, 16) + 'px';
  }

  setSpace(text1, space1, '3d+aiartist');
  setSpace(text2, space2, 'selectedworks');

  window.addEventListener('resize', () => {
    setSpace(text1, space1, '3d+aiartist');
    setSpace(text2, space2, 'selectedworks');
  });

  /* ── estado inicial ── */
  gsap.set(text2, { opacity: 0 });
  const menuItems = document.querySelectorAll('.nav-links button:not(#btn-selected-works)');
  gsap.set(menuItems, { opacity: 0 });

  /* ══════════════ FASE 1 — "3D + AI ARTIST" (5s) ══════════════ */

  /* letras entran */
  gsap.to(letters1, {
    opacity: 1,
    stagger: 0.065,
    duration: 0.6,
    ease: 'power1.out'
  });

  /* bar 1: 0→100% en 5s */
  gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 5, ease: 'none' });

  const tl = gsap.timeline({ delay: 0.2 });

  tl
    /* esperar que el bar llegue al final */
    .to({}, { duration: 4.4 })

    /* fade out texto 1 */
    .to(text1, { opacity: 0, duration: 0.3, ease: 'power1.in' })

    /* reset bar → 0 instantáneo */
    .call(() => {
      gsap.set(line, { scaleX: 0, opacity: 1 });
    })

    /* bar 2: 0→100% en 2s */
    .call(() => {
      gsap.to(line, { scaleX: 1, duration: 2, ease: 'none' });
    })

    /* ══ FASE 2 — "SELECTED WORKS" (2s) ══ */

    /* mostrar texto 2 y animar letras */
    .to(text2, { opacity: 1, duration: 0.01 })
    .to(letters2, {
      opacity: 1,
      stagger: 0.055,
      duration: 0.5,
      ease: 'power1.out'
    }, '<')

    /* esperar 2s totales de fase 2 */
    .to({}, { duration: 1.0 })

    /* colapsar space → gap normal */
    .to(space2, { width: '0.5em', duration: 0.8, ease: 'power2.inOut' })

    /* ocultar bar */
    .to(line, {
      opacity: 0, duration: 0.25, ease: 'none',
      onComplete: () => { barWrap.style.display = 'none'; }
    }, '-=0.3')

    /* shrink font */
    .to(text2, {
      fontSize: 'clamp(11px, 1vw, 14px)',
      letterSpacing: '0.12em',
      duration: 0.45,
      ease: 'power2.inOut'
    }, '+=0.05')

    /* mover hacia contact-bio + desaparecer antes de llegar */
    .to(text2, {
      duration: 0.45,
      ease: 'power2.inOut',
      onStart() {
        const btn    = document.getElementById('contact-bio');
        const btnR   = btn.getBoundingClientRect();
        const target = btnR.top + btnR.height / 2;
        gsap.to(text2, {
          top: target,
          yPercent: -50,
          duration: 0.45,
          ease: 'power2.inOut'
        });
        /* fade out a mitad del viaje */
        gsap.to(text2, {
          opacity: 0,
          duration: 0.18,
          delay: 0.16,
          ease: 'power1.in'
        });
      }
    }, '-=0.45')

    /* fade out preloader, reveal site */
    .to(preloader, {
      opacity: 0, duration: 0.25, ease: 'power1.in',
      onComplete: () => { preloader.style.display = 'none'; }
    }, '+=0.1')
    .to(site, { opacity: 1, duration: 0.01 }, '<')

    /* menú entra un poco antes — overlap con fade del preloader */
    .to(menuItems, {
      opacity: 1,
      stagger: 0.09,
      duration: 0.35,
      ease: 'power2.out'
    }, '-=0.22')

    /* lang switcher appears after menu */
    .to('#page-lang-switcher', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        document.getElementById('page-lang-switcher').style.pointerEvents = 'auto';
      }
    }, '+=0.1');

})();


/* ══════════════════════════════════════ NAV — TOGGLE */
(function () {

  const categories = ['ai', '3d', 'vfx', 'graphic-design'];

  categories.forEach(cat => {

    const btn     = document.querySelector(`.nav-links button[data-section="${cat}"]`);
    const targets = document.querySelectorAll(`.float-img[data-category="${cat}"]`);

    if (!btn || !targets.length) return;

    btn.addEventListener('click', () => {

      const isActive = btn.classList.contains('active');

      /* deactivate all other category buttons */
      categories.forEach(other => {
        if (other === cat) return;
        const otherBtn = document.querySelector(`.nav-links button[data-section="${other}"]`);
        if (otherBtn && otherBtn.classList.contains('active')) {
          otherBtn.classList.remove('active');
          document.querySelectorAll(`.float-img[data-category="${other}"]`).forEach(el => {
            gsap.to(el, { scale: 0, opacity: 0, duration: 0.35, ease: 'power2.in' });
          });
        }
      });

      btn.classList.toggle('active');

      targets.forEach(el => {
        if (isActive) {
          gsap.to(el, { scale: 0, opacity: 0, duration: 0.35, ease: 'power2.in' });
        } else {
          gsap.fromTo(el,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }
          );
        }
      });

    });
  });

})();


/* ══════════════════════════════════════ CONTACT-BIO PANEL */
(function () {

  const openBtn  = document.getElementById('contact-bio');
  const closeBtn = document.getElementById('close-contactbio');
  const panel    = document.getElementById('contact-bio-cv');

  if (!openBtn || !closeBtn || !panel) return;

  /* pin at top-left corner — panel swings in like a sheet of paper */
  gsap.set(panel, { transformOrigin: '0% 0%', rotation: -95 });

  /* doodle stroke setup */
  const doodle     = document.querySelector('.nav-links .doodle');
  const doodlePath = doodle && doodle.querySelector('.doodle-path');
  let pathLen = 0;
  if (doodlePath) {
    pathLen = doodlePath.getTotalLength();
    gsap.set(doodlePath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
  }

  let isOpen = false;
  let prevActiveButtons = [];

  function openPanel() {
    if (isOpen) return;
    isOpen = true;
    if (window._playPanelSound) window._playPanelSound();
    openBtn.classList.add('active');

    /* close any open project panels */
    if (window._panelCloseAll) window._panelCloseAll();

    /* raise #home so nav stays above the folio background */
    document.getElementById('home').style.zIndex = '410';

    /* hide any currently visible float-imgs and remember them */
    document.querySelectorAll('.float-img').forEach(el => {
      if (parseFloat(gsap.getProperty(el, 'opacity')) > 0) {
        el.dataset.wasVisible = '1';
        gsap.to(el, { scale: 0, opacity: 0, duration: 0.35, ease: 'power2.in' });
      }
    });

    /* save active category buttons then deactivate and disable them */
    prevActiveButtons = [];
    document.querySelectorAll('.nav-links button[data-section]:not(#contact-bio):not(#btn-selected-works)')
      .forEach(btn => {
        if (btn.classList.contains('active')) prevActiveButtons.push(btn);
        btn.classList.remove('active');
        btn.disabled = true;
      });

    /* paper swings open — pinned top-left, three-stage soft movement */
    panel.classList.add('panel-open');
    gsap.timeline({
      onComplete() {
        /* draw doodle circle when panel lands */
        if (!doodle || !doodlePath) return;
        gsap.set(doodlePath, { strokeDashoffset: pathLen });
        gsap.set(doodle, { opacity: 1 });
        gsap.to(doodlePath, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' });
      }
    })
      .to(panel, { y: '-45%', x: '-18%', rotation: -104, duration: 0.7,  ease: 'sine.inOut' })
      .to(panel, { y: '-18%', x:  '16%', rotation:   11, duration: 0.65, ease: 'sine.inOut' }, '-=0.3')
      .to(panel, { y:   '0%', x:   '0%', rotation:    0, duration: 0.6,  ease: 'sine.out'   }, '-=0.3');
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;
    if (window._playPanelSound) window._playPanelSound();
    openBtn.classList.remove('active');
    panel.classList.remove('panel-open');

    /* restore #home z-index */
    document.getElementById('home').style.zIndex = '';

    /* hide doodle immediately */
    if (doodle) gsap.to(doodle, { opacity: 0, duration: 0.25 });

    gsap.to(panel, {
      y: '-120%', x: '6%', rotation: -10,
      duration: 0.7, ease: 'power2.inOut',
      onComplete() {
        /* restore float-imgs that were visible */
        document.querySelectorAll('.float-img[data-was-visible]').forEach(el => {
          delete el.dataset.wasVisible;
          gsap.fromTo(el,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }
          );
        });
        /* re-enable and restore previously active category buttons */
        document.querySelectorAll('.nav-links button[data-section]:not(#contact-bio):not(#btn-selected-works)')
          .forEach(btn => { btn.disabled = false; });
        prevActiveButtons.forEach(btn => btn.classList.add('active'));
        prevActiveButtons = [];
      }
    });
  }

  /* expose close-without-restore for TAB cycle */
  window._bioCloseNoRestore = function() {
    prevActiveButtons = [];
    document.querySelectorAll('.float-img[data-was-visible]').forEach(el => {
      delete el.dataset.wasVisible;
    });
    closePanel();
  };

  openBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

})();


/* ══════════════════════════════════════ BIO LANGUAGE SWITCHER */
(function () {

  let currentLang = 'es';

  const langLabels = { en: 'LANGUAGES', es: 'IDIOMAS', fr: 'LANGUES', it: 'LINGUE' };

  function switchLanguage(lang) {
    if (lang === currentLang) return;

    const currentBio = document.querySelector(`.bio-lang[data-lang="${currentLang}"]`);
    const nextBio    = document.querySelector(`.bio-lang[data-lang="${lang}"]`);
    if (!currentBio || !nextBio) return;

    currentBio.classList.remove('active');
    setTimeout(() => nextBio.classList.add('active'), 80);

    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const label = document.getElementById('bio-label-languages');
    if (label) label.textContent = langLabels[lang] || 'LANGUAGES';

    currentLang = lang;
  }

  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });

})();


/* ── Page-wide ES / EN language switcher ── */
(function () {
  const btns = document.querySelectorAll('.page-lang-btn');
  if (!btns.length) return;

  function applyPageLang(lang) {
    /* update switcher button states immediately */
    btns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

    /* fade out translatable text, swap, fade in */
    const transEls = Array.from(document.querySelectorAll('[data-es][data-en]'));
    gsap.to(transEls, {
      opacity: 0, duration: 0.15,
      onComplete: () => {
        transEls.forEach(el => {
          el.innerHTML = el.dataset[lang] !== undefined ? el.dataset[lang] : el.dataset.es;
        });
        gsap.to(transEls, { opacity: 1, duration: 0.25 });
      }
    });

    /* cross-fade bio text */
    const curBio  = document.querySelector('.bio-lang.active');
    const nextBio = document.querySelector(`.bio-lang[data-lang="${lang}"]`);
    if (curBio && nextBio && curBio !== nextBio) {
      gsap.to(curBio, {
        opacity: 0, duration: 0.15,
        onComplete: () => {
          curBio.classList.remove('active');
          nextBio.classList.add('active');
          gsap.fromTo(nextBio, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        }
      });
    }

  }

  /* apply default on init */
  applyPageLang('es');

  btns.forEach(btn => btn.addEventListener('click', () => applyPageLang(btn.dataset.lang)));
})();


/* ── TAB key nav cycle ── */
(function () {
  // order: ai → 3d → vfx → graphic-design → contact-bio → close-all
  const CAT_ORDER = ['ai', '3d', 'vfx', 'graphic-design'];
  let step = 0;
  // 0-3: category index, 4: contact-bio open, 5: close-all

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();

    if (step < CAT_ORDER.length) {
      /* deactivate any active category that isn't the one we're about to activate */
      document.querySelectorAll('.nav-links button[data-section].active').forEach(b => {
        if (b.dataset.section !== CAT_ORDER[step]) b.click();
      });
      /* activate next category */
      const btn = document.querySelector(`.nav-links button[data-section="${CAT_ORDER[step]}"]`);
      if (btn) { btn.disabled = false; btn.click(); }
      step++;

    } else if (step === CAT_ORDER.length) {
      /* open contact-bio panel */
      const contactBtn = document.getElementById('contact-bio');
      if (contactBtn) contactBtn.click();
      step++;

    } else {
      /* close everything — no state restored */
      if (window._bioCloseNoRestore) window._bioCloseNoRestore();
      step = 0;
    }
  });
})();

/* ══════════════════════════════════════ NAV SOUND UI */
(function () {
  /* swap path once you have the file */
  const SOUND_SRC = './assets/sounds/nav-click.mpeg';

  const audio = new Audio(SOUND_SRC);
  audio.preload = 'auto';
  audio.volume = 0.6;

  function playNavSound() {
    audio.currentTime = 0;
    audio.play().catch(() => { /* autoplay policy — silently ignore */ });
  }

  window._playNavSound = playNavSound;

  document.querySelectorAll('.nav-links button').forEach(btn => {
    btn.addEventListener('click', playNavSound);
  });
})();

/* ══════════════════════════════════════ PANEL OPEN/CLOSE SOUND */
(function () {
  const SOUND_SRC = './assets/sounds/panel-open.mpeg';

  const audio = new Audio(SOUND_SRC);
  audio.preload = 'auto';
  audio.volume = 0.6;

  window._playPanelSound = function () {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
})();

/* ══════════════════════════════════════ FLOAT-IMG HOVER SOUND */
(function () {
  /* same file as nav click — pitched via Web Audio API */
  const SOUND_SRC = './assets/sounds/nav-click.mpeg';
  const SEMITONES = [-26, -18, -6];
  let modeIndex  = 0;

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let buffer = null;

  fetch(SOUND_SRC)
    .then(r  => r.arrayBuffer())
    .then(ab => ctx.decodeAudioData(ab))
    .then(buf => { buffer = buf; })
    .catch(() => {});

  function playHoverSound() {
    if (!buffer) return;
    if (ctx.state === 'suspended') ctx.resume();

    const gain   = ctx.createGain();
    gain.gain.value = 0.5;
    gain.connect(ctx.destination);

    const source = ctx.createBufferSource();
    source.buffer       = buffer;
    source.playbackRate.value = Math.pow(2, SEMITONES[modeIndex] / 12);
    source.connect(gain);
    source.start(0);

    modeIndex = (modeIndex + 1) % SEMITONES.length;
  }

  document.querySelectorAll('.float-img').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
  });

  window._playHoverSound = playHoverSound;
})();

/* ══════════════════════════════════════ BICO TOOLTIP */
(function () {
  const tip = document.createElement('div');
  tip.id = 'bico-tooltip';
  document.body.appendChild(tip);

  document.querySelectorAll('.bico').forEach(img => {
    img.addEventListener('mouseenter', e => {
      tip.textContent = img.alt;
      tip.classList.add('visible');
      moveTip(e);
    });
    img.addEventListener('mousemove', moveTip);
    img.addEventListener('mouseleave', () => tip.classList.remove('visible'));
  });

  function moveTip(e) {
    tip.style.left = (e.clientX + 14) + 'px';
    tip.style.top  = (e.clientY - 24) + 'px';
  }
})();

/* ══════════════════════════════════════ MOBILE CATEGORY CAROUSELS */
(function () {
  if (window.innerWidth > 768) return;

  const ITEM_GAP  = 110;
  const CATS      = ['ai', '3d', 'vfx', 'graphic-design'];
  const registry  = {}; /* category → { show, hide } */

  function makeCarousel(category) {
    const floats = Array.from(document.querySelectorAll(`.float-img[data-category="${category}"]`));
    if (!floats.length) return null;

    const wrap = document.createElement('div');
    wrap.className = 'mob-cat-carousel';
    wrap.id = `mob-${category}-carousel`;
    document.body.appendChild(wrap);

    let currentIndex = 0;

    const items = floats.map(floatImg => {
      const el = document.createElement('div');
      el.className = 'mob-car-item';
      el.appendChild(floatImg.querySelector('img').cloneNode(true));
      el.dataset.panel = floatImg.dataset.panel;
      wrap.appendChild(el);
      el.addEventListener('click', () => floatImg.click());
      return el;
    });

    function render(animated) {
      const len     = items.length;
      const centerY = wrap.offsetHeight / 2;
      items.forEach((el, i) => {
        const raw    = i - currentIndex;
        const off    = ((raw + len + Math.floor(len / 2)) % len) - Math.floor(len / 2);
        const absOff = Math.abs(off);
        const y      = centerY + off * ITEM_GAP - el.offsetHeight / 2;
        const scale   = absOff === 0 ? 1  : absOff === 1 ? 0.72 : 0.48;
        const opacity = absOff === 0 ? 1  : absOff === 1 ? 0.38 : absOff === 2 ? 0.12 : 0;
        const zIndex  = absOff === 0 ? 10 : absOff === 1 ? 5    : 1;
        if (animated) gsap.to(el,  { y, scale, opacity, zIndex, duration: 0.45, ease: 'power3.out' });
        else          gsap.set(el, { y, scale, opacity, zIndex });
      });
    }

    function show() {
      /* hide every other carousel first */
      CATS.forEach(cat => { if (cat !== category && registry[cat]) registry[cat].hide(); });
      currentIndex = 0;
      render(false);
      wrap.classList.add('is-visible');
    }

    function hide() {
      wrap.classList.remove('is-visible');
    }

    /* nav button toggle */
    const btn = document.querySelector(`.nav-links button[data-section="${category}"]`);
    if (btn) {
      btn.addEventListener('click', () => {
        setTimeout(() => { if (btn.classList.contains('active')) show(); else hide(); }, 0);
      });
      new MutationObserver(() => {
        if (!btn.classList.contains('active')) hide();
      }).observe(btn, { attributes: true, attributeFilter: ['class'] });
    }

    /* swipe up / down */
    let startY = 0;
    wrap.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;
      if (diff > 0) currentIndex = (currentIndex + 1) % items.length;
      else          currentIndex = (currentIndex - 1 + items.length) % items.length;
      if (window._playHoverSound) window._playHoverSound();
      render(true);
    }, { passive: true });

    return { show, hide };
  }

  CATS.forEach(cat => { registry[cat] = makeCarousel(cat); });
})();