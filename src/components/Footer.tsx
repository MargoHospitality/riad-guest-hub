const Footer = () => {
  return (
    <footer className="mt-auto pt-8 pb-6 px-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground/60 tracking-widest uppercase font-light">
          Created with Love{" "}
          <span className="text-accent/50">♥</span>
          {" "}by{" "}
          <a
            href="https://www.margo-hospitality.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/80 hover:text-accent transition-colors"
          >
            Margo Hospitality
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
