/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { getTicketById } from "../services/ticketService.js";
import TicketCommentForm from "../components/tickets/TicketCommentForm.vue";
import TicketComments from "../components/tickets/TicketComments.vue";
import TicketActivityTimeline from "../components/tickets/TicketActivityTimeline.vue";
import TicketContextPanel from "../components/tickets/TicketContextPanel.vue";
const __VLS_props = defineProps();
const route = useRoute();
// ── State ──────────────────────────────────────────────────────────
const ticket = ref(null);
const isLoading = ref(false);
const error = ref(null);
const activeTab = ref("comments");
// ── Tab definitions ────────────────────────────────────────────────
const tabs = computed(() => [
    { key: "comments", label: "Comments", count: null },
    { key: "activity", label: "Activity", count: null },
]);
// ── Header computed properties ─────────────────────────────────────
const headerPriorityClass = computed(() => {
    switch (ticket.value?.priority) {
        case "critical": return "bg-red-500/10 text-red-400";
        case "high": return "bg-orange-500/10 text-orange-400";
        case "medium": return "bg-blue-500/10 text-blue-400";
        case "low": return "bg-gray-500/10 text-gray-400";
        default: return "bg-gray-500/10 text-gray-400";
    }
});
const headerStatusDot = computed(() => {
    switch (ticket.value?.status) {
        case "open": return "bg-blue-500";
        case "in_progress": return "bg-amber-500";
        case "resolved": return "bg-emerald-500";
        case "closed": return "bg-slate-500";
        default: return "bg-slate-500";
    }
});
const headerStatusLabel = computed(() => {
    switch (ticket.value?.status) {
        case "open": return "Open";
        case "in_progress": return "In Progress";
        case "resolved": return "Resolved";
        case "closed": return "Closed";
        default: return ticket.value?.status ?? "";
    }
});
const headerCreatedAt = computed(() => {
    if (!ticket.value?.createdAt)
        return "";
    return new Date(ticket.value.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
});
// ── Child component refs (for re-fetch on workflow change) ────────
const commentsRef = ref(null);
const activityRef = ref(null);
// ── Fetch ──────────────────────────────────────────────────────────
async function fetchTicket() {
    const id = route.params.id;
    if (!id)
        return;
    isLoading.value = true;
    error.value = null;
    try {
        const response = await getTicketById(id);
        ticket.value = response.data;
    }
    catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load ticket";
    }
    finally {
        isLoading.value = false;
    }
}
// ── Workflow events ────────────────────────────────────────────────
async function onCommentAdded() {
    await fetchTicket();
    await nextTick();
    commentsRef.value?.fetchComments();
    activityRef.value?.fetchActivity();
}
// ── Lifecycle ──────────────────────────────────────────────────────
onMounted(fetchTicket);
// Re-fetch when route param changes (navigating between tickets via queue)
watch(() => route.params.id, (newId, oldId) => {
    if (newId && newId !== oldId) {
        fetchTicket();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-full min-h-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 min-w-0 flex flex-col overflow-hidden" },
});
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-6 space-y-4 animate-pulse" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-7 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-20 bg-slate-200 dark:bg-slate-800 rounded" },
    });
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 flex items-center justify-center p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-red-500 mb-2" },
    });
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.fetchTicket) },
        ...{ class: "text-xs text-blue-500 hover:text-blue-400" },
    });
}
else if (!__VLS_ctx.ticket) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 flex items-center justify-center p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-400 dark:text-slate-500" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-shrink-0 px-6 pt-6 pb-5" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 mb-3" },
    });
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: "/tickets",
        ...{ class: "hover:text-gray-600 dark:hover:text-slate-300 transition-colors" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/tickets",
        ...{ class: "hover:text-gray-600 dark:hover:text-slate-300 transition-colors" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "w-3 h-3" },
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        'aria-hidden': "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M9 6l6 6-6 6",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-mono tracking-tight" },
    });
    (__VLS_ctx.ticket.id.slice(0, 6));
    if (__VLS_ctx.ticket.category) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400" },
        });
        (__VLS_ctx.ticket.category.replace(/_/g, " "));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3 leading-snug" },
    });
    (__VLS_ctx.ticket.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap items-center gap-2 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize" },
        ...{ class: (__VLS_ctx.headerPriorityClass) },
    });
    (__VLS_ctx.ticket.priority);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "w-1.5 h-1.5 rounded-full flex-shrink-0" },
        ...{ class: (__VLS_ctx.headerStatusDot) },
    });
    (__VLS_ctx.headerStatusLabel);
    if (__VLS_ctx.ticket.assignee) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: "w-3 h-3 flex-shrink-0" },
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            'aria-hidden': "true",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            cx: "12",
            cy: "8",
            r: "4",
            stroke: "currentColor",
            'stroke-width': "2",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            d: "M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
            stroke: "currentColor",
            'stroke-width': "2",
            'stroke-linecap': "round",
        });
        (__VLS_ctx.ticket.assignee.name);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-[11px] text-gray-400 dark:text-slate-600" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-[11px] text-gray-400 dark:text-slate-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-gray-500 dark:text-slate-400" },
    });
    (__VLS_ctx.ticket.createdBy.name);
    (__VLS_ctx.headerCreatedAt);
    if (__VLS_ctx.ticket.description) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-4 pt-4 text-sm text-gray-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap border-t border-slate-100 dark:border-slate-800" },
        });
        (__VLS_ctx.ticket.description);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-shrink-0 flex border-b border-slate-200 dark:border-slate-800 px-6" },
        role: "tablist",
        'aria-label': "Ticket tabs",
    });
    for (const [tab] of __VLS_getVForSourceType((__VLS_ctx.tabs))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isLoading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(!__VLS_ctx.ticket))
                        return;
                    __VLS_ctx.activeTab = tab.key;
                } },
            key: (tab.key),
            role: "tab",
            'aria-selected': (__VLS_ctx.activeTab === tab.key),
            ...{ class: "relative px-4 py-2.5 text-sm font-medium transition-colors -mb-px" },
            ...{ class: (__VLS_ctx.activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 border-b-2 border-transparent') },
        });
        (tab.label);
        if (tab.count != null) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ml-1.5 text-xs opacity-60 tabular-nums" },
            });
            (tab.count);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 overflow-y-auto" },
    });
    if (__VLS_ctx.activeTab === 'comments') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-6 space-y-6" },
        });
        /** @type {[typeof TicketComments, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(TicketComments, new TicketComments({
            ref: "commentsRef",
            ticketId: (__VLS_ctx.ticket.id),
        }));
        const __VLS_5 = __VLS_4({
            ref: "commentsRef",
            ticketId: (__VLS_ctx.ticket.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
        /** @type {typeof __VLS_ctx.commentsRef} */ ;
        var __VLS_7 = {};
        var __VLS_6;
        /** @type {[typeof TicketCommentForm, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(TicketCommentForm, new TicketCommentForm({
            ...{ 'onSubmitted': {} },
            ticketId: (__VLS_ctx.ticket.id),
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onSubmitted': {} },
            ticketId: (__VLS_ctx.ticket.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_12;
        let __VLS_13;
        let __VLS_14;
        const __VLS_15 = {
            onSubmitted: (__VLS_ctx.onCommentAdded)
        };
        var __VLS_11;
    }
    else if (__VLS_ctx.activeTab === 'activity') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-6" },
        });
        /** @type {[typeof TicketActivityTimeline, ]} */ ;
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent(TicketActivityTimeline, new TicketActivityTimeline({
            ref: "activityRef",
            ticketId: (__VLS_ctx.ticket.id),
        }));
        const __VLS_17 = __VLS_16({
            ref: "activityRef",
            ticketId: (__VLS_ctx.ticket.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
        /** @type {typeof __VLS_ctx.activityRef} */ ;
        var __VLS_19 = {};
        var __VLS_18;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hidden xl:block w-72 flex-shrink-0" },
});
if (__VLS_ctx.ticket) {
    /** @type {[typeof TicketContextPanel, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(TicketContextPanel, new TicketContextPanel({
        ...{ 'onUpdated': {} },
        ticket: (__VLS_ctx.ticket),
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onUpdated': {} },
        ticket: (__VLS_ctx.ticket),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onUpdated: (__VLS_ctx.fetchTicket)
    };
    var __VLS_23;
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-24']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['h-7']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3/4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['h-20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-snug']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['capitalize']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-pre-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['-mb-px']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['tabular-nums']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-72']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_20 = __VLS_19;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TicketCommentForm: TicketCommentForm,
            TicketComments: TicketComments,
            TicketActivityTimeline: TicketActivityTimeline,
            TicketContextPanel: TicketContextPanel,
            ticket: ticket,
            isLoading: isLoading,
            error: error,
            activeTab: activeTab,
            tabs: tabs,
            headerPriorityClass: headerPriorityClass,
            headerStatusDot: headerStatusDot,
            headerStatusLabel: headerStatusLabel,
            headerCreatedAt: headerCreatedAt,
            commentsRef: commentsRef,
            activityRef: activityRef,
            fetchTicket: fetchTicket,
            onCommentAdded: onCommentAdded,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TicketDetailPage.vue.js.map