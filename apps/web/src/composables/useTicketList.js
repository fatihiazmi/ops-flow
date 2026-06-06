import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTickets } from "../services/ticketService.js";
export function useTicketList() {
    const route = useRoute();
    const router = useRouter();
    const tickets = ref([]);
    const meta = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const filters = computed(() => ({
        page: Number(route.query.page) || 1,
        pageSize: Number(route.query.pageSize) || 20,
        sortBy: route.query.sortBy || "createdAt",
        sortDirection: route.query.sortDirection || "desc",
        status: route.query.status || undefined,
        priority: route.query.priority || undefined,
        assigneeId: route.query.assigneeId || undefined,
        q: route.query.q || undefined,
    }));
    async function fetchTickets() {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await getTickets(filters.value);
            tickets.value = response.data;
            meta.value = response.meta;
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : "Failed to load tickets";
        }
        finally {
            isLoading.value = false;
        }
    }
    function updateQuery(updates) {
        const query = {};
        for (const [key, value] of Object.entries({ ...route.query, ...updates })) {
            if (value !== undefined && value !== "") {
                query[key] = String(value);
            }
        }
        router.push({ query });
    }
    watch(() => route.query, () => {
        fetchTickets();
    }, { immediate: true });
    return {
        tickets,
        meta,
        isLoading,
        error,
        filters,
        fetchTickets,
        updateQuery,
    };
}
//# sourceMappingURL=useTicketList.js.map