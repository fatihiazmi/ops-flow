import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProjectIssues } from "../services/ticketService.js";
import { useSettingsStore } from "../app/stores/settings.store.js";
import type { ApiListResponse, TicketListItem } from "@opsflow/shared";

export function useTicketList(projectKey?: string) {
  const route = useRoute();
  const router = useRouter();
  const settings = useSettingsStore();

  const tickets = ref<TicketListItem[]>([]);
  const meta = ref<ApiListResponse<TicketListItem>["meta"] | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filters = computed(() => ({
    page: Number(route.query.page) || 1,
    pageSize: Number(route.query.pageSize) || settings.defaultTicketPageSize,
    sortBy: (route.query.sortBy as string) || "createdAt",
    sortDirection: (route.query.sortDirection as string) || "desc",
    status: (route.query.status as string) || undefined,
    priority: (route.query.priority as string) || undefined,
    issueType: (route.query.issueType as string) || undefined,
    epicId: (route.query.epicId as string) || undefined,
    noEpic: route.query.noEpic === "true" ? true : undefined,
    assigneeId: (route.query.assigneeId as string) || undefined,
    q: (route.query.q as string) || undefined,
  }));

  const currentProjectKey = computed(() =>
    projectKey ?? (route.params.projectKey as string) ?? "OPS"
  );

  async function fetchTickets() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getProjectIssues(currentProjectKey.value, filters.value);
      tickets.value = response.data;
      meta.value = response.meta;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load issues";
    } finally {
      isLoading.value = false;
    }
  }

  function updateQuery(updates: Record<string, string | number | boolean | undefined>) {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries({ ...route.query, ...updates })) {
      if (value !== undefined && value !== "") {
        query[key] = String(value);
      }
    }
    router.push({ query });
  }

  watch(
    () => [route.query, currentProjectKey.value],
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
