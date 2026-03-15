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
    const spread = window.innerWidth - lettersW - 104;
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
    opacity: 1, y: 0,
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
      opacity: 1, y: 0,
      stagger: 0.055,
      duration: 0.5,
      ease: 'power1.out'
    }, '<')

    /* esperar 2s totales de fase 2 */
    .to({}, { duration: 1.0 })

    /* colapsar space → gap normal */
    .to(space2, { width: '0.35em', duration: 0.8, ease: 'power2.inOut' })

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
    }, '-=0.22');

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
      btn.classList.toggle('active');

      targets.forEach(el => {
        if (isActive) {
          gsap.to(el, {
            scale: 0, opacity: 0,
            duration: 0.35,
            ease: 'power2.in'
          });
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