import { Car, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@/contexts/AppContext";
import { checkTransportStatus } from "@/lib/api";

const TransportCard = () => {
  const { t } = useTranslation();
  const { token, validation } = useApp();
  
  const { data: transportStatus, isLoading } = useQuery({
    queryKey: ['transportStatus', validation?.reservation?.reservation_id],
    queryFn: () => checkTransportStatus(validation!.reservation!.reservation_id),
    enabled: !!validation?.reservation?.reservation_id,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
  });

  const handleTransportRequest = () => {
    if (!token || !validation?.reservation) return;
    const { cloudbeds_property_id, reservation_id, check_in_date } = validation.reservation;
    if (!cloudbeds_property_id) return;
    const params = new URLSearchParams({
      riad: cloudbeds_property_id,
      reservation: reservation_id,
      checkin: check_in_date
    });
    window.location.href = `https://margo-flow.vercel.app/?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <section className="px-4 pb-4">
        <div className="bg-card rounded-2xl p-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const status = transportStatus?.status || 'none';
  const request = transportStatus?.request;

  // Status: none
  if (status === 'none') {
    return (
      <section className="px-4 pb-4">
        <button
          onClick={handleTransportRequest}
          className="w-full bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground text-[15px] leading-tight">{t('transport.title')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('transport.subtitle')}</p>
            </div>
            <div className="shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:bg-accent/90 transition-colors">
              <ArrowRight className="w-4 h-4 text-accent-foreground" />
            </div>
          </div>
        </button>
      </section>
    );
  }

  // Status: pending
  if (status === 'pending' && request) {
    return (
      <section className="px-4 pb-4">
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-[15px] leading-tight">{t('transport.pending.title')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('transport.pending.subtitle')}</p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {t('transport.pending.badge', 'En attente')}
            </span>
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
        <button
          onClick={handleViewDetails}
          className="w-full bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-semibold text-foreground text-[15px] leading-tight">{t('transport.confirmed.title')}</p>
              <p className="text-xs text-green-700 mt-0.5">{t('transport.confirmed.subtitle')}</p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" />
              {t('transport.confirmed.badge', 'Confirmé')}
            </span>
          </div>
        </button>
      </section>
    );
  }

  return null;
};

export default TransportCard;
