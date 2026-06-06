import { createMiddleware } from "hono/factory";
import { jwtVerify } from "jose";
import { env } from "../config/env.js";
import { errorResponse } from "../utils/api-response.js";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json(
      errorResponse("UNAUTHORIZED", "Missing or invalid authorization header"),
      401
    );
  }

  const token = authHeader.slice(7);
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      clockTolerance: 60,
    });
    c.set("user", payload);
    await next();
    return;
  } catch {
    return c.json(
      errorResponse("UNAUTHORIZED", "Invalid or expired token"),
      401
    );
  }
});
