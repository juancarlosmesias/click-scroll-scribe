import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { development } from "@/environments/development";

interface TrackingDataDisplayProps {
  trackingData: {
    clicks: any[];
    scrolls: any[];
    timeOnPage: any[];
  } | null;
  setTrackingData: (
    data: {
      clicks: any[];
      scrolls: any[];
      timeOnPage: any[];
    } | null
  ) => void;
}

const TrackingDataDisplay = ({
  trackingData,
  setTrackingData,
}: TrackingDataDisplayProps) => {
  const clearTrackingData = async () => {
    localStorage.removeItem("trackingData");
    setTrackingData(null);
    try {
      const response = await fetch(`${development.api_url}/heatmap/clear`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error fetching data");
      toast({
        title: "Data Cleared",
        description: "All tracking data has been removed from local storage",
      });
      // window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting tracking data",
      });
    }
  };
  const handleRefresh = () => window.location.reload();

  return (
    <section className="space-y-4 px-5 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Tracking Data</h2>
        <div className="space-x-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-400 text-white rounded"
          >
            Refresh
          </button>
          <Button variant="destructive" onClick={clearTrackingData}>
            Clear Data
          </Button>
          <Button variant="secondary" className="bg-orange-500" asChild>
            <Link to="/heatmap">Heatmap</Link>
          </Button>
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
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(trackingData, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">
                  No tracking data available in localStorage
                </p>
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
                  Max scroll depth:{" "}
                  {trackingData?.scrolls?.length
                    ? Math.max(
                        ...trackingData.scrolls.map((s) => s.percentage)
                      ) + "%"
                    : "No data"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Time on Page</h3>
                <p className="text-gray-600">
                  Total time:{" "}
                  {trackingData?.timeOnPage?.length
                    ? Math.max(
                        ...trackingData.timeOnPage.map((t) => t.seconds)
                      ) + " seconds"
                    : "No data"}
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
