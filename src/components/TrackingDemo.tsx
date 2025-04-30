import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle } from "lucide-react";

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
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const toggleTracking = () => {
    if (!window.ClickScrollScribe) {
      toast({
        title: "Error",
        description: "Tracking script not yet initialized",
        variant: "destructive"
      });
      return;
    }
    
    if (trackingEnabled) {
      window.ClickScrollScribe.disableTracking();
    } else {
      window.ClickScrollScribe.enableTracking();
    }
    
    setTrackingEnabled(!trackingEnabled);
    
    toast({
      title: trackingEnabled ? "Tracking Disabled" : "Tracking Enabled",
      description: trackingEnabled 
        ? "User interactions are no longer being tracked" 
        : "Now tracking clicks, scrolls, and time on page",
    });
  };

  const toggleHeatmap = () => {
    if (!window.ClickScrollScribe) {
      toast({
        title: "Error",
        description: "Tracking script not yet initialized",
        variant: "destructive"
      });
      return;
    }
    
    if (!heatmapLoaded) {
      toast({
        title: "Error",
        description: "Heatmap library not loaded",
        variant: "destructive"
      });
      return;
    }
    
    const newVisibility = !heatmapVisible;
    try {
      if (newVisibility) {
        window.ClickScrollScribe.showHeatmap();
        toast({
          title: "Heatmap Visible",
          description: "Click heatmap is now displayed",
        });
      } else {
        window.ClickScrollScribe.hideHeatmap();
        toast({
          title: "Heatmap Hidden",
          description: "Click heatmap is now hidden",
        });
      }
      setHeatmapVisible(newVisibility);
    } catch (error) {
      console.error("Error toggling heatmap:", error);
      toast({
        title: "Error",
        description: "Failed to toggle heatmap visibility",
        variant: "destructive"
      });
    }
  };

  const clearHeatmap = () => {
    if (!window.ClickScrollScribe) {
      toast({
        title: "Error",
        description: "Tracking script not yet initialized",
        variant: "destructive"
      });
      return;
    }
    
    try {
      window.ClickScrollScribe.clearHeatmap();
      toast({
        title: "Heatmap Cleared",
        description: "Click heatmap data has been reset",
      });
    } catch (error) {
      console.error("Error clearing heatmap:", error);
      toast({
        title: "Error",
        description: "Failed to clear heatmap data",
        variant: "destructive"
      });
    }
  };

  const clearTrackingData = () => {
    localStorage.removeItem("trackingData");
    setTrackingData(null);
    clearHeatmap();
    
    toast({
      title: "Data Cleared",
      description: "All tracking data has been removed from local storage",
    });
  };

  const loadTrackingData = () => {
    const data = localStorage.getItem("trackingData");
    if (data) {
      setTrackingData(JSON.parse(data));
      toast({
        title: "Data Refreshed",
        description: "Tracking data has been updated from local storage",
      });
    } else {
      toast({
        title: "No Data",
        description: "No tracking data found in local storage",
        variant: "default"
      });
    }
  };

  // Check if heatmap is available after script initialization
  useEffect(() => {
    const checkHeatmapAvailability = () => {
      // If we've detected script loading is complete
      if (window.ClickScrollScribe && isInitializing) {
        setIsInitializing(false);
        
        // Verify if heatmap functionality is actually available
        if (heatmapLoaded) {
          try {
            // Test heatmap functions
            if (typeof window.ClickScrollScribe.showHeatmap === 'function' && 
                typeof window.ClickScrollScribe.hideHeatmap === 'function') {
              console.log("Heatmap functionality verified");
            } else {
              console.error("Heatmap functions missing from ClickScrollScribe object");
            }
          } catch (error) {
            console.error("Error verifying heatmap functionality:", error);
          }
        }
      }
    };
    
    // Check every second for 10 seconds
    const intervalId = setInterval(checkHeatmapAvailability, 1000);
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setIsInitializing(false);
    }, 10000);
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [heatmapLoaded, isInitializing]);

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
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-2xl font-semibold">Interactive Demo</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={trackingEnabled ? "destructive" : "default"}
              onClick={toggleTracking}
              className="whitespace-nowrap"
            >
              {trackingEnabled ? "Disable Tracking" : "Enable Tracking"}
            </Button>
            
            <Button 
              variant={heatmapVisible ? "secondary" : "outline"}
              onClick={toggleHeatmap}
              disabled={!heatmapLoaded || isInitializing}
              className="whitespace-nowrap"
              title={!heatmapLoaded ? "Heatmap library not loaded" : 
                    isInitializing ? "Initializing tracking system..." : ""}
            >
              {heatmapVisible ? "Hide Heatmap" : "Show Heatmap"}
            </Button>
          </div>
        </div>
        
        {isInitializing ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-md">
            <p className="text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Initializing tracking system, please wait...
            </p>
          </div>
        ) : !heatmapLoaded ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md">
            <p className="text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Heatmap functionality is not available - the library failed to load
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md">
            <p className="text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Heatmap functionality is ready to use
            </p>
          </div>
        )}
        
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
        
        <Tabs defaultValue="data" className="w-full">
          <TabsList>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data">
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
          </TabsContent>
          
          <TabsContent value="stats">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Click Statistics</h3>
                  <p className="text-gray-600">
                    {trackingData?.clicks?.length || 0} click events recorded
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Scroll Statistics</h3>
                  <p className="text-gray-600">
                    Max scroll depth: {
                      trackingData?.scrolls?.length 
                        ? Math.max(...trackingData.scrolls.map(s => s.percentage)) + '%'
                        : 'No data'
                    }
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Time on Page</h3>
                  <p className="text-gray-600">
                    Total time: {
                      trackingData?.timeOnPage?.length 
                        ? Math.max(...trackingData.timeOnPage.map(t => t.seconds)) + ' seconds'
                        : 'No data'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default TrackingDemo;
