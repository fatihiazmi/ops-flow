import { apiRequest } from "./apiClient.js";
export async function login(credentials) {
    const res = await apiRequest("POST", "/auth/login", credentials);
    return res.data;
}
export async function getMe() {
    const res = await apiRequest("GET", "/auth/me");
    return res.data;
}
//# sourceMappingURL=authService.js.map