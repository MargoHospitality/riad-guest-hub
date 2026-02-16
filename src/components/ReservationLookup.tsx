import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import margoLogo from "@/assets/margo-hospitality-logo.png";

const GEA_API_URL = 'https://gea.margo-hospitality.com/api/v1';

const ReservationLookup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reservationId, setReservationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!reservationId.trim()) {
      setError(t('reservation.enterReservationId') || "Please enter your reservation ID");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${GEA_API_URL}/get-token-by-reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservation_id: reservationId.trim() }),
      });

      const result = await response.json();

      if (!result.success || !result.data?.token) {
        setError(t('reservation.notFound') || "Reservation not found. Please check your reservation ID.");
        setIsLoading(false);
        return;
      }

      navigate(`/?token=${result.data.token}`);
    } catch (err) {
      console.error("Error fetching token:", err);
      setError(t('reservation.error') || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#f7f9fa' }}>
      <div className="w-full max-w-sm space-y-8">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center space-y-6">
          <img src={margoLogo} alt="Margo Hospitality" className="h-24 w-auto" />
          <div className="w-12 h-px" style={{ backgroundColor: '#1a9a9a' }} />
          <p className="text-center text-sm tracking-wide font-light" style={{ color: '#7a8fa0', letterSpacing: '0.08em' }}>
            {t('reservation.subtitle') || "Accédez à votre espace séjour"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="reservationId" className="text-sm font-medium" style={{ color: '#2c3e50' }}>
              {t('reservation.label') || "Numéro de réservation"}
            </label>
            <Input
              id="reservationId"
              type="text"
              placeholder={t('reservation.placeholder') || "Ex: RES-12345"}
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              disabled={isLoading}
              className="h-12 text-base rounded-xl border-2 focus:ring-0"
              style={{ 
                borderColor: '#d0dbe5',
                backgroundColor: '#ffffff',
              }}
            />
          </div>

          {error && (
            <div className="text-sm px-4 py-3 rounded-xl" style={{ color: '#c0392b', backgroundColor: '#fdf0ef' }}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl"
            style={{ 
              backgroundColor: '#1a9a9a',
              color: '#ffffff',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('reservation.loading') || "Chargement..."}
              </>
            ) : (
              t('reservation.continue') || "Accéder à mon séjour"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs" style={{ color: '#9aabb8' }}>
          {t('reservation.help') || "Besoin d'aide ? Contactez directement votre établissement."}
        </p>
      </div>
    </div>
  );
};

export default ReservationLookup;
