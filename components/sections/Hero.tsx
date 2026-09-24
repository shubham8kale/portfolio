import { site } from "@/content/site";
import { experience } from "@/content/experience";
import { leadProjects, type Metric } from "@/content/projects";
import { ChatLauncher, HERO_CHAT_CTA_ID } from "@/components/chat/ChatLauncher";

/** Looks a metric up by label so the strip never restates a number. */
function pick(metrics: Metric[], label: string): Metric {
  const metric = metrics.find((m) => m.label === label);
  if (!metric) throw new Error(`Hero proof strip: no metric labelled "${label}"`);
  return metric;
}

const researchAgent = leadProjects.find((p) => p.slug === "financial-research-agent");

const PROOF = [
  {
    metric: pick(experience.metrics, "daily users"),
    where: "LLM assistant at work",
    href: "#experience",
  },
  ...(researchAgent
    ? [
        {
          metric: pick(researchAgent.metrics, "faithfulness"),
          where: "Financial Research Agent",
          href: `#${researchAgent.slug}`,
        },
      ]
    : []),
  {
    metric: pick(experience.metrics, "first-week sales lift"),
    where: "Store-placement model",
    href: "#experience",
  },
  {
    metric: pick(experience.metrics, "records ingested"),
    where: "Healthcare data pipelines",
    href: "#experience",
  },
];

const textLink =
  "text-ink-muted hover:text-pitch underline underline-offset-4 decoration-line hover:decoration-pitch transition-colors";

export function Hero() {
  return (
    <section className="pt-14 pb-20 sm:pt-20 sm:pb-24">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-pitch mb-6">
        {site.name} - {site.role}
      </p>
      <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] tracking-tight text-ink max-w-4xl">
        I build <em className="text-pitch">AI systems</em> and the data
        pipelines they run on.
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-ink-muted leading-relaxed">
        By day I build LLM features and data pipelines for consulting clients.
        Below is that work plus three portfolio projects, each with its test
        results.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href={site.resumePath}
          className="bg-pitch hover:bg-pitch-deep text-paper text-sm font-medium px-5 py-3 rounded-full transition-colors"
          download
        >
          Résumé (PDF)
        </a>
        <ChatLauncher
          id={HERO_CHAT_CTA_ID}
          className="border border-line hover:border-pitch text-ink text-sm font-medium px-5 py-3 rounded-full transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <span className="inline-block size-2 rounded-full bg-pitch" aria-hidden />
          Ask my profile anything
        </ChatLauncher>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <a className={textLink} href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a className={textLink} href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
        <a className={textLink} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>

      <ul
        aria-label="Highlights"
        className="mt-14 grid grid-cols-2 gap-x-4 sm:grid-cols-4 sm:gap-x-0 border-y border-line divide-line sm:divide-x"
      >
        {PROOF.map(({ metric, where, href }) => (
          <li key={metric.label} className="sm:first:*:pl-0">
            <a
              href={href}
              className="group block h-full py-5 sm:px-5 hover:bg-paper-deep transition-colors"
            >
              <span className="block whitespace-nowrap font-mono text-[1.35rem] font-medium text-ink">
                {metric.value}
              </span>
              <span className="mt-1 block font-mono text-xs text-pitch">{metric.label}</span>
              <span className="mt-1 block text-xs text-ink-muted group-hover:text-ink transition-colors">
                {where}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-8 font-mono text-xs text-ink-muted tracking-wide">
        Open to: AI Engineering · Software Engineering · Data Engineering · Data
        Science
      </p>
    </section>
  );
}
