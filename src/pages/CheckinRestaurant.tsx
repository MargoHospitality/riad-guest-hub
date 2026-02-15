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
import { UtensilsCrossed, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { useSaveCheckinResponse } from "@/hooks/useCheckinResponse";
import { useCheckinConfig } from "@/hooks/useCheckinConfig";
import { useToast } from "@/hooks/use-toast";

const CheckinRestaurant = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  
  const [mealChoice, setMealChoice] = useState<string>("");
  const [menuType, setMenuType] = useState<string>("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  
  const { data: config } = useCheckinConfig();
  const saveResponse = useSaveCheckinResponse();
  
  const handleContinue = async () => {
    if (!token) return;
    
    if (!mealChoice) {
      toast({
        title: "Sélection requise",
        description: "Merci de sélectionner une option",
        variant: "destructive",
      });
      return;
    }
    
    if ((mealChoice === 'lunch' || mealChoice === 'dinner') && !menuType) {
      toast({
        title: "Choix du menu requis",
        description: "Merci de sélectionner le type de menu",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await saveResponse.mutateAsync({
        token,
        restaurant: {
          mealChoice,
          menuType: menuType || undefined,
          dietaryRestrictions: dietaryRestrictions || undefined,
        },
      });
      
      // Navigate to next step (bedding)
      navigate(`/checkin/bedding?token=${token}`);
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos choix",
        variant: "destructive",
      });
    }
  };
  
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null;
    const currency = config?.currency || 'MAD';
    return `${price} ${currency}`;
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
                Restauration le jour de l'arrivée
              </h1>
            </div>
          </div>
          
          <div className="border-t border-border px-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Souhaitez-vous organiser un repas le jour de votre arrivée ?
            </p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Type de repas *</Label>
                <Select value={mealChoice} onValueChange={setMealChoice}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lunch">
                      Déjeuner {config?.lunch_price ? `(${formatPrice(config.lunch_price)} par personne)` : ''}
                    </SelectItem>
                    <SelectItem value="dinner">
                      Dîner {config?.dinner_price ? `(${formatPrice(config.dinner_price)} par personne)` : ''}
                    </SelectItem>
                    <SelectItem value="none">Non merci</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(mealChoice === 'lunch' || mealChoice === 'dinner') && (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Choix du menu *</Label>
                    <Select value={menuType} onValueChange={setMenuType}>
                      <SelectTrigger className="bg-card border-border">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traditional">Menu traditionnel marocain</SelectItem>
                        <SelectItem value="vegetarian">Menu végétarien</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dietary" className="text-xs text-muted-foreground mb-2 block">
                      Indiquez ici vos préférences ou restrictions alimentaires éventuelles.
                    </Label>
                    <Textarea
                      id="dietary"
                      value={dietaryRestrictions}
                      onChange={(e) => setDietaryRestrictions(e.target.value)}
                      placeholder="Ex: Sans gluten, allergie aux fruits de mer, préférence épices..."
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
              {saveResponse.isPending ? 'Enregistrement...' : 'Continuer'}
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

export default CheckinRestaurant;
