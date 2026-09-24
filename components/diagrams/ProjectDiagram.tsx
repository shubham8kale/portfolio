/**
 * How each lead project fits together, drawn as small flow diagrams.
 * Built from HTML boxes rather than a fixed SVG so they reflow: a row when
 * there's room, a vertical stack when there isn't. Labels only - no metrics
 * live here (numbers stay in content/projects.ts).
 *
 * Every box carries a small kicker naming who or what does the step, so the
 * tint is never the only signal.
 *
 * Rows switch from stacked to side-by-side on the figure's own width (a
 * container query), not the viewport's, because the same diagram sits in
 * columns of different widths.
 */

type Tone = "accent" | "code" | "human" | "data";

type FlowNode = { kicker: string; label: string; tone: Tone };

/** Long flows need more room before they can sit in one row. */
const LAYOUT = {
  long: {
    ol: "@2xl:flex-row @2xl:items-stretch",
    li: "@2xl:flex-row @2xl:flex-1 @2xl:items-center",
    down: "@2xl:hidden",
    right: "hidden @2xl:inline",
  },
  short: {
    ol: "@md:flex-row @md:items-stretch",
    li: "@md:flex-row @md:flex-1 @md:items-center",
    down: "@md:hidden",
    right: "hidden @md:inline",
  },
};

const TONE: Record<Tone, string> = {
  accent: "bg-pitch-soft border-pitch/40",
  code: "bg-paper-deep border-line",
  human: "bg-paper border-pitch",
  data: "bg-paper border-line border-dashed",
};

function Flow({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  const layout = nodes.length > 3 ? LAYOUT.long : LAYOUT.short;
  return (
    <div>
      <p className="mb-2 text-xs text-ink-muted">{label}</p>
      <ol className={`flex flex-col ${layout.ol}`}>
        {nodes.map((node, i) => (
          <li key={node.label} className={`flex flex-col min-w-0 ${layout.li}`}>
            <div
              className={`flex-1 self-stretch rounded-lg border px-3 py-2.5 ${TONE[node.tone]}`}
            >
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ink-muted">
                {node.kicker}
              </span>
              <span className="mt-0.5 block text-[0.8rem] leading-snug text-ink">
                {node.label}
              </span>
            </div>
            {i < nodes.length - 1 && (
              <span
                aria-hidden
                className="shrink-0 self-center font-mono text-xs text-ink-muted px-1.5 py-0.5"
              >
                <span className={layout.down}>↓</span>
                <span className={layout.right}>→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function AuditorDiagram() {
  const stage = (label: string): FlowNode => ({
    kicker: "Stage",
    label,
    tone: "code",
  });
  return (
    <div className="space-y-5">
      <Flow
        label="The five stages, in order"
        nodes={[
          stage("Onboarding"),
          stage("Account mapping"),
          stage("Materiality & scope"),
          stage("Expense sampling"),
          stage("Invoice testing"),
        ]}
      />
      <Flow
        label="What happens inside each stage"
        nodes={[
          { kicker: "LLM", label: "Reads documents and proposes", tone: "accent" },
          { kicker: "Python", label: "Runs the evidence checks and works out the result", tone: "code" },
          { kicker: "Person", label: "Approves before the next stage unlocks", tone: "human" },
        ]}
      />
    </div>
  );
}

function ResearchAgentDiagram() {
  return (
    <div className="space-y-5">
      <Flow
        label="How a question is answered"
        nodes={[
          { kicker: "Input", label: "Research question", tone: "data" },
          { kicker: "LLM", label: "LangGraph ReAct agent", tone: "accent" },
          { kicker: "MCP", label: "Tools found at runtime", tone: "code" },
          { kicker: "Data", label: "ChromaDB over 10-K filings", tone: "data" },
          { kicker: "Output", label: "Answer with cited chunks", tone: "code" },
        ]}
      />
      <Flow
        label="How answers are evaluated"
        nodes={[
          { kicker: "Benchmark", label: "Labelled questions", tone: "data" },
          { kicker: "Judge", label: "RAGAS scores every answer", tone: "accent" },
          { kicker: "Repo", label: "Per-item results committed", tone: "code" },
        ]}
      />
    </div>
  );
}

function GridDiagram() {
  return (
    <div className="space-y-5">
      <Flow
        label="The streaming path"
        nodes={[
          { kicker: "Data", label: "NYISO forecast vs. actual load", tone: "data" },
          { kicker: "Kafka", label: "Streamed in KRaft mode", tone: "code" },
          { kicker: "Detector", label: "Rolling z-score per zone and hour", tone: "code" },
          { kicker: "Output", label: "Live anomaly flags", tone: "accent" },
        ]}
      />
      <Flow
        label="How it was checked"
        nodes={[
          { kicker: "Offline", label: "Statistical pass over the same data", tone: "code" },
          { kicker: "Compare", label: "Agreement as Cohen's kappa", tone: "accent" },
        ]}
      />
    </div>
  );
}

const DIAGRAMS: Record<string, () => React.ReactNode> = {
  "ai-auditor": AuditorDiagram,
  "financial-research-agent": ResearchAgentDiagram,
  "grid-resilience": GridDiagram,
};

export function ProjectDiagram({ slug }: { slug: string }) {
  const Diagram = DIAGRAMS[slug];
  if (!Diagram) return null;
  return (
    <figure className="@container rounded-xl border border-line p-4 sm:p-5">
      <figcaption className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
        How it fits together
      </figcaption>
      <Diagram />
    </figure>
  );
}
