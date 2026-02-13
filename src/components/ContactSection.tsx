import { MessageCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const WHATSAPP_NUMBER = "212600000000";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-4 pt-4 pb-0">
      <div className="bg-primary/80 rounded-2xl overflow-hidden">
        {/* Contact row */}
        <div className="px-4 py-3.5 text-center">
          <p className="text-[13px] font-medium text-primary-foreground/90">
            {t('contact.needHelp', 'Une question ? Contactez-nous')}
          </p>
        </div>
        <div className="flex border-t border-primary-foreground/10">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour, je vous contacte depuis l'application Guest.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-primary-foreground/5 transition-colors border-r border-primary-foreground/10"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span className="text-[13px] font-medium text-primary-foreground/90">WhatsApp</span>
          </a>
          <a
            href="mailto:contact@riad-massiba.com"
            className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-primary-foreground/5 transition-colors"
          >
            <Mail className="w-4 h-4 text-primary-foreground/60" />
            <span className="text-[13px] font-medium text-primary-foreground/90">Email</span>
          </a>
        </div>
        {/* Footer integrated */}
        <div className="border-t border-primary-foreground/10 py-3 px-4">
          <p className="text-center text-[10px] text-primary-foreground/40 tracking-wide font-light">
            Created with Love{" "}
            <span className="text-primary-foreground/60">🤍</span>
            {" "}by{" "}
            <a
              href="https://www.margo-hospitality.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/60 font-medium hover:text-primary-foreground transition-colors"
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
