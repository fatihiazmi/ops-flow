<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h2>
    <div
      v-if="items.length === 0"
      class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center"
    >
      No recent activity
    </div>
    <ul
      v-else
      class="divide-y divide-gray-100 dark:divide-gray-700"
    >
      <li
        v-for="activity in items"
        :key="activity.id"
      >
        <router-link
          :to="`/tickets/${activity.ticketId}`"
          class="block py-3 hover:bg-gray-50 dark:hover:bg-gray-700 -mx-2 px-2 rounded"
        >
          <div class="text-sm text-gray-900 dark:text-gray-100">
            <span class="font-medium">{{ activity.actor.name }}</span>
            <span class="text-gray-600 dark:text-gray-400">
              {{ formatEventType(activity.eventType) }}
            </span>
            <span class="font-medium">{{ activity.ticketTitle }}</span>
          </div>
          <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ formatTimeAgo(activity.createdAt) }}
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { RecentActivityItem } from "@opsflow/shared";

defineProps<{
  items: RecentActivityItem[];
}>();

function formatEventType(eventType: string): string {
  const labels: Record<string, string> = {
    ticket_created: " created ticket ",
    status_changed: " changed status on ",
    priority_changed: " changed priority on ",
    assignee_changed: " reassigned ",
    comment_added: " commented on ",
  };
  return labels[eventType] ?? ` ${eventType} `;
}

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
</script>
