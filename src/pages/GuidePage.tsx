import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Smartphone, Lightbulb } from "lucide-react";
import patioImg from "@/assets/patio.jpg";

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <Header />
      <Breadcrumb currentPage="Comment utiliser la Guest App" />
      
      {/* Hero Image */}
      <div className="w-full h-56">
        <img 
          src={patioImg} 
          alt="Cour intérieure du Riad Massiba" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="w-6 h-6 text-accent flex-shrink-0" />
          <h1 className="text-lg sm:text-2xl font-bold text-foreground font-serif whitespace-nowrap">
            Comment utiliser la Guest App
          </h1>
        </div>

        {/* Content */}
        <article className="text-foreground leading-relaxed space-y-4">
          <p>
            Notre Guest App est conçue pour vous fournir{" "}
            <strong>toutes les informations importantes dont vous pourriez avoir besoin pour préparer votre séjour</strong>. 
            Vous pouvez l'utiliser pour réserver un transport ou demander facilement des services additionnels.
          </p>

          <p>
            Veuillez noter que les articles disponibles en pré-réservation avant votre arrivée se trouvent dans la catégorie « <strong>Welcome Options</strong> ». 
            Tous les autres services pourront être commandés directement une fois arrivé au riad.
          </p>

          <p>
            Nous vous invitons à{" "}
            <strong>parcourir la Guest App et à découvrir toutes les options disponibles</strong>. 
            Si vous estimez qu'une information manque,{" "}
            <strong>n'hésitez pas à nous contacter directement via WhatsApp</strong>{" "}
            en utilisant les liens figurant également dans l'application — nous serons ravis de vous répondre.
          </p>

          {/* Features Section */}
          <h2 className="text-xl font-bold text-foreground font-serif pt-6">
            Fonctionnalités principales
          </h2>
          
          <ul className="space-y-3 pl-0">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span><strong>Enregistrement en ligne</strong> — Complétez vos informations avant votre arrivée</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span><strong>Service de transport</strong> — Réservez votre transfert aéroport via Margo Flow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span><strong>Bien-être & confort</strong> — Découvrez nos services spa et hammam</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span><strong>Wi-Fi</strong> — Connectez-vous facilement à notre réseau</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span><strong>Carte & itinéraire</strong> — Localisez le riad et les points d'intérêt</span>
            </li>
          </ul>

          {/* Tip Box */}
          <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-4 mt-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground">
                <strong>Astuce :</strong> Ajoutez cette application à votre écran d'accueil pour un accès rapide pendant votre séjour !
              </p>
            </div>
          </div>
        </article>
      </main>

      <div className="pb-10" />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default GuidePage;
