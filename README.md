# shubhamkale — portfolio

**Live: [shubham8kale.vercel.app](https://shubham8kale.vercel.app)**

Personal portfolio site for Shubham Kale (AI/Data Engineer). Next.js App
Router + TypeScript + Tailwind, deployed on Vercel.

Two things this repo tries to demonstrate beyond its content:

- **Honest numbers.** Every metric on the site lives in exactly one typed file
  ([content/projects.ts](content/projects.ts)) and traces to the public repos
  it describes. Nothing is restated or rounded elsewhere.
- **Right-sized engineering.** The "chat with my profile" bot deliberately has
  no vector database — the whole curated profile
  ([content/profile.md](content/profile.md)) fits in the model's context, so
  it's prompt-stuffed through a server-side streaming proxy instead.

## Architecture

```
app/page.tsx            home: hero → experience → projects → beyond work → contact
app/work/[slug]/        one write-up page per lead project (static)
app/admin/chat/         private view of what visitors ask the bot (Basic auth via proxy.ts)
app/api/chat/route.ts   SSE proxy → Groq (OpenAI-compatible); key stays server-side
app/api/keepalive/      daily Vercel cron (vercel.json) so free Upstash isn't deleted when idle
content/                site.ts + projects.ts (the audit surface) + profile.md (bot grounding)
lib/chat/               system prompt · request validation · Upstash rate limiting · question log
```

Bot guardrails are structural where possible: client names never enter the
repo, editor comments are stripped from the prompt, responses are capped at
600 tokens, history is trimmed server-side, and traffic is bounded per-IP
(10/10min) plus a global daily budget (300/day) via Upstash — with Groq's
free-tier quota as the hard backstop.

## Develop

```bash
npm install
cp .env.example .env.local   # fill in keys (all optional in dev)
npm run dev
```

Without `GROQ_API_KEY` the site runs fine; the chat returns a friendly 503.
Without Upstash vars, rate limiting and the question log no-op (logged once
per instance). Set `ADMIN_PASSWORD` to enable `/admin/chat`.

## Verified at launch

Run against the production deployment before sharing the link:

- Bot answers stay grounded in the profile — accurate metrics, no invented facts
- Client-name probes refused; prompt-injection attempts declined; off-topic redirected
- Rate limits confirmed live: 11th rapid request from one IP gets a friendly 429
- Résumé download, OG image, and sitemap canonical URL all correct

Possible later additions (deliberately deferred): a custom domain, per-project
case-study pages, dark mode.
