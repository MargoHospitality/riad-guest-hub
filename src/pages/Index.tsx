import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReservationSummary from "@/components/ReservationSummary";

import StayInfo from "@/components/StayInfo";
import QuickActions from "@/components/QuickActions";
import ContactSection from "@/components/ContactSection";

import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const { token, isLoadingValidation } = useApp();
  
  // Show loading screen while token is being validated
  if (token && isLoadingValidation) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <Header />
      <HeroSection />
      <ReservationSummary />
      <StayInfo />
      <QuickActions />
      <ContactSection />
      <Footer />
      
    </div>
  );
};

export default Index;
