<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      <button
        @click="fetchMetrics"
        class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        :disabled="isLoading"
      >
        Refresh
      </button>
    </div>

    <DashboardLoadingState v-if="isLoading" />

    <DashboardErrorState
      v-else-if="error"
      :message="error"
      @retry="fetchMetrics"
    />

    <template v-else-if="metrics">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard
          label="Open"
          :count="metrics.totalOpen"
          color-class="text-blue-600"
          link-to="/tickets?status=open"
        />
        <MetricCard
          label="In Progress"
          :count="metrics.totalInProgress"
          color-class="text-yellow-600"
          link-to="/tickets?status=in_progress"
        />
        <MetricCard
          label="Critical"
          :count="metrics.totalCritical"
          color-class="text-red-600"
          link-to="/tickets?priority=critical"
        />
        <MetricCard
          label="Overdue"
          :count="metrics.totalOverdue"
          color-class="text-red-600"
        />
        <MetricCard
          label="Unassigned"
          :count="metrics.unassignedTickets"
          color-class="text-gray-600"
        />
        <MetricCard
          label="Resolved Today"
          :count="metrics.totalResolvedToday"
          color-class="text-green-600"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <StatusDistribution :items="metrics.statusDistribution" />
        <PriorityDistribution :items="metrics.priorityDistribution" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SlaRiskList :items="metrics.slaRiskTickets" />
        <RecentActivityPanel :items="metrics.recentActivity" />
      </div>
    </template>

    <div
      v-else
      class="text-center py-12 text-gray-500 dark:text-gray-400"
    >
      <p>No dashboard data available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getDashboardMetrics } from "../services/dashboardService.js";
import type { DashboardMetrics } from "@opsflow/shared";
import MetricCard from "../components/dashboard/MetricCard.vue";
import StatusDistribution from "../components/dashboard/StatusDistribution.vue";
import PriorityDistribution from "../components/dashboard/PriorityDistribution.vue";
import SlaRiskList from "../components/dashboard/SlaRiskList.vue";
import RecentActivityPanel from "../components/dashboard/RecentActivityPanel.vue";
import DashboardLoadingState from "../components/dashboard/DashboardLoadingState.vue";
import DashboardErrorState from "../components/dashboard/DashboardErrorState.vue";

const metrics = ref<DashboardMetrics | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchMetrics() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getDashboardMetrics();
    metrics.value = response.data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load dashboard";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchMetrics();
});
</script>
