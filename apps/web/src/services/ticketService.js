import { apiRequest } from "./apiClient.js";
export async function getTickets(params) {
    const searchParams = new URLSearchParams();
    if (params.page)
        searchParams.set("page", String(params.page));
    if (params.pageSize)
        searchParams.set("pageSize", String(params.pageSize));
    if (params.sortBy)
        searchParams.set("sortBy", params.sortBy);
    if (params.sortDirection)
        searchParams.set("sortDirection", params.sortDirection);
    if (params.status)
        searchParams.set("status", params.status);
    if (params.priority)
        searchParams.set("priority", params.priority);
    if (params.assigneeId)
        searchParams.set("assigneeId", params.assigneeId);
    if (params.q)
        searchParams.set("q", params.q);
    return apiRequest("GET", `/tickets?${searchParams.toString()}`);
}
export async function getTicketById(id) {
    return apiRequest("GET", `/tickets/${id}`);
}
//# sourceMappingURL=ticketService.js.map