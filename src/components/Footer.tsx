import margoLogo from "@/assets/margo-hospitality-white.png";

const Footer = () => (
  <footer className="bg-primary px-4 py-6 text-center">
    <p className="text-white text-sm mb-3">
      Riad Massiba est un membre honorable de Margo Hospitality
    </p>
    <img 
      src={margoLogo} 
      alt="Margo Hospitality" 
      className="h-6 mx-auto opacity-90"
    />
  </footer>
);

export default Footer;
