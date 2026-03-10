/* ══════════════════════════════════════ IMAGE PRELOADER
   Fuerza el fetch de todas las imágenes flotantes al inicio,
   independientemente de su estado de visibilidad o scale.
   Cuando el toggle las activa, ya están en caché → aparición instantánea.
*/

(function () {
  const imgs = document.querySelectorAll('.float-img img');
  if (!imgs.length) return;

  imgs.forEach(img => {
    const pre = new Image();
    pre.src = img.src;
  });
})();