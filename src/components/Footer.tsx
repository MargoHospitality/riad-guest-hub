const Footer = () => {
  return (
    <footer className="mt-auto">
      <div className="bg-gradient-to-t from-primary/15 to-transparent pt-8 pb-5">
        <div className="flex items-center justify-center px-4">
          <span className="text-primary/50 text-[11px] tracking-wide font-light">
            Created with Love{" "}
            <span className="text-accent/50">♥</span>
            {" "}by{" "}
            <a
              href="https://www.margo-hospitality.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 font-medium hover:text-accent transition-colors"
            >
              Margo Hospitality
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
