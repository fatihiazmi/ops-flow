<template>
  <router-link
    :to="`/projects/${projectKey}/issues/${ticket.issueKey}`"
    class="ticket-card block relative rounded-xl border transition-all duration-150 group
           bg-white dark:bg-slate-900/50
           border-slate-200 dark:border-slate-800
           hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-md dark:hover:shadow-blue-500/5
           focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    :class="{ 'border-blue-500/50 dark:border-blue-500/30 bg-blue-500/[0.04] dark:bg-slate-800 shadow-md': isSelected }"
    :aria-current="isSelected ? 'page' : undefined"
  >
    <!-- Priority accent strip on left -->
    <div
      class="absolute left-0 top-1 bottom-1 w-1 rounded-full my-2"
      :class="accentColor"
      aria-hidden="true"
    ></div>

    <div class="pl-4 pr-3 py-3">
      <!-- Top row: issue key + priority badge -->
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-[11px] font-mono text-gray-400 dark:text-slate-500 tabular-nums font-medium">
          {{ ticket.issueKey ?? "—" }}
        </span>
        <div class="flex-1"></div>
        <span
          class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          :class="priorityBadgeClass"
        >
          {{ priorityLabel }}
        </span>
      </div>

      <!-- Title -->
      <p class="text-sm font-medium text-gray-900 dark:text-slate-100 leading-snug mb-2 line-clamp-2 break-words">
        {{ ticket.title }}
      </p>

      <!-- Meta row: issue type, status, assignee -->
      <div class="flex items-center gap-3 text-[11px] text-gray-500 dark:text-slate-400">
        <span class="text-[10px] capitalize opacity-70">{{ ticket.issueType }}</span>
        <span class="inline-flex items-center gap-1 flex-shrink-0">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="statusDotClass"></span>
          {{ statusLabel }}
        </span>
        <span v-if="ticket.assignee" class="flex items-center gap-1 min-w-0">
          <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="truncate">{{ ticket.assignee.name }}</span>
        </span>
        <span v-else class="text-gray-400 dark:text-slate-600">Unassigned</span>
        <span class="flex-1"></span>
        <span v-if="ticket.dueAt" class="flex items-center gap-1 flex-shrink-0">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ formattedDueDate }}
        </span>
      </div>

      <!-- Footer: epic + category -->
      <div class="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span v-if="ticket.epic" class="text-[11px] text-blue-500 dark:text-blue-400 truncate">
          Epic: {{ ticket.epic.title }}
        </span>
        <span v-else class="text-[11px] text-gray-400 dark:text-slate-600 italic">No epic</span>
        <span class="flex-1"></span>
        <span v-if="ticket.category" class="text-[11px] text-gray-400 dark:text-slate-500 capitalize">
          {{ ticket.category.replace(/_/g, " ") }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import type { TicketListItem } from "@opsflow/shared";

const props = defineProps<{
  ticket: TicketListItem;
  isSelected?: boolean;
}>();

const route = useRoute();
const projectKey = computed(() => (route.params.projectKey as string) || "OPS");

const priorityLabel = computed(() => {
  return props.ticket.priority.charAt(0).toUpperCase() + props.ticket.priority.slice(1);
});

const priorityBadgeClass = computed(() => {
  switch (props.ticket.priority) {
    case "critical": return "bg-red-500/10 text-red-400";
    case "high": return "bg-orange-500/10 text-orange-400";
    case "medium": return "bg-blue-500/10 text-blue-400";
    case "low": return "bg-gray-500/10 text-gray-400";
    default: return "bg-gray-500/10 text-gray-400";
  }
});

const accentColor = computed(() => {
  switch (props.ticket.priority) {
    case "critical": return "bg-red-500";
    case "high": return "bg-orange-500";
    case "medium": return "bg-blue-500";
    case "low": return "bg-slate-400";
    default: return "bg-slate-400";
  }
});

const statusLabel = computed(() => {
  switch (props.ticket.status) {
    case "open": return "Open";
    case "in_progress": return "In Progress";
    case "resolved": return "Resolved";
    case "closed": return "Closed";
    default: return props.ticket.status;
  }
});

const statusDotClass = computed(() => {
  switch (props.ticket.status) {
    case "open": return "bg-blue-500";
    case "in_progress": return "bg-amber-500";
    case "resolved": return "bg-emerald-500";
    case "closed": return "bg-slate-500";
    default: return "bg-slate-500";
  }
});

const formattedDueDate = computed(() => {
  if (!props.ticket.dueAt) return "";
  const d = new Date(props.ticket.dueAt);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
});
</script>
