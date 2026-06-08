import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../src/app/stores/auth.store.js";

vi.mock("../src/services/authService.js", () => ({
  login: vi.fn(),
  getMe: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { login, getMe } from "../src/services/authService.js";

const mockLogin = vi.mocked(login);
const mockGetMe = vi.mocked(getMe);

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("loginUser updates user and token on success", async () => {
    mockLogin.mockResolvedValue({
      token: "test-token-123",
      user: {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
      },
    });

    const store = useAuthStore();
    await store.loginUser("test@example.com", "password");

    expect(store.token).toBe("test-token-123");
    expect(store.user).toEqual({
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    });
    expect(store.isAuthenticated).toBe(true);
    expect(localStorage.getItem("opsflow_token")).toBe("test-token-123");
  });

  it("loginUser sets error on failure", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    const store = useAuthStore();
    try {
      await store.loginUser("test@example.com", "wrong");
    } catch {
      // expected
    }

    expect(store.error).toBe("Invalid credentials");
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it("logout clears user and token", async () => {
    mockLogin.mockResolvedValue({
      token: "test-token-456",
      user: {
        id: "user-2",
        name: "User Two",
        email: "two@example.com",
        role: "agent",
      },
    });

    const store = useAuthStore();
    await store.loginUser("two@example.com", "password");

    store.logout();

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem("opsflow_token")).toBeNull();
  });

  it("initializeAuthFromStorage reads token from localStorage and fetches user", async () => {
    localStorage.setItem("opsflow_token", "stored-token");
    mockGetMe.mockResolvedValue({
      id: "user-3",
      name: "Stored User",
      email: "stored@example.com",
      role: "viewer",
    });

    const store = useAuthStore();
    expect(store.token).toBe("stored-token");

    await store.initializeAuthFromStorage();
    expect(store.user).toEqual({
      id: "user-3",
      name: "Stored User",
      email: "stored@example.com",
      role: "viewer",
    });
    expect(store.isAuthenticated).toBe(true);
  });

  it("initializeAuthFromStorage calls logout if getMe fails", async () => {
    localStorage.setItem("opsflow_token", "expired-token");
    mockGetMe.mockRejectedValue(new Error("Token expired"));

    const store = useAuthStore();
    await store.initializeAuthFromStorage();

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem("opsflow_token")).toBeNull();
  });

  it("is not authenticated when token exists but user is null", () => {
    localStorage.setItem("opsflow_token", "token-only");
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
  });

  it("is not authenticated when user exists but token is null", async () => {
    mockGetMe.mockResolvedValue({
      id: "user-4",
      name: "No Token",
      email: "no@example.com",
      role: "viewer",
    });

    // Manually set user without token (edge case)
    const store = useAuthStore();
    store.$patch({ user: { id: "user-4", name: "No Token", email: "no@example.com", role: "viewer" } });
    expect(store.isAuthenticated).toBe(false);
  });
});
