<template>
  <div class="flex h-full min-h-0">
    <!-- ============================================================
         Center: ticket detail with tabs
         ============================================================ -->
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <!-- Loading skeleton -->
      <template v-if="isLoading">
        <div class="p-6 space-y-4 animate-pulse">
          <div class="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="h-7 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="h-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </template>

      <!-- Error -->
      <div v-else-if="error" class="flex-1 flex items-center justify-center p-6">
        <div class="text-center">
          <p class="text-sm text-red-500 mb-2">{{ error }}</p>
          <button @click="fetchTicket" class="text-xs text-blue-500 hover:text-blue-400">Retry</button>
        </div>
      </div>

      <!-- Not found -->
      <div v-else-if="!ticket" class="flex-1 flex items-center justify-center p-6">
        <p class="text-sm text-gray-400 dark:text-slate-500">Issue not found.</p>
      </div>

      <!-- Ticket loaded -->
      <template v-else>
        <!-- Header: breadcrumb + key/type + title + meta badges + description -->
        <div class="flex-shrink-0 px-6 pt-6 pb-5">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 mb-3">
            <router-link :to="`/projects/${projectKey}`" class="hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
              Projects
            </router-link>
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-gray-500 dark:text-slate-400">{{ ticket.project?.key ?? "?" }}</span>
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <router-link :to="`/projects/${projectKey}/issues`" class="hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
              Issues
            </router-link>
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-mono tracking-tight">{{ ticket.issueKey ?? "—" }}</span>
            <span
              class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400"
            >
              {{ ticket.issueType }}
            </span>
            <span
              v-if="ticket.epic"
              class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400"
            >
              {{ ticket.epic.title }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3 leading-snug">
            {{ ticket.title }}
          </h1>

          <!-- Meta badges row -->
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span
              class="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize"
              :class="headerPriorityClass"
            >
              {{ ticket.priority }}
            </span>
            <span class="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400">
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="headerStatusDot"></span>
              {{ headerStatusLabel }}
            </span>
            <span v-if="ticket.assignee" class="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400">
              <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ ticket.assignee.name }}
            </span>
            <span v-else class="text-[11px] text-gray-400 dark:text-slate-600">Unassigned</span>
          </div>

          <!-- Creator + date -->
          <p class="text-[11px] text-gray-400 dark:text-slate-500">
            Created by <span class="text-gray-500 dark:text-slate-400">{{ ticket.createdBy.name }}</span>
            &middot;
            {{ headerCreatedAt }}
          </p>

          <!-- Description -->
          <p v-if="ticket.description" class="mt-4 pt-4 text-sm text-gray-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap border-t border-slate-100 dark:border-slate-800">
            {{ ticket.description }}
          </p>
        </div>

        <!-- Tabs -->
        <div class="flex-shrink-0 flex border-b border-slate-200 dark:border-slate-800 px-6" role="tablist" aria-label="Issue tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            role="tab"
            :aria-selected="activeTab === tab.key"
            class="relative px-4 py-2.5 text-sm font-medium transition-colors -mb-px"
            :class="activeTab === tab.key
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 border-b-2 border-transparent'"
          >
            {{ tab.label }}
            <span v-if="tab.count != null" class="ml-1.5 text-xs opacity-60 tabular-nums">{{ tab.count }}</span>
          </button>
        </div>

        <!-- Tab content -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="activeTab === 'comments'" class="p-6 space-y-6">
            <TicketComments ref="commentsRef" :ticket-id="ticket.id" />
            <TicketCommentForm :ticket-id="ticket.id" @submitted="onCommentAdded" />
          </div>
          <div v-else-if="activeTab === 'activity'" class="p-6">
            <TicketActivityTimeline ref="activityRef" :ticket-id="ticket.id" />
          </div>
        </div>
      </template>
    </div>

    <!-- ============================================================
         Right: Context panel (visible on xl+)
         ============================================================ -->
    <div class="hidden xl:block w-72 flex-shrink-0">
      <TicketContextPanel v-if="ticket" :ticket="ticket" @updated="fetchTicket" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { getProjectIssue } from "../services/ticketService.js";
import type { TicketDetail } from "@opsflow/shared";
import TicketCommentForm from "../components/tickets/TicketCommentForm.vue";
import TicketComments from "../components/tickets/TicketComments.vue";
import TicketActivityTimeline from "../components/tickets/TicketActivityTimeline.vue";
import TicketContextPanel from "../components/tickets/TicketContextPanel.vue";

defineProps<{
  selectedTicketId?: string;
  projectKey?: string;
}>();

const route = useRoute();

const ticket = ref<TicketDetail | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const activeTab = ref<"comments" | "activity">("comments");

const projectKey = computed(() => (route.params.projectKey as string) || "OPS");

const tabs = computed(() => [
  { key: "comments" as const, label: "Comments", count: null },
  { key: "activity" as const, label: "Activity", count: null },
]);

const headerPriorityClass = computed(() => {
  switch (ticket.value?.priority) {
    case "critical": return "bg-red-500/10 text-red-400";
    case "high": return "bg-orange-500/10 text-orange-400";
    case "medium": return "bg-blue-500/10 text-blue-400";
    case "low": return "bg-gray-500/10 text-gray-400";
    default: return "bg-gray-500/10 text-gray-400";
  }
});

const headerStatusDot = computed(() => {
  switch (ticket.value?.status) {
    case "open": return "bg-blue-500";
    case "in_progress": return "bg-amber-500";
    case "resolved": return "bg-emerald-500";
    case "closed": return "bg-slate-500";
    default: return "bg-slate-500";
  }
});

const headerStatusLabel = computed(() => {
  switch (ticket.value?.status) {
    case "open": return "Open";
    case "in_progress": return "In Progress";
    case "resolved": return "Resolved";
    case "closed": return "Closed";
    default: return ticket.value?.status ?? "";
  }
});

const headerCreatedAt = computed(() => {
  if (!ticket.value?.createdAt) return "";
  return new Date(ticket.value.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
});

const commentsRef = ref<InstanceType<typeof TicketComments> | null>(null);
const activityRef = ref<InstanceType<typeof TicketActivityTimeline> | null>(null);

async function fetchTicket() {
  const issueKey = route.params.issueKey as string;
  if (!issueKey) return;
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getProjectIssue(projectKey.value, issueKey);
    ticket.value = response.data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load issue";
  } finally {
    isLoading.value = false;
  }
}

async function onCommentAdded() {
  await fetchTicket();
  await nextTick();
  commentsRef.value?.fetchComments();
  activityRef.value?.fetchActivity();
}

onMounted(fetchTicket);

watch(() => route.params.issueKey, (newKey, oldKey) => {
  if (newKey && newKey !== oldKey) fetchTicket();
});
</script>
