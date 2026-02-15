import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageSquare, CheckCircle2, Check, Home, ArrowRight } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

import CheckinProgressBar from "@/components/checkin/CheckinProgressBar";
import logo from "@/assets/logo.png";

interface OtherRequestsForm {
  otherRequests: string;
}

const mockCheckinData = {
  transport: { type: "margo_flow", time: "14:30", method: "Transfert aéroport" },
  guests: 2,
  meals: { lunch: true, dinner: false, preference: "vegetarian", allergies: "" },
  bedding: "double" as const,
  arrivalDate: "11 Février 2026",
  roomName: "Suite Majorelle",
};

const CheckinOtherRequests = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { handleSubmit, control, watch } = useForm<OtherRequestsForm>({
    defaultValues: { otherRequests: "" },
  });

  const otherRequests = watch("otherRequests");

  const generateSummaryNote = (otherRequests: string): string => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR");
    const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const mealPreference = mockCheckinData.meals.preference === "vegetarian" ? "Menu Végétarien" : mockCheckinData.meals.preference === "vegan" ? "Menu Vegan" : mockCheckinData.meals.preference === "gluten_free" ? "Menu Sans Gluten" : mockCheckinData.meals.preference === "traditional" ? "Menu Traditionnel Marocain" : "Sans Préférence";
    const beddingType = mockCheckinData.bedding === "double" ? "Lit Double (Queen/King)" : mockCheckinData.bedding === "twin" ? "Lits Jumeaux" : "Aucune préférence";
    return `=== Check-in en ligne - ${dateStr} ===\n\nRESTAURATION ARRIVÉE:\n- Déjeuner: ${mockCheckinData.meals.lunch ? "Oui" : "Non"}\n- Dîner: ${mockCheckinData.meals.dinner ? "Oui" : "Non"}\n- Préférences: ${mealPreference}\n- Allergies/Demandes: ${mockCheckinData.meals.allergies || "Aucune"}\n\nBEDDING PREFERENCES:\n- Type: ${beddingType}\n\nAUTRES DEMANDES:\n${otherRequests || "Aucune"}\n\n---\nVia Guest App - Token: ${token}\nEnregistré le: ${dateStr} à ${timeStr}`;
  };

  const onSubmit = async (data: OtherRequestsForm) => {
    setIsSubmitting(true);
    try {
      const note = generateSummaryNote(data.otherRequests);
      console.log("Submitting check-in note:", note);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting check-in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSuccess) {
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
                Enregistrement confirmé !
              </h1>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Merci ! Nous avons bien reçu vos informations. Nous vous contacterons si besoin avant votre arrivée.
              </p>

              <div className="w-full border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arrivée prévue</span>
                  <span className="font-medium text-foreground">{mockCheckinData.arrivalDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chambre</span>
                  <span className="font-medium text-foreground">{mockCheckinData.roomName}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors"
            >
              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </span>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </button>
          </div>
        </main>

      </div>
    );
  }

  // Form State
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
                Dernières informations
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Section header */}
            <div className="mx-4 bg-muted rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-semibold text-foreground">Demandes spéciales</span>
            </div>

            {/* Textarea */}
            <div className="px-4 py-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Avez-vous d'autres demandes pour votre séjour ?
              </Label>
              <Controller
                name="otherRequests"
                control={control}
                render={({ field }) => (
                  <div>
                    <Textarea
                      {...field}
                      placeholder="Ex: Arrivée tardive prévue, besoin d'un lit bébé, occasion spéciale..."
                      className="min-h-[100px] bg-background border-border rounded-xl resize-none text-sm"
                      maxLength={1000}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1 text-right">
                      {otherRequests?.length || 0}/1000
                    </p>
                  </div>
                )}
              />
            </div>

            {/* Recap */}
            <div className="border-t border-border px-4 py-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-0.5 h-4 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-foreground">Récapitulatif</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Transport", value: mockCheckinData.transport.type === "margo_flow" ? `${mockCheckinData.transport.method} à ${mockCheckinData.transport.time}` : "Arrivée autonome" },
                  { label: "Voyageurs", value: `${mockCheckinData.guests} adulte${mockCheckinData.guests > 1 ? "s" : ""} enregistré${mockCheckinData.guests > 1 ? "s" : ""}` },
                  { label: "Restauration", value: mockCheckinData.meals.lunch || mockCheckinData.meals.dinner ? `${mockCheckinData.meals.lunch ? "Déjeuner" : ""}${mockCheckinData.meals.lunch && mockCheckinData.meals.dinner ? " + " : ""}${mockCheckinData.meals.dinner ? "Dîner" : ""} - Menu Végétarien` : "Aucun repas demandé" },
                  { label: "Literie", value: mockCheckinData.bedding === "double" ? "Lit Double" : mockCheckinData.bedding === "twin" ? "Lits Jumeaux" : "Aucune préférence" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs">
                      <span className="font-medium text-foreground">{item.label}:</span>
                      <span className="text-muted-foreground ml-1">{item.value}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              <span className="text-sm font-semibold text-primary">
                {isSubmitting ? "Envoi en cours..." : "Valider mon enregistrement"}
              </span>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Progress */}
        <div className="flex justify-center mt-4">
          <CheckinProgressBar currentStep={5} />
        </div>
      </main>

      
    </div>
  );
};

export default CheckinOtherRequests;
