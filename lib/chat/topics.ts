/**
 * Rough keyword buckets for the admin view of chat questions. A question can
 * land in several topics; anything unmatched is "Other". This is for spotting
 * patterns, not precise classification - read the raw questions too.
 */
export const TOPICS: { name: string; pattern: RegExp }[] = [
  { name: "AI Auditor", pattern: /audit/i },
  {
    name: "Financial Research Agent",
    pattern: /financial|10-?k|sec filing|\brag\b|ragas|faithful|eval/i,
  },
  { name: "Grid Resilience", pattern: /grid|kafka|nyiso|anomal|kappa|stream/i },
  {
    name: "Current job",
    pattern: /quantegy|current (job|role)|day job|production|client|shipp|navigation assistant|endcap/i,
  },
  { name: "LLM & AI work", pattern: /\bllm|\bai\b|agent|claude|gpt|model|genai|mcp/i },
  {
    name: "Data engineering",
    pattern: /data eng|pipeline|snowflake|dagster|airflow|dbt|redshift|etl|elt/i,
  },
  { name: "Skills & tools", pattern: /skill|stack|python|sql|tool|language|framework|tech/i },
  { name: "Education", pattern: /educat|degree|stony|universit|gpa|study|studied|master/i },
  {
    name: "Roles & availability",
    pattern: /hire|hiring|availab|relocat|visa|sponsor|salary|start|open to|looking for|role|remote|full[- ]time/i,
  },
  { name: "Football & interests", pattern: /football|soccer|fifa|madrid|club|hobb|interest|fun|outside/i },
  { name: "Contact & résumé", pattern: /contact|email|reach|linkedin|resume|résumé|\bcv\b|phone/i },
];

export function topicsFor(question: string): string[] {
  const hits = TOPICS.filter((t) => t.pattern.test(question)).map((t) => t.name);
  return hits.length > 0 ? hits : ["Other"];
}

/** The bot is told to say it doesn't have the information; flag those. */
export function looksUnanswered(answer: string): boolean {
  // Models often write curly apostrophes (don’t), so match both.
  return /don['’]?t have|do not have|not (in|covered|mentioned|listed)|no information|isn['’]?t (in|covered)|not sure/i.test(
    answer,
  );
}
