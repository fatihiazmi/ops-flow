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
