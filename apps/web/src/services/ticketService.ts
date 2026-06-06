import { apiRequest } from "./apiClient.js";
import type {
  ApiListResponse,
  ApiResponse,
  TicketListItem,
  TicketDetail,
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
