import { useEffect, useState } from "react";
import TrackingDemo from "@/components/TrackingDemo";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [heatmapLoaded, setHeatmapLoaded] = useState(false);
  const [heatmapAttempts, setHeatmapAttempts] = useState(0);

  useEffect(() => {
    // Function to load heatmap.js with retry logic
    const loadHeatmapScript = () => {
      console.log(
        `Attempting to load heatmap.js (attempt ${heatmapAttempts + 1})`
      );

      // Create script element for heatmap.js
      const heatmapScript = document.createElement("script");
      heatmapScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/heatmap.js/2.0.0/heatmap.min.js";
      heatmapScript.async = true;

      // Handle successful load
      heatmapScript.onload = () => {
        console.log("Heatmap.js loaded successfully");
        setHeatmapLoaded(true);

        // Now load our tracking script that depends on heatmap.js
        const trackingScript = document.createElement("script");
        trackingScript.src = "/tracking-script.js";
        trackingScript.async = true;
        document.head.appendChild(trackingScript);

        trackingScript.onload = () => {
          console.log("Tracking script loaded successfully");
          toast({
            title: "Tracking Ready",
            description: "Tracking and heatmap functionality is now available",
          });
        };

        trackingScript.onerror = () => {
          console.error("Error loading tracking script");
          toast({
            title: "Error",
            description: "Failed to load tracking script",
            variant: "destructive",
          });
        };
      };

      // Handle load error with retry logic (up to 3 attempts)
      heatmapScript.onerror = () => {
        console.error(
          `Error loading heatmap.js (attempt ${heatmapAttempts + 1})`
        );

        if (heatmapAttempts < 2) {
          // Allow up to 3 attempts (0, 1, 2)
          setHeatmapAttempts((prev) => prev + 1);
          // Wait before retrying
          setTimeout(() => {
            document.head.removeChild(heatmapScript);
            loadHeatmapScript();
          }, 1500);
        } else {
          // Final failure after retry attempts
          toast({
            title: "Error",
            description:
              "Failed to load heatmap.js library after multiple attempts",
            variant: "destructive",
          });

          // Still load tracking script but without heatmap functionality
          const trackingScript = document.createElement("script");
          trackingScript.src = "/tracking-script.js";
          trackingScript.async = true;
          document.head.appendChild(trackingScript);

          // Mark as not loaded
          setHeatmapLoaded(false);
        }
      };

      // Append the script to head
      document.head.appendChild(heatmapScript);
    };

    // Start loading process
    loadHeatmapScript();

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll("script");
      scripts.forEach((script) => {
        if (
          script.src.includes("heatmap.js") ||
          script.src.includes("tracking-script.js")
        ) {
          script.parentNode?.removeChild(script);
        }
      });
    };
  }, [heatmapAttempts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Click-Scroll-Scribe
          </h1>
          <p className="text-gray-600">
            Tracking user interactions with heatmap visualization
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TrackingDemo heatmapLoaded={heatmapLoaded} />
      </main>

      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>
            © 2025 Click-Scroll-Scribe. Inspirado en herramientas como Hotjar.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
