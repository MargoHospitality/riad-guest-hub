import { Moon, Pencil } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const RoomDetails = () => {
  const { validation, isLoadingValidation } = useApp();
  
  if (isLoadingValidation) {
    return (
      <section className="px-4 pb-4">
        <div className="border border-border rounded-xl p-4 bg-card animate-pulse">
          <div className="h-16 bg-secondary/50 rounded"></div>
        </div>
      </section>
    );
  }
  
  if (!validation?.reservation) {
    return null;
  }
  
  const { reservation } = validation;
  
  // Calculate number of nights
  const checkIn = new Date(reservation.check_in_date);
  const checkOut = new Date(reservation.check_out_date);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <section className="px-4 pb-4">
      <div className="border border-border rounded-xl p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-semibold text-foreground">{reservation.guest_name || "Réservation"}</p>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                {nights} <Moon className="w-4 h-4 text-accent" />
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ID de réservation : {reservation.reservation_id}
            </p>
          </div>
          <button className="p-2 rounded-full hover:bg-secondary">
            <Pencil className="w-4 h-4 text-accent" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
