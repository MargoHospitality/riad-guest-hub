import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-4">
        {/* Logo or spinner */}
        <div className="relative">
          <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
        </div>
        <p className="text-neutral-600 text-sm font-medium">Chargement...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
