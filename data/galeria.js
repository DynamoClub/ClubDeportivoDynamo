// data/galeria.js
const galeriaData = [
    {
        "id": 49,
        "type": "image",
        "src": "../public/img/galeria/49.jpg",
        "alt": "Dynamo Recuerdos: Victoria Dynamo, en Torneo Nacional Sub 15",
        "title": "Torneo nacional sub-15" 
    },
    {
        "id": 50,
        "type": "image",
        "src": "../public/img/galeria/50.jpg",
        "alt": "Dynamo Recuerdos: Victoria Dynamo, en Competencia BOM BOM BUM",
        "title": "Competencia: BOM BOM BUM Sub-9A" 
    },
    {
        "id": 51,
        "type": "image",
        "src": "../public/img/galeria/51.jpg",
        "alt": "Dynamo Recuerdos: Victoria Dynamo, Sub-14 Division B",
        "title": "Victoria Sub-14, División B" 
    },

    // Agrega más elementos aquí siguiendo el mismo patrón
    // Para agregar una nueva imagen:
    // {
    //     id: NUMERO_UNICO,
    //     type: 'image',
    //     src: 'ruta/a/tu/imagen.jpg',
    //     alt: 'Descripción de la imagen',
    //     orientation: 'horizontal' o 'vertical',
    //     title: 'Título de la imagen'
    // }
    
    // Para agregar un nuevo video:
    // {
    //     id: NUMERO_UNICO,
    //     type: 'video',
    //     src: {
    //         mp4: 'ruta/a/tu/video.mp4',
    //         webm: 'ruta/a/tu/video.webm'
    //     },
    //     poster: 'ruta/a/thumbnail.jpg',
    //     orientation: 'horizontal' o 'vertical',
    //     title: 'Título del video'
    // }
];

// Exportar los datos para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = galeriaData;
}