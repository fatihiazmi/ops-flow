import type { PublicUser } from "@opsflow/shared";
export declare const useAuthStore: import("pinia").StoreDefinition<"auth", Pick<{
    user: import("vue").Ref<{
        id: string;
        name: string;
        email: string;
        role: import("@opsflow/shared").UserRole;
    } | null, PublicUser | {
        id: string;
        name: string;
        email: string;
        role: import("@opsflow/shared").UserRole;
    } | null>;
    token: import("vue").Ref<string | null, string | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    loginUser: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchMe: () => Promise<void>;
    initializeAuthFromStorage: () => Promise<void>;
}, "error" | "user" | "token" | "loading">, Pick<{
    user: import("vue").Ref<{
        id: string;
        name: string;
        email: string;
        role: import("@opsflow/shared").UserRole;
    } | null, PublicUser | {
        id: string;
        name: string;
        email: string;
        role: import("@opsflow/shared").UserRole;
    } | null>;
    token: import("vue").Ref<string | null, string | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    loginUser: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchMe: () => Promise<void>;
    initializeAuthFromStorage: () => Promise<void>;
}, "isAuthenticated">, Pick<{
    user: import("vue").Ref<{
        id: string;
        name: string;
        email: string;
        role: import("@opsflow/shared").UserRole;
    } | null, PublicUser | {
        id: string;
        name: string;
        email: string;
        role: import("@opsflow/shared").UserRole;
    } | null>;
    token: import("vue").Ref<string | null, string | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    loginUser: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchMe: () => Promise<void>;
    initializeAuthFromStorage: () => Promise<void>;
}, "loginUser" | "logout" | "fetchMe" | "initializeAuthFromStorage">>;
//# sourceMappingURL=auth.store.d.ts.map