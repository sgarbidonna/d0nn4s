/* Z-index hover en imágenes de proyecto */

document.addEventListener('DOMContentLoaded', () => {

  const elements = document.querySelectorAll('.main-img-by-project');
  if (!elements.length) return;

  const BASE_Z = 1;
  const HOVER_Z = 10;

  elements.forEach(el => {
    el.style.zIndex = BASE_Z;

    el.addEventListener('mouseenter', () => {
      el.style.zIndex = HOVER_Z;
    });

    el.addEventListener('mouseleave', () => {
      el.style.zIndex = BASE_Z;
    });
  });

});
