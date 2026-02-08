import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
}

const countries = [
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+1", flag: "🇺🇸", name: "États-Unis" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+212", flag: "🇲🇦", name: "Maroc" },
  { code: "+44", flag: "🇬🇧", name: "Royaume-Uni" },
  { code: "+49", flag: "🇩🇪", name: "Allemagne" },
  { code: "+34", flag: "🇪🇸", name: "Espagne" },
  { code: "+39", flag: "🇮🇹", name: "Italie" },
  { code: "+41", flag: "🇨🇭", name: "Suisse" },
  { code: "+32", flag: "🇧🇪", name: "Belgique" },
];

const PhoneInput = ({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
}: PhoneInputProps) => {
  const selectedCountry = countries.find((c) => c.code === countryCode) || countries[0];

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={onCountryCodeChange}>
        <SelectTrigger className="w-24 h-14 bg-card border-border rounded-xl">
          <SelectValue>
            <span className="flex items-center gap-1">
              <span className="text-lg">{selectedCountry.flag}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={`${country.code}-${country.name}`} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <span className="text-muted-foreground">{country.code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="+1 (514) 581-9993"
        className="flex-1 h-14 bg-card border-border rounded-xl text-foreground"
      />
    </div>
  );
};

export default PhoneInput;
