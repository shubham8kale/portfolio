import { site } from "@/content/site";

const footerLink =
  "text-ink-muted hover:text-pitch underline underline-offset-4 decoration-line hover:decoration-pitch transition-colors";

export function Footer() {
  return (
    // Extra bottom padding on phones keeps the floating chat button off the links.
    <footer id="contact" className="border-t border-line pt-14 pb-28 sm:pb-14 mt-10 scroll-mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-6">
        <div>
          <p className="font-display text-2xl text-ink">
            Email is the fastest way to reach me.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a className={footerLink} href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a className={footerLink} href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a className={footerLink} href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a className={footerLink} href={site.resumePath} download>
              Résumé (PDF)
            </a>
          </div>
        </div>
        <p className="font-mono text-xs text-ink-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
