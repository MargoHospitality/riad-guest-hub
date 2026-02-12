/**
 * Check-in Guest Details - Multi-guest with pre-fill
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Plus, CheckCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useSaveCheckinResponse } from "@/hooks/useCheckinResponse";
import { useCheckinConfig } from "@/hooks/useCheckinConfig";
import { useToast } from "@/hooks/use-toast";

interface GuestForm {
  firstName: string;
  lastName: string;
  nationality: string;
  passportNumber: string;
}

interface Guest extends GuestForm {
  isPrimary: boolean;
  isSaved: boolean;
}

function parseGuestName(guestName: string): { firstName: string; lastName: string } {
  const parts = guestName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

const CheckinGuestDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [reservationInfo, setReservationInfo] = useState<any>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  
  const { data: config } = useCheckinConfig();
  const saveResponse = useSaveCheckinResponse();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestForm>();
  
  useEffect(() => {
    if (!token) return;
    
    const loadInfo = async () => {
      try {
        const response = await fetch(`https://gea.margo-hospitality.com/api/v1/checkin/reservation-info/${token}`);
        const result = await response.json();
        
        if (result.success) {
          setReservationInfo(result.data);
          const parsed = parseGuestName(result.data.guestName || '');
          setGuests([{
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            nationality: '',
            passportNumber: '',
            isPrimary: true,
            isSaved: false,
          }]);
        }
      } catch (error) {
        console.error('Failed to load reservation info:', error);
        toast({
          title: "Error",
          description: "Failed to load reservation information",
          variant: "destructive",
        });
      } finally {
        setIsLoadingInfo(false);
      }
    };
    
    loadInfo();
  }, [token]);
  
  const currentGuest = guests[currentGuestIndex];
  
  useEffect(() => {
    if (currentGuest) {
      reset({
        firstName: currentGuest.firstName,
        lastName: currentGuest.lastName,
        nationality: currentGuest.nationality,
        passportNumber: currentGuest.passportNumber,
      });
    }
  }, [currentGuestIndex, currentGuest, reset]);
  
  const onSubmit = async (data: GuestForm) => {
    if (!token) return;
    
    const updatedGuests = [...guests];
    updatedGuests[currentGuestIndex] = {
      ...data,
      isPrimary: currentGuest.isPrimary,
      isSaved: true,
    };
    setGuests(updatedGuests);
    
    try {
      await saveResponse.mutateAsync({
        token,
        guests: updatedGuests.map(g => ({
          firstName: g.firstName,
          lastName: g.lastName,
          nationality: g.nationality || undefined,
          passportNumber: g.passportNumber || undefined,
        })),
      });
      
      toast({
        title: "Saved",
        description: `Guest ${currentGuestIndex + 1} details saved`,
      });
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: "Error",
        description: "Failed to save guest details",
        variant: "destructive",
      });
    }
  };
  
  const handleAddGuest = () => {
    const maxGuests = config?.max_additional_guests || 10;
    if (guests.length >= maxGuests + 1) {
      toast({
        title: "Maximum guests reached",
        description: `You can add up to ${maxGuests} additional guests`,
      });
      return;
    }
    
    setGuests([...guests, {
      firstName: '',
      lastName: '',
      nationality: '',
      passportNumber: '',
      isPrimary: false,
      isSaved: false,
    }]);
    setCurrentGuestIndex(guests.length);
  };
  
  const handleContinue = () => {
    navigate(`/checkin/step3?token=${token}`);
  };
  
  const handleSelectGuest = (index: number) => {
    setCurrentGuestIndex(index);
  };
  
  if (isLoadingInfo) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto">
        <Header />
        <HeroSection />
        <div className="px-4 -mt-6 relative z-10">
          <div className="bg-card rounded-2xl shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-5 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-24 bg-muted rounded"></div>
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
          {/* Title bar */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-0.5 h-4 rounded-full bg-accent" />
              <h1 className="text-base font-bold text-foreground font-serif tracking-tight">
                Guest Details
              </h1>
            </div>
          </div>

          {/* Guest tabs */}
          {guests.length > 1 && (
            <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
              {guests.map((guest, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectGuest(index)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    index === currentGuestIndex
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Guest {index + 1}
                  {guest.isSaved && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="border-t border-border">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-foreground">
                {currentGuest?.isPrimary
                  ? `${currentGuest.firstName} ${currentGuest.lastName}`
                  : `Guest ${currentGuestIndex + 1}`}
              </p>
              {currentGuest?.isPrimary && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Please complete your details below
                </p>
              )}
            </div>
            
            <div className="px-4 pb-4 space-y-4">
              {/* First & Last Name (non-primary only) */}
              {!currentGuest?.isPrimary && (
                <>
                  <div>
                    <Label htmlFor="firstName" className="text-xs text-muted-foreground">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", { required: "First name is required" })}
                      className="mt-1"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs text-muted-foreground">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", { required: "Last name is required" })}
                      className="mt-1"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </>
              )}
              
              {/* Nationality */}
              <div>
                <Label htmlFor="nationality" className="text-xs text-muted-foreground">Nationality</Label>
                <Input
                  id="nationality"
                  {...register("nationality")}
                  placeholder="e.g., FR, US, MA"
                  maxLength={2}
                  className="mt-1 uppercase"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  2-letter country code (e.g., FR for France)
                </p>
              </div>
              
              {/* Passport */}
              <div>
                <Label htmlFor="passportNumber" className="text-xs text-muted-foreground">Passport Number (optional)</Label>
                <Input
                  id="passportNumber"
                  {...register("passportNumber")}
                  className="mt-1"
                />
              </div>
              
              {/* Save button */}
              <button
                type="submit"
                disabled={saveResponse.isPending}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-semibold text-primary">
                  {saveResponse.isPending ? 'Saving...' : currentGuest?.isSaved ? 'Update' : 'Save'}
                </span>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                  <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </button>
            </div>
          </form>
          
          {/* Add Another Guest */}
          {config?.additional_guests_optional && (
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={handleAddGuest}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Guest
              </button>
            </div>
          )}
          
          {/* Continue */}
          {currentGuest?.isSaved && (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border group hover:bg-primary/10 transition-colors"
            >
              <span className="text-sm font-semibold text-primary">Continue to Next Step</span>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </button>
          )}
        </div>
        
        {/* Hint */}
        {reservationInfo?.totalAdults && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            {reservationInfo.totalAdults} adults expected for this reservation
          </p>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckinGuestDetails;
