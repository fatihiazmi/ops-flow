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
} from "@opsflow/shared";

export interface TicketListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  q?: string;
}

export async function getTickets(
  params: TicketListParams
): Promise<ApiListResponse<TicketListItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDirection)
    searchParams.set("sortDirection", params.sortDirection);
  if (params.status) searchParams.set("status", params.status);
  if (params.priority) searchParams.set("priority", params.priority);
  if (params.assigneeId) searchParams.set("assigneeId", params.assigneeId);
  if (params.q) searchParams.set("q", params.q);

  return apiRequest<ApiListResponse<TicketListItem>>(
    "GET",
    `/tickets?${searchParams.toString()}`
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
