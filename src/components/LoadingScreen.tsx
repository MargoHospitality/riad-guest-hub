import margoLogo from "@/assets/margo-hospitality-white.png";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-foreground">
      <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
        {/* Logo with subtle glow */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-primary-foreground/10 animate-pulse" />
          <img 
            src={margoLogo} 
            alt="Margo Hospitality" 
            className="h-12 object-contain relative z-10"
          />
        </div>

        {/* Elegant loading bar */}
        <div className="w-24 h-0.5 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary-foreground/60 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>

        <p className="text-xs text-primary-foreground/50 font-light tracking-wide">
          Chargement…
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0; }
          50% { width: 100%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
