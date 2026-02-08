const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
        {/* Elegant logo placeholder with pulsing animation */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 opacity-20 absolute animate-ping" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neutral-400 to-neutral-500 flex items-center justify-center shadow-xl">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
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
