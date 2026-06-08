import { eq, and, lt, gte, notInArray, sql, desc, or, isNull } from "drizzle-orm";
import { db } from "../../db/drizzle.js";
import { tickets, ticketActivity, users } from "../../db/schema/index.js";
import type {
  StatusDistribution,
  PriorityDistribution,
  RecentActivityItem,
  SlaRiskTicket,
} from "./dashboard.types.js";

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

export async function countByStatus(status: string): Promise<number> {
  const result = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(tickets)
    .where(eq(tickets.status, status));
  return result[0]?.value ?? 0;
}

export async function countResolvedToday(): Promise<number> {
  const today = startOfToday();
  const result = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(tickets)
    .where(and(eq(tickets.status, "resolved"), gte(tickets.updatedAt, today)));
  return result[0]?.value ?? 0;
}

export async function countCriticalActive(): Promise<number> {
  const result = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(tickets)
    .where(and(eq(tickets.priority, "critical"), notInArray(tickets.status, ["closed"])));
  return result[0]?.value ?? 0;
}

export async function countOverdue(): Promise<number> {
  const now = new Date();
  const result = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(tickets)
    .where(
      and(
        lt(tickets.dueAt, now),
        notInArray(tickets.status, ["resolved", "closed"])
      )
    );
  return result[0]?.value ?? 0;
}

export async function countUnassigned(): Promise<number> {
  const result = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(tickets)
    .where(
      and(
        isNull(tickets.assigneeId),
        notInArray(tickets.status, ["resolved", "closed"])
      )
    );
  return result[0]?.value ?? 0;
}

export async function getStatusDistribution(): Promise<StatusDistribution[]> {
  const allStatuses = ["open", "in_progress", "resolved", "closed"] as const;
  const rows = await db
    .select({
      status: tickets.status,
      count: sql<number>`count(*)::int`,
    })
    .from(tickets)
    .groupBy(tickets.status);

  const map = new Map(rows.map((r) => [r.status, r.count]));
  return allStatuses.map((status) => ({
    status,
    count: map.get(status) ?? 0,
  }));
}

export async function getPriorityDistribution(): Promise<PriorityDistribution[]> {
  const allPriorities = ["low", "medium", "high", "critical"] as const;
  const rows = await db
    .select({
      priority: tickets.priority,
      count: sql<number>`count(*)::int`,
    })
    .from(tickets)
    .groupBy(tickets.priority);

  const map = new Map(rows.map((r) => [r.priority, r.count]));
  return allPriorities.map((priority) => ({
    priority,
    count: map.get(priority) ?? 0,
  }));
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  const rows = await db
    .select({
      id: ticketActivity.id,
      eventType: ticketActivity.eventType,
      ticketId: ticketActivity.ticketId,
      ticketTitle: tickets.title,
      actorId: users.id,
      actorName: users.name,
      createdAt: ticketActivity.createdAt,
    })
    .from(ticketActivity)
    .innerJoin(tickets, eq(ticketActivity.ticketId, tickets.id))
    .innerJoin(users, eq(ticketActivity.actorId, users.id))
    .orderBy(desc(ticketActivity.createdAt))
    .limit(10);

  return rows.map((row) => ({
    id: row.id,
    eventType: row.eventType,
    ticketId: row.ticketId,
    ticketTitle: row.ticketTitle,
    actor: { id: row.actorId, name: row.actorName },
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getSlaRiskTickets(): Promise<SlaRiskTicket[]> {
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const rows = await db
    .select({
      id: tickets.id,
      title: tickets.title,
      priority: tickets.priority,
      status: tickets.status,
      dueAt: tickets.dueAt,
      assigneeId: tickets.assigneeId,
      assigneeName: users.name,
    })
    .from(tickets)
    .leftJoin(users, eq(tickets.assigneeId, users.id))
    .where(
      and(
        lt(tickets.dueAt, next24h),
        or(
          notInArray(tickets.status, ["resolved", "closed"]),
          eq(tickets.status, "open"),
          eq(tickets.status, "in_progress")
        )
      )
    )
    .orderBy(tickets.dueAt)
    .limit(10);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    priority: row.priority,
    status: row.status,
    dueAt: row.dueAt ? row.dueAt.toISOString() : null,
    assignee:
      row.assigneeId && row.assigneeName
        ? { id: row.assigneeId, name: row.assigneeName }
        : null,
  }));
}
