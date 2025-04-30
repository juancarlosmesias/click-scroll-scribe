
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import TrackingControls from "./tracking/TrackingControls";
import TrackingStatus from "./tracking/TrackingStatus";
import TrackingTestArea from "./tracking/TrackingTestArea";
import TrackingDataDisplay from "./tracking/TrackingDataDisplay";

interface TrackingDemoProps {
  heatmapLoaded?: boolean;
}

const TrackingDemo = ({ heatmapLoaded = false }: TrackingDemoProps) => {
  const [trackingData, setTrackingData] = useState<{
    clicks: any[];
    scrolls: any[];
    timeOnPage: any[];
  } | null>(null);

  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if tracking system is initialized
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
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-2xl font-semibold">Interactive Demo</h2>
          <TrackingControls 
            trackingEnabled={trackingEnabled}
            setTrackingEnabled={setTrackingEnabled}
            heatmapLoaded={heatmapLoaded}
            isInitializing={isInitializing}
          />
        </div>
        
        <TrackingStatus 
          isInitializing={isInitializing}
          heatmapLoaded={heatmapLoaded}
        />
        
        <Card className="p-6 space-y-4">
          <TrackingTestArea />
        </Card>
      </section>
      
      <TrackingDataDisplay 
        trackingData={trackingData}
        setTrackingData={setTrackingData}
      />
    </div>
  );
};

export default TrackingDemo;
