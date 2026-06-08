import { describe, it, expect, beforeAll } from "vitest";

const API_BASE = "http://localhost:3000";

let adminToken: string;
let adminUser: { id: string; name: string; email: string; role: string };

describe("Auth API", () => {
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
    adminUser = body.data.user;
  });

  describe("POST /auth/login", () => {
    it("succeeds with valid credentials", async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@opsflow.local",
          password: "password123",
        }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.token).toBeDefined();
      expect(typeof body.data.token).toBe("string");
      expect(body.data.user.email).toBe("admin@opsflow.local");
      expect(body.data.user.role).toBe("admin");
      expect(body.data.user.id).toBeDefined();
      expect(body.data.user.name).toBeDefined();
    });

    it("fails with invalid credentials", async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@opsflow.local",
          password: "wrongpassword",
        }),
      });

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error.code).toBe("UNAUTHORIZED");
      expect(body.error.message).toBe("Invalid email or password");
    });

    it("fails with non-existent user", async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nobody@opsflow.local",
          password: "password123",
        }),
      });

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error.code).toBe("UNAUTHORIZED");
    });

    it("fails with invalid email format", async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "not-an-email",
          password: "password123",
        }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });

    it("fails with empty password", async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@opsflow.local",
          password: "",
        }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /auth/me", () => {
    it("rejects missing token", async () => {
      const res = await fetch(`${API_BASE}/auth/me`);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error.code).toBe("UNAUTHORIZED");
    });

    it("rejects invalid token", async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: "Bearer invalid-token-here" },
      });

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error.code).toBe("UNAUTHORIZED");
    });

    it("accepts valid token", async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.email).toBe("admin@opsflow.local");
      expect(body.data.id).toBe(adminUser.id);
    });
  });

  describe("Error response shape consistency", () => {
    it("unauthorized errors use consistent shape", async () => {
      const res = await fetch(`${API_BASE}/auth/me`);
      const body = await res.json();
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe("UNAUTHORIZED");
      expect(body.error.message).toBeDefined();
      expect(body.error.details).toBeDefined();
    });

    it("validation errors use consistent shape", async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "bad", password: "" }),
      });
      const body = await res.json();
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe("VALIDATION_ERROR");
      expect(body.error.message).toBeDefined();
      expect(body.error.details).toBeDefined();
    });
  });
});
