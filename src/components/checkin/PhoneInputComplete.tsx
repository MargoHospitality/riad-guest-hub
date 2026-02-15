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

// Liste complète des pays avec codes téléphoniques
const countries = [
  { code: "+93", flag: "🇦🇫", name: "Afghanistan" },
  { code: "+355", flag: "🇦🇱", name: "Albanie" },
  { code: "+213", flag: "🇩🇿", name: "Algérie" },
  { code: "+376", flag: "🇦🇩", name: "Andorre" },
  { code: "+244", flag: "🇦🇴", name: "Angola" },
  { code: "+54", flag: "🇦🇷", name: "Argentine" },
  { code: "+374", flag: "🇦🇲", name: "Arménie" },
  { code: "+61", flag: "🇦🇺", name: "Australie" },
  { code: "+43", flag: "🇦🇹", name: "Autriche" },
  { code: "+994", flag: "🇦🇿", name: "Azerbaïdjan" },
  { code: "+973", flag: "🇧🇭", name: "Bahreïn" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+375", flag: "🇧🇾", name: "Biélorussie" },
  { code: "+32", flag: "🇧🇪", name: "Belgique" },
  { code: "+229", flag: "🇧🇯", name: "Bénin" },
  { code: "+975", flag: "🇧🇹", name: "Bhoutan" },
  { code: "+591", flag: "🇧🇴", name: "Bolivie" },
  { code: "+387", flag: "🇧🇦", name: "Bosnie-Herzégovine" },
  { code: "+267", flag: "🇧🇼", name: "Botswana" },
  { code: "+55", flag: "🇧🇷", name: "Brésil" },
  { code: "+673", flag: "🇧🇳", name: "Brunei" },
  { code: "+359", flag: "🇧🇬", name: "Bulgarie" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "+855", flag: "🇰🇭", name: "Cambodge" },
  { code: "+237", flag: "🇨🇲", name: "Cameroun" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+238", flag: "🇨🇻", name: "Cap-Vert" },
  { code: "+236", flag: "🇨🇫", name: "Rép. centrafricaine" },
  { code: "+235", flag: "🇹🇩", name: "Tchad" },
  { code: "+56", flag: "🇨🇱", name: "Chili" },
  { code: "+86", flag: "🇨🇳", name: "Chine" },
  { code: "+57", flag: "🇨🇴", name: "Colombie" },
  { code: "+269", flag: "🇰🇲", name: "Comores" },
  { code: "+242", flag: "🇨🇬", name: "Congo-Brazzaville" },
  { code: "+243", flag: "🇨🇩", name: "Congo-Kinshasa" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+385", flag: "🇭🇷", name: "Croatie" },
  { code: "+53", flag: "🇨🇺", name: "Cuba" },
  { code: "+357", flag: "🇨🇾", name: "Chypre" },
  { code: "+420", flag: "🇨🇿", name: "Tchéquie" },
  { code: "+45", flag: "🇩🇰", name: "Danemark" },
  { code: "+253", flag: "🇩🇯", name: "Djibouti" },
  { code: "+593", flag: "🇪🇨", name: "Équateur" },
  { code: "+20", flag: "🇪🇬", name: "Égypte" },
  { code: "+503", flag: "🇸🇻", name: "Salvador" },
  { code: "+240", flag: "🇬🇶", name: "Guinée équatoriale" },
  { code: "+291", flag: "🇪🇷", name: "Érythrée" },
  { code: "+372", flag: "🇪🇪", name: "Estonie" },
  { code: "+251", flag: "🇪🇹", name: "Éthiopie" },
  { code: "+358", flag: "🇫🇮", name: "Finlande" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "+220", flag: "🇬🇲", name: "Gambie" },
  { code: "+995", flag: "🇬🇪", name: "Géorgie" },
  { code: "+49", flag: "🇩🇪", name: "Allemagne" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+30", flag: "🇬🇷", name: "Grèce" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "+224", flag: "🇬🇳", name: "Guinée" },
  { code: "+245", flag: "🇬🇼", name: "Guinée-Bissau" },
  { code: "+509", flag: "🇭🇹", name: "Haïti" },
  { code: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+36", flag: "🇭🇺", name: "Hongrie" },
  { code: "+354", flag: "🇮🇸", name: "Islande" },
  { code: "+91", flag: "🇮🇳", name: "Inde" },
  { code: "+62", flag: "🇮🇩", name: "Indonésie" },
  { code: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "+964", flag: "🇮🇶", name: "Irak" },
  { code: "+353", flag: "🇮🇪", name: "Irlande" },
  { code: "+972", flag: "🇮🇱", name: "Israël" },
  { code: "+39", flag: "🇮🇹", name: "Italie" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+81", flag: "🇯🇵", name: "Japon" },
  { code: "+962", flag: "🇯🇴", name: "Jordanie" },
  { code: "+7", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+965", flag: "🇰🇼", name: "Koweït" },
  { code: "+996", flag: "🇰🇬", name: "Kirghizistan" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+371", flag: "🇱🇻", name: "Lettonie" },
  { code: "+961", flag: "🇱🇧", name: "Liban" },
  { code: "+266", flag: "🇱🇸", name: "Lesotho" },
  { code: "+231", flag: "🇱🇷", name: "Liberia" },
  { code: "+218", flag: "🇱🇾", name: "Libye" },
  { code: "+423", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "+370", flag: "🇱🇹", name: "Lituanie" },
  { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+261", flag: "🇲🇬", name: "Madagascar" },
  { code: "+265", flag: "🇲🇼", name: "Malawi" },
  { code: "+60", flag: "🇲🇾", name: "Malaisie" },
  { code: "+960", flag: "🇲🇻", name: "Maldives" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+356", flag: "🇲🇹", name: "Malte" },
  { code: "+222", flag: "🇲🇷", name: "Mauritanie" },
  { code: "+230", flag: "🇲🇺", name: "Maurice" },
  { code: "+52", flag: "🇲🇽", name: "Mexique" },
  { code: "+373", flag: "🇲🇩", name: "Moldavie" },
  { code: "+377", flag: "🇲🇨", name: "Monaco" },
  { code: "+976", flag: "🇲🇳", name: "Mongolie" },
  { code: "+382", flag: "🇲🇪", name: "Monténégro" },
  { code: "+212", flag: "🇲🇦", name: "Maroc" },
  { code: "+258", flag: "🇲🇿", name: "Mozambique" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar" },
  { code: "+264", flag: "🇳🇦", name: "Namibie" },
  { code: "+977", flag: "🇳🇵", name: "Népal" },
  { code: "+31", flag: "🇳🇱", name: "Pays-Bas" },
  { code: "+64", flag: "🇳🇿", name: "Nouvelle-Zélande" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+227", flag: "🇳🇪", name: "Niger" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+850", flag: "🇰🇵", name: "Corée du Nord" },
  { code: "+389", flag: "🇲🇰", name: "Macédoine du Nord" },
  { code: "+47", flag: "🇳🇴", name: "Norvège" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+970", flag: "🇵🇸", name: "Palestine" },
  { code: "+507", flag: "🇵🇦", name: "Panama" },
  { code: "+675", flag: "🇵🇬", name: "Papouasie-N.-Guinée" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+51", flag: "🇵🇪", name: "Pérou" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+48", flag: "🇵🇱", name: "Pologne" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+40", flag: "🇷🇴", name: "Roumanie" },
  { code: "+7", flag: "🇷🇺", name: "Russie" },
  { code: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "+966", flag: "🇸🇦", name: "Arabie saoudite" },
  { code: "+221", flag: "🇸🇳", name: "Sénégal" },
  { code: "+381", flag: "🇷🇸", name: "Serbie" },
  { code: "+248", flag: "🇸🇨", name: "Seychelles" },
  { code: "+65", flag: "🇸🇬", name: "Singapour" },
  { code: "+421", flag: "🇸🇰", name: "Slovaquie" },
  { code: "+386", flag: "🇸🇮", name: "Slovénie" },
  { code: "+252", flag: "🇸🇴", name: "Somalie" },
  { code: "+27", flag: "🇿🇦", name: "Afrique du Sud" },
  { code: "+82", flag: "🇰🇷", name: "Corée du Sud" },
  { code: "+211", flag: "🇸🇸", name: "Soudan du Sud" },
  { code: "+34", flag: "🇪🇸", name: "Espagne" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+249", flag: "🇸🇩", name: "Soudan" },
  { code: "+46", flag: "🇸🇪", name: "Suède" },
  { code: "+41", flag: "🇨🇭", name: "Suisse" },
  { code: "+963", flag: "🇸🇾", name: "Syrie" },
  { code: "+886", flag: "🇹🇼", name: "Taïwan" },
  { code: "+992", flag: "🇹🇯", name: "Tadjikistan" },
  { code: "+255", flag: "🇹🇿", name: "Tanzanie" },
  { code: "+66", flag: "🇹🇭", name: "Thaïlande" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+216", flag: "🇹🇳", name: "Tunisie" },
  { code: "+90", flag: "🇹🇷", name: "Turquie" },
  { code: "+993", flag: "🇹🇲", name: "Turkménistan" },
  { code: "+256", flag: "🇺🇬", name: "Ouganda" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "+971", flag: "🇦🇪", name: "Émirats arabes unis" },
  { code: "+44", flag: "🇬🇧", name: "Royaume-Uni" },
  { code: "+1", flag: "🇺🇸", name: "États-Unis" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+998", flag: "🇺🇿", name: "Ouzbékistan" },
  { code: "+678", flag: "🇻🇺", name: "Vanuatu" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+967", flag: "🇾🇪", name: "Yémen" },
  { code: "+260", flag: "🇿🇲", name: "Zambie" },
  { code: "+263", flag: "🇿🇼", name: "Zimbabwe" },
];

const PhoneInputComplete = ({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
}: PhoneInputProps) => {
  const selectedCountry = countries.find((c) => c.code === countryCode) || countries.find((c) => c.code === "+212");

  const handlePhoneChange = (newValue: string) => {
    // Remove leading 0 if present
    const cleanValue = newValue.startsWith('0') ? newValue.substring(1) : newValue;
    onChange(cleanValue);
  };

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={onCountryCodeChange}>
        <SelectTrigger className="w-32 h-10 bg-card border-border rounded-lg">
          <SelectValue>
            <span className="flex items-center gap-1.5">
              <span className="text-base">{selectedCountry?.flag}</span>
              <span className="text-xs text-muted-foreground">{selectedCountry?.code}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {countries.map((country, index) => (
            <SelectItem key={`${country.code}-${index}`} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="text-sm">{country.name}</span>
                <span className="text-xs text-muted-foreground">{country.code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={value}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder="6XX XX XX XX"
        className="flex-1 h-10 bg-card border-border rounded-lg text-foreground"
      />
    </div>
  );
};

export default PhoneInputComplete;
