import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language === 'en' ? 'EN' : 'FR';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-secondary flex items-center gap-1.5">
        <Globe className="w-5 h-5 text-foreground" />
        <span className="text-sm font-medium text-foreground">{currentLang}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('fr')}>
          🇫🇷 Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
