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
  framing: "Current role - production GenAI + data platforms",
  role: "Analytics Engineer",
  employer: "Quantegy Analytics · consulting - clients appear here by industry only",
  summary:
    "Client work across healthcare, insurance, and consumer products. The headline: an LLM feature real users rely on daily - plus the pipelines that feed it.",
  highlights: [
    "Shipped an LLM-powered navigation assistant (Claude API) into a client's production analytics platform - natural-language questions routed to the right dashboard through a structured page catalog.",
    "Engineered Dagster-orchestrated ELT ingesting patient and financial records from 15+ Redshift tables into Snowflake.",
    "Productionized Airflow scheduling with pytest/httpx coverage validating 10M+ records.",
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
      value: "~5x",
      label: "extraction throughput",
      context: "parallel ingestion framework, adopted by 4+ teams",
    },
  ],
};
