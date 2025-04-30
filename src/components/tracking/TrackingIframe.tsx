
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

const TrackingIframe = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Function to initialize iframe tracking
    const initIframeTracking = () => {
      if (!window.ClickScrollScribe || !iframeRef.current) return;

      try {
        // Get the iframe content window
        const iframe = iframeRef.current;
        const iframeWindow = iframe.contentWindow;
        
        if (!iframeWindow) return;

        // Wait for iframe to load before attempting to add event listeners
        iframe.addEventListener('load', () => {
          console.log('Iframe loaded, initializing tracking');
          
          // Inject tracking into iframe
          if (iframeWindow.document) {
            // Pass parent ClickScrollScribe to iframe
            iframeWindow.parentTracker = window.ClickScrollScribe;
            
            // Inject a small script to relay events back to parent
            const script = iframeWindow.document.createElement('script');
            script.textContent = `
              (function() {
                // Track clicks within the iframe
                document.addEventListener('click', function(event) {
                  if (window.parentTracker) {
                    // Calculate position relative to the iframe
                    const rect = event.currentTarget.getBoundingClientRect();
                    const iframeRect = frameElement.getBoundingClientRect();
                    
                    // Create a custom event with iframe data
                    const customEvent = {
                      x: event.clientX + iframeRect.left,
                      y: event.clientY + iframeRect.top,
                      pageX: event.pageX + iframeRect.left,
                      pageY: event.pageY + iframeRect.top,
                      element: {
                        tag: event.target.tagName.toLowerCase(),
                        identifier: 'iframe-element',
                        fullSelector: 'iframe > ' + event.target.tagName.toLowerCase()
                      },
                      timestamp: new Date().toISOString(),
                      source: 'iframe'
                    };
                    
                    // Send to parent tracker
                    window.parent.postMessage({
                      type: 'iframe-click',
                      data: customEvent
                    }, '*');
                  }
                }, { passive: true });
              })();
            `;
            
            try {
              iframeWindow.document.head.appendChild(script);
              console.log('Tracking script injected into iframe');
            } catch (err) {
              console.error('Failed to inject tracking into iframe:', err);
            }
          }
        });
      } catch (error) {
        console.error('Error setting up iframe tracking:', error);
      }
    };

    // Initialize iframe tracking
    const timeoutId = setTimeout(initIframeTracking, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">External Content (iframe)</h3>
      <p className="text-gray-600">
        This iframe loads external content. Clicks inside this iframe will also be tracked.
      </p>
      
      <Card className="overflow-hidden">
        <iframe 
          ref={iframeRef}
          src="https://example.com" 
          className="w-full h-[300px] border-0"
          title="External Content"
          sandbox="allow-same-origin allow-scripts"
        />
      </Card>
      <p className="text-sm text-gray-500">
        Note: iframe tracking only works when the external site allows embedding and cross-origin access.
      </p>
    </div>
  );
};

export default TrackingIframe;
