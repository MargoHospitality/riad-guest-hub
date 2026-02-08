import { Moon, Users, Baby, Pencil } from "lucide-react";

const RoomDetails = () => (
  <section className="px-4 pb-4">
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">Mauve Room</p>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground">3 <Moon className="w-4 h-4 text-accent" /></span>
            <span className="flex items-center gap-1 font-medium text-foreground">2 <Users className="w-4 h-4 text-accent" /></span>
            <span className="flex items-center gap-1 font-medium text-foreground">0 <Baby className="w-4 h-4 text-accent" /></span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">ID de réservation : 3102273781395</p>
        </div>
        <button className="p-2 rounded-full hover:bg-secondary">
          <Pencil className="w-4 h-4 text-accent" />
        </button>
      </div>
    </div>
  </section>
);

export default RoomDetails;
