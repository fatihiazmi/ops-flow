import { useAuthStore } from "../stores/auth.store.js";
export function setupAuthGuard(router) {
    router.beforeEach((to, _from, next) => {
        const authStore = useAuthStore();
        // For protected routes: require at minimum a token.
        // User info is loaded asynchronously via initializeAuthFromStorage.
        // This avoids a redirect loop on page reload where the token exists
        // but the /auth/me call hasn't completed yet.
        if (to.meta.requiresAuth && !authStore.token) {
            next({ path: "/login", query: { redirect: to.fullPath } });
        }
        else if (to.path === "/login" && authStore.token) {
            next("/tickets");
        }
        else {
            next();
        }
    });
}
//# sourceMappingURL=guards.js.map