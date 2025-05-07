const CONFIG = {
  debounceTime: 200, // Tiempo para debouncing de clics (ms)
  batchInterval: 5000, // Intervalo para enviar datos agrupados (ms)
  apiEndpoint: "/api/track", // Endpoint de API ficticia
  scrollMilestones: [25, 50, 75, 100], // Hitos de scroll
  heatmapContainer: "body", // Contenedor para el heatmap
  heatmapRadius: 25, // Radio de los puntos en el heatmap
  heatmapMaxOpacity: 0.6, // Opacidad máxima del heatmap
};

// FUNCIONES PARA HEATMAP
function initHeatmap() {
  // Verificar si heatmap.js está cargado
  if (typeof h337 === "undefined") {
    console.warn("heatmap.js not loaded yet. Will retry in 1 second.");
    setTimeout(initHeatmap, 1000);
    return;
  }

  console.log("Initializing heatmap...");

  // Obtener el contenedor para el heatmap
  const container = document.querySelector(CONFIG.heatmapContainer);

  if (!container) {
    console.error("Heatmap container not found:", CONFIG.heatmapContainer);
    return;
  }

  // Crear instancia de heatmap
  heatmapInstance = h337.create({
    container: container,
    radius: CONFIG.heatmapRadius,
    maxOpacity: CONFIG.heatmapMaxOpacity,
    minOpacity: 0.05,
    blur: 0.85,
  });

  // Cargar datos existentes en el heatmap
  loadExistingClicksToHeatmap();

  // Exponer la instancia del heatmap para su uso desde la interfaz
  if (window.ClickScrollScribe) {
    window.ClickScrollScribe.heatmapInstance = heatmapInstance;
  }

  console.log("Heatmap initialized successfully");
}

// Cargar clics existentes en el heatmap
function loadExistingClicksToHeatmap() {
  if (!heatmapInstance || !trackingData.clicks.length) {
    return;
  }

  // Crear puntos para el heatmap
  const dataPoints = trackingData.clicks.map((click) => ({
    x: click.x,
    y: click.y,
    value: 1, // Valor de intensidad
  }));

  // Agregar puntos al heatmap
  heatmapInstance.addData(dataPoints);
}

// Actualizar heatmap con un nuevo clic
// function updateHeatmap(clickData) {
//   if (!heatmapInstance) {
//     return;
//   }

//   // Agregar punto al heatmap
//   heatmapInstance.addData({
//     x: clickData.x,
//     y: clickData.y,
//     value: 1, // Valor de intensidad
//   });
// }

// Mostrar/ocultar heatmap
// function toggleHeatmap(show) {
//   if (!heatmapInstance) {
//     return;
//   }

//   const heatmapContainer = document.querySelector("canvas.heatmap-canvas");
//   if (heatmapContainer) {
//     heatmapContainer.style.display = show ? "block" : "none";
//   }
// }

// Limpiar heatmap
function clearHeatmap() {
  if (!heatmapInstance) {
    return;
  }

  heatmapInstance.setData({
    max: 0,
    data: [],
  });
}

// Inicializar heatmap cuando la página esté completamente cargada
// if (document.readyState === "complete") {
//   initHeatmap();
// } else {
//   window.addEventListener("load", initHeatmap);
// }
