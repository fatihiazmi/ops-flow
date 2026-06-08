<template>
  <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800 text-center">
    <p class="text-red-700 dark:text-red-400 text-sm mb-2">{{ message }}</p>
    <button
      @click="$emit('retry')"
      class="text-sm font-medium text-red-700 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-300"
    >
      Retry
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();

defineEmits<{
  retry: [];
}>();
</script>
