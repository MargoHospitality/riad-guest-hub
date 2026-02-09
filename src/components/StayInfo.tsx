import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { data: pages, isLoading } = useQuery({
    queryKey: ["availablePages"],
    queryFn: () => fetchAvailablePages(),
    staleTime: 1000 * 60 * 60,
  });

  if (!pages || pages.length === 0) return null;

  return (
    <section className="px-4 pt-4 pb-2">
      <h2 className="text-lg font-bold text-foreground mb-3 font-serif">
        {t('sections.prepareStay')}
      </h2>
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        {pages.map((page, index) => {
          const Icon = iconMap[page.icon] || FileText;
          const isLast = index === pages.length - 1;

          if (page.externalUrl) {
            return (
              <a
                key={page.code}
                href={page.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors ${
                  !isLast ? 'border-b border-border' : ''
                }`}
              >
                <Icon className="w-4.5 h-4.5 text-accent shrink-0" />
                <span className="flex-1 text-sm text-foreground">{page.title}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </a>
            );
          }

          return (
            <Link
              key={page.code}
              to={page.route}
              className={`flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors ${
                !isLast ? 'border-b border-border' : ''
              }`}
            >
              <Icon className="w-4.5 h-4.5 text-accent shrink-0" />
              <span className="flex-1 text-sm text-foreground">{page.title}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default StayInfo;
