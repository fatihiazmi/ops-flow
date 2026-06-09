<template>
  <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
    <form @submit.prevent="handleSubmit">
      <label for="comment-body" class="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">
        Add a comment
      </label>
      <textarea
        id="comment-body"
        v-model="body"
        rows="3"
        placeholder="Write an update or investigation note..."
        class="w-full rounded-lg px-3 py-2.5 text-sm
               bg-slate-50 dark:bg-slate-800/50
               border border-slate-200 dark:border-slate-700
               text-gray-900 dark:text-slate-100
               placeholder-gray-400 dark:placeholder-slate-500
               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
               transition-colors resize-y"
        :aria-invalid="error ? 'true' : undefined"
      />
      <p v-if="error" class="mt-1 text-xs text-red-400" role="alert">{{ error }}</p>
      <div class="mt-3 flex items-center justify-between">
        <span class="text-[11px] text-gray-400 dark:text-slate-500 tabular-nums">
          {{ body.length }}/2000
        </span>
        <button
          type="submit"
          :disabled="isSubmitting || !body.trim()"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                 disabled:opacity-40 disabled:cursor-not-allowed
                 transition-colors"
        >
          <span v-if="isSubmitting" class="flex items-center gap-1.5">
            <svg class="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Adding...
          </span>
          <span v-else>Add Comment</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { addTicketComment } from "../../services/ticketService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";

const props = defineProps<{
  ticketId: string;
}>();

const emit = defineEmits<{
  (e: "submitted"): void;
}>();

const notificationStore = useNotificationStore();

const body = ref("");
const isSubmitting = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
  if (!body.value.trim()) {
    error.value = "Comment body is required";
    return;
  }

  if (body.value.length > 2000) {
    error.value = "Comment must be at most 2000 characters";
    return;
  }

  error.value = null;
  isSubmitting.value = true;

  try {
    await addTicketComment(props.ticketId, body.value.trim());
    notificationStore.addNotification("success", "Comment added successfully");
    body.value = "";
    emit("submitted");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add comment";
    error.value = message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>
