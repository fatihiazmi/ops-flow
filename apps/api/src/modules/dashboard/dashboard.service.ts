import { cacheGet, cacheSet } from "../../services/cache.service.js";
import { DASHBOARD_METRICS_KEY } from "../../utils/cache-keys.js";
import {
  countByStatus,
  countResolvedToday,
  countCriticalActive,
  countOverdue,
  countUnassigned,
  getStatusDistribution,
  getPriorityDistribution,
  getRecentActivity,
  getSlaRiskTickets,
} from "./dashboard.repository.js";
import type { DashboardMetrics } from "./dashboard.types.js";

const CACHE_TTL_SECONDS = 60;

export async function getDashboardMetrics(): Promise<{
  data: DashboardMetrics;
  cacheHit: boolean;
}> {
  const cached = await cacheGet(DASHBOARD_METRICS_KEY);

  if (cached) {
    console.log(`GET /dashboard/metrics cache=hit`);
    return { data: JSON.parse(cached) as DashboardMetrics, cacheHit: true };
  }

  console.log(`GET /dashboard/metrics cache=miss`);

  const [
    totalOpen,
    totalInProgress,
    totalResolvedToday,
    totalCritical,
    totalOverdue,
    unassignedTickets,
    statusDistribution,
    priorityDistribution,
    recentActivity,
    slaRiskTickets,
  ] = await Promise.all([
    countByStatus("open"),
    countByStatus("in_progress"),
    countResolvedToday(),
    countCriticalActive(),
    countOverdue(),
    countUnassigned(),
    getStatusDistribution(),
    getPriorityDistribution(),
    getRecentActivity(),
    getSlaRiskTickets(),
  ]);

  const metrics: DashboardMetrics = {
    totalOpen,
    totalInProgress,
    totalResolvedToday,
    totalCritical,
    totalOverdue,
    unassignedTickets,
    statusDistribution,
    priorityDistribution,
    recentActivity,
    slaRiskTickets,
  };

  await cacheSet(DASHBOARD_METRICS_KEY, JSON.stringify(metrics), CACHE_TTL_SECONDS);

  return { data: metrics, cacheHit: false };
}

export async function invalidateDashboardCache(): Promise<void> {
  try {
    const { cacheDelete } = await import("../../services/cache.service.js");
    await cacheDelete(DASHBOARD_METRICS_KEY);
    console.log(`Dashboard cache: invalidated (${DASHBOARD_METRICS_KEY})`);
  } catch (err) {
    console.error(`Dashboard cache: invalidation failed`, err);
  }
}
