/* ══════════════════════════════════════ MOUSE REPELER */

if (window.innerWidth >= 1024 && typeof gsap !== 'undefined') {

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  gsap.ticker.add(() => {
    const images = [...document.querySelectorAll('.float-img')].filter(el =>
      gsap.getProperty(el, 'scaleX') > 0.05
    );

    if (!images.length) return;

    images.forEach((img, index) => {
      const depth     = (index + 1) / images.length;
      const intensity = 55 * depth;

      gsap.to(img, {
        x: -mouseX * intensity,
        y: -mouseY * intensity,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });
  });

}