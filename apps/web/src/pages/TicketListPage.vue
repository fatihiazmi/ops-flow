<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Tickets</h1>
      <CreateTicketDialog @created="fetchTickets" />
    </div>

    <div class="mb-6 flex flex-wrap gap-4">
      <div>
        <label
          for="search"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Search</label>
        <input
          id="search"
          v-model="searchInput"
          type="text"
          placeholder="Search tickets..."
          class="mt-1 block w-64 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          for="status"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Status</label>
        <select
          id="status"
          :value="filters.status"
          @change="updateQuery({ status: ($event.target as HTMLSelectElement).value, page: 1 })"
          class="mt-1 block w-40 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label
          for="priority"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Priority</label>
        <select
          id="priority"
          :value="filters.priority"
          @change="updateQuery({ priority: ($event.target as HTMLSelectElement).value, page: 1 })"
          class="mt-1 block w-40 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="animate-pulse"
    >
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
          <th
            v-for="h in 4"
            :key="h"
            :class="thClasses"
          >
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="r in 5" :key="r">
            <td
              v-for="c in 4"
              :key="c"
              :class="tdClasses"
            >
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else-if="error"
      class="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400"
    >
      <p>{{ error }}</p>
      <button
        @click="fetchTickets"
        class="mt-2 text-sm underline"
      >Retry</button>
    </div>

    <div
      v-else-if="tickets.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500 dark:text-gray-400">No tickets found.</p>
    </div>

    <div v-else>
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th :class="thClasses">
              Title
            </th>
            <th :class="thClasses">
              Status
            </th>
            <th :class="thClasses">
              Priority
            </th>
            <th :class="thClasses">
              Assignee
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="ticket in tickets"
            :key="ticket.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            @click="router.push(`/tickets/${ticket.id}`)"
          >
            <td :class="tdComfortableClasses">
              {{ ticket.title }}
            </td>
            <td :class="tdClasses">
              {{ ticket.status }}
            </td>
            <td :class="tdClasses">
              {{ ticket.priority }}
            </td>
            <td :class="tdClasses">
              {{ ticket.assignee?.name || "Unassigned" }}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="meta"
        class="mt-4 flex items-center justify-between"
      >
        <button
          :disabled="meta.page <= 1"
          @click="updateQuery({ page: meta.page - 1 })"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-700 dark:text-gray-300">
          Page {{ meta.page }} of {{ meta.totalPages }} ({{ meta.total }} total)
        </span>
        <button
          :disabled="meta.page >= meta.totalPages"
          @click="updateQuery({ page: meta.page + 1 })"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTicketList } from "../composables/useTicketList.js";
import { useDebouncedRef } from "../composables/useDebouncedRef.js";
import { useSettingsStore } from "../app/stores/settings.store.js";
import CreateTicketDialog from "../components/tickets/CreateTicketDialog.vue";

const route = useRoute();
const router = useRouter();
const settings = useSettingsStore();
const { tickets, meta, isLoading, error, filters, fetchTickets, updateQuery } =
  useTicketList();

const isCompact = computed(() => settings.ticketTableDensity === "compact");
const thClasses = computed(() =>
  isCompact.value
    ? "px-3 py-1.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
    : "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
);
const tdClasses = computed(() =>
  isCompact.value
    ? "px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
    : "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
);
const tdComfortableClasses = computed(() =>
  isCompact.value
    ? "px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
    : "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
);

const searchInput = ref((route.query.q as string) || "");
const debouncedSearch = useDebouncedRef(searchInput, 300);

watch(debouncedSearch, (val) => {
  updateQuery({ q: val || undefined, page: 1 });
});

watch(
  () => route.query.q,
  (q) => {
    if ((q as string) !== searchInput.value) {
      searchInput.value = (q as string) || "";
    }
  }
);
</script>
