import { useNavigate, useSearchParams } from "react-router-dom";
import { UtensilsCrossed, ArrowRight } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

import CheckinProgressBar from "@/components/checkin/CheckinProgressBar";

interface MealPreferencesForm {
  lunch: boolean;
  dinner: boolean;
  dietaryPreference: string;
  allergiesNotes: string;
}

const dietaryOptions = [
  { value: "traditional", label: "Menu Traditionnel Marocain" },
  { value: "vegetarian", label: "Menu Végétarien" },
  { value: "vegan", label: "Menu Vegan" },
  { value: "gluten_free", label: "Menu Sans Gluten" },
  { value: "no_preference", label: "Sans Préférence" },
  { value: "other", label: "Autre" },
];

const CheckinRestauration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo";

  const { handleSubmit, control, watch } = useForm<MealPreferencesForm>({
    defaultValues: {
      lunch: false,
      dinner: false,
      dietaryPreference: "no_preference",
      allergiesNotes: "",
    },
  });

  const lunch = watch("lunch");
  const dinner = watch("dinner");
  const hasMealSelected = lunch || dinner;

  const onSubmit = async (data: MealPreferencesForm) => {
    console.log("Submitting meal preferences:", data);
    navigate(`/checkin/step4?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      <HeroSection />

      <main className="flex-1 px-4 -mt-6 relative z-10 pb-24">
        {/* Main card */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          {/* Title bar */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-0.5 h-4 rounded-full bg-accent" />
              <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                Restauration le jour d'arrivée
              </h1>
            </div>
          </div>

          {/* Meal section header */}
          <div className="mx-4 bg-muted rounded-xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-semibold text-foreground">Repas</span>
          </div>

          {/* Meal Selection */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-4 py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Souhaitez-vous un repas au riad le jour de votre arrivée ?
              </p>

              <div className="space-y-3">
                <Controller
                  name="lunch"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id="lunch"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="lunch" className="text-sm text-foreground cursor-pointer flex-1">
                        Déjeuner
                      </Label>
                    </div>
                  )}
                />

                <Controller
                  name="dinner"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id="dinner"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="dinner" className="text-sm text-foreground cursor-pointer flex-1">
                        Dîner
                      </Label>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Conditional: Dietary Preferences */}
            {hasMealSelected && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Préférences alimentaires
                  </Label>
                  <Controller
                    name="dietaryPreference"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-12 bg-background border-border rounded-xl">
                          <SelectValue placeholder="Sans Préférence" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {dietaryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Allergies ou demandes spéciales (optionnel)
                  </Label>
                  <Controller
                    name="allergiesNotes"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Ex: Allergie aux fruits à coque, menu sans porc..."
                        className="min-h-[80px] bg-background border-border rounded-xl resize-none text-sm"
                        maxLength={500}
                      />
                    )}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1 text-right">
                    {watch("allergiesNotes")?.length || 0}/500
                  </p>
                </div>
              </div>
            )}

            {/* Continue button inside card */}
            <button
              type="submit"
              className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors"
            >
              <span className="text-sm font-semibold text-primary">Continuer</span>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </button>
          </form>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mt-4">
          <CheckinProgressBar currentStep={3} />
        </div>
      </main>

      
    </div>
  );
};

export default CheckinRestauration;
