<template>
  <div>
    <button
      @click="openDialog"
      class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Create Ticket
    </button>

    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
      @click.self="closeDialog"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ticket-title"
      >
        <h2
          id="create-ticket-title"
          class="text-lg font-semibold text-gray-900 mb-4"
        >
          Create New Ticket
        </h2>

        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label
                for="title"
                class="block text-sm font-medium text-gray-700"
              >Title</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.title }"
              />
              <p
                v-if="errors.title"
                class="mt-1 text-sm text-red-600"
              >{{ errors.title }}</p>
            </div>

            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700"
              >Description</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.description }"
              />
              <p
                v-if="errors.description"
                class="mt-1 text-sm text-red-600"
              >{{ errors.description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  for="priority"
                  class="block text-sm font-medium text-gray-700"
                >Priority</label>
                <select
                  id="priority"
                  v-model="form.priority"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  :class="{ 'border-red-500': errors.priority }"
                >
                  <option value="">Select...</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <p
                  v-if="errors.priority"
                  class="mt-1 text-sm text-red-600"
                >{{ errors.priority }}</p>
              </div>

              <div>
                <label
                  for="category"
                  class="block text-sm font-medium text-gray-700"
                >Category</label>
                <select
                  id="category"
                  v-model="form.category"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  :class="{ 'border-red-500': errors.category }"
                >
                  <option value="">Select...</option>
                  <option value="access">Access</option>
                  <option value="billing">Billing</option>
                  <option value="bug">Bug</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="other">Other</option>
                </select>
                <p
                  v-if="errors.category"
                  class="mt-1 text-sm text-red-600"
                >{{ errors.category }}</p>
              </div>
            </div>

            <div>
              <label
                for="assignee"
                class="block text-sm font-medium text-gray-700"
              >Assignee</label>
              <select
                id="assignee"
                v-model="form.assigneeId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option :value="null">Unassigned</option>
                <option
                  v-for="user in users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="dueAt"
                class="block text-sm font-medium text-gray-700"
              >Due Date</label>
              <input
                id="dueAt"
                v-model="form.dueAt"
                type="datetime-local"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeDialog"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? "Creating..." : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { createTicket } from "../../services/ticketService.js";
import { getUsers } from "../../services/userService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";
import type { PublicUser } from "@opsflow/shared";

const props = defineProps<{
  initialOpen?: boolean;
}>();

const emit = defineEmits<{
  (e: "created", ticket: { id: string }): void;
  (e: "close"): void;
}>();

const notificationStore = useNotificationStore();

const isOpen = ref(props.initialOpen ?? false);

// When parent toggles initialOpen from false to true, auto-open
watch(() => props.initialOpen, (val) => {
  if (val) isOpen.value = true;
});
const isSubmitting = ref(false);
const users = ref<PublicUser[]>([]);

const form = ref({
  title: "",
  description: "",
  priority: "",
  category: "",
  assigneeId: null as string | null,
  dueAt: "",
});

const errors = ref<Record<string, string>>({});

onMounted(async () => {
  try {
    const response = await getUsers({ role: "agent" });
    users.value = response.data;
  } catch {
    // Silently fail — assignee dropdown is optional
  }
});

function openDialog() {
  isOpen.value = true;
  errors.value = {};
}

function closeDialog() {
  isOpen.value = false;
  emit("close");
}

function validate(): boolean {
  const newErrors: Record<string, string> = {};

  if (!form.value.title || form.value.title.length < 3) {
    newErrors.title = "Title must be at least 3 characters";
  } else if (form.value.title.length > 120) {
    newErrors.title = "Title must be at most 120 characters";
  }

  if (!form.value.description || form.value.description.length < 10) {
    newErrors.description = "Description must be at least 10 characters";
  } else if (form.value.description.length > 2000) {
    newErrors.description = "Description must be at most 2000 characters";
  }

  if (!form.value.priority) {
    newErrors.priority = "Priority is required";
  }

  if (!form.value.category) {
    newErrors.category = "Category is required";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;

  isSubmitting.value = true;
  try {
    const result = await createTicket({
      title: form.value.title,
      description: form.value.description,
      priority: form.value.priority as "low" | "medium" | "high" | "critical",
      category: form.value.category as "access" | "billing" | "bug" | "feature_request" | "infrastructure" | "other",
      assigneeId: form.value.assigneeId,
      dueAt: form.value.dueAt ? new Date(form.value.dueAt).toISOString() : null,
    });

    notificationStore.addNotification("success", "Ticket created successfully");
    closeDialog();
    emit("created", { id: result.data.id });

    // Reset form
    form.value = {
      title: "",
      description: "",
      priority: "",
      category: "",
      assigneeId: null,
      dueAt: "",
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create ticket";
    notificationStore.addNotification("error", message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
