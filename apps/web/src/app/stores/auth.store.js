import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { login, getMe } from "../../services/authService.js";
export const useAuthStore = defineStore("auth", () => {
    const user = ref(null);
    const token = ref(localStorage.getItem("opsflow_token"));
    const loading = ref(false);
    const error = ref(null);
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    async function loginUser(email, password) {
        loading.value = true;
        error.value = null;
        try {
            const result = await login({ email, password });
            token.value = result.token;
            user.value = result.user;
            localStorage.setItem("opsflow_token", result.token);
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : "Login failed";
            throw e;
        }
        finally {
            loading.value = false;
        }
    }
    async function fetchMe() {
        if (!token.value)
            return;
        try {
            const me = await getMe();
            user.value = me;
        }
        catch {
            logout();
        }
    }
    function logout() {
        user.value = null;
        token.value = null;
        localStorage.removeItem("opsflow_token");
    }
    function initializeAuthFromStorage() {
        if (token.value) {
            fetchMe();
        }
    }
    return {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        loginUser,
        logout,
        fetchMe,
        initializeAuthFromStorage,
    };
});
//# sourceMappingURL=auth.store.js.map