
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

interface TrackingDataDisplayProps {
  trackingData: {
    clicks: any[];
    scrolls: any[];
    timeOnPage: any[];
  } | null;
  setTrackingData: (data: {
    clicks: any[];
    scrolls: any[];
    timeOnPage: any[];
  } | null) => void;
}

const TrackingDataDisplay = ({ trackingData, setTrackingData }: TrackingDataDisplayProps) => {
  const clearTrackingData = () => {
    localStorage.removeItem("trackingData");
    setTrackingData(null);
    
    if (window.ClickScrollScribe) {
      try {
        window.ClickScrollScribe.clearHeatmap();
      } catch (error) {
        console.error("Error clearing heatmap:", error);
      }
    }
    
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

  return (
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
  );
};

export default TrackingDataDisplay;
