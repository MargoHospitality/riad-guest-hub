import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "212600000000"; // Remplacez par votre numéro

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour, je vous contacte depuis l'application Guest.`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-current" />
    </button>
  );
};

export default WhatsAppButton;
