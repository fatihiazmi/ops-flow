<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Priority Distribution</h2>
    <div class="space-y-3">
      <div
        v-for="item in items"
        :key="item.priority"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full inline-block"
            :class="priorityColor(item.priority)"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300 capitalize">
            {{ item.priority }}
          </span>
        </div>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriorityDistribution } from "@opsflow/shared";

defineProps<{
  items: PriorityDistribution[];
}>();

function priorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-gray-400",
    medium: "bg-blue-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };
  return colors[priority] ?? "bg-gray-400";
}
</script>
