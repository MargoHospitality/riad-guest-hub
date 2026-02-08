import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, User, Plane, Check, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo";
  const resume = searchParams.get("resume");
  
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

  useEffect(() => {
    // Simulate API check for transport status
    const checkTransport = async () => {
      setIsLoading(true);
      
      // Mock API response - in production this would be a real API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Check if returning from Margo Flow
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
        // Default to "none" for demo - showing Scenario KB
        setStatus("none");
      }
      
      setIsLoading(false);
    };

    checkTransport();
  }, [resume, searchParams]);

  const handleMargoFlowRedirect = () => {
    const callbackUrl = `${window.location.origin}/?token=${token}&resume=checkin`;
    window.location.href = `https://flow.margo-hospitality.com/transport/request?token=${token}&callback=${encodeURIComponent(callbackUrl)}`;
  };

  const handleNoTransport = () => {
    setShowManualForm(true);
  };

  const handleManualSubmit = async (data: ManualTransportForm) => {
    console.log("Submitting manual transport:", data);
    // In production: POST to API
    navigate(`/checkin/guest-details?token=${token}`);
  };

  const handleContinue = () => {
    navigate(`/checkin/guest-details?token=${token}`);
  };

  const canContinue = () => {
    if (status === "confirmed" || status === "pending") return true;
    if (showManualForm) return !!arrivalTime && !!arrivalMethod;
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <img src={logo} alt="Riad Massiba" className="h-12" />
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors">
          <User className="w-5 h-5 text-foreground" />
        </button>
      </header>

      {/* Page Title */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl text-muted-foreground font-normal">
          Modalités d'arrivée
        </h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 pb-24">
        {/* Scenario KA: Transport Confirmed */}
        {(status === "confirmed" || status === "pending") && !showManualForm && (
          <div className="bg-[hsl(76_27%_95%)] border-2 border-primary rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/20">
                {status === "pending" ? (
                  <Clock className="w-5 h-5 text-primary" />
                ) : (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">
                  {status === "pending" ? "Transport en cours de traitement" : "Transport confirmé"}
                </p>
                {details && (
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
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
            {/* Section Header */}
            <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3 mb-4">
              <Plane className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground">Transport</span>
            </div>

            {/* Transport Request Card */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 rounded-full bg-accent/10 shrink-0">
                  <Plane className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base">
                    Souhaitez-vous réserver un transfert aéroport avec Margo Hospitality?
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Service de transport privé confortable et fiable depuis l'aéroport Marrakech-Menara
                  </p>
                </div>
              </div>
              <Button
                onClick={handleMargoFlowRedirect}
                className="w-full h-12 text-base font-semibold"
              >
                Demander un transport
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* No Transport Link */}
            <button
              onClick={handleNoTransport}
              className="w-full text-center text-sm text-accent hover:underline transition-all"
            >
              Je n'ai pas besoin de transport →
            </button>
          </>
        )}

        {/* Scenario KC: Manual Transport Form */}
        {showManualForm && (
          <form onSubmit={form.handleSubmit(handleManualSubmit)} className="space-y-4">
            {/* Section Header */}
            <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3">
              <Plane className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground">Modalités d'arrivée</span>
            </div>

            {/* Arrival Method */}
            <div className="bg-card border border-border rounded-xl p-5">
              <Label className="text-sm font-medium text-foreground mb-3 block">
                Comment arrivez-vous au Riad Massiba?
              </Label>
              <RadioGroup
                value={arrivalMethod}
                onValueChange={(value) => form.setValue("arrivalMethod", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="other_provider" id="other_provider" />
                  <Label htmlFor="other_provider" className="text-sm text-foreground cursor-pointer">
                    Autre fournisseur de transport
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="rental_car" id="rental_car" />
                  <Label htmlFor="rental_car" className="text-sm text-foreground cursor-pointer">
                    Voiture de location
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="taxi" id="taxi" />
                  <Label htmlFor="taxi" className="text-sm text-foreground cursor-pointer">
                    Taxi
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="text-sm text-foreground cursor-pointer">
                    Autre
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Details */}
            <div className="bg-card border border-border rounded-xl p-5">
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Précisions (optionnel)
              </Label>
              <Input
                {...form.register("details")}
                placeholder="Ex: Nom du service, numéro de vol..."
                className="border-0 bg-transparent p-0 h-auto text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>

            {/* Arrival Time */}
            <div className="bg-card border border-border rounded-xl p-5">
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Heure d'arrivée
              </Label>
              <div className="flex items-center justify-between">
                <Input
                  type="time"
                  {...form.register("arrivalTime")}
                  className="border-0 bg-transparent p-0 h-auto text-foreground focus-visible:ring-0 w-auto"
                  placeholder="--:--"
                />
                {arrivalTime && (
                  <button
                    type="button"
                    onClick={() => form.setValue("arrivalTime", "")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  step === 1
                    ? "bg-primary w-6"
                    : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Continue Button */}
          <Button
            onClick={showManualForm ? form.handleSubmit(handleManualSubmit) : handleContinue}
            disabled={!canContinue()}
            className="px-8 h-12 text-base font-semibold"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckinTransport;
