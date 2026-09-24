import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

/**
 * Shared Upstash client for the question log and the keep-alive job. Returns
 * null when the env vars aren't set, so callers can fail open. (The rate
 * limiter builds its own client in lib/chat/ratelimit.ts.)
 */
export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  redis =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ? Redis.fromEnv()
      : null;
  return redis;
}

/** Written once a day by /api/keepalive; shown on /admin/chat. */
export const KEEPALIVE_KEY = "keepalive:last";
