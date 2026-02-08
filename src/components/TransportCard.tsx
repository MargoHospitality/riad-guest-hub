import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const TransportCard = () => {
  const handleTransportRequest = () => {
    // Redirect externe vers Margo Flow
    const token = "xxx"; // Token à récupérer dynamiquement
    const callback = encodeURIComponent(window.location.origin + "/?token=" + token);
    window.location.href = `https://flow.margo-hospitality.com/transport/request?token=${token}&callback=${callback}`;
  };

  return (
    <section className="px-4 pb-4">
      <div className="border-2 border-transport-border bg-transport rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-full bg-accent/10 shrink-0">
            <Car className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-lg">Profitez de nos offres de transport</p>
            <p className="text-sm text-muted-foreground mt-0.5">Pour une arrivée en toute tranquillité</p>
          </div>
        </div>
        <Button
          onClick={handleTransportRequest}
          className="w-full h-12 text-base font-semibold"
        >
          Demander un transport
        </Button>
      </div>
    </section>
  );
};

export default TransportCard;
