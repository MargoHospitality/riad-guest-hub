import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

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

      // Redirect to home with token
      navigate(`/?token=${result.data.token}`);
    } catch (err) {
      console.error("Error fetching token:", err);
      setError(t('reservation.error') || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            {t('reservation.welcome') || "Welcome"}
          </h1>
          <p className="text-muted-foreground">
            {t('reservation.subtitle') || "Enter your reservation ID to access your guest app"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reservationId" className="text-sm font-medium text-foreground">
              {t('reservation.label') || "Reservation ID"}
            </label>
            <Input
              id="reservationId"
              type="text"
              placeholder={t('reservation.placeholder') || "Enter your reservation ID"}
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              disabled={isLoading}
              className="h-12 text-base"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('reservation.loading') || "Loading..."}
              </>
            ) : (
              t('reservation.continue') || "Continue"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          {t('reservation.help') || "Need help? Contact the property directly."}
        </p>
      </div>
    </div>
  );
};

export default ReservationLookup;
