import { Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TransportCard = () => {
  const navigate = useNavigate();

  const handleTransportRequest = () => {
    navigate("/checkin/transport");
  };

  return (
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
