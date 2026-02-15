import { Car, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@/contexts/AppContext";
import { checkTransportStatus } from "@/lib/api";
import { useCheckinResponse } from "@/hooks/useCheckinResponse";

const TransportCard = () => {
  const { t, i18n } = useTranslation();
  const { token, validation } = useApp();
  
  const { data: transportStatus, isLoading } = useQuery({
    queryKey: ['transportStatus', validation?.reservation?.reservation_id],
    queryFn: () => checkTransportStatus(validation!.reservation!.reservation_id),
    enabled: !!validation?.reservation?.reservation_id,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
  });

  // Check if check-in is completed with manual/no transport
  const { data: checkinData } = useCheckinResponse(token);

  const handleTransportRequest = () => {
    if (!token || !validation?.reservation) return;
    const { cloudbeds_property_id, reservation_id, check_in_date } = validation.reservation;
    if (!cloudbeds_property_id) return;
    const params = new URLSearchParams({
      riad: cloudbeds_property_id,
      reservation: reservation_id,
      checkin: check_in_date,
      returnTo: 'homepage',
      token: token,
      lang: i18n.language,
    });
    window.location.href = `https://flow.margo-hospitality.com/?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-3 px-4 py-3">
        <div className="w-5 h-5 bg-muted rounded-full" />
        <div className="flex-1 h-4 bg-muted rounded w-1/2" />
      </div>
    );
  }

  // If check-in completed with manual/no transport → hide transport offer
  const checkinCompleted = checkinData?.out_completed_at || checkinData?.completed_at;
  const checkinTransportStatus = checkinData?.out_transport_status || checkinData?.transport_status;
  
  if (checkinCompleted && (checkinTransportStatus === 'manual' || checkinTransportStatus === 'none')) {
    return null; // Don't show transport offer if guest declined
  }

  const status = transportStatus?.status || 'none';
  const request = transportStatus?.request;

  if (status === 'none') {
    return (
      <button
        onClick={handleTransportRequest}
        className="w-full flex items-center justify-between px-4 py-3.5 border-t border-border group hover:bg-accent/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Car className="w-4 h-4 text-accent shrink-0" />
          <span className="text-sm font-semibold text-accent">{t('transport.title')}</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center group-hover:bg-accent/90 transition-colors">
          <ArrowRight className="w-3.5 h-3.5 text-accent-foreground" />
        </div>
      </button>
    );
  }

  if (status === 'pending' && request) {
    return (
      <div className="flex items-center justify-between px-4 py-3.5 border-t border-border">
        <div className="flex items-center gap-3">
          <Car className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="text-sm font-medium text-foreground">{t('transport.pending.title')}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          {t('transport.pending.badge', 'En attente')}
        </span>
      </div>
    );
  }

  if (status === 'confirmed' && request) {
    const handleViewDetails = () => {
      if (request.public_token) {
        window.location.href = `https://flow.margo-hospitality.com/confirmation/${request.public_token}`;
      }
    };

    return (
      <button
        onClick={handleViewDetails}
        className="w-full flex items-center justify-between px-4 py-3.5 border-t border-border group hover:bg-green-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm font-medium text-foreground">{t('transport.confirmed.title')}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <CheckCircle2 className="w-3 h-3" />
          {t('transport.confirmed.badge', 'Confirmé')}
        </span>
      </button>
    );
  }

  return null;
};

export default TransportCard;
