import { apiRequest } from "./apiClient.js";
import type {
  LoginRequest,
  LoginResponse,
  PublicUser,
  ApiResponse,
} from "@opsflow/shared";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await apiRequest<ApiResponse<LoginResponse>>(
    "POST",
    "/auth/login",
    credentials
  );
  return res.data;
}

export async function getMe(): Promise<PublicUser> {
  const res = await apiRequest<ApiResponse<PublicUser>>("GET", "/auth/me");
  return res.data;
}
