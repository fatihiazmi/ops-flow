import { describe, it, expect, beforeAll } from "vitest";

const API_BASE = "http://localhost:3000";

let adminToken: string;

describe("Protected Endpoints", () => {
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

  function expectUnauthorized(res: Response, body: unknown) {
    expect(res.status).toBe(401);
    const data = body as { error: { code: string } };
    expect(data.error.code).toBe("UNAUTHORIZED");
  }

  it("GET /tickets rejects missing token", async () => {
    const res = await fetch(`${API_BASE}/tickets`);
    const body = await res.json();
    expectUnauthorized(res, body);
  });

  it("POST /tickets rejects missing token", async () => {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "test" }),
    });
    const body = await res.json();
    expectUnauthorized(res, body);
  });

  it("GET /dashboard/metrics rejects missing token", async () => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`);
    const body = await res.json();
    expectUnauthorized(res, body);
  });

  it("GET /users rejects missing token", async () => {
    const res = await fetch(`${API_BASE}/users`);
    const body = await res.json();
    expectUnauthorized(res, body);
  });

  it("GET /tickets/:id rejects missing token", async () => {
    const res = await fetch(
      `${API_BASE}/tickets/00000000-0000-0000-0000-000000000000`
    );
    const body = await res.json();
    expectUnauthorized(res, body);
  });

  it("PATCH /tickets/:id/status rejects missing token", async () => {
    const res = await fetch(
      `${API_BASE}/tickets/00000000-0000-0000-0000-000000000000/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      }
    );
    const body = await res.json();
    expectUnauthorized(res, body);
  });

  it("rejects expired/invalid tokens", async () => {
    const res = await fetch(`${API_BASE}/tickets`, {
      headers: { Authorization: "Bearer expired_or_invalid_token_here" },
    });
    const body = await res.json();
    expect(res.status).toBe(401);
  });

  it("accepts valid token on protected endpoints", async () => {
    const res = await fetch(`${API_BASE}/tickets`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status).toBe(200);
  });
});
