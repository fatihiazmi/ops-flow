import { eq, ilike, and, or, count, desc, asc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../db/drizzle.js";
import { tickets, users } from "../../db/schema/index.js";
import type { TicketListQuery } from "./ticket.schemas.js";
import type { TicketListItem, TicketDetail } from "@opsflow/shared";

const assignee = alias(users, "assignee");
const creator = alias(users, "creator");

function buildWhere(filters: Pick<TicketListQuery, "status" | "priority" | "assigneeId" | "q">) {
  const conditions = [];
  if (filters.status) conditions.push(eq(tickets.status, filters.status));
  if (filters.priority) conditions.push(eq(tickets.priority, filters.priority));
  if (filters.assigneeId) conditions.push(eq(tickets.assigneeId, filters.assigneeId));
  if (filters.q) {
    conditions.push(
      or(
        ilike(tickets.title, `%${filters.q}%`),
        ilike(tickets.description, `%${filters.q}%`)
      )
    );
  }
  return conditions.length > 0 ? and(...conditions) : undefined;
}

const sortColumnMap = {
  createdAt: tickets.createdAt,
  updatedAt: tickets.updatedAt,
  dueAt: tickets.dueAt,
  priority: tickets.priority,
  status: tickets.status,
};

export async function findManyTickets(query: TicketListQuery): Promise<TicketListItem[]> {
  const where = buildWhere(query);
  const orderFn = query.sortDirection === "asc" ? asc : desc;

  const rows = await db
    .select({
      id: tickets.id,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      priority: tickets.priority,
      category: tickets.category,
      assigneeId: tickets.assigneeId,
      assigneeName: assignee.name,
      createdById: tickets.createdById,
      createdByName: creator.name,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      dueAt: tickets.dueAt,
    })
    .from(tickets)
    .leftJoin(assignee, eq(tickets.assigneeId, assignee.id))
    .innerJoin(creator, eq(tickets.createdById, creator.id))
    .where(where)
    .orderBy(orderFn(sortColumnMap[query.sortBy]))
    .limit(query.pageSize)
    .offset((query.page - 1) * query.pageSize);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TicketListItem["status"],
    priority: row.priority as TicketListItem["priority"],
    category: row.category as TicketListItem["category"],
    assignee: row.assigneeId && row.assigneeName
      ? { id: row.assigneeId, name: row.assigneeName }
      : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    dueAt: row.dueAt ? row.dueAt.toISOString() : null,
  }));
}

export async function findTicketById(id: string): Promise<TicketDetail | null> {
  const rows = await db
    .select({
      id: tickets.id,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      priority: tickets.priority,
      category: tickets.category,
      assigneeId: tickets.assigneeId,
      assigneeName: assignee.name,
      createdById: tickets.createdById,
      createdByName: creator.name,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      dueAt: tickets.dueAt,
    })
    .from(tickets)
    .leftJoin(assignee, eq(tickets.assigneeId, assignee.id))
    .innerJoin(creator, eq(tickets.createdById, creator.id))
    .where(eq(tickets.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TicketDetail["status"],
    priority: row.priority as TicketDetail["priority"],
    category: row.category as TicketDetail["category"],
    assignee: row.assigneeId && row.assigneeName
      ? { id: row.assigneeId, name: row.assigneeName }
      : null,
    createdBy: { id: row.createdById, name: row.createdByName },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    dueAt: row.dueAt ? row.dueAt.toISOString() : null,
  };
}

export async function countTickets(
  filters: Pick<TicketListQuery, "status" | "priority" | "assigneeId" | "q">
): Promise<number> {
  const where = buildWhere(filters);
  const result = await db.select({ value: count() }).from(tickets).where(where);
  return result[0]?.value ?? 0;
}
