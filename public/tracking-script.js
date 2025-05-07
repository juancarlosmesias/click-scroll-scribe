/**
 * Click-Scroll-Scribe: Un script para rastreo de interacciones de usuario
 * Inspirado en herramientas como Hotjar, pero sin dependencias externas
 * Con integración de heatmap.js para visualización de clics
 *
 * Funcionalidades implementadas:
 * 1. Rastreo de clics con debouncing y visualización heatmap
 * 2. Seguimiento de profundidad de scroll (25%, 50%, 75%, 100%)
 * 3. Medición de tiempo en página
 */

(function () {
  "use strict";

  // Comprobación de consentimiento (simulado)
  if (typeof window.consentGiven === "boolean" && !window.consentGiven) {
    console.log("Tracking disabled: User consent not provided");
    return;
  }

  // Estructura de datos para almacenar eventos
  let trackingData = {
    clicks: [],
    scrolls: [],
    timeOnPage: [],
  };

  // Variables de configuración
  const CONFIG = {
    debounceTime: 200, // Tiempo para debouncing de clics (ms)
    batchInterval: 5000, // Intervalo para enviar datos agrupados (ms)
    apiEndpoint: "/api/track", // Endpoint de API ficticia
    scrollMilestones: [25, 50, 75, 100], // Hitos de scroll
  };

  // Referencia al heatmap
  // let heatmapInstance = null;

  // Variables de control
  let lastClickTime = 0;
  let pageEntryTime = Date.now();
  let reachedScrollMilestones = {};
  let sendDataTimeout = null;

  // Inicializar los datos del localStorage si existen
  function initTrackingData() {
    const storedData = localStorage.getItem("trackingData");
    if (storedData) {
      try {
        trackingData = JSON.parse(storedData);
      } catch (e) {
        console.error("Error parsing stored tracking data:", e);
        trackingData = { clicks: [], scrolls: [], timeOnPage: [] };
      }
    }
  }

  // Guardar datos en localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem("trackingData", JSON.stringify(trackingData));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      // Manejo de error si localStorage está lleno
      if (e.name === "QuotaExceededError") {
        // Limpiamos los datos más antiguos
        pruneOldData();
        try {
          localStorage.setItem("trackingData", JSON.stringify(trackingData));
        } catch (innerError) {
          console.error("Still unable to save data after pruning:", innerError);
        }
      }
    }
  }

  // Eliminar datos antiguos si localStorage está lleno
  function pruneOldData() {
    // Reducir a la mitad los clics (los más antiguos)
    if (trackingData.clicks.length > 20) {
      trackingData.clicks = trackingData.clicks.slice(
        Math.floor(trackingData.clicks.length / 2)
      );
    }

    // Reducir scrolls si hay muchos
    if (trackingData.scrolls.length > 20) {
      trackingData.scrolls = trackingData.scrolls.slice(
        Math.floor(trackingData.scrolls.length / 2)
      );
    }

    // Reducir registros de tiempo en página
    if (trackingData.timeOnPage.length > 10) {
      trackingData.timeOnPage = trackingData.timeOnPage.slice(
        Math.floor(trackingData.timeOnPage.length / 2)
      );
    }
  }

  // Enviar datos a la API (agrupados)
  function sendDataToAPI() {
    // Cancelar el timeout existente si hay uno
    if (sendDataTimeout) {
      clearTimeout(sendDataTimeout);
    }

    // Si el tracking está desactivado, no enviar datos
    if (window.disableTracking) {
      return;
    }

    // Si no hay datos para enviar, programar el próximo envío y retornar
    if (
      trackingData.clicks.length === 0 &&
      trackingData.scrolls.length === 0 &&
      trackingData.timeOnPage.length === 0
    ) {
      sendDataTimeout = setTimeout(sendDataToAPI, CONFIG.batchInterval);
      return;
    }

    // Clonar los datos para enviar
    const dataToSend = JSON.parse(JSON.stringify(trackingData));

    // Intentar enviar los datos a la API
    fetch(CONFIG.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: dataToSend,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
      // Usar keepalive para asegurar que la solicitud se complete
      // incluso si la página se está descargando
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.status);
        }
        return response.json();
      })
      .then(() => {
        // Éxito - podríamos limpiar los datos enviados, pero los mantenemos para demo
        console.log("Tracking data sent successfully");
      })
      .catch((error) => {
        console.error("Error sending tracking data:", error);
        // No limpiamos los datos para reintentar en el próximo envío
      })
      .finally(() => {
        // Programar el próximo envío de datos
        sendDataTimeout = setTimeout(sendDataToAPI, CONFIG.batchInterval);
      });
  }

  // 1. RASTREO DE CLICS Y GENERACIÓN DE HEATMAP
  function trackClicks() {
    document.addEventListener(
      "click",
      function (event) {
        // Verificar si el tracking está desactivado
        if (window.disableTracking) {
          return;
        }

        const currentTime = Date.now();

        // Implementar debouncing para evitar múltiples clics accidentales
        if (currentTime - lastClickTime < CONFIG.debounceTime) {
          return;
        }

        lastClickTime = currentTime;

        // Obtener información del elemento clicado
        const target = event.target;
        const elementInfo = getElementInfo(target);

        // Obtener el percente of clicks

        const totalHeight =
          document.documentElement.scrollHeight || window.innerHeight;
        const xPercent = (event.pageX / window.innerWidth) * 100;
        const yPercent = (event.pageY / totalHeight) * 100;

        // Registrar datos del clic
        const clickData = {
          x: event.clientX,
          y: event.clientY,
          xPercent: Number(xPercent.toFixed(2)),
          yPercent: Number(yPercent.toFixed(2)),
          pageX: event.pageX,
          pageY: event.pageY,
          element: elementInfo,
          timestamp: new Date().toISOString(),
        };

        // Agregar a los datos de tracking
        trackingData.clicks.push(clickData);

        // Guardar en localStorage
        saveToLocalStorage();

        // Actualizar heatmap si está inicializado
        // updateHeatmap(clickData);
      },
      { passive: true }
    );
  }

  // Obtener información útil sobre el elemento
  function getElementInfo(element) {
    if (!element || !(element instanceof Element)) {
      return "unknown";
    }

    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const classList = Array.from(element.classList)
      .map((c) => `.${c}`)
      .join("");
    const text = element.textContent
      ? element.textContent.trim().substring(0, 20)
      : "";

    return {
      tag: tagName,
      identifier: id || classList || text || tagName,
      fullSelector: getFullSelector(element),
    };
  }

  // Construir un selector CSS para el elemento
  function getFullSelector(element, maxDepth = 3) {
    if (!element || !(element instanceof Element)) {
      return "unknown";
    }

    let selector = "";
    let currentElement = element;
    let depth = 0;

    while (
      currentElement &&
      currentElement !== document.body &&
      depth < maxDepth
    ) {
      let currentSelector = currentElement.tagName.toLowerCase();

      if (currentElement.id) {
        currentSelector += `#${currentElement.id}`;
      } else if (currentElement.classList.length > 0) {
        const classes = Array.from(currentElement.classList).join(".");
        currentSelector += `.${classes}`;
      }

      selector = selector
        ? `${currentSelector} > ${selector}`
        : currentSelector;
      currentElement = currentElement.parentElement;
      depth++;
    }

    return selector;
  }

  // 2. SEGUIMIENTO DE SCROLL
  function trackScrollDepth() {
    // Inicializar los hitos alcanzados
    CONFIG.scrollMilestones.forEach((milestone) => {
      reachedScrollMilestones[milestone] = false;
    });

    // Función para calcular el porcentaje de scroll
    function getScrollPercentage() {
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const trackLength = docHeight - windowHeight;

      return trackLength > 0 ? Math.floor((scrollTop / trackLength) * 100) : 0;
    }

    // Manejar evento de scroll con throttling para mejor rendimiento
    let scrollTimeout;
    window.addEventListener(
      "scroll",
      function () {
        // Verificar si el tracking está desactivado
        if (window.disableTracking) {
          return;
        }

        // Throttling para mejor rendimiento
        if (scrollTimeout) {
          return;
        }

        scrollTimeout = setTimeout(function () {
          scrollTimeout = null;

          const scrollPercentage = getScrollPercentage();

          // Verificar cada hito
          CONFIG.scrollMilestones.forEach((milestone) => {
            if (
              scrollPercentage >= milestone &&
              !reachedScrollMilestones[milestone]
            ) {
              reachedScrollMilestones[milestone] = true;

              // Registrar el evento de scroll
              const scrollData = {
                percentage: milestone,
                timestamp: new Date().toISOString(),
              };

              trackingData.scrolls.push(scrollData);
              saveToLocalStorage();
            }
          });
        }, 100);
      },
      { passive: true }
    );
  }

  // 3. TIEMPO DE PERMANENCIA
  function trackTimeOnPage() {
    // Registrar la entrada a la página
    pageEntryTime = Date.now();

    // Función para calcular el tiempo en la página
    function calculateTimeOnPage() {
      const currentTime = Date.now();
      const timeSpentSeconds = Math.floor((currentTime - pageEntryTime) / 1000);

      return timeSpentSeconds;
    }

    // Actualizar el tiempo en la página periódicamente
    function updateTimeOnPage() {
      // Verificar si el tracking está desactivado
      if (window.disableTracking) {
        return;
      }

      const timeSpentSeconds = calculateTimeOnPage();

      // Registrar el tiempo en la página cada 30 segundos
      if (timeSpentSeconds % 30 === 0 && timeSpentSeconds > 0) {
        const timeData = {
          seconds: timeSpentSeconds,
          timestamp: new Date().toISOString(),
        };

        trackingData.timeOnPage.push(timeData);
        saveToLocalStorage();
      }
    }

    // Actualizar tiempo cada segundo
    setInterval(updateTimeOnPage, 1000);

    // Registrar tiempo final cuando el usuario abandona la página
    window.addEventListener("beforeunload", function () {
      // Verificar si el tracking está desactivado
      if (window.disableTracking) {
        return;
      }

      const timeSpentSeconds = calculateTimeOnPage();

      // Solo guardar si pasó al menos 1 segundo
      if (timeSpentSeconds > 0) {
        const timeData = {
          seconds: timeSpentSeconds,
          finalVisit: true,
          timestamp: new Date().toISOString(),
        };

        trackingData.timeOnPage.push(timeData);
        saveToLocalStorage();

        // Envío síncrono para capturar los datos antes de que se cierre la página
        // Usando el API de Beacon para mejor compatibilidad
        const finalData = JSON.stringify({
          data: trackingData,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          event: "page_exit",
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon(CONFIG.apiEndpoint, finalData);
        }
      }
    });
  }

  // 4. TRACKING IN IFRAMES
  function setupIframeTracking() {
    // Listen for messages from iframes
    window.addEventListener("message", function (event) {
      // Verify the event type
      if (event.data && event.data.type === "iframe-click") {
        // Process iframe click event
        const clickData = event.data.data;

        // Verify tracking is enabled
        if (window.disableTracking) {
          return;
        }

        // Add source information to identify iframe clicks in data
        clickData.source = "iframe";

        // Add to tracking data
        trackingData.clicks.push(clickData);

        // Save to localStorage
        saveToLocalStorage();

        // Update heatmap if initialized
        updateHeatmap(clickData);

        console.log("Tracked click from iframe:", clickData);
      }
    });
  }

  // Inicializar el rastreador
  function initTracker() {
    console.log("Initializing Click-Scroll-Scribe tracking with heatmap...");

    // Cargar datos existentes de localStorage
    initTrackingData();

    // Iniciar los módulos de rastreo
    trackClicks();
    trackScrollDepth();
    trackTimeOnPage();
    setupIframeTracking();

    // Configurar envío periódico de datos
    sendDataTimeout = setTimeout(sendDataToAPI, CONFIG.batchInterval);

    // Exponer API pública para activar/desactivar el tracking
    window.ClickScrollScribe = {
      disableTracking: function () {
        window.disableTracking = true;
        console.log("Tracking disabled");
      },
      enableTracking: function () {
        window.disableTracking = false;
        console.log("Tracking enabled");
      },
      isEnabled: function () {
        return !window.disableTracking;
      },
      // showHeatmap: function () {
      //   toggleHeatmap(true);
      // },
      // hideHeatmap: function () {
      //   toggleHeatmap(false);
      // },
      // clearHeatmap: clearHeatmap,
    };

    // Verificar si hay una configuración global para desactivar el tracking
    if (window.disableTracking) {
      console.log(
        "Tracking initialized but disabled due to window.disableTracking setting"
      );
    } else {
      console.log("Tracking initialized and active");
    }
  }

  // Una vez que el DOM está listo, inicializar el rastreador
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTracker);
  } else {
    initTracker();
  }
})();
