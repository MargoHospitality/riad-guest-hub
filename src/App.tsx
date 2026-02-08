import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GuidePage from "./pages/GuidePage";
import CheckinTransport from "./pages/CheckinTransport";
import CheckinGuestDetails from "./pages/CheckinGuestDetails";
import CheckinRestauration from "./pages/CheckinRestauration";
import CheckinBedding from "./pages/CheckinBedding";
import CheckinOtherRequests from "./pages/CheckinOtherRequests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/checkin/step1" element={<CheckinTransport />} />
          <Route path="/checkin/guest-details" element={<CheckinGuestDetails />} />
          <Route path="/checkin/step3" element={<CheckinRestauration />} />
          <Route path="/checkin/step4" element={<CheckinBedding />} />
          <Route path="/checkin/step5" element={<CheckinOtherRequests />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
