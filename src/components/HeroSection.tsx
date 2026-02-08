import patioImg from "@/assets/patio.jpg";

const HeroSection = () => (
  <div className="relative w-full h-56 overflow-hidden">
    <img
      src={patioImg}
      alt="Riad Massiba courtyard"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
    <h1 className="absolute bottom-6 left-0 right-0 text-center text-primary-foreground text-xl font-semibold tracking-wide">
      Bienvenue au Riad Massiba
    </h1>
  </div>
);

export default HeroSection;
