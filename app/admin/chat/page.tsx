import type { Metadata } from "next";
import { connection } from "next/server";
import { readChatLog, type ChatLogEntry } from "@/lib/chat/log";
import { TOPICS, looksUnanswered, topicsFor } from "@/lib/chat/topics";
import { Markdown } from "@/components/chat/Markdown";

/**
 * Private view of what visitors ask the profile bot. Gated by HTTP Basic auth
 * in proxy.ts (ADMIN_PASSWORD); never indexed.
 */
export const metadata: Metadata = {
  title: "Chat questions",
  robots: { index: false, follow: false },
};

const TZ = "America/New_York";
const dateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }); // YYYY-MM-DD
const dayLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  month: "short",
  day: "numeric",
});

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-ink">{value}</p>
      {note && <p className="mt-1 text-xs text-ink-muted">{note}</p>}
    </div>
  );
}

/** The last `n` calendar days (oldest first) with their question counts. */
function lastDays(n: number, perDay: Map<string, number>) {
  const now = Date.now();
  return Array.from({ length: n }, (_, i) => {
    const t = now - (n - 1 - i) * 86_400_000;
    const key = dayKey.format(t);
    return { key, label: dayLabel.format(t), count: perDay.get(key) ?? 0 };
  });
}

function pct(part: number, whole: number) {
  return whole === 0 ? "0%" : `${Math.round((part / whole) * 100)}%`;
}

export default async function ChatAdminPage() {
  await connection(); // always read fresh at request time

  const entries = await readChatLog();

  if (entries === null) {
    return (
      <main id="main" className="py-16">
        <h1 className="font-display text-4xl text-ink">Chat questions</h1>
        <p className="mt-4 text-ink-muted">
          Logging isn&apos;t configured. Set UPSTASH_REDIS_REST_URL and
          UPSTASH_REDIS_REST_TOKEN to start recording questions.
        </p>
      </main>
    );
  }

  const sessions = new Map<string, ChatLogEntry[]>();
  for (const e of entries) {
    const list = sessions.get(e.sid) ?? [];
    list.push(e);
    sessions.set(e.sid, list);
  }

  const total = entries.length;
  const typed = entries.filter((e) => e.source === "typed").length;
  const unanswered = entries.filter((e) => e.status === "ok" && looksUnanswered(e.a));

  const topicCounts = new Map<string, number>();
  for (const e of entries) {
    for (const t of topicsFor(e.q)) topicCounts.set(t, (topicCounts.get(t) ?? 0) + 1);
  }
  const topics = [...TOPICS.map((t) => t.name), "Other"]
    .map((name) => ({ name, count: topicCounts.get(name) ?? 0 }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);
  const topicMax = Math.max(1, ...topics.map((t) => t.count));

  // Questions per day, last 14 days (oldest first).
  const perDay = new Map<string, number>();
  for (const e of entries) {
    const key = dayKey.format(e.t);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }
  const days = lastDays(14, perDay);
  const dayMax = Math.max(1, ...days.map((d) => d.count));

  // Most-asked exact questions (mostly the suggested prompts).
  const questionCounts = new Map<string, number>();
  for (const e of entries) questionCounts.set(e.q, (questionCounts.get(e.q) ?? 0) + 1);
  const topQuestions = [...questionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const conversations = [...sessions.values()]
    .map((list) => [...list].sort((a, b) => a.t - b.t))
    .sort((a, b) => b[b.length - 1].t - a[a.length - 1].t)
    .slice(0, 100);

  return (
    <main id="main" className="py-12 space-y-14">
      <header>
        <h1 className="font-display text-4xl text-ink">Chat questions</h1>
        <p className="mt-2 text-sm text-ink-muted">
          The last {total} questions visitors asked the profile bot. Times are US
          Eastern. Visitors are anonymous; a conversation is one browser tab.
        </p>
      </header>

      <section className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Stat label="Questions" value={String(total)} />
        <Stat label="Conversations" value={String(sessions.size)} />
        <Stat
          label="Questions per conversation"
          value={sessions.size ? (total / sessions.size).toFixed(1) : "0"}
        />
        <Stat
          label="Typed their own question"
          value={pct(typed, total)}
          note="the rest clicked a suggestion"
        />
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ink">Topics</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Keyword buckets; one question can count toward several.
          </p>
          <ul className="mt-5 space-y-2.5">
            {topics.map((t) => (
              <li key={t.name} className="grid grid-cols-[10rem_1fr_2.5rem] items-center gap-3 text-sm">
                <span className="truncate">{t.name}</span>
                <span className="h-2.5 rounded-r bg-pitch" style={{ width: `${(t.count / topicMax) * 100}%` }} />
                <span className="text-right tabular-nums text-ink-muted">{t.count}</span>
              </li>
            ))}
            {topics.length === 0 && <li className="text-sm text-ink-muted">No questions yet.</li>}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink">Questions per day</h2>
          <p className="mt-1 text-xs text-ink-muted">Last 14 days.</p>
          <div className="mt-5 flex h-40 items-end gap-1.5 border-b border-line">
            {days.map((d) => (
              <div key={d.key} className="flex h-full flex-1 flex-col justify-end" title={`${d.label}: ${d.count}`}>
                {d.count > 0 && (
                  <span className="mb-1 text-center text-[0.65rem] tabular-nums text-ink-muted">{d.count}</span>
                )}
                <div
                  className="rounded-t bg-pitch"
                  style={{ height: `${(d.count / dayMax) * 80}%`, minHeight: d.count > 0 ? 3 : 0 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[0.65rem] text-ink-muted">
            <span>{days[0].label}</span>
            <span>{days[days.length - 1].label}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ink">Most asked</h2>
          <ol className="mt-5 space-y-2 text-sm">
            {topQuestions.map(([q, n]) => (
              <li key={q} className="flex justify-between gap-4 border-b border-line pb-2">
                <span>{q}</span>
                <span className="tabular-nums text-ink-muted">{n}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink">The bot couldn&apos;t answer</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Answers that sound like &quot;I don&apos;t have that information&quot;. These are
            gaps you could fill in content/profile.md.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {unanswered.slice(0, 30).map((e) => (
              <li key={`${e.sid}-${e.t}`} className="flex justify-between gap-4 border-b border-line pb-2">
                <span>{e.q}</span>
                <span className="shrink-0 text-xs text-ink-muted">{dateTime.format(e.t)}</span>
              </li>
            ))}
            {unanswered.length === 0 && <li className="text-ink-muted">None so far.</li>}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Conversations</h2>
        <p className="mt-1 text-xs text-ink-muted">Newest first. Open one to see the answers.</p>
        <ul className="mt-5 space-y-3">
          {conversations.map((list) => {
            const first = list[0];
            return (
              <li key={first.sid} className="rounded-xl border border-line">
                <details>
                  <summary className="cursor-pointer list-none px-4 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-medium text-ink">{first.q}</span>
                      <span className="text-xs text-ink-muted">
                        {dateTime.format(first.t)} · {list.length} question{list.length === 1 ? "" : "s"} · on {first.page}
                      </span>
                    </span>
                  </summary>
                  <ol className="space-y-5 border-t border-line px-4 py-4">
                    {list.map((e) => (
                      <li key={e.t}>
                        <p className="text-sm font-medium text-ink">
                          {e.q}{" "}
                          <span className="font-normal text-xs text-ink-muted">
                            ({e.source}
                            {e.status !== "ok" ? `, ${e.status}` : ""})
                          </span>
                        </p>
                        <div className="mt-1.5 text-sm text-ink-muted">
                          {e.a ? <Markdown text={e.a} /> : "(no answer)"}
                        </div>
                      </li>
                    ))}
                  </ol>
                </details>
              </li>
            );
          })}
          {conversations.length === 0 && <li className="text-sm text-ink-muted">No conversations yet.</li>}
        </ul>
      </section>
    </main>
  );
}
