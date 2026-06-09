import { apiRequest } from "./apiClient.js";
export async function getDashboardMetrics() {
    return apiRequest("GET", "/dashboard/metrics");
}
//# sourceMappingURL=dashboardService.js.map