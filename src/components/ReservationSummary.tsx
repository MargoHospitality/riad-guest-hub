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
        {/* Guest header */}
        <div className="px-4 pt-4 pb-4">
          {validation?.reservation && (
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-base font-semibold text-foreground font-serif">
                  {validation.reservation.guest_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {validation.reservation.room_name && (
                    <span className="text-[11px] text-muted-foreground">{validation.reservation.room_name}</span>
                  )}
                  <span className="text-[11px] text-muted-foreground">·</span>
                  {(validation.reservation.adults ?? 0) > 0 && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                      <Users className="w-3 h-3" /> {validation.reservation.adults}
                    </span>
                  )}
                  {(validation.reservation.children ?? 0) > 0 && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                      <Baby className="w-3 h-3" /> {validation.reservation.children}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                #{validation.reservation.reservation_id}
              </span>
            </div>
          )}

          {/* Dates — timeline style */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{t('reservation.checkIn')}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-foreground leading-none">{checkInDate.day}</span>
                <div>
                  <p className="text-xs font-medium text-foreground leading-tight">{checkInDate.month}</p>
                  <p className="text-[10px] text-muted-foreground capitalize leading-tight">{checkInDate.weekday}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-0.5 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <div className="w-px h-4 bg-border" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>

            <div className="flex-1 text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{t('reservation.checkOut')}</p>
              <div className="flex items-baseline gap-1.5 justify-end">
                <div>
                  <p className="text-xs font-medium text-foreground leading-tight">{checkOutDate.month}</p>
                  <p className="text-[10px] text-muted-foreground capitalize leading-tight">{checkOutDate.weekday}</p>
                </div>
                <span className="text-2xl font-bold text-foreground leading-none">{checkOutDate.day}</span>
              </div>
            </div>
          </div>
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
