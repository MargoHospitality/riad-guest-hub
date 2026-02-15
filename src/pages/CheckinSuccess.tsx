/**
 * Check-in Success - Confirmation page after completing check-in
 * Created: 2026-02-13
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
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
      <HeroSection />

      <main className="flex-1 px-4 -mt-6 relative z-10 pb-4">
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-lg font-bold text-foreground font-serif mb-2">
              {t('checkin.success.title')}
            </h1>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {t('checkin.success.thankYou')}
            </p>

            {checkinData && (
              <div className="w-full border-t border-border pt-4 space-y-2 text-sm mb-2">
                {checkinData.arrival_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrivée prévue</span>
                    <span className="font-medium text-foreground">{checkinData.arrival_date}</span>
                  </div>
                )}
                {checkinData.room_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chambre</span>
                    <span className="font-medium text-foreground">{checkinData.room_name}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {t('checkin.success.autoRedirect', { seconds: countdown })}
            </p>
          </div>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors"
          >
            <span className="text-sm font-semibold text-primary flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t('checkin.success.backHome')}
            </span>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </button>
        </div>
      </main>

      <ContactSection />
    </div>
  );
};

export default CheckinSuccess;
