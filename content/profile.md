<!--
  This file is the profile bot's ENTIRE knowledge. Nothing outside it is ever
  sent to the model, so it doubles as the sanitization boundary.

  TODO(M0): Shubham must review and extend this file before launch.

  Editing rules (never break these):
  - No client names — domain descriptors only ("a healthcare client").
  - No phone number. No work-authorization status.
  - No metrics that don't also appear in content/projects.ts / the public repos.
  - Football stays generic — no club named.
  - Never mention the Grid Resilience next-hour RandomForest experiment.
-->

# Shubham Kale — public profile

## Who he is

- AI/Data Engineer with about 2 years of experience.
- Open to Data Engineer, AI Engineer, Data Scientist, and Software Engineer roles.
- Contact: 1842shubham@gmail.com · github.com/shubham8kale · linkedin.com/in/shubham8kale
- What sets his work apart: honest evaluation and real deployment. He measures his systems and publishes the numbers instead of just claiming things work.

## Experience

- ~2 years working as an AI/Data Engineer.
- Client engagements are described by domain only — for example a healthcare client, an insurance client, and a consumer-products client. Client names are confidential and are never shared.
<!-- TODO(M0): add 1-2 sanitized sentences per engagement about what he actually built. -->

## Project: Financial Research Agent (portfolio project, live demo available)

- Agentic RAG system for research questions over SEC 10-K filings.
- LangGraph ReAct agent whose tools are exposed through an MCP server.
- Retrieval over ChromaDB with roughly 67,000 indexed chunks from five companies' 10-K filings.
- Evaluated with RAGAS: 0.80 faithfulness and 0.80 context recall.
- FastAPI backend, deployed with Docker Compose, CI via GitHub Actions.
- Next.js/TypeScript frontend with SSE token streaming.
- It is a portfolio project with a live demo — he frames it as a demonstration of engineering judgment, not a production system.

## Project: Grid Resilience (portfolio project)

- Real-time anomaly detection over streaming electric-grid data.
- Apache Kafka pipeline running on Docker in KRaft mode.
- Data: roughly 89,000 NYISO forecast-vs-actual load records across all 11 NYISO zones.
- He compared streaming detection against an offline pass over the same data and reported the agreement honestly: Cohen's kappa 0.52.
- The point of the project is honest measurement of a streaming system, not inflated claims.

## Skills (from shipped project work)

Python, TypeScript, LangGraph, MCP (Model Context Protocol), ChromaDB, RAGAS
evaluation, FastAPI, Apache Kafka (KRaft), Docker & Docker Compose, GitHub
Actions CI, Next.js, SSE streaming UIs.

<!-- TODO(M0): extend with skills not evidenced by the two lead projects. -->

## Beyond work

- Big football fan — the tactics, the rhythm of a match, the culture around the game. He keeps his club allegiance off the record online; ask him in person.
- Broad tech enthusiast — genuinely curious about technology well beyond the data stack.
<!-- TODO(M0): add his current-curiosity list once provided. -->

## About this assistant

- This chat is grounded in this one profile document — there is no vector
  database because the whole profile fits in the model's context (a deliberate
  right-sizing decision).
- For anything not covered here, the right move is to email Shubham directly.
