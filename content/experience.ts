import type { Metric } from "./projects";

/**
 * Current-role experience shown on the site face. Same truth rules as
 * projects.ts: every number here traces to Shubham's résumé (and his approved
 * metric list). Employer names are approved for publication; CLIENTS are
 * always industry descriptors only - never named.
 */
export type Experience = {
  framing: string;
  role: string;
  employer: string;
  summary: string;
  highlights: string[];
  metrics: Metric[];
};

export const experience: Experience = {
  framing: "Current role - production GenAI, applied ML, and data platforms",
  role: "Analytics Engineer",
  employer: "Quantegy Analytics · Consulting",
  summary:
    "Client work across healthcare, insurance, and consumer products. The headline: an LLM feature real users rely on daily, a placement model measured against a control group, and the pipelines underneath both.",
  highlights: [
    "Shipped an LLM-powered navigation assistant (Claude API) into a client's production analytics platform - natural-language questions routed to the right dashboard through a structured page catalog.",
    "Ranked retail endcap placement across a 420 store chain for a consumer-products client using a stacked decision-tree and linear-regression ensemble over engineered demographic features, then measured the rollout against a control group of ranked but uninstalled stores.",
    "Works agent-first day to day, using Claude Code on client-shipping deliverables: migrated 5 executive dashboards to the .pbip text format so agent-authored changes ship as reviewable diffs under Git.",
    "Engineered Dagster-orchestrated ELT ingesting patient and financial records from 15+ Redshift tables into Snowflake.",
    "Scheduled 10+ table ingestion on Airflow (largest table 10M+ records) with pytest/httpx tests on mocked APIs.",
    "Delivered client Streamlit platforms that compressed a 3-day Excel reporting cycle to same-day.",
  ],
  metrics: [
    {
      value: "50+",
      label: "daily users",
      context: "LLM navigation assistant, across 5 markets",
    },
    {
      value: "4M+",
      label: "records ingested",
      context: "Redshift → Snowflake, 3 healthcare markets",
    },
    {
      value: "12%",
      label: "first-week sales lift",
      context: "endcap placement model, vs 0.2% in matched control stores",
    },
    {
      value: "~5x",
      label: "extraction throughput",
      context: "parallel ingestion framework, adopted by 4 client teams",
    },
  ],
};
