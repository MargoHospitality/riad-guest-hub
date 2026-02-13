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
import { MessageSquare, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import { useCompleteCheckin } from "@/hooks/useCheckinResponse";
import { useToast } from "@/hooks/use-toast";

const CheckinOther = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  
  const [otherRequests, setOtherRequests] = useState("");
  
  const completeCheckin = useCompleteCheckin();
  
  const handleComplete = async () => {
    if (!token) return;
    
    try {
      await completeCheckin.mutateAsync({
        token,
        other: otherRequests || undefined,
      });
      
      toast({
        title: "Enregistrement terminé !",
        description: "Vos informations ont été transmises avec succès",
      });
      
      // Navigate to success/home
      navigate(`/?token=${token}`);
    } catch (error) {
      console.error('Failed to complete check-in:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'enregistrement",
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
                Demandes supplémentaires
              </h1>
            </div>
          </div>
          
          <div className="border-t border-border px-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Avez-vous des demandes particulières ou des informations à nous communiquer ?
            </p>
            
            <div>
              <Label htmlFor="other" className="text-xs text-muted-foreground">
                Vos demandes (optionnel)
              </Label>
              <Textarea
                id="other"
                value={otherRequests}
                onChange={(e) => setOtherRequests(e.target.value)}
                placeholder="Ex: Besoin d'un berceau, préférence pour un étage, arrivée tardive..."
                className="mt-2 text-sm"
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Nous ferons notre possible pour répondre à vos demandes
              </p>
            </div>
          </div>
          
          <button
            onClick={handleComplete}
            disabled={completeCheckin.isPending}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-green-600/10 border-t border-border group hover:bg-green-600/20 transition-colors disabled:opacity-50"
          >
            <span className="text-sm font-semibold text-green-600">
              {completeCheckin.isPending ? 'Finalisation...' : 'Terminer l\'enregistrement'}
            </span>
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center group-hover:bg-green-700 transition-colors">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
          
          <p className="text-xs text-center text-muted-foreground px-4 py-3 border-t border-border">
            En cliquant sur "Terminer", vos informations seront transmises à notre équipe
          </p>
        </div>
      </main>
      
      <ContactSection />
    </div>
  );
};

export default CheckinOther;
