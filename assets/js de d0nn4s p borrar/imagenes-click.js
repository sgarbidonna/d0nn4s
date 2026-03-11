
document.addEventListener('DOMContentLoaded', () => {

  initImagePanel('ai-gloria-panel');
  initImagePanel('ai-bynvideo-panel');
  initImagePanel('ai-lacura-panel');
  initImagePanel('ai-paralapsus-panel');
  initImagePanel('ai-sexcell-panel');
  initImagePanel('d3-isla-panel');

  function initImagePanel(panelId) {

    const panel = document.getElementById(panelId);
    if (!panel) return;

    const imageGroups = [...panel.querySelectorAll('.imagenes')];
    if (!imageGroups.length) return;

    imageGroups.forEach(group => {

      // ⬅️ INVERTIMOS EL ORDEN: el último del DOM será el primero visible
      const items = [...group.querySelectorAll('.imagenes-item')].reverse();
      if (!items.length) return;

      let currentIndex = 0;

      function showImage(index) {
        items.forEach((item, i) => {
          item.classList.toggle('is-active', i === index);
        });
      }

      function next() {
        currentIndex = (currentIndex + 1) % items.length;
        showImage(currentIndex);
      }

      function prev() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showImage(currentIndex);
      }

      // Mostrar la imagen inicial (última del DOM)
      showImage(currentIndex);

      // Click izquierdo / derecho
      group.addEventListener('click', (e) => {
        if (e.target.closest('.close-panel')) return;

        const rect = group.getBoundingClientRect();
        const half = rect.left + rect.width / 2;

        e.clientX > half ? next() : prev();
      });

      // Flechas del teclado
      document.addEventListener('keydown', (e) => {
        if (!panel.classList.contains('active')) return;

        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft')  prev();
      });

    });

    // Evitar propagación al cerrar
    panel.querySelectorAll('.close-panel').forEach(btn => {
      btn.addEventListener('click', e => e.stopPropagation());
    });
  }

});