import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAvailablePages } from "@/lib/api";
import { 
  Globe, 
  PersonStanding, 
  UtensilsCrossed, 
  Heart, 
  Car, 
  Wifi, 
  MapPin, 
  ChevronRight,
  FileText
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  phone: Globe,
  user: PersonStanding,
  utensils: UtensilsCrossed,
  heart: Heart,
  car: Car,
  wifi: Wifi,
  "map-pin": MapPin,
};

const StayInfo = () => {
  const { data: pages, isLoading } = useQuery({
    queryKey: ["availablePages"],
    queryFn: () => fetchAvailablePages(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Don't render section if no pages configured
  if (!pages || pages.length === 0) {
    return null;
  }

  return (
    <section className="px-4 pb-6">
      <h2 className="text-xl font-bold text-foreground mb-4 font-serif">
        Préparez votre séjour
      </h2>
      <div className="flex flex-col">
        {pages.map((page) => {
          const Icon = iconMap[page.icon] || FileText;
          
          return (
            <Link
              key={page.code}
              to={page.route}
              className="flex items-center gap-4 py-3.5 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors -mx-1 px-1 rounded"
            >
              <Icon className="w-5 h-5 text-accent shrink-0" />
              <span className="flex-1 text-left text-foreground">{page.title}</span>
              <ChevronRight className="w-4 h-4 text-accent" />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default StayInfo;
