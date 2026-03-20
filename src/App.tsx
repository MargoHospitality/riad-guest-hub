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
import CheckinGate from "./pages/CheckinGate";
import CheckinGuestDetails from "./pages/CheckinGuestDetails";
import CheckinRestaurant from "./pages/CheckinRestaurant";
import CheckinBedding from "./pages/CheckinBedding";
import CheckinOther from "./pages/CheckinOther";
import CheckinSuccess from "./pages/CheckinSuccess";
import CheckinTransport from "./pages/CheckinTransport";
import ReviewPage from "./pages/ReviewPage";
import DynamicContentPage from "./components/DynamicContentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/checkin-info" element={<CheckinInfoPage />} />
            <Route path="/restauration" element={<RestaurationPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            <Route path="/parking" element={<ParkingPage />} />
            <Route path="/wifi" element={<WifiPage />} />
            <Route path="/checkin/gate" element={<CheckinGate />} />
            <Route path="/checkin/transport" element={<CheckinTransport />} />
            <Route path="/checkin/guest-details" element={<CheckinGuestDetails />} />
            <Route path="/checkin/restaurant" element={<CheckinRestaurant />} />
            <Route path="/checkin/bedding" element={<CheckinBedding />} />
            <Route path="/checkin/other" element={<CheckinOther />} />
            <Route path="/checkin/success" element={<CheckinSuccess />} />
            {/* Legacy routes (kept for backward compatibility) */}
            <Route path="/checkin/step3" element={<CheckinRestaurant />} />
            <Route path="/checkin/step4" element={<CheckinBedding />} />
            <Route path="/checkin/step5" element={<CheckinOther />} />
            {/* Review form */}
            <Route path="/review" element={<ReviewPage />} />
            {/* Dynamic custom pages from GEA (e.g. /page/how-to-use) */}
            <Route path="/page/:pageCode" element={<DynamicContentPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
