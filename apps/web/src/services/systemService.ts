import { apiRequest } from "./apiClient.js";

export interface HealthResponse {
  status: string;
  service: string;
}

export function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>("GET", "/health");
}
