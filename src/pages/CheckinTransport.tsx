import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import Footer from "@/components/Footer";


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
    const callbackUrl = `${window.location.origin}/?token=${token}&resume=checkin`;
    window.location.href = `https://flow.margo-hospitality.com/transport/request?token=${token}&callback=${encodeURIComponent(callbackUrl)}`;
  };

  const handleNoTransport = () => {
    setShowManualForm(true);
  };

  const handleManualSubmit = async (data: ManualTransportForm) => {
    console.log("Submitting manual transport:", data);
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
        <Footer />
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
              <div className="space-y-3">
                {/* Arrival method select */}
                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Car className="w-4 h-4 text-primary" />
                    </div>
                    <Label className="text-xs font-medium text-foreground">
                      Mode de transport
                    </Label>
                  </div>
                  <Select
                    value={arrivalMethod}
                    onValueChange={(value) => form.setValue("arrivalMethod", value)}
                  >
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="other_provider">Autre fournisseur de transport</SelectItem>
                      <SelectItem value="rental_car">Voiture de location</SelectItem>
                      <SelectItem value="taxi">Taxi</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Arrival time */}
                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <Label className="text-xs font-medium text-foreground">
                      Heure d'arrivée estimée
                    </Label>
                  </div>
                  <Input
                    type="time"
                    {...form.register("arrivalTime")}
                    className="bg-card border-border"
                  />
                </div>

                {/* Details */}
                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Label className="text-xs font-medium text-foreground">
                      Précisions <span className="text-muted-foreground font-normal">(optionnel)</span>
                    </Label>
                  </div>
                  <Input
                    {...form.register("details")}
                    placeholder="Ex: Numéro de vol, nom du service..."
                    className="bg-card border-border"
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

      <Footer />
    </div>
  );
};

export default CheckinTransport;
