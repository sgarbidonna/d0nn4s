/* Panels de secciones con GSAP (apertura/cierre) */

/* */

document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     CONFIG
  =============================== */

  if (window.innerWidth < 1024) return;

  const images = [...document.querySelectorAll('.main-img-by-project')];
  if (!images.length || typeof gsap === 'undefined') return;

  let mouseX = 0;
  let mouseY = 0;
  let parallaxEnabled = false;

  /* ===============================
     INTERSECTION OBSERVER
     Activa solo si hay imágenes visibles
  =============================== */

  const observer = new IntersectionObserver(
    entries => {
      parallaxEnabled = entries.some(entry => entry.isIntersecting);
    },
    {
      threshold: 0.2
    }
  );

  images.forEach(img => observer.observe(img));

  /* ===============================
     MOUSE TRACKING
     Valores normalizados
  =============================== */

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  /* ===============================
     GSAP TICKER
     Parallax con depth real
  =============================== */

  gsap.ticker.add(() => {
    if (!parallaxEnabled) return;

    /* Si hay overlays activos, se puede pausar */
    if (document.querySelector('.project-section.active')) return;

    images.forEach((img, index) => {
      const depth = (index + 1) / images.length; // profundidad real

      const intensity = 60 * depth;

      gsap.to(img, {
        x: -mouseX * intensity,
        y: -mouseY * intensity,
        //duration: 0.4,
        duration: 0.6,
        //ease: "power2.out",
        ease: "power3.out",
        overwrite: true
      });
    });
  });

});




/*

//invertir profundidad
const depth = 1 - (index / images.length);


//menos movimiento
const intensity = 40 * depth;

//mas suavidad
duration: 0.6,
ease: "power3.out"

*/
