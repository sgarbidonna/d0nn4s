/* Factory de paneles animados GSAP v1 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap) return;
  let activeCloseFn = null;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeCloseFn) {
      activeCloseFn();
    }
  });

  /**
   * Factory de panel animado
   */
  function createPanel({
    openBtnId,
    closeBtnId,
    panelId,
    bgId
  }) {
    const openBtn  = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);
    const panel    = document.getElementById(panelId);
    const bg       = document.getElementById(bgId);

    if (!openBtn || !closeBtn || !panel || !bg) return;

    let isOpen = false;

    // Estado inicial
    gsap.set(bg, {
      y: '100%',
      pointerEvents: 'none'
    });

    gsap.set(panel, {
      y: '120%',
      pointerEvents: 'none'
    });

    function open() {
      if (isOpen) return;
      isOpen = true;

      // registrar este panel como activo
      activeCloseFn = close;

      gsap.timeline()
        .to(panel, {
          y: '-5%',
          duration: 0.05,
          ease: 'power4.out',
          pointerEvents: 'auto'
        })
        .to(panel, {
          y: '0%',
          duration: 0.4,
          ease: 'power2.out'
        });
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;

      // limpiar activo si es este
      if (activeCloseFn === close) {
        activeCloseFn = null;
      }

      gsap.to(panel, {
        y: '120%',
        duration: 0.55,
        ease: 'power3.in',
        pointerEvents: 'none'
      });
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
  }

const PANELS = [
  {
    openBtnId:  'ai-gloria-call',
    closeBtnId: 'close-ai-gloria',
    panelId:    'ai-gloria-panel',
    bgId:       'ai-gloria-bg'
  },
  {
    openBtnId:  'ai-bynvideo-call',
    closeBtnId: 'close-ai-bynvideo',
    panelId:    'ai-bynvideo-panel',
    bgId:       'ai-bynvideo-bg'
  },
  {
    openBtnId:  'ai-lacura-call',
    closeBtnId: 'close-ai-lacura',
    panelId:    'ai-lacura-panel',
    bgId:       'ai-lacura-bg'
  },
  {
    openBtnId:  'ai-film1-call',
    closeBtnId: 'close-ai-film1',
    panelId:    'ai-film1-panel',
    bgId:       'ai-film1-bg'
  },
  {
    openBtnId:  'ai-film2-call',
    closeBtnId: 'close-ai-film2',
    panelId:    'ai-film2-panel',
    bgId:       'ai-film2-bg'
  },
  {
    openBtnId:  'ai-paralapsus-call',
    closeBtnId: 'close-ai-paralapsus',
    panelId:    'ai-paralapsus-panel',
    bgId:       'ai-paralapsus-bg'
  },
  {
    openBtnId:  'ai-sexcell-call',
    closeBtnId: 'close-ai-sexcell',
    panelId:    'ai-sexcell-panel',
    bgId:       'ai-sexcell-bg'
  },
  {
    openBtnId:  'd3-isla-call',
    closeBtnId: 'close-d3-isla',
    panelId:    'd3-isla-panel',
    bgId:       'd3-isla-bg'
  }
];


  PANELS.forEach(createPanel);
});
