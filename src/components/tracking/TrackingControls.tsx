import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { development } from "@/environments/development";

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

  const captureScreen = () => {
    const element = document.getElementById("root");
    html2canvas(element).then((canvas) => {
      const enlace = document.createElement("a");
      enlace.href = canvas.toDataURL("image/png");
      enlace.download = "captura.png";
      enlace.click();
    });
  };

  const sendData = async () => {
    const storedData = localStorage.getItem("trackingData");
    if (storedData) {
      try {
        const response = await fetch(
          ` ${development.api_url}/heatmap/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: storedData,
          }
        );

        if (!response.ok) {
          console.log("Error");
          toast({
            title: "Success",
            description: "Error",
          });
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        await response.json();
        toast({
          title: "Success",
          description: "Send correctly",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: JSON.stringify(error),
        });
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={trackingEnabled ? "destructive" : "default"}
        onClick={toggleTracking}
        className="whitespace-nowrap"
      >
        {trackingEnabled ? "Disable Tracking" : "Enable Tracking"}
      </Button>

      <Button onClick={captureScreen} className="whitespace-nowrap">
        Capture screen
      </Button>

      <Button onClick={sendData} className="whitespace-nowrap">
        Send data
      </Button>

      <Button
        variant="outline"
        className="whitespace-nowrap"
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
        <Link to="/heatmap">View Heatmap</Link>
      </Button>
    </div>
  );
};

export default TrackingControls;
