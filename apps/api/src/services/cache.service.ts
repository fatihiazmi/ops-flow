import { redis } from "../db/redis.js";

async function ensureConnected(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export async function cacheGet(key: string): Promise<string | null> {
  await ensureConnected();
  return redis.get(key);
}

export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds: number
): Promise<void> {
  await ensureConnected();
  await redis.setEx(key, ttlSeconds, value);
}

export async function cacheDelete(key: string): Promise<void> {
  await ensureConnected();
  await redis.del(key);
}
