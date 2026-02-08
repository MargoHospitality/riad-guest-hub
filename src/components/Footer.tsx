import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import margoLogo from "@/assets/margo-hospitality-white.png";

const Footer = () => {
  const { t } = useTranslation();
  const { branding } = useApp();
  
  const propertyName = branding?.property_name || "Riad Massiba";
  
  return (
    <footer className="bg-primary px-4 py-3 text-center">
      <p className="text-white text-sm mb-2">
        {t('footer.memberOf', { propertyName })}{" "}
        <a 
          href="https://www.margo-hospitality.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          Margo Hospitality
        </a>
      </p>
      <a 
        href="https://www.margo-hospitality.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block hover:opacity-80"
      >
        <img 
          src={margoLogo} 
          alt="Margo Hospitality" 
          className="h-5 mx-auto opacity-90"
        />
      </a>
    </footer>
  );
};

export default Footer;
