import { apiRequest } from "./apiClient.js";
export function getHealth() {
    return apiRequest("GET", "/health");
}
//# sourceMappingURL=systemService.js.map