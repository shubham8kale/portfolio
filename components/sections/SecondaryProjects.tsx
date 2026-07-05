import { secondaryProjects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Hidden until content/projects.ts → secondaryProjects is filled (M0 item). */
export function SecondaryProjects() {
  if (secondaryProjects.length === 0) return null;

  return (
    <section className="py-20">
      <SectionHeading kicker="Also built" title="Smaller things." />
      <Reveal>
        <ul className="divide-y divide-line border-y border-line">
          {secondaryProjects.map((project) => (
            <li key={project.title}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5 hover:bg-paper-deep px-3 -mx-3 transition-colors"
              >
                <span className="font-mono text-sm text-ink group-hover:text-pitch transition-colors">
                  {project.title} ↗
                </span>
                <span className="text-sm text-ink-muted">{project.oneLiner}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
