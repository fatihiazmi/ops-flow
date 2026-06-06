import { Hono } from "hono";
import { loginRequestSchema } from "./auth.schemas.js";
import { login, getUserFromToken } from "./auth.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { success, errorResponse } from "../../utils/api-response.js";

const authRoutes = new Hono();

authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      errorResponse("VALIDATION_ERROR", "Invalid request body", parsed.error.format()),
      400
    );
  }

  const result = await login(parsed.data.email, parsed.data.password);
  if (!result) {
    return c.json(
      errorResponse("UNAUTHORIZED", "Invalid email or password"),
      401
    );
  }

  return c.json(success({ token: result.token, user: result.user }));
});

authRoutes.get("/me", authMiddleware, async (c) => {
  const token = c.req.header("Authorization")!.slice(7);
  const user = await getUserFromToken(token);
  if (!user) {
    return c.json(errorResponse("UNAUTHORIZED", "User not found"), 401);
  }
  return c.json(success(user));
});

export { authRoutes };
