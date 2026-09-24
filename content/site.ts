/**
 * Single source of truth for identity and the public contact surface.
 *
 * Guardrail, scoped precisely: the site's own copy carries email + GitHub +
 * LinkedIn only, and no phone number or work-authorization status appears in
 * any page, component, metadata field, or in the profile bot's knowledge file.
 *
 * The one deliberate exception is the hosted resume PDF, which carries a phone
 * number in its header because it is the same file sent to employers. Anyone
 * downloading it has already chosen to. Do not restate the number anywhere in
 * this repo, and do not read the guardrail as covering that PDF.
 */
export const site = {
  name: "Shubham Kale",
  // Lead identity is a single track. This string feeds the page title, OG and
  // Twitter cards, the JSON-LD jobTitle, and the hero kicker, so it is the
  // highest-leverage line on the site. Other role families he is open to live
  // in the hero's "Looking at" line and in content/profile.md, not here.
  role: "AI Engineer",
  pitch:
    "I build AI systems and the data pipelines they run on.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "1842shubham@gmail.com",
  github: "https://github.com/shubham8kale",
  linkedin: "https://linkedin.com/in/shubham8kale",
  // Descriptive filename so the downloaded file is named well in a recruiter's
  // downloads folder. Lives in public/.
  resumePath: "/ShubhamKishorKale_Resume.pdf",
} as const;

export const beyondWork = {
  football: {
    heading: "Football, always",
    // Page face stays a teaser; the bot names the clubs. (Clubs live in
    // content/profile.md.) Flip to naming them here if desired.
    body: "I watch matches for the tactics as much as the result: team shape, how a side presses. I've played in an amateur league and put a lot of hours into FIFA. Ask the chat bot which teams I support.",
  },
  curiosity: {
    heading: "Currently curious about",
    body: "Things I'm reading about outside my usual stack.",
    // Rendered as chips; sourced from Shubham's curated bot knowledge.
    items: [
      "LLM observability & tracing",
      "Multi-agent orchestration",
      "Formal A/B testing at scale",
      "Layout-aware document parsing",
      "ML on Kubernetes",
      "The MCP ecosystem",
    ] as string[],
  },
} as const;
