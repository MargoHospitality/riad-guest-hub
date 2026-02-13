import { useNavigate, useSearchParams } from "react-router-dom";
import { Bed, Info, ArrowRight } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import CheckinProgressBar from "@/components/checkin/CheckinProgressBar";

interface BeddingPreferenceForm {
  type: string;
}

const CheckinBedding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo";

  const { handleSubmit, control } = useForm<BeddingPreferenceForm>({
    defaultValues: { type: "" },
  });

  const onSubmit = async (data: BeddingPreferenceForm) => {
    console.log("Submitting bedding preference:", data);
    navigate(`/checkin/step5?token=${token}`);
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
                Préférences de literie
              </h1>
            </div>
          </div>

          {/* Section header */}
          <div className="mx-4 bg-muted rounded-xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Bed className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-semibold text-foreground">Configuration du lit</span>
          </div>

          {/* Bedding Selection */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-4 py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Quelle configuration de lit préférez-vous ?
              </p>

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="double" id="double" />
                      <Label htmlFor="double" className="text-sm text-foreground cursor-pointer flex-1">
                        Lit Double (Queen/King)
                      </Label>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="twin" id="twin" />
                      <Label htmlFor="twin" className="text-sm text-foreground cursor-pointer flex-1">
                        Lits Jumeaux (Twin beds)
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* Info Notice */}
            <div className="mx-4 mb-4 bg-accent/5 border border-accent/20 rounded-xl p-3 flex items-start gap-3">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground italic">
                Sous réserve de disponibilité et compatibilité avec votre chambre
              </p>
            </div>

            {/* Continue */}
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

        {/* Progress */}
        <div className="flex justify-center mt-4">
          <CheckinProgressBar currentStep={4} />
        </div>
      </main>

      <ContactSection />
    </div>
  );
};

export default CheckinBedding;
