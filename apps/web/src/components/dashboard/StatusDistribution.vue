<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Status Distribution</h2>
    <div class="space-y-3">
      <div
        v-for="item in items"
        :key="item.status"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full inline-block"
            :class="statusColor(item.status)"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300 capitalize">
            {{ formatStatus(item.status) }}
          </span>
        </div>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatusDistribution } from "@opsflow/shared";

defineProps<{
  items: StatusDistribution[];
}>();

function statusColor(status: string): string {
  const colors: Record<string, string> = {
    open: "bg-blue-500",
    in_progress: "bg-yellow-500",
    resolved: "bg-green-500",
    closed: "bg-gray-400",
  };
  return colors[status] ?? "bg-gray-400";
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}
</script>
