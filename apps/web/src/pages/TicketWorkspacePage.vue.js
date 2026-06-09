/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from "vue";
import { useRoute } from "vue-router";
import TicketQueueColumn from "../components/tickets/TicketQueueColumn.vue";
const route = useRoute();
const selectedTicketId = computed(() => route.params.id);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ticket-workspace flex h-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hidden md:flex w-[320px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800" },
});
/** @type {[typeof TicketQueueColumn, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(TicketQueueColumn, new TicketQueueColumn({
    selectedTicketId: (__VLS_ctx.selectedTicketId),
}));
const __VLS_1 = __VLS_0({
    selectedTicketId: (__VLS_ctx.selectedTicketId),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 min-w-0 flex flex-col overflow-hidden" },
});
const __VLS_3 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
{
    const { default: __VLS_thisSlot } = __VLS_6.slots;
    const { Component: PageComponent } = __VLS_getSlotParam(__VLS_thisSlot);
    const __VLS_7 = ((PageComponent));
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        selectedTicketId: (__VLS_ctx.selectedTicketId),
    }));
    const __VLS_9 = __VLS_8({
        selectedTicketId: (__VLS_ctx.selectedTicketId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_6.slots['' /* empty slot name completion */];
}
var __VLS_6;
/** @type {__VLS_StyleScopedClasses['ticket-workspace']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[320px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TicketQueueColumn: TicketQueueColumn,
            selectedTicketId: selectedTicketId,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TicketWorkspacePage.vue.js.map