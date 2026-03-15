import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/contexts/AppContext";
import { analytics } from "@/lib/analytics";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReservationSummary from "@/components/ReservationSummary";
import CheckinCTA from "@/components/CheckinCTA";

import StayInfo from "@/components/StayInfo";
import QuickActions from "@/components/QuickActions";
import ContactSection from "@/components/ContactSection";

import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import ReservationLookup from "@/components/ReservationLookup";

const Index = () => {
  const { token, isLoadingValidation, validation } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Detect return from Margo Flow and invalidate cache
  useEffect(() => {
    const from = searchParams.get('from');
    if (from === 'margo-flow' && token) {
      console.log('[Index] Returned from Margo Flow - invalidating cache');

      // Track return from Margo Flow
      const transportStatus = searchParams.get('transport_status') || 'unknown';
      if (validation?.reservation?.property_id) {
        analytics.checkinMargoflowBack(validation.reservation.property_id, transportStatus);
      }

      // Invalidate check-in response cache to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['checkinResponse', token] });
      queryClient.invalidateQueries({ queryKey: ['transportStatus'] });
      
      // Clean URL (remove ?from=margo-flow parameter)
      const cleanParams = new URLSearchParams(searchParams);
      cleanParams.delete('from');
      navigate(`/?${cleanParams.toString()}`, { replace: true });
    }
  }, [searchParams, token, queryClient, navigate]);
  
  // Show loading screen while token is being validated
  if (token && isLoadingValidation) {
    return <LoadingScreen />;
  }
  
  // No token OR invalid token (validation failed) → show reservation lookup form
  if (!token || (!isLoadingValidation && !validation)) {
    // Clear invalid token from localStorage
    if (token && !validation) {
      localStorage.removeItem('guest_app_token');
    }
    return <ReservationLookup />;
  }
  
  // Token present → show guest app
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <Header />
      <HeroSection />
      <ReservationSummary />
      <CheckinCTA />
      <StayInfo />
      <QuickActions />
      <ContactSection />
      <Footer />
      
    </div>
  );
};

export default Index;
