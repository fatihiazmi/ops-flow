import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTickets } from "../services/ticketService.js";
import type { ApiListResponse, TicketListItem } from "@opsflow/shared";

export function useTicketList() {
  const route = useRoute();
  const router = useRouter();

  const tickets = ref<TicketListItem[]>([]);
  const meta = ref<ApiListResponse<TicketListItem>["meta"] | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filters = computed(() => ({
    page: Number(route.query.page) || 1,
    pageSize: Number(route.query.pageSize) || 20,
    sortBy: (route.query.sortBy as string) || "createdAt",
    sortDirection: (route.query.sortDirection as string) || "desc",
    status: (route.query.status as string) || undefined,
    priority: (route.query.priority as string) || undefined,
    assigneeId: (route.query.assigneeId as string) || undefined,
    q: (route.query.q as string) || undefined,
  }));

  async function fetchTickets() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getTickets(filters.value);
      tickets.value = response.data;
      meta.value = response.meta;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load tickets";
    } finally {
      isLoading.value = false;
    }
  }

  function updateQuery(updates: Record<string, string | number | undefined>) {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries({ ...route.query, ...updates })) {
      if (value !== undefined && value !== "") {
        query[key] = String(value);
      }
    }
    router.push({ query });
  }

  watch(
    () => route.query,
    () => {
      fetchTickets();
    },
    { immediate: true }
  );

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
