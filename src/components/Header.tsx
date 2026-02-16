import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { withToken } from "@/lib/navigation";
import logoFallback from "@/assets/margo-logo-white.png";
import LanguageSwitcher from "./LanguageSwitcher";
import MenuDrawer from "./MenuDrawer";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { branding, token } = useApp();
  
  const logo = branding?.logo_url || logoFallback;
  const propertyName = branding?.property_name || "Guest App";

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-card">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-secondary"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
        <Link to={withToken("/", token)}>
          <img src={logo} alt={propertyName} className="h-12 object-contain hover:opacity-80 transition-opacity" />
        </Link>
        <LanguageSwitcher />
      </header>
      
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
