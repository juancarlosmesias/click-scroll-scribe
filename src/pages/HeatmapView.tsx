import { useEffect, useRef, useState } from "react";
import { development } from "@/environments/development";
import { extractPercentClicks } from "@/lib/heatmap";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const HeatmapView = () => {
  const containerRef = useRef(null);
  const heatmapRef = useRef(null);
  const imageRef = useRef(null);

  const [heatmapLoaded, setHeatmapLoaded] = useState(false);
  const [percentClicks, setPercentClicks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`${development.api_url}/heatmap/list`);
      if (!res.ok) throw new Error("Error fetching data");
      const json = await res.json();
      if (json.data.heatmaps.length > 0) {
        setPercentClicks(extractPercentClicks(json.data.heatmaps[0].clicks));
      } else {
        setError("There is no data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/heatmap.js/2.0.0/heatmap.min.js";
    script.async = true;
    script.onload = () => setHeatmapLoaded(true);
    document.head.appendChild(script);

    const stopTracking = () => {
      if (!window.ClickScrollScribe) {
        return;
      }
      window.ClickScrollScribe.disableTracking();
    };

    fetchData();
    stopTracking();

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (
      !heatmapLoaded ||
      !imageLoaded ||
      !containerRef.current ||
      !heatmapRef.current ||
      !percentClicks
    )
      return;

    const { width, height } = imageRef.current.getBoundingClientRect();

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
  }, [heatmapLoaded, imageLoaded, percentClicks]);

  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 10));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 1));
  const handleRefresh = () => window.location.reload();

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="relative w-screen h-screen flex justify-center items-center">
        <div className="mb-4 space-x-2 absolute top-4 right-4">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-400 text-white rounded"
          >
            Refresh
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            <Link to="/controls">Back</Link>
          </button>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      <div className="mb-4 space-x-2 absolute top-4 right-4">
        <button
          onClick={zoomIn}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Zoom In
        </button>
        <button
          onClick={zoomOut}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Zoom Out
        </button>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-400 text-white rounded"
        >
          Refresh
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          <Link to="/controls">Back</Link>
        </button>
      </div>
      <div
        className="h-screen w-[50%] relative transition-transform duration-300 origin-top"
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <img
          src="/heatmap-capture.png"
          alt="Heatmap Background"
          onLoad={() => setImageLoaded(true)}
          ref={imageRef}
          className="absolute inset-0 w-auto h-full object-contain z-0"
        />
        <div
          ref={heatmapRef}
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          style={{
            width: imageRef.current?.getBoundingClientRect().width || "100%",
            height: imageRef.current?.getBoundingClientRect().height || "100%",
          }}
        />
      </div>
    </div>
  );
};

export default HeatmapView;
