import type { ProjectLink } from "@/content/projects";

export function ProjectLinks({ links }: { links: ProjectLink[] }) {
  return (
    <>
      {links
        .filter((link) => link.href !== "")
        .map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              link.kind === "demo"
                ? "text-sm font-medium bg-pitch hover:bg-pitch-deep text-paper px-4 py-2.5 rounded-full transition-colors"
                : "text-sm font-medium border border-line hover:border-pitch text-ink px-4 py-2.5 rounded-full transition-colors"
            }
          >
            {link.label} ↗
            {link.note && (
              <span className="ml-1.5 font-normal opacity-80">({link.note})</span>
            )}
          </a>
        ))}
    </>
  );
}
