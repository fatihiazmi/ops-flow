import { z } from "zod";

export const createProjectSchema = z.object({
  key: z.string().min(2).max(8).toUpperCase(),
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  leadId: z.string().uuid().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
