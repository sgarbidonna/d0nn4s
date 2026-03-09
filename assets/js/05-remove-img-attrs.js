/* Elimina atributos title y alt de imágenes */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    img.removeAttribute('title');
    img.removeAttribute('alt');
  });
});
