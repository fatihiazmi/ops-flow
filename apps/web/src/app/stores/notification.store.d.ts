export interface Notification {
    id: string;
    type: "success" | "error";
    message: string;
}
export declare const useNotificationStore: import("pinia").StoreDefinition<"notification", Pick<{
    notifications: import("vue").Ref<{
        id: string;
        type: "success" | "error";
        message: string;
    }[], Notification[] | {
        id: string;
        type: "success" | "error";
        message: string;
    }[]>;
    addNotification: (type: "success" | "error", message: string) => void;
    removeNotification: (id: string) => void;
}, "notifications">, Pick<{
    notifications: import("vue").Ref<{
        id: string;
        type: "success" | "error";
        message: string;
    }[], Notification[] | {
        id: string;
        type: "success" | "error";
        message: string;
    }[]>;
    addNotification: (type: "success" | "error", message: string) => void;
    removeNotification: (id: string) => void;
}, never>, Pick<{
    notifications: import("vue").Ref<{
        id: string;
        type: "success" | "error";
        message: string;
    }[], Notification[] | {
        id: string;
        type: "success" | "error";
        message: string;
    }[]>;
    addNotification: (type: "success" | "error", message: string) => void;
    removeNotification: (id: string) => void;
}, "addNotification" | "removeNotification">>;
//# sourceMappingURL=notification.store.d.ts.map