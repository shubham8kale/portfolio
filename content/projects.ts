/**
 * THE audit surface: every number that appears anywhere on the site lives in
 * this file and traces to Shubham's source material. Do not add or restate
 * metrics elsewhere.
 *
 * Standing guardrails:
 * - Framing is always "portfolio project", never "production system".
 * - No client names anywhere - domain descriptors only.
 * - The Grid Resilience next-hour RandomForest negative result is deliberately
 *   absent from this file and must never appear on the site.
 */

export type Metric = {
  /** The number itself, rendered large in mono. */
  value: string;
  label: string;
  /** Where the number comes from - honesty is the point. */
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
    slug: "ai-auditor",
    title: "AI Auditor",
    framing: "Portfolio project - an audit preparation and review workspace",
    problem:
      "Audit evidence has to be read, checked and signed off - and a model that can read an invoice must never be the thing that approves it. The design question is where the line sits.",
    built: [
      "Five gated stages: onboarding, account mapping, materiality and scope, expense sampling, invoice testing",
      "Vision LLM extracts document facts through a strict JSON-schema contract; deterministic Python owns money, thresholds, sample selection and approval",
      "16 policy-cited evidence checks run on every extracted fact before it can reach a workpaper",
      "Row-level security on every table, versioned approvals under row locks, and a staleness cascade that invalidates downstream work on any correction",
      "A chat assistant that can propose typed edits with a reason, and cannot approve",
    ],
    metrics: [
      {
        value: "5",
        label: "gated stages",
        context: "each approved by a human before the next can run",
      },
      {
        value: "16",
        label: "evidence checks",
        context: "deterministic, each carrying its policy source",
      },
      {
        value: "53",
        label: "tests",
        context: "pytest, plus GitHub Actions CI",
      },
    ],
    stack: [
      "FastAPI",
      "React",
      "TypeScript",
      "Vite",
      "Supabase",
      "PostgreSQL",
      "Groq",
      "Structured outputs",
      "Docker",
      "Render",
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/shubham8kale/ai-auditor",
        kind: "repo",
      },
      {
        label: "Live demo",
        href: "https://ai-auditor-o2ym.onrender.com/",
        kind: "demo",
      },
    ],
  },
  {
    slug: "financial-research-agent",
    title: "Financial Research Agent",
    framing: "Portfolio project - full-stack agentic RAG with a published evaluation",
    problem:
      "Research questions over SEC 10-K filings need grounded retrieval, not just fluent generation - and evidence that the answers stay faithful to the source documents.",
    built: [
      "LangGraph ReAct agent that discovers its tools at runtime from an MCP server",
      "ChromaDB retrieval over ~67K chunks from five companies' 10-K filings",
      "71-item labelled RAGAS benchmark with per-item results committed, a cross-family judge check, and terminal failures counted as zero",
      "FastAPI backend, Docker Compose deployment, GitHub Actions CI",
      "Next.js/TypeScript UI with SSE token streaming",
    ],
    metrics: [
      {
        value: "0.71 → 0.88",
        label: "faithfulness",
        context: "RAGAS, 66 items, agent model the only variable, failures counted as zero",
      },
      {
        value: "12 → 6",
        label: "terminal failures",
        context: "empty or recursion-limit answers, out of 66, after the model swap",
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
      {
        label: "Repository",
        href: "https://github.com/shubham8kale/financial-research-agent",
        kind: "repo",
      },
      {
        label: "Live demo",
        href: "https://financial-research-agent-pi.vercel.app/",
        kind: "demo",
      },
    ],
  },
  {
    slug: "grid-resilience",
    title: "Grid Resilience",
    framing: "Portfolio project - real-time anomaly detection on streaming grid data",
    problem:
      "Catching anomalies in electric-load data as it streams - and reporting honestly how real-time detection compares to an offline pass over the same data.",
    built: [
      "Apache Kafka streaming pipeline (Docker, KRaft mode)",
      "~89K NYISO forecast-vs-actual load records across 11 zones",
      "Streaming-vs-offline evaluation with agreement reported as Cohen's kappa",
    ],
    metrics: [
      {
        value: "0.52",
        label: "Cohen's kappa",
        context: "streaming vs. offline detection agreement - reported as measured",
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
      {
        label: "Repository",
        href: "https://github.com/shubham8kale/grid-resilience",
        kind: "repo",
      },
    ],
  },
];

export type SecondaryProject = {
  title: string;
  oneLiner: string;
  href: string;
};

// One-liners trace to Shubham's own project write-ups; performance/scale
// metrics live only on his approved list. The section renders only when this
// is non-empty.
export const secondaryProjects: SecondaryProject[] = [
  {
    title: "Football club analysis (2008-2016)",
    oneLiner:
      "A Tableau story dissecting a European club's seasons - goal breakdowns and how tactics moved the numbers.",
    href: "https://public.tableau.com/app/profile/shubham.kale4203/viz/cfg_final/Story1",
  },
  {
    title: "Formula 1 lap-time prediction",
    oneLiner:
      "Lap-time models (Linear Regression, XGBoost) over Formula 1 lap records, plus K-means clustering of drivers into racing-style archetypes.",
    href: "https://github.com/shubham8kale/Formula-1-Project",
  },
  {
    title: "Product photography AI",
    oneLiner:
      "Background removal with rembg and Stable Diffusion inpainting to regenerate product-shot backgrounds from a prompt.",
    href: "https://github.com/shubham8kale/Product-photography-AI",
  },
];
