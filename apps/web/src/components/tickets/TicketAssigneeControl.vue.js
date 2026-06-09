/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, watch } from "vue";
import { assignTicket } from "../../services/ticketService.js";
import { getUsers } from "../../services/userService.js";
import { useNotificationStore } from "../../app/stores/notification.store.js";
const props = defineProps();
const emit = defineEmits();
const notificationStore = useNotificationStore();
const isUpdating = ref(false);
const selectedAssigneeId = ref("");
const users = ref([]);
onMounted(async () => {
    try {
        const response = await getUsers({ role: "agent" });
        users.value = response.data;
    }
    catch {
        // Silently fail
    }
    selectedAssigneeId.value = props.currentAssignee?.id || "";
});
async function handleChange() {
    isUpdating.value = true;
    const previousValue = props.currentAssignee?.id || "";
    try {
        await assignTicket(props.ticketId, {
            assigneeId: selectedAssigneeId.value || null,
        });
        notificationStore.addNotification("success", "Assignee updated successfully");
        emit("updated");
    }
    catch (e) {
        selectedAssigneeId.value = previousValue;
        const message = e instanceof Error ? e.message : "Failed to update assignee";
        notificationStore.addNotification("error", message);
    }
    finally {
        isUpdating.value = false;
    }
}
// Trigger on select change (skip initial since onMounted sets it)
watch(selectedAssigneeId, (val, oldVal) => {
    if (oldVal !== undefined && val !== (props.currentAssignee?.id || "")) {
        handleChange();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-[10px] font-semibold text-slate-400" },
});
(__VLS_ctx.currentAssignee?.name ? __VLS_ctx.currentAssignee.name.charAt(0).toUpperCase() : "?");
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.selectedAssigneeId),
    disabled: (__VLS_ctx.isUpdating),
    'aria-label': "Change ticket assignee",
    ...{ class: "\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u0074\u0065\u0078\u0074\u002d\u0073\u006d\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u006c\u0067\u0020\u0070\u0079\u002d\u0031\u002e\u0035\u0020\u0070\u006c\u002d\u0032\u002e\u0035\u0020\u0070\u0072\u002d\u0038\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0062\u0067\u002d\u0073\u006c\u0061\u0074\u0065\u002d\u0038\u0030\u0030\u002f\u0035\u0030\u0020\u0064\u0061\u0072\u006b\u003a\u0062\u0067\u002d\u0073\u006c\u0061\u0074\u0065\u002d\u0038\u0030\u0030\u002f\u0035\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0073\u006c\u0061\u0074\u0065\u002d\u0037\u0030\u0030\u0020\u0064\u0061\u0072\u006b\u003a\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0073\u006c\u0061\u0074\u0065\u002d\u0037\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0074\u0065\u0078\u0074\u002d\u0073\u006c\u0061\u0074\u0065\u002d\u0032\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u006f\u0075\u0074\u006c\u0069\u006e\u0065\u002d\u006e\u006f\u006e\u0065\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0072\u0069\u006e\u0067\u002d\u0032\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0072\u0069\u006e\u0067\u002d\u0062\u006c\u0075\u0065\u002d\u0035\u0030\u0030\u002f\u0035\u0030\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0062\u006c\u0075\u0065\u002d\u0035\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0035\u0030\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u0063\u0075\u0072\u0073\u006f\u0072\u002d\u006e\u006f\u0074\u002d\u0061\u006c\u006c\u006f\u0077\u0065\u0064\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u002d\u0063\u006f\u006c\u006f\u0072\u0073\u0020\u0061\u0070\u0070\u0065\u0061\u0072\u0061\u006e\u0063\u0065\u002d\u006e\u006f\u006e\u0065\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0062\u0067\u002d\u005b\u0075\u0072\u006c\u0028\u0027\u0064\u0061\u0074\u0061\u003a\u0069\u006d\u0061\u0067\u0065\u002f\u0073\u0076\u0067\u002b\u0078\u006d\u006c\u003b\u0063\u0068\u0061\u0072\u0073\u0065\u0074\u003d\u0075\u0074\u0066\u002d\u0038\u002c\u0025\u0033\u0043\u0073\u0076\u0067\u0025\u0032\u0030\u0078\u006d\u006c\u006e\u0073\u0025\u0033\u0044\u0025\u0032\u0032\u0068\u0074\u0074\u0070\u0025\u0033\u0041\u002f\u002f\u0077\u0077\u0077\u002e\u0077\u0033\u002e\u006f\u0072\u0067\u002f\u0032\u0030\u0030\u0030\u002f\u0073\u0076\u0067\u0025\u0032\u0032\u0025\u0032\u0030\u0077\u0069\u0064\u0074\u0068\u0025\u0033\u0044\u0025\u0032\u0032\u0031\u0032\u0025\u0032\u0032\u0025\u0032\u0030\u0068\u0065\u0069\u0067\u0068\u0074\u0025\u0033\u0044\u0025\u0032\u0032\u0031\u0032\u0025\u0032\u0032\u0025\u0032\u0030\u0066\u0069\u006c\u006c\u0025\u0033\u0044\u0025\u0032\u0032\u006e\u006f\u006e\u0065\u0025\u0032\u0032\u0025\u0032\u0030\u0076\u0069\u0065\u0077\u0042\u006f\u0078\u0025\u0033\u0044\u0025\u0032\u0032\u0030\u0025\u0032\u0030\u0030\u0025\u0032\u0030\u0032\u0034\u0025\u0032\u0030\u0032\u0034\u0025\u0032\u0032\u0025\u0033\u0045\u0025\u0033\u0043\u0070\u0061\u0074\u0068\u0025\u0032\u0030\u0064\u0025\u0033\u0044\u0025\u0032\u0032\u004d\u0036\u0025\u0032\u0030\u0039\u006c\u0036\u0025\u0032\u0030\u0036\u0025\u0032\u0030\u0036\u002d\u0036\u0025\u0032\u0032\u0025\u0032\u0030\u0073\u0074\u0072\u006f\u006b\u0065\u0025\u0033\u0044\u0025\u0032\u0032\u0025\u0032\u0033\u0039\u0034\u0061\u0033\u0062\u0038\u0025\u0032\u0032\u0025\u0032\u0030\u0073\u0074\u0072\u006f\u006b\u0065\u002d\u0077\u0069\u0064\u0074\u0068\u0025\u0033\u0044\u0025\u0032\u0032\u0032\u0025\u0032\u0032\u0025\u0032\u0030\u0073\u0074\u0072\u006f\u006b\u0065\u002d\u006c\u0069\u006e\u0065\u0063\u0061\u0070\u0025\u0033\u0044\u0025\u0032\u0032\u0072\u006f\u0075\u006e\u0064\u0025\u0032\u0032\u0025\u0032\u0030\u0073\u0074\u0072\u006f\u006b\u0065\u002d\u006c\u0069\u006e\u0065\u006a\u006f\u0069\u006e\u0025\u0033\u0044\u0025\u0032\u0032\u0072\u006f\u0075\u006e\u0064\u0025\u0032\u0032\u002f\u0025\u0033\u0045\u0025\u0033\u0043\u002f\u0073\u0076\u0067\u0025\u0033\u0045\u0027\u0029\u005d\u0020\u0062\u0067\u002d\u005b\u006c\u0065\u006e\u0067\u0074\u0068\u003a\u0031\u0032\u0070\u0078\u005d\u0020\u0062\u0067\u002d\u005b\u0072\u0069\u0067\u0068\u0074\u005f\u0038\u0070\u0078\u005f\u0063\u0065\u006e\u0074\u0065\u0072\u005d\u0020\u0062\u0067\u002d\u006e\u006f\u002d\u0072\u0065\u0070\u0065\u0061\u0074" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.users))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (user.id),
        value: (user.id),
    });
    (user.name);
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-700/50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500/50']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['appearance-none']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E\')]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[length:12px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[right_8px_center]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-no-repeat']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isUpdating: isUpdating,
            selectedAssigneeId: selectedAssigneeId,
            users: users,
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
//# sourceMappingURL=TicketAssigneeControl.vue.js.map