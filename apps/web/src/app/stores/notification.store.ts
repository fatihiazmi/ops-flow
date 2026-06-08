import { defineStore } from "pinia";
import { ref } from "vue";

export interface Notification {
  id: string;
  type: "success" | "error";
  message: string;
}

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  function addNotification(type: "success" | "error", message: string) {
    const id = Math.random().toString(36).substring(2, 9);
    notifications.value.push({ id, type, message });
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  }

  return {
    notifications,
    addNotification,
    removeNotification,
  };
});
