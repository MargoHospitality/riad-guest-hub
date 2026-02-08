import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Language = "FR" | "EN";

const flags: Record<Language, string> = {
  FR: "🇫🇷",
  EN: "🇬🇧",
};

const LanguageSelector = () => {
  const [language, setLanguage] = useState<Language>("FR");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm font-medium">
          <span className="text-base">{flags[language]}</span>
          <span className="text-foreground">{language}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[100px] bg-card z-50">
        <DropdownMenuItem 
          onClick={() => setLanguage("FR")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-base">🇫🇷</span>
          <span>Français</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("EN")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-base">🇬🇧</span>
          <span>English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
