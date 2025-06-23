document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURACIÓN INICIAL ===
    
    // Variables para debugging
    const isDebug = true;
    const log = (message) => isDebug && console.log(`[Tienda] ${message}`);

    // Variables para paginación
    const itemsPorPagina = 15;
    let paginaActual = 1;
    let productosOriginales = [];
    let carrito = [];
    let isCartButtonLocked = false;

    // Imagen por defecto
    const imagenPorDefecto = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjUgMTAwSDE3NVYxNTBIMTI1VjEwMFoiIGZpbGw9IiNEMEQwRDAiLz4KPHBhdGggZD0iTTEwMCAxNzVIMjAwVjIwMEgxMDBWMTc1WiIgZmlsbD0iI0QwRDBEMCIvPgo8Y2lyY2xlIGN4PSIxMzciIGN5PSIxMTMiIHI9IjgiIGZpbGw9IiNBMEEwQTAiLz4KPHRleHQgeD0iMTUwIiB5PSIyNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+Cjwvc3ZnPgo=';

    // Número de WhatsApp
    const whatsappNumber = '573148130955';

    // === FUNCIONES DE FORMATEO Y UTILIDADES ===

    function formatPrice(price) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    function getCategoryIcon(category) {
        const categoryLower = category.toLowerCase();
        switch(categoryLower) {
            case 'camisetas': return '👕';
            case 'pantalones': return '👖';
            case 'zapatillas': return '👟';
            case 'accesorios': return '🎒';
            case 'equipamiento': return '⚽';
            default: return '🛍️';
        }
    }

    function getCategoryClass(category) {
        return category.toLowerCase().replace(/\s+/g, '-');
    }

    // === FUNCIONES DE MANEJO DE IMÁGENES ===

    function handleImageError(imgElement, categoria) {
        imgElement.style.display = 'none';
        const iconContainer = document.createElement('div');
        iconContainer.className = `categoria-icon ${getCategoryClass(categoria)}`;
        iconContainer.textContent = getCategoryIcon(categoria);
        imgElement.parentNode.insertBefore(iconContainer, imgElement.nextSibling);
    }

    function checkImageExists(url) {
        return new Promise((resolve) => {
            if (!url || url.trim() === '') {
                resolve(false);
                return;
            }
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    async function createImageElement(producto) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'producto-image';
        
        if (producto.image && producto.image.trim() !== '') {
            const imageExists = await checkImageExists(producto.image);
            if (imageExists) {
                const img = document.createElement('img');
                img.src = producto.image;
                img.alt = producto.name;
                img.loading = 'lazy';
                img.onerror = () => handleImageError(img, producto.category);
                imageContainer.appendChild(img);
            } else {
                const iconDiv = document.createElement('div');
                iconDiv.className = `categoria-icon ${getCategoryClass(producto.category)}`;
                iconDiv.textContent = getCategoryIcon(producto.category);
                imageContainer.appendChild(iconDiv);
            }
        } else {
            const iconDiv = document.createElement('div');
            iconDiv.className = `categoria-icon ${getCategoryClass(producto.category)}`;
            iconDiv.textContent = getCategoryIcon(producto.category);
            imageContainer.appendChild(iconDiv);
        }
        
        if (producto.discount) {
            const discountBadge = document.createElement('div');
            discountBadge.className = 'descuento-badge';
            discountBadge.textContent = `${producto.discount}% OFF`;
            imageContainer.appendChild(discountBadge);
        }
        
        return imageContainer;
    }

    // === FUNCIONES DE FILTRADO Y ORDENAMIENTO ===

    function getFilteredProductos(nombre, categoria, precioMin, precioMax) {
        let productosFiltrados = productosOriginales;
        if (nombre && nombre.trim() !== '') {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.name.toLowerCase().includes(nombre.toLowerCase()) ||
                producto.description.toLowerCase().includes(nombre.toLowerCase())
            );
        }
        if (categoria) {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.category === categoria
            );
        }
        if (precioMin !== null && precioMin !== '') {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.price >= parseFloat(precioMin)
            );
        }
        if (precioMax !== null && precioMax !== '') {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.price <= parseFloat(precioMax)
            );
        }
        return productosFiltrados;
    }

    function sortProductos(productos, criterio) {
        const productosOrdenados = [...productos];
        switch(criterio) {
            case 'nombre-asc': return productosOrdenados.sort((a, b) => a.name.localeCompare(b.name));
            case 'nombre-desc': return productosOrdenados.sort((a, b) => b.name.localeCompare(b.name));
            case 'precio-asc': return productosOrdenados.sort((a, b) => a.price - b.price);
            case 'precio-desc': return productosOrdenados.sort((a, b) => b.price - a.price);
            case 'categoria': return productosOrdenados.sort((a, b) => a.category.localeCompare(b.category));
            default: return productosOrdenados;
        }
    }

    // === FUNCIONES DE RENDERIZADO Y PAGINACIÓN ===

    async function renderProductos(productos, pagina) {
        const productosGrid = document.getElementById('productos-grid');
        const productosCount = document.getElementById('productos-count');
        if (!productosGrid || !productosCount) {
            return;
        }

        productosGrid.innerHTML = '';
        if (productos.length === 0) {
            productosGrid.innerHTML = `
                <div class="productos-empty">
                    <h3>No se encontraron productos</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
            `;
            productosCount.textContent = 'No se encontraron productos';
            updatePaginacion(0);
            return;
        }

        productosCount.textContent = `${productos.length} producto${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`;
        const inicio = (pagina - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const productosPaginados = productos.slice(inicio, fin);

        for (const producto of productosPaginados) {
            const productoItem = document.createElement('div');
            productoItem.className = 'producto-item';
            const categoryClass = getCategoryClass(producto.category);
            const formattedPrice = formatPrice(producto.price);
            const discountPrice = producto.discount ? formatPrice(producto.price * (1 - producto.discount / 100)) : null;
            const imageElement = await createImageElement(producto);
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'producto-content';
            contentDiv.innerHTML = `
                <div class="producto-header">
                    <h3 class="producto-title">${producto.name}</h3>
                    <span class="categoria-text ${categoryClass}">${producto.category}</span>
                </div>
                <p class="producto-description">${producto.description}</p>
                <div class="producto-price">
                    ${discountPrice ? 
                        `<span class="precio-descuento">${discountPrice}</span>
                         <span class="precio-original">${formattedPrice}</span>` :
                        `<span class="precio-actual">${formattedPrice}</span>`
                    }
                </div>
                <div class="producto-actions">
                    <button class="producto-btn" data-id="${producto.id}">
                        Agregar al Carrito
                    </button>
                </div>
            `;
            
            productoItem.appendChild(imageElement);
            productoItem.appendChild(contentDiv);
            productosGrid.appendChild(productoItem);
        }

        updatePaginacion(productos.length);
    }

    function updatePaginacion(totalItems) {
        const totalPaginas = Math.ceil(totalItems / itemsPorPagina);
        const paginaActualSpan = document.getElementById('pagina-actual');
        const anteriorBtn = document.getElementById('anterior-pagina');
        const siguienteBtn = document.getElementById('siguiente-pagina');
        if (!paginaActualSpan || !anteriorBtn || !siguienteBtn) {
            return;
        }

        paginaActualSpan.textContent = `Página ${paginaActual} de ${totalPaginas || 1}`;
        anteriorBtn.disabled = paginaActual === 1;
        siguienteBtn.disabled = paginaActual >= totalPaginas;
    }

    // === FUNCIONES DE INICIALIZACIÓN ===

    function getProductosActuales() {
        const filtroNombre = document.getElementById('filtro-nombre');
        const filtroCategoria = document.getElementById('filtro-categoria');
        const precioMinimo = document.getElementById('precio-minimo');
        const precioMaximo = document.getElementById('precio-maximo');
        const ordenarPor = document.getElementById('ordenar-por');
        if (!filtroNombre || !filtroCategoria || !precioMinimo || !precioMaximo || !ordenarPor) {
            return productosOriginales;
        }

        let productosFiltrados = getFilteredProductos(
            filtroNombre.value,
            filtroCategoria.value,
            precioMinimo.value,
            precioMaximo.value
        );
        return sortProductos(productosFiltrados, ordenarPor.value);
    }

    function loadProductos() {
        const productosGrid = document.getElementById('productos-grid');
        const productosCount = document.getElementById('productos-count');
        if (!productosGrid || !productosCount) {
            return;
        }

        try {
            // Usar los datos del archivo productos.js en lugar de fetch
            if (typeof productosData === 'undefined') {
                throw new Error('productosData no está definido. Asegúrate de incluir productos.js');
            }

            if (!Array.isArray(productosData)) {
                throw new Error('Formato de productos inválido');
            }

            productosGrid.innerHTML = '<div class="productos-loading">Cargando productos...</div>';
            productosOriginales = productosData;
            carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            updateCartCounter();
            const productosActuales = getProductosActuales();
            renderProductos(productosActuales, paginaActual);
            initializeFilters();
            initializeCart();
            initializeCartEvents();
            log('Productos cargados correctamente');
        } catch (error) {
            console.error('Error al cargar productos:', error);
            productosGrid.innerHTML = `
                <div class="productos-empty">
                    <h3>Error al cargar productos</h3>
                    <p>Intenta recargar la página más tarde</p>
                </div>
            `;
            productosCount.textContent = 'Error al cargar productos';
        }
    }

    function initializeFilters() {
        const filtroNombre = document.getElementById('filtro-nombre');
        const filtroCategoria = document.getElementById('filtro-categoria');
        const precioMinimo = document.getElementById('precio-minimo');
        const precioMaximo = document.getElementById('precio-maximo');
        const ordenarPor = document.getElementById('ordenar-por');
        const limpiarFiltros = document.getElementById('limpiar-filtros');
        const anteriorBtn = document.getElementById('anterior-pagina');
        const siguienteBtn = document.getElementById('siguiente-pagina');
        if (!filtroNombre || !filtroCategoria || !precioMinimo || !precioMaximo || !ordenarPor || !limpiarFiltros || !anteriorBtn || !siguienteBtn) {
            return;
        }

        async function actualizarVista() {
            const productosGrid = document.getElementById('productos-grid');
            productosGrid.innerHTML = '<div class="productos-loading">Aplicando filtros...</div>';
            const productosActuales = getProductosActuales();
            await renderProductos(productosActuales, paginaActual);
        }

        function resetearYActualizar() {
            paginaActual = 1;
            actualizarVista();
        }

        filtroNombre.addEventListener('input', resetearYActualizar);
        filtroCategoria.addEventListener('change', resetearYActualizar);
        precioMinimo.addEventListener('input', resetearYActualizar);
        precioMaximo.addEventListener('input', resetearYActualizar);
        ordenarPor.addEventListener('change', resetearYActualizar);

        limpiarFiltros.addEventListener('click', async () => {
            filtroNombre.value = '';
            filtroCategoria.value = '';
            precioMinimo.value = '';
            precioMaximo.value = '';
            ordenarPor.value = 'nombre-asc';
            paginaActual = 1;
            await renderProductos(productosOriginales, paginaActual);
        });

        anteriorBtn.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                actualizarVista();
                document.querySelector('.tienda-general').scrollIntoView({ behavior: 'smooth' });
            }
        });

        siguienteBtn.addEventListener('click', () => {
            const productosActuales = getProductosActuales();
            const totalPaginas = Math.ceil(productosActuales.length / itemsPorPagina);
            if (paginaActual < totalPaginas) {
                paginaActual++;
                actualizarVista();
                document.querySelector('.tienda-general').scrollIntoView({ behavior: 'smooth' });
            }
        });

        precioMinimo.addEventListener('blur', () => {
            const min = parseFloat(precioMinimo.value);
            const max = parseFloat(precioMaximo.value);
            if (min && max && min > max) {
                precioMaximo.value = precioMinimo.value;
                resetearYActualizar();
            }
        });

        precioMaximo.addEventListener('blur', () => {
            const min = parseFloat(precioMinimo.value);
            const max = parseFloat(precioMaximo.value);
            if (min && max && max < min) {
                precioMinimo.value = precioMaximo.value;
                resetearYActualizar();
            }
        });
    }
    
    // === FUNCIONES CARRITO ===

    function saveCart() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function updateCartCounter() {
        const contador = document.getElementById('carrito-contador');
        if (!contador) {
            return;
        }
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems.toString();
        contador.classList.toggle('hidden', totalItems === 0);
    }

    function calculateCartTotal() {
        return carrito.reduce((total, item) => {
            const price = item.discount ? 
                item.price * (1 - item.discount / 100) : 
                item.price;
            return total + (price * item.cantidad);
        }, 0);
    }

    function updateCartButtonState(locked) {
        const carritoBtn = document.getElementById('carrito-btn');
        if (!carritoBtn) {
            return;
        }
        carritoBtn.disabled = locked;
        carritoBtn.classList.toggle('carrito-btn-locked', locked);
    }

    let addToCartTimeout = null;

    function addToCart(productId) {
        if (addToCartTimeout) {
            clearTimeout(addToCartTimeout);
        }

        isCartButtonLocked = true;
        updateCartButtonState(true);

        addToCartTimeout = setTimeout(() => {
            const id = parseInt(productId);
            const producto = productosOriginales.find(p => p.id === id);
            if (!producto) {
                isCartButtonLocked = false;
                updateCartButtonState(false);
                return;
            }

            const existingItemIndex = carrito.findIndex(item => item.id === id);
            if (existingItemIndex >= 0) {
                carrito[existingItemIndex].cantidad += 1;
            } else {
                carrito.push({
                    ...producto,
                    cantidad: 1
                });
            }

            saveCart();
            updateCartCounter();
            
            const carritoModal = document.getElementById('carrito-modal');
            if (carritoModal && carritoModal.classList.contains('show')) {
                renderCartItems();
            }
        }, 150);
    }

    function renderCartItems() {
        const carritoItems = document.getElementById('carrito-items');
        let carritoVacio = document.querySelector('.carrito-vacio');
        const carritoTotal = document.getElementById('carrito-total');
        const btnVaciar = document.getElementById('vaciar-carrito');
        const btnComprar = document.getElementById('proceder-compra');
        
        if (!carritoItems) {
            log('Error: Elemento #carrito-items no encontrado en el DOM');
            return;
        }
        if (!carritoTotal) {
            log('Error: Elemento #carrito-total no encontrado en el DOM');
            return;
        }
        if (!btnVaciar) {
            log('Error: Elemento #vaciar-carrito no encontrado en el DOM');
            return;
        }
        if (!btnComprar) {
            log('Error: Elemento #proceder-compra no encontrado en el DOM');
            return;
        }

        if (!carritoVacio) {
            carritoVacio = document.createElement('div');
            carritoVacio.className = 'carrito-vacio';
            carritoVacio.style.display = 'none';
            carritoVacio.innerHTML = `
                
            `;
            const carritoModal = document.getElementById('carrito-modal');
            if (carritoModal) {
                carritoModal.appendChild(carritoVacio);
            } else {
                log('Error: Elemento #carrito-modal no encontrado para insertar .carrito-vacio');
                return;
            }
        }

        carritoItems.innerHTML = '';
        
        if (carrito.length === 0) {
            carritoVacio.style.display = 'block';
            btnVaciar.disabled = true;
            btnComprar.disabled = true;
            carritoTotal.textContent = formatPrice(0);
        } else {
            carritoVacio.style.display = 'none';
            btnVaciar.disabled = false;
            btnComprar.disabled = false;

            carrito.forEach((item, index) => {
                const precioFinal = item.discount ? 
                    item.price * (1 - item.discount / 100) : 
                    item.price;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'carrito-item';
                itemElement.innerHTML = `
                    <div class="carrito-item-image">
                        ${item.image && item.image.trim() !== '' ? 
                            `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                             <div class="carrito-categoria-icon ${getCategoryClass(item.category)}" style="display: none;">${getCategoryIcon(item.category)}</div>` :
                            `<div class="carrito-categoria-icon ${getCategoryClass(item.category)}">${getCategoryIcon(item.category)}</div>`
                        }
                    </div>
                    <div class="carrito-item-info">
                        <h3 class="carrito-item-name">${item.name}</h3>
                        <span class="carrito-item-categoria">${item.category}</span>
                        <span class="carrito-item-price">${formatPrice(precioFinal)}</span>
                    </div>
                    <div class="carrito-item-controls">
                        <div class="cantidad-controls">
                            <button class="cantidad-btn menos" data-index="${index}" ${item.cantidad <= 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>-</button>
                            <span class="cantidad-display">${item.cantidad}</span>
                            <button class="cantidad-btn mas" data-index="${index}">+</button>
                        </div>
                        <button class="eliminar-item" data-index="${index}" title="Eliminar producto">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <path d="M5 6l1 14c0 1 1 2 2 2h8c1 0 2-1 2-2L19 6"></path>
                            </svg>
                        </button>
                    </div>
                    <span class="carrito-item-total">${formatPrice(precioFinal * item.cantidad)}</span>
                `;
                carritoItems.appendChild(itemElement);
            });
            
            carritoTotal.textContent = formatPrice(calculateCartTotal());
        }

        updateCartCounter();
    }

    function handleQuantityChange(index, change) {
        if (index < 0 || index >= carrito.length) {
            log(`Error: Índice de carrito inválido: ${index}`);
            return;
        }
        
        const currentItem = carrito[index];
        const newQuantity = currentItem.cantidad + change;
        
        if (newQuantity <= 0) {
            carrito.splice(index, 1);
        } else {
            carrito[index].cantidad = newQuantity;
        }
        
        saveCart();
        renderCartItems();
    }

    function removeFromCart(index) {
        if (index < 0 || index >= carrito.length) {
            log(`Error: Índice de carrito inválido para eliminación: ${index}`);
            return;
        }
        const itemName = carrito[index].name;
        carrito.splice(index, 1);
        saveCart();
        renderCartItems();
    }

    function clearCart() {
        if (carrito.length === 0) {
            return;
        }
        
        carrito.length = 0;
        saveCart();
        renderCartItems();
    }

    // === FUNCIONES PARA WHATSAPP Y ALERTAS ===

    function buildCartMessage() {
        let message = `🛒 *SOLICITUD DE COMPRA - TIENDA DYNAMO*\n\n`;
        message += `Hola Dynamo, me gustaron los siguientes artículos de la tienda y quisiera realizar la compra:\n\n`;
        message += `📋 *Detalles del Pedido:*\n`;

        carrito.forEach(item => {
            const precioFinal = item.discount ? 
                item.price * (1 - item.discount / 100) : 
                item.price;
            const subtotal = precioFinal * item.cantidad;
            message += `• *Producto:* ${item.name}\n`;
            message += `  *Categoría:* ${item.category}\n`;
            message += `  *Cantidad:* ${item.cantidad}\n`;
            message += `  *Precio Unitario:* ${formatPrice(precioFinal)}\n`;
            message += `  *Subtotal:* ${formatPrice(subtotal)}\n`;
            if (item.discount) {
                message += `  *Descuento:* ${item.discount}% OFF\n`;
            }
            message += `\n`;
        });

        const total = calculateCartTotal();
        message += `💰 *Total a Pagar:* ${formatPrice(total)}\n\n`;
        message += `Por favor, indíquenme los pasos para proceder con el pago y la entrega. ¡Gracias! 😊`;

        return message;
    }

    function sendToWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    function showSuccess(message) {
        removeExistingAlerts();
        
        const alert = createAlert(message, 'success');
        insertAlert(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    function createAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">
                    ${type === 'success' ? 
                        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' :
                        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'
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

    function insertAlert(alert) {
        const container = document.querySelector('.tienda-general') || document.body;
        container.insertBefore(alert, container.firstChild);
        
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
    }

    function removeExistingAlerts() {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
    }

    // === INICIALIZAR MODAL Y CARRITO ===

    function initializeCart() {
        const carritoBtn = document.getElementById('carrito-btn');
        const carritoModal = document.getElementById('carrito-modal');
        const cerrarCarrito = document.getElementById('cerrar-carrito');
        const vaciarCarrito = document.getElementById('vaciar-carrito');
        const procederCompra = document.getElementById('proceder-compra');
        
        if (!carritoBtn || !carritoModal || !cerrarCarrito || !vaciarCarrito || !procederCompra) {
            log('Error: Uno o más elementos del modal del carrito no encontrados');
            return;
        }

        carritoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isCartButtonLocked) {
                return;
            }
            carritoModal.classList.add('show');
            setTimeout(() => {
                renderCartItems();
            }, 50);
        });

        cerrarCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            carritoModal.classList.remove('show');
        });

        carritoModal.addEventListener('click', (e) => {
            if (e.target === carritoModal) {
                carritoModal.classList.remove('show');
            }
        });

        vaciarCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            if (carrito.length > 0) {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    clearCart();
                }
            } else {
            }
        });

        procederCompra.addEventListener('click', (e) => {
            e.preventDefault();
            if (carrito.length > 0) {
                if (confirm('¿Deseas proceder con la compra? Se enviará el detalle de tu pedido a WhatsApp y se vaciará el carrito.')) {
                    const message = buildCartMessage();
                    sendToWhatsApp(message);
                    clearCart();
                    carritoModal.classList.remove('show');
                    showSuccess('¡Solicitud enviada! Te hemos redirigido a WhatsApp y tu carrito ha sido vaciado.');
                }
            } else {
            }
        });

        renderCartItems();
    }

    function initializeCartEvents() {
        document.addEventListener('click', (e) => {
            if (e.defaultPrevented) return;

            if (e.target.classList.contains('cantidad-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const index = parseInt(e.target.getAttribute('data-index'));
                if (isNaN(index) || index < 0 || index >= carrito.length) {
                    log('Error: data-index no válido para botón de cantidad');
                    return;
                }
                
                if (e.target.disabled) {
                    return;
                }
                
                if (e.target.classList.contains('menos')) {
                    handleQuantityChange(index, -1);
                } else if (e.target.classList.contains('mas')) {
                    handleQuantityChange(index, 1);
                }
                return;
            }
            
            if (e.target.closest('.eliminar-item')) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target.closest('.eliminar-item');
                const index = parseInt(button.getAttribute('data-index'));
                if (isNaN(index) || index < 0 || index >= carrito.length) {
                    log('Error: data-index no válido para botón eliminar');
                    return;
                }
                
                if (confirm('¿Eliminar este producto del carrito?')) {
                    removeFromCart(index);
                }
                return;
            }

            if (e.target.classList.contains('producto-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                if (e.target.disabled) {
                    return;
                }
                
                const productId = e.target.getAttribute('data-id');
                if (productId) {
                    
                    e.target.disabled = true;
                    const originalText = e.target.textContent;
                    const originalBackground = e.target.style.background;
                    
                    e.target.textContent = '¡Agregado!';
                    e.target.style.background = '#27ae60';
                    
                    addToCart(productId);
                    
                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.style.background = originalBackground;
                        e.target.disabled = false;
                        isCartButtonLocked = false;
                        updateCartButtonState(false);
                    }, 1300);
                }
                return;
            }
        });
    }

    // === INICIALIZACIÓN DE LA TIENDA ===
    
    try {
        loadProductos();
    } catch (error) {
        console.error('Error al inicializar funcionalidades:', error);
        log(`Error al inicializar: ${error.message}`);
    }
});