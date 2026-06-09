<template>
  <div>
    <div
      v-if="isLoading"
      class="text-center py-4"
    >
      <p class="text-gray-400 dark:text-slate-500 text-sm">Loading activity...</p>
    </div>

    <div
      v-else-if="activity.length === 0"
      class="text-center py-6"
    >
      <p class="text-gray-400 dark:text-slate-500 text-sm">No activity recorded yet.</p>
    </div>

    <ul
      v-else
      class="space-y-0"
    >
      <li
        v-for="(event, idx) in activity"
        :key="event.id"
        class="relative flex gap-3 pb-4"
        :class="{ 'pb-0': idx === activity.length - 1 }"
      >
        <!-- Timeline line -->
        <div
          v-if="idx < activity.length - 1"
          class="absolute left-[11px] top-7 bottom-0 w-px bg-slate-200 dark:bg-slate-800"
          aria-hidden="true"
        ></div>
        <!-- Dot -->
        <div class="relative mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-slate-400 dark:bg-slate-600"></div>
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700 dark:text-slate-300">
            <span class="font-medium text-gray-900 dark:text-slate-200">{{ event.actor.name }}</span>
            {{ formatEvent(event) }}
          </p>
          <p class="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{{ formatDate(event.createdAt) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getTicketActivity } from "../../services/ticketService.js";
import { getUsers } from "../../services/userService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";
import type { TicketActivity, PublicUser } from "@opsflow/shared";

const props = defineProps<{
  ticketId: string;
}>();

const notificationStore = useNotificationStore();

const activity = ref<TicketActivity[]>([]);
const isLoading = ref(true);
const userMap = ref<Map<string, string>>(new Map());

async function loadUserMap() {
  try {
    const response = await getUsers();
    const users: PublicUser[] = response.data;
    userMap.value = new Map(users.map((u) => [u.id, u.name]));
  } catch {
    // Non-critical — names will fall back to showing raw values
  }
}

function resolveName(idOrNull: string | null): string {
  if (!idOrNull) return "Unassigned";
  return userMap.value.get(idOrNull) || idOrNull;
}

async function fetchActivity() {
  isLoading.value = true;
  try {
    const response = await getTicketActivity(props.ticketId);
    activity.value = response.data;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load activity";
    notificationStore.addNotification("error", message);
  } finally {
    isLoading.value = false;
  }
}

function formatEvent(event: TicketActivity): string {
  switch (event.eventType) {
    case "ticket_created":
      return "created the ticket";
    case "status_changed":
      return `changed status from ${event.fromValue || "-"} to ${event.toValue || "-"}`;
    case "priority_changed":
      return `changed priority from ${event.fromValue || "-"} to ${event.toValue || "-"}`;
    case "assignee_changed":
      return `changed assignee from ${resolveName(event.fromValue)} to ${resolveName(event.toValue)}`;
    case "comment_added":
      return "added a comment";
    default:
      return event.eventType;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

onMounted(async () => {
  await Promise.all([loadUserMap(), fetchActivity()]);
});

defineExpose({ fetchActivity });
</script>
