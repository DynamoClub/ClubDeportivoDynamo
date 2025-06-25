// Variables globales corregidas
const RESEÑAS_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScaI-MoSSQ_SXb5ZuqUWo_TxrNQQo6G4s_yHTcOkttitjSKgA/viewform?embedded=true';
const RESEÑAS_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLScaI-MoSSQ_SXb5ZuqUWo_TxrNQQo6G4s_yHTcOkttitjSKgA/formResponse';
const COOKIE_RESENA_ENVIADA = 'dynamo_resena_enviada';
const DIAS_ESPERA = 14;
const RESEÑAS_POR_PAGINA = 3;

let calificacionSeleccionada = 0;
let paginaActual = 1;
let totalPaginas = 1;
let todasLasReseñas = []; // Variable para almacenar todas las reseñas

document.addEventListener('DOMContentLoaded', () => {
    if (typeof reseñasData === 'undefined') {
        console.error('El archivo reseñas.js no está cargado o reseñasData no está definido');
        document.getElementById('reseñas-contenedor').innerHTML = '<p class="sin-reseñas">Error al cargar las reseñas. Por favor, intenta de nuevo más tarde.</p>';
        document.getElementById('cargando').style.display = 'none';
        return;
    }
    crearIframeOculto();
    inicializarReseñas(); // Cambio: función separada para inicializar
    verificarCookieResena();
    inicializarEventos();
});

// FUNCIÓN NUEVA: Inicializar reseñas solo una vez
function inicializarReseñas() {
    const cargando = document.getElementById('cargando');
    
    if (!cargando) {
        console.error('Elemento de carga no encontrado');
        return;
    }

    cargando.style.display = 'block';

    setTimeout(() => {
        cargando.style.display = 'none';
        
        if (!reseñasData?.reseñas?.length) {
            const contenedor = document.getElementById('reseñas-contenedor');
            if (contenedor) {
                contenedor.innerHTML = '<p class="sin-reseñas">Aún no hay reseñas publicadas.</p>';
            }
            return;
        }

        // Guardar todas las reseñas ordenadas
        todasLasReseñas = reseñasData.reseñas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        totalPaginas = Math.ceil(todasLasReseñas.length / RESEÑAS_POR_PAGINA);
        
        // Mostrar primera página
        mostrarReseñasPaginadas();
        
        // Mostrar controles si hay más de una página
        if (totalPaginas > 1) {
            mostrarControlesPaginacion();
        }
    }, 800);
}

// FUNCIÓN CORREGIDA: Solo actualizar la visualización de reseñas
function mostrarReseñasPaginadas() {
    const contenedor = document.getElementById('reseñas-contenedor');
    if (!contenedor) {
        console.error('Contenedor de reseñas no encontrado');
        return;
    }

    const inicio = (paginaActual - 1) * RESEÑAS_POR_PAGINA;
    const fin = inicio + RESEÑAS_POR_PAGINA;
    const reseñasParaMostrar = todasLasReseñas.slice(inicio, fin);

    contenedor.innerHTML = reseñasParaMostrar.map(resena => `
        <div class="resena-card">
            <div class="resena-header">
                <div class="resena-info">
                    <h4>${resena.nombre}</h4>
                    <span class="resena-tipo">${resena.tipo}</span>
                </div>
                <div class="resena-calificacion">
                    ${generarEstrellas(resena.calificacion)}
                </div>
            </div>
            <h5 class="resena-titulo">${resena.titulo}</h5>
            <p class="resena-comentario">${resena.comentario}</p>
            <div class="resena-footer">
                <span class="resena-fecha">${calcularTiempoTranscurrido(resena.fecha)}</span>
                <span class="resena-recomendacion ${resena.recomendacion.toLowerCase().replace('í', 'i')}">
                    ${resena.recomendacion === 'Sí' ? '👍 Recomendado' : 
                      resena.recomendacion === 'Tal vez' ? '🤔 Tal vez' : '👎 No lo recomendaría'}
                </span>
            </div>
        </div>
    `).join('');
    
    // Actualizar controles después de mostrar reseñas
    if (totalPaginas > 1) {
        actualizarControlesPaginacion();
    }
}

// FUNCIÓN CORREGIDA: Actualizar solo los controles
function actualizarControlesPaginacion() {
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const infoPagina = document.getElementById('info-pagina');

    if (!btnAnterior || !btnSiguiente || !infoPagina) {
        console.error('Elementos de paginación no encontrados');
        return;
    }

    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnAnterior.style.opacity = paginaActual === 1 ? '0.5' : '1';
    btnSiguiente.style.opacity = paginaActual === totalPaginas ? '0.5' : '1';
}

function mostrarControlesPaginacion() {
    const controles = document.getElementById('paginacion-controles');
    if (!controles) {
        console.error('Controles de paginación no encontrados');
        return;
    }
    
    controles.style.display = 'flex';
    actualizarControlesPaginacion();
}

// FUNCIÓN CORREGIDA: Cambiar página sin recargar todo
function cambiarPagina(direccion) {
    const nuevaPagina = paginaActual + direccion;
    
    // Validar límites
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
        console.log(`Página ${nuevaPagina} fuera de rango (1-${totalPaginas})`);
        return;
    }
    
    // Actualizar página actual
    paginaActual = nuevaPagina;
    
    // Solo actualizar la visualización, no recargar todo
    mostrarReseñasPaginadas();
    
    // Scroll suave a las reseñas
    const reseñasSection = document.querySelector('.reseñas');
    if (reseñasSection) {
        reseñasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// FUNCIÓN OBSOLETA: Eliminar cargarReseñas() ya que ahora usamos inicializarReseñas()
// La función cargarReseñas() causaba el problema al reinicializar todo cada vez

// Resto de funciones sin cambios importantes...
function crearIframeOculto() {
    const iframe = document.createElement('iframe');
    iframe.id = 'google-form-iframe';
    iframe.style.display = 'none';
    iframe.src = RESEÑAS_FORM_URL;
    document.body.appendChild(iframe);

    iframe.onload = () => {
        const sesionMensaje = document.getElementById('sesion-mensaje');
        const sesionCheck = document.getElementById('sesion-check');
        if (sesionMensaje && sesionCheck) {
            sesionMensaje.innerHTML = '✓ Formulario disponible - Comparte tu experiencia';
            sesionCheck.className = 'sesion-info activa';
            verificarCookieResena();
        }
    };

    iframe.onerror = () => {
        const sesionMensaje = document.getElementById('sesion-mensaje');
        const sesionCheck = document.getElementById('sesion-check');
        if (sesionMensaje && sesionCheck) {
            sesionMensaje.innerHTML = '🔒 Error al conectar con el formulario. Asegúrate de estar logueado en Google.';
            sesionCheck.className = 'sesion-info bloqueada';
            verificarCookieResena();
        }
    };
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let c of ca) {
        c = c.trim();
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
    }
    return null;
}

function calcularDiasRestantes() {
    const cookieValue = getCookie(COOKIE_RESENA_ENVIADA);
    if (!cookieValue) return 0;
    const fechaEnvio = new Date(cookieValue);
    const ahora = new Date();
    const diferencia = (DIAS_ESPERA * 24 * 60 * 60 * 1000) - (ahora - fechaEnvio);
    return Math.max(Math.ceil(diferencia / (24 * 60 * 60 * 1000)), 0);
}

function verificarCookieResena() {
    const sesionCheck = document.getElementById('sesion-check');
    const sesionMensaje = document.getElementById('sesion-mensaje');
    const formularioContainer = document.getElementById('formulario-contenedor');
    const mensajeYaEnviada = document.getElementById('mensaje-ya-enviada');
    const diasRestantesSpan = document.getElementById('dias-restantes');

    if (!sesionCheck || !sesionMensaje || !formularioContainer || !mensajeYaEnviada || !diasRestantesSpan) {
        console.error('Elementos de verificación de cookie no encontrados');
        return;
    }

    const diasRestantes = calcularDiasRestantes();
    if (diasRestantes > 0) {
        sesionCheck.style.display = 'none';
        formularioContainer.style.display = 'none';
        mensajeYaEnviada.style.display = 'block';
        sesionMensaje.innerHTML = `⏳ Ya has enviado una reseña. Vuelve en ${diasRestantes} días.`;
        diasRestantesSpan.textContent = diasRestantes;
    } else {
        const iframe = document.getElementById('google-form-iframe');
        if (iframe && !iframe.contentWindow) {
            sesionCheck.style.display = 'block';
            sesionMensaje.innerHTML = 'Verificando disponibilidad del formulario...';
            sesionCheck.className = 'sesion-info';
            formularioContainer.style.display = 'none';
            mensajeYaEnviada.style.display = 'none';
        } else {
            sesionCheck.style.display = 'block';
            sesionMensaje.innerHTML = '✓ Formulario disponible - Comparte tu experiencia';
            sesionCheck.className = 'sesion-info activa';
            formularioContainer.style.display = 'block';
            mensajeYaEnviada.style.display = 'none';
        }
    }
}

function inicializarEventos() {
    const estrellas = document.querySelectorAll('.estrella');
    const form = document.getElementById('resena-form');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');

    if (!estrellas.length || !form || !btnAnterior || !btnSiguiente) {
        console.error('Elementos de eventos no encontrados');
        return;
    }

    estrellas.forEach(estrella => {
        estrella.addEventListener('click', seleccionarCalificacion);
        estrella.addEventListener('mouseover', resaltarEstrellas);
    });

    document.getElementById('estrellas-rating').addEventListener('mouseleave', () => {
        actualizarVisualizacionEstrellas(calificacionSeleccionada);
    });

    form.addEventListener('submit', enviarResena);

    btnAnterior.addEventListener('click', () => cambiarPagina(-1));
    btnSiguiente.addEventListener('click', () => cambiarPagina(1));
}

function seleccionarCalificacion(e) {
    calificacionSeleccionada = parseInt(e.target.dataset.rating);
    const calificacionInput = document.getElementById('calificacion');
    if (calificacionInput) {
        calificacionInput.value = calificacionSeleccionada;
    }
    actualizarVisualizacionEstrellas(calificacionSeleccionada);
}

function resaltarEstrellas(e) {
    actualizarVisualizacionEstrellas(parseInt(e.target.dataset.rating));
}

function actualizarVisualizacionEstrellas(rating) {
    const estrellas = document.querySelectorAll('.estrella');
    estrellas.forEach((estrella, index) => {
        estrella.classList.toggle('activa', index < rating);
    });
}

function enviarResena(e) {
    e.preventDefault();
    if (calcularDiasRestantes() > 0) {
        mostrarMensajeError(`Debes esperar ${calcularDiasRestantes()} días antes de enviar otra reseña.`);
        return;
    }

    const btnEnviar = document.getElementById('btn-enviar');
    const btnTexto = btnEnviar.querySelector('.btn-texto');
    const btnLoading = btnEnviar.querySelector('.btn-loading');
    if (!btnEnviar || !btnTexto || !btnLoading) {
        console.error('Elementos del botón de enviar no encontrados');
        return;
    }

    btnTexto.style.display = 'none';
    btnLoading.style.display = 'inline';
    btnEnviar.disabled = true;

    try {
        const form = document.getElementById('resena-form');
        if (!form) throw new Error('Formulario no encontrado');
        if (calificacionSeleccionada === 0) throw new Error('Por favor selecciona una calificación con las estrellas');
        const nombre = form.nombre.value.trim();
        const titulo = form.titulo.value.trim();
        const comentario = form.comentario.value.trim();
        if (!nombre || !titulo || !comentario) throw new Error('Por favor completa todos los campos requeridos');

        const nuevaReseña = {
            id: (reseñasData.reseñas.length || 0) + 1,
            nombre,
            tipo: form.tipo.value,
            calificacion: calificacionSeleccionada,
            titulo,
            comentario,
            recomendacion: form.recomendacion.value,
            fecha: new Date().toISOString().split('T')[0]
        };

        console.log('=== NUEVA RESEÑA ENVIADA AL FORMULARIO DE GOOGLE ===');
        console.log(JSON.stringify(nuevaReseña, null, 2));
        console.log('=== COPIA Y PEGA EN reseñas.js TRAS REVISAR ===');

        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = RESEÑAS_FORM_ACTION;
        tempForm.target = 'google-form-iframe';

        const inputs = {
            'entry.724302100': nombre,
            'entry.945041908': form.tipo.value,
            'entry.244124781': calificacionSeleccionada.toString(),
            'entry.224858021': titulo,
            'entry.1601874340': comentario,
            'entry.391244552': form.recomendacion.value
        };

        for (const [name, value] of Object.entries(inputs)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            tempForm.appendChild(input);
        }

        document.body.appendChild(tempForm);
        tempForm.submit();
        document.body.removeChild(tempForm);

        setCookie(COOKIE_RESENA_ENVIADA, new Date().toISOString(), DIAS_ESPERA);
        mostrarMensajeExito();
    } catch (error) {
        mostrarMensajeError(error.message || 'Error al enviar la reseña. Asegúrate de estar logueado en Google.');
    } finally {
        btnTexto.style.display = 'inline';
        btnLoading.style.display = 'none';
        btnEnviar.disabled = false;
    }
}

function mostrarMensajeExito() {
    const form = document.getElementById('resena-form');
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');
    const sesionCheck = document.getElementById('sesion-check');
    if (!form || !mensajeExito || !mensajeError || !sesionCheck) {
        console.error('Elementos de mensaje de éxito no encontrados');
        return;
    }
    form.style.display = 'none';
    mensajeExito.style.display = 'block';
    mensajeError.style.display = 'none';
    sesionCheck.style.display = 'none';
    mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function mostrarMensajeError(mensaje) {
    const form = document.getElementById('resena-form');
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');
    const textoError = document.getElementById('texto-error');
    if (!form || !mensajeExito || !mensajeError || !textoError) {
        console.error('Elementos de mensaje de error no encontrados');
        return;
    }
    form.style.display = 'none';
    mensajeError.style.display = 'block';
    mensajeExito.style.display = 'none';
    textoError.textContent = mensaje;
    mensajeError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function mostrarFormulario() {
    const form = document.getElementById('resena-form');
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');
    const sesionCheck = document.getElementById('sesion-check');
    if (!form || !mensajeExito || !mensajeError || !sesionCheck) {
        console.error('Elementos de formulario no encontrados');
        return;
    }
    form.style.display = 'block';
    mensajeError.style.display = 'none';
    mensajeExito.style.display = 'none';
    sesionCheck.style.display = 'block';
}

function resetearFormulario() {
    const form = document.getElementById('resena-form');
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }
    form.reset();
    calificacionSeleccionada = 0;
    actualizarVisualizacionEstrellas(0);
    const calificacionInput = document.getElementById('calificacion');
    if (calificacionInput) {
        calificacionInput.value = '';
    }
    mostrarFormulario();
    const separador = document.querySelector('.separador-seccion');
    if (separador) {
        separador.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function generarEstrellas(calificacion) {
    return Array(5).fill().map((_, i) => 
        `<span class="estrella-display ${i < calificacion ? 'llena' : ''}">★</span>`
    ).join('');
}

function calcularTiempoTranscurrido(fecha) {
    const ahora = new Date();
    const fechaResena = new Date(fecha);
    const dias = Math.floor((ahora - fechaResena) / (1000 * 60 * 60 * 24));
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Hace 1 día';
    if (dias < 7) return `Hace ${dias} días`;
    if (dias < 30) return `Hace ${Math.floor(dias / 7)} semana${Math.floor(dias / 7) > 1 ? 's' : ''}`;
    if (dias < 365) return `Hace ${Math.floor(dias / 30)} mes${Math.floor(dias / 30) > 1 ? 'es' : ''}`;
    return `Hace ${Math.floor(dias / 365)} año${Math.floor(dias / 365) > 1 ? 's' : ''}`;
}

// Exportar funciones globales
window.cambiarPagina = cambiarPagina;
window.mostrarFormulario = mostrarFormulario;
window.resetearFormulario = resetearFormulario;