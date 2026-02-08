import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import CheckinHeader from "@/components/checkin/CheckinHeader";
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
    // Store data locally, will be posted with final submission
    navigate(`/checkin/step4?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <CheckinHeader backPath="/checkin/guest-details" token={token} />

      {/* Page Title */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl text-muted-foreground font-normal leading-tight">
          Restauration le jour de votre arrivée
        </h1>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 pb-28 space-y-4">
        {/* Section: Repas */}
        <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3">
          <UtensilsCrossed className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">Repas</span>
        </div>

        {/* Meal Selection */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="font-medium text-foreground mb-4">
            Souhaitez-vous un repas au riad le jour de votre arrivée?
          </p>

          <div className="space-y-3">
            <Controller
              name="lunch"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="lunch"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="lunch" className="text-foreground cursor-pointer text-base">
                    Déjeuner
                  </Label>
                </div>
              )}
            />

            <Controller
              name="dinner"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="dinner"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="dinner" className="text-foreground cursor-pointer text-base">
                    Dîner
                  </Label>
                </div>
              )}
            />
          </div>
        </div>

        {/* Conditional: Dietary Preferences (shown only if meal selected) */}
        {hasMealSelected && (
          <>
            {/* Dietary Preference Dropdown */}
            <div className="pt-2">
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Préférences alimentaires
              </Label>
              <Controller
                name="dietaryPreference"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-14 bg-card border-border rounded-xl">
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

            {/* Allergies/Special Requests */}
            <div className="pt-2">
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Allergies ou demandes spéciales (optionnel)
              </Label>
              <Controller
                name="allergiesNotes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Ex: Allergie aux fruits à coque, menu sans porc..."
                    className="min-h-[100px] bg-card border-border rounded-xl resize-none"
                    maxLength={500}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {watch("allergiesNotes")?.length || 0}/500
              </p>
            </div>
          </>
        )}
      </form>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <CheckinProgressBar currentStep={3} />
          <Button
            onClick={handleSubmit(onSubmit)}
            className="px-8 h-12 text-base font-semibold"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckinRestauration;
