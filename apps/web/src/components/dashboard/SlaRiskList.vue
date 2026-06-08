<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">SLA Risk Tickets</h2>
    <div
      v-if="items.length === 0"
      class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center"
    >
      No tickets at SLA risk
    </div>
    <ul
      v-else
      class="divide-y divide-gray-100 dark:divide-gray-700"
    >
      <li
        v-for="ticket in items"
        :key="ticket.id"
      >
        <router-link
          :to="`/tickets/${ticket.id}`"
          class="block py-3 hover:bg-gray-50 dark:hover:bg-gray-700 -mx-2 px-2 rounded"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ ticket.title }}
            </span>
            <span
              class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize"
              :class="priorityBadgeColor(ticket.priority)"
            >
              {{ ticket.priority }}
            </span>
          </div>
          <div class="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Due {{ formatDueAt(ticket.dueAt) }}</span>
            <span>&middot;</span>
            <span>{{ ticket.assignee?.name ?? "Unassigned" }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { SlaRiskTicket } from "@opsflow/shared";

defineProps<{
  items: SlaRiskTicket[];
}>();

function priorityBadgeColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
    medium: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
    high: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
    critical: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  };
  return colors[priority] ?? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
}

function formatDueAt(dueAt: string | null): string {
  if (!dueAt) return "N/A";
  const date = new Date(dueAt);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.round(diff / (1000 * 60 * 60));

  if (hours < 0) return `${Math.abs(hours)}h overdue`;
  if (hours === 0) return "due now";
  return `in ${hours}h`;
}
</script>
