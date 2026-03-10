/* ══════════════════════════════════════ PRELOADER */
(function () {
  const preloader = document.getElementById('preloader');
  const text      = document.getElementById('loader-text');
  const letters   = text.querySelectorAll('span:not(.space)');
  const space     = document.getElementById('the-space');
  const barWrap   = document.getElementById('loader-bar-wrap');
  const line      = document.getElementById('loader-line');
  const site      = document.getElementById('site');

  /* Spread: push SELECTED to left edge, WORKS to right edge */
  function setSpace() {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:inherit;font-size:inherit;font-weight:inherit;letter-spacing:inherit;text-transform:uppercase;';
    probe.textContent = 'SELECTEDWORKS';
    text.appendChild(probe);
    const lettersW = probe.offsetWidth;
    text.removeChild(probe);
    const spread = window.innerWidth - lettersW - 104; /* 52px margin each side */
    space.style.width = Math.max(spread, 16) + 'px';
  }

  setSpace();
  window.addEventListener('resize', setSpace);

  /* Letters in */
  gsap.to(letters, {
    opacity: 1, y: 0,
    stagger: 0.065,
    duration: 0.6,
    ease: 'power1.out'
  });

  /* Bar */
  gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 3.5, ease: 'none' });

  /* Menu items (all except SELECTED WORKS) start hidden */
  const menuItems = document.querySelectorAll('.nav-links button:not(#btn-selected-works)');
  gsap.set(menuItems, { opacity: 0, y: 0 });

  /* Timeline */
  const tl = gsap.timeline({ delay: 0.2 });

  tl
    /* hold while bar loads */
    .to({}, { duration: 2.9 })

    /* collapse space → normal word gap */
    .to(space, { width: '0.35em', duration: 0.8, ease: 'power2.inOut' })

    /* hide bar */
    .to(line, {
      opacity: 0, duration: 0.25, ease: 'none',
      onComplete: () => { barWrap.style.display = 'none'; }
    }, '-=0.3')

    /* 1. shrink font in place */
    .to(text, {
      fontSize: 'clamp(11px, 1vw, 14px)',
      letterSpacing: '0.30em',
      duration: 0.45,
      ease: 'power2.inOut'
    }, '+=0.05')

    /* 2. move to exact position of #btn-selected-works */
    .to(text, {
      duration: 0.45,
      ease: 'power2.inOut',
      onStart() {
        const btn       = document.getElementById('btn-selected-works');
        const btnR      = btn.getBoundingClientRect();
        const targetTop = btnR.top + btnR.height / 2;
        gsap.to(text, {
          top: targetTop,
          yPercent: -50,
          duration: 0.45,
          ease: 'power2.inOut'
        });
      }
    }, '-=0.45')

    /* brief pause — text has landed */
    .to({}, { duration: 0.12 })

    /* cut preloader, reveal site */
    .to(preloader, {
      opacity: 0, duration: 0.25, ease: 'power1.in',
      onComplete: () => { preloader.style.display = 'none'; }
    })
    .to(site, { opacity: 1, duration: 0.01 }, '<')

    /* stagger in the remaining menu items */
    .to(menuItems, {
      opacity: 1,
      stagger: 0.09,
      duration: 0.35,
      ease: 'power2.out'
    }, '-=0.05');
})();


/* ══════════════════════════════════════ NAV — TOGGLE */
(function () {

  const map = {
    'ai':             'ia',
    '3d':             'tres-d',
    'vfx':            'vfx',
    'graphic-design': 'graphic-design'
  };

  Object.entries(map).forEach(([sectionKey, targetId]) => {

    const btn     = document.querySelector(`.nav-links button[data-section="${sectionKey}"]`);
    const targets = document.querySelectorAll(`[id="${targetId}"]`);

    if (!btn || !targets.length) return;

    btn.addEventListener('click', () => {

      const isActive = btn.classList.contains('active');
      btn.classList.toggle('active');

      targets.forEach(el => {
        if (isActive) {
          /* Apagar → scale(0) + opacity(0) */
          gsap.to(el, {
            scale: 0,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in'
          });
        } else {
          /* Encender → scale(1) + opacity(1) */
          gsap.fromTo(el,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }
          );
        }
      });

    });
  });

})();