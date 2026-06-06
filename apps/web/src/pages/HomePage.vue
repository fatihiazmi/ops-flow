<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">OpsFlow</h1>
      <p class="text-gray-600 mb-6">Service Desk Operations Dashboard</p>

      <div class="space-y-4">
        <div
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <span class="font-medium text-gray-700">API Status</span>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              status === 'ok'
                ? 'bg-green-100 text-green-800'
                : status === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800',
            ]"
          >
            {{ statusText }}
          </span>
        </div>

        <div v-if="error" class="p-4 bg-red-50 rounded-lg text-sm text-red-700">
          {{ error }}
        </div>
      </div>

      <div class="mt-8 text-sm text-gray-500">
        <p>Phase 0: Infrastructure Foundation</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { checkHealth } from "../services/apiClient";

const status = ref<"loading" | "ok" | "error">("loading");
const error = ref<string>("");

const statusText = computed(() => {
  switch (status.value) {
    case "loading":
      return "Checking...";
    case "ok":
      return "Connected";
    case "error":
      return "Disconnected";
    default:
      return "Unknown";
  }
});

onMounted(async () => {
  try {
    const result = await checkHealth();
    status.value = result.status === "ok" ? "ok" : "error";
  } catch (e) {
    status.value = "error";
    error.value = e instanceof Error ? e.message : "Failed to connect to API";
  }
});
</script>
