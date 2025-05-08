import { useEffect, useState } from "react";
import TrackingDataDisplay from "@/components/tracking/TrackingDataDisplay";
import TrackingControls from "@/components/tracking/TrackingControls";
import TrackingStatus from "@/components/tracking/TrackingStatus";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [trackingData, setTrackingData] = useState<{
    clicks: any[];
    scrolls: any[];
    timeOnPage: any[];
  } | null>(null);

  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const stopTracking = () => {
      if (!window.ClickScrollScribe) {
        toast({
          title: "Error",
          description: "Tracking script not yet initialized",
          variant: "destructive",
        });
        return;
      }
      window.ClickScrollScribe.disableTracking();

      toast({
        title: "Tracking Disabled",
        description: "Now tracking clicks, scrolls, and time on page",
      });
    };

    stopTracking();
  }, []);

  useEffect(() => {
    const checkAvailability = () => {
      // If tracking script is loaded
      if (window.ClickScrollScribe && isInitializing) {
        setIsInitializing(false);
      }
    };

    // Check every second for 10 seconds
    const intervalId = setInterval(checkAvailability, 1000);
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setIsInitializing(false);
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isInitializing]);

  useEffect(() => {
    // Check tracking status on component mount
    setTrackingEnabled(!window.disableTracking);

    // Load initial data
    const loadTrackingData = () => {
      const data = localStorage.getItem("trackingData");
      if (data) {
        setTrackingData(JSON.parse(data));
      }
    };

    loadTrackingData();

    // Set up interval to refresh data
    const intervalId = setInterval(loadTrackingData, 2000);

    return () => clearInterval(intervalId);
  }, []);
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

      {/* <main className="container mx-auto px-4 py-8">
        <TrackingDemo heatmapLoaded={false} />
      </main> */}

      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-2xl font-semibold">Interactive Demo</h2>
            <TrackingControls
              trackingEnabled={trackingEnabled}
              setTrackingEnabled={setTrackingEnabled}
              heatmapLoaded={false}
              isInitializing={isInitializing}
            />
          </div>

          <TrackingStatus
            isInitializing={isInitializing}
            heatmapLoaded={false}
          />

          {/* <Card className="p-6 space-y-4">
            <TrackingTestArea />
          </Card> */}
        </section>

        <TrackingDataDisplay
          trackingData={trackingData}
          setTrackingData={setTrackingData}
        />
      </div>

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
