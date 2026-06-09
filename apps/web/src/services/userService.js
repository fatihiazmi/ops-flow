import { apiRequest } from "./apiClient.js";
export async function getUsers(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.role)
        searchParams.set("role", params.role);
    const query = searchParams.toString();
    return apiRequest("GET", `/users${query ? `?${query}` : ""}`);
}
//# sourceMappingURL=userService.js.map