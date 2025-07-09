document.addEventListener('DOMContentLoaded', () => {
  const isDebug = false;
  const log = (message) => isDebug && console.log(`[Jugadores Destacados] ${message}`);

  function loadJugadores() {
    const jugadoresGrid = document.getElementById('jugadores-grid');
    if (!jugadoresGrid) return;

    try {
      if (typeof jugadoresData === 'undefined') {
        throw new Error('jugadoresData no está definido. Asegúrate de incluir jugadores.js');
      }

      if (!Array.isArray(jugadoresData)) {
        throw new Error('jugadoresData debe ser un array');
      }

      window.jugadoresOriginal = jugadoresData;
      renderJugadores(jugadoresData);
      initializeFilters();
      initializeModal();
      log('Jugadores cargados correctamente');
    } catch (error) {
      console.error('Error al cargar jugadores:', error);
      jugadoresGrid.innerHTML = '<p>Error al cargar los jugadores. Intenta de nuevo más tarde.</p>';
    }
  }

  function renderJugadores(jugadores) {
    const jugadoresGrid = document.getElementById('jugadores-grid');
    jugadoresGrid.innerHTML = '';
    
    if (jugadores.length === 0) {
      jugadoresGrid.innerHTML = '<p>No se encontraron jugadores.</p>';
      return;
    }

    jugadoresGrid.style.display = 'grid';
    jugadoresGrid.style.gridTemplateColumns = jugadores.length === 1 
      ? 'minmax(250px, 300px)' 
      : 'repeat(auto-fit, minmax(250px, 1fr))';

    jugadores.forEach(jugador => {
      const jugadorCard = document.createElement('div');
      jugadorCard.className = 'jugador-card';
      jugadorCard.dataset.id = jugador.id;
      jugadorCard.innerHTML = `
        <img src="${jugador.image}" alt="${jugador.name}" loading="lazy">
        <h3>${jugador.name}</h3>
        <p>${jugador.position}</p>
      `;
      jugadoresGrid.appendChild(jugadorCard);
    });
  }

  function initializeFilters() {
    const filtroPosicion = document.getElementById('filtro-posicion');
    filtroPosicion.addEventListener('change', () => {
      const posicion = filtroPosicion.value;
      let jugadoresFiltrados = window.jugadoresOriginal;
      if (posicion) {
        jugadoresFiltrados = jugadoresFiltrados.filter(jugador => jugador.position === posicion);
      }
      renderJugadores(jugadoresFiltrados);
      log(`Filtro aplicado: ${posicion || 'Todos'}`);
    });
  }

  function initializeModal() {
    const modal = document.getElementById('modal-jugador');
    const cerrarModal = document.getElementById('modal-cerrar');
    const jugadoresGrid = document.getElementById('jugadores-grid');
    
    let scrollPosition = 0;

    function disableBodyScroll() {
      scrollPosition = window.pageYOffset;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    }

    function enableBodyScroll() {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      window.scrollTo(0, scrollPosition);
    }

    function openModal(jugador) {
      const modalContent = `
        <div class="modal-content">
          <span class="cerrar" id="modal-cerrar">×</span>
          <div class="modal-image-container">
            <img id="modal-imagen" src="${jugador.image}" alt="${jugador.name}">
          </div>
          <div class="modal-info">
            <h3 id="modal-nombre">${jugador.name}</h3>
            <p id="modal-posicion">${jugador.position}</p>
            <p id="modal-club">${jugador.club || 'N/A'}</p>
            <p id="modal-descripcion">${jugador.description}</p>
          </div>
        </div>
      `;
      
      modal.innerHTML = modalContent;
      modal.style.display = 'block';
      disableBodyScroll();
      
      modal.setAttribute('tabindex', '-1');
      modal.focus();
      
      const newCerrarModal = document.getElementById('modal-cerrar');
      newCerrarModal.addEventListener('click', closeModal);
      
      const modalInfo = modal.querySelector('.modal-info');
      if (modalInfo) {
        modalInfo.scrollTop = 0;
      }
      
      log(`Modal abierto para ${jugador.name}`);
    }

    function closeModal() {
      modal.style.display = 'none';
      enableBodyScroll();
      log('Modal cerrado');
    }

    jugadoresGrid.addEventListener('click', (event) => {
      const card = event.target.closest('.jugador-card');
      if (!card) return;

      const id = card.dataset.id;
      
      try {
        const jugador = jugadoresData.find(j => j.id === id);
        if (jugador) {
          openModal(jugador);
        } else {
          throw new Error('Jugador no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar datos del jugador:', error);
        alert('Error al cargar la información del jugador. Por favor, intenta de nuevo.');
      }
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
        log('Modal cerrado al hacer clic fuera');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
        log('Modal cerrado con tecla Escape');
      }
    });

    modal.addEventListener('wheel', (event) => {
      const modalInfo = modal.querySelector('.modal-info');
      if (!modalInfo) return;

      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;
      const isAtTop = modalInfo.scrollTop === 0;
      const isAtBottom = modalInfo.scrollTop + modalInfo.clientHeight >= modalInfo.scrollHeight;

      if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
        event.preventDefault();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (modal.style.display === 'block') {
          const modalInfo = modal.querySelector('.modal-info');
          if (modalInfo && modalInfo.scrollTop > 0) {
            if (modalInfo.scrollHeight <= modalInfo.clientHeight) {
              modalInfo.scrollTop = 0;
            }
          }
        }
      }, 250);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (modal.style.display === 'block') {
          const modalInfo = modal.querySelector('.modal-info');
          if (modalInfo) {
            modalInfo.scrollTop = 0;
          }
        }
      }, 100);
    });
  }

  function initializeTouchSupport() {
    if ('ontouchstart' in window) {
      const jugadoresGrid = document.getElementById('jugadores-grid');
      
      jugadoresGrid.addEventListener('touchstart', (event) => {
        const card = event.target.closest('.jugador-card');
        if (card) {
          card.style.transform = 'scale(0.98)';
        }
      });

      jugadoresGrid.addEventListener('touchend', (event) => {
        const card = event.target.closest('.jugador-card');
        if (card) {
          setTimeout(() => {
            card.style.transform = '';
          }, 150);
        }
      });
    }
  }

  try {
    loadJugadores();
    initializeTouchSupport();
    log('Funcionalidades de la página Jugadores Destacados inicializadas');
  } catch (error) {
    console.error('Error al inicializar funcionalidades:', error);
  }
});