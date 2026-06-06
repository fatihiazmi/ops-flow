export declare class ApiError extends Error {
    code: string;
    status: number;
    constructor(message: string, code: string, status: number);
}
export declare function apiRequest<T>(method: string, path: string, body?: unknown): Promise<T>;
//# sourceMappingURL=apiClient.d.ts.map