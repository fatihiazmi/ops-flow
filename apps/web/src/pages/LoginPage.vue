<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">
        OpsFlow Login
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700"
          >Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700"
          >Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ authStore.loading ? "Signing in..." : "Sign in" }}
        </button>
      </form>

      <div
        v-if="authStore.error"
        class="mt-4 p-3 bg-red-50 rounded-md text-sm text-red-700"
      >
        {{ authStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../app/stores/auth.store.js";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

async function handleLogin() {
  try {
    await authStore.loginUser(email.value, password.value);
    const redirect = router.currentRoute.value.query.redirect as string;
    router.push(redirect || "/tickets");
  } catch {
    // Error is handled by store
  }
}
</script>
