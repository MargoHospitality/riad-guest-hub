import { Link } from "react-router-dom";
import { Globe, Plane, PersonStanding, Heart, Car, Wifi, MapPin, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface InfoItem {
  icon: LucideIcon;
  label: string;
  path?: string;
}

const items: InfoItem[] = [
  { icon: Globe, label: "Comment utiliser la Guest App", path: "/guide" },
  { icon: Plane, label: "Service de transport" },
  { icon: PersonStanding, label: "Check-In/Check-Out" },
  { icon: Heart, label: "Bien-être & confort" },
  { icon: Car, label: "Parking" },
  { icon: Wifi, label: "Se connecter au Wi-Fi" },
  { icon: MapPin, label: "Carte/Itinéraire" },
];

const StayInfo = () => (
  <section className="px-4 pb-6">
    <h2 className="text-xl font-bold text-foreground mb-4 font-serif">
      Information à propos de votre séjour
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
