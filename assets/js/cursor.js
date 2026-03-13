/* ══════════════════════════════════════ CUSTOM CURSOR */

(function () {

  const el = document.createElement('div');
  el.id = 'cursor';
  el.innerHTML = '<div class="cursor-dot"></div><span class="cursor-label"></span>';
  document.body.appendChild(el);

  const labelEl = el.querySelector('.cursor-label');
  let active = false;

  /* ── Move ── */
  document.addEventListener('mousemove', e => {
    if (!active) { el.style.opacity = '1'; active = true; }
    el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  document.addEventListener('mouseleave', () => { el.style.opacity = '0'; active = false; });
  document.addEventListener('mouseenter', () => { el.style.opacity = '1'; active = true; });

  /* ── Labels ── */
  const CLICK_SEL  = '.project-media--carousel, .split-carousel, .panel-content';
  const SCROLL_SEL = '.project-panel:not(.is-misc):not(.is-project)';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(CLICK_SEL)) {
      labelEl.textContent = 'CLICK';
      labelEl.classList.add('is-visible');
    } else if (e.target.closest(SCROLL_SEL)) {
      labelEl.textContent = 'SCROLL';
      labelEl.classList.add('is-visible');
    } else {
      labelEl.classList.remove('is-visible');
    }
  });

})();
