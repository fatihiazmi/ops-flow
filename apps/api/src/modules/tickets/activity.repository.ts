import { eq, desc } from "drizzle-orm";
import { db } from "../../db/drizzle.js";
import { ticketActivity, users } from "../../db/schema/index.js";
import type { TicketActivity } from "@opsflow/shared";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema/index.js";

type DBOrTx = NodePgDatabase<typeof schema> | Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function findActivityByTicketId(ticketId: string): Promise<TicketActivity[]> {
  const rows = await db
    .select({
      id: ticketActivity.id,
      eventType: ticketActivity.eventType,
      fromValue: ticketActivity.fromValue,
      toValue: ticketActivity.toValue,
      metadata: ticketActivity.metadata,
      actorId: users.id,
      actorName: users.name,
      createdAt: ticketActivity.createdAt,
    })
    .from(ticketActivity)
    .innerJoin(users, eq(ticketActivity.actorId, users.id))
    .where(eq(ticketActivity.ticketId, ticketId))
    .orderBy(desc(ticketActivity.createdAt));

  return rows.map((row) => ({
    id: row.id,
    eventType: row.eventType as TicketActivity["eventType"],
    fromValue: row.fromValue ?? null,
    toValue: row.toValue ?? null,
    metadata: (row.metadata as Record<string, unknown> | null) ?? null,
    actor: { id: row.actorId, name: row.actorName },
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function insertActivity(
  data: {
    ticketId: string;
    actorId: string;
    eventType: string;
    fromValue?: string | null;
    toValue?: string | null;
    metadata?: Record<string, unknown> | null;
  },
  dbOrTx: DBOrTx = db
) {
  const result = await dbOrTx.insert(ticketActivity).values(data).returning();
  return result[0];
}
