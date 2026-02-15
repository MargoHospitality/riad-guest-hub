import { ArrowRight, ClipboardCheck, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import { useCheckinResponse, useCancelCheckin } from "@/hooks/useCheckinResponse";
import { toast } from "sonner";

const CheckinCTA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useApp();
  const { data: checkinData } = useCheckinResponse(token);
  const cancelCheckin = useCancelCheckin();

  // Check if check-in is completed
  const isCompleted = checkinData?.out_completed_at || checkinData?.completed_at;
  const completedDate = isCompleted ? new Date(isCompleted) : null;

  const handleCheckin = () => {
    if (isCompleted) {
      // Already completed, do nothing or show message
      return;
    }
    
    if (token) {
      navigate(`/checkin/gate?token=${token}`);
    } else {
      navigate("/checkin/gate");
    }
  };

  const handleCancelCheckin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!token) return;
    
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir annuler votre enregistrement ? Vous pourrez le refaire ensuite."
    );
    
    if (!confirmed) return;
    
    try {
      await cancelCheckin.mutateAsync({ token });
      toast.success("Enregistrement annulé");
      // Navigate back to checkin gate
      navigate(`/checkin/gate?token=${token}`);
    } catch (error) {
      toast.error("Erreur lors de l'annulation");
      console.error('Cancel error:', error);
    }
  };

  // If completed, show completed status
  if (isCompleted && completedDate) {
    return (
      <section className="px-4 pt-4">
        <div className="w-full bg-green-50 border-2 border-green-200 rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-green-800">
              Enregistrement réalisé
            </p>
            <p className="text-[11px] text-green-600 mt-0.5">
              {completedDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button
            onClick={handleCancelCheckin}
            disabled={cancelCheckin.isPending}
            className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 active:scale-95 flex items-center justify-center transition-all disabled:opacity-50"
            aria-label="Annuler l'enregistrement"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pt-4">
      <button
        onClick={handleCheckin}
        className="w-full bg-primary rounded-2xl shadow-md px-5 py-4 flex items-center gap-4 group hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
      >
        <div className="w-11 h-11 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-primary-foreground">
            {t('reservation.onlineCheckIn')}
          </p>
          <p className="text-[11px] text-primary-foreground/70 mt-0.5">
            {t('checkin.ctaSubtitle', 'Gagnez du temps à votre arrivée')}
          </p>
        </div>
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-primary-foreground/20 animate-ping" />
          <div className="relative w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:bg-primary-foreground/30 transition-colors">
            <ArrowRight className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </button>
    </section>
  );
};

export default CheckinCTA;
