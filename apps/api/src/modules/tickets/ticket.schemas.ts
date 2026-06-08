import { z } from "zod";

export const ticketListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "dueAt", "priority", "status"]).default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  assigneeId: z.string().uuid().optional(),
  q: z.string().optional(),
});

export type TicketListQuery = z.infer<typeof ticketListQuerySchema>;

export const createTicketSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  priority: z.enum(["low", "medium", "high", "critical"]),
  category: z.enum(["access", "billing", "bug", "feature_request", "infrastructure", "other"]),
  assigneeId: z.string().uuid().nullable().optional(),
  dueAt: z.string().datetime().optional().nullable(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().min(10).max(2000).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  category: z.enum(["access", "billing", "bug", "feature_request", "infrastructure", "other"]).optional(),
  dueAt: z.string().datetime().optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

export const updateTicketStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
});

export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;

export const updateTicketAssigneeSchema = z.object({
  assigneeId: z.string().uuid().nullable(),
});

export type UpdateTicketAssigneeInput = z.infer<typeof updateTicketAssigneeSchema>;

export const addCommentSchema = z.object({
  body: z.string().min(1).max(2000),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;
