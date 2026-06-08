<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50">
      <div
        class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center"
      >
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">OpsFlow</h1>
          <nav class="space-x-2">
            <router-link
              to="/tickets"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Tickets
            </router-link>
            <router-link
              to="/dashboard"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </router-link>
            <router-link
              to="/settings"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Settings
            </router-link>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <span
            v-if="authStore.user"
            class="text-sm text-gray-600 dark:text-gray-400"
          >{{ authStore.user.email }}</span>
          <button
            @click="logout"
            class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-3 py-2 rounded-md font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../app/stores/auth.store.js";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout();
  router.push("/login");
}
</script>
