document.addEventListener('DOMContentLoaded', () => {
  // Variables para el menú responsive
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const mainContent = document.querySelector('.main-content');

  // Variables para debugging
  const isDebug = true;
  const log = (message) => isDebug && console.log(`[Main] ${message}`);

  // Función para abrir el sidebar
  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    sidebar.classList.remove('closed', 'closing');
    overlay?.classList.add('active');
    hamburger?.classList.add('active');
    mainContent?.classList.add('blur');
    document.body.style.overflow = 'hidden';
    
    sidebar.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
  }

  // Función para cerrar el sidebar
  function closeSidebarFunc() {
    if (!sidebar) return;
    sidebar.classList.add('closing');
    sidebar.classList.remove('open');
    overlay?.classList.remove('active');
    hamburger?.classList.remove('active');
    mainContent?.classList.remove('blur');
    document.body.style.overflow = '';
    
    sidebar.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    
    setTimeout(() => {
      sidebar.classList.add('closed');
      sidebar.classList.remove('closing');
    }, 300);
  }

  // Función toggle para el hamburger
  function toggleSidebar() {
    if (sidebar?.classList.contains('open')) {
      closeSidebarFunc();
    } else {
      openSidebar();
    }
  }

  // Event listeners para el menú
  hamburger?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  });

  overlay?.addEventListener('click', (e) => {
    e.preventDefault();
    closeSidebarFunc();
  });

  // Cerrar sidebar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
      closeSidebarFunc();
    }
  });

  // Manejar redimensionamiento de ventana
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const width = window.innerWidth;
      if (width > 1024) {
        sidebar?.classList.remove('open', 'closed', 'closing');
        overlay?.classList.remove('active');
        hamburger?.classList.remove('active');
        mainContent?.classList.remove('blur');
        document.body.style.overflow = '';
        sidebar?.setAttribute('aria-hidden', 'false');
        hamburger?.setAttribute('aria-expanded', 'false');
      } else if (width <= 1024 && !sidebar?.classList.contains('open')) {
        sidebar?.classList.add('closed');
        sidebar?.setAttribute('aria-hidden', 'true');
      }
    }, 100);
  });

  // Inicializar estado del sidebar
  function initializeSidebar() {
    if (window.innerWidth <= 1024) {
      closeSidebarFunc();
      sidebar?.classList.add('closed');
      sidebar?.setAttribute('aria-hidden', 'true');
      hamburger?.setAttribute('aria-expanded', 'false');
    } else {
      sidebar?.classList.remove('open', 'closed', 'closing');
      overlay?.classList.remove('active');
      hamburger?.classList.remove('active');
      mainContent?.classList.remove('blur');
      document.body.style.overflow = '';
      sidebar?.setAttribute('aria-hidden', 'false');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  }

  // Manejar navegación activa
  function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.toLowerCase().replace(/\\/g, '/').split('/').pop(); // Obtiene solo el último segmento de la ruta
    const isRoot = currentPath === '' || currentPath === 'index.html' || currentPath === 'dynamo';

    // Limpiar todas las clases activas
    navLinks.forEach(link => {
      link.classList.remove('active', 'no-transition');
    });
    
    // Normalizar rutas para comparación
    let activeLink = null;

    if (isRoot) {
      activeLink = document.querySelector('.nav-link[href="./index.html"]') || document.querySelector('.nav-link[href="../index.html"]');
    } else {
      const pageName = currentPath.replace('.html', ''); // Elimina .html si existe
      switch (pageName) {
        case 'sobre-nosotros':
          activeLink = document.querySelector('.nav-link[href="./pages/sobre-nosotros.html"]') || document.querySelector('.nav-link[href="../pages/sobre-nosotros.html"]');
          break;
        case 'equipos':
          activeLink = document.querySelector('.nav-link[href="./pages/equipos.html"]') || document.querySelector('.nav-link[href="../pages/equipos.html"]');
          break;
        case 'noticias_general':
          activeLink = document.querySelector('.nav-link[href="./pages/noticias_general.html"]') || document.querySelector('.nav-link[href="../pages/noticias_general.html"]');
          break;
        case 'tienda':
          activeLink = document.querySelector('.nav-link[href="./pages/tienda.html"]') || document.querySelector('.nav-link[href="../pages/tienda.html"]');
          break;
        case 'contacto':
          activeLink = document.querySelector('.nav-link[href="./pages/contacto.html"]') || document.querySelector('.nav-link[href="../pages/contacto.html"]');
          break;
      }
    }

    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.classList.add('no-transition');
      setTimeout(() => activeLink.classList.remove('no-transition'), 50);
    } else {
      log(`No se encontró enlace activo para la ruta: ${currentPath}`);
    }
  }

  // Cerrar sidebar al hacer clic en un enlace en móvil
  function setupNavLinkHandlers() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href?.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        
        if (window.innerWidth <= 1024 && sidebar?.classList.contains('open')) {
          setTimeout(() => closeSidebarFunc(), 150);
        }
        
        setTimeout(setActiveNavLink, 100); // Forzar actualización después de clic
      });
    });
  }

  // Escuchar eventos de navegación
  window.addEventListener('popstate', () => {
    setActiveNavLink();
  });

  window.addEventListener('load', () => {
    setActiveNavLink();
  });

  window.addEventListener('hashchange', () => {
    setActiveNavLink();
  });

  // Inicializar navbar
  try {
    initializeSidebar();
    setActiveNavLink();
    setupNavLinkHandlers();
  } catch (error) {
    console.error('Error al inicializar navbar:', error);
  }
});
