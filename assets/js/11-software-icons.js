/* Software icons + elementos click/scroll */

document.addEventListener('DOMContentLoaded', () => {

  const softwareIcons = document.querySelectorAll('.software-icon');
  const clickElements  = document.querySelectorAll('#click');
  const scrollElements = document.querySelectorAll('#scroll');

  if (!softwareIcons.length && !clickElements.length && !scrollElements.length) return;

  const labelsById = {
    'blender': 'Blender',
    'unreal-engine': 'Unreal Engine',
    'daz-studio': 'Daz Studio',
    'effect-house': 'Effect House',
    'after-effects': 'After Effects',
    'premiere': 'Premiere',
    'photoshop': 'Photoshop',
    'comfy': 'Comfy',
    'touch-designer': 'Touch Designer'
  };

  let tooltip = null;

  /* ===============================
     TOOLTIP HELPERS
  =============================== */

  function showTooltip(text, x, y) {
    tooltip = document.createElement('div');
    tooltip.className = 'software-tooltip';
    tooltip.textContent = text;
    tooltip.style.left = `${x}px`;
    tooltip.style.top  = `${y}px`;
    document.body.appendChild(tooltip);
  }

  function moveTooltip(x, y) {
    if (!tooltip) return;
    tooltip.style.left = `${x}px`;
    tooltip.style.top  = `${y}px`;
  }

  function hideTooltip() {
    if (!tooltip) return;
    tooltip.remove();
    tooltip = null;
  }

  /* ===============================
     SOFTWARE ICONS
  =============================== */

  softwareIcons.forEach(icon => {
    icon.addEventListener('mouseenter', (e) => {
      const label = labelsById[icon.id];
      if (!label) return;
      showTooltip(label, e.clientX, e.clientY);
    });

    icon.addEventListener('mousemove', (e) => {
      moveTooltip(e.clientX, e.clientY);
    });

    icon.addEventListener('mouseleave', hideTooltip);
  });

  /* ===============================
     CLICK ELEMENTS
  =============================== */

  clickElements.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      showTooltip('CLICK', e.clientX, e.clientY);
    });

    el.addEventListener('mousemove', (e) => {
      moveTooltip(e.clientX, e.clientY);
    });

    el.addEventListener('mouseleave', hideTooltip);
  });

  /* ===============================
     SCROLL ELEMENTS
  =============================== */

  scrollElements.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      showTooltip('SCROLL', e.clientX, e.clientY);
    });

    el.addEventListener('mousemove', (e) => {
      moveTooltip(e.clientX, e.clientY);
    });

    el.addEventListener('mouseleave', hideTooltip);
  });

});
