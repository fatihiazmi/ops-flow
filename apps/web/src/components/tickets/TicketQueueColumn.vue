<template>
  <div class="ticket-queue-column flex flex-col h-full bg-slate-50 dark:bg-slate-950/50">
    <!-- Header: title + count -->
    <div class="flex-shrink-0 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-slate-100">Tickets</h2>
        <span v-if="meta" class="text-xs text-gray-400 dark:text-slate-500 tabular-nums">
          {{ meta.total }}
        </span>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="flex-shrink-0 px-4 py-2 border-b border-slate-200 dark:border-slate-800 space-y-2">
      <!-- Search -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <svg class="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <input
          v-model="searchInput"
          type="search"
          placeholder="Search tickets..."
          class="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg
                 bg-white dark:bg-slate-800/50
                 border border-slate-200 dark:border-slate-700
                 text-gray-900 dark:text-slate-100
                 placeholder-gray-400 dark:placeholder-slate-500
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          aria-label="Search tickets"
        />
      </div>

      <!-- Status + Priority pills -->
      <div class="flex gap-1.5 flex-wrap">
        <button
          v-for="s in statusFilters"
          :key="s.value"
          @click="toggleStatus(s.value)"
          class="px-2 py-1 text-[11px] font-medium rounded-md transition-colors"
          :class="activeStatus === s.value
            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/50'"
        >
          {{ s.label }}
        </button>
        <span class="text-slate-300 dark:text-slate-700 mx-0.5 self-center">|</span>
        <button
          v-for="p in priorityFilters"
          :key="p.value"
          @click="togglePriority(p.value)"
          class="px-2 py-1 text-[11px] font-medium rounded-md transition-colors"
          :class="activePriority === p.value
            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/50'"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Card list -->
    <div class="flex-1 overflow-y-auto px-3 py-2 space-y-2">
      <!-- Loading -->
      <div v-if="isLoading" class="space-y-2 py-2">
        <div
          v-for="i in 5" :key="i"
          class="h-24 rounded-xl bg-slate-200 dark:bg-slate-800/50 animate-pulse"
        ></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-4 text-center">
        <p class="text-sm text-red-500 mb-2">{{ error }}</p>
        <button
          @click="fetchTickets"
          class="text-xs text-blue-500 hover:text-blue-400"
        >
          Retry
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="!tickets.length" class="py-8 text-center">
        <p class="text-sm text-gray-400 dark:text-slate-500">
          No tickets found.
        </p>
      </div>

      <!-- Ticket cards -->
      <template v-else>
        <TicketCard
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
          :is-selected="ticket.id === selectedTicketId"
        />

        <!-- Pagination -->
        <div v-if="meta && meta.totalPages > 1" class="flex items-center justify-between pt-2 pb-1 px-1">
          <button
            :disabled="Number(filters.page) <= 1"
            @click="goToPage(Number(filters.page) - 1)"
            class="text-[11px] text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span class="text-[11px] text-gray-400 dark:text-slate-500 tabular-nums">
            {{ filters.page }} / {{ meta.totalPages }}
          </span>
          <button
            :disabled="Number(filters.page) >= meta.totalPages"
            @click="goToPage(Number(filters.page) + 1)"
            class="text-[11px] text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useTicketList } from "../../composables/useTicketList";
import { useDebouncedRef } from "../../composables/useDebouncedRef";
import TicketCard from "./TicketCard.vue";

defineProps<{
  selectedTicketId?: string;
}>();

const route = useRoute();
const { tickets, meta, isLoading, error, filters, fetchTickets, updateQuery } = useTicketList();

// ── Search ─────────────────────────────────────────────────────────
const rawSearch = ref((route.query.q as string) || "");
const searchInput = useDebouncedRef(rawSearch, 300);
watch(searchInput, (val) => {
  updateQuery({ q: val || undefined });
});

// ── Status filter ──────────────────────────────────────────────────
const statusFilters = [
  { label: "All", value: "" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const activeStatus = computed(() => (filters.value.status as string) || "");
function toggleStatus(value: string) {
  updateQuery({ status: value || undefined, page: "1" });
}

// ── Priority filter ────────────────────────────────────────────────
const priorityFilters = [
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
];

const activePriority = computed(() => (filters.value.priority as string) || "");
function togglePriority(value: string) {
  if (activePriority.value === value) {
    updateQuery({ priority: undefined, page: "1" });
  } else {
    updateQuery({ priority: value, page: "1" });
  }
}

// ── Pagination ─────────────────────────────────────────────────────
function goToPage(page: number) {
  updateQuery({ page: String(page) });
}

// ── Sync search from URL (when navigating via sidebar saved views) ─
watch(() => route.query.q, (val) => {
  rawSearch.value = (val as string) || "";
});
</script>
