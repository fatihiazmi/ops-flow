import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";
import { users } from "./users.js";

export const epicStatusEnum = ["planned", "in_progress", "done", "cancelled"] as const;

export const epics = pgTable("epics", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  status: varchar("status", { length: 50 }).notNull().default("planned"),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  startAt: timestamp("start_at"),
  dueAt: timestamp("due_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
