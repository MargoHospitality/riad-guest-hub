const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
        {/* Margo Hospitality logo with pulsing animation */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-neutral-200 opacity-30 absolute animate-ping" />
          <div className="w-24 h-24 flex items-center justify-center">
            <img 
              src="/margo-logo.png" 
              alt="Margo Hospitality" 
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
