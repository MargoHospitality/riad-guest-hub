import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReservationSummary from "@/components/ReservationSummary";
import RoomDetails from "@/components/RoomDetails";
import TransportCard from "@/components/TransportCard";
import StayInfo from "@/components/StayInfo";
import QuickActions from "@/components/QuickActions";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background max-w-md mx-auto">
    <Header />
    <HeroSection />
    <ReservationSummary />
    <RoomDetails />
    <TransportCard />
    <StayInfo />
    <QuickActions />
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
