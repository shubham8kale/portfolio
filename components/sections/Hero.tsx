import { site } from "@/content/site";
import { ChatLauncher } from "@/components/chat/ChatLauncher";

export function Hero() {
  return (
    <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-pitch mb-6">
        {site.name} — {site.role}
      </p>
      <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] tracking-tight text-ink max-w-4xl">
        I build AI and data systems — and{" "}
        <em className="text-pitch">publish the evaluations</em> that prove they
        work.
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-ink-muted leading-relaxed">
        Agentic RAG with a live deployment and RAGAS evals. Real-time streaming
        pipelines with honestly reported metrics. The numbers below are
        measured, not marketed.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href={site.resumePath}
          className="bg-pitch hover:bg-pitch-deep text-paper font-mono text-sm px-5 py-3 rounded-full transition-colors"
          download
        >
          Résumé (PDF)
        </a>
        <ChatLauncher className="border border-line hover:border-pitch text-ink font-mono text-sm px-5 py-3 rounded-full transition-colors cursor-pointer inline-flex items-center gap-2">
          <span
            className="inline-block size-2 rounded-full bg-pitch"
            aria-hidden
          />
          Ask my profile anything
        </ChatLauncher>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
        <a
          className="text-ink-muted hover:text-pitch underline underline-offset-4 decoration-line hover:decoration-pitch transition-colors"
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
        <a
          className="text-ink-muted hover:text-pitch underline underline-offset-4 decoration-line hover:decoration-pitch transition-colors"
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn ↗
        </a>
        <a
          className="text-ink-muted hover:text-pitch underline underline-offset-4 decoration-line hover:decoration-pitch transition-colors"
          href={`mailto:${site.email}`}
        >
          {site.email}
        </a>
      </div>

      <p className="mt-10 font-mono text-xs text-ink-muted tracking-wide">
        Looking at: Data Engineering · AI Engineering · Data Science · Software
        Engineering
      </p>
    </section>
  );
}
