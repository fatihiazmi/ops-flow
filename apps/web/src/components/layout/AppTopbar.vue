<template>
  <header
    class="app-topbar flex items-center justify-between h-14 px-4 flex-shrink-0
           bg-white/80 dark:bg-slate-950/80 backdrop-blur-md
           border-b border-slate-200 dark:border-slate-800"
  >
    <!-- Left: search -->
    <div class="flex-1 max-w-lg">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <input
          type="search"
          placeholder="Search tickets..."
          disabled
          class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800/50
                 border border-gray-200 dark:border-slate-700 rounded-lg text-sm
                 text-gray-500 dark:text-slate-400 placeholder-gray-400 dark:placeholder-slate-500
                 cursor-not-allowed opacity-60"
          aria-label="Search tickets (not yet implemented)"
        />
      </div>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center gap-2 ml-4">
      <!-- Create Ticket -->
      <button
        @click="$emit('create-ticket')"
        class="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500
               text-white text-sm font-medium rounded-lg
               focus:outline-none focus:ring-2 focus:ring-blue-500/50
               transition-colors"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Create Ticket
      </button>

      <!-- SLA Alerts placeholder -->
      <button
        class="relative p-2 rounded-lg text-gray-400 dark:text-slate-500
               hover:text-gray-600 dark:hover:text-slate-300
               hover:bg-gray-100 dark:hover:bg-slate-800
               focus:outline-none focus:ring-2 focus:ring-blue-500/30
               transition-colors cursor-not-allowed opacity-50"
        aria-label="SLA alerts (not yet implemented)"
        title="SLA alerts"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  "create-ticket": [];
}>();
</script>
