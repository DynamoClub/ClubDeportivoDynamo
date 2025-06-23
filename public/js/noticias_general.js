document.addEventListener('DOMContentLoaded', () => {
    // Variables para debugging
    const isDebug = true;
    const log = (message) => isDebug && console.log(`[Noticias General] ${message}`);

    // Variables para paginación
    const itemsPorPagina = 5;
    let paginaActual = 1;
    let noticiasOriginales = [];

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

    // Función para obtener el icono según la categoría
    function getCategoryIcon(category) {
        const categoryLower = category.toLowerCase();
        
        switch(categoryLower) {
            case 'partido':
                return '⚽';
            case 'entrenamiento':
                return '🏃‍♂️';
            case 'torneo':
                return '🏆';
            case 'evento':
                return '🎉';
            case 'general':
                return '📰';
            default:
                return '📰';
        }
    }

    // Función para obtener la clase CSS según la categoría
    function getCategoryClass(category) {
        return category.toLowerCase();
    }

    // Obtener noticias filtradas
    function getFilteredNoticias(titulo, categoria) {
        let noticiasFiltradas = noticiasOriginales;

        // Filtrar por título
        if (titulo) {
            noticiasFiltradas = noticiasFiltradas.filter(noticia =>
                noticia.title.toLowerCase().includes(titulo.toLowerCase())
            );
        }

        // Filtrar por categoría
        if (categoria) {
            noticiasFiltradas = noticiasFiltradas.filter(noticia =>
                noticia.category === categoria
            );
        }

        return noticiasFiltradas;
    }

    // Renderizar noticias en el grid
    function renderNoticias(noticias, pagina) {
        const noticiasGrid = document.getElementById('noticias-grid');
        noticiasGrid.innerHTML = '';

        if (noticias.length === 0) {
            noticiasGrid.innerHTML = `
                <div class="noticias-empty">
                    <h3>No se encontraron noticias</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
            `;
            updatePaginacion(0);
            return;
        }

        // Calcular índices para la página actual
        const inicio = (pagina - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const noticiasPaginadas = noticias.slice(inicio, fin);

        noticiasPaginadas.forEach(noticia => {
            const noticiaItem = document.createElement('div');
            noticiaItem.className = 'noticia-item';
            
            const categoryIcon = getCategoryIcon(noticia.category);
            const categoryClass = getCategoryClass(noticia.category);
            const formattedDate = formatDateToSpanish(noticia.date);
            
            noticiaItem.innerHTML = `
                <div class="noticia-thumbnail">
                    <div class="categoria-icon ${categoryClass}">
                        ${categoryIcon}
                    </div>
                </div>
                <div class="noticia-content">
                    <h3 class="noticia-title">${noticia.title}</h3>
                    <p class="noticia-description">${noticia.description}</p>
                    <div class="noticia-meta">
                        <div class="noticia-date-category">
                            ${formattedDate}
                            <span class="categoria-text ${categoryClass}">${noticia.category}</span>
                        </div>
                        <a href="noticia.html?url=${encodeURIComponent(noticia.url)}" class="noticia-link">Leer más</a>
                    </div>
                </div>
            `;
            
            noticiasGrid.appendChild(noticiaItem);
        });

        updatePaginacion(noticias.length);
    }

    // Actualizar controles de paginación
    function updatePaginacion(totalItems) {
        const totalPaginas = Math.ceil(totalItems / itemsPorPagina);
        const paginaActualSpan = document.getElementById('pagina-actual');
        const anteriorBtn = document.getElementById('anterior-pagina');
        const siguienteBtn = document.getElementById('siguiente-pagina');

        paginaActualSpan.textContent = `Página ${paginaActual} de ${totalPaginas || 1}`;
        anteriorBtn.disabled = paginaActual === 1;
        siguienteBtn.disabled = paginaActual >= totalPaginas;
    }

    // Cargar todas las noticias
    function loadNoticias() {
        const noticiasGrid = document.getElementById('noticias-grid');
        if (!noticiasGrid) return;

        try {
            // Usar los datos del archivo noticias.js en lugar de fetch
            if (typeof noticiasData === 'undefined') {
                throw new Error('noticiasData no está definido. Asegúrate de incluir noticias.js');
            }

            if (!Array.isArray(noticiasData)) {
                throw new Error('Formato de noticias inválido');
            }
            
            // Ordenar por fecha descendente (más reciente primero)
            noticiasOriginales = noticiasData.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Renderizar noticias iniciales
            renderNoticias(noticiasOriginales, paginaActual);
            
            // Inicializar filtros
            initializeFilters();
            
            log('Noticias cargadas correctamente');
        } catch (error) {
            console.error('Error al cargar noticias:', error);
            noticiasGrid.innerHTML = '<p>Error al cargar las noticias. Intenta de nuevo más tarde.</p>';
        }
    }

    // Inicializar filtros dinámicos
    function initializeFilters() {
        const filtroTitulo = document.getElementById('filtro-titulo');
        const filtroCategoria = document.getElementById('filtro-categoria');
        const limpiarFiltros = document.getElementById('limpiar-filtros');
        const anteriorBtn = document.getElementById('anterior-pagina');
        const siguienteBtn = document.getElementById('siguiente-pagina');

        // Función para actualizar la vista con filtros y página actual
        function actualizarVista() {
            const noticiasFiltradas = getFilteredNoticias(filtroTitulo.value, filtroCategoria.value);
            renderNoticias(noticiasFiltradas, paginaActual);
        }

        // Eventos para filtros dinámicos
        filtroTitulo.addEventListener('input', () => {
            paginaActual = 1; // Resetear a página 1 solo en cambio de filtro
            actualizarVista();
        });

        filtroCategoria.addEventListener('change', () => {
            paginaActual = 1; // Resetear a página 1 solo en cambio de filtro
            actualizarVista();
        });

        // Evento para limpiar filtros
        limpiarFiltros.addEventListener('click', () => {
            filtroTitulo.value = '';
            filtroCategoria.value = '';
            paginaActual = 1;
            renderNoticias(noticiasOriginales, paginaActual);
        });

        // Eventos para paginación
        anteriorBtn.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                actualizarVista();
            }
        });

        siguienteBtn.addEventListener('click', () => {
            const noticiasFiltradas = getFilteredNoticias(filtroTitulo.value, filtroCategoria.value);
            const totalPaginas = Math.ceil(noticiasFiltradas.length / itemsPorPagina);
            if (paginaActual < totalPaginas) {
                paginaActual++;
                actualizarVista();
            }
        });
    }

    // Inicializar funcionalidades
    try {
        loadNoticias();
    } catch (error) {
        console.error('Error al inicializar funcionalidades:', error);
    }
});