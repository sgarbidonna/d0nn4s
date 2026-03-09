/* Títulos de sección → navegación por ID */

document.addEventListener('DOMContentLoaded', () => {
  const map = {
    'contact-bio-title': 'contact-bio',
    'ai-title': 'ai',
    'd3-title': 'd3',
    'vfx-title': 'vfx',
    'graphic-design-title': 'graphic-design'
  };

  Object.entries(map).forEach(([titleId, targetId]) => {
    const trigger = document.getElementById(titleId);
    const targets = document.querySelectorAll(`#${targetId}`);

    if (!trigger || targets.length === 0) return;

    trigger.addEventListener('click', () => {
      // Toggle estado visual del title (underline persistente)
      trigger.classList.toggle('active');

      // Toggle estado de los contenedores
      targets.forEach(el => {
        el.classList.toggle('active');
      });
    });
  });
});
