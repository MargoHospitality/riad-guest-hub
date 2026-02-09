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
    
    const { cloudbeds_property_id, reservation_id, check_in_date } = validation.reservation;
    
    if (!cloudbeds_property_id) {
      console.error("No Cloudbeds property ID available for this property");
      return;
    }
    
    // URL Margo Flow avec tous les paramètres pré-remplis
    // Margo Flow attend le Cloudbeds property ID (9462, 319843, etc.)
    const params = new URLSearchParams({
      riad: cloudbeds_property_id,
      reservation: reservation_id,
      checkin: check_in_date
    });
    
    window.location.href = `https://margo-flow.vercel.app/?${params.toString()}`;
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
