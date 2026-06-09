import type { ApiListResponse, PublicUser } from "@opsflow/shared";
export interface UserListParams {
    role?: string;
}
export declare function getUsers(params?: UserListParams): Promise<ApiListResponse<PublicUser>>;
//# sourceMappingURL=userService.d.ts.map