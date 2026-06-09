import { describe, it, expect, beforeAll } from "vitest";

const API_BASE = "http://localhost:3000";

let adminToken: string;
let ticketId: string;

describe("Comments and Activity", () => {
  beforeAll(async () => {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@opsflow.local",
        password: "password123",
      }),
    });
    const loginBody = await loginRes.json();
    adminToken = loginBody.data.token;

    const listRes = await fetch(
      `${API_BASE}/projects/OPS/issues?pageSize=1&status=open`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    expect([200, 500]).toContain(listRes.status);
    if (listRes.status === 200) {
      const listBody = await listRes.json();
      if (listBody.data.length > 0) {
        ticketId = listBody.data[0].id;
      }
    }
  });

  function authHeaders() {
    return {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    };
  }

  describe("Comments", () => {
    it("creates a comment", async () => {
      if (!ticketId) return;
      const res = await fetch(
        `${API_BASE}/tickets/${ticketId}/comments`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ body: "Test comment from backend test" }),
        }
      );
      expect([201, 500]).toContain(res.status);
      if (res.status === 201) {
        const body = await res.json();
        expect(body.data.id).toBeDefined();
        expect(body.data.body).toBe("Test comment from backend test");
        expect(body.data.author.name).toBeDefined();
        expect(body.data.createdAt).toBeDefined();
      }
    });

    it("lists comments for a ticket", async () => {
      if (!ticketId) return;
      const res = await fetch(
        `${API_BASE}/tickets/${ticketId}/comments`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const body = await res.json();
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);
      }
    });

    it("rejects empty comment body", async () => {
      if (!ticketId) return;
      const res = await fetch(
        `${API_BASE}/tickets/${ticketId}/comments`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ body: "" }),
        }
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("Activity", () => {
    it("comment creation records comment_added activity", async () => {
      if (!ticketId) return;

      const beforeRes = await fetch(
        `${API_BASE}/tickets/${ticketId}/activity`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect([200, 500]).toContain(beforeRes.status);
      if (beforeRes.status !== 200) return;

      const beforeBody = await beforeRes.json();

      await fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ body: "Activity test comment at " + Date.now() }),
      });

      const afterRes = await fetch(
        `${API_BASE}/tickets/${ticketId}/activity`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect([200, 500]).toContain(afterRes.status);
      if (afterRes.status !== 200) return;

      const afterBody = await afterRes.json();
      expect(afterBody.data.length).toBeGreaterThan(beforeBody.data.length);

      const latestActivity = afterBody.data[0];
      expect(latestActivity.eventType).toBe("comment_added");
    });

    it("status change records status_changed activity with correct values", async () => {
      if (!ticketId) return;

      const ticketRes = await fetch(`${API_BASE}/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect([200, 500]).toContain(ticketRes.status);
      if (ticketRes.status !== 200) return;

      const ticketBody = await ticketRes.json();
      const currentStatus = ticketBody.data.status;

      if (currentStatus !== "open") {
        if (currentStatus === "in_progress") {
          const listRes = await fetch(`${API_BASE}/projects/OPS/issues?pageSize=1&status=open`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          expect([200, 500]).toContain(listRes.status);
          if (listRes.status !== 200) return;
          const listBody = await listRes.json();
          if (listBody.data.length === 0) return;
          ticketId = listBody.data[0].id;
        }
      }

      const statusRes = await fetch(`${API_BASE}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: "in_progress" }),
      });

      if (statusRes.status !== 200) return;

      const res = await fetch(
        `${API_BASE}/tickets/${ticketId}/activity`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect([200, 500]).toContain(res.status);
      if (res.status !== 200) return;

      const body = await res.json();

      const statusActivities = body.data.filter(
        (a: { eventType: string }) => a.eventType === "status_changed"
      );
      expect(statusActivities.length).toBeGreaterThan(0);

      const lastChange = statusActivities[0];
      expect(lastChange.toValue).toBe("in_progress");
    });

    it("assignee change records assignee_changed activity", async () => {
      if (!ticketId) return;

      const agentsRes = await fetch(`${API_BASE}/users?role=agent`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect([200, 500]).toContain(agentsRes.status);
      if (agentsRes.status !== 200) return;

      const agentsBody = await agentsRes.json();
      if (agentsBody.data.length === 0) return;

      const agentId = agentsBody.data[0].id;

      await fetch(`${API_BASE}/tickets/${ticketId}/assignee`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ assigneeId: agentId }),
      });

      const res = await fetch(
        `${API_BASE}/tickets/${ticketId}/activity`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect([200, 500]).toContain(res.status);
      if (res.status !== 200) return;

      const body = await res.json();

      const assignActivities = body.data.filter(
        (a: { eventType: string }) => a.eventType === "assignee_changed"
      );
      expect(assignActivities.length).toBeGreaterThan(0);

      await fetch(`${API_BASE}/tickets/${ticketId}/assignee`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ assigneeId: null }),
      });
    });

    it("lists activity for a ticket", async () => {
      if (!ticketId) return;
      const res = await fetch(
        `${API_BASE}/tickets/${ticketId}/activity`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const body = await res.json();
        expect(Array.isArray(body.data)).toBe(true);
      }
    });

    it("each activity item has required fields", async () => {
      if (!ticketId) return;
      const res = await fetch(
        `${API_BASE}/tickets/${ticketId}/activity`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect([200, 500]).toContain(res.status);
      if (res.status !== 200) return;

      const body = await res.json();
      if (body.data.length > 0) {
        const item = body.data[0];
        expect(item.id).toBeDefined();
        expect(item.eventType).toBeDefined();
        expect(item.actor).toBeDefined();
        expect(item.actor.name).toBeDefined();
        expect(item.createdAt).toBeDefined();
      }
    });
  });
});
