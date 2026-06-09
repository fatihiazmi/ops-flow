<template>
  <div class="ticket-workspace flex h-full">
    <!-- Ticket queue column — always visible on md+, hidden on mobile -->
    <div class="hidden md:flex w-[320px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800">
      <TicketQueueColumn :selected-ticket-id="selectedTicketId" />
    </div>

    <!-- Right content area — full width on mobile, flexible on desktop -->
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <router-view v-slot="{ Component: PageComponent }">
        <component :is="PageComponent" :selected-ticket-id="selectedTicketId" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import TicketQueueColumn from "../components/tickets/TicketQueueColumn.vue";

const route = useRoute();
const selectedTicketId = computed(() => route.params.id as string | undefined);
</script>
