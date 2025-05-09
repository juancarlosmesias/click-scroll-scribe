import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HeatmapView from "./pages/HeatmapView";
import NotFound from "./pages/NotFound";
import HeatmapViewData from "./pages/HeatmapViewData";
import Demo from "./pages/Demo";
import Test from "./pages/Test";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/demo" element={<Demo />} />
            <Route path="/controls" element={<Index />} />
            <Route path="/heatmap" element={<HeatmapView />} />
            <Route path="/heatmap-data" element={<HeatmapViewData />} />
            <Route path="/test" element={<Test />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
