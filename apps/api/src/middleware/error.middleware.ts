import type { ErrorHandler } from "hono";

export const errorMiddleware: ErrorHandler = (err, c) => {
  console.error("Unhandled error:", err);

  return c.json({
    status: "error",
    message: err.message || "Internal server error",
  }, 500);
};
