import { eq } from "drizzle-orm";
import { db } from "../../db/drizzle.js";
import { users } from "../../db/schema/index.js";
import type { PublicUser } from "@opsflow/shared";

export async function findUsers(role?: string): Promise<PublicUser[]> {
  const query = db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users);

  const rows = role ? await query.where(eq(users.role, role)) : await query;

  return rows.map((row) => ({
    ...row,
    role: row.role as PublicUser["role"],
  }));
}
