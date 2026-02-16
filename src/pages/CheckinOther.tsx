/**
 * Check-in Other Requests - Final step for additional requests
 * Created: 2026-02-13
 * 
 * Features:
 * - Free text for any special requests
 * - Complete check-in button
 * - Triggers Cloudbeds sync
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageSquare, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

import { useCompleteCheckin } from "@/hooks/useCheckinResponse";
import { useCheckinNavigation } from "@/hooks/useCheckinNavigation";
import { useToast } from "@/hooks/use-toast";

const CheckinOther = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const { goToNextStep } = useCheckinNavigation();
  
  const [otherRequests, setOtherRequests] = useState("");
  
  const completeCheckin = useCompleteCheckin();
  
  const handleComplete = async () => {
    if (!token) return;
    
    try {
      await completeCheckin.mutateAsync({
        token,
        other: otherRequests || undefined,
      });
      
      // Navigate to success page
      goToNextStep('other');
    } catch (error) {
      console.error('Failed to complete check-in:', error);
      toast({
        title: t('checkin.other.error'),
        description: t('checkin.other.failedToComplete'),
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      <HeroSection />
      
      <main className="flex-1 px-4 -mt-6 relative z-10 pb-4">
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          {/* Title bar */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-0.5 h-4 rounded-full bg-accent" />
              <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                {t('checkin.other.title')}
              </h1>
            </div>
          </div>
          
          <div className="border-t border-border px-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t('checkin.other.question')}
            </p>
            
            <div>
              <Label htmlFor="other" className="text-xs text-muted-foreground">
                {t('checkin.other.yourRequests')}
              </Label>
              <Textarea
                id="other"
                value={otherRequests}
                onChange={(e) => setOtherRequests(e.target.value)}
                placeholder={t('checkin.other.requestsPlaceholder')}
                className="mt-2 text-sm"
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {t('checkin.other.willDoOurBest')}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleComplete}
            disabled={completeCheckin.isPending}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-green-600/10 border-t border-border group hover:bg-green-600/20 transition-colors disabled:opacity-50"
          >
            <span className="text-sm font-semibold text-green-600">
              {completeCheckin.isPending ? t('checkin.other.finalizing') : t('checkin.other.completeCheckin')}
            </span>
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center group-hover:bg-green-700 transition-colors">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
          
          <p className="text-xs text-center text-muted-foreground px-4 py-3 border-t border-border">
            {t('checkin.other.submitInfo')}
          </p>
        </div>
      </main>
      
      
    </div>
  );
};

export default CheckinOther;
