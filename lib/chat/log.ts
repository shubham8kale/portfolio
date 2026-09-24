import { Redis } from "@upstash/redis";

/**
 * Question log for the profile bot, so Shubham can see what visitors ask
 * about. Stored in the same Upstash Redis as the rate limiter, newest first,
 * capped at MAX_ENTRIES.
 *
 * Privacy: no IP address, user agent, or other identifier is stored. `sid` is
 * a random id the browser makes per tab session, used only to group one
 * visitor's questions into a conversation. The chat panel tells visitors
 * their questions are saved.
 *
 * Like the rate limiter, this fails open: without Upstash env vars, or with
 * Redis unreachable, the bot keeps working and nothing is logged.
 */

export const CHAT_LOG_KEY = "chat:log";
const MAX_ENTRIES = 5000;
const MAX_ANSWER_CHARS = 2000;

export type ChatSource = "suggested" | "followup" | "typed";

export type ChatLogEntry = {
  /** Unix ms. */
  t: number;
  sid: string;
  /** 1 for the first question in the conversation. */
  turn: number;
  source: ChatSource;
  /** Path the visitor was on, e.g. "/" or "/work/ai-auditor". */
  page: string;
  q: string;
  a: string;
  status: "ok" | "error" | "aborted";
};

export type ChatMeta = { sid: string; source: ChatSource; page: string };

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  redis =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ? Redis.fromEnv()
      : null;
  return redis;
}

/** Parses the optional, untrusted `meta` field of a chat request. */
export function parseMeta(body: unknown): ChatMeta {
  const raw = (body as { meta?: unknown } | null)?.meta;
  const meta = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const sid =
    typeof meta.sid === "string" && /^[a-z0-9-]{8,40}$/i.test(meta.sid) ? meta.sid : "unknown";
  const source: ChatSource =
    meta.source === "suggested" || meta.source === "followup" ? meta.source : "typed";
  const page =
    typeof meta.page === "string" && /^\/[\w\-/]{0,100}$/.test(meta.page) ? meta.page : "/";
  return { sid, source, page };
}

export async function logChatTurn(entry: ChatLogEntry): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    await client.lpush(CHAT_LOG_KEY, {
      ...entry,
      a: entry.a.slice(0, MAX_ANSWER_CHARS),
    });
    await client.ltrim(CHAT_LOG_KEY, 0, MAX_ENTRIES - 1);
  } catch (err) {
    console.error("[chat] could not log question", err);
  }
}

/** Newest first. Returns null when logging isn't configured. */
export async function readChatLog(limit = MAX_ENTRIES): Promise<ChatLogEntry[] | null> {
  const client = getRedis();
  if (!client) return null;
  return client.lrange<ChatLogEntry>(CHAT_LOG_KEY, 0, limit - 1);
}
