import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";

const HeroSection = () => {
  const { t } = useTranslation();
  const { branding } = useApp();
  
  const heroImage = branding?.background_image_url;
  const propertyName = branding?.property_name || "Guest App";

  return (
    <div className="relative w-full h-64 overflow-hidden">
      {heroImage ? (
        <img
          src={heroImage}
          alt={`${propertyName}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-10">
        <p className="text-primary-foreground/70 text-xs font-medium tracking-widest uppercase mb-1">
          {t('hero.welcomeLabel', 'Bienvenue')}
        </p>
        <h1 className="text-primary-foreground text-2xl font-serif leading-tight">
          {propertyName}
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
