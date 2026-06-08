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

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  assigneeId?: string | null;
  dueAt?: string | null;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  category?: TicketCategory;
  dueAt?: string | null;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface UpdateTicketAssigneeRequest {
  assigneeId: string | null;
}

export interface AddCommentRequest {
  body: string;
}

export interface Comment {
  id: string;
  body: string;
  author: TicketAssignee;
  createdAt: string;
  updatedAt: string;
}

export interface TicketActivity {
  id: string;
  eventType: "ticket_created" | "status_changed" | "priority_changed" | "assignee_changed" | "comment_added";
  fromValue: string | null;
  toValue: string | null;
  metadata: Record<string, unknown> | null;
  actor: TicketAssignee;
  createdAt: string;
}
