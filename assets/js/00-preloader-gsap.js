/* Animación GSAP del preloader (letras + línea) */

const preloader = document.getElementById('preloader');
const text = document.getElementById('loader-text');
const letters = text.querySelectorAll('#loader-text span:not(.space)');
const space = text.querySelector('.space');
const line = document.getElementById('loader-line');

/* APARICIÓN DE LETRAS (suave, como ya estaba) */
gsap.to(letters, {
  opacity: 1,
  y: 0,
  stagger: 0.12,
  duration: 0.8,
  ease: 'power1.out'
});

/* LINEA (loader clásico) */
gsap.fromTo(line,
  { scaleX: 0 },
  {
    scaleX: 1,
    duration: 4.2,
    ease: 'none'
  }
);

/* TIMELINE PRINCIPAL */
gsap.timeline({ delay: 0.5 })

  /* tiempo de carga */
  .to({}, { duration: 3.5 })

  /* cerrar espacio ENTRE PALABRAS */
  .to(space, {
    width: '2ch',
    duration: 0.8,
    ease: 'power2.inOut'
  })

  /* centrar todo el bloque */
  .to(text, {
    justifyContent: 'center',
    duration: 0.4,
    ease: "power1.out",
  }, '<')

  /* apagar la línea apenas antes */
   .to(line, {
  opacity: 0,
  duration: 0.3,
  ease: 'none',
  onComplete: () => {
    line.style.display = 'none';
  }
}, '-=0.2')

  /* bajar el bloque completo (movimiento único) */
  .to(text, {
    y: '40vh',
    duration: 0.5,
    ease: "power1.out",
    onComplete: () => {
        preloader.style.height = '0px';
        text.style.width = '500px';
        text.style.height = '40px';
        text.style.padding = '0 50vw';
        preloader.style.zIndex='100';
        text.style.cursor='pointer';
    }
  });
