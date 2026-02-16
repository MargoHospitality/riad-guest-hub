import { MessageCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";

const ContactSection = () => {
  const { t } = useTranslation();
  const { branding } = useApp();
  
  // Format WhatsApp number (remove non-numeric characters except +)
  const formatWhatsAppNumber = (phone: string | undefined): string => {
    if (!phone) return "212600000000"; // Fallback
    return phone.replace(/[^\d]/g, ''); // Remove everything except digits
  };
  
  const whatsappNumber = formatWhatsAppNumber(branding?.contact_whatsapp);
  const contactEmail = branding?.contact_email || "contact@riad-massiba.com";

  return (
    <section className="px-4 pt-4">
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 text-center">
          <p className="text-[13px] font-medium text-foreground">
            {t('contact.needHelp', 'Une question ? Contactez-nous')}
          </p>
        </div>
        <div className="flex border-t border-border">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-secondary/40 transition-colors border-r border-border"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span className="text-[13px] font-medium text-foreground">WhatsApp</span>
          </a>
          <a
            href={`mailto:${contactEmail}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-secondary/40 transition-colors"
          >
            <Mail className="w-4 h-4 text-accent" />
            <span className="text-[13px] font-medium text-foreground">Email</span>
          </a>
        </div>
        {/* Footer integrated */}
        <div className="bg-primary py-3 px-4">
          <p className="text-center text-[11px] text-primary-foreground/80 tracking-wide font-light">
            Created with Love{" "}
            <span className="text-primary-foreground">🤍</span>
            {" "}by{" "}
            <a
              href="https://www.margo-hospitality.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground font-medium hover:underline transition-opacity"
            >
              Margo Hospitality
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
