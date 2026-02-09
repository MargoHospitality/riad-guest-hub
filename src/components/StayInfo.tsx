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
  FileText,
  UserCheck,
  Sparkles,
  ExternalLink
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  phone: Globe,
  user: PersonStanding,
  "user-check": UserCheck,
  utensils: UtensilsCrossed,
  heart: Heart,
  car: Car,
  wifi: Wifi,
  "map-pin": MapPin,
  "file-text": FileText,
  sparkles: Sparkles,
};

const StayInfo = () => {
  const { t } = useTranslation();
  const { data: pages, isLoading } = useQuery({
    queryKey: ["availablePages"],
    queryFn: () => fetchAvailablePages(),
    staleTime: 1000 * 60 * 60,
  });

  if (!pages || pages.length === 0) return null;

  const cardContent = (page: typeof pages[0], Icon: LucideIcon) => (
    <>
      <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <span className="text-[13px] font-medium text-foreground leading-tight text-center">
        {page.title}
      </span>
      {page.externalUrl && (
        <ExternalLink className="w-3 h-3 text-muted-foreground absolute top-2.5 right-2.5" />
      )}
    </>
  );

  return (
    <section className="px-4 pt-6 pb-2">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-foreground font-serif">
          {t('sections.prepareStay')}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      
      <div className="grid grid-cols-3 gap-2.5">
        {pages.map((page, index) => {
          const Icon = iconMap[page.icon] || FileText;

          if (page.externalUrl) {
            return (
              <a
                key={page.code}
                href={page.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col items-center justify-center bg-card rounded-2xl p-4 pt-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {cardContent(page, Icon)}
              </a>
            );
          }

          return (
            <Link
              key={page.code}
              to={page.route}
              className="relative flex flex-col items-center justify-center bg-card rounded-2xl p-4 pt-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {cardContent(page, Icon)}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default StayInfo;
