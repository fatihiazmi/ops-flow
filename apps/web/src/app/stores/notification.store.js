import { defineStore } from "pinia";
import { ref } from "vue";
export const useNotificationStore = defineStore("notification", () => {
    const notifications = ref([]);
    function addNotification(type, message) {
        const id = Math.random().toString(36).substring(2, 9);
        notifications.value.push({ id, type, message });
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }
    function removeNotification(id) {
        notifications.value = notifications.value.filter((n) => n.id !== id);
    }
    return {
        notifications,
        addNotification,
        removeNotification,
    };
});
//# sourceMappingURL=notification.store.js.map