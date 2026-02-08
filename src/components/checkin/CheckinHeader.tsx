import { ArrowLeft, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/logo.png";

interface CheckinHeaderProps {
  backPath?: string;
  token?: string;
}

const CheckinHeader = ({ backPath, token }: CheckinHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(`${backPath}${token ? `?token=${token}` : ""}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <button
        onClick={handleBack}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>
      <Link to="/">
        <img src={logo} alt="Riad Massiba" className="h-12 hover:opacity-80 transition-opacity" />
      </Link>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors">
        <User className="w-5 h-5 text-foreground" />
      </button>
    </header>
  );
};

export default CheckinHeader;
