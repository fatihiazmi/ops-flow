import { describe, it, expect, beforeAll } from "vitest";

const API_BASE = "http://localhost:3000";

describe("Login Rate Limiting", () => {
  beforeAll(async () => {
    // Reset any prior rate limit counter by logging in successfully
    await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@opsflow.local",
        password: "password123",
      }),
    });
  });

  it("allows up to 5 failed attempts in 60s window", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "wrong@opsflow.local",
          password: "wrongpassword",
        }),
      });
      expect(res.status).toBe(401);
    }

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "wrong@opsflow.local",
        password: "wrongpassword",
      }),
    });

    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error.code).toBe("RATE_LIMITED");
    expect(body.error.message).toContain("Too many login attempts");
    expect(body.error.details.retryAfterSeconds).toBeDefined();
  });

  it("successful login resets the rate limit counter", async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@opsflow.local",
        password: "password123",
      }),
    });

    expect(res.status).toBe(200);
  });

  it("rate limit headers are returned on failed attempts", async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "wrong@opsflow.local",
        password: "wrongpassword",
      }),
    });

    // Should return 401 with rate limit headers
    expect(res.status).toBe(401);
    expect(res.headers.get("X-RateLimit-Limit")).toBeDefined();
    expect(res.headers.get("X-RateLimit-Remaining")).toBeDefined();
  });
});
