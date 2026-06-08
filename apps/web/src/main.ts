import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./app/router";
import { useAuthStore } from "./app/stores/auth.store.js";
import { applyInitialTheme } from "./app/stores/settings.store.js";
import "./style.css";

applyInitialTheme();

const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore();
authStore.initializeAuthFromStorage();

app.mount("#app");
