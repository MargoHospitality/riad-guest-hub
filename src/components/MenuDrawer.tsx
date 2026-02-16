import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import { usePages } from "@/hooks/usePages";
import { withToken } from "@/lib/navigation";
import {
  X,
  Home,
  Globe,
  PersonStanding,
  UtensilsCrossed,
  Leaf,
  Car,
  Wifi,
  MapPin,
  ChevronRight,
  FileText,
  UserCheck,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map icon names from API to Lucide components
const iconMap: Record<string, LucideIcon> = {
  'home': Home,
  'globe': Globe,
  'file-text': FileText,
  'user-check': UserCheck,
  'sparkles': Sparkles,
  'person-standing': PersonStanding,
  'utensils': UtensilsCrossed,
  'leaf': Leaf,
  'car': Car,
  'wifi': Wifi,
  'map-pin': MapPin,
};

const MenuDrawer = ({ isOpen, onClose }: MenuDrawerProps) => {
  const { t, i18n } = useTranslation();
  const { token } = useApp();
  const { data: pages, isLoading: isLoadingPages } = usePages();
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Build menu items from dynamic pages
  const menuItems = pages && pages.length > 0 ? [
    // Always show Home first
    { icon: Home, title: t('menu.home'), path: "/" },
    // Add dynamic pages
    ...pages.map(page => ({
      icon: iconMap[page.icon] || FileText, // Fallback to FileText if icon not found
      title: i18n.language === 'fr' ? page.title_fr : page.title_en,
      path: page.route,
    })),
  ] : [
    // Fallback menu if pages not loaded
    { icon: Home, title: t('menu.home'), path: "/" },
    { icon: FileText, title: t('menu.howToUse'), path: "/guide" },
    { icon: UserCheck, title: t('menu.checkinCheckout'), path: "/checkin-info" },
    { icon: UtensilsCrossed, title: t('menu.restaurant'), path: "/restauration" },
    { icon: Sparkles, title: t('menu.wellness'), path: "/wellness" },
    { icon: Car, title: t('menu.parking'), path: "/parking" },
    { icon: Wifi, title: t('menu.wifi'), path: "/wifi" },
    { icon: MapPin, title: t('menu.map'), path: "/location" },
  ];

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
        className={`fixed bottom-0 left-0 right-0 h-[85%] max-h-[600px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out rounded-t-2xl ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <span className="text-gray-400 text-base font-normal">{t('menu.title')}</span>
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
              const active = item.path ? isActive(item.path) : false;
              
              const content = (
                <>
                  <Icon className="w-5 h-5 flex-shrink-0 text-[#A04040]" />
                  <span
                    className={`ml-4 flex-1 text-[#2C2C2C] text-[15px] ${
                      active ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {item.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </>
              );

              return (
                <li key={index}>
                  <Link
                    to={withToken(item.path || "/", token)}
                    onClick={onClose}
                    className={`flex items-center px-5 py-4 border-b border-gray-100 transition-colors ${
                      active
                        ? "bg-[#8B9B5A]/10 font-semibold"
                        : "hover:bg-[#8B9B5A]/5"
                    }`}
                  >
                    {content}
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
