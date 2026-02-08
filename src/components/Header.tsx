import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import LanguageSelector from "./LanguageSelector";

const Header = () => (
  <header className="flex items-center justify-between px-4 py-3 bg-card">
    <button className="p-2 rounded-lg hover:bg-secondary">
      <Menu className="w-6 h-6 text-foreground" />
    </button>
    <Link to="/">
      <img src={logo} alt="Riad Massiba" className="h-12 object-contain hover:opacity-80 transition-opacity" />
    </Link>
    <LanguageSelector />
  </header>
);

export default Header;
