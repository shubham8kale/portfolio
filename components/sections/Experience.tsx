import { experience } from "@/content/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MetricStat } from "@/components/ui/MetricStat";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  return (
    <section id="experience" className="py-20 scroll-mt-16">
      <SectionHeading
        kicker="The day job"
        title="Shipped to production, used daily."
      />
      <Reveal>
        <article className="border-t border-line py-14 grid gap-10 lg:grid-cols-[1fr_minmax(220px,280px)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-3">
              {experience.framing}
            </p>
            <h3 className="font-display text-3xl sm:text-4xl tracking-tight text-ink">
              {experience.role}
            </h3>
            <p className="mt-2 font-mono text-sm text-ink-muted">
              {experience.employer}
            </p>
            <p className="mt-5 max-w-xl text-ink-muted leading-relaxed">
              {experience.summary}
            </p>

            <ul className="mt-6 space-y-2 max-w-xl">
              {experience.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <span className="text-pitch font-mono shrink-0" aria-hidden>
                    -
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-row lg:flex-col flex-wrap gap-10 lg:gap-12 lg:border-l lg:border-line lg:pl-10 lg:pt-2">
            {experience.metrics.map((metric) => (
              <MetricStat key={metric.label} {...metric} />
            ))}
          </aside>
        </article>
      </Reveal>
    </section>
  );
}
