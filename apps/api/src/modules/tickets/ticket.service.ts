import {
  ticketListQuerySchema,
  createTicketSchema,
  updateTicketSchema,
  updateTicketStatusSchema,
  updateTicketAssigneeSchema,
  addCommentSchema,
} from "./ticket.schemas.js";
import {
  findManyTickets,
  findTicketById,
  countTickets,
  insertTicket,
  updateTicket,
  updateTicketStatus,
  updateTicketAssignee,
} from "./ticket.repository.js";
import { findCommentsByTicketId, insertComment } from "./comment.repository.js";
import { findActivityByTicketId, insertActivity } from "./activity.repository.js";
import { findUserById } from "../auth/auth.repository.js";
import { isValidStatusTransition } from "./ticket.workflow.js";
import { AppError } from "../../utils/errors.js";
import { listSuccess, success } from "../../utils/api-response.js";
import { db } from "../../db/drizzle.js";
import type { JWTPayload } from "jose";

export async function listTickets(query: unknown) {
  const parsed = ticketListQuerySchema.safeParse(query);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid query parameters", 400);
  }

  const { page, pageSize, sortBy, sortDirection, ...filters } = parsed.data;
  const [data, total] = await Promise.all([
    findManyTickets(parsed.data),
    countTickets(filters),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  return listSuccess(data, { page, pageSize, total, totalPages });
}

export async function getTicketById(id: string) {
  const ticket = await findTicketById(id);
  if (!ticket) {
    throw new AppError("TICKET_NOT_FOUND", "Ticket not found", 404);
  }
  return success(ticket);
}

export async function createTicket(body: unknown, user: JWTPayload) {
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid request body", 400);
  }

  const data = parsed.data;
  if (data.assigneeId) {
    const assignee = await findUserById(data.assigneeId);
    if (!assignee) {
      throw new AppError("USER_NOT_FOUND", "Assignee not found", 400);
    }
  }

  const createdById = user.sub as string;

  const ticket = await db.transaction(async (tx) => {
    const newTicket = await insertTicket(
      {
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
        assigneeId: data.assigneeId ?? null,
        createdById,
        status: "open",
        dueAt: data.dueAt ? new Date(data.dueAt) : null,
      },
      tx
    );

    await insertActivity(
      {
        ticketId: newTicket.id,
        actorId: createdById,
        eventType: "ticket_created",
        metadata: { title: data.title },
      },
      tx
    );

    return newTicket;
  });

  return success({
    id: ticket.id,
    title: ticket.title,
    status: ticket.status as "open" | "in_progress" | "resolved" | "closed",
    priority: ticket.priority as "low" | "medium" | "high" | "critical",
    category: ticket.category as "access" | "billing" | "bug" | "feature_request" | "infrastructure" | "other",
  });
}

export async function patchTicket(id: string, body: unknown, user: JWTPayload) {
  const parsed = updateTicketSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid request body", 400);
  }

  const ticket = await findTicketById(id);
  if (!ticket) {
    throw new AppError("TICKET_NOT_FOUND", "Ticket not found", 404);
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.dueAt !== undefined) updateData.dueAt = data.dueAt ? new Date(data.dueAt) : null;

  if (Object.keys(updateData).length === 0) {
    throw new AppError("VALIDATION_ERROR", "At least one field must be provided", 400);
  }

  const actorId = user.sub as string;
  const priorityChanged = data.priority !== undefined && data.priority !== ticket.priority;

  const updated = await db.transaction(async (tx) => {
    const result = await updateTicket(id, { ...updateData, updatedAt: new Date() }, tx);

    if (priorityChanged) {
      await insertActivity(
        {
          ticketId: id,
          actorId,
          eventType: "priority_changed",
          fromValue: ticket.priority,
          toValue: data.priority!,
        },
        tx
      );
    }

    return result;
  });

  return success({
    id: updated.id,
    title: updated.title,
    description: updated.description,
    priority: updated.priority as "low" | "medium" | "high" | "critical",
    category: updated.category as "access" | "billing" | "bug" | "feature_request" | "infrastructure" | "other",
    dueAt: updated.dueAt ? updated.dueAt.toISOString() : null,
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function changeTicketStatus(id: string, body: unknown, user: JWTPayload) {
  const parsed = updateTicketStatusSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid request body", 400);
  }

  const ticket = await findTicketById(id);
  if (!ticket) {
    throw new AppError("TICKET_NOT_FOUND", "Ticket not found", 404);
  }

  const newStatus = parsed.data.status;
  if (!isValidStatusTransition(ticket.status, newStatus)) {
    throw new AppError(
      "INVALID_STATUS_TRANSITION",
      "Invalid status transition",
      400,
      { from: ticket.status, to: newStatus }
    );
  }

  const actorId = user.sub as string;

  const updated = await db.transaction(async (tx) => {
    const result = await updateTicketStatus(id, newStatus, tx);
    await insertActivity(
      {
        ticketId: id,
        actorId,
        eventType: "status_changed",
        fromValue: ticket.status,
        toValue: newStatus,
      },
      tx
    );
    return result;
  });

  return success({
    id: updated.id,
    status: updated.status as "open" | "in_progress" | "resolved" | "closed",
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function changeTicketAssignee(id: string, body: unknown, user: JWTPayload) {
  const parsed = updateTicketAssigneeSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid request body", 400);
  }

  const ticket = await findTicketById(id);
  if (!ticket) {
    throw new AppError("TICKET_NOT_FOUND", "Ticket not found", 404);
  }

  const newAssigneeId = parsed.data.assigneeId;
  if (newAssigneeId) {
    const assignee = await findUserById(newAssigneeId);
    if (!assignee) {
      throw new AppError("USER_NOT_FOUND", "Assignee not found", 400);
    }
  }

  const actorId = user.sub as string;
  const previousAssigneeId = ticket.assignee?.id ?? null;

  const updated = await db.transaction(async (tx) => {
    const result = await updateTicketAssignee(id, newAssigneeId, tx);
    await insertActivity(
      {
        ticketId: id,
        actorId,
        eventType: "assignee_changed",
        fromValue: previousAssigneeId,
        toValue: newAssigneeId,
      },
      tx
    );
    return result;
  });

  const assignee = newAssigneeId
    ? await findUserById(newAssigneeId)
    : null;

  return success({
    id: updated.id,
    assignee: assignee ? { id: assignee.id, name: assignee.name } : null,
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function getTicketComments(ticketId: string) {
  const ticket = await findTicketById(ticketId);
  if (!ticket) {
    throw new AppError("TICKET_NOT_FOUND", "Ticket not found", 404);
  }

  const comments = await findCommentsByTicketId(ticketId);
  return success(comments);
}

export async function addTicketComment(ticketId: string, body: unknown, user: JWTPayload) {
  const parsed = addCommentSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid request body", 400);
  }

  const ticket = await findTicketById(ticketId);
  if (!ticket) {
    throw new AppError("TICKET_NOT_FOUND", "Ticket not found", 404);
  }

  const actorId = user.sub as string;

  const comment = await db.transaction(async (tx) => {
    const newComment = await insertComment(
      {
        ticketId,
        authorId: actorId,
        body: parsed.data.body,
      },
      tx
    );

    await insertActivity(
      {
        ticketId,
        actorId,
        eventType: "comment_added",
        metadata: { commentId: newComment.id },
      },
      tx
    );

    return newComment;
  });

  const author = await findUserById(actorId);

  return success({
    id: comment.id,
    body: comment.body,
    author: { id: author!.id, name: author!.name },
    createdAt: comment.createdAt.toISOString(),
  });
}

export async function getTicketActivity(ticketId: string) {
  const ticket = await findTicketById(ticketId);
  if (!ticket) {
    throw new AppError("TICKET_NOT_FOUND", "Ticket not found", 404);
  }

  const activity = await findActivityByTicketId(ticketId);
  return success(activity);
}
