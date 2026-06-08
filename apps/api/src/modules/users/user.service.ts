import { userListQuerySchema } from "./user.schemas.js";
import { findUsers } from "./user.repository.js";
import { AppError } from "../../utils/errors.js";
import { listSuccess } from "../../utils/api-response.js";
import type { PublicUser } from "@opsflow/shared";

export async function listUsers(query: unknown) {
  const parsed = userListQuerySchema.safeParse(query);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid query parameters", 400);
  }

  const users = await findUsers(parsed.data.role);
  return listSuccess<PublicUser>(users, {
    page: 1,
    pageSize: users.length,
    total: users.length,
    totalPages: 1,
  });
}
