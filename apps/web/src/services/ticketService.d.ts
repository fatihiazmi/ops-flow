import type { ApiListResponse, ApiResponse, TicketListItem, TicketDetail, CreateTicketRequest, UpdateTicketRequest, UpdateTicketStatusRequest, UpdateTicketAssigneeRequest, Comment, TicketActivity } from "@opsflow/shared";
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
export declare function getTickets(params: TicketListParams): Promise<ApiListResponse<TicketListItem>>;
export declare function getTicketById(id: string): Promise<ApiResponse<TicketDetail>>;
export declare function createTicket(payload: CreateTicketRequest): Promise<ApiResponse<TicketDetail>>;
export declare function updateTicket(id: string, payload: UpdateTicketRequest): Promise<ApiResponse<TicketDetail>>;
export declare function updateTicketStatus(id: string, payload: UpdateTicketStatusRequest): Promise<ApiResponse<TicketDetail>>;
export declare function assignTicket(id: string, payload: UpdateTicketAssigneeRequest): Promise<ApiResponse<TicketDetail>>;
export declare function getTicketComments(ticketId: string): Promise<ApiResponse<Comment[]>>;
export declare function addTicketComment(ticketId: string, body: string): Promise<ApiResponse<Comment>>;
export declare function getTicketActivity(ticketId: string): Promise<ApiResponse<TicketActivity[]>>;
//# sourceMappingURL=ticketService.d.ts.map