import { createHash, timingSafeEqual } from "node:crypto";
import { getRedis, KEEPALIVE_KEY } from "@/lib/redis";

export const runtime = "nodejs";

/**
 * Daily keep-alive for the free Upstash database, which Upstash deletes after
 * 14 days without activity - taking the chat question log with it. Called by
 * the Vercel cron in vercel.json.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET` on cron requests when the
 * CRON_SECRET env var is set; anything else is refused, so the endpoint can't
 * be used to burn Redis commands.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "CRON_SECRET is not set." }, { status: 503 });
  }
  const digest = (s: string) => createHash("sha256").update(s).digest();
  const supplied = request.headers.get("authorization") ?? "";
  if (!timingSafeEqual(digest(supplied), digest(`Bearer ${secret}`))) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    return Response.json({ error: "Upstash is not configured." }, { status: 503 });
  }

  try {
    // A write, not just a read, so it unambiguously counts as activity.
    const at = new Date().toISOString();
    await redis.set(KEEPALIVE_KEY, at);
    return Response.json({ ok: true, at });
  } catch (err) {
    console.error("[keepalive] Upstash write failed", err);
    // Non-2xx so the failure shows up in Vercel's cron logs.
    return Response.json({ error: "Upstash write failed." }, { status: 502 });
  }
}
