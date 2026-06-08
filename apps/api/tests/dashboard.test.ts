import { describe, it, expect, beforeAll } from "vitest";

const API_BASE = "http://localhost:3000";

let adminToken: string;

describe("Dashboard Metrics", () => {
  beforeAll(async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@opsflow.local",
        password: "password123",
      }),
    });
    const body = await res.json();
    adminToken = body.data.token;
  });

  function authHeaders() {
    return { Authorization: `Bearer ${adminToken}` };
  }

  it("requires auth", async () => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`);
    expect(res.status).toBe(401);
  });

  it("returns expected shape", async () => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: authHeaders(),
    });
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.data).toBeDefined();

    // Metric counts
    expect(typeof body.data.totalOpen).toBe("number");
    expect(typeof body.data.totalInProgress).toBe("number");
    expect(typeof body.data.totalResolvedToday).toBe("number");
    expect(typeof body.data.totalCritical).toBe("number");
    expect(typeof body.data.totalOverdue).toBe("number");
    expect(typeof body.data.unassignedTickets).toBe("number");

    // Distributions
    expect(Array.isArray(body.data.statusDistribution)).toBe(true);
    expect(body.data.statusDistribution.length).toBeGreaterThan(0);
    expect(typeof body.data.statusDistribution[0].status).toBe("string");
    expect(typeof body.data.statusDistribution[0].count).toBe("number");

    expect(Array.isArray(body.data.priorityDistribution)).toBe(true);
    expect(body.data.priorityDistribution.length).toBeGreaterThan(0);
    expect(typeof body.data.priorityDistribution[0].priority).toBe("string");
    expect(typeof body.data.priorityDistribution[0].count).toBe("number");

    // Activity and SLA
    expect(Array.isArray(body.data.recentActivity)).toBe(true);
    expect(Array.isArray(body.data.slaRiskTickets)).toBe(true);
  });

  it("recent activity items have expected fields", async () => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: authHeaders(),
    });
    const body = await res.json();
    if (body.data.recentActivity.length > 0) {
      const act = body.data.recentActivity[0];
      expect(act.id).toBeDefined();
      expect(act.eventType).toBeDefined();
      expect(act.ticketId).toBeDefined();
      expect(act.ticketTitle).toBeDefined();
      expect(act.actor).toBeDefined();
      expect(act.actor.name).toBeDefined();
      expect(act.createdAt).toBeDefined();
    }
  });

  it("sla risk items have expected fields", async () => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: authHeaders(),
    });
    const body = await res.json();
    if (body.data.slaRiskTickets.length > 0) {
      const ticket = body.data.slaRiskTickets[0];
      expect(ticket.id).toBeDefined();
      expect(ticket.title).toBeDefined();
      expect(ticket.priority).toBeDefined();
      expect(ticket.status).toBeDefined();
    }
  });

  it("metrics are non-negative", async () => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: authHeaders(),
    });
    const body = await res.json();
    expect(body.data.totalOpen).toBeGreaterThanOrEqual(0);
    expect(body.data.totalInProgress).toBeGreaterThanOrEqual(0);
    expect(body.data.totalResolvedToday).toBeGreaterThanOrEqual(0);
    expect(body.data.totalCritical).toBeGreaterThanOrEqual(0);
    expect(body.data.totalOverdue).toBeGreaterThanOrEqual(0);
    expect(body.data.unassignedTickets).toBeGreaterThanOrEqual(0);
  });
});
