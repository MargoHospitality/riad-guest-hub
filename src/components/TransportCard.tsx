import { Car } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

const TransportCard = () => {
  const { t } = useTranslation();
  const { token, validation } = useApp();
  
  const handleTransportRequest = () => {
    if (!token || !validation?.reservation) {
      console.error("No token or reservation data available");
      return;
    }
    
    // Paramètres requis pour Margo Flow
    const propertyId = validation.reservation.property_id;
    const reservationId = validation.reservation.reservation_id;
    const checkInDate = validation.reservation.check_in_date;
    
    // URL Margo Flow avec les paramètres requis
    window.location.href = `https://flow.margo-hospitality.com/transport?propertyId=${propertyId}&reservationId=${reservationId}&checkInDate=${checkInDate}`;
  };

  return (
    <section className="px-4 pb-4">
      <div className="border-2 border-transport-border bg-transparent rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-full bg-accent/10 shrink-0">
            <Car className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-lg">{t('transport.title')}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{t('transport.subtitle')}</p>
          </div>
        </div>
        <Button
          onClick={handleTransportRequest}
          className="w-full h-12 text-base font-semibold"
        >
          {t('transport.requestButton')}
        </Button>
      </div>
    </section>
  );
};

export default TransportCard;
