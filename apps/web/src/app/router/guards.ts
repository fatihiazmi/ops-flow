import type { Router } from "vue-router";
import { useAuthStore } from "../stores/auth.store.js";

export function setupAuthGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ path: "/login", query: { redirect: to.fullPath } });
    } else if (to.path === "/login" && authStore.isAuthenticated) {
      next("/tickets");
    } else {
      next();
    }
  });
}
