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
    
    // Redirect vers Margo Flow avec le token + reservation_id
    const callback = encodeURIComponent(window.location.href);
    const reservationId = validation.reservation.reservation_id;
    
    // URL Margo Flow avec token et callback
    window.location.href = `https://flow.margo-hospitality.com/transport/request?reservationId=${reservationId}&token=${token}&callback=${callback}`;
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
