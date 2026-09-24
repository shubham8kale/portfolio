import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { leadProjects } from "@/content/projects";
import { site } from "@/content/site";
import { MetricStat } from "@/components/ui/MetricStat";
import { Tag } from "@/components/ui/Tag";
import { ProjectDiagram } from "@/components/diagrams/ProjectDiagram";
import { ProjectShot } from "@/components/work/ProjectShot";
import { ProjectLinks } from "@/components/work/ProjectLinks";

// Only the lead projects have write-ups; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return leadProjects.map((project) => ({ slug: project.slug }));
}

function findProject(slug: string) {
  return leadProjects.find((project) => project.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const title = `${project.title} - ${site.name}`;
  return {
    title,
    description: project.tagline,
    openGraph: { title, description: project.tagline, url: `${site.url}/work/${slug}` },
    twitter: { title, description: project.tagline },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const index = leadProjects.indexOf(project);
  const next = leadProjects[(index + 1) % leadProjects.length];

  return (
    <main id="main" tabIndex={-1} className="outline-none pt-10 pb-16">
      <Link
        href={`/#${project.slug}`}
        className="text-sm text-ink-muted hover:text-pitch transition-colors"
      >
        ← Back to all work
      </Link>

      <header className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-3">
          {project.framing}
        </p>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-ink">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-muted leading-relaxed">
          {project.problem}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ProjectLinks links={project.links} />
        </div>
      </header>

      <section
        aria-label="Results"
        className="mt-14 grid gap-10 border-y border-line py-10 sm:grid-cols-3"
      >
        {project.metrics.map((metric) => (
          <MetricStat key={metric.label} {...metric} />
        ))}
      </section>

      <div className="mt-14">
        <ProjectDiagram slug={project.slug} />
      </div>

      <div
        className={
          project.image
            ? "mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
            : "mt-14 max-w-2xl"
        }
      >
        {project.image && (
          <div className="min-w-0">
            <div className="lg:sticky lg:top-24">
              <ProjectShot image={project.image} priority />
            </div>
          </div>
        )}

        <div className="space-y-12 min-w-0">
          <section>
            <h2 className="font-display text-2xl text-ink">What I built</h2>
            <ul className="mt-4 space-y-2.5">
              {project.built.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span className="text-pitch font-mono shrink-0" aria-hidden>
                    -
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {project.details.map((detail) => (
            <section key={detail.heading}>
              <h2 className="font-display text-2xl text-ink">{detail.heading}</h2>
              <div className="mt-4 space-y-3">
                {detail.body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="font-display text-2xl text-ink">Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </section>
        </div>
      </div>

      {next && next.slug !== project.slug && (
        <Link
          href={`/work/${next.slug}`}
          className="group mt-20 block rounded-2xl border border-line p-6 transition-colors hover:border-pitch"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            Next project
          </span>
          <span className="mt-2 block font-display text-3xl text-ink group-hover:text-pitch transition-colors">
            {next.title} →
          </span>
          <span className="mt-2 block text-ink-muted">{next.tagline}</span>
        </Link>
      )}
    </main>
  );
}
