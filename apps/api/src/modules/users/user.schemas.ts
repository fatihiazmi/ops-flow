import { z } from "zod";

export const userListQuerySchema = z.object({
  role: z.enum(["admin", "agent", "viewer"]).optional(),
});

export type UserListQuery = z.infer<typeof userListQuerySchema>;
