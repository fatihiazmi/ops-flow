<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Activity</h3>

    <div
      v-if="isLoading"
      class="text-center py-4"
    >
      <p class="text-gray-500 dark:text-gray-400 text-sm">Loading activity...</p>
    </div>

    <div
      v-else-if="activity.length === 0"
      class="text-center py-4"
    >
      <p class="text-gray-500 dark:text-gray-400 text-sm">No activity yet.</p>
    </div>

    <ul
      v-else
      class="space-y-3"
    >
      <li
        v-for="event in activity"
        :key="event.id"
        class="flex items-start space-x-3"
      >
        <div class="flex-1">
          <p class="text-sm text-gray-900 dark:text-gray-100">
            <span class="font-medium">{{ event.actor.name }}</span>
            {{ formatEvent(event) }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ formatDate(event.createdAt) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getTicketActivity } from "../../services/ticketService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";
import type { TicketActivity } from "@opsflow/shared";

const props = defineProps<{
  ticketId: string;
}>();

const notificationStore = useNotificationStore();

const activity = ref<TicketActivity[]>([]);
const isLoading = ref(true);

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
      return `changed assignee from ${event.fromValue || "Unassigned"} to ${event.toValue || "Unassigned"}`;
    case "comment_added":
      return "added a comment";
    default:
      return event.eventType;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

onMounted(fetchActivity);

defineExpose({ fetchActivity });
</script>
