import { site } from "@/content/site";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line py-14 mt-10 scroll-mt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-6">
        <div>
          <p className="font-display text-2xl text-ink">
            Say hello - I answer email fast.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
            <a
              className="text-ink-muted hover:text-pitch underline underline-offset-4 decoration-line hover:decoration-pitch transition-colors"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
            <a
              className="text-ink-muted hover:text-pitch underline underline-offset-4 decoration-line hover:decoration-pitch transition-colors"
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              className="text-ink-muted hover:text-pitch underline underline-offset-4 decoration-line hover:decoration-pitch transition-colors"
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
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
