import type { Context } from "hono";
import { redis } from "../db/redis.js";
import { errorResponse } from "../utils/api-response.js";

const WINDOW_SECONDS = 60;
const MAX_ATTEMPTS = 5;
const KEY_PREFIX = "rate-limit:login";

function getClientIp(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = c.req.header("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

function buildKey(ip: string): string {
  return `${KEY_PREFIX}:${ip}`;
}

async function ensureRedisConnected(): Promise<void> {
  if (redis.isOpen) return;
  try {
    await redis.connect();
  } catch {
    // Redis unavailable — silently pass
  }
}

export async function recordFailedLoginAttempt(c: Context): Promise<Response | null> {
  try {
    await ensureRedisConnected();

    const ip = getClientIp(c);
    const key = buildKey(ip);

    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    const remaining = MAX_ATTEMPTS - attempts;
    c.header("X-RateLimit-Limit", String(MAX_ATTEMPTS));
    c.header("X-RateLimit-Remaining", String(Math.max(0, remaining)));

    if (attempts > MAX_ATTEMPTS) {
      const ttl = await redis.ttl(key);
      const retryAfterSeconds = Math.max(0, ttl);

      return c.json(
        errorResponse(
          "RATE_LIMITED",
          "Too many login attempts. Please try again later.",
          { retryAfterSeconds }
        ),
        429
      );
    }

    return null;
  } catch {
    return null;
  }
}

export async function resetLoginRateLimit(c: Context): Promise<void> {
  try {
    await ensureRedisConnected();
    const ip = getClientIp(c);
    const key = buildKey(ip);
    await redis.del(key);
  } catch {
    // Silently fail
  }
}
