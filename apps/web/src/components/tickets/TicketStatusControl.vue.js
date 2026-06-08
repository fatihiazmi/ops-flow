/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from "vue";
import { updateTicketStatus } from "../../services/ticketService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";
const props = defineProps();
const emit = defineEmits();
const notificationStore = useNotificationStore();
const isUpdating = ref(false);
const selectedStatus = ref("");
const statusLabel = computed(() => formatStatus(props.currentStatus));
const validNextStatuses = computed(() => {
    const transitions = {
        open: ["in_progress", "closed"],
        in_progress: ["resolved", "closed"],
        resolved: ["closed", "in_progress"],
        closed: [],
    };
    return transitions[props.currentStatus];
});
function formatStatus(status) {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
async function handleChange() {
    if (!selectedStatus.value)
        return;
    isUpdating.value = true;
    try {
        await updateTicketStatus(props.ticketId, { status: selectedStatus.value });
        notificationStore.addNotification("success", "Status updated successfully");
        emit("updated");
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Failed to update status";
        notificationStore.addNotification("error", message);
    }
    finally {
        isUpdating.value = false;
        selectedStatus.value = "";
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center space-x-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm text-gray-500" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-medium" },
});
(__VLS_ctx.statusLabel);
if (__VLS_ctx.validNextStatuses.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        ...{ onChange: (__VLS_ctx.handleChange) },
        value: (__VLS_ctx.selectedStatus),
        disabled: (__VLS_ctx.isUpdating),
        ...{ class: "text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    for (const [s] of __VLS_getVForSourceType((__VLS_ctx.validNextStatuses))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (s),
            value: (s),
        });
        (__VLS_ctx.formatStatus(s));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm text-gray-500" },
    });
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isUpdating: isUpdating,
            selectedStatus: selectedStatus,
            statusLabel: statusLabel,
            validNextStatuses: validNextStatuses,
            formatStatus: formatStatus,
            handleChange: handleChange,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TicketStatusControl.vue.js.map