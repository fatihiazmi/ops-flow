import { eq, asc } from "drizzle-orm";
import { db } from "../../db/drizzle.js";
import { comments, users } from "../../db/schema/index.js";
import type { Comment } from "@opsflow/shared";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema/index.js";

type DBOrTx = NodePgDatabase<typeof schema> | Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function findCommentsByTicketId(ticketId: string): Promise<Comment[]> {
  const rows = await db
    .select({
      id: comments.id,
      body: comments.body,
      authorId: users.id,
      authorName: users.name,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.ticketId, ticketId))
    .orderBy(asc(comments.createdAt));

  return rows.map((row) => ({
    id: row.id,
    body: row.body,
    author: { id: row.authorId, name: row.authorName },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function insertComment(
  data: { ticketId: string; authorId: string; body: string },
  dbOrTx: DBOrTx = db
) {
  const result = await dbOrTx.insert(comments).values(data).returning();
  return result[0];
}
