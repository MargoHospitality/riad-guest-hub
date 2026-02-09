import { MessageCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const WHATSAPP_NUMBER = "212600000000";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-4 pt-4 pb-6">
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 text-center">
          <p className="text-[13px] font-medium text-foreground">
            {t('contact.needHelp', 'Une question ? Contactez-nous')}
          </p>
        </div>
        <div className="flex border-t border-border">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour, je vous contacte depuis l'application Guest.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-secondary/40 transition-colors border-r border-border"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span className="text-[13px] font-medium text-foreground">WhatsApp</span>
          </a>
          <a
            href="mailto:contact@riad-massiba.com"
            className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-secondary/40 transition-colors"
          >
            <Mail className="w-4 h-4 text-accent" />
            <span className="text-[13px] font-medium text-foreground">Email</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
