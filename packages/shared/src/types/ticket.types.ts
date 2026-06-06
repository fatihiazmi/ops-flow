export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory = "access" | "billing" | "bug" | "feature_request" | "infrastructure" | "other";

export interface TicketAssignee {
  id: string;
  name: string;
}

export interface TicketListItem {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignee: TicketAssignee | null;
  createdAt: string;
  updatedAt: string;
  dueAt: string | null;
}

export interface TicketDetail {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignee: TicketAssignee | null;
  createdBy: TicketAssignee;
  createdAt: string;
  updatedAt: string;
  dueAt: string | null;
}
