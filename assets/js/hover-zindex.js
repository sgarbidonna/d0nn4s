/* ══════════════════════════════════════ HOVER Z-INDEX + SCALE */

const floatImgs = document.querySelectorAll('.float-img');

if (floatImgs.length) {
  const BASE_Z  = 10;
  const HOVER_Z = 150;

  floatImgs.forEach(el => {
    el.style.zIndex = BASE_Z;

    el.addEventListener('mouseenter', () => {
      el.style.zIndex = HOVER_Z;
      /* Solo escala si está activa (scale > 0) */
      if (gsap.getProperty(el, 'scaleX') > 0.05) {
        gsap.to(el, { scale: 1.1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.zIndex = BASE_Z;
      if (gsap.getProperty(el, 'scaleX') > 0.05) {
        gsap.to(el, { scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }
    });
  });
}