import { ArrowRight, CalendarDays, BedDouble, Users, Baby, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import TransportCard from "@/components/TransportCard";

const ReservationSummary = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { validation, token } = useApp();

  const handleCheckin = () => {
    if (token) {
      navigate(`/checkin/gate?token=${token}`);
    } else {
      navigate("/checkin/gate");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
    const day = date.getDate();
    const month = date.toLocaleDateString(locale, { month: 'short' });
    const weekday = date.toLocaleDateString(locale, { weekday: 'short' });
    return { day, month, weekday };
  };

  const checkInDate = validation?.reservation?.check_in_date 
    ? formatDate(validation.reservation.check_in_date)
    : { day: 11, month: 'févr.', weekday: 'mer.' };
    
  const checkOutDate = validation?.reservation?.check_out_date
    ? formatDate(validation.reservation.check_out_date)
    : { day: 14, month: 'févr.', weekday: 'sam.' };

  return (
    <section className="px-4 -mt-6 relative z-10">
      <div className="bg-card rounded-2xl shadow-md overflow-hidden">
        {/* Header: Guest name + reservation ID + dates */}
        <div className="px-4 pt-4 pb-3">
          {validation?.reservation && (
            <div className="mb-3">
              <p className="text-[15px] font-semibold text-foreground font-serif">
                {validation.reservation.guest_name}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                #{validation.reservation.reservation_id}
              </p>
            </div>
          )}

          {/* Dates — compact inline */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-primary/5 rounded-xl px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('reservation.checkIn')}</p>
              <p className="text-[15px] font-bold text-foreground mt-0.5">{checkInDate.day} {checkInDate.month}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{checkInDate.weekday}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
            <div className="flex-1 bg-accent/5 rounded-xl px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('reservation.checkOut')}</p>
              <p className="text-[15px] font-bold text-foreground mt-0.5">{checkOutDate.day} {checkOutDate.month}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{checkOutDate.weekday}</p>
            </div>
          </div>

          {/* Room & guests — inline badges */}
          {validation?.reservation && (
            <div className="flex items-center gap-2 mt-3">
              <div className="inline-flex items-center gap-1.5 bg-muted/50 rounded-full px-2.5 py-1">
                <BedDouble className="w-3 h-3 text-primary" />
                <span className="text-[11px] font-medium text-foreground">{validation.reservation.room_name || 'Chambre'}</span>
              </div>
              {(validation.reservation.adults ?? 0) > 0 && (
                <div className="inline-flex items-center gap-1 bg-muted/50 rounded-full px-2.5 py-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-foreground">{validation.reservation.adults}</span>
                </div>
              )}
              {(validation.reservation.children ?? 0) > 0 && (
                <div className="inline-flex items-center gap-1 bg-muted/50 rounded-full px-2.5 py-1">
                  <Baby className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-foreground">{validation.reservation.children}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Check-in button */}
        <button 
          onClick={handleCheckin}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors"
        >
          <span className="text-sm font-semibold text-primary">{t('reservation.onlineCheckIn')}</span>
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            <div className="relative w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </div>
        </button>

        {/* Transport */}
        <TransportCard />
      </div>
    </section>
  );
};

export default ReservationSummary;
