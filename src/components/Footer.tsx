import margoLogo from "@/assets/margo-hospitality-white.png";

const Footer = () => (
  <footer className="bg-primary px-4 py-3 text-center">
    <p className="text-white text-sm mb-2">
      Riad Massiba est un membre honorable de{" "}
      <a 
        href="https://www.margo-hospitality.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="underline hover:opacity-80"
      >
        Margo Hospitality
      </a>
    </p>
    <a 
      href="https://www.margo-hospitality.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block hover:opacity-80"
    >
      <img 
        src={margoLogo} 
        alt="Margo Hospitality" 
        className="h-5 mx-auto opacity-90"
      />
    </a>
  </footer>
);

export default Footer;
