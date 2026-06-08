import { describe, it, expect, beforeAll } from "vitest";

const API_BASE = "http://localhost:3000";

let adminToken: string;
let ticketId: string;
let ticketStatus: string;

describe("Ticket Validation", () => {
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
      `${API_BASE}/tickets?pageSize=1&status=open`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const listBody = await listRes.json();
    if (listBody.data.length > 0) {
      ticketId = listBody.data[0].id;
      ticketStatus = listBody.data[0].status;
    }
  });

  function authHeaders() {
    return { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" };
  }

  describe("POST /tickets - validation", () => {
    it("rejects empty body", async () => {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects too-short title", async () => {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: "ab",
          description: "This is a valid description for testing.",
          priority: "low",
          category: "bug",
        }),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects invalid priority", async () => {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: "Valid Ticket Title",
          description: "This is a valid description for testing.",
          priority: "extreme",
          category: "bug",
        }),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects invalid category", async () => {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: "Valid Ticket Title",
          description: "This is a valid description for testing.",
          priority: "low",
          category: "invalid_category",
        }),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects too-short description", async () => {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: "Valid Ticket Title",
          description: "short",
          priority: "low",
          category: "bug",
        }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /tickets/:id/comments - validation", () => {
    it("rejects empty body", async () => {
      if (!ticketId) return;
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ body: "" }),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects body with no body field", async () => {
      if (!ticketId) return;
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });
  });
});
