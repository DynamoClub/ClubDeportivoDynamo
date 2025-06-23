const logrosData = {
    sub6: [

    ],
    sub8: [

    ],
    sub12: [

    ],
    sub15: [

    ],
    sub16: [

    ],
    arqueros: [

    ]
};

// Nombres de las categorías para el modal
const nombresCategorias = {
    sub6: 'Sub-6',
    sub8: 'Sub-8', 
    sub12: 'Sub-12',
    sub15: 'Sub-15',
    sub16: 'Sub-16',
    arqueros: 'Arqueros'
};

// Variables del DOM
let modal = null;
let modalTitle = null;
let modalContent = null;
let closeBtn = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarModal();
    configurarEventListeners();
});

// Inicializar elementos del modal
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

// Configurar event listeners
function configurarEventListeners() {
    // Botones de ver logros
    const botonesLogros = document.querySelectorAll('.ver-logros-btn');
    botonesLogros.forEach(boton => {
        boton.addEventListener('click', function() {
            const categoria = this.getAttribute('data-target');
            abrirModalLogros(categoria);
        });
    });
    
    // Cerrar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModal);
    }
    
    // Cerrar modal haciendo clic fuera
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            cerrarModal();
        }
    });
}

// Abrir modal con logros de una categoría específica
function abrirModalLogros(categoria) {
    if (!modal || !modalTitle || !modalContent) {
        console.error('Modal no inicializado correctamente');
        return;
    }
    
    // Establecer título del modal
    modalTitle.textContent = `Logros - ${nombresCategorias[categoria]}`;
    
    // Generar contenido de logros
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
    
    // Mostrar modal con animación
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    
    // Añadir animación de entrada
    const modalContentDiv = modal.querySelector('.modal-content');
    modalContentDiv.style.animation = 'modalSlideIn 0.4s ease';
}

// Generar HTML para los logros
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

// Obtener texto descriptivo del tipo de logro
function obtenerTextoTipo(tipo) {
    const tipos = {
        'campeon': '🏆 Campeón',
        'subcampeon': '🥈 Subcampeón',
        'tercero': '🥉 Tercer Lugar'
    };
    return tipos[tipo] || 'Participación';
}

// Cerrar modal
function cerrarModal() {
    if (!modal) return;
    
    // Animación de salida
    const modalContentDiv = modal.querySelector('.modal-content');
    modalContentDiv.style.animation = 'modalSlideOut 0.3s ease';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar scroll del body
    }, 300);
}

// Agregar animación de salida al CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
    }
`;
document.head.appendChild(style);

// Función para agregar nuevos logros (para uso futuro)
function agregarLogro(categoria, nuevoLogro) {
    if (!logrosData[categoria]) {
        logrosData[categoria] = [];
    }
    logrosData[categoria].push(nuevoLogro);
}

// Función para obtener estadísticas de logros
function obtenerEstadisticas(categoria) {
    const logros = logrosData[categoria] || [];
    return {
        total: logros.length,
        campeonatos: logros.filter(logro => logro.tipo === 'campeon').length,
        subcampeonatos: logros.filter(logro => logro.tipo === 'subcampeon').length,
        tercerLugar: logros.filter(logro => logro.tipo === 'tercero').length
    };
}

// Función para filtrar logros por año
function filtrarLogrosPorAño(categoria, año) {
    const logros = logrosData[categoria] || [];
    return logros.filter(logro => logro.año === año.toString());
}

// Efecto de hover mejorado para las tarjetas
document.addEventListener('DOMContentLoaded', function() {
    const tarjetas = document.querySelectorAll('.categoria-card');
    
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('mouseenter', function() {
            // Efecto de elevación adicional
            this.style.zIndex = '10';
        });
        
        tarjeta.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

// Función para animar contadores (si se quiere agregar estadísticas animadas)
function animarContador(elemento, valorFinal, duracion = 1000) {
    let valorInicial = 0;
    const incremento = valorFinal / (duracion / 16);
    
    function actualizar() {
        valorInicial += incremento;
        if (valorInicial < valorFinal) {
            elemento.textContent = Math.floor(valorInicial);
            requestAnimationFrame(actualizar);
        } else {
            elemento.textContent = valorFinal;
        }
    }
    
    actualizar();
}

// Función para mostrar notificación de éxito (para futuras funcionalidades)
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-orange);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}