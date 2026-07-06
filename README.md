# shubhamkale — portfolio

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
app/page.tsx            single page: hero → projects → beyond work → contact
app/api/chat/route.ts   SSE proxy → Groq (OpenAI-compatible); key stays server-side
content/                site.ts + projects.ts (the audit surface) + profile.md (bot grounding)
lib/chat/               system prompt · request validation · Upstash rate limiting
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
Without Upstash vars, rate limiting no-ops (logged once per instance).

## Launch checklist (M0 content items)

- [ ] Drop the real `resume.pdf` into `public/` (no phone number in it)
- [ ] Replace the two `TODO(M0)` repo links + live-demo URL in `content/projects.ts`
- [ ] Fill `secondaryProjects` in `content/projects.ts` (section is hidden while empty)
- [ ] Review/extend `content/profile.md` (the bot's entire knowledge — read the editing rules at the top)
- [ ] Add the current-curiosity list in `content/site.ts` → `beyondWork.curiosity.items`
- [ ] Sign off the one-line hero pitch in `content/site.ts`
- [ ] Vercel env vars: `GROQ_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_SITE_URL`
- [ ] Verify Groq's current model catalog; override `GROQ_MODEL` if the default has rotated
- [ ] After first deploy: test the bot live, including the adversarial prompts in the plan
