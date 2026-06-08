import { apiRequest } from "./apiClient.js";
import type { ApiResponse, DashboardMetrics } from "@opsflow/shared";

export async function getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
  return apiRequest<ApiResponse<DashboardMetrics>>("GET", "/dashboard/metrics");
}
