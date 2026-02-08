import { Link } from "react-router-dom";
import { Globe, PersonStanding, UtensilsCrossed, Heart, Car, Wifi, MapPin, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface InfoItem {
  icon: LucideIcon;
  label: string;
  path?: string;
  externalUrl?: string;
}

const items: InfoItem[] = [
  { icon: Globe, label: "Comment utiliser la Guest App", path: "/guide" },
  { icon: PersonStanding, label: "Check-In/Check-Out", path: "/checkin-info" },
  { icon: UtensilsCrossed, label: "Restauration", path: "/restauration" },
  { icon: Heart, label: "Bien-être & confort", path: "/wellness" },
  { icon: Car, label: "Parking", path: "/parking" },
  { icon: Wifi, label: "Se connecter au Wi-Fi", path: "/wifi" },
  { icon: MapPin, label: "Carte/Itinéraire", externalUrl: "https://maps.app.goo.gl/iACvR7utyjxYs4bv8" },
];

const StayInfo = () => (
  <section className="px-4 pb-6">
    <h2 className="text-xl font-bold text-foreground mb-4 font-serif">
      Préparez votre séjour
    </h2>
    <div className="flex flex-col">
      {items.map((item, i) => {
        const content = (
          <>
            <item.icon className="w-5 h-5 text-accent shrink-0" />
            <span className="flex-1 text-left text-foreground">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-accent" />
          </>
        );

        if (item.externalUrl) {
          return (
            <a
              key={i}
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 py-3.5 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors -mx-1 px-1 rounded"
            >
              {content}
            </a>
          );
        }

        if (item.path) {
          return (
            <Link
              key={i}
              to={item.path}
              className="flex items-center gap-4 py-3.5 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors -mx-1 px-1 rounded"
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={i}
            className="flex items-center gap-4 py-3.5 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors -mx-1 px-1 rounded"
          >
            {content}
          </button>
        );
      })}
    </div>
  </section>
);

export default StayInfo;
