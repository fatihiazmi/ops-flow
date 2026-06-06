import type { StatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: StatusCode = 500
  ) {
    super(message);
  }
}
