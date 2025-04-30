
interface TrackingData {
  clicks: ClickEvent[];
  scrolls: ScrollEvent[];
  timeOnPage: TimeEvent[];
}

interface ClickEvent {
  x: number;
  y: number;
  pageX: number;
  pageY: number;
  element: ElementInfo;
  timestamp: string;
}

interface ElementInfo {
  tag: string;
  identifier: string;
  fullSelector: string;
}

interface ScrollEvent {
  percentage: number;
  timestamp: string;
}

interface TimeEvent {
  seconds: number;
  finalVisit?: boolean;
  timestamp: string;
}

interface Window {
  disableTracking?: boolean;
  consentGiven?: boolean;
  ClickScrollScribe?: {
    disableTracking: () => void;
    enableTracking: () => void;
    isEnabled: () => boolean;
    showHeatmap: () => void;
    hideHeatmap: () => void;
    clearHeatmap: () => void;
    heatmapInstance?: any;
  };
  h337?: {
    create: (config: HeatmapConfig) => HeatmapInstance;
  };
}

// Declaración para heatmap.js global
declare const h337: {
  create: (config: HeatmapConfig) => HeatmapInstance;
};

interface HeatmapConfig {
  container: HTMLElement;
  radius?: number;
  maxOpacity?: number;
  minOpacity?: number;
  blur?: number;
  gradient?: Record<string, string>;
  backgroundColor?: string;
}

interface HeatmapInstance {
  addData: (data: HeatmapPoint | HeatmapPoint[]) => void;
  setData: (data: { max: number; data: HeatmapPoint[] }) => void;
  getData: () => { max: number; data: HeatmapPoint[] };
  repaint: () => void;
}

interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}
