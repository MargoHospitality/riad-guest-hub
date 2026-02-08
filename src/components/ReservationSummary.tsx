import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const ReservationSummary = () => {
  const navigate = useNavigate();
  const { validation } = useApp();

  const handleCheckin = () => {
    navigate("/checkin/step1");
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    return { day, weekday };
  };

  // Use real dates if token validated, otherwise fallback
  const checkInDate = validation?.reservation?.check_in 
    ? formatDate(validation.reservation.check_in)
    : { day: 'févr. 11', weekday: 'mercredi' };
    
  const checkOutDate = validation?.reservation?.check_out
    ? formatDate(validation.reservation.check_out)
    : { day: 'févr. 14', weekday: 'samedi' };

  return (
  <section className="px-4 py-6">
    <div className="flex items-center justify-center gap-6 mb-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Enregistrement</p>
        <p className="text-2xl font-bold text-primary font-serif">{checkInDate.day}</p>
        <p className="text-sm text-muted-foreground">{checkInDate.weekday}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground mt-2" />
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Départ</p>
        <p className="text-2xl font-bold text-primary font-serif">{checkOutDate.day}</p>
        <p className="text-sm text-muted-foreground">{checkOutDate.weekday}</p>
      </div>
    </div>
    <button 
      onClick={handleCheckin}
      className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
    >
      Enregistrement en ligne
    </button>
  </section>
  );
};

export default ReservationSummary;
