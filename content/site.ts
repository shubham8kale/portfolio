/**
 * Single source of truth for identity and the public contact surface.
 * Guardrail: email + GitHub + LinkedIn only — no phone number, no work
 * authorization, anywhere on the site.
 */
export const site = {
  name: "Shubham Kale",
  role: "AI/Data Engineer",
  // TODO(M0): one-line pitch needs Shubham's sign-off before launch.
  pitch:
    "I build AI and data systems — and publish the evaluations that prove they work.",
  // TODO(M0): replace with the real Vercel deployment URL (or custom domain later).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "1842shubham@gmail.com",
  github: "https://github.com/shubham8kale",
  linkedin: "https://linkedin.com/in/shubham8kale",
  resumePath: "/resume.pdf",
} as const;

export const beyondWork = {
  football: {
    heading: "Football, always",
    // Generic-fan framing by decision — no club named anywhere on the site.
    body: "Big football fan — the tactics, the rhythm of a match, the culture around the game. Ask the chat bot about it.",
  },
  curiosity: {
    heading: "Currently curious about",
    body: "Broad tech enthusiast — genuinely into technology well beyond the data stack.",
    // TODO(M0): fill with Shubham's actual current interests (3–6 short items).
    // Rendered as chips only when non-empty; nothing is invented in the meantime.
    items: [] as string[],
  },
} as const;
