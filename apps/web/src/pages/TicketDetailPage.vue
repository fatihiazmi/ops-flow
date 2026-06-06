<template>
  <div>
    <button
      @click="router.back()"
      class="mb-4 text-sm text-blue-600 hover:text-blue-800"
    >
      ← Back to tickets
    </button>

    <div
      v-if="isLoading"
      class="text-center py-12"
    >
      <p class="text-gray-500">Loading ticket...</p>
    </div>

    <div
      v-else-if="error"
      class="p-4 bg-red-50 rounded-lg text-red-700"
    >
      <p>{{ error }}</p>
    </div>

    <div
      v-else-if="ticket"
      class="bg-white shadow rounded-lg p-6"
    >
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ ticket.title }}</h1>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <span class="text-sm text-gray-500">Status</span>
          <p class="font-medium">{{ ticket.status }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Priority</span>
          <p class="font-medium">{{ ticket.priority }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Category</span>
          <p class="font-medium">{{ ticket.category }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Due Date</span>
          <p class="font-medium">
            {{ ticket.dueAt ? new Date(ticket.dueAt).toLocaleDateString() : "No due date" }}
          </p>
        </div>
      </div>

      <div class="mb-6">
        <span class="text-sm text-gray-500">Description</span>
        <p class="mt-1 text-gray-900">{{ ticket.description }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-500">Created By</span>
          <p class="font-medium">{{ ticket.createdBy.name }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Assignee</span>
          <p class="font-medium">{{ ticket.assignee?.name || "Unassigned" }}</p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-12"
    >
      <p class="text-gray-500">Ticket not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTicketById } from "../services/ticketService.js";
import type { TicketDetail } from "@opsflow/shared";

const route = useRoute();
const router = useRouter();
const ticket = ref<TicketDetail | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await getTicketById(route.params.id as string);
    ticket.value = response.data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load ticket";
  } finally {
    isLoading.value = false;
  }
});
</script>
