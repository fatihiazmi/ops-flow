<template>
  <div class="app-shell flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
    <!-- Sidebar — hidden on mobile, visible on lg+ -->
    <AppSidebar class="hidden lg:flex" />

    <!-- Main area: topbar + content -->
    <div class="flex-1 flex flex-col min-w-0">
      <AppTopbar @create-ticket="showCreateDialog = true" />

      <!-- Scrollable page content -->
      <main class="flex-1 overflow-hidden">
        <router-view v-slot="{ Component: PageComponent }">
          <component :is="PageComponent" />
        </router-view>
      </main>
    </div>

    <!-- Create Ticket dialog — auto-opens when triggered from topbar -->
    <CreateTicketDialog
      v-if="showCreateDialog"
      :initial-open="true"
      @created="onTicketCreated"
      @close="showCreateDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppSidebar from "./AppSidebar.vue";
import AppTopbar from "./AppTopbar.vue";
import CreateTicketDialog from "../tickets/CreateTicketDialog.vue";

const router = useRouter();
const showCreateDialog = ref(false);

function onTicketCreated(ticket: { id: string }) {
  showCreateDialog.value = false;
  router.push(`/tickets/${ticket.id}`);
}
</script>
