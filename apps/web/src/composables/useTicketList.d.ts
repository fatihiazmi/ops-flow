import type { TicketListItem } from "@opsflow/shared";
export declare function useTicketList(): {
    tickets: import("vue").Ref<{
        id: string;
        title: string;
        description: string;
        status: import("@opsflow/shared").TicketStatus;
        priority: import("@opsflow/shared").TicketPriority;
        category: import("@opsflow/shared").TicketCategory;
        assignee: {
            id: string;
            name: string;
        } | null;
        createdAt: string;
        updatedAt: string;
        dueAt: string | null;
    }[], TicketListItem[] | {
        id: string;
        title: string;
        description: string;
        status: import("@opsflow/shared").TicketStatus;
        priority: import("@opsflow/shared").TicketPriority;
        category: import("@opsflow/shared").TicketCategory;
        assignee: {
            id: string;
            name: string;
        } | null;
        createdAt: string;
        updatedAt: string;
        dueAt: string | null;
    }[]>;
    meta: import("vue").Ref<{
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    } | null, import("@opsflow/shared").PaginationMeta | {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    } | null>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    filters: import("vue").ComputedRef<{
        page: number;
        pageSize: number;
        sortBy: string;
        sortDirection: string;
        status: string | undefined;
        priority: string | undefined;
        assigneeId: string | undefined;
        q: string | undefined;
    }>;
    fetchTickets: () => Promise<void>;
    updateQuery: (updates: Record<string, string | number | undefined>) => void;
};
//# sourceMappingURL=useTicketList.d.ts.map