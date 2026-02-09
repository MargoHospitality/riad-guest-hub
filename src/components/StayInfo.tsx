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

  const renderItem = (page: typeof pages[0], index: number) => {
    const Icon = iconMap[page.icon] || FileText;
    const isExternal = !!page.externalUrl;

    const content = (
      <div className="flex items-center gap-4 px-4 py-4 group-hover:bg-secondary/40 transition-colors duration-200">
        <div className="w-10 h-10 rounded-xl bg-accent/8 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors duration-200">
          <Icon className="w-[18px] h-[18px] text-accent" />
        </div>
        <span className="flex-1 text-[14px] font-medium text-foreground">{page.title}</span>
        {isExternal ? (
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
        )}
      </div>
    );

    if (isExternal) {
      return (
        <a
          key={page.code}
          href={page.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          {content}
          {index < pages.length - 1 && <div className="mx-14 h-px bg-border/60" />}
        </a>
      );
    }

    return (
      <Link key={page.code} to={page.route} className="group block">
        {content}
        {index < pages.length - 1 && <div className="mx-14 h-px bg-border/60" />}
      </Link>
    );
  };

  return (
    <section className="px-4 pt-6 pb-2">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1 h-5 rounded-full bg-accent" />
        <h2 className="text-lg font-bold text-foreground font-serif tracking-tight">
          {t('sections.prepareStay')}
        </h2>
      </div>
      
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        {pages.map((page, index) => renderItem(page, index))}
      </div>
    </section>
  );
};

export default StayInfo;
