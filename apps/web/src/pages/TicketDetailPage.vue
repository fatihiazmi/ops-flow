<template>
  <div>
    <button
      @click="router.back()"
      class="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
    >
      ← Back to tickets
    </button>

    <div
      v-if="isLoading"
      class="space-y-6 animate-pulse"
    >
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div v-for="i in 4" :key="i">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        </div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
        <div class="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div class="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
        <div class="space-y-3">
          <div v-for="i in 2" :key="i" class="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400"
    >
      <p>{{ error }}</p>
    </div>

    <div
      v-else-if="ticket"
      class="space-y-6"
    >
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ ticket.title }}</h1>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Status</span>
            <TicketStatusControl
              :ticket-id="ticket.id"
              :current-status="ticket.status"
              @updated="handleWorkflowUpdate"
            />
          </div>
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Priority</span>
            <p class="font-medium dark:text-gray-200">{{ ticket.priority }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Category</span>
            <p class="font-medium dark:text-gray-200">{{ ticket.category }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Due Date</span>
            <p class="font-medium dark:text-gray-200">
              {{ ticket.dueAt ? new Date(ticket.dueAt).toLocaleDateString() : "No due date" }}
            </p>
          </div>
        </div>

        <div class="mb-6">
          <span class="text-sm text-gray-500 dark:text-gray-400">Description</span>
          <p class="mt-1 text-gray-900 dark:text-gray-200">{{ ticket.description }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Created By</span>
            <p class="font-medium dark:text-gray-200">{{ ticket.createdBy.name }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Assignee</span>
            <TicketAssigneeControl
              :ticket-id="ticket.id"
              :current-assignee="ticket.assignee"
              @updated="handleWorkflowUpdate"
            />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <TicketCommentForm
          :ticket-id="ticket.id"
          @submitted="handleWorkflowUpdate"
        />
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <TicketComments
          ref="commentsRef"
          :ticket-id="ticket.id"
        />
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <TicketActivityTimeline
          ref="activityRef"
          :ticket-id="ticket.id"
        />
      </div>
    </div>

    <div
      v-else
      class="text-center py-12"
    >
      <p class="text-gray-500 dark:text-gray-400">Ticket not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTicketById } from "../services/ticketService.js";
import type { TicketDetail } from "@opsflow/shared";
import TicketStatusControl from "../components/tickets/TicketStatusControl.vue";
import TicketAssigneeControl from "../components/tickets/TicketAssigneeControl.vue";
import TicketCommentForm from "../components/tickets/TicketCommentForm.vue";
import TicketComments from "../components/tickets/TicketComments.vue";
import TicketActivityTimeline from "../components/tickets/TicketActivityTimeline.vue";

const route = useRoute();
const router = useRouter();
const ticket = ref<TicketDetail | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const commentsRef = ref<InstanceType<typeof TicketComments> | null>(null);
const activityRef = ref<InstanceType<typeof TicketActivityTimeline> | null>(null);

async function fetchTicket() {
  try {
    const response = await getTicketById(route.params.id as string);
    ticket.value = response.data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load ticket";
  } finally {
    isLoading.value = false;
  }
}

async function handleWorkflowUpdate() {
  await fetchTicket();
  commentsRef.value?.fetchComments();
  activityRef.value?.fetchActivity();
}

onMounted(fetchTicket);
</script>
