const Footer = () => {
  return (
    <footer className="mt-auto mx-4 mb-4 bg-primary/80 rounded-2xl">
      <div className="flex items-center justify-center px-4 py-5">
        <span className="text-primary-foreground/70 text-[11px] tracking-wide font-light">
          Created with Love{" "}
          <span className="text-primary-foreground/90">🤍</span>
          {" "}by{" "}
          <a
            href="https://www.margo-hospitality.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground/90 font-medium hover:text-primary-foreground transition-colors"
          >
            Margo Hospitality
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
