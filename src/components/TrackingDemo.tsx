
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const TrackingDemo = () => {
  const [trackingData, setTrackingData] = useState<{
    clicks: any[];
    scrolls: any[];
    timeOnPage: any[];
  } | null>(null);

  const [trackingEnabled, setTrackingEnabled] = useState(true);

  const toggleTracking = () => {
    window.disableTracking = !window.disableTracking;
    setTrackingEnabled(!window.disableTracking);
  };

  const clearTrackingData = () => {
    localStorage.removeItem("trackingData");
    setTrackingData(null);
  };

  const loadTrackingData = () => {
    const data = localStorage.getItem("trackingData");
    if (data) {
      setTrackingData(JSON.parse(data));
    }
  };

  useEffect(() => {
    // Check tracking status on component mount
    setTrackingEnabled(!window.disableTracking);
    
    // Load initial data
    loadTrackingData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(loadTrackingData, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Interactive Demo</h2>
          <Button 
            variant={trackingEnabled ? "destructive" : "default"}
            onClick={toggleTracking}
          >
            {trackingEnabled ? "Disable Tracking" : "Enable Tracking"}
          </Button>
        </div>
        
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-medium">Test Tracking Features</h3>
          <p className="text-gray-600">
            Click around this demo area to generate click events. Scroll down to trigger scroll depth tracking.
            Your time on page is being measured automatically.
          </p>
          
          <div className="flex flex-wrap gap-3 py-4">
            <Button id="cta-button" className="bg-blue-500 hover:bg-blue-600">Primary CTA</Button>
            <Button variant="outline" className="border-green-500 text-green-500">Secondary Action</Button>
            <Button variant="ghost" className="text-red-500">Tertiary Link</Button>
          </div>
          
          <div className="h-[500px] overflow-y-auto border rounded-md p-4 bg-gray-50">
            <h4 className="text-lg font-medium mb-3">Scroll Area (Test Scroll Tracking)</h4>
            <p className="mb-8">Scroll down to reach different scroll depth milestones (25%, 50%, 75%, 100%).</p>
            
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="mb-16">
                <h5 className="font-medium">Section {i + 1}</h5>
                <p className="text-gray-600">
                  This is a section of content to help test scroll tracking. Keep scrolling to trigger 
                  the scroll depth tracking at various percentage points.
                </p>
                <Separator className="my-4" />
              </div>
            ))}
            
            <div className="text-center py-4">
              <p className="font-medium">You've reached the bottom! (100% scroll)</p>
            </div>
          </div>
        </Card>
      </section>
      
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tracking Data</h2>
          <div className="space-x-2">
            <Button variant="outline" onClick={loadTrackingData}>Refresh Data</Button>
            <Button variant="destructive" onClick={clearTrackingData}>Clear Data</Button>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="p-4 bg-gray-100 border-b">
            <h3 className="font-medium">LocalStorage Data Preview</h3>
          </div>
          
          <ScrollArea className="h-[400px] p-4">
            {trackingData ? (
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(trackingData, null, 2)}</pre>
            ) : (
              <p className="text-gray-500 italic">No tracking data available in localStorage</p>
            )}
          </ScrollArea>
        </Card>
      </section>
    </div>
  );
};

export default TrackingDemo;
