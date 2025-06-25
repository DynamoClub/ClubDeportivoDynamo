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

  // Manejo de navegación activa
  function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.toLowerCase().replace(/\\/g, '/').split('?')[0];
    
    // Limpiar todas las clases activas
    navLinks.forEach(link => {
      link.classList.remove('active', 'no-transition');
    });
    
    // Normalizar rutas para comparación
    const isRoot = currentPath.endsWith('/dynamo/index.html') || currentPath.endsWith('/dynamo/');
    const isNoticiasGeneral = currentPath.endsWith('/pages/noticias_general.html');
    const isNoticia = currentPath.endsWith('/pages/noticia.html');
    const isSobreNosotros = currentPath.endsWith('/pages/sobre-nosotros.html');
    const isEquipos = currentPath.endsWith('/pages/equipos.html');
    const isContacto = currentPath.endsWith('/pages/contacto.html');
    const isTienda = currentPath.endsWith('/pages/tienda.html');

    let activeLink = null;

    if (isRoot) {
      activeLink = document.querySelector('.nav-link[href="./index.html"]') || document.querySelector('.nav-link[href="../index.html"]');
    } else if (isNoticiasGeneral || isNoticia) {
      activeLink = document.querySelector('.nav-link[href="./pages/noticias_general.html"]') || document.querySelector('.nav-link[href="../pages/noticias_general.html"]');
      activeLink?.classList.add('no-transition');
      setTimeout(() => activeLink?.classList.remove('no-transition'), 50);
    } else if (isSobreNosotros) {
      activeLink = document.querySelector('.nav-link[href="./pages/sobre-nosotros.html"]') || document.querySelector('.nav-link[href="../pages/sobre-nosotros.html"]');
    } else if (isEquipos) {
      activeLink = document.querySelector('.nav-link[href="./pages/equipos.html"]') || document.querySelector('.nav-link[href="../pages/equipos.html"]');
    } else if (isContacto) {
      activeLink = document.querySelector('.nav-link[href="./pages/contacto.html"]') || document.querySelector('.nav-link[href="../pages/contacto.html"]');
    } else if (isTienda) {
      activeLink = document.querySelector('.nav-link[href="./pages/tienda.html"]') || document.querySelector('.nav-link[href="../pages/tienda.html"]');
    }

    if (activeLink) {
      activeLink.classList.add('active');
    } else {
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