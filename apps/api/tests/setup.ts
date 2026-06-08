import { beforeAll } from "vitest";

beforeAll(() => {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
      "postgres://opsflow:opsflow_password@localhost:5432/opsflow";
  }
  if (!process.env.REDIS_URL) {
    process.env.REDIS_URL = "redis://localhost:6379";
  }
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "dev_only_change_me_later";
  }
  if (!process.env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN = "http://localhost:5173";
  }
});
