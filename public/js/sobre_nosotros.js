document.addEventListener('DOMContentLoaded', () => {
  const isDebug = false;
  const log = (message) => isDebug && console.log(`[Sobre Nosotros] ${message}`);

  function loadEquipo() {
    const equipoGrid = document.getElementById('equipo-grid');
    if (!equipoGrid) return;

    try {
      // Usar los datos del archivo equipo.js en lugar de fetch
      if (typeof equipoData === 'undefined') {
        throw new Error('equipoData no está definido. Asegúrate de incluir equipo.js');
      }

      if (!Array.isArray(equipoData)) {
        throw new Error('equipoData debe ser un array');
      }

      window.equipoOriginal = equipoData;
      renderEquipo(equipoData);
      initializeFilters();
      initializeModal();
      log('Equipo cargado correctamente');
    } catch (error) {
      console.error('Error al cargar equipo:', error);
      equipoGrid.innerHTML = '<p>Error al cargar el equipo. Intenta de nuevo más tarde.</p>';
    }
  }

  function renderEquipo(equipo) {
    const equipoGrid = document.getElementById('equipo-grid');
    equipoGrid.innerHTML = '';
    
    if (equipo.length === 0) {
      equipoGrid.innerHTML = '<p>No se encontraron miembros.</p>';
      return;
    }

    equipoGrid.style.display = 'grid';
    equipoGrid.style.gridTemplateColumns = equipo.length === 1 
      ? 'minmax(250px, 300px)' 
      : 'repeat(auto-fit, minmax(250px, 1fr))';

    equipo.forEach(miembro => {
      const miembroCard = document.createElement('div');
      miembroCard.className = 'miembro-card';
      miembroCard.dataset.id = miembro.id;
      miembroCard.innerHTML = `
        <img src="${miembro.image}" alt="${miembro.name}" loading="lazy">
        <h3>${miembro.name}</h3>
        <p>${miembro.role}</p>
      `;
      equipoGrid.appendChild(miembroCard);
    });
  }

  function initializeFilters() {
    const filtroRol = document.getElementById('filtro-rol');
    filtroRol.addEventListener('change', () => {
      const rol = filtroRol.value;
      let equipoFiltrado = window.equipoOriginal;
      if (rol) {
        equipoFiltrado = equipoFiltrado.filter(miembro => miembro.role === rol);
      }
      renderEquipo(equipoFiltrado);
      log(`Filtro aplicado: ${rol || 'Todos'}`);
    });
  }

  function initializeModal() {
    const modal = document.getElementById('modal-miembro');
    const cerrarModal = document.getElementById('modal-cerrar');
    const equipoGrid = document.getElementById('equipo-grid');
    
    // Variables para control de scroll
    let scrollPosition = 0;

    // Función para desactivar scroll del body
    function disableBodyScroll() {
      scrollPosition = window.pageYOffset;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    }

    // Función para reactivar scroll del body
    function enableBodyScroll() {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      window.scrollTo(0, scrollPosition);
    }

    // Función para abrir modal
    function openModal(miembro) {
      // Estructura HTML actualizada del modal
      const modalContent = `
        <div class="modal-content">
          <span class="cerrar" id="modal-cerrar">&times;</span>
          <div class="modal-image-container">
            <img id="modal-imagen" src="${miembro.image}" alt="${miembro.name}">
          </div>
          <div class="modal-info">
            <h3 id="modal-nombre">${miembro.name}</h3>
            <p id="modal-rol">${miembro.role}</p>
            <p id="modal-descripcion">${miembro.description}</p>
          </div>
        </div>
      `;
      
      modal.innerHTML = modalContent;
      modal.style.display = 'block';
      disableBodyScroll();
      
      // Enfocar el modal para accesibilidad
      modal.setAttribute('tabindex', '-1');
      modal.focus();
      
      // Reinicializar el botón cerrar
      const newCerrarModal = document.getElementById('modal-cerrar');
      newCerrarModal.addEventListener('click', closeModal);
      
      // Scroll al inicio del contenido del modal
      const modalInfo = modal.querySelector('.modal-info');
      if (modalInfo) {
        modalInfo.scrollTop = 0;
      }
      
      log(`Modal abierto para ${miembro.name}`);
    }

    // Función para cerrar modal
    function closeModal() {
      modal.style.display = 'none';
      enableBodyScroll();
      log('Modal cerrado');
    }

    // Event listener para cards de miembros
    equipoGrid.addEventListener('click', (event) => {
      const card = event.target.closest('.miembro-card');
      if (!card) return;

      const id = card.dataset.id;
      
      try {
        // Usar equipoData directamente en lugar de fetch
        const miembro = equipoData.find(m => m.id === id);
        if (miembro) {
          openModal(miembro);
        } else {
          throw new Error('Miembro no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar datos del miembro:', error);
        alert('Error al cargar la información del miembro. Por favor, intenta de nuevo.');
      }
    });

    // Event listener para cerrar modal al hacer clic fuera
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
        log('Modal cerrado al hacer clic fuera');
      }
    });

    // Event listener para cerrar modal con tecla Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
        log('Modal cerrado con tecla Escape');
      }
    });

    // Prevenir scroll del modal cuando se hace scroll dentro del contenido
    modal.addEventListener('wheel', (event) => {
      const modalInfo = modal.querySelector('.modal-info');
      if (!modalInfo) return;

      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;
      const isAtTop = modalInfo.scrollTop === 0;
      const isAtBottom = modalInfo.scrollTop + modalInfo.clientHeight >= modalInfo.scrollHeight;

      // Prevenir scroll del modal si estamos en los límites
      if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
        event.preventDefault();
      }
    });

    // Manejo de redimensionamiento de ventana
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (modal.style.display === 'block') {
          // Reajustar el scroll del contenido del modal si es necesario
          const modalInfo = modal.querySelector('.modal-info');
          if (modalInfo && modalInfo.scrollTop > 0) {
            // Verificar si el contenido todavía necesita scroll
            if (modalInfo.scrollHeight <= modalInfo.clientHeight) {
              modalInfo.scrollTop = 0;
            }
          }
        }
      }, 250);
    });

    // Manejo de orientación en móviles
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

  function initializeMapLinks() {
    const mapLinks = document.querySelectorAll('.open-map-link, .map-link');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    mapLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const mapUrl = link.getAttribute('data-map-url') || link.getAttribute('href');
        const geoUrl = link.getAttribute('href');

        if (isMobile && geoUrl.startsWith('geo:')) {
          window.location.href = geoUrl;
          setTimeout(() => {
            window.location.href = mapUrl;
          }, 1000);
        } else {
          window.open(mapUrl, '_blank');
        }
      });
    });
    log('Enlaces de mapas inicializados');
  }

  // Función para mejorar la experiencia táctil en dispositivos móviles
  function initializeTouchSupport() {
    if ('ontouchstart' in window) {
      const equipoGrid = document.getElementById('equipo-grid');
      
      equipoGrid.addEventListener('touchstart', (event) => {
        const card = event.target.closest('.miembro-card');
        if (card) {
          card.style.transform = 'scale(0.98)';
        }
      });

      equipoGrid.addEventListener('touchend', (event) => {
        const card = event.target.closest('.miembro-card');
        if (card) {
          setTimeout(() => {
            card.style.transform = '';
          }, 150);
        }
      });
    }
  }

  try {
    loadEquipo();
    initializeMapLinks();
    initializeTouchSupport();
    log('Funcionalidades de la página Sobre Nosotros inicializadas');
  } catch (error) {
    console.error('Error al inicializar funcionalidades:', error);
  }
});