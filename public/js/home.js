document.addEventListener('DOMContentLoaded', () => {
  // Variables para debugging
  const isDebug = false;
  const log = (message) => isDebug && console.log(`[Home] ${message}`);

  // Función para formatear fechas en español
  function formatDateToSpanish(dateString) {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  }

  // Función para autoscroll al inicio de la página
  function scrollToTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    log('Página desplazada al inicio');
  }

  // Función para forzar scroll al inicio después de cargar todo
  function forceScrollToTop() {
    scrollToTop();
    setTimeout(() => scrollToTop(), 50);
    setTimeout(() => scrollToTop(), 200);
  }

  // Función para ajustar la ruta de la imagen según el contexto
  function adjustImagePath(imagePath) {
    const isInPages = window.location.pathname.includes('/pages/');
    return isInPages ? `../${imagePath}` : imagePath;
  }

  // Cargar noticias en la página principal (ordenadas por fecha más reciente)
  function loadNoticias() {
    const noticiasGrid = document.getElementById('noticias-grid');
    if (!noticiasGrid) return;

    try {
      if (typeof noticiasData === 'undefined') {
        throw new Error('noticiasData no está definido. Asegúrate de incluir noticias.js');
      }

      if (!Array.isArray(noticiasData)) {
        throw new Error('noticiasData debe ser un array');
      }
      
      const noticiasOrdenadas = noticiasData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      noticiasOrdenadas.slice(0, 3).forEach(noticia => {
        const adjustedImage = adjustImagePath(noticia.image);
        const noticiaCard = document.createElement('div');
        noticiaCard.className = 'noticia-card';
        noticiaCard.innerHTML = `
          <img src="${adjustedImage}" alt="${noticia.title}" loading="lazy">
          <h3>${noticia.title}</h3>
          <p>${noticia.description}</p>
          <p><small>${formatDateToSpanish(noticia.date)}</small></p>
          <a href="pages/noticia.html?url=${encodeURIComponent(noticia.url)}" class="btn">Leer más</a>
        `;
        noticiasGrid.appendChild(noticiaCard);
      });
      log('Noticias cargadas y ordenadas correctamente');
    } catch (error) {
      console.error('Error al cargar noticias:', error);
      noticiasGrid.innerHTML = '<p>Error al cargar las noticias. Intenta de nuevo más tarde.</p>';
    }
  }

  // Carrusel mejorado con sombras dinámicas
  function initializeCarousel() {
    const carruselContainer = document.querySelector('.carrusel-container');
    const track = document.querySelector('.carrusel-track');
    
    if (!carruselContainer || !track) return;

    carruselContainer.scrollLeft = 0;

    function updateShadows() {
      const scrollLeft = carruselContainer.scrollLeft;
      const scrollWidth = carruselContainer.scrollWidth;
      const clientWidth = carruselContainer.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      carruselContainer.classList.remove('scroll-start', 'scroll-middle', 'scroll-end', 'no-scroll');

      if (maxScroll <= 5) {
        carruselContainer.classList.add('no-scroll');
        return;
      }

      if (scrollLeft <= 5) {
        carruselContainer.classList.add('scroll-start');
      } else if (scrollLeft >= maxScroll - 5) {
        carruselContainer.classList.add('scroll-end');
      } else {
        carruselContainer.classList.add('scroll-middle');
      }
    }

    carruselContainer.addEventListener('scroll', updateShadows, { passive: true });
    window.addEventListener('resize', () => setTimeout(updateShadows, 100));

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    carruselContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startScrollLeft = carruselContainer.scrollLeft;
      isDragging = true;
    }, { passive: true });

    carruselContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      carruselContainer.scrollLeft = startScrollLeft + diff;
    }, { passive: true });

    carruselContainer.addEventListener('touchend', () => {
      isDragging = false;
      updateShadows();
    }, { passive: true });

    carruselContainer.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startScrollLeft = carruselContainer.scrollLeft;
      isDragging = true;
      carruselContainer.style.cursor = 'grabbing';
      carruselContainer.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const currentX = e.clientX;
      const diff = startX - currentX;
      carruselContainer.scrollLeft = startScrollLeft + diff;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        carruselContainer.style.cursor = 'grab';
        carruselContainer.style.userSelect = '';
        updateShadows();
      }
    });

    carruselContainer.style.cursor = 'grab';
    setTimeout(updateShadows, 100);
    log('Carrusel con sombras dinámicas inicializado');
  }

  // Lazy loading para imágenes
  function initializeLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
    log(`Lazy loading configurado para ${images.length} imágenes`);
  }

  // Smooth scroll para enlaces internos
  function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Efecto parallax
  function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length === 0) return;

    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      
      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
      
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    
    log(`Parallax configurado para ${parallaxElements.length} elementos`);
  }

  // Función para cargar la galería por grupos de 3
  function initializeGallery() {
    const galleryGrid = document.getElementById('galeria-grid');
    const galleryBtn = document.getElementById('galeria-btn');
    let visibleCount = 3;

    if (!galleryGrid || !galleryBtn) return;

    const images = galleryGrid.querySelectorAll('img');
    images.forEach((img, index) => {
      if (index >= visibleCount) {
        img.style.display = 'none';
      } else {
        img.style.display = '';
      }
    });

    galleryBtn.addEventListener('click', () => {
      visibleCount += 3;
      images.forEach((img, index) => {
        if (index < visibleCount && index < images.length) {
          img.style.display = '';
          img.style.opacity = '0';
          setTimeout(() => {
            img.style.transition = 'opacity 0.5s ease';
            img.style.opacity = '1';
          }, 10);
        }
      });

      if (visibleCount >= images.length) {
        galleryBtn.style.display = 'none';
      }
    });
  }

  // Inicializar funcionalidades de la página
  try {
    forceScrollToTop();
    loadNoticias();
    initializeCarousel();
    initializeLazyLoading();
    initializeSmoothScroll();
    initializeParallax();
    initializeGallery();
    log('Todas las funcionalidades de página inicializadas correctamente');
  } catch (error) {
    console.error('Error al inicializar funcionalidades de página:', error);
  }
});

// Scroll adicional cuando la ventana termina de cargar completamente
window.addEventListener('load', () => {
  setTimeout(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, 100);
});

// Interceptar cualquier intento de scroll durante la carga
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('scrollToTop', 'true');
});

// Verificar si necesitamos hacer scroll al cargar
if (sessionStorage.getItem('scrollToTop') === 'true') {
  sessionStorage.removeItem('scrollToTop');
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
}