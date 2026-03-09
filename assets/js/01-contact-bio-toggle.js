/* Abrir/cerrar panel Contact Bio CV */

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('loader-text');
  const closeBtn = document.getElementById('close-contactbio');
  const panelContactBioCV = document.getElementById('contact-bio-cv');

  const sectionsToHide = ['graphic-design', 'ai', 'vfx', 'd3'];

  if (!openBtn || !closeBtn || !panelContactBioCV || !window.gsap) return;

  let isOpen = false;

  function hideMainSections() {
    sectionsToHide.forEach(id => {
      document.querySelectorAll(`#${id}`).forEach(el => {
        gsap.to(el, {
          opacity: 0,
          y: 30,
          duration: 0.25,
          ease: 'power2.out',
          pointerEvents: 'none'
        });
      });
    });
  }

  function showMainSections() {
    sectionsToHide.forEach(id => {
      document.querySelectorAll(`#${id}`).forEach(el => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          pointerEvents: 'auto'
        });
      });
    });
  }

  function openPanel() {
    if (isOpen) return;
    isOpen = true;

    hideMainSections();
    panelContactBioCV.classList.add('panel-open');

    const tl = gsap.timeline();

    tl
      .to(panelContactBioCV, {
        y: '-45%',
        x: '-18%',
        rotation: -104,
        duration: 0.22,
        ease: 'steps(4)',
        pointerEvents: 'auto'
      })
      .to(panelContactBioCV, {
        y: '-18%',
        x: '16%',
        rotation: 11,
        duration: 0.22,
        ease: 'steps(4)'
      })
      .to(panelContactBioCV, {
        y: '0%',
        x: '0%',
        rotation: 0,
        duration: 0.28,
        ease: 'steps(5)'
      });
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;

    panelContactBioCV.classList.remove('panel-open');

    gsap.to(panelContactBioCV, {
      y: '-120%',
      x: '6%',
      rotation: -10,
      duration: 0.45,
      ease: 'steps(5)',
      pointerEvents: 'none',
      onComplete: showMainSections
    });
  }

  openBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });
});
