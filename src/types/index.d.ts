
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
  };
}
