document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const selectorBtns = document.querySelectorAll('.selector-btn');
    const formContainers = document.querySelectorAll('.form-container');
    const equipoTecnicoForm = document.getElementById('equipoTecnicoForm');
    const inscripcionForm = document.getElementById('inscripcionForm');
    const anoNacimientoSelect = document.getElementById('ano-nacimiento');
    
    // Número de WhatsApp
    const whatsappNumber = '573126723778';
    
    // Inicializar la página
    init();
    
    function init() {
        setupFormSelector();
        populateYearSelect();
        setupFormSubmissions();
    }
    
    // Configurar selector de formularios
    function setupFormSelector() {
        selectorBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const formType = this.getAttribute('data-form');
                switchForm(formType);
            });
        });
    }
    
    // Cambiar entre formularios
    function switchForm(formType) {
        // Actualizar botones activos
        selectorBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-form') === formType) {
                btn.classList.add('active');
            }
        });
        
        // Mostrar/ocultar formularios
        formContainers.forEach(container => {
            container.classList.remove('active');
            if (container.id === `form-${formType}`) {
                container.classList.add('active');
            }
        });
    }
    
    // Poblar select de años de nacimiento
    function populateYearSelect() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 16; // Máximo 16 años
        const endYear = currentYear - 4;    // Mínimo 4 años
        
        // Limpiar opciones existentes (excepto la primera)
        anoNacimientoSelect.innerHTML = '<option value="">Selecciona el año</option>';
        
        // Agregar años en orden descendente (más recientes primero)
        for (let year = endYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            anoNacimientoSelect.appendChild(option);
        }
    }
    
    // Configurar envío de formularios
    function setupFormSubmissions() {
        equipoTecnicoForm.addEventListener('submit', handleEquipoTecnicoSubmit);
        inscripcionForm.addEventListener('submit', handleInscripcionSubmit);
    }
    
    // Manejar envío del formulario de equipo técnico
    function handleEquipoTecnicoSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(equipoTecnicoForm);
        const data = Object.fromEntries(formData);
        
        // Validar campos requeridos
        if (!validateEquipoTecnicoForm(data)) {
            return;
        }
        
        // Construir mensaje para WhatsApp
        const message = buildEquipoTecnicoMessage(data);
        
        // Enviar a WhatsApp
        sendToWhatsApp(message);
    }
    
    // Manejar envío del formulario de inscripción
    function handleInscripcionSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(inscripcionForm);
        const data = Object.fromEntries(formData);
        
        // Validar campos requeridos
        if (!validateInscripcionForm(data)) {
            return;
        }
        
        // Construir mensaje para WhatsApp
        const message = buildInscripcionMessage(data);
        
        // Enviar a WhatsApp
        sendToWhatsApp(message);
    }
    
    // Validar formulario de equipo técnico
    function validateEquipoTecnicoForm(data) {
        const requiredFields = ['nombre', 'telefono', 'cargo'];
        
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                showError(`Por favor completa el campo: ${getFieldLabel(field)}`);
                return false;
            }
        }
        
        // Validar teléfono
        if (!validatePhone(data.telefono)) {
            showError('Por favor ingresa un número de teléfono válido');
            return false;
        }
        
        return true;
    }
    
    // Validar formulario de inscripción
    function validateInscripcionForm(data) {
        const requiredFields = ['nombrePadre', 'telefonoPadre', 'nombreJugador', 'anoNacimiento', 'posicion'];
        
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                showError(`Por favor completa el campo: ${getFieldLabel(field)}`);
                return false;
            }
        }
        
        // Validar teléfono
        if (!validatePhone(data.telefonoPadre)) {
            showError('Por favor ingresa un número de teléfono válido');
            return false;
        }
        
        // Validar año de nacimiento
        const currentYear = new Date().getFullYear();
        const birthYear = parseInt(data.anoNacimiento);
        if (birthYear > currentYear - 4 || birthYear < currentYear - 16) {
            showError('Por favor selecciona un año de nacimiento válido (entre 4 y 16 años)');
            return false;
        }
        
        return true;
    }
    
    // Validar número de teléfono
    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone.trim());
    }
    
    // Construir mensaje para equipo técnico
    function buildEquipoTecnicoMessage(data) {
        const cargoLabels = {
            'entrenador': 'Entrenador',
            'preparador-fisico': 'Preparador Físico',
            'fisioterapeuta': 'Fisioterapeuta',
            'preparador-arqueros': 'Preparador de Arqueros'
        };
        
        let message = `🏆 *SOLICITUD EQUIPO TÉCNICO - CLUB DYNAMO*\n\n`;
        message += `Hola, me gustaría ser parte de la familia Dynamo. `;
        message += `Soy un ${cargoLabels[data.cargo].toLowerCase()} y me gustaría conocer si tienen disponibilidad en el equipo técnico.\n\n`;
        message += `📋 *Datos del Solicitante:*\n`;
        message += `• *Nombre:* ${data.nombre}\n`;
        message += `• *Teléfono:* ${data.telefono}\n`;
        message += `• *Cargo de interés:* ${cargoLabels[data.cargo]}\n`;
        
        if (data.experiencia && data.experiencia.trim()) {
            message += `• *Experiencia:* ${data.experiencia}\n`;
        }
        
        if (data.disponibilidad && data.disponibilidad.trim()) {
            message += `• *Disponibilidad:* ${data.disponibilidad}\n`;
        }
        
        message += `\n¡Espero poder contribuir al crecimiento de los jóvenes talentos! ⚽`;
        
        return message;
    }
    
    // Construir mensaje para inscripción de jugador
    function buildInscripcionMessage(data) {
        const posicionLabels = {
            'delantero': 'Delantero',
            'mediocampo': 'Mediocampo',
            'defensa': 'Defensa',
            'arquero': 'Arquero'
        };
        
        // Determinar categoría basada en año de nacimiento
        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(data.anoNacimiento);
        const categoria = determineCategory(age);
        
        let message = `⚽ *INSCRIPCIÓN JUGADOR - CLUB DYNAMO*\n\n`;
        message += `Hola, me gustaría inscribir a mi ${getGenderFromName(data.nombreJugador)}. `;
        message += `Es un ${posicionLabels[data.posicion].toLowerCase()} y me gustaría saber qué tengo que hacer para inscribirlo en el club.\n\n`;
        message += `👶 *Datos del Jugador:*\n`;
        message += `• *Nombre:* ${data.nombreJugador}\n`;
        message += `• *Año de nacimiento:* ${data.anoNacimiento}\n`;
        message += `• *Edad aproximada:* ${age} años\n`;
        message += `• *Categoría sugerida:* ${categoria}\n`;
        message += `• *Posición preferida:* ${posicionLabels[data.posicion]}\n\n`;
        message += `👨‍👩‍👧‍👦 *Datos de Contacto:*\n`;
        message += `• *Padre/Madre:* ${data.nombrePadre}\n`;
        message += `• *Teléfono:* ${data.telefonoPadre}\n`;
        
        if (data.experienciaJugador && data.experienciaJugador.trim()) {
            message += `\n🏃‍♂️ *Experiencia deportiva:*\n${data.experienciaJugador}\n`;
        }
        
        if (data.observaciones && data.observaciones.trim()) {
            message += `\n📝 *Observaciones:*\n${data.observaciones}\n`;
        }
        
        message += `\n¡Esperamos que pueda formar parte de la familia Dynamo! 🏆`;
        
        return message;
    }
    
    // Determinar categoría basada en la edad
    function determineCategory(age) {
        if (age <= 6) return 'Sub-6';
        if (age <= 8) return 'Sub-8';
        if (age <= 12) return 'Sub-12';
        if (age <= 15) return 'Sub-15';
        if (age <= 16) return 'Sub-16';
        return 'Consultar categoría';
    }
    
    // Determinar género basado en el nombre (simplificado)
    function getGenderFromName(name) {
        // Esta es una función simplificada. En un caso real podrías usar una API o base de datos
        const femaleEndings = ['a', 'ia', 'ana', 'ina', 'ela', 'isa'];
        const nameLower = name.toLowerCase().trim();
        
        for (const ending of femaleEndings) {
            if (nameLower.endsWith(ending)) {
                return 'niña';
            }
        }
        
        return 'niño'; // Por defecto
    }
    
    // Obtener etiqueta del campo para mensajes de error
    function getFieldLabel(fieldName) {
        const labels = {
            'nombre': 'Nombre Completo',
            'telefono': 'Teléfono',
            'cargo': 'Cargo de Interés',
            'nombrePadre': 'Nombre del Padre/Madre',
            'telefonoPadre': 'Teléfono de Contacto',
            'nombreJugador': 'Nombre del Jugador',
            'anoNacimiento': 'Año de Nacimiento',
            'posicion': 'Posición Preferida'
        };
        
        return labels[fieldName] || fieldName;
    }
    
    // Enviar mensaje a WhatsApp
    function sendToWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp en una nueva ventana
        window.open(whatsappUrl, '_blank');
        
        // Mostrar mensaje de confirmación
        showSuccess('¡Mensaje preparado! Te hemos redirigido a WhatsApp para enviar tu solicitud.');
        
        // Resetear formulario después de un breve delay
        setTimeout(() => {
            resetActiveForm();
        }, 1000);
    }
    
    // Resetear el formulario activo
    function resetActiveForm() {
        const activeForm = document.querySelector('.form-container.active form');
        if (activeForm) {
            activeForm.reset();
        }
    }
    
    // Mostrar mensaje de error
    function showError(message) {
        // Remover alertas existentes
        removeExistingAlerts();
        
        const alert = createAlert(message, 'error');
        insertAlert(alert);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
    
    // Mostrar mensaje de éxito
    function showSuccess(message) {
        // Remover alertas existentes
        removeExistingAlerts();
        
        const alert = createAlert(message, 'success');
        insertAlert(alert);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
    
    // Crear elemento de alerta
    function createAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">
                    ${type === 'error' ? 
                        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>' :
                        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
                    }
                </div>
                <span class="alert-message">${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        `;
        
        return alert;
    }
    
    // Insertar alerta en el DOM
    function insertAlert(alert) {
        const container = document.querySelector('.contact-container');
        container.insertBefore(alert, container.firstChild);
        
        // Animar entrada
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
    }
    
    // Remover alertas existentes
    function removeExistingAlerts() {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
    }
    
    // Función de utilidad para debugging (opcional)
    function debugFormData(data) {
        console.log('Form data:', data);
    }
    
    // Event listeners adicionales para mejorar UX
    
    // Limpiar errores cuando el usuario empiece a escribir
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', function() {
            // Remover clases de error si existen
            this.classList.remove('error');
            
            // Remover alertas si el usuario está corrigiendo
            const alerts = document.querySelectorAll('.alert-error');
            if (alerts.length > 0) {
                setTimeout(() => {
                    alerts.forEach(alert => alert.remove());
                }, 500);
            }
        });
    });
    
    // Formatear número de teléfono mientras se escribe
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            // Remover caracteres no numéricos excepto + - ( ) espacios
            let value = this.value.replace(/[^\d\+\-\(\)\s]/g, '');
            this.value = value;
        });
    });
    
    // Capitalizar nombres mientras se escriben
    document.querySelectorAll('#nombre-tecnico, #nombre-padre, #nombre-jugador').forEach(input => {
        input.addEventListener('input', function() {
            const words = this.value.split(' ');
            const capitalizedWords = words.map(word => {
                if (word.length > 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                return word;
            });
            this.value = capitalizedWords.join(' ');
        });
    });
    
});