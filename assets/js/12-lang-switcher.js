/* Switcher de idioma en la bio (ES/EN) */

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.lang-option');
  const bios = document.querySelectorAll('.bio-lang');

  if (!buttons.length || !bios.length) return;

  let currentLang = 'es';

  function switchLanguage(lang) {
    if (lang === currentLang) return;

    const currentBio = document.querySelector(`.bio-lang[data-lang="${currentLang}"]`);
    const nextBio = document.querySelector(`.bio-lang[data-lang="${lang}"]`);

    if (!currentBio || !nextBio) return;

    // fade out actual
    currentBio.classList.remove('active');

    // fade in nuevo (ligero delay para dissolve real)
    setTimeout(() => {
      nextBio.classList.add('active');
    }, 80);

    // estado botones
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    currentLang = lang;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });
});
