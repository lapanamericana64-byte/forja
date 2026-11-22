/*
 * Catálogo de apps de Forja.
 * Para añadir una app nueva: copia un bloque { ... }, cambia los datos y pon sus imágenes en img/.
 * "descarga" puede ser un archivo de la carpeta descargas/ o un enlace (por ejemplo a GitHub Releases).
 */
window.APPS = [
  {
    id: "pulso",
    nombre: "Pulso",
    lema: "Tu música, sin anuncios.",
    descripcion:
      "Un reproductor para la música que ya tienes en el móvil. Sigue sonando con la pantalla apagada, se controla desde la notificación y los auriculares, y recuerda la canción y el segundo exacto donde lo dejaste.",
    funciones: [
      "Suena en segundo plano y en la pantalla de bloqueo",
      "Canciones, álbumes, artistas, carpetas y listas propias",
      "Favoritos, cola editable, aleatorio y repetir",
      "Temporizador para dormir",
      "Abre audios desde WhatsApp o Archivos",
    ],
    icono: "img/icono-pulso.png",
    colores: ["#19E3A1", "#0EA5E9", "#7C3AED"],
    capturas: [
      { src: "img/pulso-canciones.jpg", alt: "Lista de canciones de Pulso con el mini reproductor abajo" },
      { src: "img/pulso-reproductor.jpg", alt: "Reproductor a pantalla completa con carátula y controles" },
      { src: "img/pulso-albumes.jpg", alt: "Cuadrícula de álbumes" },
    ],
    descarga: "https://github.com/lapanamericana64-byte/forja/releases/download/pulso-v1.2/Pulso.apk",
    peso: "3,7 MB",
    version: "1.2",
    requisitos: "Android 10 o superior",
    novedades: ["El aviso de versión nueva es más fiable con datos móviles"],
  },
  {
    id: "descargador",
    nombre: "Descargador",
    lema: "Guarda vídeos, canciones y GIFs.",
    descripcion:
      "Pega o comparte un enlace de YouTube o de X y elige si quieres el vídeo o solo el audio. También convierte un trozo de cualquier vídeo en GIF, con texto encima si quieres.",
    funciones: [
      "Vídeo en la calidad que elijas o solo el audio en MP3",
      "Vídeos y GIFs de X (Twitter)",
      "Creador de GIFs: eliges el trozo en una línea de tiempo",
      "Compartir un enlace desde otra app lo abre directo",
      "Todo se guarda en Descargas/Descargador",
    ],
    icono: "img/icono-descargador.png",
    colores: ["#FF3B47", "#FF7A3D", "#9B4DFF"],
    capturas: [
      { src: "img/descargador-youtube.jpg", alt: "Pantalla de descarga con una barra de progreso" },
      { src: "img/descargador-gif.jpg", alt: "Creador de GIFs con la línea de tiempo" },
      { src: "img/descargador-x.jpg", alt: "Pantalla de X con un GIF descargado" },
    ],
    descarga: "https://github.com/lapanamericana64-byte/forja/releases/download/descargador-v1.1/Descargador.apk",
    peso: "72 MB",
    version: "1.1",
    requisitos: "Android 10 o superior",
    aviso: "Descarga solo contenido que tengas derecho a guardar.",
    novedades: ["Avisa cuando hay una versión nueva y se actualiza desde la propia app"],
  },
];

/* Ideas en camino. Se muestran sin botón de descarga. Deja la lista vacía para ocultar la sección. */
window.EN_EL_TALLER = [];
