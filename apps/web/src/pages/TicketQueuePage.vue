<template>
  <div class="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950/30">
    <div class="text-center px-8">
      <!-- Shield icon -->
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-blue-400/40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <p class="text-sm font-medium text-gray-400 dark:text-slate-500 mb-1">
        Select a ticket
      </p>
      <p class="text-xs text-gray-400 dark:text-slate-600 max-w-xs">
        Choose a ticket from the queue to view its details, comments, and activity timeline.
      </p>

      <!-- Mobile hint: queue is accessible via nav -->
      <button
        class="md:hidden mt-4 text-xs text-blue-500 hover:text-blue-400"
        @click="$router.push('/tickets')"
      >
        View ticket list
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedTicketId?: string;
}>();
</script>
