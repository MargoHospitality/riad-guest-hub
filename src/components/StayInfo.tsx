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
  const { t, i18n } = useTranslation();
  const { data: pages, isLoading } = useQuery({
    queryKey: ["availablePages", i18n.language],
    queryFn: () => fetchAvailablePages(undefined, i18n.language),
    staleTime: 1000 * 60 * 60,
  });

  if (!pages || pages.length === 0) return null;

  const renderItem = (page: typeof pages[0], index: number) => {
    const Icon = iconMap[page.icon] || FileText;
    const isExternal = !!page.externalUrl;
    
    // Use language-specific title
    const pageTitle = i18n.language === 'en' ? page.title_en : page.title_fr;

    const content = (
      <div className="flex items-center gap-3 px-4 py-3 group-hover:bg-secondary/40 transition-colors duration-200">
        <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors duration-200">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <span className="flex-1 text-sm font-medium text-foreground">{pageTitle}</span>
        {isExternal ? (
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
        )}
      </div>
    );

    if (isExternal) {
      return (
        <a key={page.code} href={page.externalUrl} target="_blank" rel="noopener noreferrer" className="group block">
          {content}
          {index < pages.length - 1 && <div className="ml-11 mr-4 h-px bg-border/50" />}
        </a>
      );
    }

    return (
      <Link key={page.code} to={page.route} className="group block">
        {content}
        {index < pages.length - 1 && <div className="ml-11 mr-4 h-px bg-border/50" />}
      </Link>
    );
  };

  return (
    <section className="px-4 pt-5 pb-3">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-0.5 h-4 rounded-full bg-accent" />
        <h2 className="text-base font-bold text-foreground font-serif tracking-tight">
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
