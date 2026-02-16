import { useTranslation } from "react-i18next";
import margoLogo from "@/assets/margo-hospitality-logo.png";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#f7f9fa' }}>
      <div className="w-full max-w-sm space-y-8">
        {/* Logo & Separator */}
        <div className="flex flex-col items-center space-y-6">
          <img src={margoLogo} alt="Margo Hospitality" className="h-24 w-auto" />
          <div className="w-12 h-px" style={{ backgroundColor: '#1a9a9a' }} />
        </div>

        {/* 404 Message */}
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-bold font-serif" style={{ color: '#2c3e50' }}>404</h1>
          <p className="text-sm tracking-wide font-light" style={{ color: '#7a8fa0', letterSpacing: '0.08em' }}>
            {t('notFound.message', 'Cette page est introuvable')}
          </p>
          <p className="text-xs" style={{ color: '#9aabb8' }}>
            {t('notFound.subtitle', "The page you're looking for doesn't exist.")}
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <a
            href="/"
            className="w-full h-12 text-base font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl flex items-center justify-center"
            style={{ backgroundColor: '#1a9a9a', color: '#ffffff' }}
          >
            {t('notFound.backHome', "Retour à l'accueil")}
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-xs" style={{ color: '#9aabb8' }}>
          {t('notFound.help', "Besoin d'aide ? Contactez directement votre établissement.")}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
