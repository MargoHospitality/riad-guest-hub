import { ArrowRight, CalendarDays, BedDouble, Users, Baby, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import TransportCard from "@/components/TransportCard";

const ReservationSummary = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { validation, token } = useApp();

  // Mock data for preview when no token
  const reservation = validation?.reservation || {
    guest_name: "Jean Dupont",
    reservation_id: "RES-2847",
    room_name: "Suite Jasmin",
    adults: 2,
    children: 1,
    check_in_date: "",
    check_out_date: "",
  };

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

  const checkInDate = reservation.check_in_date 
    ? formatDate(reservation.check_in_date)
    : { day: 11, month: 'févr.', weekday: 'mer.' };
    
  const checkOutDate = reservation.check_out_date
    ? formatDate(reservation.check_out_date)
    : { day: 14, month: 'févr.', weekday: 'sam.' };

  return (
    <section className="px-4 -mt-6 relative z-10">
      <div className="bg-card rounded-2xl shadow-md overflow-hidden">
        {/* Guest header */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-foreground font-serif">
              {reservation.guest_name}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
              {reservation.room_name && (
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3 h-3" />
                  {reservation.room_name}
                </span>
              )}
              {(reservation.adults ?? 0) > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <Users className="w-3 h-3" /> {reservation.adults}
                  </span>
                </>
              )}
              {(reservation.children ?? 0) > 0 && (
                <span className="flex items-center gap-0.5">
                  <Baby className="w-3 h-3" /> {reservation.children}
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 mt-0.5">
            #{reservation.reservation_id}
          </span>
        </div>

        {/* Dates row */}
        <div className="mx-4 mb-4 rounded-xl bg-muted/30 p-3 flex items-stretch gap-0">
          {/* Check-in */}
          <div className="flex-1 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('reservation.checkIn')}</p>
              <p className="text-sm font-bold text-foreground leading-snug">{checkInDate.day} {checkInDate.month}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{checkInDate.weekday}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-border mx-3 my-1" />

          {/* Check-out */}
          <div className="flex-1 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('reservation.checkOut')}</p>
              <p className="text-sm font-bold text-foreground leading-snug">{checkOutDate.day} {checkOutDate.month}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{checkOutDate.weekday}</p>
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
