export type ServiceStatus = "ok" | "ready" | "degraded";

export interface HealthResponse {
  status: ServiceStatus;
  service: string;
}

export interface ReadyResponse {
  status: ServiceStatus;
  postgres: string;
  redis: string;
}
