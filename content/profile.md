<!--
  This file is the profile bot's ENTIRE knowledge. Nothing outside it is ever
  sent to the model, so it doubles as the sanitization boundary. HTML comments
  like this one are stripped before the file reaches the model (see
  lib/chat/prompt.ts), so notes here never enter the bot's context.

  Editing rules (never break these):
  - EMPLOYER names may be named (Shubham's own jobs, public on his résumé).
  - CLIENT names must NEVER appear - industry descriptors only ("a healthcare
    client"). Shubham works at a consulting firm; the clients it serves are
    confidential.
  - No phone number. No work-authorization / visa status.
  - No metrics that don't trace to Shubham's own material.
  - Football clubs may be named (Shubham authored them into his bot knowledge).
  - Never name or hint at the specific Grid Resilience negative-result model -
    the "honest about failures" trait is fine; the failed model itself is not.
-->

# Shubham Kale - public profile

## Who he is

- AI Engineer with roughly two years of experience, based in Pittsburgh, PA.
- Builds agentic AI systems, applied ML models with measured business impact, and production data platforms, with work spanning healthcare, insurance, finance, and consumer-products domains.
- Currently an Analytics / AI Engineer shipping production LLM features (Claude API) and client-facing predictive models, alongside ELT pipelines, dimensional models, ingestion frameworks, and analytics platforms for cross-functional and executive stakeholders.
- Open to AI Engineer, Software Engineer, Data Engineer, and Data Scientist roles, in that order of preference.
- Contact: 1842shubham@gmail.com · github.com/shubham8kale · linkedin.com/in/shubham8kale
- He tests what he builds and publishes the results next to each project, including the limitations.

## Education

- Stony Brook University, New York - M.S. in Data Science (GPA 3.78/4).
- NMIMS University, Mumbai - B.Tech in Data Science (CGPA 3.56/4).

## Experience

Client engagements are described by industry only - client names are
confidential and never shared.

- **Analytics / AI Engineer, Quantegy Analytics (current role, remote).** Builds production data platforms, LLM features, and BI for healthcare, insurance, and consumer-products clients.
  - Shipped an LLM-powered navigation assistant (Claude API) into a production analytics platform serving 50+ daily users across 5 markets, routing natural-language queries to the right dashboard via a structured page-catalog context. It now answers 150+ questions a day. On a random sample of 50 logged questions it routed 46 to the right page. All 4 misses were between pages serving near-identical purposes, so he added overlap groups to the page catalog: when the model picks a page in a group, the app shows the whole group, a deterministic rule rather than a model judgment. He has not measured a fresh sample since that fix, so he quotes 46 of 50 and never claims 100%.
  - Automated client request intake with an idempotent Dagster pipeline: Claude API extracts each incoming email into a Pydantic-validated JSON schema, deduplicated on message id so a rerun files nothing twice, and queues a ticket for human review in a Streamlit ticketing app he also built, with Slack alerts on failure. 100+ requests a month flow through it. On a random sample of 30 tickets drawn from everything since launch, 29 passed human review with no edit and 97% of extracted fields were accepted unedited; the one edited ticket was mislabelled because the model lacked account context, and the review step caught it before any work started. He does not claim a time-saved figure, because these requests were never ticketed before.
  - Uses Claude Code for most of his day-to-day engineering, including deliverables that go to clients. The concrete example: he moved 5 executive dashboards to Power BI's .pbip text format so that changes made with Claude Code arrive as reviewable diffs in Git code review. This is using an AI coding agent on real work, not building an agent platform or an eval harness, and there is no productivity metric attached to it.
  - Delivered production Streamlit platforms for two clients: a healthcare platform that cut a 3-day Excel reporting cycle to same-day, and separately a correctional-healthcare app with per-county, group-based access control for county and sheriff's-office users, which replaced the documents and Excel files those users had been exchanging by email and SharePoint.
  - Ranked retail endcap placement across a 420 store chain for a consumer-products client, using a stacked decision-tree and linear-regression ensemble over demographic features engineered from open-source population data at store-area level. The client installed the top 3 predicted stores per region, and those stores posted a 12% first-week sales lift against 0.25% in a control group of ranked but uninstalled stores in the same regions (ranks 4 and 5; not statistically matched). He also tracked predicted-versus-realized calibration at 61% rather than reporting the forecast as the result, and notes that parallel trends is not yet tested and no significance testing was run.
  - Designed the target Snowflake schemas and dimensional models behind 3 client data platforms: fact and dimension tables with conformed dimensions, declared grain, and Type 2 history tracking over raw vendor EHR, API, and CSV feeds.
  - Built the dbt transformation layer for an insurance client, modeling raw Snowflake ingests into analytics-ready tables.
  - Built Dagster ELT pipelines that ingest 4M+ patient and financial records from 15+ Redshift tables into Snowflake, powering analytics across 3 healthcare markets.
  - Owned end-to-end data engineering for a correctional-healthcare client: Dagster pipelines ingesting 120+ tables of vendor EHR and CSV data into structured Snowflake schemas across 15 counties.
  - Resolved an extraction bottleneck via parallel multi-table ingestion (~5x throughput; a full load went from 3 hours to under 45 minutes) with REST API integration, S3 archival, and Pydantic schema validation in a Dockerized CLI framework adopted by 4 client teams.
  - Scheduled 10+ table ingestion on Airflow (largest table 10M+ records) with pytest/httpx tests on mocked APIs.
  - Secured 2 client environments end to end: AWS IAM/VPN access policies, Secrets Manager credentials, role-based Snowflake access, and PII redaction of credit-card data.
  - He joined here as an intern and carried through part-time to full-time without a break, working across three client verticals at once.
- **AI Engineer Intern, Mettler-Toledo (Mumbai).** Built an end-to-end RAG system with T5/BART models fine-tuned on PyTorch through the Hugging Face Trainer, drafting KPI commentary from 10M+ financial records; 85%+ of the drafts were rated relevant in a 40-case review by the team the commentary was written for, saving about 15 hours a month of manual reporting. Also built a rule-based credit-representative assignment engine in KNIME that cut allocation time 50% and saved 30 hours a month.
- **Quantitative Analyst Intern, Marcellus Investment Managers (Mumbai).** Owned the PostgreSQL research database day to day: loaded vendor Excel exports into raw and merged tables (25 tables, 3M+ rows), managed role-based access, and automated the reconciliation in Python, saving 10 hours a week. Built a regression-based impact-cost model (R-squared 0.82) for trade-execution optimization and a forensic-screening ML ensemble (84% accuracy, 87% specificity) adopted into fraud-risk screening. He did not run the database server itself (backups, partitioning, tuning), so he describes it as owning the database and its data, not database administration.

## Project: Financial Research Agent (portfolio project, live demo available)

- Agentic RAG system that answers natural-language questions about SEC 10-K filings with source-grounded citations, and checks every figure in an answer against its cited sources before serving it.
- LangChain + LangGraph ReAct agent with five tools (filing search, company list, cross-company comparison, an XBRL fact lookup that takes the fiscal year as an argument, and a calculator), discovered at runtime through a FastMCP (streamable-HTTP Model Context Protocol) server with an in-process fallback; the hosted demo runs the fallback.
- Retrieval over ChromaDB with 4,783 chunks plus 6,089 XBRL facts from five companies' FY2025 10-K filings: dense search over 50 candidates, then a cross-encoder reranker and an inferred ticker filter. The first index had 67,521 chunks, three-quarters of them XBRL markup rather than 10-K text; it was rebuilt and every number re-measured. Generation via the Gemini API.
- Verification contract: a second, cheaper model call turns the draft into one claim per sentence with the observations it cites, and plain Python checks that every cited source exists, every figure is cited, every figure appears in a cited observation, and no figure was dropped. One repair attempt, then a refusal that names what could not be verified. On the 71-item benchmark, all 70 served answers passed these figure and citation checks and 77 of 77 figures were supported; one item hit the recursion limit and was never served. Verification adds about 2.2 seconds and $0.0004 per query.
- Evaluated on a 71-item labelled benchmark, every answer, retrieved context and score committed to the repository. Judge-free metrics (retrieval hit@5 and a figure check) gate every pull request: 19 retrieval configurations were compared and the shipped one lifted hit@5 from 0.51 to 0.66; a hybrid BM25 retriever was built, measured worse under the reranker, and left switched off. The XBRL fact tools took figure accuracy from 73% to 100% on the benchmark's 45 figure items. RAGAS-judged runs, with terminal failures scored as zero, took faithfulness from 0.83 to 0.95. A judge from a different model family re-scored 20 items and broadly agreed, scoring slightly lower. He notes that n = 71 establishes no statistical significance and that every judged headline is one judge's opinion.
- An earlier finding: on the previous model, 10 of 66 questions returned an empty answer that passed silently through the agent, the API (HTTP 200), the streaming UI and RAGAS (scored NaN and dropped from the mean, which inflated faithfulness). Empty and recursion-limit answers are now named terminal-failure states guarded at every layer, with 33 tests.
- FastAPI backend streaming cited answers over Server-Sent Events to a full-stack Next.js/TypeScript chat UI; LangSmith traces every run on the deployed demo and a per-query meter records latency, tokens and cost (about $0.002 and 4 seconds per query all-in). 222 backend tests with GitHub Actions CI and a retrieval-quality gate on every pull request. Frontend on Vercel, backend on Hugging Face Spaces (free tiers).
- Framed as a portfolio project with a live demo - a demonstration of engineering judgment, not a production system.

## Project: AI Auditor (portfolio project; public repository, live demo requires sign-in)

- An audit preparation and review workspace: five gated stages from client onboarding through expense vouching (onboarding, account mapping, materiality and scope, expense sampling, invoice testing), each producing a draft that a human approves before the next stage can run.
- The design principle: the AI reads documents and proposes; deterministic Python decides anything that matters. A vision model extracts facts from PDFs, scans and spreadsheets through a strict JSON-schema contract. The model also proposes account mappings and two judgment calls (expense classification and business purpose) for a human to review. Materiality, scoping, sample selection, and the amount, entity and period checks are plain Python with the policy rules encoded. The model is never told the overall conclusion; the code computes it, and it cannot approve a stage.
- 16 deterministic evidence checks, each carrying its policy source, run on every extracted fact before it can reach a workpaper. Even a fully passing test is recorded as "proposed clean", because sign-off is a human act.
- Controls live in code: row-level security on all 7 database tables, versioned approvals under row locks, a staleness cascade that marks downstream work stale with a reason whenever something upstream is corrected, and a chat assistant that can propose typed edits with a reason but has no approval operation.
- Stack: FastAPI and Python, React/TypeScript/Vite, Supabase (PostgreSQL, named authentication, private file storage), a Groq-hosted vision model, one Docker service on Render. 62 tests with GitHub Actions CI.
- A personal portfolio project. It is not RAG and not an agent: the assistant is handed a bounded context that Python assembled for one engagement. The repository is public; the live demo requires sign-in, and a public read-only demo account is planned.
- Known limitations: policy thresholds are encoded as one firm's methodology rather than a configurable table; three industries are covered; sampling is judgmental, not statistically projectable; the model is paced to a free API quota.

## Project: Grid Resilience (portfolio project)

- Real-time anomaly-detection system for the New York power grid.
- Streams NYISO forecast-vs-actual load data - roughly 89,000 hourly records across all 11 NYISO zones - through Apache Kafka (Docker, KRaft mode).
- Uses a causal rolling z-score detector with adaptive per-zone, per-hour-of-day thresholds.
- Evaluated against an offline statistical method: Cohen's kappa 0.52, recall 0.61. He reports agreement and recall rather than accuracy, because accuracy looks high on rare events even when a detector misses most of them.
- Includes a Streamlit live dashboard, unit tests, and CI.

## Smaller projects

- **Football club analysis (2008-2016):** a Tableau story analyzing a European club's seasons - goal breakdowns and tactical impact across two dashboards.
- **Formula 1 lap-time prediction:** Linear Regression and XGBoost over 150K+ lap records, plus K-means clustering of drivers into racing-style archetypes.
- **Product photography AI:** background removal with rembg and Stable Diffusion inpainting to regenerate product-shot backgrounds from a prompt.

## Skills

Python, Java, C/C++, R, SQL, JavaScript, TypeScript, Bash. Generative AI:
Claude API, Gemini API, Groq API, LangChain, LangGraph, FastMCP, ChromaDB, RAGAS, RAG,
LLM agents, MCP, structured outputs, LLM evaluation, LLM observability (LangSmith), fine-tuning. ML/DL: PyTorch, TensorFlow, scikit-learn,
XGBoost, Hugging Face. Data engineering: Snowflake, Redshift, BigQuery,
PostgreSQL, MongoDB, Apache Kafka, Apache Airflow, Dagster, dbt, Spark. Cloud &
infra: AWS (S3, Redshift, IAM), Azure, GCP, Docker, Kubernetes, GitHub Actions
CI/CD. Apps & backend: FastAPI, Flask, Streamlit, Next.js, React, Vite, Supabase,
Pydantic, pytest, SSE streaming. Analytics: Tableau, Power BI, statistical analysis, A/B
testing, time-series, causal inference.

## Beyond work

- **Football.** Follows the game closely as both a fan and a student of it. He supports Real Madrid, his local Pittsburgh Riverhound SC, and the India and Spain national teams - drawn to Spain for their possession-based style. A self-described tactics nerd who has played FIFA for years and competed in an amateur district-level league in India, he watches as much for shape and pressing structure as for the result.
- **Broad tech curiosity.** Interested in technology well beyond the data stack. Current interests: LLM observability and tracing for agentic systems; multi-agent orchestration patterns and their failure modes; formal A/B testing at scale (randomized assignment, power analysis, sequential testing) as a complement to the quasi-experimental evaluation he has done on real client work; layout-aware parsing of messy documents (tables, PDFs); running ML/agentic systems on Kubernetes at production depth; and the Model Context Protocol (MCP) ecosystem.
- Outside of tech he's up for most things - hiking, dancing, trying new food - and brings that same hands-on curiosity to picking up new tools.

## About this assistant

- This chat answers from this one profile document. There is no vector
  database, because the whole profile fits in the model's context.
- For anything not covered here, the right move is to email Shubham directly at
  1842shubham@gmail.com.
