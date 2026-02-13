const Footer = () => {
  return (
    <footer className="mt-auto py-6 px-4">
      <div className="flex items-center justify-center gap-2">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-[10px] text-muted-foreground/50 tracking-wider whitespace-nowrap">
          Made with <span className="text-accent">♥</span> by{" "}
          <a
            href="https://www.margo-hospitality.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/40 font-medium hover:text-accent transition-colors"
          >
            Margo Hospitality
          </a>
        </span>
        <div className="flex-1 h-px bg-border/60" />
      </div>
    </footer>
  );
};

export default Footer;
