import { apiRequest } from "./apiClient.js";
import type { ApiListResponse, ApiResponse, Project } from "@opsflow/shared";

export async function getProjects(): Promise<ApiListResponse<Project>> {
  return apiRequest<ApiListResponse<Project>>("GET", "/projects");
}

export async function getProjectByKey(
  key: string
): Promise<ApiResponse<Project>> {
  return apiRequest<ApiResponse<Project>>("GET", `/projects/${key}`);
}
