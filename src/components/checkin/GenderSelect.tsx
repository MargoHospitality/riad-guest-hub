import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const genderOptions = [
  { value: "not_specified", label: "Non spécifié" },
  { value: "male", label: "Homme" },
  { value: "female", label: "Femme" },
  { value: "other", label: "Autre" },
];

const GenderSelect = ({ value, onChange }: GenderSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-14 bg-card border-border rounded-xl">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Genre</span>
            <SelectValue placeholder="Non spécifié" />
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>
        {genderOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default GenderSelect;
