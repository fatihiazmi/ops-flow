<template>
  <div>
    <div
      v-if="isLoading"
      class="text-center py-4"
    >
      <p class="text-gray-400 dark:text-slate-500 text-sm">Loading comments...</p>
    </div>

    <div
      v-else-if="comments.length === 0"
      class="text-center py-6"
    >
      <p class="text-gray-400 dark:text-slate-500 text-sm">No comments yet. Be the first to add one.</p>
    </div>

    <ul
      v-else
      class="space-y-3"
    >
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4"
      >
        <div class="flex items-center gap-2 mb-2">
          <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span class="text-[10px] font-semibold text-blue-400">
              {{ comment.author.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="text-sm font-medium text-gray-900 dark:text-slate-200">{{ comment.author.name }}</span>
          <span class="text-xs text-gray-400 dark:text-slate-500 ml-auto">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="text-sm text-gray-600 dark:text-slate-300 whitespace-pre-wrap">{{ comment.body }}</p>
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
