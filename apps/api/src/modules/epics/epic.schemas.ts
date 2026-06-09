import { z } from "zod";

export const epicListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
  status: z.enum(["planned", "in_progress", "done", "cancelled"]).optional(),
});

export type EpicListQuery = z.infer<typeof epicListQuerySchema>;

export const createEpicSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(["planned", "in_progress", "done", "cancelled"]).optional(),
  ownerId: z.string().uuid().nullable().optional(),
  startAt: z.string().datetime().optional().nullable(),
  dueAt: z.string().datetime().optional().nullable(),
});

export type CreateEpicInput = z.infer<typeof createEpicSchema>;
