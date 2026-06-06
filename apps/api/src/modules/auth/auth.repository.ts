import { eq } from "drizzle-orm";
import { db } from "../../db/drizzle.js";
import { users } from "../../db/schema/index.js";
import type { PublicUser } from "@opsflow/shared";

export async function findUserByEmail(email: string): Promise<PublicUser | null> {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const row = result[0];
  return row ? { ...row, role: row.role as PublicUser["role"] } : null;
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  const row = result[0];
  return row ? { ...row, role: row.role as PublicUser["role"] } : null;
}

export async function findUserWithPasswordByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] ?? null;
}
