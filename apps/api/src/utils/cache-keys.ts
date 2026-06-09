export const DASHBOARD_METRICS_KEY = "dashboard:metrics:v2";

export function dashboardMetricsKeyForProject(projectKey: string): string {
  return `dashboard:metrics:v2:project:${projectKey}`;
}
