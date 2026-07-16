<!--
  This file is the profile bot's ENTIRE knowledge. Nothing outside it is ever
  sent to the model, so it doubles as the sanitization boundary. HTML comments
  like this one are stripped before the file reaches the model (see
  lib/chat/prompt.ts), so notes here never enter the bot's context.

  Editing rules (never break these):
  - EMPLOYER names may be named (Shubham's own jobs, public on his résumé).
  - CLIENT names must NEVER appear — industry descriptors only ("a healthcare
    client"). Shubham works at a consulting firm; the clients it serves are
    confidential.
  - No phone number. No work-authorization / visa status.
  - No metrics that don't trace to Shubham's own material.
  - Football clubs may be named (Shubham authored them into his bot knowledge).
  - Never name or hint at the specific Grid Resilience negative-result model —
    the "honest about failures" trait is fine; the failed model itself is not.
-->

# Shubham Kale — public profile

## Who he is

- AI/Data Engineer with roughly two years of experience, based in Pittsburgh, PA.
- Builds agentic AI systems and production data platforms, with work spanning healthcare, insurance, and consumer-products domains.
- Currently an Analytics Engineer shipping production LLM features (Claude API) alongside ELT pipelines, ingestion frameworks, and analytics platforms for cross-functional and executive stakeholders.
- Open to AI Engineer, Data Engineer, Data Scientist, and Software Engineer roles.
- Contact: 1842shubham@gmail.com · github.com/shubham8kale · linkedin.com/in/shubham8kale
- What sets his work apart: honest evaluation and real deployment. He measures his systems and publishes the numbers — an emphasis on honest evaluation over inflated claims.

## Education

- Stony Brook University, New York — M.S. in Data Science (GPA 3.78/4).
- NMIMS University, Mumbai — B.Tech in Data Science (CGPA 3.56/4).

## Experience

Client engagements are described by industry only — client names are
confidential and never shared.

- **Analytics Engineer, Quantegy Analytics (current role, remote).** Builds production data platforms, LLM features, and BI for healthcare, insurance, and consumer-products clients.
  - Shipped an LLM-powered navigation assistant (Claude API) into a production analytics platform serving 50+ daily users across 5 markets, routing natural-language queries to the right dashboard via a structured page-catalog context.
  - Delivered production Streamlit platforms for two clients: a healthcare platform that cut a 3-day Excel reporting cycle to same-day, and separately a correctional-healthcare app with per-county, group-based access control for county and sheriff's-office users.
  - Engineered Dagster-orchestrated ELT pipelines ingesting 4M+ patient and financial records from 15+ Redshift tables into Snowflake, powering analytics across 3 healthcare markets.
  - Owned end-to-end data engineering for a correctional-healthcare client: Dagster pipelines ingesting 120+ tables of vendor EHR and CSV data into structured Snowflake schemas across 15 counties.
  - Resolved an extraction bottleneck via parallel multi-table ingestion (~5x throughput) with REST API integration, S3 archival, and Pydantic schema validation in a Dockerized CLI framework adopted by 4+ teams.
  - Productionized scheduling on Airflow with full pytest/httpx coverage validating 10M+ records across 10+ tables.
  - Secured 2 client environments end to end: AWS IAM/VPN access policies, Secrets Manager credentials, role-based Snowflake access, and PII redaction of credit-card data.
  - He joined here as an intern and carried through part-time to full-time without a break, working across three client verticals at once.
- **Data Analyst Intern, Mettler-Toledo (Mumbai).** Built an end-to-end RAG system with fine-tuned language models for automated KPI/report commentary, and a rule-based assignment engine that significantly cut manual allocation work.
- **Quantitative Analyst Intern, Marcellus Investment Managers (Mumbai).** Owned database administration for a research environment end-to-end, and built statistical and machine-learning models for trade-execution optimization and fraud-risk screening.

## Project: Financial Research Agent (portfolio project, live demo available)

- Agentic RAG system that answers natural-language questions about SEC 10-K filings with source-grounded citations.
- LangChain + LangGraph ReAct agent whose tools are discovered at runtime through a FastMCP (streamable-HTTP Model Context Protocol) server, decoupling agent logic from tool implementations.
- Retrieval over ChromaDB with roughly 67,000 indexed chunks from five companies' 10-K filings; generation via the Gemini 2.5 Flash-Lite API.
- Evaluated with a RAGAS harness using a separate judge model (to avoid quota contention): 0.80 faithfulness and 0.80 context recall.
- Deployed as a two-service FastAPI + MCP microservice on Docker Compose, with CI via GitHub Actions.
- Full-stack Next.js/TypeScript chat UI streaming answers live over Server-Sent Events.
- Framed as a portfolio project with a live demo — a demonstration of engineering judgment, not a production system.

## Project: Grid Resilience (portfolio project)

- Real-time anomaly-detection system for the New York power grid.
- Streams NYISO forecast-vs-actual load data — roughly 89,000 hourly records across all 11 NYISO zones — through Apache Kafka (Docker, KRaft mode).
- Uses a causal rolling z-score detector with adaptive per-zone, per-hour-of-day thresholds.
- Evaluated honestly against an offline statistical method: Cohen's kappa 0.52, recall 0.61 — explicitly avoiding the inflated-accuracy trap of rare-event detection.
- Includes a Streamlit live dashboard, unit tests, and CI.

## Smaller projects

- **Football club analysis (2008–2016):** a Tableau story analyzing a European club's seasons — goal breakdowns and tactical impact across two dashboards.
- **Formula 1 lap-time prediction:** Linear Regression and XGBoost over 150K+ lap records, plus K-means clustering of drivers into racing-style archetypes.
- **Product photography AI:** background removal with rembg and Stable Diffusion inpainting to regenerate product-shot backgrounds from a prompt.

## Skills

Python, Java, C/C++, R, SQL, JavaScript, TypeScript, Bash. Generative AI:
Claude API, Gemini API, LangChain, LangGraph, FastMCP, ChromaDB, RAGAS, RAG,
LLM agents, MCP, fine-tuning. ML/DL: PyTorch, TensorFlow, scikit-learn,
XGBoost, Hugging Face. Data engineering: Snowflake, Redshift, BigQuery,
PostgreSQL, MongoDB, Apache Kafka, Apache Airflow, Dagster, dbt, Spark. Cloud &
infra: AWS (S3, Redshift, IAM), Azure, GCP, Docker, Kubernetes, GitHub Actions
CI/CD. Apps & backend: FastAPI, Flask, Streamlit, Next.js, React, Pydantic,
pytest, SSE streaming. Analytics: Tableau, Power BI, statistical analysis, A/B
testing, time-series, causal inference.

## Beyond work

- **Football.** Follows the game closely as both a fan and a student of it. He supports Real Madrid, his local Pittsburgh Riverhound SC, and the India and Spain national teams — drawn to Spain for their possession-based style. A self-described tactics nerd who has played FIFA for years and competed in an amateur district-level league in India, he watches as much for shape and pressing structure as for the result.
- **Broad tech curiosity.** Genuinely into technology well beyond the data stack. Current interests: LLM observability and tracing for agentic systems; multi-agent orchestration patterns and their failure modes; causal inference and A/B testing for real-world decision systems; layout-aware parsing of messy documents (tables, PDFs); running ML/agentic systems on Kubernetes at production depth; and the Model Context Protocol (MCP) ecosystem.
- Outside of tech he's up for most things — hiking, dancing, trying new food — and brings that same hands-on curiosity to picking up new tools.
- He's candid about what does and doesn't work, publishing honest metrics rather than inflated ones.

## About this assistant

- This chat is grounded in this one profile document — there is no vector
  database, because the whole profile fits in the model's context (a deliberate
  right-sizing decision).
- For anything not covered here, the right move is to email Shubham directly at
  1842shubham@gmail.com.
