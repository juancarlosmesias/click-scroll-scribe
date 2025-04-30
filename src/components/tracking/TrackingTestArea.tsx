
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TrackingIframe from "./TrackingIframe";

const TrackingTestArea = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Test Tracking Features</h3>
      <p className="text-gray-600">
        Click around this demo area to generate click events. Scroll down to trigger scroll depth tracking.
        Your time on page is being measured automatically.
      </p>
      
      <div className="flex flex-wrap gap-3 py-4">
        <Button id="cta-button" className="bg-blue-500 hover:bg-blue-600">Primary CTA</Button>
        <Button variant="outline" className="border-green-500 text-green-500">Secondary Action</Button>
        <Button variant="ghost" className="text-red-500">Tertiary Link</Button>
      </div>
      
      {/* Add the iframe component */}
      <TrackingIframe />
      
      <div className="h-[500px] overflow-y-auto border rounded-md p-4 bg-gray-50">
        <h4 className="text-lg font-medium mb-3">Scroll Area (Test Scroll Tracking)</h4>
        <p className="mb-8">Scroll down to reach different scroll depth milestones (25%, 50%, 75%, 100%).</p>
        
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="mb-16">
            <h5 className="font-medium">Section {i + 1}</h5>
            <p className="text-gray-600">
              This is a section of content to help test scroll tracking. Keep scrolling to trigger 
              the scroll depth tracking at various percentage points.
            </p>
            <Separator className="my-4" />
          </div>
        ))}
        
        <div className="text-center py-4">
          <p className="font-medium">You've reached the bottom! (100% scroll)</p>
        </div>
      </div>
    </div>
  );
};

export default TrackingTestArea;
