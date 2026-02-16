/**
 * Check-in Success - Confirmation page after completing check-in
 * Created: 2026-02-13
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import margoLogo from "@/assets/margo-hospitality-blue.png";
import { useCheckinResponse } from "@/hooks/useCheckinResponse";

const CheckinSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [countdown, setCountdown] = useState(15);
  const { data: checkinData } = useCheckinResponse(token);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate(`/?token=${token}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, token]);

  const handleGoHome = () => {
    navigate(`/?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />

      {/* Hero section with branding */}
      <div className="relative bg-foreground/80 px-6 pt-10 pb-14 flex flex-col items-center text-center">
        <img
          src={margoLogo}
          alt="Margo Hospitality"
          className="w-28 h-auto object-contain mb-6 opacity-90"
        />
        <div className="w-14 h-14 rounded-full bg-background/15 backdrop-blur-sm flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7 text-background" />
        </div>
        <h1 className="text-xl font-bold text-background font-serif mb-1.5">
          {t('checkin.success.title')}
        </h1>
        <p className="text-sm text-background/70 leading-relaxed max-w-[280px]">
          {t('checkin.success.thankYou')}
        </p>
      </div>

      {/* Floating card */}
      <main className="flex-1 px-4 -mt-6 relative z-10 pb-4">
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          {checkinData && (
            <div className="px-6 py-5 space-y-3 text-sm">
              {checkinData.arrival_date && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('checkin.success.expectedArrival', 'Arrivée prévue')}</span>
                  <span className="font-semibold text-foreground">{checkinData.arrival_date}</span>
                </div>
              )}
              {checkinData.room_name && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('checkin.success.room', 'Chambre')}</span>
                  <span className="font-semibold text-foreground">{checkinData.room_name}</span>
                </div>
              )}
            </div>
          )}

          <div className="px-6 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {t('checkin.success.autoRedirect', { seconds: countdown })}
            </p>
          </div>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-between px-5 py-4 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors"
          >
            <span className="text-sm font-semibold text-primary flex items-center gap-2.5">
              <Home className="w-4 h-4" />
              {t('checkin.success.backHome')}
            </span>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default CheckinSuccess;
