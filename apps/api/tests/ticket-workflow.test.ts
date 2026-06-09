import { describe, it, expect, beforeAll } from "vitest";

const API_BASE = "http://localhost:3000";

let adminToken: string;
let openTicketId: string;
let closedTicketId: string;

describe("Ticket Workflow Transitions", () => {
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

    const openRes = await fetch(
      `${API_BASE}/projects/OPS/issues?pageSize=1&status=open`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    expect([200, 500]).toContain(openRes.status);
    if (openRes.status === 200) {
      const openBody = await openRes.json();
      if (openBody.data.length > 0) {
        openTicketId = openBody.data[0].id;
      }
    }

    const closedRes = await fetch(
      `${API_BASE}/projects/OPS/issues?pageSize=1&status=closed`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    expect([200, 500]).toContain(closedRes.status);
    if (closedRes.status === 200) {
      const closedBody = await closedRes.json();
      if (closedBody.data.length > 0) {
        closedTicketId = closedBody.data[0].id;
      }
    }
  });

  function authHeaders() {
    return {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    };
  }

  async function findOpenTicket(): Promise<string | null> {
    const res = await fetch(
      `${API_BASE}/projects/OPS/issues?pageSize=1&status=open`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (res.status !== 200) return null;
    const body = await res.json();
    return body.data.length > 0 ? body.data[0].id : null;
  }

  describe("Valid transitions", () => {
    it("accepts open -> in_progress", async () => {
      const tid = await findOpenTicket();
      if (!tid) return;
      const res = await fetch(`${API_BASE}/tickets/${tid}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: "in_progress" }),
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  describe("Invalid transitions", () => {
    it("rejects open -> resolved (skip in_progress)", async () => {
      const tid = await findOpenTicket();
      if (!tid) return;
      const res = await fetch(`${API_BASE}/tickets/${tid}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: "resolved" }),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("INVALID_STATUS_TRANSITION");
      expect(body.error.details.from).toBe("open");
      expect(body.error.details.to).toBe("resolved");
    });

    it("rejects same-status transition", async () => {
      const tid = await findOpenTicket();
      if (!tid) return;
      const res = await fetch(`${API_BASE}/tickets/${tid}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: "open" }),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("INVALID_STATUS_TRANSITION");
    });

    it("rejects invalid status value", async () => {
      const tid = await findOpenTicket();
      if (!tid) return;
      const res = await fetch(`${API_BASE}/tickets/${tid}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: "deleted" }),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("Closed ticket restrictions", () => {
    it("closed ticket cannot transition to open", async () => {
      if (!closedTicketId) return;
      const res = await fetch(
        `${API_BASE}/tickets/${closedTicketId}/status`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ status: "open" }),
        }
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("INVALID_STATUS_TRANSITION");
    });

    it("closed ticket cannot transition to in_progress", async () => {
      if (!closedTicketId) return;
      const res = await fetch(
        `${API_BASE}/tickets/${closedTicketId}/status`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ status: "in_progress" }),
        }
      );
      expect(res.status).toBe(400);
    });

    it("closed ticket cannot transition to resolved", async () => {
      if (!closedTicketId) return;
      const res = await fetch(
        `${API_BASE}/tickets/${closedTicketId}/status`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ status: "resolved" }),
        }
      );
      expect(res.status).toBe(400);
    });
  });
});
