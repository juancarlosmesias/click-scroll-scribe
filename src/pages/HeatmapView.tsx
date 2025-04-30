import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TrackingDemo from "@/components/TrackingDemo";

const HeatmapView = () => {
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
            if (document.head.contains(heatmapScript)) {
              document.head.removeChild(heatmapScript);
            }
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
          // const trackingScript = document.createElement("script");
          // trackingScript.src = "/tracking-script.js";
          // trackingScript.async = true;
          // document.head.appendChild(trackingScript);

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
          script.src.includes("heatmap.js")
          //  || script.src.includes("tracking-script.js")
        ) {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        }
      });
    };
  }, [heatmapAttempts]);

  // const [heatmapLoaded, setHeatmapLoaded] = useState(false);
  // const [isInitializing, setIsInitializing] = useState(true);

  // useEffect(() => {
  //   // Check if heatmap.js is already loaded
  //   if (window.h337) {
  //     setHeatmapLoaded(true);
  //     setIsInitializing(false);

  //     // Show heatmap on page load
  //     if (window.ClickScrollScribe) {
  //       try {
  //         window.ClickScrollScribe.showHeatmap();
  //         console.log("Heatmap displayed automatically");
  //       } catch (error) {
  //         console.error("Error displaying heatmap:", error);
  //         toast({
  //           title: "Error",
  //           description: "Failed to display heatmap visualization",
  //           variant: "destructive",
  //         });
  //       }
  //     }
  //   } else {
  //     // Wait for the scripts to load
  //     const checkInterval = setInterval(() => {
  //       if (window.h337 && window.ClickScrollScribe) {
  //         setHeatmapLoaded(true);
  //         setIsInitializing(false);

  //         try {
  //           window.ClickScrollScribe.showHeatmap();
  //           console.log("Heatmap displayed after initialization");
  //         } catch (error) {
  //           console.error("Error displaying heatmap:", error);
  //         }

  //         clearInterval(checkInterval);
  //       }
  //     }, 1000);

  //     // Clear interval after 10 seconds to avoid memory leaks
  //     setTimeout(() => {
  //       clearInterval(checkInterval);
  //       if (!heatmapLoaded) {
  //         setIsInitializing(false);
  //         toast({
  //           title: "Error",
  //           description: "Heatmap could not be initialized",
  //           variant: "destructive",
  //         });
  //       }
  //     }, 10000);

  //     return () => clearInterval(checkInterval);
  //   }

  //   // Cleanup - hide heatmap when leaving page
  //   return () => {
  //     if (window.ClickScrollScribe) {
  //       try {
  //         window.ClickScrollScribe.hideHeatmap();
  //       } catch (error) {
  //         console.error("Error hiding heatmap on unmount:", error);
  //       }
  //     }
  //   };
  // }, [heatmapLoaded]);

  // const clearHeatmap = () => {
  //   if (!window.ClickScrollScribe) {
  //     toast({
  //       title: "Error",
  //       description: "Tracking script not yet initialized",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //     window.ClickScrollScribe.clearHeatmap();
  //     toast({
  //       title: "Heatmap Cleared",
  //       description: "Click heatmap data has been reset",
  //     });
  //   } catch (error) {
  //     console.error("Error clearing heatmap:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to clear heatmap data",
  //       variant: "destructive",
  //     });
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Heatmap Visualization
          </h1>
          <p className="text-gray-600">View your user interaction heatmap</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tracking Demo
            </Link>
          </Button>

          <Button
            variant="destructive"
            // onClick={clearHeatmap}
          >
            Clear Heatmap Data
          </Button>
        </div>
        <TrackingDemo heatmapLoaded={heatmapLoaded} />
      </main>

      {/* {isInitializing ? (
          <Card className="p-6 text-center">
            <p>Initializing heatmap visualization...</p>
          </Card>
        ) : !heatmapLoaded ? (
          <Card className="p-6 text-center bg-amber-50 border-amber-200">
            <p className="text-amber-800">
              Heatmap functionality is not available. Please return to the main
              page and ensure the heatmap library loads correctly.
            </p>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">Click Heatmap</h2>
              <p className="text-gray-600">
                Areas with more clicks appear in red/yellow, areas with fewer
                clicks in blue/green
              </p>
            </div>

            <div id="heatmap-container" className="min-h-[600px]">
              {/* The heatmap will be rendered here by the tracking script */}
      {/* </div>
          </Card>
        )} 
       </main> */}

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

export default HeatmapView;
