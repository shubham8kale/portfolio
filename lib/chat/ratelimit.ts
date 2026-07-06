import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Two independent bounds:
 *  - per-IP sliding window (one abuser can't monopolize the bot)
 *  - global daily cap (bounds total upstream usage no matter how many IPs)
 *
 * When Upstash env vars are absent (local dev, or before the account is set
 * up) both checks no-op with a console warning — the Groq free-tier quota is
 * still a hard backstop in that state.
 */

type LimitResult = { ok: true } | { ok: false; reason: "ip" | "global" };

let warned = false;

function getLimiters() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!warned) {
      console.warn(
        "[chat] Upstash env vars not set — rate limiting disabled for this instance.",
      );
      warned = true;
    }
    return null;
  }
  const redis = Redis.fromEnv();
  return {
    perIp: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 m"),
      prefix: "chat:ip",
    }),
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(300, "1 d"),
      prefix: "chat:global",
    }),
  };
}

export async function checkRateLimit(ip: string): Promise<LimitResult> {
  const limiters = getLimiters();
  if (!limiters) return { ok: true };

  const perIp = await limiters.perIp.limit(ip);
  if (!perIp.success) return { ok: false, reason: "ip" };

  const global = await limiters.global.limit("all");
  if (!global.success) return { ok: false, reason: "global" };

  return { ok: true };
}
