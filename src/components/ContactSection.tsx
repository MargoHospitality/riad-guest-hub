import { Phone, Mail, MessageCircle } from "lucide-react";

const contacts = [
  { icon: Phone, label: "Appelez nous !" },
  { icon: Mail, label: "Envoyez un email" },
  { icon: MessageCircle, label: "Textez nous !" },
];

const ContactSection = () => (
  <section className="px-4 pb-6">
    <h2 className="text-xl font-bold text-foreground mb-4 font-serif">Contactez-nous</h2>
    <div className="grid grid-cols-3 gap-3">
      {contacts.map((c, i) => (
        <button
          key={i}
          className="flex flex-col items-center gap-2 py-4 px-2 border border-primary rounded-xl hover:bg-secondary/50 transition-colors"
        >
          <c.icon className="w-6 h-6 text-accent" />
          <span className="text-sm text-center font-medium text-foreground">{c.label}</span>
        </button>
      ))}
    </div>
  </section>
);

export default ContactSection;
