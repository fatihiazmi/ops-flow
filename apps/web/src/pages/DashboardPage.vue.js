/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from "vue";
import { getDashboardMetrics } from "../services/dashboardService.js";
import MetricCard from "../components/dashboard/MetricCard.vue";
import StatusDistribution from "../components/dashboard/StatusDistribution.vue";
import PriorityDistribution from "../components/dashboard/PriorityDistribution.vue";
import SlaRiskList from "../components/dashboard/SlaRiskList.vue";
import RecentActivityPanel from "../components/dashboard/RecentActivityPanel.vue";
import DashboardLoadingState from "../components/dashboard/DashboardLoadingState.vue";
import DashboardErrorState from "../components/dashboard/DashboardErrorState.vue";
const metrics = ref(null);
const isLoading = ref(false);
const error = ref(null);
async function fetchMetrics() {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await getDashboardMetrics();
        metrics.value = response.data;
    }
    catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load dashboard";
    }
    finally {
        isLoading.value = false;
    }
}
onMounted(() => {
    fetchMetrics();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "h-full overflow-y-auto p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold text-gray-900 dark:text-gray-100" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.fetchMetrics) },
    ...{ class: "px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" },
    disabled: (__VLS_ctx.isLoading),
});
if (__VLS_ctx.isLoading) {
    /** @type {[typeof DashboardLoadingState, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(DashboardLoadingState, new DashboardLoadingState({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
else if (__VLS_ctx.error) {
    /** @type {[typeof DashboardErrorState, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(DashboardErrorState, new DashboardErrorState({
        ...{ 'onRetry': {} },
        message: (__VLS_ctx.error),
    }));
    const __VLS_4 = __VLS_3({
        ...{ 'onRetry': {} },
        message: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    let __VLS_6;
    let __VLS_7;
    let __VLS_8;
    const __VLS_9 = {
        onRetry: (__VLS_ctx.fetchMetrics)
    };
    var __VLS_5;
}
else if (__VLS_ctx.metrics) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6" },
    });
    /** @type {[typeof MetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(MetricCard, new MetricCard({
        label: "Open",
        count: (__VLS_ctx.metrics.totalOpen),
        colorClass: "text-blue-600",
        linkTo: "/tickets?status=open",
    }));
    const __VLS_11 = __VLS_10({
        label: "Open",
        count: (__VLS_ctx.metrics.totalOpen),
        colorClass: "text-blue-600",
        linkTo: "/tickets?status=open",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    /** @type {[typeof MetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(MetricCard, new MetricCard({
        label: "In Progress",
        count: (__VLS_ctx.metrics.totalInProgress),
        colorClass: "text-yellow-600",
        linkTo: "/tickets?status=in_progress",
    }));
    const __VLS_14 = __VLS_13({
        label: "In Progress",
        count: (__VLS_ctx.metrics.totalInProgress),
        colorClass: "text-yellow-600",
        linkTo: "/tickets?status=in_progress",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {[typeof MetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(MetricCard, new MetricCard({
        label: "Critical",
        count: (__VLS_ctx.metrics.totalCritical),
        colorClass: "text-red-600",
        linkTo: "/tickets?priority=critical",
    }));
    const __VLS_17 = __VLS_16({
        label: "Critical",
        count: (__VLS_ctx.metrics.totalCritical),
        colorClass: "text-red-600",
        linkTo: "/tickets?priority=critical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    /** @type {[typeof MetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(MetricCard, new MetricCard({
        label: "Overdue",
        count: (__VLS_ctx.metrics.totalOverdue),
        colorClass: "text-red-600",
    }));
    const __VLS_20 = __VLS_19({
        label: "Overdue",
        count: (__VLS_ctx.metrics.totalOverdue),
        colorClass: "text-red-600",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {[typeof MetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(MetricCard, new MetricCard({
        label: "Unassigned",
        count: (__VLS_ctx.metrics.unassignedTickets),
        colorClass: "text-gray-600",
    }));
    const __VLS_23 = __VLS_22({
        label: "Unassigned",
        count: (__VLS_ctx.metrics.unassignedTickets),
        colorClass: "text-gray-600",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    /** @type {[typeof MetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(MetricCard, new MetricCard({
        label: "Resolved Today",
        count: (__VLS_ctx.metrics.totalResolvedToday),
        colorClass: "text-green-600",
    }));
    const __VLS_26 = __VLS_25({
        label: "Resolved Today",
        count: (__VLS_ctx.metrics.totalResolvedToday),
        colorClass: "text-green-600",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6" },
    });
    /** @type {[typeof StatusDistribution, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(StatusDistribution, new StatusDistribution({
        items: (__VLS_ctx.metrics.statusDistribution),
    }));
    const __VLS_29 = __VLS_28({
        items: (__VLS_ctx.metrics.statusDistribution),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    /** @type {[typeof PriorityDistribution, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(PriorityDistribution, new PriorityDistribution({
        items: (__VLS_ctx.metrics.priorityDistribution),
    }));
    const __VLS_32 = __VLS_31({
        items: (__VLS_ctx.metrics.priorityDistribution),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 lg:grid-cols-2 gap-4" },
    });
    /** @type {[typeof SlaRiskList, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(SlaRiskList, new SlaRiskList({
        items: (__VLS_ctx.metrics.slaRiskTickets),
    }));
    const __VLS_35 = __VLS_34({
        items: (__VLS_ctx.metrics.slaRiskTickets),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    /** @type {[typeof RecentActivityPanel, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(RecentActivityPanel, new RecentActivityPanel({
        items: (__VLS_ctx.metrics.recentActivity),
    }));
    const __VLS_38 = __VLS_37({
        items: (__VLS_ctx.metrics.recentActivity),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12 text-gray-500 dark:text-gray-400" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-6']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MetricCard: MetricCard,
            StatusDistribution: StatusDistribution,
            PriorityDistribution: PriorityDistribution,
            SlaRiskList: SlaRiskList,
            RecentActivityPanel: RecentActivityPanel,
            DashboardLoadingState: DashboardLoadingState,
            DashboardErrorState: DashboardErrorState,
            metrics: metrics,
            isLoading: isLoading,
            error: error,
            fetchMetrics: fetchMetrics,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DashboardPage.vue.js.map