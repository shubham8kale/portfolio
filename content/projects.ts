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

/**
 * Optional mini chart for a metric. Its numbers must be the same figures as
 * the metric's `value` string - it is a picture of that value, never a new
 * number.
 */
export type MetricChart =
  /** Before -> after on one scale (a dumbbell). */
  | { kind: "change"; from: number; to: number; max: number; better: "higher" | "lower" }
  /** The measured group next to its baseline group (emphasis bars). */
  | {
      kind: "versus";
      value: number;
      baseline: number;
      valueLabel: string;
      baselineLabel: string;
      unit: string;
    }
  /** A single value on a bounded scale. */
  | { kind: "meter"; value: number; max: number };

export type Metric = {
  /** The number itself, rendered large in mono. */
  value: string;
  label: string;
  /** Where the number comes from - honesty is the point. */
  context: string;
  chart?: MetricChart;
};

export type ProjectLink = {
  label: string;
  href: string;
  kind: "repo" | "demo";
  /** Short caveat shown next to the link, e.g. an access requirement. */
  note?: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

/** A section of the project's write-up page (/work/[slug]). */
export type ProjectDetail = {
  heading: string;
  body: string[];
};

export type Project = {
  slug: string;
  title: string;
  /** One line for the project index. */
  tagline: string;
  framing: string;
  problem: string;
  built: string[];
  metrics: Metric[];
  stack: string[];
  links: ProjectLink[];
  image?: ProjectImage;
  details: ProjectDetail[];
};

export const leadProjects: Project[] = [
  {
    slug: "ai-auditor",
    title: "AI Auditor",
    tagline: "An audit workspace where an LLM reads the documents and people approve the work.",
    framing: "Portfolio project - an audit preparation and review workspace",
    problem:
      "Audit evidence has to be read, checked, and signed off. Here an LLM reads the documents, while deterministic code and a human reviewer handle the checking and approval.",
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
        value: "62",
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
        note: "sign-in required",
      },
    ],
    details: [
      {
        heading: "How it works",
        body: [
          "Each stage produces a draft that a person approves before the next stage can run.",
          "A vision model reads PDFs, scans, and spreadsheets and returns the facts through a strict JSON schema. It also proposes account mappings and two judgment calls: how an expense is classified and what its business purpose was.",
          "Materiality, scoping, sample selection, and the amount, entity, and period checks are plain Python with the policy rules written into the code. The model is never told the overall conclusion. The code works it out.",
        ],
      },
      {
        heading: "Controls",
        body: [
          "Even a test where every check passes is recorded as \"proposed clean\", because sign-off is a human decision.",
          "When something upstream is corrected, everything downstream of it is marked stale, with the reason attached.",
          "The chat assistant can propose typed edits with a reason. It has no approve operation.",
          "It is not RAG and not an agent: the assistant gets a bounded context that Python put together for one engagement.",
        ],
      },
      {
        heading: "Known limitations",
        body: [
          "Policy thresholds follow one firm's methodology instead of a configurable table.",
          "Only a few industries are covered.",
          "Sampling is judgmental, so results can't be projected statistically to the full population.",
          "The model is rate-paced to fit a free API quota.",
        ],
      },
    ],
  },
  {
    slug: "financial-research-agent",
    title: "Financial Research Agent",
    tagline: "An agent that answers questions about SEC 10-K filings, tested with a RAGAS benchmark.",
    framing: "Portfolio project - full-stack agentic RAG with a published evaluation",
    problem:
      "An agent that answers research questions from SEC 10-K filings, plus a benchmark that checks whether its answers match what the filings say.",
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
        chart: { kind: "change", from: 0.71, to: 0.88, max: 1, better: "higher" },
      },
      {
        value: "12 → 6",
        label: "terminal failures",
        context: "empty or recursion-limit answers, out of 66, after the model swap",
        chart: { kind: "change", from: 12, to: 6, max: 66, better: "lower" },
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
    image: {
      src: "/work/financial-research-agent.png",
      alt: "The Financial Research Agent answering a question about Apple's net sales, with the source chunks it used listed underneath.",
      width: 1560,
      height: 594,
      caption: "The live demo answering a question, with the filing chunks it cited.",
    },
    details: [
      {
        heading: "How it works",
        body: [
          "A LangGraph ReAct agent finds its tools at runtime from a FastMCP server over streamable HTTP, so the agent logic and the tool code are kept separate.",
          "Retrieval runs over ChromaDB and answers are generated with the Gemini API. The Next.js UI streams tokens over Server-Sent Events.",
          "Locally it runs as two services (FastAPI and the MCP server) on Docker Compose. The hosted demo runs a single container with the agent in-process.",
        ],
      },
      {
        heading: "How it was tested",
        body: [
          "A 71-item labelled RAGAS benchmark, with every answer, retrieved context, and score committed to the repository.",
          "Two full runs with the agent model as the only change. Failed answers count as zero instead of being dropped from the average.",
          "A judge from a different model family re-scored a sample of answers. It broadly agreed with the main judge and scored slightly lower.",
        ],
      },
      {
        heading: "What the evaluation found",
        body: [
          "On the earlier model, some questions came back with an empty answer that passed silently through every layer: the agent, the API (HTTP 200), the streaming UI (a blank message with citations attached), and RAGAS, which scored it NaN and left it out of the average. That made faithfulness look better than it was.",
          "Empty answers are now a named failure state, checked at every layer.",
          "Most of the improvement comes from removing failures, not from better answers to questions that already worked. The sample is also too small to claim statistical significance.",
        ],
      },
    ],
  },
  {
    slug: "grid-resilience",
    title: "Grid Resilience",
    tagline: "Streaming anomaly detection on New York grid load data, checked against an offline pass.",
    framing: "Portfolio project - real-time anomaly detection on streaming grid data",
    problem:
      "Detecting anomalies in electric-load data as it streams in, then comparing the real-time results against an offline pass over the same data.",
    built: [
      "Apache Kafka streaming pipeline (Docker, KRaft mode)",
      "~89K NYISO forecast-vs-actual load records across 11 zones",
      "Streaming-vs-offline evaluation with agreement reported as Cohen's kappa",
    ],
    metrics: [
      {
        value: "0.52",
        label: "Cohen's kappa",
        context: "agreement between streaming and offline detection",
        chart: { kind: "meter", value: 0.52, max: 1 },
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
    details: [
      {
        heading: "How it works",
        body: [
          "NYISO forecast-vs-actual hourly load data streams through Apache Kafka, running in Docker in KRaft mode.",
          "A causal rolling z-score detector flags anomalies, with thresholds adapted for each zone and each hour of the day.",
          "A Streamlit dashboard shows the stream live. The project has unit tests and CI.",
        ],
      },
      {
        heading: "How it was tested",
        body: [
          "The streaming detector is compared against an offline statistical pass over the same data.",
          "Agreement is reported as Cohen's kappa instead of accuracy. Anomalies are rare, so accuracy looks high even for a detector that misses most of them.",
        ],
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
      "A Tableau story on a European club's seasons: where the goals came from and how tactical changes showed up in results.",
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
