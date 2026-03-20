import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plane, Check, Clock, ArrowRight, Car, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useCheckinNavigation } from "@/hooks/useCheckinNavigation";
import { useCheckinConfig } from "@/hooks/useCheckinConfig";



type TransportStatus = "confirmed" | "pending" | "none" | "manual";

interface TransportDetails {
  type: string;
  date: string;
  time: string;
  passengers: number;
  flight?: string;
}

interface ManualTransportForm {
  arrivalMethod: string;
  details?: string;
  arrivalTime: string;
}

const CheckinTransport = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo";
  const resume = searchParams.get("resume");
  const { goToNextStep, isStepEnabled } = useCheckinNavigation();

  const [status, setStatus] = useState<TransportStatus>("none");
  const [details, setDetails] = useState<TransportDetails | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ManualTransportForm>({
    defaultValues: {
      arrivalMethod: "",
      details: "",
      arrivalTime: "",
    },
  });

  const arrivalTime = form.watch("arrivalTime");
  const arrivalMethod = form.watch("arrivalMethod");
  
  const { data: config } = useCheckinConfig();
  
  // Auto-skip if step is disabled
  useEffect(() => {
    if (config && config.step_transport_enabled === false) {
      console.log('[CheckinTransport] Step disabled, auto-skipping to next');
      goToNextStep('transport');
    }
  }, [config, goToNextStep]);

  useEffect(() => {
    const checkTransport = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (resume === "checkin" && searchParams.get("transport") === "pending") {
        setStatus("pending");
        setDetails({
          type: "Transfert aéroport → Riad Massiba",
          date: "Févr. 11, 2026",
          time: "14:30",
          passengers: 3,
          flight: "AF1234",
        });
      } else {
        setStatus("none");
      }
      setIsLoading(false);
    };
    checkTransport();
  }, [resume, searchParams]);

  const handleMargoFlowRedirect = () => {
    // Redirect to Margo Flow with returnTo=checkin so it returns to check-in form
    const params = new URLSearchParams({
      token: token,
      returnTo: 'checkin',
      lang: i18n.language,
    });
    window.location.href = `https://flow.margo-hospitality.com/?${params.toString()}`;
  };

  const handleNoTransport = () => {
    setShowManualForm(true);
  };

  const handleManualSubmit = async (data: ManualTransportForm) => {
    console.log("Submitting manual transport:", data);
    goToNextStep('transport');
  };

  const handleContinue = () => {
    goToNextStep('transport');
  };

  const canContinue = () => {
    if (status === "confirmed" || status === "pending") return true;
    if (showManualForm) return !!arrivalTime && !!arrivalMethod;
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto">
        <Header />
        <HeroSection />
        <div className="px-4 -mt-6 relative z-10">
          <div className="bg-card rounded-2xl shadow-md p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      <HeroSection />

      <main className="flex-1 px-4 -mt-6 relative z-10 pb-4">
        {/* Main card */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">

          {/* Title */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-0.5 h-4 rounded-full bg-accent" />
              <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                Modalités d'arrivée
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4">
            {/* Scenario KA: Transport Confirmed/Pending */}
            {(status === "confirmed" || status === "pending") && !showManualForm && (
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {status === "pending" ? (
                      <Clock className="w-4.5 h-4.5 text-primary" />
                    ) : (
                      <Check className="w-4.5 h-4.5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {status === "pending" ? "Transport en cours de traitement" : "Transport confirmé"}
                    </p>
                    {details && (
                      <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                        <p><span className="font-medium text-foreground">Type:</span> {details.type}</p>
                        <p><span className="font-medium text-foreground">Date:</span> {details.date}</p>
                        <p><span className="font-medium text-foreground">Heure:</span> {details.time}</p>
                        <p><span className="font-medium text-foreground">Passagers:</span> {details.passengers}</p>
                        {details.flight && (
                          <p><span className="font-medium text-foreground">Vol:</span> {details.flight}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Scenario KB: No Transport - Propose Margo Flow */}
            {status === "none" && !showManualForm && (
              <>
                <div className="bg-accent/5 rounded-xl p-4 border border-accent/15">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Plane className="w-4.5 h-4.5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        Réserver un transfert aéroport ?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Service de transport privé depuis l'aéroport Marrakech-Menara
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleMargoFlowRedirect}
                    className="w-full flex items-center justify-between px-4 py-3 bg-accent rounded-xl group hover:bg-accent/90 transition-colors"
                  >
                    <span className="text-sm font-semibold text-accent-foreground">Demander un transport</span>
                    <div className="w-6 h-6 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-accent-foreground" />
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <button
                  onClick={handleNoTransport}
                  className="w-full text-center text-xs font-medium text-accent hover:underline transition-all"
                >
                  Je n'ai pas besoin de transport →
                </button>
              </>
            )}

            {/* Scenario KC: Manual Transport Form */}
            {showManualForm && (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 px-3 py-2.5">
                  <Car className="w-4 h-4 text-primary shrink-0" />
                  <Select
                    value={arrivalMethod}
                    onValueChange={(value) => form.setValue("arrivalMethod", value)}
                  >
                    <SelectTrigger className="bg-card border-border h-9 text-sm">
                      <SelectValue placeholder="Mode de transport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="other_provider">Autre fournisseur</SelectItem>
                      <SelectItem value="rental_car">Voiture de location</SelectItem>
                      <SelectItem value="taxi">Taxi</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 px-3 py-2.5">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <Input
                    type="time"
                    {...form.register("arrivalTime")}
                    placeholder="Heure d'arrivée"
                    className="bg-card border-border h-9 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 px-3 py-2.5">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input
                    {...form.register("details")}
                    placeholder="Précisions (optionnel)"
                    className="bg-card border-border h-9 text-sm placeholder:text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Validation button */}
          {(canContinue() || showManualForm) && (
            <button
              type="button"
              onClick={showManualForm ? form.handleSubmit(handleManualSubmit) : handleContinue}
              disabled={!canContinue()}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-semibold text-primary">Continuer</span>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </button>
          )}
        </div>
      </main>

      
    </div>
  );
};

export default CheckinTransport;
