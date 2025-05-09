import { useEffect, useState } from "react";
import TrackingDataDisplay from "@/components/tracking/TrackingDataDisplay";
import TrackingControls from "@/components/tracking/TrackingControls";
import TrackingStatus from "@/components/tracking/TrackingStatus";
import { development } from "@/environments/development";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [trackingData, setTrackingData] = useState<{
    clicks: any[];
    scrolls: any[];
    timeOnPage: any[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrackingData = async () => {
      try {
        const res = await fetch(`${development.api_url}/heatmap/list`);
        if (!res.ok) throw new Error("Error fetching data");
        const json = await res.json();
        console.log({ json });
        setTrackingData(json.data.heatmaps[0]);
      } catch (err) {
        console.log("error", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-gray-500">Error: {error}</div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="space-y-8">
        {/* <TrackingControls
          trackingEnabled={trackingEnabled}
          setTrackingEnabled={setTrackingEnabled}
          heatmapLoaded={false}
          isInitializing={false}
        /> */}
        <TrackingDataDisplay
          trackingData={trackingData}
          setTrackingData={setTrackingData}
        />
      </div>
    </div>
  );
};

export default Index;
