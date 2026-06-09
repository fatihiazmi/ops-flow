import { eq, ilike, and, or, count, desc, asc, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../db/drizzle.js";
import { tickets, users, projects, epics } from "../../db/schema/index.js";
import { toProjectRef } from "../projects/project.types.js";
import { toEpicRef } from "../epics/epic.types.js";
import type { TicketListQuery } from "./ticket.schemas.js";
import type { TicketListItem, TicketDetail } from "@opsflow/shared";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema/index.js";

const assignee = alias(users, "assignee");
const creator = alias(users, "creator");

type DBOrTx = NodePgDatabase<typeof schema> | Parameters<Parameters<typeof db.transaction>[0]>[0];

function buildWhere(filters: Pick<TicketListQuery, "status" | "priority" | "issueType" | "epicId" | "noEpic" | "assigneeId" | "q">, projectId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = [];
  if (projectId) conditions.push(eq(tickets.projectId, projectId));
  if (filters.status) conditions.push(eq(tickets.status, filters.status));
  if (filters.priority) conditions.push(eq(tickets.priority, filters.priority));
  if (filters.issueType) conditions.push(eq(tickets.issueType, filters.issueType));
  if (filters.epicId) conditions.push(eq(tickets.epicId, filters.epicId));
  if (filters.noEpic) conditions.push(isNull(tickets.epicId));
  if (filters.assigneeId) conditions.push(eq(tickets.assigneeId, filters.assigneeId));
  if (filters.q) {
    conditions.push(
      or(
        ilike(tickets.title, `%${filters.q}%`),
        ilike(tickets.description, `%${filters.q}%`)
      )
    );
  }
  if (conditions.length === 0) return undefined;
  return and(...conditions);
}

const sortColumnMap = {
  createdAt: tickets.createdAt,
  updatedAt: tickets.updatedAt,
  dueAt: tickets.dueAt,
  priority: tickets.priority,
  status: tickets.status,
};

function ticketListSelect() {
  return {
    id: tickets.id,
    issueKey: tickets.issueKey,
    title: tickets.title,
    description: tickets.description,
    status: tickets.status,
    priority: tickets.priority,
    category: tickets.category,
    issueType: tickets.issueType,
    projectId: tickets.projectId,
    projectKey: projects.key,
    projectName: projects.name,
    epicId: tickets.epicId,
    epicTitle: epics.title,
    assigneeId: tickets.assigneeId,
    assigneeName: assignee.name,
    createdById: tickets.createdById,
    createdByName: creator.name,
    createdAt: tickets.createdAt,
    updatedAt: tickets.updatedAt,
    dueAt: tickets.dueAt,
  };
}

function mapTicketListItem(row: Record<string, unknown>): TicketListItem {
  return {
    id: row.id as string,
    issueKey: row.issueKey as string | null,
    title: row.title as string,
    description: row.description as string,
    status: row.status as TicketListItem["status"],
    priority: row.priority as TicketListItem["priority"],
    category: row.category as TicketListItem["category"],
    issueType: (row.issueType ?? "task") as TicketListItem["issueType"],
    project: row.projectId
      ? toProjectRef({ id: row.projectId as string, key: row.projectKey as string, name: row.projectName as string })
      : null,
    epic: row.epicId
      ? toEpicRef({ id: row.epicId as string, title: row.epicTitle as string })
      : null,
    assignee: row.assigneeId && row.assigneeName
      ? { id: row.assigneeId as string, name: row.assigneeName as string }
      : null,
    createdAt: (row.createdAt as Date).toISOString(),
    updatedAt: (row.updatedAt as Date).toISOString(),
    dueAt: row.dueAt ? (row.dueAt as Date).toISOString() : null,
  };
}

export async function findManyTickets(query: TicketListQuery, projectId?: string): Promise<TicketListItem[]> {
  const whereClause = buildWhere(query, projectId);
  const orderFn = query.sortDirection === "asc" ? asc : desc;

  const qb = db
    .select(ticketListSelect())
    .from(tickets)
    .leftJoin(assignee, eq(tickets.assigneeId, assignee.id))
    .innerJoin(creator, eq(tickets.createdById, creator.id))
    .leftJoin(projects, eq(tickets.projectId, projects.id))
    .leftJoin(epics, eq(tickets.epicId, epics.id))
    .orderBy(orderFn(sortColumnMap[query.sortBy]))
    .limit(query.pageSize)
    .offset((query.page - 1) * query.pageSize);

  const rows = whereClause ? await qb.where(whereClause) : await qb;
  return rows.map(mapTicketListItem);
}

export async function findTicketById(id: string): Promise<TicketDetail | null> {
  const rows = await db
    .select(ticketListSelect())
    .from(tickets)
    .leftJoin(assignee, eq(tickets.assigneeId, assignee.id))
    .innerJoin(creator, eq(tickets.createdById, creator.id))
    .leftJoin(projects, eq(tickets.projectId, projects.id))
    .leftJoin(epics, eq(tickets.epicId, epics.id))
    .where(eq(tickets.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id as string,
    issueKey: row.issueKey as string | null,
    title: row.title as string,
    description: row.description as string,
    status: row.status as TicketDetail["status"],
    priority: row.priority as TicketDetail["priority"],
    category: row.category as TicketDetail["category"],
    issueType: (row.issueType ?? "task") as TicketDetail["issueType"],
    project: row.projectId
      ? { id: row.projectId as string, key: row.projectKey as string, name: row.projectName as string }
      : null,
    epic: row.epicId
      ? { id: row.epicId as string, title: row.epicTitle as string }
      : null,
    assignee: row.assigneeId && row.assigneeName
      ? { id: row.assigneeId as string, name: row.assigneeName as string }
      : null,
    createdBy: { id: row.createdById as string, name: row.createdByName as string },
    createdAt: (row.createdAt as Date).toISOString(),
    updatedAt: (row.updatedAt as Date).toISOString(),
    dueAt: row.dueAt ? (row.dueAt as Date).toISOString() : null,
  };
}

export async function findTicketByIssueKey(issueKey: string): Promise<TicketDetail | null> {
  const rows = await db
    .select(ticketListSelect())
    .from(tickets)
    .leftJoin(assignee, eq(tickets.assigneeId, assignee.id))
    .innerJoin(creator, eq(tickets.createdById, creator.id))
    .leftJoin(projects, eq(tickets.projectId, projects.id))
    .leftJoin(epics, eq(tickets.epicId, epics.id))
    .where(eq(tickets.issueKey, issueKey.toUpperCase()))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id as string,
    issueKey: row.issueKey as string | null,
    title: row.title as string,
    description: row.description as string,
    status: row.status as TicketDetail["status"],
    priority: row.priority as TicketDetail["priority"],
    category: row.category as TicketDetail["category"],
    issueType: (row.issueType ?? "task") as TicketDetail["issueType"],
    project: row.projectId
      ? { id: row.projectId as string, key: row.projectKey as string, name: row.projectName as string }
      : null,
    epic: row.epicId
      ? { id: row.epicId as string, title: row.epicTitle as string }
      : null,
    assignee: row.assigneeId && row.assigneeName
      ? { id: row.assigneeId as string, name: row.assigneeName as string }
      : null,
    createdBy: { id: row.createdById as string, name: row.createdByName as string },
    createdAt: (row.createdAt as Date).toISOString(),
    updatedAt: (row.updatedAt as Date).toISOString(),
    dueAt: row.dueAt ? (row.dueAt as Date).toISOString() : null,
  };
}

export async function getNextIssueNumber(projectId: string, dbOrTx: DBOrTx = db): Promise<number> {
  const result = await dbOrTx
    .select({ max: tickets.issueNumber })
    .from(tickets)
    .where(eq(tickets.projectId, projectId))
    .orderBy(desc(tickets.issueNumber))
    .limit(1);
  return (result[0]?.max ?? 0) + 1;
}

export async function countTickets(
  filters: Pick<TicketListQuery, "status" | "priority" | "issueType" | "epicId" | "noEpic" | "assigneeId" | "q">,
  projectId?: string
): Promise<number> {
  const whereClause = buildWhere(filters, projectId);
  const qb = db.select({ value: count() }).from(tickets);
  const result = whereClause ? await qb.where(whereClause) : await qb;
  return result[0]?.value ?? 0;
}

export async function insertTicket(
  data: typeof tickets.$inferInsert,
  dbOrTx: DBOrTx = db
) {
  const result = await dbOrTx.insert(tickets).values(data).returning();
  return result[0];
}

export async function updateTicket(
  id: string,
  data: Partial<typeof tickets.$inferInsert>,
  dbOrTx: DBOrTx = db
) {
  const result = await dbOrTx
    .update(tickets)
    .set(data)
    .where(eq(tickets.id, id))
    .returning();
  return result[0];
}

export async function updateTicketStatus(
  id: string,
  status: string,
  dbOrTx: DBOrTx = db
) {
  const result = await dbOrTx
    .update(tickets)
    .set({ status, updatedAt: new Date() })
    .where(eq(tickets.id, id))
    .returning();
  return result[0];
}

export async function updateTicketAssignee(
  id: string,
  assigneeId: string | null,
  dbOrTx: DBOrTx = db
) {
  const result = await dbOrTx
    .update(tickets)
    .set({ assigneeId, updatedAt: new Date() })
    .where(eq(tickets.id, id))
    .returning();
  return result[0];
}
