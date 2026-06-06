export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_PORT: Number(process.env.API_PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "postgres://opsflow:opsflow_password@postgres:5432/opsflow",
  REDIS_URL: process.env.REDIS_URL || "redis://redis:6379",
  JWT_SECRET: process.env.JWT_SECRET || "dev_only_change_me_later",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};
