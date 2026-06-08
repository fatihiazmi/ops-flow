<template>
  <div class="flex items-center space-x-2">
    <span class="text-sm text-gray-500">Status:</span>
    <span class="font-medium">{{ statusLabel }}</span>
    <select
      v-if="validNextStatuses.length > 0"
      v-model="selectedStatus"
      :disabled="isUpdating"
      class="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      @change="handleChange"
    >
      <option value="">Change status...</option>
      <option
        v-for="s in validNextStatuses"
        :key="s"
        :value="s"
      >
        {{ formatStatus(s) }}
      </option>
    </select>
    <span
      v-else
      class="text-sm text-gray-500"
    >No further transitions</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { updateTicketStatus } from "../../services/ticketService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";
import type { TicketStatus } from "@opsflow/shared";

const props = defineProps<{
  ticketId: string;
  currentStatus: TicketStatus;
}>();

const emit = defineEmits<{
  (e: "updated"): void;
}>();

const notificationStore = useNotificationStore();

const isUpdating = ref(false);
const selectedStatus = ref("");

const statusLabel = computed(() => formatStatus(props.currentStatus));

const validNextStatuses = computed(() => {
  const transitions: Record<TicketStatus, TicketStatus[]> = {
    open: ["in_progress", "closed"],
    in_progress: ["resolved", "closed"],
    resolved: ["closed", "in_progress"],
    closed: [],
  };
  return transitions[props.currentStatus];
});

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

async function handleChange() {
  if (!selectedStatus.value) return;

  isUpdating.value = true;
  try {
    await updateTicketStatus(props.ticketId, { status: selectedStatus.value as TicketStatus });
    notificationStore.addNotification("success", "Status updated successfully");
    emit("updated");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update status";
    notificationStore.addNotification("error", message);
  } finally {
    isUpdating.value = false;
    selectedStatus.value = "";
  }
}
</script>
