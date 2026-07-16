import { leadProjects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MetricStat } from "@/components/ui/MetricStat";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";

export function LeadProjects() {
  return (
    <section id="work" className="py-20 scroll-mt-16">
      <SectionHeading kicker="Selected work" title="Two projects, honestly measured." />

      <div>
        {leadProjects.map((project) => (
          <Reveal key={project.slug}>
            <article className="border-t border-line py-14 grid gap-10 lg:grid-cols-[1fr_minmax(220px,280px)]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-3">
                  {project.framing}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl tracking-tight text-ink">
                  {project.title}
                </h3>
                <p className="mt-5 max-w-xl text-ink-muted leading-relaxed">
                  {project.problem}
                </p>

                <ul className="mt-6 space-y-2 max-w-xl">
                  {project.built.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed">
                      <span className="text-pitch font-mono shrink-0" aria-hidden>
                        -
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  {project.links
                    .filter((link) => link.href !== "")
                    .map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          link.kind === "demo"
                            ? "font-mono text-sm bg-pitch hover:bg-pitch-deep text-paper px-4 py-2.5 rounded-full transition-colors"
                            : "font-mono text-sm border border-line hover:border-pitch text-ink px-4 py-2.5 rounded-full transition-colors"
                        }
                      >
                        {link.label} ↗
                      </a>
                    ))}
                </div>
              </div>

              <aside className="flex flex-row lg:flex-col flex-wrap gap-10 lg:gap-12 lg:border-l lg:border-line lg:pl-10 lg:pt-2">
                {project.metrics.map((metric) => (
                  <MetricStat key={metric.label} {...metric} />
                ))}
              </aside>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
