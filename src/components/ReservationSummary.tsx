import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";

const ReservationSummary = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { validation } = useApp();

  const handleCheckin = () => {
    navigate("/checkin/step1");
  };

  // Format date for display with i18n
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
    
    const day = date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    const weekday = date.toLocaleDateString(locale, { weekday: 'long' });
    
    return { day, weekday };
  };

  // Use real dates if token validated, otherwise fallback
  const checkInDate = validation?.reservation?.check_in_date 
    ? formatDate(validation.reservation.check_in_date)
    : { day: 'févr. 11', weekday: 'mercredi' };
    
  const checkOutDate = validation?.reservation?.check_out_date
    ? formatDate(validation.reservation.check_out_date)
    : { day: 'févr. 14', weekday: 'samedi' };

  return (
  <section className="px-4 py-6">
    <div className="flex items-center justify-center gap-6 mb-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{t('reservation.checkIn')}</p>
        <p className="text-2xl font-bold text-primary font-serif">{checkInDate.day}</p>
        <p className="text-sm text-muted-foreground">{checkInDate.weekday}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground mt-2" />
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{t('reservation.checkOut')}</p>
        <p className="text-2xl font-bold text-primary font-serif">{checkOutDate.day}</p>
        <p className="text-sm text-muted-foreground">{checkOutDate.weekday}</p>
      </div>
    </div>
    <button 
      onClick={handleCheckin}
      className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
    >
      {t('reservation.onlineCheckIn')}
    </button>
  </section>
  );
};

export default ReservationSummary;
