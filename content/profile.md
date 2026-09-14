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
- Currently an Analytics Engineer shipping production LLM features (Claude API) and client-facing predictive models, alongside ELT pipelines, dimensional models, ingestion frameworks, and analytics platforms for cross-functional and executive stakeholders.
- Open to AI Engineer, Software Engineer, Data Engineer, and Data Scientist roles, in that order of preference.
- Contact: 1842shubham@gmail.com · github.com/shubham8kale · linkedin.com/in/shubham8kale
- What sets his work apart: honest evaluation and real deployment. He measures his systems and publishes the numbers - an emphasis on honest evaluation over inflated claims.

## Education

- Stony Brook University, New York - M.S. in Data Science (GPA 3.78/4).
- NMIMS University, Mumbai - B.Tech in Data Science (CGPA 3.56/4).

## Experience

Client engagements are described by industry only - client names are
confidential and never shared.

- **Analytics Engineer, Quantegy Analytics (current role, remote).** Builds production data platforms, LLM features, and BI for healthcare, insurance, and consumer-products clients.
  - Shipped an LLM-powered navigation assistant (Claude API) into a production analytics platform serving 50+ daily users across 5 markets, routing natural-language queries to the right dashboard via a structured page-catalog context.
  - Works agent-first in his day-to-day engineering, using Claude Code on deliverables that ship to clients. The concrete artifact is a migration of 5 executive dashboards to the .pbip text format, done specifically so agent-authored changes arrive as reviewable diffs under Git-based code review. This is agent-directed development on real work, not an agent platform or an eval harness, and there is no productivity metric attached to it.
  - Delivered production Streamlit platforms for two clients: a healthcare platform that cut a 3-day Excel reporting cycle to same-day, and separately a correctional-healthcare app with per-county, group-based access control for county and sheriff's-office users.
  - Ranked retail endcap placement across a 420 store chain for a consumer-products client, using a stacked decision-tree and linear-regression ensemble over demographic features engineered from open-source population data at store-area level. The client installed the top 3 predicted stores per region, and those stores posted a 12% first-week sales lift against 0.2% in a matched control group of ranked but uninstalled stores. He also tracked predicted-versus-realized calibration at 61% rather than reporting the forecast as the result, and is candid that parallel trends is not yet tested and no significance testing was run.
  - Designed the target Snowflake schemas and dimensional models behind 3 client data platforms: fact and dimension tables with conformed dimensions, declared grain, and Type 2 history tracking over raw vendor EHR, API, and CSV feeds.
  - Built the dbt transformation layer for an insurance client, modeling raw Snowflake ingests into analytics-ready tables.
  - Engineered Dagster-orchestrated ELT pipelines ingesting 4M+ patient and financial records from 15+ Redshift tables into Snowflake, powering analytics across 3 healthcare markets.
  - Owned end-to-end data engineering for a correctional-healthcare client: Dagster pipelines ingesting 120+ tables of vendor EHR and CSV data into structured Snowflake schemas across 15 counties.
  - Resolved an extraction bottleneck via parallel multi-table ingestion (~5x throughput) with REST API integration, S3 archival, and Pydantic schema validation in a Dockerized CLI framework adopted by 4+ teams.
  - Productionized scheduling on Airflow with full pytest/httpx coverage validating 10M+ records across 10+ tables.
  - Secured 2 client environments end to end: AWS IAM/VPN access policies, Secrets Manager credentials, role-based Snowflake access, and PII redaction of credit-card data.
  - He joined here as an intern and carried through part-time to full-time without a break, working across three client verticals at once.
- **Data Analyst Intern, Mettler-Toledo (Mumbai).** Built an end-to-end RAG system with fine-tuned language models for automated KPI/report commentary, and a rule-based assignment engine that significantly cut manual allocation work.
- **Quantitative Analyst Intern, Marcellus Investment Managers (Mumbai).** Owned database administration for a research environment end-to-end, and built statistical and machine-learning models for trade-execution optimization and fraud-risk screening.

## Project: AI Auditor (portfolio project; repository and demo are currently access-restricted)

- An audit preparation and review workspace: five gated stages from client onboarding through expense vouching (onboarding, account mapping, materiality and scope, expense sampling, invoice testing), each producing a draft that a human approves before the next stage can run.
- The design principle: the AI reads documents and proposes; deterministic Python decides anything that matters. A vision model extracts facts from PDFs, scans and spreadsheets through a strict JSON-schema contract and proposes account mappings and two judgment calls (classification, business purpose); materiality, scoping, sample selection, and the amount, entity and period checks are plain Python with the policy rules encoded. The model is never told the overall conclusion; the code computes it, and it cannot approve a stage.
- 16 deterministic evidence checks, each carrying its policy source, run on every extracted fact before it can reach a workpaper. Even a fully passing test is recorded as "proposed clean", because sign-off is a human act.
- Controls live in code: row-level security on all 7 database tables, versioned approvals under row locks, a staleness cascade that marks downstream work stale with a reason whenever something upstream is corrected, and a chat assistant that can propose typed edits with a reason but has no approval operation.
- Stack: FastAPI and Python, React/TypeScript/Vite, Supabase (PostgreSQL, named authentication, private file storage), a Groq-hosted vision model, one Docker service on Render. 53 tests with GitHub Actions CI.
- A personal portfolio project. It is not RAG and not an agent: the assistant is handed a bounded context that Python assembled for one engagement. The repository and live demo are currently access-restricted; a public read-only demo is planned.
- Honest limitations: policy thresholds are encoded as one firm's methodology rather than a configurable table; three industries are covered; sampling is judgmental, not statistically projectable; the model is paced to a free API quota.

## Project: Financial Research Agent (portfolio project, live demo available)

- Agentic RAG system that answers natural-language questions about SEC 10-K filings with source-grounded citations.
- LangChain + LangGraph ReAct agent whose tools are discovered at runtime through a FastMCP (streamable-HTTP Model Context Protocol) server, decoupling agent logic from tool implementations.
- Retrieval over ChromaDB with roughly 67,000 indexed chunks from five companies' 10-K filings; generation via the Gemini API.
- Evaluated on a 71-item labelled benchmark with RAGAS, every answer, retrieved context and score committed to the repository. Two full runs of 66 items with the agent model as the only variable: faithfulness 0.71 to 0.88 and terminal failures (empty or recursion-limit answers) 12 to 6, with failures counted as zero rather than excluded. A cross-family judge check (a Groq-hosted judge re-scoring 20 items) broadly agreed with the Gemini judge and was slightly harsher.
- The evaluation's headline finding: on the earlier model, 10 of 66 questions returned an empty answer that passed silently through the agent, the API (HTTP 200), the streaming UI (a blank message with citations attached) and RAGAS (scored NaN and dropped from the mean, which inflated faithfulness). That is now a named terminal-failure state guarded at every layer, with 33 tests. He is candid that n = 66 establishes no statistical significance and that most of the headline gain is failure elimination rather than better answers on questions that already worked.
- Deployed as a two-service FastAPI + MCP microservice on Docker Compose, with CI via GitHub Actions running 85 backend tests. The hosted demo runs a single container and serves every request through the in-process agent (the MCP path is exercised locally).
- Full-stack Next.js/TypeScript chat UI streaming answers live over Server-Sent Events.
- Framed as a portfolio project with a live demo - a demonstration of engineering judgment, not a production system.

## Project: Grid Resilience (portfolio project)

- Real-time anomaly-detection system for the New York power grid.
- Streams NYISO forecast-vs-actual load data - roughly 89,000 hourly records across all 11 NYISO zones - through Apache Kafka (Docker, KRaft mode).
- Uses a causal rolling z-score detector with adaptive per-zone, per-hour-of-day thresholds.
- Evaluated honestly against an offline statistical method: Cohen's kappa 0.52, recall 0.61 - explicitly avoiding the inflated-accuracy trap of rare-event detection.
- Includes a Streamlit live dashboard, unit tests, and CI.

## Smaller projects

- **Football club analysis (2008-2016):** a Tableau story analyzing a European club's seasons - goal breakdowns and tactical impact across two dashboards.
- **Formula 1 lap-time prediction:** Linear Regression and XGBoost over 150K+ lap records, plus K-means clustering of drivers into racing-style archetypes.
- **Product photography AI:** background removal with rembg and Stable Diffusion inpainting to regenerate product-shot backgrounds from a prompt.

## Skills

Python, Java, C/C++, R, SQL, JavaScript, TypeScript, Bash. Generative AI:
Claude API, Gemini API, Groq API, LangChain, LangGraph, FastMCP, ChromaDB, RAGAS, RAG,
LLM agents, MCP, structured outputs, LLM evaluation, fine-tuning. ML/DL: PyTorch, TensorFlow, scikit-learn,
XGBoost, Hugging Face. Data engineering: Snowflake, Redshift, BigQuery,
PostgreSQL, MongoDB, Apache Kafka, Apache Airflow, Dagster, dbt, Spark. Cloud &
infra: AWS (S3, Redshift, IAM), Azure, GCP, Docker, Kubernetes, GitHub Actions
CI/CD. Apps & backend: FastAPI, Flask, Streamlit, Next.js, React, Vite, Supabase,
Pydantic, pytest, SSE streaming. Analytics: Tableau, Power BI, statistical analysis, A/B
testing, time-series, causal inference.

## Beyond work

- **Football.** Follows the game closely as both a fan and a student of it. He supports Real Madrid, his local Pittsburgh Riverhound SC, and the India and Spain national teams - drawn to Spain for their possession-based style. A self-described tactics nerd who has played FIFA for years and competed in an amateur district-level league in India, he watches as much for shape and pressing structure as for the result.
- **Broad tech curiosity.** Genuinely into technology well beyond the data stack. Current interests: LLM observability and tracing for agentic systems; multi-agent orchestration patterns and their failure modes; formal A/B testing at scale (randomized assignment, power analysis, sequential testing) as a complement to the quasi-experimental evaluation he has done on real client work; layout-aware parsing of messy documents (tables, PDFs); running ML/agentic systems on Kubernetes at production depth; and the Model Context Protocol (MCP) ecosystem.
- Outside of tech he's up for most things - hiking, dancing, trying new food - and brings that same hands-on curiosity to picking up new tools.
- He's candid about what does and doesn't work, publishing honest metrics rather than inflated ones.

## About this assistant

- This chat is grounded in this one profile document - there is no vector
  database, because the whole profile fits in the model's context (a deliberate
  right-sizing decision).
- For anything not covered here, the right move is to email Shubham directly at
  1842shubham@gmail.com.
