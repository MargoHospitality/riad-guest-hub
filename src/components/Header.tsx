import { Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => (
  <header className="flex items-center justify-between px-4 py-3 bg-card">
    <button className="p-2 rounded-lg hover:bg-secondary">
      <Menu className="w-6 h-6 text-foreground" />
    </button>
    <Link to="/">
      <img src={logo} alt="Riad Massiba" className="h-12 object-contain hover:opacity-80 transition-opacity" />
    </Link>
    <button className="p-2 rounded-lg hover:bg-secondary">
      <User className="w-6 h-6 text-foreground" />
    </button>
  </header>
);

export default Header;
