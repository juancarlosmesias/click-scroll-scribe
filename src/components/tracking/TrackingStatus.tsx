import { AlertCircle, CheckCircle } from "lucide-react";

interface TrackingStatusProps {
  isInitializing: boolean;
  heatmapLoaded: boolean;
}

const TrackingStatus = ({
  isInitializing,
  heatmapLoaded,
}: TrackingStatusProps) => {
  if (isInitializing) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-md">
        <p className="text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Initializing tracking system, please wait...
        </p>
      </div>
    );
  }

  if (!heatmapLoaded) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md">
        <p className="text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Heatmap functionality is not available - the library failed to load
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md">
      <p className="text-sm flex items-center">
        <CheckCircle className="h-4 w-4 mr-2" />
        Heatmap functionality is ready to use
      </p>
    </div>
  );
};

export default TrackingStatus;
