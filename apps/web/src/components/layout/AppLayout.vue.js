/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppSidebar from "./AppSidebar.vue";
import AppTopbar from "./AppTopbar.vue";
import CreateTicketDialog from "../tickets/CreateTicketDialog.vue";
const router = useRouter();
const showCreateDialog = ref(false);
function onTicketCreated(ticket) {
    showCreateDialog.value = false;
    router.push(`/tickets/${ticket.id}`);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-shell flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden" },
});
/** @type {[typeof AppSidebar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppSidebar, new AppSidebar({
    ...{ class: "hidden lg:flex" },
}));
const __VLS_1 = __VLS_0({
    ...{ class: "hidden lg:flex" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 flex flex-col min-w-0" },
});
/** @type {[typeof AppTopbar, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(AppTopbar, new AppTopbar({
    ...{ 'onCreateTicket': {} },
}));
const __VLS_4 = __VLS_3({
    ...{ 'onCreateTicket': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
let __VLS_6;
let __VLS_7;
let __VLS_8;
const __VLS_9 = {
    onCreateTicket: (...[$event]) => {
        __VLS_ctx.showCreateDialog = true;
    }
};
var __VLS_5;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "flex-1 overflow-hidden" },
});
const __VLS_10 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
{
    const { default: __VLS_thisSlot } = __VLS_13.slots;
    const { Component: PageComponent } = __VLS_getSlotParam(__VLS_thisSlot);
    const __VLS_14 = ((PageComponent));
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
    const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
    __VLS_13.slots['' /* empty slot name completion */];
}
var __VLS_13;
if (__VLS_ctx.showCreateDialog) {
    /** @type {[typeof CreateTicketDialog, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(CreateTicketDialog, new CreateTicketDialog({
        ...{ 'onCreated': {} },
        ...{ 'onClose': {} },
        initialOpen: (true),
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onCreated': {} },
        ...{ 'onClose': {} },
        initialOpen: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = {
        onCreated: (__VLS_ctx.onTicketCreated)
    };
    const __VLS_25 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.showCreateDialog))
                return;
            __VLS_ctx.showCreateDialog = false;
        }
    };
    var __VLS_20;
}
/** @type {__VLS_StyleScopedClasses['app-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-950']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AppSidebar: AppSidebar,
            AppTopbar: AppTopbar,
            CreateTicketDialog: CreateTicketDialog,
            showCreateDialog: showCreateDialog,
            onTicketCreated: onTicketCreated,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AppLayout.vue.js.map