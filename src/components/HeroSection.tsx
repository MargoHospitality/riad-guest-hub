import { useApp } from "@/contexts/AppContext";
import patioImgFallback from "@/assets/patio.jpg";

const HeroSection = () => {
  const { branding } = useApp();
  
  const heroImage = branding?.background_image_url || patioImgFallback;
  const propertyName = branding?.property_name || "Riad Massiba";

  return (
    <div className="relative w-full h-56 overflow-hidden">
      <img
        src={heroImage}
        alt={`${propertyName} courtyard`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      <h1 className="absolute bottom-6 left-0 right-0 text-center text-primary-foreground text-xl font-semibold tracking-wide">
        Bienvenue au {propertyName}
      </h1>
    </div>
  );
};

export default HeroSection;
