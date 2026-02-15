/**
 * Check-in Bedding - Bed configuration preferences
 * Created: 2026-02-13
 * 
 * Features:
 * - Twin beds / Double bed selection
 * - French labels
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bed, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

import { useSaveCheckinResponse } from "@/hooks/useCheckinResponse";
import { useToast } from "@/hooks/use-toast";

const CheckinBedding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  
  const [beddingChoice, setBeddingChoice] = useState<string>("");
  const [otherBedding, setOtherBedding] = useState<string>("");
  
  const saveResponse = useSaveCheckinResponse();
  
  const handleContinue = async () => {
    if (!token) return;
    
    if (!beddingChoice) {
      toast({
        title: t('checkin.bedding.selectionRequired'),
        description: t('checkin.bedding.pleaseSelectConfiguration'),
        variant: "destructive",
      });
      return;
    }
    
    if (beddingChoice === 'other' && !otherBedding.trim()) {
      toast({
        title: t('checkin.bedding.specificationRequired'),
        description: t('checkin.bedding.pleaseSpecify'),
        variant: "destructive",
      });
      return;
    }
    
    try {
      await saveResponse.mutateAsync({
        token,
        bedding: beddingChoice === 'other' ? otherBedding : beddingChoice,
      });
      
      // Navigate to next step (other requests)
      navigate(`/checkin/other?token=${token}`);
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: t('checkin.bedding.error'),
        description: t('checkin.bedding.failedToSave'),
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
                {t('checkin.bedding.title')}
              </h1>
            </div>
          </div>
          
          <div className="border-t border-border px-4 py-4 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">{t('checkin.bedding.configurationWanted')} *</Label>
              <Select value={beddingChoice} onValueChange={setBeddingChoice}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder={t('checkin.bedding.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twin">{t('checkin.bedding.twin')}</SelectItem>
                  <SelectItem value="double">{t('checkin.bedding.double')}</SelectItem>
                  <SelectItem value="no_preference">{t('checkin.bedding.noPreference')}</SelectItem>
                  <SelectItem value="other">{t('checkin.bedding.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {beddingChoice === 'other' && (
              <div>
                <Label htmlFor="otherBedding" className="text-xs text-muted-foreground mb-2 block">
                  {t('checkin.bedding.specifyConfiguration')} *
                </Label>
                <Input
                  id="otherBedding"
                  value={otherBedding}
                  onChange={(e) => setOtherBedding(e.target.value)}
                  placeholder={t('checkin.bedding.configurationPlaceholder')}
                  className="bg-card border-border"
                />
              </div>
            )}
          </div>
          
          <button
            onClick={handleContinue}
            disabled={!beddingChoice || saveResponse.isPending}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <span className="text-sm font-semibold text-primary">
              {saveResponse.isPending ? t('checkin.bedding.saving') : t('checkin.bedding.continue')}
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

export default CheckinBedding;
