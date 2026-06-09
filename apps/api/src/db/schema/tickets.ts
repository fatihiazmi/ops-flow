import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { projects } from "./projects.js";
import { epics } from "./epics.js";

export const issueTypes = ["bug", "task", "story", "improvement", "incident"] as const;

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  priority: varchar("priority", { length: 50 }).notNull().default("medium"),
  category: varchar("category", { length: 50 }).notNull().default("other"),
  issueType: varchar("issue_type", { length: 50 }).notNull().default("task"),
  issueNumber: integer("issue_number"),
  issueKey: varchar("issue_key", { length: 20 }).unique(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "restrict" }),
  epicId: uuid("epic_id").references(() => epics.id, { onDelete: "set null" }),
  assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
  createdById: uuid("created_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dueAt: timestamp("due_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  statusIdx: index("tickets_status_idx").on(table.status),
  priorityIdx: index("tickets_priority_idx").on(table.priority),
  assigneeIdx: index("tickets_assignee_idx").on(table.assigneeId),
  projectIdx: index("tickets_project_idx").on(table.projectId),
  epicIdx: index("tickets_epic_idx").on(table.epicId),
  issueKeyIdx: index("tickets_issue_key_idx").on(table.issueKey),
  createdAtIdx: index("tickets_created_at_idx").on(table.createdAt),
  dueAtIdx: index("tickets_due_at_idx").on(table.dueAt),
}));
