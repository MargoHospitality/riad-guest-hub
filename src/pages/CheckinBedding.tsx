import { useNavigate, useSearchParams } from "react-router-dom";
import { Bed, Info } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CheckinHeader from "@/components/checkin/CheckinHeader";
import CheckinProgressBar from "@/components/checkin/CheckinProgressBar";

interface BeddingPreferenceForm {
  type: string;
}

const CheckinBedding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo";

  const { handleSubmit, control } = useForm<BeddingPreferenceForm>({
    defaultValues: {
      type: "",
    },
  });

  const onSubmit = async (data: BeddingPreferenceForm) => {
    console.log("Submitting bedding preference:", data);
    // Store data locally, will be posted with final submission
    navigate(`/checkin/step5?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <CheckinHeader backPath="/checkin/step3" token={token} />

      {/* Page Title */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl text-muted-foreground font-normal leading-tight">
          Préférences de literie
        </h1>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 pb-28 space-y-4">
        {/* Section: Configuration du lit */}
        <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3">
          <Bed className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">Configuration du lit</span>
        </div>

        {/* Bedding Selection */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="font-medium text-foreground mb-4">
            Quelle configuration de lit préférez-vous?
          </p>

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="double" id="double" />
                  <Label htmlFor="double" className="text-base text-foreground cursor-pointer">
                    Lit Double (Queen/King)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="twin" id="twin" />
                  <Label htmlFor="twin" className="text-base text-foreground cursor-pointer">
                    Lits Jumeaux (Twin beds)
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {/* Info Notice */}
        <div className="bg-[#FFFEF8] border border-accent/30 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground italic">
            Sous réserve de disponibilité et compatibilité avec votre chambre
          </p>
        </div>
      </form>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <CheckinProgressBar currentStep={4} />
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

export default CheckinBedding;
