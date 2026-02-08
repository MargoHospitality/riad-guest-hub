import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const countries = [
  { code: "", name: "-" },
  { code: "MA", name: "Maroc" },
  { code: "FR", name: "France" },
  { code: "CA", name: "Canada" },
  { code: "US", name: "États-Unis" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "DE", name: "Allemagne" },
  { code: "ES", name: "Espagne" },
  { code: "IT", name: "Italie" },
  { code: "CH", name: "Suisse" },
  { code: "BE", name: "Belgique" },
  { code: "NL", name: "Pays-Bas" },
  { code: "PT", name: "Portugal" },
  { code: "AT", name: "Autriche" },
  { code: "AU", name: "Australie" },
  { code: "JP", name: "Japon" },
  { code: "CN", name: "Chine" },
  { code: "BR", name: "Brésil" },
  { code: "MX", name: "Mexique" },
  { code: "AE", name: "Émirats arabes unis" },
];

const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-14 bg-card border-border rounded-xl">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Pays</span>
            <SelectValue placeholder="-" />
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code || "empty"} value={country.code || "none"}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
