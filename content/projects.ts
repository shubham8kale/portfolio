/**
 * THE audit surface: every number that appears anywhere on the site lives in
 * this file and traces to Shubham's source material. Do not add or restate
 * metrics elsewhere.
 *
 * Standing guardrails:
 * - Framing is always "portfolio project", never "production system".
 * - No client names anywhere — domain descriptors only.
 * - The Grid Resilience next-hour RandomForest negative result is deliberately
 *   absent from this file and must never appear on the site.
 */

export type Metric = {
  /** The number itself, rendered large in mono. */
  value: string;
  label: string;
  /** Where the number comes from — honesty is the point. */
  context: string;
};

export type ProjectLink = {
  label: string;
  href: string;
  kind: "repo" | "demo";
};

export type Project = {
  slug: string;
  title: string;
  framing: string;
  problem: string;
  built: string[];
  metrics: Metric[];
  stack: string[];
  links: ProjectLink[];
};

export const leadProjects: Project[] = [
  {
    slug: "financial-research-agent",
    title: "Financial Research Agent",
    framing: "Portfolio project — agentic RAG with a live deployment",
    problem:
      "Research questions over SEC 10-K filings need grounded retrieval, not just fluent generation — and evidence that the answers stay faithful to the source documents.",
    built: [
      "LangGraph ReAct agent with tools exposed through an MCP server",
      "ChromaDB retrieval over ~67K chunks from five companies' 10-K filings",
      "RAGAS evaluation harness measuring faithfulness and context recall",
      "FastAPI backend, Docker Compose deployment, GitHub Actions CI",
      "Next.js/TypeScript UI with SSE token streaming",
    ],
    metrics: [
      {
        value: "0.80",
        label: "faithfulness",
        context: "RAGAS, 5-company SEC 10-K corpus",
      },
      {
        value: "0.80",
        label: "context recall",
        context: "RAGAS, same evaluation run",
      },
      {
        value: "~67K",
        label: "indexed chunks",
        context: "ChromaDB, across 5 companies",
      },
    ],
    stack: [
      "LangGraph",
      "MCP",
      "ChromaDB",
      "RAGAS",
      "FastAPI",
      "Docker Compose",
      "GitHub Actions",
      "Next.js",
      "TypeScript",
    ],
    links: [
      // TODO(M0): replace with the exact repo URL and live demo URL.
      { label: "Repository", href: "https://github.com/shubham8kale", kind: "repo" },
      { label: "Live demo", href: "", kind: "demo" },
    ],
  },
  {
    slug: "grid-resilience",
    title: "Grid Resilience",
    framing: "Portfolio project — real-time anomaly detection on streaming grid data",
    problem:
      "Catching anomalies in electric-load data as it streams — and reporting honestly how real-time detection compares to an offline pass over the same data.",
    built: [
      "Apache Kafka streaming pipeline (Docker, KRaft mode)",
      "~89K NYISO forecast-vs-actual load records across 11 zones",
      "Streaming-vs-offline evaluation with agreement reported as Cohen's kappa",
    ],
    metrics: [
      {
        value: "0.52",
        label: "Cohen's kappa",
        context: "streaming vs. offline detection agreement — reported as measured",
      },
      {
        value: "~89K",
        label: "load records",
        context: "NYISO forecast vs. actual",
      },
      {
        value: "11",
        label: "zones",
        context: "full NYISO zone coverage",
      },
    ],
    stack: ["Apache Kafka", "KRaft", "Docker", "Python", "NYISO data"],
    links: [
      // TODO(M0): replace with the exact repo URL.
      { label: "Repository", href: "https://github.com/shubham8kale", kind: "repo" },
    ],
  },
];

export type SecondaryProject = {
  title: string;
  oneLiner: string;
  href: string;
};

// TODO(M0): needs Shubham's list (name, one-liner, repo link each).
// The section renders only when this is non-empty.
export const secondaryProjects: SecondaryProject[] = [];
