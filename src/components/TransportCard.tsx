// Guest App - Updated TransportCard Component
// Path: src/components/TransportCard.tsx

import { Car, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { checkTransportStatus } from "@/lib/api";

const TransportCard = () => {
  const { t } = useTranslation();
  const { token, validation } = useApp();
  
  // Fetch transport status
  const { data: transportStatus, isLoading } = useQuery({
    queryKey: ['transportStatus', validation?.reservation?.reservation_id],
    queryFn: () => checkTransportStatus(validation!.reservation!.reservation_id),
    enabled: !!validation?.reservation?.reservation_id,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

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
    const params = new URLSearchParams({
      riad: cloudbeds_property_id,
      reservation: reservation_id,
      checkin: check_in_date
    });
    
    window.location.href = `https://margo-flow.vercel.app/?${params.toString()}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="px-4 pb-4">
        <div className="border-2 border-transport-border bg-transparent rounded-xl p-5">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-accent/10 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-accent/10 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const status = transportStatus?.status || 'none';
  const request = transportStatus?.request;

  // Format date/time for display
  const formatDateTime = (date: string, time: string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return `${d.toLocaleDateString('fr-FR', options)} à ${time.slice(0, 5)}`;
  };

  // Status: none (no transport request)
  if (status === 'none') {
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
  }

  // Status: pending (awaiting confirmation)
  if (status === 'pending' && request) {
    return (
      <section className="px-4 pb-4">
        <div className="border-2 border-orange-400 bg-orange-50/50 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-orange-400/10 shrink-0">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-lg">{t('transport.pending.title')}</p>
              <p className="text-sm text-orange-700 mt-0.5">{t('transport.pending.subtitle')}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Status: confirmed
  if (status === 'confirmed' && request) {
    const handleViewDetails = () => {
      if (request.public_token) {
        window.location.href = `https://flow.margo-hospitality.com/confirmation/${request.public_token}`;
      }
    };

    return (
      <section className="px-4 pb-4">
        <div className="border-2 border-green-400 bg-green-50/50 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-green-400/10 shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-lg">{t('transport.confirmed.title')}</p>
              <p className="text-sm text-green-700 mt-0.5">{t('transport.confirmed.subtitle')}</p>
            </div>
          </div>

          <Button
            onClick={handleViewDetails}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-green-400 text-green-700 hover:bg-green-50"
          >
            {t('transport.confirmed.detailsButton')}
          </Button>
        </div>
      </section>
    );
  }

  // Fallback (should not happen)
  return null;
};

export default TransportCard;
