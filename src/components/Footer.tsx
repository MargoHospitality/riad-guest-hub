const Footer = () => {
  return (
    <footer className="bg-primary mt-auto">
      <div className="flex items-center justify-center px-4 py-4">
        <span className="text-primary-foreground/80 text-sm tracking-wide font-light">
          Created with Love{" "}
          <span className="text-primary-foreground">🤍</span>
          {" "}by{" "}
          <a
            href="https://www.margo-hospitality.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground font-medium hover:underline transition-opacity"
          >
            Margo Hospitality
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
