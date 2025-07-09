class DynamoGallery {
    constructor(options = {}) {
        // Configuración por defecto
        this.config = {
            itemsPerPage: options.itemsPerPage || 20,
            autoplay: options.autoplay || false,
            lazyLoading: options.lazyLoading !== false,
            animations: options.animations !== false,
            ...options
        };

        // Estado de la galería
        this.state = {
            data: [],
            filteredData: [],
            currentPage: 1,
            currentFilter: 'all',
            totalPages: 0,
            isLoading: false,
            isModalOpen: false,
            currentModalIndex: 0
        };

        // Cache de elementos DOM
        this.elements = {};
        
        // Observador para lazy loading
        this.intersectionObserver = null;

        this.init();
    }

    /**
     * Inicialización principal
     */
    async init() {
        try {
            this.cacheElements();
            await this.loadData();
            this.setupIntersectionObserver();
            this.bindEvents();
            this.render();
        } catch (error) {
            this.handleError('Error initializing gallery', error);
        }
    }

    /**
     * Cache de elementos DOM para mejor rendimiento
     */
    cacheElements() {
        this.elements = {
            galleryGrid: document.getElementById('galleryGrid'),
            modal: document.getElementById('modal'),
            modalMedia: document.getElementById('modalMedia'),
            modalClose: document.querySelector('.gallery-modal-close'),
            filterBtns: document.querySelectorAll('.gallery-filter-btn'),
            pagination: document.getElementById('pagination'),
            paginationControls: document.getElementById('paginacion-controles'),
            pageInfo: document.getElementById('info-pagina'),
            btnPrevious: document.getElementById('btn-anterior'),
            btnNext: document.getElementById('btn-siguiente')
        };

        // Validar elementos críticos
        if (!this.elements.galleryGrid) {
            throw new Error('Gallery grid element not found');
        }
    }

    /**
     * Carga de datos con validación y ordenamiento
     */
    async loadData() {
        try {
            // Verificar si galeriaData está disponible
            if (typeof galeriaData === 'undefined' || !Array.isArray(galeriaData)) {
                throw new Error('Gallery data not available');
            }

            this.state.data = this.validateData(galeriaData);
            
            // Ordenar por ID de más reciente a más viejo (descendente)
            this.state.data.sort((a, b) => b.id - a.id);
            
            this.state.filteredData = [...this.state.data];
            this.updateTotalPages();

            if (this.state.data.length === 0) {
                this.showEmptyState();
            }
        } catch (error) {
            this.handleError('Error loading gallery data', error);
            this.showEmptyState();
        }
    }

    /**
     * Validación y sanitización de datos
     */
    validateData(data) {
        return data.filter(item => {
            // Validar estructura básica
            if (!item.id || !item.type || !item.src) {
                console.warn('Invalid gallery item:', item);
                return false;
            }

            // Validar tipos permitidos
            if (!['image', 'video'].includes(item.type)) {
                console.warn('Invalid item type:', item.type);
                return false;
            }

            // Validar propiedades requeridas
            item.title = item.title || 'Sin título';
            item.alt = item.alt || item.title;
            item.orientation = item.orientation || 'horizontal';

            return true;
        });
    }

    /**
     * Configuración del Intersection Observer para lazy loading
     */
    setupIntersectionObserver() {
        if (!this.config.lazyLoading || !('IntersectionObserver' in window)) {
            return;
        }

        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadMedia(entry.target);
                        this.intersectionObserver.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px 0px',
                threshold: 0.1
            }
        );
    }

    /**
     * Vinculación de eventos
     */
    bindEvents() {
        // Filtros
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', this.handleFilterClick.bind(this));
        });

        // Modal
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', this.closeModal.bind(this));
        }

        if (this.elements.modal) {
            this.elements.modal.addEventListener('click', this.handleModalClick.bind(this));
        }

        // Paginación
        if (this.elements.btnPrevious) {
            this.elements.btnPrevious.addEventListener('click', () => this.changePage(-1));
        }

        if (this.elements.btnNext) {
            this.elements.btnNext.addEventListener('click', () => this.changePage(1));
        }

        // Eventos de teclado
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Prevenir scroll en modal
        this.elements.modal?.addEventListener('wheel', this.preventDefault, { passive: false });
    }

    /**
     * Manejo de clicks en filtros
     */
    handleFilterClick(event) {
        const filter = event.target.dataset.filter;
        if (filter && filter !== this.state.currentFilter) {
            this.applyFilter(filter);
        }
    }

    /**
     * Manejo de clicks en modal
     */
    handleModalClick(event) {
        if (event.target === this.elements.modal) {
            this.closeModal();
        }
    }

    /**
     * Manejo de eventos de teclado
     */
    handleKeyDown(event) {
        if (!this.state.isModalOpen) return;

        switch (event.key) {
            case 'Escape':
                this.closeModal();
                break;
            case 'ArrowLeft':
                this.navigateModal(-1);
                break;
            case 'ArrowRight':
                this.navigateModal(1);
                break;
        }
    }

    /**
     * Prevenir evento por defecto
     */
    preventDefault(event) {
        event.preventDefault();
    }

    /**
     * Aplicar filtro
     */
    applyFilter(filter) {
        this.state.currentFilter = filter;
        this.state.currentPage = 1;

        // Actualizar UI de filtros
        this.updateFilterUI(filter);

        // Filtrar datos
        this.filterData(filter);
        
        // Re-renderizar
        this.render();
    }

    /**
     * Actualizar UI de filtros
     */
    updateFilterUI(activeFilter) {
        this.elements.filterBtns.forEach(btn => {
            const isActive = btn.dataset.filter === activeFilter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });
    }

    /**
     * Filtrar datos
     */
    filterData(filter) {
        if (filter === 'all') {
            this.state.filteredData = [...this.state.data];
        } else {
            this.state.filteredData = this.state.data.filter(item => item.type === filter);
        }
        
        // Mantener el ordenamiento por ID descendente después del filtrado
        this.state.filteredData.sort((a, b) => b.id - a.id);
        
        this.updateTotalPages();
    }

    /**
     * Actualizar total de páginas
     */
    updateTotalPages() {
        this.state.totalPages = Math.ceil(this.state.filteredData.length / this.config.itemsPerPage);
    }

    /**
     * Renderizado principal
     */
    render() {
        if (this.state.isLoading) return;

        this.renderGallery();
        this.renderPagination();
    }

    /**
     * Renderizar galería
     */
    renderGallery() {
        if (!this.elements.galleryGrid) return;

        const { currentPage } = this.state;
        const { itemsPerPage } = this.config;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = this.state.filteredData.slice(startIndex, endIndex);

        // Limpiar galería con animación
        this.clearGallery();

        // Crear elementos
        const fragment = document.createDocumentFragment();
        pageItems.forEach((item, index) => {
            const element = this.createGalleryItem(item, index);
            fragment.appendChild(element);
        });

        this.elements.galleryGrid.appendChild(fragment);

        // Animar entrada si está habilitado
        if (this.config.animations) {
            this.animateGalleryItems();
        }
    }

    /**
     * Limpiar galería
     */
    clearGallery() {
        if (this.elements.galleryGrid) {
            this.elements.galleryGrid.innerHTML = '';
        }
    }

    /**
     * Crear elemento de galería
     */
    createGalleryItem(item, index) {
        const div = document.createElement('div');
        div.className = `gallery-item ${item.type} ${item.orientation}`;
        div.setAttribute('data-id', item.id);
        div.setAttribute('data-index', index);
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.setAttribute('aria-label', `Ver ${item.title} en pantalla completa`);

        if (item.type === 'image') {
            div.innerHTML = this.createImageHTML(item);
        } else if (item.type === 'video') {
            div.innerHTML = this.createVideoHTML(item);
        }

        // Eventos
        div.addEventListener('click', () => this.openModal(item));
        div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openModal(item);
            }
        });

        // Lazy loading
        if (this.config.lazyLoading && this.intersectionObserver) {
            this.intersectionObserver.observe(div);
        } else {
            this.loadMedia(div);
        }

        return div;
    }

    /**
     * Crear HTML para imagen
     */
    createImageHTML(item) {
        return `
            <div class="gallery-media-container">
                <img data-src="${item.src}" alt="${item.alt}" loading="lazy" class="gallery-img">
                <div class="gallery-item-overlay">
                    <h3 class="gallery-item-title">${item.title}</h3>
                    <span class="gallery-type-badge">📷 Imagen</span>
                </div>
            </div>
        `;
    }

    /**
     * Crear HTML para video
     */
    createVideoHTML(item) {
        const poster = item.poster ? `data-poster="${item.poster}"` : '';
        const srcMp4 = typeof item.src === 'object' ? item.src.mp4 : item.src;
        const srcWebm = typeof item.src === 'object' ? item.src.webm : null;
        
        return `
            <div class="gallery-media-container">
                <video ${poster} preload="none" muted class="gallery-video">
                    ${srcWebm ? `<source data-src="${srcWebm}" type="video/webm">` : ''}
                    <source data-src="${srcMp4}" type="video/mp4">
                    Tu navegador no soporta video.
                </video>
                <div class="gallery-play-button text-version" aria-hidden="true">▶</div>
                <div class="gallery-item-overlay">
                    <h3 class="gallery-item-title">${item.title}</h3>
                    <span class="gallery-type-badge">🎬 Video</span>
                </div>
            </div>
        `;
    }

    /**
     * Cargar media (lazy loading)
     */
    loadMedia(element) {
        const img = element.querySelector('img[data-src]');
        const video = element.querySelector('video[data-poster]');
        const sources = element.querySelectorAll('source[data-src]');

        if (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }

        if (video && video.dataset.poster) {
            video.poster = video.dataset.poster;
            video.removeAttribute('data-poster');
        }

        sources.forEach(source => {
            source.src = source.dataset.src;
            source.removeAttribute('data-src');
        });
    }

    /**
     * Animar elementos de galería
     */
    animateGalleryItems() {
        const items = this.elements.galleryGrid.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    /**
     * Abrir modal
     */
    openModal(item) {
        if (!this.elements.modal || !this.elements.modalMedia) return;

        this.state.isModalOpen = true;
        this.state.currentModalItem = item;
        
        // Encontrar el índice del elemento en los datos filtrados
        this.state.currentModalIndex = this.state.filteredData.findIndex(dataItem => dataItem.id === item.id);

        // Limpiar contenido anterior
        this.elements.modalMedia.innerHTML = '';

        // Crear contenido del modal
        const mediaElement = this.createModalContent(item);
        this.elements.modalMedia.appendChild(mediaElement);

        // Mostrar modal
        this.elements.modal.style.display = 'block';
        this.elements.modal.setAttribute('role', 'dialog');
        this.elements.modal.setAttribute('aria-modal', 'true');
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';

        // Focus en el modal
        this.elements.modal.focus();

        // Animación de entrada
        if (this.config.animations) {
            this.elements.modal.style.opacity = '0';
            setTimeout(() => {
                this.elements.modal.style.transition = 'opacity 0.3s ease';
                this.elements.modal.style.opacity = '1';
            }, 10);
        }
    }

    /**
     * Crear contenido del modal
     */
    createModalContent(item) {
        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            img.className = `gallery-modal-img ${item.orientation}`;
            return img;
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.className = `gallery-modal-video ${item.orientation}`;
            video.controls = true;
            video.poster = item.poster || '';
            
            if (this.config.autoplay) {
                video.autoplay = true;
            }

            // Manejar diferentes formatos de src
            if (typeof item.src === 'object') {
                if (item.src.webm) {
                    const sourceWebm = document.createElement('source');
                    sourceWebm.src = item.src.webm;
                    sourceWebm.type = 'video/webm';
                    video.appendChild(sourceWebm);
                }

                if (item.src.mp4) {
                    const sourceMp4 = document.createElement('source');
                    sourceMp4.src = item.src.mp4;
                    sourceMp4.type = 'video/mp4';
                    video.appendChild(sourceMp4);
                }
            } else {
                // Si es string simple
                const source = document.createElement('source');
                source.src = item.src;
                source.type = 'video/mp4';
                video.appendChild(source);
            }

            return video;
        }
    }

    /**
     * Cerrar modal
     */
    closeModal() {
        if (!this.state.isModalOpen) return;

        this.state.isModalOpen = false;

        // Pausar videos
        const videos = this.elements.modalMedia?.querySelectorAll('video');
        videos?.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        // Ocultar modal
        if (this.elements.modal) {
            this.elements.modal.style.display = 'none';
            this.elements.modal.removeAttribute('role');
            this.elements.modal.removeAttribute('aria-modal');
        }

        // Restaurar scroll
        document.body.style.overflow = 'auto';
    }

    /**
     * Navegar en modal con navegación funcional
     */
    navigateModal(direction) {
        if (!this.state.isModalOpen) return;

        const newIndex = this.state.currentModalIndex + direction;
        
        // Validar límites
        if (newIndex < 0 || newIndex >= this.state.filteredData.length) {
            return;
        }

        // Actualizar índice y abrir nuevo item
        this.state.currentModalIndex = newIndex;
        const newItem = this.state.filteredData[newIndex];
        
        // Actualizar contenido del modal
        this.state.currentModalItem = newItem;
        this.elements.modalMedia.innerHTML = '';
        const mediaElement = this.createModalContent(newItem);
        this.elements.modalMedia.appendChild(mediaElement);
    }

    /**
     * Renderizar paginación
     */
    renderPagination() {
        if (!this.elements.paginationControls || !this.elements.pageInfo) return;

        const { currentPage, totalPages } = this.state;

        if (totalPages <= 1) {
            this.elements.paginationControls.style.display = 'none';
            return;
        }

        this.elements.paginationControls.style.display = 'flex';
        this.elements.pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        // Actualizar botones
        this.updatePaginationButtons();
    }

    /**
     * Actualizar botones de paginación
     */
    updatePaginationButtons() {
        const { currentPage, totalPages } = this.state;

        if (this.elements.btnPrevious) {
            this.elements.btnPrevious.disabled = currentPage === 1;
            this.elements.btnPrevious.style.opacity = currentPage === 1 ? '0.5' : '1';
        }

        if (this.elements.btnNext) {
            this.elements.btnNext.disabled = currentPage === totalPages;
            this.elements.btnNext.style.opacity = currentPage === totalPages ? '0.5' : '1';
        }
    }

    /**
     * Cambiar página
     */
    changePage(direction) {
        const newPage = this.state.currentPage + direction;
        
        if (newPage < 1 || newPage > this.state.totalPages) {
            return;
        }

        this.state.currentPage = newPage;
        this.render();

        // Scroll suave al inicio de la galería
        this.scrollToGallery();
    }

    /**
     * Scroll suave a la galería
     */
    scrollToGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        if (galleryContainer) {
            galleryContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    /**
     * Mostrar estado vacío
     */
    showEmptyState() {
        if (this.elements.galleryGrid) {
            this.elements.galleryGrid.innerHTML = `
                <div class="gallery-empty-state">
                    <h3>Aún no hay contenido en la galería</h3>
                    <p>Pronto agregaremos los mejores momentos del Club Deportivo Dynamo</p>
                </div>
            `;
        }
    }

    /**
     * Manejo de errores
     */
    handleError(message, error) {
        console.error(message, error);
        
        // Mostrar mensaje de error amigable
        if (this.elements.galleryGrid) {
            this.elements.galleryGrid.innerHTML = `
                <div class="gallery-error-state">
                    <h3>Error al cargar la galería</h3>
                    <p>Por favor, intenta recargar la página</p>
                </div>
            `;
        }
    }

    /**
     * Destruir instancia (cleanup)
     */
    destroy() {
        // Limpiar observadores
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }

        // Limpiar eventos
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Cerrar modal si está abierto
        if (this.state.isModalOpen) {
            this.closeModal();
        }

        // Limpiar referencias
        this.elements = {};
        this.state = {};
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    // Configuración personalizable
    const galleryConfig = {
        itemsPerPage: 20,
        autoplay: false,
        lazyLoading: true,
        animations: true
    };

    // Crear instancia global
    window.dynamoGallery = new DynamoGallery(galleryConfig);
});

// Funciones globales para compatibilidad
window.cambiarPagina = function(direction) {
    if (window.dynamoGallery) {
        window.dynamoGallery.changePage(direction);
    }
};