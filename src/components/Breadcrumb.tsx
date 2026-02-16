import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { withToken } from "@/lib/navigation";

interface BreadcrumbProps {
  currentPage: string;
}

const Breadcrumb = ({ currentPage }: BreadcrumbProps) => {
  const { token } = useApp();
  
  return (
    <nav 
      className="flex items-center px-4 py-2 bg-card border-b border-border text-sm"
      aria-label="Fil d'Ariane"
    >
      <Link 
        to={withToken("/", token)} 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Accueil
      </Link>
      <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
      <span className="text-foreground font-medium">{currentPage}</span>
    </nav>
  );
};

export default Breadcrumb;
