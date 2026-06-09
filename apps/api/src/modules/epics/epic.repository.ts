import { eq, asc, desc, count } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../db/drizzle.js";
import { epics, users } from "../../db/schema/index.js";
import type { EpicListQuery } from "./epic.schemas.js";
import type { EpicWithOwnerRow, DBOrTx } from "./epic.types.js";

const owner = alias(users, "owner");

export async function findEpicsByProject(
  projectId: string,
  query: EpicListQuery
): Promise<{ data: EpicWithOwnerRow[]; total: number }> {
  const where = eq(epics.projectId, projectId);
  const orderFn = query.status ? undefined : desc(epics.createdAt);

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: epics.id,
        projectId: epics.projectId,
        title: epics.title,
        description: epics.description,
        status: epics.status,
        ownerId: epics.ownerId,
        ownerName: owner.name,
        startAt: epics.startAt,
        dueAt: epics.dueAt,
        createdAt: epics.createdAt,
        updatedAt: epics.updatedAt,
      })
      .from(epics)
      .leftJoin(owner, eq(epics.ownerId, owner.id))
      .where(where)
      .orderBy(orderFn ?? asc(epics.title))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize),
    db.select({ value: count() }).from(epics).where(where),
  ]);

  return { data: rows as unknown as EpicWithOwnerRow[], total: totalResult[0]?.value ?? 0 };
}

export async function findEpicById(id: string): Promise<EpicWithOwnerRow | null> {
  const rows = await db
    .select({
      id: epics.id,
      projectId: epics.projectId,
      title: epics.title,
      description: epics.description,
      status: epics.status,
      ownerId: epics.ownerId,
      ownerName: owner.name,
      startAt: epics.startAt,
      dueAt: epics.dueAt,
      createdAt: epics.createdAt,
      updatedAt: epics.updatedAt,
    })
    .from(epics)
    .leftJoin(owner, eq(epics.ownerId, owner.id))
    .where(eq(epics.id, id))
    .limit(1);

  return (rows[0] as unknown as EpicWithOwnerRow) ?? null;
}

export async function insertEpic(
  data: typeof epics.$inferInsert,
  dbOrTx: DBOrTx = db
): Promise<EpicWithOwnerRow> {
  const rows = await dbOrTx.insert(epics).values(data).returning();
  return rows[0] as unknown as EpicWithOwnerRow;
}
