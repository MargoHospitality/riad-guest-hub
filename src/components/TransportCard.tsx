import { Plane } from "lucide-react";

const TransportCard = () => (
  <section className="px-4 pb-4">
    <div className="border-2 border-transport-border bg-transport rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-full bg-accent/10 shrink-0">
          <Plane className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-lg">Service de transport</p>
          <p className="text-sm text-muted-foreground mt-0.5">Réservez votre transfert aéroport-riad</p>
        </div>
      </div>
      <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity">
        Demander un transport
      </button>
    </div>
  </section>
);

export default TransportCard;
