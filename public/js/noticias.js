document.addEventListener('DOMContentLoaded', () => {
  // Variables para debugging
  const isDebug = false;
  const log = (message) => isDebug && console.log(`[Noticias] ${message}`);

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

  // Función para ajustar la ruta de la imagen según el contexto
  function adjustImagePath(imagePath) {
    const isInPages = window.location.pathname.includes('/pages/');
    return isInPages ? `../${imagePath}` : imagePath;
  }

  // Función para actualizar metaetiquetas dinámicamente
  function updateMetaTags(noticia) {
    document.title = `${noticia.title} - Club Deportivo Dynamo`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', noticia.description);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', `Club Deportivo Dynamo, ${noticia.title}, fútbol Córdoba, noticias`);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${noticia.title} - Club Deportivo Dynamo`);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', noticia.description);
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', adjustImagePath(noticia.image));
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', `${noticia.title} - Club Deportivo Dynamo`);
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', noticia.description);
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', adjustImagePath(noticia.image));
  }

  // Cargar noticia específica
  function loadNoticiaDetalle() {
    const noticiaTitle = document.getElementById('noticia-title');
    if (!noticiaTitle) return;

    try {
      if (typeof noticiasData === 'undefined') {
        throw new Error('noticiasData no está definido. Asegúrate de incluir noticias.js');
      }

      if (!Array.isArray(noticiasData)) {
        throw new Error('Formato de noticias inválido');
      }

      const urlParams = new URLSearchParams(window.location.search);
      const noticiaUrl = decodeURIComponent(urlParams.get('url'));

      const noticia = noticiasData.find(n => n.url === noticiaUrl);
      if (noticia) {
        const adjustedImage = adjustImagePath(noticia.image);
        updateMetaTags(noticia);
        document.getElementById('noticia-title').textContent = noticia.title;
        document.getElementById('noticia-image').src = adjustedImage;
        document.getElementById('noticia-image').alt = noticia.title;
        document.getElementById('noticia-date').textContent = formatDateToSpanish(noticia.date);
        document.getElementById('noticia-content').innerHTML = noticia.content;
        log(`Noticia cargada: ${noticia.title}`);
        loadRelatedNoticias(noticiasData, noticiaUrl);
      } else {
        document.querySelector('.noticia-detalle').innerHTML = '<p>Noticia no encontrada</p>';
      }
    } catch (error) {
      console.error('Error al cargar noticia:', error);
      document.querySelector('.noticia-detalle').innerHTML = '<p>Error al cargar la noticia.</p>';
    }
  }

  // Cargar noticias relacionadas (3 aleatorias, excluyendo la actual)
  function loadRelatedNoticias(noticias, currentNoticiaUrl) {
    const relatedNoticiasGrid = document.getElementById('related-noticias-grid');
    if (!relatedNoticiasGrid) return;

    const otherNoticias = noticias.filter(n => n.url !== currentNoticiaUrl);
    
    if (otherNoticias.length === 0) {
      relatedNoticiasGrid.innerHTML = '<p>No hay otras noticias disponibles.</p>';
      return;
    }

    const shuffled = otherNoticias.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(3, otherNoticias.length));

    selected.forEach(noticia => {
      const adjustedImage = adjustImagePath(noticia.image);
      const noticiaCard = document.createElement('div');
      noticiaCard.className = 'noticia-card';
      noticiaCard.innerHTML = `
        <img src="${adjustedImage}" alt="${noticia.title}" loading="lazy">
        <h3>${noticia.title}</h3>
        <p>${noticia.description}</p>
        <p><small>${formatDateToSpanish(noticia.date)}</small></p>
        <a href="noticia.html?url=${encodeURIComponent(noticia.url)}" class="btn">Leer más</a>
      `;
      relatedNoticiasGrid.appendChild(noticiaCard);
    });
    log('Noticias relacionadas cargadas correctamente');
  }

  // Inicializar funcionalidades de la página de noticias
  try {
    loadNoticiaDetalle();
    log('Funcionalidades de la página de noticias inicializadas correctamente');
  } catch (error) {
    console.error('Error al inicializar funcionalidades de la página de noticias:', error);
  }
});