import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReservationSummary from "@/components/ReservationSummary";
import RoomDetails from "@/components/RoomDetails";
import TransportCard from "@/components/TransportCard";
import StayInfo from "@/components/StayInfo";
import QuickActions from "@/components/QuickActions";
import WhatsAppButton from "@/components/WhatsAppButton";
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
      <div className="pt-2 space-y-2">
        <RoomDetails />
        <TransportCard />
      </div>
      <StayInfo />
      <QuickActions />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
