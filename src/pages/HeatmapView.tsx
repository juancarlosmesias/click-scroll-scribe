import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TrackingDemo from "@/components/TrackingDemo";

const percentClicks = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },

  { x: 39.06, y: 27.5 },
  { x: 50.0, y: 10.0 },
  { x: 10.5, y: 80.0 },
  { x: 39.06, y: 27.5 },
  { x: 50.0, y: 10.0 },
  { x: 10.5, y: 80.0 },

  { x: 100, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 0 },

  { x: 100, y: 100 },
  { x: 100, y: 100 },
  { x: 100, y: 100 },
  { x: 100, y: 100 },
  { x: 100, y: 100 },
  { x: 100, y: 100 },
  { x: 100, y: 100 },
];

const HeatmapView = () => {
  const containerRef = useRef(null);
  const heatmapRef = useRef(null);
  const [heatmapLoaded, setHeatmapLoaded] = useState(false);

  // Load heatmap.js
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/heatmap.js/2.0.0/heatmap.min.js";
    script.async = true;
    script.onload = () => setHeatmapLoaded(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!heatmapLoaded || !containerRef.current || !heatmapRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    console.log({ width, height });
    const heatmapInstance = window.h337.create({
      container: heatmapRef.current,
      radius: 20,
      maxOpacity: 0.6,
      minOpacity: 0.1,
      blur: 0.85,
    });

    const data = percentClicks.map((pt) => ({
      x: (pt.x / 100) * width,
      y: (pt.y / 100) * height,
      value: 1,
    }));

    heatmapInstance.setData({ max: 10, data });
  }, [heatmapLoaded]);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center overflow-hidden">
      <div
        className="h-screen w-[50%] relative"
        // ref={containerRef}
      >
        <img
          src="/heatmap-capture.png"
          alt="Heatmap Background"
          ref={containerRef}
          className="absolute inset-0 w-auto h-full object-contain z-0"
        />
        <div
          ref={heatmapRef}
          className="absolute inset-0 pointer-events-none z-10"
        />
      </div>
    </div>
  );
};

export default HeatmapView;
