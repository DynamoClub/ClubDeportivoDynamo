const logrosData = {
    sub5: [],
    sub6a_cordoba: [],
    sub6b_cordoba: [],
    sub7a_cordoba: [],
    sub7b_cordoba: [],
    sub7_vegas: [],
    sub8a_cordoba: [],
    sub8b_cordoba: [],
    sub8_vegas: [],
    sub9a_cordoba: [],
    sub9b_cordoba: [],
    sub9_vegas: [],
    sub10_cordoba: [],
    sub11a_cordoba: [],
    sub11b_cordoba: [],
    sub11_vegas: [],
    sub12: [],
    sub13_cordoba: [],
    sub14a_cordoba: [],
    sub15a_cordoba: [],
    sub15b_cordoba: [],
    sub15c_cordoba: [],
    sub15_vegas: [],
    sub16a_cordoba: [],
    sub17b_cordoba: [],
    arqueros_elite: [],
    arqueros_formativos: []
};

const nombresCategorias = {
    sub5: 'Sub-5 (Córdoba, Vegas)',
    sub6a_cordoba: 'Sub-6 A (Córdoba)',
    sub6b_cordoba: 'Sub-6 B (Córdoba)',
    sub7a_cordoba: 'Sub-7 A (Córdoba)',
    sub7b_cordoba: 'Sub-7 B (Córdoba)',
    sub7_vegas: 'Sub-7 (Vegas)',
    sub8a_cordoba: 'Sub-8 A (Córdoba)',
    sub8b_cordoba: 'Sub-8 B (Córdoba)',
    sub8_vegas: 'Sub-8 (Vegas)',
    sub9a_cordoba: 'Sub-9 A (Córdoba)',
    sub9b_cordoba: 'Sub-9 B (Córdoba)',
    sub9_vegas: 'Sub-9 (Vegas)',
    sub10_cordoba: 'Sub-10 (Córdoba)',
    sub11a_cordoba: 'Sub-11 A (Córdoba)',
    sub11b_cordoba: 'Sub-11 B (Córdoba)',
    sub11_vegas: 'Sub-11 (Vegas)',
    sub12: 'Sub-12 (Córdoba, Vegas)',
    sub13_cordoba: 'Sub-13 (Córdoba)',
    sub14a_cordoba: 'Sub-14 A (Córdoba)',
    sub15a_cordoba: 'Sub-15 A (Córdoba)',
    sub15b_cordoba: 'Sub-15 B (Córdoba)',
    sub15c_cordoba: 'Sub-15 C (Córdoba)',
    sub15_vegas: 'Sub-15 (Vegas)',
    sub16a_cordoba: 'Sub-16 A (Córdoba)',
    sub17b_cordoba: 'Sub-17 B (Córdoba)',
    arqueros_elite: 'Arqueros Elite',
    arqueros_formativos: 'Arqueros Formativos'
};

class DynamoCategories {
    constructor(options = {}) {
        this.config = {
            itemsPerPage: options.itemsPerPage || 10,
            animations: options.animations !== false,
            ...options
        };

        this.state = {
            data: [],
            currentPage: 1,
            totalPages: 0
        };

        this.elements = {};
        this.categoriasData = nombresCategorias;

        this.categoriaInfo = {
            sub5: {
                description: 'Primeros pasos en el fútbol. Los niños desarrollan habilidades motoras básicas y aprenden los fundamentos del juego en un ambiente lúdico y seguro.',
                habilidades: ['Coordinación motriz básica', 'Introducción al balón', 'Socialización y diversión', 'Respeto por las reglas'],
                image: '../public/img/categorias/sub5_dynamo.webp'
            },
            sub6a_cordoba: {
                description: 'Iniciación al fútbol con enfoque en la diversión. Los niños desarrollan coordinación y habilidades sociales mediante juegos estructurados.',
                habilidades: ['Coordinación motriz fina', 'Trabajo en equipo', 'Control inicial del balón', 'Seguimiento de instrucciones'],
                image: '../public/img/categorias/sub6a_cordoba.webp'
            },
            sub6b_cordoba: {
                description: 'Introducción al fútbol con énfasis en la creatividad. Los niños exploran el juego libre mientras desarrollan habilidades básicas.',
                habilidades: ['Coordinación y equilibrio', 'Creatividad en el juego', 'Interacción grupal', 'Contacto con el balón'],
                image: '../public/img/categorias/sub6b_cordoba.webp'
            },
            sub7a_cordoba: {
                description: 'Desarrollo de fundamentos técnicos iniciales. Los jugadores comienzan a aprender pases y control del balón en un entorno estructurado.',
                habilidades: ['Pases cortos', 'Control básico del balón', 'Coordinación en equipo', 'Concentración en el juego'],
                image: '../public/img/categorias/sub7a_cordoba.webp'
            },
            sub7b_cordoba: {
                description: 'Enfoque en habilidades técnicas y trabajo en equipo. Los jugadores desarrollan fundamentos básicos con énfasis en la colaboración.',
                habilidades: ['Técnica de pase', 'Control del balón', 'Colaboración en equipo', 'Respuesta rápida'],
                image: '../public/img/categorias/sub7b_cordoba.webp'
            },
            sub7_vegas: {
                description: 'Introducción a fundamentos técnicos en nuestra sede Vegas. Los jugadores aprenden habilidades básicas en un entorno dinámico.',
                habilidades: ['Pases y recepción', 'Control del balón', 'Trabajo en equipo', 'Agilidad básica'],
                image: '../public/img/categorias/sub7_vegas.webp'
            },
            sub8a_cordoba: {
                description: 'Desarrollo de habilidades técnicas básicas. Los jugadores aprenden fundamentos del fútbol como pases cortos y control del balón.',
                habilidades: ['Técnica básica de pase', 'Control y dominio del balón', 'Posicionamiento básico', 'Velocidad de reacción'],
                image: '../public/img/categorias/sub8a_cordoba.webp'
            },
            sub8b_cordoba: {
                description: 'Enfoque en técnica y coordinación. Los jugadores desarrollan habilidades fundamentales con énfasis en la precisión y el trabajo en equipo.',
                habilidades: ['Precisión en pases', 'Control del balón', 'Trabajo en equipo', 'Agilidad y coordinación'],
                image: '../public/img/categorias/sub8b_cordoba.webp'
            },
            sub8_vegas: {
                description: 'Desarrollo técnico en nuestra sede Vegas. Los jugadores aprenden fundamentos básicos con un enfoque dinámico y competitivo.',
                habilidades: ['Pases cortos', 'Control del balón', 'Posicionamiento en el campo', 'Velocidad de reacción'],
                image: '../public/img/categorias/sub8_vegas.webp'
            },
            sub9a_cordoba: {
                description: 'Perfeccionamiento de habilidades técnicas. Los jugadores desarrollan control avanzado del balón y nociones de posicionamiento.',
                habilidades: ['Control avanzado del balón', 'Pases de precisión', 'Posicionamiento táctico', 'Trabajo en equipo'],
                image: '../public/img/categorias/sub9a_cordoba.webp'
            },
            sub9b_cordoba: {
                description: 'Enfoque en técnica y creatividad. Los jugadores desarrollan habilidades individuales con énfasis en la improvisación.',
                habilidades: ['Control del balón', 'Técnica de regate', 'Creatividad en el juego', 'Colaboración grupal'],
                image: '../public/img/categorias/sub9b_cordoba.webp'
            },
            sub9_vegas: {
                description: 'Desarrollo técnico en nuestra sede Vegas. Los jugadores perfeccionan habilidades individuales y comienzan a entender el juego colectivo.',
                habilidades: ['Técnica de pase', 'Control del balón', 'Nociones tácticas', 'Trabajo en equipo'],
                image: '../public/img/categorias/sub9_vegas.webp'
            },
            sub10_cordoba: {
                description: 'Introducción a conceptos tácticos básicos. Los jugadores desarrollan habilidades técnicas avanzadas y nociones de juego en equipo.',
                habilidades: ['Técnica individual avanzada', 'Conceptos tácticos iniciales', 'Comunicación en el campo', 'Acondicionamiento físico'],
                image: '../public/img/categorias/sub10_cordoba.webp'
            },
            sub11a_cordoba: {
                description: 'Perfeccionamiento técnico y táctico. Los jugadores desarrollan habilidades avanzadas y comienzan a especializarse en posiciones.',
                habilidades: ['Técnica avanzada', 'Posicionamiento táctico', 'Comunicación en equipo', 'Resistencia física'],
                image: '../public/img/categorias/sub11a_cordoba.webp'
            },
            sub11b_cordoba: {
                description: 'Enfoque en técnica y colaboración. Los jugadores desarrollan habilidades individuales con énfasis en el juego colectivo.',
                habilidades: ['Control y pase', 'Regate avanzado', 'Juego en equipo', 'Condición física'],
                image: '../public/img/categorias/sub11b_cordoba.webp'
            },
            sub11_vegas: {
                description: 'Desarrollo técnico y táctico en Vegas. Los jugadores perfeccionan habilidades y aprenden conceptos tácticos básicos.',
                habilidades: ['Técnica individual', 'Nociones tácticas', 'Comunicación en el campo', 'Resistencia física'],
                image: '../public/img/categorias/sub11_vegas.webp'
            },
            sub12: {
                description: 'Perfeccionamiento técnico y táctico. Los jugadores desarrollan habilidades complejas y conceptos tácticos básicos.',
                habilidades: ['Técnica avanzada', 'Conceptos tácticos', 'Juego en equipo', 'Acondicionamiento físico'],
                image: '../public/img/categorias/sub12_dynamo.webp'
            },
            sub13_cordoba: {
                description: 'Introducción a tácticas avanzadas. Los jugadores desarrollan habilidades técnicas y comienzan a especializarse en posiciones.',
                habilidades: ['Técnica avanzada', 'Posicionamiento táctico', 'Comunicación en el campo', 'Resistencia física'],
                image: '../public/img/categorias/sub13_cordoba.webp'
            },
            sub14a_cordoba: {
                description: 'Especialización en posiciones y tácticas. Los jugadores perfeccionan habilidades individuales y tácticas avanzadas.',
                habilidades: ['Especialización por posición', 'Táctica avanzada', 'Liderazgo en el campo', 'Preparación física'],
                image: '../public/img/categorias/sub14a_cordoba.webp'
            },
            sub15a_cordoba: {
                description: 'Desarrollo táctico avanzado. Los jugadores perfeccionan técnicas y desarrollan comprensión del juego colectivo.',
                habilidades: ['Especialización por posiciones', 'Táctica avanzada', 'Liderazgo', 'Preparación física'],
                image: '../public/img/categorias/sub15a_cordoba.webp'
            },
            sub15b_cordoba: {
                description: 'Enfoque en táctica y técnica. Los jugadores desarrollan habilidades avanzadas con énfasis en el juego colectivo.',
                habilidades: ['Técnica avanzada', 'Juego colectivo', 'Comunicación', 'Condición física'],
                image: '../public/img/categorias/sub15b_cordoba.webp'
            },
            sub15c_cordoba: {
                description: 'Desarrollo técnico y táctico. Los jugadores perfeccionan habilidades y aprenden a trabajar en equipo de manera efectiva.',
                habilidades: ['Técnica individual', 'Táctica colectiva', 'Comunicación', 'Resistencia física'],
                image: '../public/img/categorias/sub15c_cordoba.webp'
            },
            sub15_vegas: {
                description: 'Desarrollo táctico en Vegas. Los jugadores perfeccionan técnicas y desarrollan comprensión del juego colectivo.',
                habilidades: ['Especialización por posiciones', 'Táctica avanzada', 'Liderazgo', 'Preparación física'],
                image: '../public/img/categorias/sub15_vegas.webp'
            },
            sub16a_cordoba: {
                description: 'Preparación para categorías superiores. Los jugadores desarrollan un alto nivel técnico-táctico y mentalidad competitiva.',
                habilidades: ['Perfeccionamiento técnico', 'Táctica avanzada', 'Mentalidad competitiva', 'Disciplina profesional'],
                image: '../public/img/categorias/sub16a_cordoba.webp'
            },
            sub17b_cordoba: {
                description: 'Preparación para el fútbol competitivo. Los jugadores desarrollan habilidades avanzadas y se preparan para el nivel amateur.',
                habilidades: ['Técnica avanzada', 'Estrategia de juego', 'Liderazgo', 'Condición física'],
                image: '../public/img/categorias/sub17b_cordoba.webp'
            },
            arqueros_elite: {
                description: 'Programa avanzado para arqueros de élite. Enfocado en técnicas especializadas y preparación para competiciones de alto nivel.',
                habilidades: ['Técnicas avanzadas de atajada', 'Distribución precisa', 'Fortaleza mental', 'Liderazgo en el campo'],
                image: '../public/img/categorias/arqueros_elite_dynamo.webp'
            },
            arqueros_formativos: {
                description: 'Formación inicial para arqueros. Enfocado en técnicas básicas y desarrollo de habilidades específicas para la posición.',
                habilidades: ['Técnica de atajada básica', 'Juego con los pies', 'Reflejos y agilidad', 'Concentración'],
                image: '../public/img/categorias/arqueros_formativos.webp'
            }
        };

        this.init();
    }

    init() {
        try {
            this.cacheElements();
            this.loadData();
            this.bindEvents();
            this.render();
        } catch (error) {
            console.error('Error initializing categories:', error);
            this.showEmptyState();
        }
    }

    cacheElements() {
        this.elements = {
            categoriasGrid: document.getElementById('categoriasGrid'),
            pagination: document.getElementById('categoriasPagination'),
            paginationControls: document.getElementById('categorias-paginacion-controles'),
            pageInfo: document.getElementById('categorias-info-pagina'),
            btnPrevious: document.getElementById('categorias-btn-anterior'),
            btnNext: document.getElementById('categorias-btn-siguiente')
        };

        if (!this.elements.categoriasGrid || !this.elements.pagination) {
            throw new Error('Required DOM elements not found');
        }
    }

    loadData() {
        // Convertir nombresCategorias a un array de objetos, preservando el orden original
        this.state.data = Object.keys(this.categoriasData).map(key => ({
            id: key,
            name: this.categoriasData[key],
            ...this.categoriaInfo[key]
        }));

        // No ordenar alfabéticamente para mantener el orden de nombresCategorias
        this.updateTotalPages();
    }

    updateTotalPages() {
        this.state.totalPages = Math.ceil(this.state.data.length / this.config.itemsPerPage);
    }

    bindEvents() {
        if (this.elements.btnPrevious) {
            this.elements.btnPrevious.addEventListener('click', () => this.changePage(-1));
        }
        if (this.elements.btnNext) {
            this.elements.btnNext.addEventListener('click', () => this.changePage(1));
        }
    }

    render() {
        this.renderCategories();
        this.renderPagination();
    }

    renderCategories() {
        const { currentPage } = this.state;
        const { itemsPerPage } = this.config;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = this.state.data.slice(startIndex, endIndex);

        this.elements.categoriasGrid.innerHTML = '';

        const fragment = document.createDocumentFragment();
        pageItems.forEach(item => {
            const element = this.createCategoryCard(item);
            fragment.appendChild(element);
        });

        this.elements.categoriasGrid.appendChild(fragment);

        if (this.config.animations) {
            this.animateCategoryItems();
        }

        this.bindModalEvents();
    }

    createCategoryCard(item) {
        const div = document.createElement('div');
        div.className = 'categoria-card';
        div.setAttribute('data-categoria', item.id);
        div.innerHTML = `
            <div class="categoria-image">
                <img src="${item.image}" alt="Categoría ${item.name}" />
                <div class="categoria-overlay">
                    <span class="categoria-name">${item.name}</span>
                </div>
            </div>
            <div class="categoria-info">
                <h3>${item.name}</h3>
                <p class="categoria-description">${item.description}</p>
                <div class="habilidades-desarrollar">
                    <h4>Habilidades a Desarrollar:</h4>
                    <ul>
                        ${item.habilidades.map(habilidad => `<li>${habilidad}</li>`).join('')}
                    </ul>
                </div>
                <button class="ver-logros-btn" data-target="${item.id}">Ver Logros</button>
            </div>
        `;
        return div;
    }

    animateCategoryItems() {
        const items = this.elements.categoriasGrid.querySelectorAll('.categoria-card');
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

    bindModalEvents() {
        const botonesLogros = this.elements.categoriasGrid.querySelectorAll('.ver-logros-btn');
        botonesLogros.forEach(boton => {
            boton.addEventListener('click', () => {
                const categoria = boton.getAttribute('data-target');
                abrirModalLogros(categoria);
            });
        });
    }

    renderPagination() {
        if (!this.elements.paginationControls || !this.elements.pageInfo) return;

        const { currentPage, totalPages } = this.state;

        if (totalPages <= 1) {
            this.elements.paginationControls.style.display = 'none';
            return;
        }

        this.elements.paginationControls.style.display = 'flex';
        this.elements.pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        this.updatePaginationButtons();
    }

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

    changePage(direction) {
        const newPage = this.state.currentPage + direction;
        if (newPage < 1 || newPage > this.state.totalPages) return;

        this.state.currentPage = newPage;
        this.render();
        this.scrollToCategories();
    }

    scrollToCategories() {
        const categoriasSection = document.querySelector('.categorias-section');
        if (categoriasSection) {
            categoriasSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    showEmptyState() {
        if (this.elements.categoriasGrid) {
            this.elements.categoriasGrid.innerHTML = `
                <div class="categorias-empty-state">
                    <h3>No hay categorías disponibles</h3>
                    <p>Pronto agregaremos nuevas categorías al Club Deportivo Dynamo</p>
                </div>
            `;
        }
    }
}

let modal = null;
let modalTitle = null;
let modalContent = null;
let closeBtn = null;

document.addEventListener('DOMContentLoaded', function() {
    inicializarModal();
    configurarEventListeners();
    window.dynamoCategories = new DynamoCategories({
        itemsPerPage: 10,
        animations: true
    });
});

function inicializarModal() {
    modal = document.getElementById('logros-modal');
    modalTitle = document.getElementById('modal-title');
    modalContent = document.getElementById('modal-logros-content');
    closeBtn = document.querySelector('.close');
    
    if (!modal || !modalTitle || !modalContent || !closeBtn) {
        console.error('No se pudieron encontrar todos los elementos del modal');
        return;
    }
}

function configurarEventListeners() {
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModal);
    }
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            cerrarModal();
        }
    });
}

function abrirModalLogros(categoria) {
    if (!modal || !modalTitle || !modalContent) {
        console.error('Modal no inicializado correctamente');
        return;
    }
    
    modalTitle.textContent = `Logros - ${nombresCategorias[categoria]}`;
    
    const logros = logrosData[categoria] || [];
    
    if (logros.length === 0) {
        modalContent.innerHTML = `
            <div class="sin-logros">
                <h3>¡Trabajando por nuevos logros!</h3>
                <p>Esta categoría está enfocada en el desarrollo y formación. Pronto tendremos grandes triunfos que celebrar.</p>
            </div>
        `;
    } else {
        modalContent.innerHTML = generarHTMLLogros(logros);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    const modalContentDiv = modal.querySelector('.modal-content');
    modalContentDiv.style.animation = 'modalSlideIn 0.4s ease';
}

function generarHTMLLogros(logros) {
    return logros.map(logro => {
        const tipoTexto = obtenerTextoTipo(logro.tipo);
        return `
            <div class="logro-card">
                <h4>${tipoTexto}</h4>
                <div class="torneo">${logro.torneo}</div>
                <div class="año">Año: ${logro.año}</div>
                <span class="logro-tipo ${logro.tipo}">${tipoTexto}</span>
            </div>
        `;
    }).join('');
}

function obtenerTextoTipo(tipo) {
    const tipos = {
        'campeon': '🏆 Campeón',
        'subcampeon': '🥈 Subcampeón',
        'tercero': '🥉 Tercer Lugar',
        'fair_play': '🤝 Fair Play',
        'goles': '⚽ Mejor Promedio de Goles',
        'asistencia': '🏅 Asistencia Perfecta',
        'progreso': '📈 Mejor Progreso',
        'defensa': '🛡️ Mejor Defensa',
        'ataque': '⚔️ Mejor Ataque',
        'jugador': '🌟 Mejor Jugador',
        'arquero': '🧤 Mejor Arquero',
        'atajadas': '🧤 Mejor Promedio de Atajadas',
        'espiritu': '😊 Espíritu Deportivo',
        'equipo': '🏆 Mejor Equipo'
    };
    return tipos[tipo] || 'Participación';
}

function cerrarModal() {
    if (!modal) return;
    
    const modalContentDiv = modal.querySelector('.modal-content');
    modalContentDiv.style.animation = 'modalSlideOut 0.3s ease';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes modalSlideOut {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to { opacity: 0; transform: translateY(-50px) scale(0.9); }
    }
    @keyframes modalSlideIn {
        from { opacity: 0; transform: translateY(-50px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
`;
document.head.appendChild(style);