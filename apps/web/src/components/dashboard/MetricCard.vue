<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
  >
    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ label }}</div>
    <div class="mt-2 text-3xl font-bold" :class="colorClass">
      {{ count }}
    </div>
    <template v-if="linkTo">
      <router-link
        :to="linkTo"
        class="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        View all
        <span class="sr-only">{{ label }} tickets</span>
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  count: number;
  colorClass?: string;
  linkTo?: string;
}>();
</script>
