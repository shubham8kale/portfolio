"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OPEN_CHAT_EVENT } from "./ChatLauncher";
import { site } from "@/content/site";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What's the strongest evidence he can do data engineering?",
  "How were the RAG evals run?",
  "Is he actually into football?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  const send = useCallback(
    async (text: string) => {
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
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          setNotice(data?.error ?? "Something went wrong - try again.");
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
        inputRef.current?.focus();
      }
    },
    [busy, messages],
  );

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-pitch hover:bg-pitch-deep text-paper font-mono text-sm px-5 py-3.5 rounded-full shadow-lg transition-colors cursor-pointer"
          aria-label="Open profile chat"
        >
          Ask my profile
        </button>
      )}

      {open && (
        <>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-ink/30 cursor-default"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Shubham's profile"
            className="fixed z-50 bg-paper border-line shadow-2xl flex flex-col inset-x-0 bottom-0 top-16 rounded-t-2xl border-t sm:inset-auto sm:right-5 sm:bottom-5 sm:top-auto sm:h-[36rem] sm:max-h-[calc(100vh-4rem)] sm:w-[26rem] sm:rounded-2xl sm:border"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div>
                <p className="font-display text-lg text-ink">Ask my profile</p>
                <p className="font-mono text-[0.65rem] text-ink-muted mt-0.5">
                  grounded in one markdown file · no RAG needed
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-sm text-ink-muted hover:text-ink px-2 py-1 cursor-pointer"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Ask about Shubham&apos;s projects, skills, experience - or
                    football.
                  </p>
                  {SUGGESTED.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt)}
                      className="block w-full text-left text-sm border border-line hover:border-pitch rounded-xl px-4 py-3 transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={
                    message.role === "user"
                      ? "ml-8 bg-pitch-soft rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed"
                      : "mr-4 text-sm leading-relaxed whitespace-pre-wrap"
                  }
                >
                  {message.content ||
                    (busy && i === messages.length - 1 ? "…" : "")}
                </div>
              ))}
              {notice && (
                <p className="text-sm text-pitch-deep bg-pitch-soft rounded-xl px-4 py-3">
                  {notice}
                </p>
              )}
            </div>

            <form
              className="px-5 pt-3 pb-4 border-t border-line"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
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
                  className="flex-1 bg-paper-deep border border-line focus:border-pitch outline-none rounded-full px-4 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  disabled={busy || input.trim().length === 0}
                  className="bg-pitch hover:bg-pitch-deep disabled:opacity-40 disabled:cursor-not-allowed text-paper font-mono text-sm px-5 rounded-full transition-colors cursor-pointer"
                >
                  Send
                </button>
              </div>
              <p className="mt-2.5 text-[0.65rem] leading-relaxed text-ink-muted">
                AI assistant answering from Shubham&apos;s published profile - it
                may be imperfect. Verify anything important with him directly:{" "}
                <a className="underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
            </form>
          </div>
        </>
      )}
    </>
  );
}
