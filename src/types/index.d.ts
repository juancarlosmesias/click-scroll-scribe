
interface Window {
  h337?: any;
  heatmapjsLoaded?: boolean;
  disableTracking?: boolean;
  consentGiven?: boolean;
  parentTracker?: any;
  ClickScrollScribe?: {
    disableTracking: () => void;
    enableTracking: () => void;
    isEnabled: () => boolean;
    showHeatmap: () => void;
    hideHeatmap: () => void;
    clearHeatmap: () => void;
    heatmapInstance?: any;
  };
}
