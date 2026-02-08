import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReservationSummary = () => {
  const navigate = useNavigate();

  const handleCheckin = () => {
    navigate("/checkin/step1");
  };

  return (
  <section className="px-4 py-6">
    <div className="flex items-center justify-center gap-6 mb-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Enregistrement</p>
        <p className="text-2xl font-bold text-primary font-serif">févr. 11</p>
        <p className="text-sm text-muted-foreground">mercredi</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground mt-2" />
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Départ</p>
        <p className="text-2xl font-bold text-primary font-serif">févr. 14</p>
        <p className="text-sm text-muted-foreground">samedi</p>
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
