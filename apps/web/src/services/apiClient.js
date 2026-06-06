const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export class ApiError extends Error {
    code;
    status;
    constructor(message, code, status) {
        super(message);
        this.code = code;
        this.status = status;
    }
}
function getToken() {
    return localStorage.getItem("opsflow_token");
}
export async function apiRequest(method, path, body) {
    const url = `${API_BASE_URL}${path}`;
    const headers = {
        "Content-Type": "application/json",
    };
    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) {
        const errorData = data?.error || {
            code: "UNKNOWN_ERROR",
            message: "Request failed",
        };
        throw new ApiError(errorData.message, errorData.code, response.status);
    }
    return data;
}
//# sourceMappingURL=apiClient.js.map