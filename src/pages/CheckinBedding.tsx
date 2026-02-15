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
import { Bed, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { useSaveCheckinResponse } from "@/hooks/useCheckinResponse";
import { useToast } from "@/hooks/use-toast";

const CheckinBedding = () => {
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
        title: "Sélection requise",
        description: "Merci de sélectionner une configuration de lit",
        variant: "destructive",
      });
      return;
    }
    
    if (beddingChoice === 'other' && !otherBedding.trim()) {
      toast({
        title: "Précision requise",
        description: "Merci de préciser votre configuration",
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
        title: "Erreur",
        description: "Impossible de sauvegarder votre choix",
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
                Configuration de la literie
              </h1>
            </div>
          </div>
          
          <div className="border-t border-border px-4 py-4 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Configuration souhaitée *</Label>
              <Select value={beddingChoice} onValueChange={setBeddingChoice}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twin">Lits jumeaux (2 lits séparés)</SelectItem>
                  <SelectItem value="double">Lit double (1 grand lit)</SelectItem>
                  <SelectItem value="no_preference">Pas de préférence</SelectItem>
                  <SelectItem value="other">Autre (préciser ci-dessous)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {beddingChoice === 'other' && (
              <div>
                <Label htmlFor="otherBedding" className="text-xs text-muted-foreground mb-2 block">
                  Précisez votre configuration *
                </Label>
                <Input
                  id="otherBedding"
                  value={otherBedding}
                  onChange={(e) => setOtherBedding(e.target.value)}
                  placeholder="Ex: 1 lit double + 1 lit simple"
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

export default CheckinBedding;
