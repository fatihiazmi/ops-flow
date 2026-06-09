<template>
  <div class="flex items-center gap-2">
    <select
      v-if="validNextStatuses.length > 0"
      v-model="selectedStatus"
      :disabled="isUpdating"
      aria-label="Change ticket status"
      class="w-full text-sm rounded-lg py-1.5 pl-2.5 pr-8
             bg-slate-800/50 dark:bg-slate-800/50
             border border-slate-700 dark:border-slate-700
             text-slate-200
             focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors appearance-none
             bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat"
    >
      <option :value="props.currentStatus" disabled selected>
        {{ statusLabel }}
      </option>
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
      class="text-sm text-slate-400"
    >
      {{ statusLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
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
const selectedStatus = ref(props.currentStatus);

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
  const newStatus = selectedStatus.value;
  if (!newStatus || newStatus === props.currentStatus) return;

  isUpdating.value = true;
  try {
    await updateTicketStatus(props.ticketId, { status: newStatus as TicketStatus });
    notificationStore.addNotification("success", "Status updated successfully");
    emit("updated");
  } catch (e) {
    selectedStatus.value = props.currentStatus;
    const message = e instanceof Error ? e.message : "Failed to update status";
    notificationStore.addNotification("error", message);
  } finally {
    isUpdating.value = false;
  }
}

// Trigger on select change
watch(selectedStatus, (val) => {
  if (val && val !== props.currentStatus) {
    handleChange();
  }
});
</script>
