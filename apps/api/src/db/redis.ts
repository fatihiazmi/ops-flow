import { createClient, type RedisClientType } from "redis";
import { env } from "../config/env.js";

export const redis: RedisClientType = createClient({
  url: env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

async function ensureConnected(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export async function checkRedis(): Promise<boolean> {
  try {
    await ensureConnected();
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
