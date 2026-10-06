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
    slug: "financial-research-agent",
    title: "Financial Research Agent",
    tagline: "An agent that answers questions about SEC 10-K filings and checks every figure against its cited source before serving an answer.",
    framing: "Portfolio project - full-stack agentic RAG with citation checks and a published evaluation",
    problem:
      "An agent that answers research questions from SEC 10-K filings, checks each answer against the evidence it cited before serving it, and a benchmark that measures how often it gets the figures right.",
    built: [
      "LangGraph ReAct agent with five tools (filing search, company list, cross-company compare, XBRL fact lookup, calculator), served over an MCP server with an in-process fallback; per-thread conversation memory for follow-up questions, in process and bounded",
      "ChromaDB retrieval over 4,783 chunks plus 6,089 XBRL facts from five companies' 10-K filings: dense search over 50 candidates, then a cross-encoder reranker",
      "A verification contract: each served answer is split into cited claims and checked deterministically, with no model in the loop; an answer that fails is repaired once or refused",
      "71-item labelled benchmark: judge-free retrieval and figure checks gate every pull request, RAGAS-judged runs when a change is worth the spend",
      "FastAPI backend streaming over SSE to a Next.js/TypeScript UI, LangSmith tracing and a per-query meter (p50 2.8 s, about $0.002 per query on the shipped run), 362 backend tests in GitHub Actions CI, 33 of them on failure paths",
    ],
    metrics: [
      {
        value: "0.83 → 0.94",
        label: "faithfulness",
        context: "RAGAS on the 71-item benchmark, dense baseline to the shipped configuration, terminal failures scored as zero",
        chart: { kind: "change", from: 0.83, to: 0.94, max: 1, better: "higher" },
      },
      {
        value: "73% → 100%",
        label: "figure accuracy",
        context: "on the benchmark's 45 figure items, after adding the XBRL fact tools",
        chart: { kind: "change", from: 73, to: 100, max: 100, better: "higher" },
      },
      {
        value: "71 / 71",
        label: "answers passed checks",
        context: "every answer on the shipped run of the 71-item benchmark passed figure-to-source matching and citation validation; the checks verify sourcing against the retrieved evidence, not correctness",
      },
    ],
    stack: [
      "LangGraph",
      "MCP",
      "ChromaDB",
      "RAGAS",
      "LangSmith",
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
      alt: "The Financial Research Agent answering 'How many employees did Meta have at the end of 2025?': the one-sentence answer, a Verified badge (1 claim, 1 of 1 figures found in cited sources), the five retrieved sources with the cited one ticked, and the per-query meter line.",
      width: 936,
      height: 410,
      caption: "The live demo answering a headcount question: the answer, its verification verdict, the source it cited, and the per-query meter. 20.9 s and $0.0016 for one search on the free-tier host; the benchmark's p50 of 2.8 s was measured on a laptop.",
    },
    details: [
      {
        heading: "How it works",
        body: [
          "A LangGraph ReAct agent finds its tools at runtime from a FastMCP server over streamable HTTP, so the agent logic and the tool code are kept separate. Five tools: filing search, the company list, a cross-company comparison, an XBRL fact lookup that takes the fiscal year as an argument, and a calculator.",
          "Retrieval is dense search over 50 candidates, reranked by a cross-encoder and filtered to the inferred ticker. Answers are generated with the Gemini API and streamed to the Next.js UI over Server-Sent Events.",
          "Before an answer is served, a second model call turns it into one claim per sentence with the observations it cites, and plain Python checks each figure against those observations. An answer that fails gets one repair attempt, then a refusal that names what could not be verified.",
          "A follow-up question carries the earlier turns of its conversation through a thread id. The memory is in process and bounded (a few turns, cleared after idle time and on restart), and every figure in a follow-up is still retrieved and checked in its own turn; nothing is answered from memory.",
          "Locally it runs as two services (FastAPI and the MCP server) on Docker Compose. The hosted demo runs a single container with the agent in-process. LangSmith traces every run.",
        ],
      },
      {
        heading: "How it was tested",
        body: [
          "A 71-item labelled benchmark over five FY2025 10-K filings, with every answer, retrieved context, and score committed to the repository.",
          "Judge-free metrics come first: retrieval hit@5 and a figure check run on every pull request. 19 retrieval configurations were compared this way, and the shipped one lifted hit@5 from 0.51 to 0.66. A hybrid BM25 retriever was built, measured worse under the reranker, and left switched off.",
          "RAGAS-judged runs happen when a change is worth the spend, with failed answers counted as zero instead of dropped. A judge from a different model family re-scored a sample and broadly agreed, scoring slightly lower.",
          "Tool calls are measured too. The meter records every call's arguments and errors, and 71 items were labelled before any result was read for the acceptable first tool and the allowed set. The shipped run makes 119 tool calls with none rejected (the baseline had 7 rejected, every one a dropped required argument, fixed by wording the tool description where the model reads it), and the first call matches its label on 67 of 71 items. An explicit batching rule was measured: it cut model calls and broke one answer that no judge-free metric could see, so it ships off.",
          "Memory was probed on 8 small conversations: 11 of 11 follow-ups answered correctly with memory, 3 of 11 without it. The probe shows the mechanism works; it is too small to estimate a rate.",
        ],
      },
      {
        heading: "What the evaluation found",
        body: [
          "Numeric questions failed on retrieval, not generation: the prior year's figure sits in the same context and the model picks the wrong column. Making the fiscal year a lookup argument closed that class, and figure accuracy went from 73% to 100% on the 45 figure items.",
          "Three-quarters of the first index was XBRL markup rather than 10-K text. Rebuilding it cut 67,521 chunks to 4,783, and every number was re-measured on the new index.",
          "Earlier, some questions came back with an empty answer that passed silently through every layer: the agent, the API (HTTP 200), the streaming UI, and RAGAS, which scored it NaN and left it out of the average. Empty and recursion-limit answers are now named failure states, checked at every layer and covered by 33 tests.",
          "The sample is too small to claim statistical significance, and every judged headline number is one judge's opinion.",
        ],
      },
    ],
  },
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
