const Footer = () => {
  return (
    <footer className="mt-auto bg-primary/10 rounded-t-2xl">
      <div className="flex items-center justify-center px-4 py-4">
        <span className="text-primary/60 text-[11px] tracking-wide font-light">
          Created with Love{" "}
          <span className="text-accent/60">♥</span>
          {" "}by{" "}
          <a
            href="https://www.margo-hospitality.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:text-accent transition-colors"
          >
            Margo Hospitality
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
