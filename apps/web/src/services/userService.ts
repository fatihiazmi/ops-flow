import { apiRequest } from "./apiClient.js";
import type { ApiListResponse, PublicUser } from "@opsflow/shared";

export interface UserListParams {
  role?: string;
}

export async function getUsers(
  params: UserListParams = {}
): Promise<ApiListResponse<PublicUser>> {
  const searchParams = new URLSearchParams();
  if (params.role) searchParams.set("role", params.role);

  const query = searchParams.toString();
  return apiRequest<ApiListResponse<PublicUser>>(
    "GET",
    `/users${query ? `?${query}` : ""}`
  );
}
