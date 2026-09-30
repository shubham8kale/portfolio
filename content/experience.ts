import type { Metric } from "./projects";

/**
 * Current-role experience shown on the site face. Same truth rules as
 * projects.ts: every number here traces to Shubham's résumé (and his approved
 * metric list). Employer names are approved for publication; CLIENTS are
 * always industry descriptors only - never named.
 */
export type PreviousRole = {
  role: string;
  employer: string;
  location: string;
  summary: string;
};

export type Experience = {
  framing: string;
  role: string;
  employer: string;
  summary: string;
  highlights: string[];
  metrics: Metric[];
  previous: PreviousRole[];
};

export const experience: Experience = {
  framing: "Current role · LLM features, applied ML, data pipelines",
  role: "Analytics / AI Engineer",
  employer: "Quantegy Analytics · Consulting",
  summary:
    "Consulting work for healthcare, insurance, and consumer-products clients, mostly on three things: LLM features people use every day, a store-placement model tested against a control group, and the data pipelines both depend on.",
  highlights: [
    "Shipped an LLM navigation assistant (Claude API) inside a client's analytics platform. Users ask a question in plain English and it sends them to the right dashboard, using a structured catalog of pages. It now answers 150+ questions a day.",
    "Automated client request intake: a Dagster pipeline reads each incoming email, Claude API extracts it into a Pydantic-validated JSON schema, and a ticket is queued for human review in a Streamlit app. Deduplicated on message id so a rerun files nothing twice, with a Slack alert on failure; 100+ requests a month.",
    "Ranked stores in a 420-store retail chain for endcap placement, for a consumer-products client, using a stacked decision-tree and linear-regression ensemble on engineered demographic features. Measured the rollout against ranked stores that didn't get the endcap.",
    "Moved 5 executive dashboards to Power BI's .pbip text format so edits made with Claude Code show up as reviewable Git diffs. Claude Code is part of most of my day-to-day client work.",
    "Built Dagster ELT jobs that move patient and financial records from 15+ Redshift tables into Snowflake.",
    "Set up Airflow ingestion for 10+ tables (the largest has 10M+ records), tested with pytest and httpx against mocked APIs.",
    "Built Streamlit apps for clients that cut a 3-day Excel reporting cycle to same-day.",
  ],
  metrics: [
    {
      value: "50+",
      label: "daily users",
      context: "analytics platform across 5 markets; its LLM assistant answers 150+ questions a day",
    },
    {
      value: "4M+",
      label: "records ingested",
      context: "Redshift → Snowflake, 3 healthcare markets",
    },
    {
      value: "12%",
      label: "first-week sales lift",
      context: "endcap placement model, vs 0.25% in same-region control stores",
      chart: {
        kind: "versus",
        value: 12,
        baseline: 0.25,
        valueLabel: "endcap stores",
        baselineLabel: "control stores",
        unit: "%",
      },
    },
    {
      value: "~5x",
      label: "extraction throughput",
      context: "parallel ingestion framework, adopted by 4 client teams",
    },
  ],
  previous: [
    {
      role: "AI Engineer Intern",
      employer: "Mettler-Toledo",
      location: "Mumbai",
      summary:
        "Built a RAG system with T5/BART models fine-tuned on PyTorch that drafted commentary for KPI reports, plus a rule-based engine that cut manual allocation work.",
    },
    {
      role: "Quantitative Analyst Intern",
      employer: "Marcellus Investment Managers",
      location: "Mumbai",
      summary:
        "Owned the PostgreSQL research database day to day (loading, schema, access, reconciliation automation) and built statistical and machine-learning models for trade-execution optimization and fraud-risk screening.",
    },
  ],
};
