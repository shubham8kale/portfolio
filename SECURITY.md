# Security Policy

## Reporting a vulnerability

If you find a security issue in this site or its chat API, please email
**1842shubham@gmail.com** with a description and reproduction steps. You should
get a reply within a few days. Please don't open a public issue for anything
sensitive.

## Scope

- This repository and the deployment at https://shubham8kale.vercel.app
- The `/api/chat` endpoint (server-side LLM proxy with rate limiting)

## Out of scope

- Rate-limit responses (HTTP 429) — those are working as intended
- The chat bot declining questions — grounding guardrails, not a bug
- Vulnerabilities in third-party services (Groq, Upstash, Vercel) — report
  those to the respective vendors

## Notes for researchers

- No secrets live in this repository or its git history; API keys exist only
  as server-side environment variables.
- The bot's knowledge is a single public markdown file
  ([content/profile.md](content/profile.md)) — there is no private data behind
  the endpoint to exfiltrate.
