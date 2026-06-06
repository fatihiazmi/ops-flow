import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { AppError } from "../utils/errors.js";
import { errorResponse } from "../utils/api-response.js";

export const errorMiddleware: ErrorHandler = (err, c) => {
  console.error("Unhandled error:", err);

  if (err instanceof AppError) {
    c.status(err.status);
    return c.json(errorResponse(err.code, err.message));
  }

  if (err instanceof HTTPException) {
    const codeMap: Record<number, string> = {
      400: "VALIDATION_ERROR",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
    };
    return c.json(
      errorResponse(
        codeMap[err.status] || "INTERNAL_SERVER_ERROR",
        err.message
      ),
      err.status
    );
  }

  return c.json(
    errorResponse(
      "INTERNAL_SERVER_ERROR",
      err.message || "Internal server error"
    ),
    500
  );
};
