
import { useEffect } from "react";
import TrackingDemo from "@/components/TrackingDemo";

const Index = () => {
  useEffect(() => {
    // Load our tracking script dynamically
    const script = document.createElement("script");
    script.src = "/tracking-script.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Click-Scroll-Scribe</h1>
          <p className="text-gray-600">Tracking user interactions without external dependencies</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TrackingDemo />
      </main>

      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2025 Click-Scroll-Scribe. Inspirado en herramientas como Hotjar.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
