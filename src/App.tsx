import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import "@/i18n/config";
import Index from "./pages/Index";
import GuidePage from "./pages/GuidePage";
import CheckinInfoPage from "./pages/CheckinInfoPage";
import RestaurationPage from "./pages/RestaurationPage";
import WellnessPage from "./pages/WellnessPage";
import ParkingPage from "./pages/ParkingPage";
import WifiPage from "./pages/WifiPage";
import CheckinTransport from "./pages/CheckinTransport";
import CheckinGuestDetails from "./pages/CheckinGuestDetails";
import CheckinRestauration from "./pages/CheckinRestauration";
import CheckinBedding from "./pages/CheckinBedding";
import CheckinOtherRequests from "./pages/CheckinOtherRequests";
import DynamicContentPage from "./components/DynamicContentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/checkin-info" element={<CheckinInfoPage />} />
            <Route path="/restauration" element={<RestaurationPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            <Route path="/parking" element={<ParkingPage />} />
            <Route path="/wifi" element={<WifiPage />} />
            <Route path="/checkin/step1" element={<CheckinTransport />} />
            <Route path="/checkin/guest-details" element={<CheckinGuestDetails />} />
            <Route path="/checkin/step3" element={<CheckinRestauration />} />
            <Route path="/checkin/step4" element={<CheckinBedding />} />
            <Route path="/checkin/step5" element={<CheckinOtherRequests />} />
            {/* Dynamic custom pages from GEA (e.g. /page/how-to-use) */}
            <Route path="/page/:pageCode" element={<DynamicContentPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
