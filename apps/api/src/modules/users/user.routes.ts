import { Hono } from "hono";
import { listUsers } from "./user.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const userRoutes = new Hono();

userRoutes.use(authMiddleware);

userRoutes.get("/", async (c) => {
  const query = c.req.query();
  const result = await listUsers(query);
  return c.json(result);
});

export { userRoutes };
