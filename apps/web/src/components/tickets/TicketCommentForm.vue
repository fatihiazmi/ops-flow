<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-3">Add Comment</h3>
    <form @submit.prevent="handleSubmit">
      <div>
        <label
          for="comment-body"
          class="block text-sm font-medium text-gray-700"
        >Comment</label>
        <textarea
          id="comment-body"
          v-model="body"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :class="{ 'border-red-500': error }"
        />
        <p
          v-if="error"
          class="mt-1 text-sm text-red-600"
        >{{ error }}</p>
      </div>
      <div class="mt-3 flex justify-end">
        <button
          type="submit"
          :disabled="isSubmitting || !body.trim()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? "Submitting..." : "Submit Comment" }}
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
    await addTicketComment(props.ticketId, body.value);
    notificationStore.addNotification("success", "Comment added successfully");
    body.value = "";
    emit("submitted");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add comment";
    notificationStore.addNotification("error", message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
