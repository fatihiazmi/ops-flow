<template>
  <div class="flex items-center gap-2">
    <div class="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0">
      <span class="text-[10px] font-semibold text-slate-400">
        {{ currentAssignee?.name ? currentAssignee.name.charAt(0).toUpperCase() : "?" }}
      </span>
    </div>
    <select
      v-model="selectedAssigneeId"
      :disabled="isUpdating"
      aria-label="Change ticket assignee"
      class="w-full text-sm rounded-lg py-1.5 pl-2.5 pr-8
             bg-slate-800/50 dark:bg-slate-800/50
             border border-slate-700 dark:border-slate-700
             text-slate-200
             focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors appearance-none
             bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat"
    >
      <option value="">Unassigned</option>
      <option
        v-for="user in users"
        :key="user.id"
        :value="user.id"
      >
        {{ user.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { assignTicket } from "../../services/ticketService.js";
import { getUsers } from "../../services/userService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";
import type { TicketAssignee, PublicUser } from "@opsflow/shared";

const props = defineProps<{
  ticketId: string;
  currentAssignee: TicketAssignee | null;
}>();

const emit = defineEmits<{
  (e: "updated"): void;
}>();

const notificationStore = useNotificationStore();

const isUpdating = ref(false);
const selectedAssigneeId = ref<string>("");
const users = ref<PublicUser[]>([]);

onMounted(async () => {
  try {
    const response = await getUsers({ role: "agent" });
    users.value = response.data;
  } catch {
    // Silently fail
  }
  selectedAssigneeId.value = props.currentAssignee?.id || "";
});

async function handleChange() {
  isUpdating.value = true;
  const previousValue = props.currentAssignee?.id || "";
  try {
    await assignTicket(props.ticketId, {
      assigneeId: selectedAssigneeId.value || null,
    });
    notificationStore.addNotification("success", "Assignee updated successfully");
    emit("updated");
  } catch (e) {
    selectedAssigneeId.value = previousValue;
    const message = e instanceof Error ? e.message : "Failed to update assignee";
    notificationStore.addNotification("error", message);
  } finally {
    isUpdating.value = false;
  }
}

// Trigger on select change (skip initial since onMounted sets it)
watch(selectedAssigneeId, (val, oldVal) => {
  if (oldVal !== undefined && val !== (props.currentAssignee?.id || "")) {
    handleChange();
  }
});
</script>
