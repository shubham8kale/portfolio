<!--
  This file is the profile bot's ENTIRE knowledge. Nothing outside it is ever
  sent to the model, so it doubles as the sanitization boundary. HTML comments
  like this one are stripped before the file reaches the model (see
  lib/chat/prompt.ts), so notes here never enter the bot's context.

  Editing rules (never break these):
  - No client names — domain descriptors only ("a healthcare client").
  - Employer names are currently GENERICIZED pending Shubham's sign-off. If he
    approves naming them, replace the descriptors below with the real names.
  - No phone number. No work-authorization status.
  - No metrics that don't also appear in content/projects.ts or trace to
    Shubham's own project write-ups.
  - Football stays generic — no club named.
  - Never mention the Grid Resilience next-hour RandomForest experiment.
-->

# Shubham Kale — public profile

## Who he is

- AI/Data Engineer with about 2 years of experience, based in New York, USA.
- Builds large-scale ELT data pipelines and agentic RAG / LLM systems, with work spanning healthcare, finance, and insurance domains.
- Open to Data Engineer, AI Engineer, Data Scientist, and Software Engineer roles.
- Contact: 1842shubham@gmail.com · github.com/shubham8kale · linkedin.com/in/shubham8kale
- What sets his work apart: honest evaluation and real deployment. He measures his systems and publishes the numbers instead of just claiming things work.

## Education

- Stony Brook University, New York — M.S. in Data Science (GPA 3.78/4), 2024–2025.
- NMIMS University, Mumbai — B.Tech in Data Science (CGPA 3.56/4), 2019–2023.

## Experience

Roughly two years across data engineering, analytics engineering, and applied
ML. Client engagements are described by domain only — client names are
confidential and never shared.

- **Analytics / Data Engineer (current, New York):** Builds production data platforms and BI for healthcare, insurance, and consumer-products clients. Engineered Dagster-orchestrated ELT pipelines moving millions of patient and financial records from Redshift into Snowflake; sped up extraction substantially with parallel multi-table ingestion, REST API integration, S3 archival, and Pydantic schema validation in a Dockerized CLI framework used by several teams. Productionized scheduling on Airflow with pytest/httpx coverage, and handled data security and governance (AWS IAM policies, Secrets Manager, role-based Snowflake access, PII redaction). Shipped a Streamlit analytics platform used daily across multiple markets that compressed a multi-day Excel reporting cycle to same-day.
- **Data Analyst intern (earlier, Mumbai):** Built an end-to-end RAG system with fine-tuned T5/BART models for automated KPI commentary over a large financial-records corpus, and automated a rule-based assignment engine that cut operational overhead.
- **Quantitative Analyst intern (earlier, Mumbai):** Consolidated many database tables across PostgreSQL schemas with Python automation that removed hours of weekly manual reconciliation, and built regression and ensemble ML models for trade-execution and fraud-risk screening.

## Project: Financial Research Agent (portfolio project, live demo available)

- Agentic RAG system for research questions over SEC 10-K filings.
- LangGraph ReAct agent whose tools are discovered at runtime through an MCP (Model Context Protocol) server, decoupling agent logic from tool implementations.
- Retrieval over ChromaDB with roughly 67,000 indexed chunks from five companies' 10-K filings.
- Evaluated with RAGAS using a separate judge model: 0.80 faithfulness and 0.80 context recall across question types.
- Deployed as a two-service FastAPI + MCP setup on Docker Compose, with CI via GitHub Actions (lint, dry-run eval, pytest — no secrets required).
- Next.js/TypeScript frontend with SSE token streaming.
- Framed as a portfolio project with a live demo — a demonstration of engineering judgment, not a production system.

## Project: Grid Resilience (portfolio project)

- Real-time anomaly detection over streaming electric-grid data.
- Apache Kafka pipeline running on Docker in KRaft mode.
- Data: roughly 89,000 NYISO forecast-vs-actual load records across all 11 NYISO zones.
- He compared streaming detection against an offline pass over the same data and reported the agreement honestly: Cohen's kappa 0.52.
- The point of the project is honest measurement of a streaming system, not inflated claims.

## Smaller projects

- **Football club analysis (2008–2016):** a Tableau story analyzing a European club's seasons — goal breakdowns and tactical impact across two dashboards.
- **Formula 1 lap-time prediction:** Linear Regression and XGBoost over 150K+ lap records, plus K-means clustering of drivers into racing-style archetypes.
- **Product photography AI:** background removal with rembg and Stable Diffusion inpainting to regenerate product-shot backgrounds from a prompt.

## Skills

Python, TypeScript, Java, SQL, Scala, R, Bash. Machine learning and deep
learning (PyTorch, TensorFlow, scikit-learn, XGBoost, Hugging Face). Generative
AI: RAG, LLM agents, MCP, fine-tuning (LangChain, LangGraph). Data engineering:
Spark, Kafka, Airflow, Dagster, dbt, Snowflake, Redshift, BigQuery, PostgreSQL,
MongoDB. Cloud & infra: AWS (S3, Redshift, IAM), Azure, GCP, Docker, Kubernetes,
GitHub Actions CI/CD. Backend & apps: FastAPI, Flask, Streamlit, Next.js, React,
Pydantic, pytest, SSE streaming. Analytics: Tableau, Power BI, statistical
analysis, A/B testing, time-series, causal inference.

## Beyond work

- Big football fan — the tactics, the rhythm of a match, the culture around the game. He keeps his club allegiance off the record online; ask him in person.
- Broad tech enthusiast — genuinely curious about technology well beyond the data stack.
<!-- TODO(M0): add his current-curiosity specifics + any football detail once provided from the career command center. -->

## About this assistant

- This chat is grounded in this one profile document — there is no vector
  database, because the whole profile fits in the model's context (a deliberate
  right-sizing decision).
- For anything not covered here, the right move is to email Shubham directly at
  1842shubham@gmail.com.
