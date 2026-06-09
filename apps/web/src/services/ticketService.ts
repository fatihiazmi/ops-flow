import { apiRequest } from "./apiClient.js";
import type {
  ApiListResponse,
  ApiResponse,
  TicketListItem,
  TicketDetail,
  CreateTicketRequest,
  UpdateTicketRequest,
  UpdateTicketStatusRequest,
  UpdateTicketAssigneeRequest,
  Comment,
  TicketActivity,
  Epic,
} from "@opsflow/shared";

export interface TicketListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  status?: string;
  priority?: string;
  issueType?: string;
  epicId?: string;
  noEpic?: boolean;
  assigneeId?: string;
  q?: string;
}

function buildSearchParams(params: TicketListParams): string {
  const sp = new URLSearchParams();
  const p = params as Record<string, unknown>;
  for (const [key, value] of Object.entries(p)) {
    if (value !== undefined && value !== null && value !== "") {
      sp.set(key, String(value));
    }
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ── Project-scoped issue endpoints ────────────────────────────────

export async function getProjectIssues(
  projectKey: string,
  params: TicketListParams
): Promise<ApiListResponse<TicketListItem>> {
  return apiRequest<ApiListResponse<TicketListItem>>(
    "GET",
    `/projects/${projectKey}/issues${buildSearchParams(params)}`
  );
}

export async function getProjectIssue(
  projectKey: string,
  issueKey: string
): Promise<ApiResponse<TicketDetail>> {
  return apiRequest<ApiResponse<TicketDetail>>(
    "GET",
    `/projects/${projectKey}/issues/${issueKey}`
  );
}

export async function createProjectIssue(
  projectKey: string,
  payload: CreateTicketRequest
): Promise<ApiResponse<TicketDetail>> {
  return apiRequest<ApiResponse<TicketDetail>>(
    "POST",
    `/projects/${projectKey}/issues`,
    payload
  );
}

// ── Legacy ticket endpoints (for backward compatibility) ──────────

export async function getTickets(
  params: TicketListParams
): Promise<ApiListResponse<TicketListItem>> {
  return apiRequest<ApiListResponse<TicketListItem>>(
    "GET",
    `/tickets${buildSearchParams(params)}`
  );
}

export async function getTicketById(
  id: string
): Promise<ApiResponse<TicketDetail>> {
  return apiRequest<ApiResponse<TicketDetail>>("GET", `/tickets/${id}`);
}

export async function createTicket(
  payload: CreateTicketRequest
): Promise<ApiResponse<TicketDetail>> {
  return apiRequest<ApiResponse<TicketDetail>>("POST", "/tickets", payload);
}

export async function updateTicket(
  id: string,
  payload: UpdateTicketRequest
): Promise<ApiResponse<TicketDetail>> {
  return apiRequest<ApiResponse<TicketDetail>>("PATCH", `/tickets/${id}`, payload);
}

export async function updateTicketStatus(
  id: string,
  payload: UpdateTicketStatusRequest
): Promise<ApiResponse<TicketDetail>> {
  return apiRequest<ApiResponse<TicketDetail>>("PATCH", `/tickets/${id}/status`, payload);
}

export async function assignTicket(
  id: string,
  payload: UpdateTicketAssigneeRequest
): Promise<ApiResponse<TicketDetail>> {
  return apiRequest<ApiResponse<TicketDetail>>("PATCH", `/tickets/${id}/assignee`, payload);
}

export async function getTicketComments(
  ticketId: string
): Promise<ApiResponse<Comment[]>> {
  return apiRequest<ApiResponse<Comment[]>>("GET", `/tickets/${ticketId}/comments`);
}

export async function addTicketComment(
  ticketId: string,
  body: string
): Promise<ApiResponse<Comment>> {
  return apiRequest<ApiResponse<Comment>>("POST", `/tickets/${ticketId}/comments`, { body });
}

export async function getTicketActivity(
  ticketId: string
): Promise<ApiResponse<TicketActivity[]>> {
  return apiRequest<ApiResponse<TicketActivity[]>>("GET", `/tickets/${ticketId}/activity`);
}

// ── Epics ────────────────────────────────────────────────────────

export async function getProjectEpics(
  projectKey: string
): Promise<ApiListResponse<Epic>> {
  return apiRequest<ApiListResponse<Epic>>("GET", `/projects/${projectKey}/epics`);
}
