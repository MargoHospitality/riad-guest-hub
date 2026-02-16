/**
 * Check-in Restaurant - Meal selection for arrival day
 * Created: 2026-02-13
 * 
 * Features:
 * - Lunch / Dinner selection
 * - Dynamic pricing display (from checkin_config)
 * - French labels
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UtensilsCrossed, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

import { useSaveCheckinResponse } from "@/hooks/useCheckinResponse";
import { useCheckinConfig } from "@/hooks/useCheckinConfig";
import { useCheckinNavigation } from "@/hooks/useCheckinNavigation";
import { useToast } from "@/hooks/use-toast";

const CheckinRestaurant = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const { goToNextStep } = useCheckinNavigation();
  
  const [mealChoice, setMealChoice] = useState<string>("");
  const [menuType, setMenuType] = useState<string>("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  
  const { data: config } = useCheckinConfig();
  const saveResponse = useSaveCheckinResponse();
  
  const handleContinue = async () => {
    if (!token) return;
    
    if (!mealChoice) {
      toast({
        title: t('checkin.restaurant.selectionRequired'),
        description: t('checkin.restaurant.pleaseSelect'),
        variant: "destructive",
      });
      return;
    }
    
    if ((mealChoice === 'lunch' || mealChoice === 'dinner') && !menuType) {
      toast({
        title: t('checkin.restaurant.menuRequired'),
        description: t('checkin.restaurant.pleaseSelectMenu'),
        variant: "destructive",
      });
      return;
    }
    
    try {
      await saveResponse.mutateAsync({
        token,
        restaurant: {
          mealChoice,
          dietaryRestrictions: dietaryRestrictions || undefined,
        },
      });
      
      // Navigate to next step
      goToNextStep('restaurant');
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: t('checkin.restaurant.error'),
        description: t('checkin.restaurant.failedToSave'),
        variant: "destructive",
      });
    }
  };
  
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null;
    const currency = config?.currency || 'MAD';
    return `${price} ${currency} ${t('checkin.restaurant.perPerson')}`;
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
                {t('checkin.restaurant.title')}
              </h1>
            </div>
          </div>
          
          <div className="border-t border-border px-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t('checkin.restaurant.question')}
            </p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">{t('checkin.restaurant.mealType')} *</Label>
                <Select value={mealChoice} onValueChange={setMealChoice}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue placeholder={t('checkin.restaurant.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lunch">
                      {t('checkin.restaurant.lunch')} {config?.lunch_price ? `(${formatPrice(config.lunch_price)})` : ''}
                    </SelectItem>
                    <SelectItem value="dinner">
                      {t('checkin.restaurant.dinner')} {config?.dinner_price ? `(${formatPrice(config.dinner_price)})` : ''}
                    </SelectItem>
                    <SelectItem value="none">{t('checkin.restaurant.noThanks')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(mealChoice === 'lunch' || mealChoice === 'dinner') && (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">{t('checkin.restaurant.menuChoice')} *</Label>
                    <Select value={menuType} onValueChange={setMenuType}>
                      <SelectTrigger className="bg-card border-border">
                        <SelectValue placeholder={t('checkin.restaurant.selectPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traditional">{t('checkin.restaurant.traditionalMenu')}</SelectItem>
                        <SelectItem value="vegetarian">{t('checkin.restaurant.vegetarianMenu')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dietary" className="text-xs text-muted-foreground mb-2 block">
                      {t('checkin.restaurant.dietaryRestrictions')}
                    </Label>
                    <Textarea
                      id="dietary"
                      value={dietaryRestrictions}
                      onChange={(e) => setDietaryRestrictions(e.target.value)}
                      placeholder={t('checkin.restaurant.dietaryPlaceholder')}
                      className="text-sm"
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <button
            onClick={handleContinue}
            disabled={!mealChoice || saveResponse.isPending}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <span className="text-sm font-semibold text-primary">
              {saveResponse.isPending ? t('checkin.restaurant.saving') : t('checkin.restaurant.continue')}
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

export default CheckinRestaurant;
