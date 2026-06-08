<template>
  <div class="flex items-center space-x-2">
    <span class="text-sm text-gray-500">Assignee:</span>
    <span class="font-medium">{{ currentAssignee?.name || "Unassigned" }}</span>
    <select
      v-model="selectedAssigneeId"
      :disabled="isUpdating"
      class="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      @change="handleChange"
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
import { ref, onMounted } from "vue";
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
  try {
    await assignTicket(props.ticketId, {
      assigneeId: selectedAssigneeId.value || null,
    });
    notificationStore.addNotification("success", "Assignee updated successfully");
    emit("updated");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update assignee";
    notificationStore.addNotification("error", message);
  } finally {
    isUpdating.value = false;
  }
}
</script>
