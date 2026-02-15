/**
 * Check-in Success - Confirmation page after completing check-in
 * Created: 2026-02-13
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";

const CheckinSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto-redirect after 10 seconds
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
          {/* Success icon */}
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground text-center mb-3">
              {t('checkin.success.title')}
            </h1>
            
            <p className="text-muted-foreground text-center mb-8 max-w-sm">
              {t('checkin.success.thankYou')}
            </p>
            
            <div className="w-full max-w-xs space-y-3">
              <Button 
                onClick={handleGoHome}
                className="w-full"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                {t('checkin.success.backHome')}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                {t('checkin.success.autoRedirect', { seconds: countdown })}
              </p>
            </div>
          </div>
        </div>
        
        <ContactSection />
      </main>
    </div>
  );
};

export default CheckinSuccess;
