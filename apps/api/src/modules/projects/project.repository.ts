import { eq } from "drizzle-orm";
import { db } from "../../db/drizzle.js";
import { projects } from "../../db/schema/index.js";
import type { ProjectRow, DBOrTx } from "./project.types.js";

export async function findAllProjects(): Promise<ProjectRow[]> {
  return db.select().from(projects).orderBy(projects.key);
}

export async function findProjectByKey(key: string): Promise<ProjectRow | null> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.key, key.toUpperCase()))
    .limit(1);
  return rows[0] ?? null;
}

export async function findProjectById(id: string): Promise<ProjectRow | null> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function insertProject(
  data: typeof projects.$inferInsert,
  dbOrTx: DBOrTx = db
): Promise<ProjectRow> {
  const rows = await dbOrTx.insert(projects).values(data).returning();
  return rows[0];
}
