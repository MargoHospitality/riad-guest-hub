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
        {/* Booking ID */}
        {validation?.reservation && (
          <div className="px-4 pt-3 pb-1">
            <span className="inline-flex items-center text-[11px] font-medium text-muted-foreground rounded-full px-2.5 py-0.5" style={{ backgroundColor: '#f3f3f3' }}>
              #{validation.reservation.reservation_id}
            </span>
          </div>
        )}

        {/* Dates row */}
        <div className="flex items-center px-4 py-2.5">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('reservation.checkIn')}</p>
              <p className="text-[15px] font-semibold text-foreground">{checkInDate.day} {checkInDate.month}</p>
              <p className="text-xs text-muted-foreground capitalize">{checkInDate.weekday}</p>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground mx-2 shrink-0" />

          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t('reservation.checkOut')}</p>
              <p className="text-[15px] font-semibold text-foreground">{checkOutDate.day} {checkOutDate.month}</p>
              <p className="text-xs text-muted-foreground capitalize">{checkOutDate.weekday}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-accent" />
            </div>
          </div>
        </div>

        {/* Room & Guest details */}
        {validation?.reservation && (
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">{validation.reservation.room_name || 'Chambre'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              {(validation.reservation.adults ?? 0) > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{validation.reservation.adults}</span>
                </div>
              )}
              {(validation.reservation.children ?? 0) > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Baby className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{validation.reservation.children}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Check-in button */}
        <button 
          onClick={handleCheckin}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-accent border-t border-border group hover:bg-accent/90 transition-colors"
        >
          <span className="text-sm font-semibold text-accent-foreground">{t('reservation.onlineCheckIn')}</span>
          <div className="w-7 h-7 rounded-full bg-accent-foreground/20 flex items-center justify-center group-hover:bg-accent-foreground/30 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 text-accent-foreground" />
          </div>
        </button>

        {/* Transport */}
        <TransportCard />
      </div>
    </section>
  );
};

export default ReservationSummary;
