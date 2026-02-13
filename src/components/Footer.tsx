import margoLogo from "@/assets/margo-hospitality-white.png";

const Footer = () => {
  return (
    <footer className="mt-auto mx-4 mb-4 rounded-2xl bg-foreground/90 px-5 py-5">
      <div className="flex flex-col items-center gap-3">
        <a
          href="https://www.margo-hospitality.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={margoLogo} alt="Margo Hospitality" className="h-6 opacity-80 hover:opacity-100 transition-opacity" />
        </a>
        <div className="w-8 h-px bg-white/15" />
        <p className="text-[11px] text-white/40 tracking-wide font-light">
          Created with Love <span className="text-white/60">♥</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
