/**
 * Slim footer bar — just the green "Created with Love by Margo Hospitality" strip.
 * Used on all pages except the homepage (which uses the full ContactSection).
 */
const FooterBar = () => (
  <section className="px-4 pt-4">
    <div className="rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-primary py-3 px-4">
        <p className="text-center text-[11px] text-primary-foreground/80 tracking-wide font-light">
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
        </p>
      </div>
    </div>
  </section>
);

export default FooterBar;
