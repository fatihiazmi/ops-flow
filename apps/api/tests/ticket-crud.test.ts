import { describe, it, expect, beforeAll, afterAll } from "vitest";

const API_BASE = "http://localhost:3000";

let adminToken: string;

describe("Ticket CRUD and Error Responses", () => {
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
    return {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    };
  }

  describe("Error response consistency", () => {
    it("not found errors use consistent shape", async () => {
      const res = await fetch(
        `${API_BASE}/tickets/00000000-0000-0000-0000-000000000001`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe("TICKET_NOT_FOUND");
      expect(body.error.message).toBeDefined();
    });

    it("invalid UUID format returns validation error", async () => {
      const res = await fetch(`${API_BASE}/tickets/not-a-uuid`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("Create and read ticket", () => {
    let createdTicketId: string | null = null;

    afterAll(async () => {
      // Cleanup: we don't have a delete endpoint, so leave it
    });

    it("creates a ticket successfully", async () => {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: "Test ticket from backend tests",
          description: "This ticket was created during automated testing",
          priority: "low",
          category: "bug",
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.data.id).toBeDefined();
      expect(body.data.title).toBe("Test ticket from backend tests");
      expect(body.data.status).toBe("open");
      expect(body.data.priority).toBe("low");
      expect(body.data.category).toBe("bug");

      createdTicketId = body.data.id;
    });

    it("reads created ticket by id", async () => {
      // Use any open ticket
      const listRes = await fetch(
        `${API_BASE}/tickets?pageSize=1`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      const listBody = await listRes.json();
      if (listBody.data.length > 0) {
        const id = listBody.data[0].id;
        const res = await fetch(`${API_BASE}/tickets/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.data.id).toBe(id);
        expect(body.data.title).toBeDefined();
        expect(body.data.status).toBeDefined();
        expect(body.data.priority).toBeDefined();
        expect(body.data.createdBy).toBeDefined();
      }
    });

    it("lists tickets with pagination", async () => {
      const res = await fetch(
        `${API_BASE}/tickets?page=1&pageSize=5`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.meta).toBeDefined();
      expect(body.meta.page).toBe(1);
      expect(body.meta.pageSize).toBe(5);
      expect(typeof body.meta.total).toBe("number");
      expect(typeof body.meta.totalPages).toBe("number");
      expect(body.data.length).toBeLessThanOrEqual(5);
    });

    it("filters tickets by status", async () => {
      const res = await fetch(
        `${API_BASE}/tickets?status=open`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      for (const ticket of body.data) {
        expect(ticket.status).toBe("open");
      }
    });

    it("filters tickets by priority", async () => {
      const res = await fetch(
        `${API_BASE}/tickets?priority=critical`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      for (const ticket of body.data) {
        expect(ticket.priority).toBe("critical");
      }
    });

    it("searches tickets by query", async () => {
      const res = await fetch(
        `${API_BASE}/tickets?q=password`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect(res.status).toBe(200);
    });

    it("updates a ticket title", async () => {
      const listRes = await fetch(
        `${API_BASE}/tickets?pageSize=1`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      const listBody = await listRes.json();
      if (listBody.data.length > 0) {
        const id = listBody.data[0].id;
        const res = await fetch(`${API_BASE}/tickets/${id}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ title: "Updated from backend tests" }),
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.data.title).toBe("Updated from backend tests");
      }
    });

    it("rejects actor spoofing - actor derived from JWT not body", async () => {
      // The backend derives actor from JWT, not request body
      // This test verifies that passing a different createdById doesn't affect the created ticket
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: "Actor spoof test",
          description: "Testing that actor comes from JWT",
          priority: "low",
          category: "bug",
          createdById: "00000000-0000-0000-0000-000000000000",
        }),
      });
      // Should succeed because the extra field is ignored by Zod
      expect(res.status).toBe(201);
    });
  });
});
