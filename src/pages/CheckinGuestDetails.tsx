/**
 * Check-in Guest Details - Multi-guest with pre-fill
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Users, Plus, CheckCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInputComplete from "@/components/checkin/PhoneInputComplete";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

import { useSaveCheckinResponse } from "@/hooks/useCheckinResponse";
import { useCheckinConfig } from "@/hooks/useCheckinConfig";
import { useToast } from "@/hooks/use-toast";

interface GuestForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [reservationInfo, setReservationInfo] = useState<any>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+212");
  
  const { data: config } = useCheckinConfig();
  const saveResponse = useSaveCheckinResponse();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
          
          // Pre-fill guests from guestList (if available)
          const guestList = result.data.guestList || [];
          
          if (guestList.length > 0) {
            // Use guestList from Cloudbeds
            setGuests(guestList.map((guest: any, index: number) => ({
              firstName: guest.firstName || '',
              lastName: guest.lastName || '',
              email: '', // Never pre-fill email (force user to enter real email)
              phone: guest.phone || '',
              isPrimary: index === 0,
              isSaved: false,
            })));
          } else {
            // Fallback: use guestName from booking lead
            const parsed = parseGuestName(result.data.guestName || '');
            setGuests([{
              firstName: parsed.firstName,
              lastName: parsed.lastName,
              email: '', // Never pre-fill email
              phone: result.data.guestPhone || '',
              isPrimary: true,
              isSaved: false,
            }]);
          }
        }
      } catch (error) {
        console.error('Failed to load reservation info:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de réservation",
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
      // Parse phone to extract country code and number
      const phone = currentGuest.phone || '';
      let extractedCode = '+212';
      let extractedNumber = '';
      
      if (phone.startsWith('+')) {
        // Liste des codes pays possibles triée par longueur décroissante
        const possibleCodes = ['+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39', '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49', '+51', '+52', '+53', '+54', '+55', '+56', '+57', '+58', '+60', '+61', '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92', '+93', '+94', '+95', '+98', '+212', '+213', '+216', '+218', '+220', '+221', '+222', '+223', '+224', '+225', '+226', '+227', '+228', '+229', '+230', '+231', '+233', '+234', '+235', '+236', '+237', '+238', '+239', '+240', '+241', '+242', '+243', '+244', '+245', '+248', '+249', '+250', '+251', '+252', '+253', '+254', '+255', '+256', '+257', '+258', '+260', '+261', '+262', '+263', '+264', '+265', '+266', '+267', '+268', '+269', '+290', '+291', '+297', '+298', '+299', '+350', '+351', '+352', '+353', '+354', '+355', '+356', '+357', '+358', '+359', '+370', '+371', '+372', '+373', '+374', '+375', '+376', '+377', '+378', '+380', '+381', '+382', '+385', '+386', '+387', '+389', '+420', '+421', '+423', '+500', '+501', '+502', '+503', '+504', '+505', '+506', '+507', '+508', '+509', '+590', '+591', '+592', '+593', '+594', '+595', '+596', '+597', '+598', '+599', '+670', '+672', '+673', '+674', '+675', '+676', '+677', '+678', '+679', '+680', '+681', '+682', '+683', '+685', '+686', '+687', '+688', '+689', '+690', '+691', '+692', '+850', '+852', '+853', '+855', '+856', '+880', '+886', '+960', '+961', '+962', '+963', '+964', '+965', '+966', '+967', '+968', '+970', '+971', '+972', '+973', '+974', '+975', '+976', '+977', '+992', '+993', '+994', '+995', '+996', '+998'];
        
        // Chercher le code le plus long qui matche
        for (const code of possibleCodes.sort((a, b) => b.length - a.length)) {
          if (phone.startsWith(code)) {
            extractedCode = code;
            extractedNumber = phone.substring(code.length);
            break;
          }
        }
        
        // Si aucun code trouvé, on prend les 4 premiers caractères max
        if (extractedNumber === '') {
          const match = phone.match(/^(\+\d{1,4})(.*)$/);
          if (match) {
            extractedCode = match[1];
            extractedNumber = match[2];
          }
        }
      } else {
        extractedNumber = phone;
      }
      
      setCountryCode(extractedCode);
      setPhoneNumber(extractedNumber);
      
      reset({
        firstName: currentGuest.firstName,
        lastName: currentGuest.lastName,
        email: currentGuest.email,
        phone: phone,
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
          email: g.email || undefined,
          phone: g.phone || undefined,
        })),
      });
      
      toast({
        title: t('checkin.guestDetails.saved'),
        description: t('checkin.guestDetails.guestSaved', { number: currentGuestIndex + 1 }),
      });
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: t('checkin.guestDetails.error'),
        description: t('checkin.guestDetails.failedToSave'),
        variant: "destructive",
      });
    }
  };
  
  const handleAddGuest = () => {
    // Use totalAdults from reservation as the hard limit
    const maxGuests = reservationInfo?.totalAdults || config?.max_additional_guests || 10;
    if (guests.length >= maxGuests) {
      toast({
        title: t('checkin.guestDetails.maxGuestsReached'),
        description: t('checkin.guestDetails.maxGuestsReachedDesc', { max: maxGuests }),
      });
      return;
    }
    
    setGuests([...guests, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      isPrimary: false,
      isSaved: false,
    }]);
    setCurrentGuestIndex(guests.length);
  };
  
  const handleContinue = () => {
    navigate(`/checkin/restaurant?token=${token}`);
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
                {t('checkin.guestDetails.title')}
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
                  {t('checkin.guestDetails.guest')} {index + 1}
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
                  : `${t('checkin.guestDetails.guest')} ${currentGuestIndex + 1}`}
              </p>
              {currentGuest?.isPrimary && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('checkin.guestDetails.completeDetails')}
                </p>
              )}
            </div>
            
            <div className="px-4 pb-4 space-y-4">
              {/* First & Last Name (always shown for non-primary, disabled if pre-filled) */}
              {!currentGuest?.isPrimary && (
                <>
                  <div>
                    <Label htmlFor="firstName" className="text-xs text-muted-foreground">{t('checkin.guestDetails.firstName')} *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", { required: t('checkin.guestDetails.firstNameRequired') })}
                      disabled={!!currentGuest?.firstName}
                      className="mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs text-muted-foreground">{t('checkin.guestDetails.lastName')} *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", { required: t('checkin.guestDetails.lastNameRequired') })}
                      disabled={!!currentGuest?.lastName}
                      className="mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </>
              )}
              
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-xs text-muted-foreground">{t('checkin.guestDetails.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: t('checkin.guestDetails.emailRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('checkin.guestDetails.emailInvalid')
                    }
                  })}
                  placeholder={t('checkin.guestDetails.emailPlaceholder')}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-xs text-muted-foreground">{t('checkin.guestDetails.phone')} *</Label>
                <div className="mt-1">
                  <PhoneInputComplete
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                      setValue('phone', `${countryCode}${value}`, { shouldValidate: true });
                    }}
                    countryCode={countryCode}
                    onCountryCodeChange={(code) => {
                      setCountryCode(code);
                      setValue('phone', `${code}${phoneNumber}`, { shouldValidate: true });
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              {/* Save button */}
              <button
                type="submit"
                disabled={saveResponse.isPending}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-primary/5 rounded-xl group hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-semibold text-primary">
                  {saveResponse.isPending ? t('checkin.guestDetails.saving') : currentGuest?.isSaved ? t('checkin.guestDetails.update') : t('checkin.guestDetails.save')}
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
                {t('checkin.guestDetails.addGuest')}
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
              <span className="text-sm font-semibold text-primary">{t('checkin.guestDetails.continue')}</span>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </button>
          )}
        </div>
        
        {/* Guest count badge */}
        {reservationInfo?.totalAdults && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-border">
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {t('checkin.guestDetails.adultsExpected', { count: reservationInfo.totalAdults })}
              </span>
            </div>
          </div>
        )}
      </main>
      
      
    </div>
  );
};

export default CheckinGuestDetails;
