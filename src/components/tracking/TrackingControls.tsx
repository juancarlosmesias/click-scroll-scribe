import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface TrackingControlsProps {
  trackingEnabled: boolean;
  setTrackingEnabled: (enabled: boolean) => void;
  heatmapLoaded: boolean;
  isInitializing: boolean;
}

const TrackingControls = ({
  trackingEnabled,
  setTrackingEnabled,
  heatmapLoaded,
  isInitializing,
}: TrackingControlsProps) => {
  const toggleTracking = () => {
    if (!window.ClickScrollScribe) {
      toast({
        title: "Error",
        description: "Tracking script not yet initialized",
        variant: "destructive",
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

  return (
    <div className="flex items-center justify-center p-10 gap-2">
      {/* <Button
        variant={trackingEnabled ? "destructive" : "default"}
        onClick={toggleTracking}
        className="whitespace-nowrap"
      >
        {trackingEnabled ? "Disable Tracking" : "Enable Tracking"}
      </Button> */}

      <Button
        variant="outline"
        className="bg-orange-500"
        disabled={!heatmapLoaded || isInitializing}
        title={
          !heatmapLoaded
            ? "Heatmap library not loaded"
            : isInitializing
            ? "Initializing tracking system..."
            : ""
        }
        asChild
      >
        <Link to="/heatmap">Heatmap</Link>
      </Button>

      {/* <Button
        variant="outline"
        className="whitespace-nowrap bg-green-500"
        asChild
      >
        <Link to="/heatmap-data">Data</Link>
      </Button> */}

      {/* <Button
        variant="outline"
        className="whitespace-nowrap bg-blue-600"
        asChild
      >
        <Link to="/demo">Go demo</Link>
      </Button> */}
    </div>
  );
};

export default TrackingControls;
