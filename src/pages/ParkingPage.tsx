import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Car } from "lucide-react";
import patioImg from "@/assets/patio.jpg";

const ParkingPage = () => {
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      <Breadcrumb currentPage="Parking" />
      
      {/* Hero Image */}
      <div className="w-full h-56">
        <img 
          src={patioImg} 
          alt="Cour intérieure du Riad Massiba" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <Car className="w-6 h-6 text-accent flex-shrink-0" />
          <h1 className="text-xl font-bold text-foreground font-serif">
            Parking
          </h1>
        </div>

        {/* Content placeholder */}
        <article className="text-foreground leading-relaxed space-y-4">
          <p className="text-muted-foreground">
            Contenu à venir...
          </p>
        </article>
      </main>

      <div className="pb-10" />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ParkingPage;
