import { Hono } from "hono";
import { checkPostgres } from "../db/postgres.js";
import { checkRedis } from "../db/redis.js";

const healthRoutes = new Hono();

healthRoutes.get("/", (c) => {
  return c.json({
    status: "ok",
    service: "opsflow-api",
  });
});

export { healthRoutes };

const readyRoutes = new Hono();

readyRoutes.get("/", async (c) => {
  const postgresOk = await checkPostgres();
  const redisOk = await checkRedis();

  if (postgresOk && redisOk) {
    return c.json({
      status: "ready",
      postgres: "ok",
      redis: "ok",
    });
  }

  return c.json({
    status: "not_ready",
    postgres: postgresOk ? "ok" : "error",
    redis: redisOk ? "ok" : "error",
  }, 503);
});

export { readyRoutes };
