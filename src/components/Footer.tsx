import margoLogo from "@/assets/margo-hospitality-white.png";

const Footer = () => {
  return (
    <footer className="bg-primary mt-auto">
      <div className="flex items-center justify-center gap-2 px-4 py-4">
        <span className="text-primary-foreground/70 text-xs">Powered by</span>
        <a 
          href="https://www.margo-hospitality.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src={margoLogo} 
            alt="Margo Hospitality" 
            className="h-4 opacity-90"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
