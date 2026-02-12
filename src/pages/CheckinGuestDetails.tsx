/**
 * Check-in Guest Details - Multi-guest with pre-fill
 * Created: 2026-02-12
 * 
 * Features:
 * - First guest pre-filled with reservation name (read-only)
 * - Nationality + passport to fill
 * - Additional guests optional (+ Add Another Guest button)
 * - Save to backend API
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Plus, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheckinHeader from "@/components/checkin/CheckinHeader";
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
  
  // Load reservation info on mount
  useEffect(() => {
    if (!token) return;
    
    const loadInfo = async () => {
      try {
        const response = await fetch(`https://gea.margo-hospitality.com/api/v1/checkin/reservation-info/${token}`);
        const result = await response.json();
        
        if (result.success) {
          setReservationInfo(result.data);
          
          // Parse primary guest name
          const parsed = parseGuestName(result.data.guestName || '');
          
          // Initialize with primary guest (name pre-filled, nationality/passport empty)
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
  
  // Reset form when switching guests
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
    
    // Update current guest
    const updatedGuests = [...guests];
    updatedGuests[currentGuestIndex] = {
      ...data,
      isPrimary: currentGuest.isPrimary,
      isSaved: true,
    };
    setGuests(updatedGuests);
    
    // Save to backend
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
    // Navigate to next step (restauration or other)
    navigate(`/checkin/step3?token=${token}`);
  };
  
  const handleSelectGuest = (index: number) => {
    setCurrentGuestIndex(index);
  };
  
  if (isLoadingInfo) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <CheckinHeader backPath="/checkin/gate" token={token || ''} />
      
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-6">Guest Details</h1>
        
        {/* Guest tabs */}
        {guests.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {guests.map((guest, index) => (
              <button
                key={index}
                onClick={() => handleSelectGuest(index)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 ${
                  index === currentGuestIndex
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <User className="w-4 h-4" />
                Guest {index + 1}
                {guest.isSaved && <CheckCircle className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">
              {currentGuest?.isPrimary ? `Guest 1: ${currentGuest.firstName} ${currentGuest.lastName} (you)` : `Guest ${currentGuestIndex + 1}`}
            </h3>
            
            {currentGuest?.isPrimary && (
              <p className="text-sm text-muted-foreground mb-4">
                Please complete your details below
              </p>
            )}
          </div>
          
          {/* First Name (read-only for primary guest) */}
          {!currentGuest?.isPrimary && (
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register("firstName", { required: "First name is required" })}
                className="mt-1"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
          )}
          
          {/* Last Name (read-only for primary guest) */}
          {!currentGuest?.isPrimary && (
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                className="mt-1"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          )}
          
          {/* Nationality */}
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              {...register("nationality")}
              placeholder="e.g., FR, US, MA"
              maxLength={2}
              className="mt-1 uppercase"
            />
            <p className="text-xs text-muted-foreground mt-1">
              2-letter country code (e.g., FR for France)
            </p>
          </div>
          
          {/* Passport Number */}
          <div>
            <Label htmlFor="passportNumber">Passport Number (optional)</Label>
            <Input
              id="passportNumber"
              {...register("passportNumber")}
              className="mt-1"
            />
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Button type="submit" className="w-full" disabled={saveResponse.isPending}>
              {saveResponse.isPending ? 'Saving...' : currentGuest?.isSaved ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
        
        {/* Add Another Guest */}
        {config?.additional_guests_optional && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddGuest}
            className="w-full mt-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Guest
          </Button>
        )}
        
        {/* Continue to Next Step */}
        {currentGuest?.isSaved && (
          <Button
            type="button"
            onClick={handleContinue}
            className="w-full mt-6"
          >
            Continue to Next Step →
          </Button>
        )}
        
        {/* Hint */}
        {reservationInfo?.totalAdults && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            {reservationInfo.totalAdults} adults expected for this reservation
          </p>
        )}
      </main>
    </div>
  );
};

export default CheckinGuestDetails;
