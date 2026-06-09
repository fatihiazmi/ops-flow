<template>
  <div class="h-full overflow-y-auto p-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Settings</h1>

    <section class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
      <fieldset class="mt-3">
        <legend class="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</legend>
        <div class="mt-2 flex flex-wrap gap-4">
          <label
            v-for="opt in themeOptions"
            :key="opt.value"
            class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <input
              type="radio"
              name="theme"
              :value="opt.value"
              :checked="settings.theme === opt.value"
              @change="settings.setTheme(opt.value)"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            {{ opt.label }}
          </label>
        </div>
      </fieldset>
    </section>

    <section class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Ticket List Preferences</h2>

      <fieldset class="mt-3">
        <legend class="text-sm font-medium text-gray-700 dark:text-gray-300">Table Density</legend>
        <div class="mt-2 flex flex-wrap gap-4">
          <label
            v-for="opt in densityOptions"
            :key="opt.value"
            class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <input
              type="radio"
              name="density"
              :value="opt.value"
              :checked="settings.ticketTableDensity === opt.value"
              @change="settings.setTicketTableDensity(opt.value)"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            {{ opt.label }}
          </label>
        </div>
      </fieldset>

      <div class="mt-4">
        <label
          for="page-size"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Default Page Size</label>
        <select
          id="page-size"
          :value="settings.defaultTicketPageSize"
          @change="settings.setDefaultTicketPageSize(Number(($event.target as HTMLSelectElement).value) as 10 | 20 | 50)"
          class="mt-1 block w-32 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option
            v-for="size in pageSizes"
            :key="size"
            :value="size"
          >{{ size }}</option>
        </select>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Used when no page size is set in the URL. URL query parameter overrides this default.</p>
      </div>
    </section>

    <section class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>

      <div class="mt-3 space-y-4">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="settings.showSuccessToasts"
            @change="settings.setShowSuccessToasts(($event.target as HTMLInputElement).checked)"
            class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Show success toasts</span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="settings.showDashboardCacheBadge"
            @change="settings.setShowDashboardCacheBadge(($event.target as HTMLInputElement).checked)"
            class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Show dashboard cache badge</span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="settings.showSlaWarningBanners"
            @change="settings.setShowSlaWarningBanners(($event.target as HTMLInputElement).checked)"
            class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Show SLA warning banners</span>
        </label>
      </div>
    </section>

    <section class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Account</h2>

      <div v-if="authStore.user" class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <div>
          <span class="font-medium">Name:</span> {{ authStore.user.name }}
        </div>
        <div>
          <span class="font-medium">Email:</span> {{ authStore.user.email }}
        </div>
        <div>
          <span class="font-medium">Role:</span>
          <span class="capitalize">{{ authStore.user.role }}</span>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="mt-4 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/70 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </section>

    <section class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">System</h2>

      <div class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <div>
          <span class="font-medium">Environment:</span> {{ environment }}
        </div>
        <div>
          <span class="font-medium">API Base URL:</span> {{ apiBaseUrl }}
        </div>
      </div>

      <div class="mt-4">
        <button
          @click="checkHealth"
          :disabled="healthLoading"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {{ healthLoading ? "Checking..." : "Check API Health" }}
        </button>

        <p
          v-if="healthStatus && !healthLoading"
          class="mt-2 text-sm"
          :class="healthError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
          role="status"
        >
          {{ healthStatus }}
        </p>
      </div>
    </section>

    <section class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Reset</h2>

      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Reset all settings to their default values. This cannot be undone.
      </p>

      <button
        @click="handleReset"
        class="mt-3 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Reset Settings
      </button>

      <p
        v-if="resetMessage"
        class="mt-2 text-sm text-green-600 dark:text-green-400"
        role="status"
      >
        {{ resetMessage }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "../app/stores/settings.store.js";
import { useAuthStore } from "../app/stores/auth.store.js";
import { getHealth } from "../services/systemService.js";
import type { Theme, TicketTableDensity } from "../app/stores/settings.store.js";

const router = useRouter();
const settings = useSettingsStore();
const authStore = useAuthStore();

const environment = import.meta.env.MODE || "development";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const themeOptions: { label: string; value: Theme }[] = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const densityOptions: { label: string; value: TicketTableDensity }[] = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" },
];

const pageSizes = [10, 20, 50] as const;

const healthLoading = ref(false);
const healthStatus = ref<string | null>(null);
const healthError = ref(false);

async function checkHealth() {
  healthLoading.value = true;
  healthStatus.value = null;
  healthError.value = false;
  try {
    const result = await getHealth();
    healthStatus.value = `API is healthy — ${result.service} (${result.status})`;
    healthError.value = false;
  } catch (e) {
    healthStatus.value = e instanceof Error ? e.message : "Health check failed";
    healthError.value = true;
  } finally {
    healthLoading.value = false;
  }
}

function handleLogout() {
  authStore.logout();
  router.push("/login");
}

const resetMessage = ref<string | null>(null);

function handleReset() {
  settings.resetToDefaults();
  resetMessage.value = "Settings reset to defaults.";
  setTimeout(() => {
    resetMessage.value = null;
  }, 3000);
}
</script>
