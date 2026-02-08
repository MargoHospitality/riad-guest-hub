import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Info, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CheckinHeader from "@/components/checkin/CheckinHeader";
import CheckinProgressBar from "@/components/checkin/CheckinProgressBar";
import PhoneInput from "@/components/checkin/PhoneInput";
import GenderSelect from "@/components/checkin/GenderSelect";
import CountrySelect from "@/components/checkin/CountrySelect";

interface GuestDetailsForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  gender: string;
  country: string;
  arrivalTime: string;
  contactViaEmail: boolean;
  contactViaSMS: boolean;
}

const CheckinGuestDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo";

  // Multi-guest logic
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const totalGuests = 2; // Mock: would come from reservation data

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<GuestDetailsForm>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "+1",
      gender: "not_specified",
      country: "",
      arrivalTime: "",
      contactViaEmail: false,
      contactViaSMS: false,
    },
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const arrivalTime = watch("arrivalTime");

  const isFormValid = firstName?.trim() && lastName?.trim() && email?.trim() && email?.includes("@");

  const onSubmit = async (data: GuestDetailsForm) => {
    console.log("Submitting guest details:", data);

    // Mock API call to Cloudbeds
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (currentGuestIndex < totalGuests - 1) {
      // More guests to process
      setCurrentGuestIndex((prev) => prev + 1);
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "+1",
        gender: "not_specified",
        country: "",
        arrivalTime: "",
        contactViaEmail: false,
        contactViaSMS: false,
      });
    } else {
      // All guests processed, navigate to step 3
      navigate(`/checkin/step3?token=${token}`);
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <CheckinHeader backPath="/checkin/step1" token={token} />

      {/* Page Title */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl text-muted-foreground font-normal leading-tight">
          Vérifier les informations relatives aux voyageurs
        </h1>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 pb-28 space-y-4">
        {/* Section: Guest Details */}
        <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3">
          <User className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">
            Guest details {totalGuests > 1 && `(${currentGuestIndex + 1}/${totalGuests})`}
          </span>
        </div>

        {/* First Name & Last Name - Side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <Label className="text-xs text-muted-foreground mb-1 block">
              Prénom <span className="text-accent">*</span>
            </Label>
            <Input
              {...register("firstName", { required: true })}
              placeholder=""
              className="border-0 bg-transparent p-0 h-auto text-foreground focus-visible:ring-0 text-base"
            />
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <Label className="text-xs text-muted-foreground mb-1 block">
              Nom de famille <span className="text-accent">*</span>
            </Label>
            <Input
              {...register("lastName", { required: true })}
              placeholder=""
              className="border-0 bg-transparent p-0 h-auto text-foreground focus-visible:ring-0 text-base"
            />
          </div>
        </div>

        {/* Email */}
        <div className="bg-card border border-border rounded-xl p-4">
          <Label className="text-xs text-muted-foreground mb-1 block">
            E-mail <span className="text-accent">*</span>
          </Label>
          <Input
            {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
            type="email"
            placeholder=""
            className="border-0 bg-transparent p-0 h-auto text-foreground focus-visible:ring-0 text-base"
          />
        </div>

        {/* Phone */}
        <div className="bg-card border border-border rounded-xl p-4">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Téléphone mobile
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Controller
                name="countryCode"
                control={control}
                render={({ field: countryField }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    countryCode={countryField.value}
                    onCountryCodeChange={countryField.onChange}
                  />
                )}
              />
            )}
          />
        </div>

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <GenderSelect value={field.value} onChange={field.onChange} />
          )}
        />

        {/* Country */}
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountrySelect value={field.value} onChange={field.onChange} />
          )}
        />

        {/* Section: Additional Information */}
        <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3 mt-6">
          <Info className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">Additional information</span>
        </div>

        {/* Arrival Time */}
        <div className="bg-card border border-border rounded-xl p-4">
          <Label className="text-xs text-muted-foreground mb-1 block">
            Heure d'arrivée
          </Label>
          <div className="flex items-center justify-between">
            <Input
              type="time"
              {...register("arrivalTime")}
              className="border-0 bg-transparent p-0 h-auto text-foreground focus-visible:ring-0 text-base w-auto"
              placeholder="--:--"
            />
            {arrivalTime && (
              <button
                type="button"
                onClick={() => setValue("arrivalTime", "")}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="pt-4">
          <div className="flex items-center gap-6 mb-2">
            <span className="font-medium text-foreground">Me contacter via:</span>
            <div className="flex items-center gap-4">
              <Controller
                name="contactViaEmail"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="contactEmail"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="contactEmail" className="text-foreground cursor-pointer">
                      E-mail
                    </Label>
                  </div>
                )}
              />
              <Controller
                name="contactViaSMS"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="contactSMS"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="contactSMS" className="text-foreground cursor-pointer">
                      SMS
                    </Label>
                  </div>
                )}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            En sélectionnant ces options, vous acceptez de recevoir des actualités, des offres et des informations importantes de la part de Riad Massiba.
          </p>
        </div>
      </form>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <CheckinProgressBar currentStep={2} />
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isFormValid}
            className="px-8 h-12 text-base font-semibold"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckinGuestDetails;
