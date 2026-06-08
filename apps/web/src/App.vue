<template>
  <div>
    <router-view />
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        role="alert"
        :class="[
          'px-4 py-3 rounded-lg shadow-lg text-sm font-medium',
          notification.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200',
        ]"
      >
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from "./app/stores/notification.store.js";

const notificationStore = useNotificationStore();
</script>
