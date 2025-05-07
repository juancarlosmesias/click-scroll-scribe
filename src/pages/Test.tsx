import { useState } from "react";

export default function Test() {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="p-4">
      <div className="mb-4 space-x-2">
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
      </div>

      <div
        className="transition-transform duration-300 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="w-64 h-64 bg-green-300 flex items-center justify-center">
          Contenido con Zoom
        </div>
      </div>
    </div>
  );
}
