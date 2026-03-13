/* ══════════════════════════════════════ IMAGE PRELOADER — ESTRATEGIA EN CAPAS
   Capa 1 (inmediata):  carátulas float-img → aparición instantánea al toggle
   Capa 2 (diferida 1s): primeras 3 imágenes de cada panel misc → primera imagen
                         del carousel lista cuando el usuario abre el panel
   Capa 3 (on demand):  el resto se carga con lazy load al abrir el panel
*/

(function () {

  /* ── Capa 1: carátulas ── */
  const floatImgs = document.querySelectorAll('.float-img img');
  floatImgs.forEach(img => {
    if (!img.src) return;
    const pre = new Image();
    pre.src = img.src;
  });

  /* ── Capa 2: primeras 3 de cada panel misc ── */
  setTimeout(() => {
    const miscPanels = document.querySelectorAll('.project-panel.is-misc');
    miscPanels.forEach(panel => {
      const imgs = [...panel.querySelectorAll('img[data-src]')].slice(0, 3);
      imgs.forEach(img => {
        const pre = new Image();
        pre.src = img.dataset.src;
      });
    });
  }, 1000);

})();