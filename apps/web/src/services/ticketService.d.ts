import type { ApiListResponse, ApiResponse, TicketListItem, TicketDetail } from "@opsflow/shared";
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
//# sourceMappingURL=ticketService.d.ts.map