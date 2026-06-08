import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getDashboardMetrics } from "./dashboard.service.js";

const dashboardRoutes = new Hono();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get("/metrics", async (c) => {
  const result = await getDashboardMetrics();
  return c.json({ data: result.data });
});

export { dashboardRoutes };
