import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  X,
  Home,
  Globe,
  Star,
  Plane,
  PersonStanding,
  Leaf,
  Car,
  Wifi,
  MapPin,
  ChevronRight,
} from "lucide-react";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Accueil", path: "/", highlight: false },
  { icon: Globe, label: "Comment utiliser la Guest App", path: "/guide", highlight: false },
  { icon: Star, label: "Personnalisez votre séjour", path: "/checkin/step1", highlight: false },
  { icon: Plane, label: "Service de transport", path: "/transport", highlight: true },
  { icon: PersonStanding, label: "Check-In/Check-Out", path: "/checkin/guest-details", highlight: false },
  { icon: Leaf, label: "Bien-être & confort", path: "/wellness", highlight: false },
  { icon: Car, label: "Parking", path: "/parking", highlight: false },
  { icon: Wifi, label: "Se connecter au Wi-Fi", path: "/wifi", highlight: false },
  { icon: MapPin, label: "Carte/Itinéraire", path: "/map", highlight: false },
];

const MenuDrawer = ({ isOpen, onClose }: MenuDrawerProps) => {
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <span className="text-gray-400 text-base font-normal">Répertoire</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6 text-[#2C2C2C]" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="overflow-y-auto h-[calc(100%-73px)]">
          <ul className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center px-5 py-4 border-b border-gray-100 transition-colors ${
                      active
                        ? "bg-[#8B9B5A]/10 font-semibold"
                        : "hover:bg-[#8B9B5A]/5"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        item.highlight
                          ? "text-[#A04040]"
                          : "text-[#2C2C2C]"
                      }`}
                    />
                    <span
                      className={`ml-4 flex-1 text-[#2C2C2C] text-[15px] ${
                        active ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MenuDrawer;
