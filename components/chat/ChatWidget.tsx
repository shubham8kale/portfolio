"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { HERO_CHAT_CTA_ID, OPEN_CHAT_EVENT } from "./ChatLauncher";
import { Markdown } from "./Markdown";
import { site } from "@/content/site";

type Message = { role: "user" | "assistant"; content: string };
type Source = "suggested" | "followup" | "typed";

/** Shown before the first question, in this order. */
const STARTERS = [
  "What has he shipped with LLMs in production?",
  "How were the RAG evals run?",
  "Is he actually into football?",
];

/** Offered two at a time after each answer, skipping anything already asked. */
const FOLLOW_UPS = [
  "What does the AI Auditor do?",
  "What's his data engineering experience?",
  "Which roles is he looking for?",
  "What tools does he use day to day?",
  "Where did he study?",
  ...STARTERS,
];

/** After a visitor closes the panel, don't auto-open it again for a day. */
const DISMISS_KEY = "chat:dismissedAt";
const DISMISS_MS = 24 * 60 * 60 * 1000;
const SID_KEY = "chat:sid";
/** Floating panel (not a modal sheet) from here up. */
const DESKTOP_QUERY = "(min-width: 640px)";
/** Wide enough to open by default and dock beside the page (see globals.css). */
const DOCK_QUERY = "(min-width: 1024px)";

function readStorage(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage: "local" | "session", key: string, value: string) {
  try {
    (storage === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    // Blocked storage: the preference just won't persist.
  }
}

/** Random per-tab id that groups one visitor's questions in the log. */
function sessionId(): string {
  const existing = readStorage("session", SID_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  writeStorage("session", SID_KEY, id);
  return id;
}

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" role="status" aria-label="Answer loading">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 rounded-full bg-ink-muted"
          style={{ animation: `chat-dot 1s ${delay}ms infinite ease-in-out` }}
        />
      ))}
    </span>
  );
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
  // The floating launcher hides while the hero's own chat button is visible.
  // Keyed by path so a stale "visible" from the home page can't hide it
  // on a page that has no hero.
  const [heroCta, setHeroCta] = useState({ path: "", visible: false });
  const heroCtaVisible = heroCta.path === pathname && heroCta.visible;
  // Mobile nudge in place of auto-opening a full-screen sheet.
  const [peek, setPeek] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef(false);

  // First visit: open by default on wide screens, docked beside the page; on
  // narrower screens, where it would cover the content, show a nudge instead.
  // A short delay lets the page paint before the panel slides in.
  useEffect(() => {
    const dismissedAt = Number(readStorage("local", DISMISS_KEY) ?? 0);
    if (Date.now() - dismissedAt < DISMISS_MS) return;
    const timer = window.setTimeout(() => {
      if (window.matchMedia(DOCK_QUERY).matches) setOpen(true);
      else setPeek(true);
    }, 800);
    return () => window.clearTimeout(timer);
  }, []);

  const openChat = useCallback(() => {
    focusOnOpen.current = true;
    setPeek(false);
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setOpen(false);
    setPeek(false);
    writeStorage("local", DISMISS_KEY, String(Date.now()));
  }, []);

  // Lets globals.css reserve a column for the open panel on wide screens.
  const docked = open && !pathname.startsWith("/admin");
  useEffect(() => {
    document.documentElement.dataset.chat = docked ? "open" : "closed";
  }, [docked]);

  useEffect(() => {
    window.addEventListener(OPEN_CHAT_EVENT, openChat);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, openChat);
  }, [openChat]);

  useEffect(() => {
    const cta = document.getElementById(HERO_CHAT_CTA_ID);
    if (!cta) return;
    const observer = new IntersectionObserver((entries) =>
      setHeroCta({ path: pathname, visible: entries[0].isIntersecting }),
    );
    observer.observe(cta);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    // Only take focus when the visitor opened the panel themselves.
    if (focusOnOpen.current) {
      inputRef.current?.focus();
      focusOnOpen.current = false;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  const send = useCallback(
    async (text: string, source: Source) => {
      const question = text.trim();
      if (!question || busy) return;
      setNotice(null);
      setInput("");
      const history: Message[] = [...messages, { role: "user", content: question }];
      setMessages(history);
      setBusy(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            meta: { sid: sessionId(), source, page: window.location.pathname },
          }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          setNotice(data?.error ?? "Something went wrong - try again.");
          // Put the question back so it can be re-sent as-is.
          setMessages(messages);
          setInput(question);
          return;
        }

        setMessages((current) => [...current, { role: "assistant", content: "" }]);
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") continue;
            try {
              const parsed = JSON.parse(payload) as {
                text?: string;
                error?: string;
              };
              if (parsed.error) setNotice(parsed.error);
              if (parsed.text) {
                setMessages((current) => {
                  const next = [...current];
                  const last = next[next.length - 1];
                  next[next.length - 1] = {
                    ...last,
                    content: last.content + parsed.text,
                  };
                  return next;
                });
              }
            } catch {
              // ignore malformed frames
            }
          }
        }
      } catch {
        setNotice("Network hiccup - try again.");
      } finally {
        setBusy(false);
        if (window.matchMedia(DESKTOP_QUERY).matches) inputRef.current?.focus();
      }
    },
    [busy, messages],
  );

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const last = messages[messages.length - 1];
  const waiting = busy && (last?.role === "user" || last?.content === "");
  const followUps =
    !busy && last?.role === "assistant" && last.content
      ? FOLLOW_UPS.filter((q) => !asked.has(q)).slice(0, 2)
      : [];
  const showLauncher = !open && !heroCtaVisible;

  // Not on the private admin pages.
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {showLauncher && peek && (
        <div className="fixed bottom-20 right-5 z-40 max-w-[16rem] rounded-2xl rounded-br-sm border border-line bg-paper p-4 shadow-lg">
          <button
            type="button"
            onClick={closeChat}
            className="absolute right-2 top-2 px-1.5 text-sm text-ink-muted hover:text-ink cursor-pointer"
            aria-label="Dismiss"
          >
            ✕
          </button>
          <p className="pr-5 text-sm leading-relaxed">
            Questions about Shubham&apos;s work? This bot answers from his profile.
          </p>
          <button
            type="button"
            onClick={openChat}
            className="mt-2 text-sm font-medium text-pitch underline underline-offset-4 cursor-pointer"
          >
            Ask a question
          </button>
        </div>
      )}

      {showLauncher && (
        <button
          type="button"
          onClick={openChat}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 bg-pitch hover:bg-pitch-deep text-paper text-sm font-medium px-5 py-3.5 rounded-full shadow-lg transition-colors cursor-pointer"
          aria-label="Open profile chat"
        >
          <span className="inline-block size-2 rounded-full bg-paper" aria-hidden />
          Ask my profile
        </button>
      )}

      {open && (
        <>
          {/* Phones get a modal sheet; on desktop the panel sits beside the page. */}
          {!isDesktop && (
            <button
              type="button"
              aria-label="Close chat"
              onClick={closeChat}
              className="fixed inset-0 z-40 bg-scrim cursor-default"
            />
          )}
          <div
            role="dialog"
            aria-modal={!isDesktop}
            aria-label="Chat with Shubham's profile"
            className={`fixed z-50 bg-paper border-line shadow-2xl flex flex-col inset-x-0 bottom-0 top-16 rounded-t-2xl border-t sm:inset-auto sm:right-5 sm:bottom-5 sm:top-auto sm:w-[24rem] sm:max-h-[calc(100vh-6rem)] sm:rounded-2xl sm:border lg:top-5 lg:max-h-none ${
              messages.length > 0 ? "sm:h-[34rem] lg:h-auto" : ""
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div>
                <p className="font-display text-lg text-ink flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full bg-pitch" aria-hidden />
                  Ask my profile
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  An AI assistant that answers from my profile
                </p>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className="text-sm text-ink-muted hover:text-ink px-2 py-1 cursor-pointer"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
              aria-live="polite"
            >
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-ink-muted leading-relaxed pb-1">
                    Hi! Ask about Shubham&apos;s projects, experience, skills, or
                    football. Try one of these:
                  </p>
                  {STARTERS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt, "suggested")}
                      className="block w-full text-left text-sm border border-line hover:border-pitch hover:bg-paper-deep rounded-xl px-4 py-3 transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((message, i) =>
                message.role === "user" ? (
                  <div
                    key={i}
                    className="ml-8 bg-pitch-soft rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed"
                  >
                    {message.content}
                  </div>
                ) : message.content ? (
                  <div key={i} className="mr-4 text-sm leading-relaxed">
                    <Markdown text={message.content} />
                  </div>
                ) : null,
              )}
              {waiting && <TypingDots />}
              {notice && (
                <p className="text-sm text-pitch-deep bg-pitch-soft rounded-xl px-4 py-3">
                  {notice}
                </p>
              )}
              {followUps.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {followUps.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt, "followup")}
                      className="text-left text-xs border border-line hover:border-pitch rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              className="px-5 pt-3 pb-4 border-t border-line"
              onSubmit={(e) => {
                e.preventDefault();
                send(input, "typed");
              }}
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={1000}
                  placeholder="Ask something…"
                  aria-label="Your question"
                  className="flex-1 min-w-0 bg-paper-deep border border-line focus:border-pitch outline-none rounded-full px-4 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  disabled={busy || input.trim().length === 0}
                  className="bg-pitch hover:bg-pitch-deep disabled:opacity-40 disabled:cursor-not-allowed text-paper text-sm font-medium px-5 rounded-full transition-colors cursor-pointer"
                >
                  Send
                </button>
              </div>
              <p className="mt-2.5 text-[0.65rem] leading-relaxed text-ink-muted">
                AI answers can be wrong - check anything important with me at{" "}
                <a className="underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                . Questions are saved without any personal details so I can see
                what people ask.
              </p>
            </form>
          </div>
        </>
      )}
    </>
  );
}
