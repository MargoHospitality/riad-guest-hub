import { ArrowRight, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";

const CheckinCTA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useApp();

  const handleCheckin = () => {
    if (token) {
      navigate(`/checkin/gate?token=${token}`);
    } else {
      navigate("/checkin/gate");
    }
  };

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
