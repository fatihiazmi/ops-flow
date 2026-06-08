<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Comments</h3>

    <div
      v-if="isLoading"
      class="text-center py-4"
    >
      <p class="text-gray-500 dark:text-gray-400 text-sm">Loading comments...</p>
    </div>

    <div
      v-else-if="comments.length === 0"
      class="text-center py-4"
    >
      <p class="text-gray-500 dark:text-gray-400 text-sm">No comments yet.</p>
    </div>

    <ul
      v-else
      class="space-y-4"
    >
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      >
        <p class="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{{ comment.body }}</p>
        <div class="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{{ comment.author.name }}</span>
          <span>{{ formatDate(comment.createdAt) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getTicketComments } from "../../services/ticketService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";
import type { Comment } from "@opsflow/shared";

const props = defineProps<{
  ticketId: string;
}>();

const notificationStore = useNotificationStore();

const comments = ref<Comment[]>([]);
const isLoading = ref(true);

async function fetchComments() {
  isLoading.value = true;
  try {
    const response = await getTicketComments(props.ticketId);
    comments.value = response.data;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load comments";
    notificationStore.addNotification("error", message);
  } finally {
    isLoading.value = false;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

onMounted(fetchComments);

defineExpose({ fetchComments });
</script>
