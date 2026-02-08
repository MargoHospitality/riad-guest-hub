import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageSquare, CheckCircle2, Check, Home } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CheckinHeader from "@/components/checkin/CheckinHeader";
import CheckinProgressBar from "@/components/checkin/CheckinProgressBar";
import logo from "@/assets/logo.png";

interface OtherRequestsForm {
  otherRequests: string;
}

// Mock data - in production would come from context/state management
const mockCheckinData = {
  transport: {
    type: "margo_flow",
    time: "14:30",
    method: "Transfert aéroport",
  },
  guests: 2,
  meals: {
    lunch: true,
    dinner: false,
    preference: "vegetarian",
    allergies: "",
  },
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
    defaultValues: {
      otherRequests: "",
    },
  });

  const otherRequests = watch("otherRequests");

  const generateSummaryNote = (otherRequests: string): string => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR");
    const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const mealPreference = mockCheckinData.meals.preference === "vegetarian" 
      ? "Menu Végétarien" 
      : mockCheckinData.meals.preference === "vegan"
      ? "Menu Vegan"
      : mockCheckinData.meals.preference === "gluten_free"
      ? "Menu Sans Gluten"
      : mockCheckinData.meals.preference === "traditional"
      ? "Menu Traditionnel Marocain"
      : "Sans Préférence";

    const beddingType = mockCheckinData.bedding === "double" 
      ? "Lit Double (Queen/King)" 
      : mockCheckinData.bedding === "twin"
      ? "Lits Jumeaux"
      : "Aucune préférence";

    return `=== Check-in en ligne - ${dateStr} ===\n\nRESTAURATION ARRIVÉE:\n- Déjeuner: ${mockCheckinData.meals.lunch ? "Oui" : "Non"}\n- Dîner: ${mockCheckinData.meals.dinner ? "Oui" : "Non"}\n- Préférences: ${mealPreference}\n- Allergies/Demandes: ${mockCheckinData.meals.allergies || "Aucune"}\n\nBEDDING PREFERENCES:\n- Type: ${beddingType}\n\nAUTRES DEMANDES:\n${otherRequests || "Aucune"}\n\n---\nVia Guest App - Token: ${token}\nEnregistré le: ${dateStr} à ${timeStr}`;
  };

  const onSubmit = async (data: OtherRequestsForm) => {
    setIsSubmitting(true);

    try {
      const note = generateSummaryNote(data.otherRequests);
      console.log("Submitting check-in note:", note);

      // Mock API call - in production would POST to Cloudbeds
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting check-in:", error);
      // In production: show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
        {/* Simple Header with Logo */}
        <header className="flex items-center justify-center px-4 py-6 bg-card border-b border-border">
          <img src={logo} alt="Riad Massiba" className="h-12" />
        </header>

        {/* Success Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Enregistrement confirmé !
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            Merci ! Nous avons bien reçu vos informations. Nous vous contacterons si besoin avant votre arrivée.
          </p>

          <div className="bg-card border border-border rounded-xl p-4 w-full mb-8">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arrivée prévue:</span>
                <span className="font-medium text-foreground">{mockCheckinData.arrivalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chambre:</span>
                <span className="font-medium text-foreground">{mockCheckinData.roomName}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full h-12 text-base font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <CheckinHeader backPath="/checkin/step4" token={token} />

      {/* Page Title */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl text-muted-foreground font-normal leading-tight">
          Dernières informations
        </h1>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 pb-28 space-y-4">
        {/* Section: Demandes spéciales */}
        <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">Demandes spéciales</span>
        </div>

        {/* Other Requests Textarea */}
        <div className="bg-card border border-border rounded-xl p-5">
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Avez-vous d'autres demandes ou informations à nous communiquer pour votre séjour?
          </Label>
          <Controller
            name="otherRequests"
            control={control}
            render={({ field }) => (
              <div>
                <Textarea
                  {...field}
                  placeholder="Ex: Arrivée tardive prévue, besoin d'un lit bébé, occasion spéciale..."
                  className="min-h-[150px] bg-background border-border rounded-xl resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {otherRequests?.length || 0} / 1000
                </p>
              </div>
            )}
          />
        </div>

        {/* Recap Section */}
        <div className="pt-4">
          <div className="bg-[#F5F8F2] rounded-lg px-4 py-3 flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">Récapitulatif de votre enregistrement</span>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            {/* Transport */}
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium text-foreground">Transport:</span>
                <span className="text-muted-foreground ml-1">
                  {mockCheckinData.transport.type === "margo_flow" 
                    ? `${mockCheckinData.transport.method} à ${mockCheckinData.transport.time}`
                    : "Arrivée autonome"}
                </span>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium text-foreground">Voyageurs:</span>
                <span className="text-muted-foreground ml-1">
                  {mockCheckinData.guests} adulte{mockCheckinData.guests > 1 ? "s" : ""} enregistré{mockCheckinData.guests > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Meals */}
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium text-foreground">Restauration:</span>
                <span className="text-muted-foreground ml-1">
                  {mockCheckinData.meals.lunch || mockCheckinData.meals.dinner
                    ? `${mockCheckinData.meals.lunch ? "Déjeuner" : ""}${mockCheckinData.meals.lunch && mockCheckinData.meals.dinner ? " + " : ""}${mockCheckinData.meals.dinner ? "Dîner" : ""} - Menu Végétarien`
                    : "Aucun repas demandé"}
                </span>
              </div>
            </div>

            {/* Bedding */}
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium text-foreground">Literie:</span>
                <span className="text-muted-foreground ml-1">
                  {mockCheckinData.bedding === "double"
                    ? "Lit Double"
                    : mockCheckinData.bedding === "twin"
                    ? "Lits Jumeaux"
                    : "Aucune préférence"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <CheckinProgressBar currentStep={5} />
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-6 h-12 text-base font-semibold min-w-[200px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Envoi...
              </span>
            ) : (
              "Valider mon enregistrement"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckinOtherRequests;
