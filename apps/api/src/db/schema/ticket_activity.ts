import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { tickets } from "./tickets.js";

export const ticketActivity = pgTable("ticket_activity", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  actorId: uuid("actor_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  fromValue: text("from_value"),
  toValue: text("to_value"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  ticketIdIdx: index("ticket_activity_ticket_id_idx").on(table.ticketId),
  actorIdIdx: index("ticket_activity_actor_id_idx").on(table.actorId),
  eventTypeIdx: index("ticket_activity_event_type_idx").on(table.eventType),
  createdAtIdx: index("ticket_activity_created_at_idx").on(table.createdAt),
}));
