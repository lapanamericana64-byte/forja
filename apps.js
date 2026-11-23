/*
 * Catálogo de apps de Forja.
 * Para añadir una app nueva: copia un bloque { ... }, cambia los datos y pon sus imágenes en img/.
 * "descarga" puede ser un archivo de la carpeta descargas/ o un enlace (por ejemplo a GitHub Releases).
 */
window.APPS = [
  {
    id: "pulso",
    nombre: "Pulso",
    lema: "Tu música y tus vídeos, sin anuncios.",
    descripcion:
      "Un reproductor para la música y los vídeos que ya tienes en el móvil. La música sigue sonando con la pantalla apagada y se controla desde la notificación y los auriculares. Los vídeos se ven a pantalla completa con gestos, y Pulso recuerda el segundo exacto donde dejaste cada canción y cada vídeo.",
    funciones: [
      "Suena en segundo plano y en la pantalla de bloqueo",
      "Canciones, álbumes, artistas, carpetas y listas propias",
      "Favoritos, cola editable, aleatorio y repetir",
      "Vídeos con «Seguir viendo», gestos de brillo, volumen y avance, y ventana flotante",
      "Velocidad, subtítulos y pista de audio en los vídeos",
      "Temporizador para dormir",
      "Abre audios y vídeos desde WhatsApp o Archivos",
    ],
    icono: "img/icono-pulso.png",
    colores: ["#19E3A1", "#0EA5E9", "#7C3AED"],
    capturas: [
      { src: "img/pulso-canciones.jpg", alt: "Lista de canciones de Pulso con el mini reproductor abajo" },
      { src: "img/pulso-videos.jpg", alt: "Sección de vídeos con «Seguir viendo» y la lista de vídeos" },
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
    descarga: "https://github.com/lapanamericana64-byte/forja/releases/download/descargador-v1.2/Descargador.apk",
    peso: "72 MB",
    version: "1.2",
    requisitos: "Android 10 o superior",
    aviso: "Descarga solo contenido que tengas derecho a guardar.",
    novedades: ["El aviso de versión nueva es más fiable con datos móviles"],
  },
  {
    id: "folio",
    nombre: "Folio",
    lema: "Escanea papeles a PDF, sin anuncios.",
    descripcion:
      "Haces una foto a una factura, un recibo o un contrato y Folio recorta la hoja, la endereza y la guarda en PDF. Además lee el texto, así que luego encuentras cualquier documento buscando lo que dice.",
    funciones: [
      "Detecta los bordes de la hoja y la deja como escaneada",
      "Varias páginas en un mismo PDF",
      "Lee el texto sin internet: búscalo, cópialo o compártelo",
      "Comparte el PDF por WhatsApp o guárdalo en Descargas",
      "Importa fotos que ya tengas en la galería",
    ],
    icono: "img/icono-folio.png",
    colores: ["#FFB547", "#FF7A3D", "#FFD166"],
    capturas: [
      { src: "img/folio-documentos.jpg", alt: "Lista de documentos escaneados con sus miniaturas" },
      { src: "img/folio-documento.jpg", alt: "Un contrato abierto con sus páginas y los botones Compartir y Guardar" },
      { src: "img/folio-busqueda.jpg", alt: "Búsqueda que encuentra un recibo por una palabra de su texto" },
    ],
    descarga: "https://github.com/lapanamericana64-byte/forja/releases/download/folio-v1.0/Folio.apk",
    peso: "3,4 MB",
    version: "1.0",
    requisitos: "Android 10 o superior, con Google Play Services",
    novedades: ["Primera versión"],
  },
  {
    id: "cuentas",
    nombre: "Cuentas",
    lema: "Para saber a dónde se va el dinero.",
    descripcion:
      "Apunta tus gastos e ingresos en pesos en un par de toques y ve el resumen del mes: cuánto entró, cuánto salió y en qué categoría se te fue más. Todo se queda en tu teléfono: funciona sin internet, sin registrarte y sin anuncios.",
    funciones: [
      "Balance del mes con ingresos y gastos",
      "Gastos por categoría, de mayor a menor, con su porcentaje",
      "Movimientos agrupados por día; tócalos para editar o borrar",
      "Categorías propias además de las de siempre",
      "Pasa de un mes a otro para comparar",
    ],
    icono: "img/icono-cuentas.png",
    colores: ["#2BD19A", "#12B886", "#0B8F6A"],
    capturas: [
      { src: "img/cuentas-mes.jpg", alt: "Resumen del mes con el balance y los gastos por categoría" },
      { src: "img/cuentas-apuntar.jpg", alt: "Formulario para apuntar un gasto con monto, categoría y nota" },
      { src: "img/cuentas-movimientos.jpg", alt: "Lista de movimientos agrupados por día" },
    ],
    descarga: "https://github.com/lapanamericana64-byte/forja/releases/download/cuentas-v1.0/Cuentas.apk",
    peso: "2,3 MB",
    version: "1.0",
    requisitos: "Android 10 o superior",
    novedades: ["Primera versión"],
  },
];

/* Ideas en camino. Se muestran sin botón de descarga. Deja la lista vacía para ocultar la sección. */
window.EN_EL_TALLER = [];
