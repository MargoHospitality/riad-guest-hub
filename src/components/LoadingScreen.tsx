import margoLogo from "@/assets/margo-hospitality-white.png";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5 animate-in fade-in duration-700">
        <img 
          src={margoLogo} 
          alt="Margo Hospitality" 
          className="h-5 object-contain opacity-40"
        />

        <div className="w-16 h-[1px] bg-border rounded-full overflow-hidden">
          <div className="h-full bg-muted-foreground/40 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
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
