import Link from "next/link";
import { leadProjects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MetricStat } from "@/components/ui/MetricStat";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectDiagram } from "@/components/diagrams/ProjectDiagram";
import { ProjectShot } from "@/components/work/ProjectShot";
import { ProjectLinks } from "@/components/work/ProjectLinks";

function ProjectIndex() {
  return (
    <nav aria-label="Projects" className="mb-6">
      <ol className="grid gap-3 sm:grid-cols-3">
        {leadProjects.map((project, i) => {
          const lead = project.metrics[0];
          return (
            <li key={project.slug}>
              <a
                href={`#${project.slug}`}
                className="group flex h-full flex-col rounded-xl border border-line p-4 transition-colors hover:border-pitch"
              >
                <span className="font-mono text-xs text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 font-display text-xl text-ink group-hover:text-pitch transition-colors">
                  {project.title}
                </span>
                <span className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {project.tagline}
                </span>
                {lead && (
                  <span className="mt-auto pt-4 font-mono text-sm text-ink">
                    {lead.value}{" "}
                    <span className="text-pitch">{lead.label}</span>
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function LeadProjects() {
  return (
    <section id="work" className="py-20 scroll-mt-20">
      <SectionHeading kicker="Selected work" title="Three portfolio projects." />
      <ProjectIndex />

      <div>
        {leadProjects.map((project) => (
          <Reveal key={project.slug}>
            <article
              id={project.slug}
              className="scroll-mt-20 border-t border-line py-14 grid gap-10 lg:grid-cols-[1fr_minmax(220px,280px)]"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-3">
                  {project.framing}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl tracking-tight text-ink">
                  <Link
                    href={`/work/${project.slug}`}
                    className="hover:text-pitch transition-colors"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-5 max-w-xl text-ink-muted leading-relaxed">
                  {project.problem}
                </p>

                {project.image && (
                  <div className="mt-8 max-w-xl">
                    <ProjectShot image={project.image} />
                  </div>
                )}

                <details className="group mt-6 max-w-xl">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-ink hover:text-pitch transition-colors [&::-webkit-details-marker]:hidden">
                    <span
                      aria-hidden
                      className="inline-block font-mono transition-transform group-open:rotate-90"
                    >
                      ›
                    </span>
                    How it&apos;s built
                  </summary>
                  <ul className="mt-4 space-y-2">
                    {project.built.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed">
                        <span className="text-pitch font-mono shrink-0" aria-hidden>
                          -
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <ProjectLinks links={project.links} />
                  <Link
                    href={`/work/${project.slug}`}
                    className="text-sm font-medium text-ink underline underline-offset-4 decoration-line hover:decoration-pitch hover:text-pitch transition-colors"
                  >
                    Read the write-up →
                  </Link>
                </div>
              </div>

              <aside className="flex flex-row lg:flex-col flex-wrap gap-10 lg:gap-12 lg:border-l lg:border-line lg:pl-10 lg:pt-2">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="min-w-[200px] flex-1 lg:flex-none">
                    <MetricStat {...metric} />
                  </div>
                ))}
              </aside>

              <div className="lg:col-span-2 min-w-0">
                <ProjectDiagram slug={project.slug} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
