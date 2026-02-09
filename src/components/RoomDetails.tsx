import { Moon, Users, Baby } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const RoomDetails = () => {
  const { validation, isLoadingValidation } = useApp();
  
  if (isLoadingValidation) {
    return (
      <section className="px-4 pt-4 pb-2">
        <div className="bg-card rounded-2xl p-4 shadow-sm animate-pulse">
          <div className="h-12 bg-muted rounded" />
        </div>
      </section>
    );
  }
  
  if (!validation?.reservation) return null;
  
  const { reservation } = validation;
  const checkIn = new Date(reservation.check_in_date);
  const checkOut = new Date(reservation.check_out_date);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <section className="px-4 pt-4 pb-2">
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-[15px] truncate">
              {reservation.room_name || reservation.guest_name || "Réservation"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              ID {reservation.reservation_id}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
              {nights} <Moon className="w-3 h-3 text-accent" />
            </span>
            {reservation.adults && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
                {reservation.adults} <Users className="w-3 h-3 text-accent" />
              </span>
            )}
            {typeof reservation.children === 'number' && reservation.children > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
                {reservation.children} <Baby className="w-3 h-3 text-accent" />
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
