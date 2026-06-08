import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { nextTick } from "vue";
import SettingsPage from "../src/pages/SettingsPage.vue";
import { useAuthStore } from "../src/app/stores/auth.store.js";

const mockRouterPush = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

vi.mock("../src/services/authService.js", () => ({
  login: vi.fn(),
  getMe: vi.fn(),
}));

vi.mock("../src/services/systemService.js", () => ({
  getHealth: vi.fn(),
}));

import { getHealth } from "../src/services/systemService.js";
const mockGetHealth = vi.mocked(getHealth);

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("SettingsPage", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    mockMatchMedia(false);
  });

  it("renders the heading", () => {
    const wrapper = mount(SettingsPage);

    expect(wrapper.find("h1").text()).toBe("Settings");
  });

  it("displays current user info when authenticated", async () => {
    const authStore = useAuthStore();
    authStore.$patch({
      token: "fake-token",
      user: {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
      },
    });

    const wrapper = mount(SettingsPage);
    await nextTick();

    expect(wrapper.text()).toContain("Test User");
    expect(wrapper.text()).toContain("test@example.com");
    expect(wrapper.text()).toContain("admin");
  });

  it("shows API health status on button click", async () => {
    mockGetHealth.mockResolvedValue({
      status: "ok",
      service: "opsflow-api",
    });

    const wrapper = mount(SettingsPage);

    const buttons = wrapper.findAll("button");
    const healthButton = buttons.find(
      (b) => b.text() === "Check API Health"
    );
    expect(healthButton).toBeTruthy();
    await healthButton!.trigger("click");
    await nextTick();
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("opsflow-api");
    });
  });

  it("shows health check error when API fails", async () => {
    mockGetHealth.mockRejectedValue(new Error("Network error"));

    const wrapper = mount(SettingsPage);

    const buttons = wrapper.findAll("button");
    const healthButton = buttons.find(
      (b) => b.text() === "Check API Health"
    );
    await healthButton!.trigger("click");
    await nextTick();
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Network error");
    });
  });

  it("has semantic sections with headings", () => {
    const wrapper = mount(SettingsPage);

    const sections = wrapper.findAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(5);

    expect(wrapper.text()).toContain("Appearance");
    expect(wrapper.text()).toContain("Ticket List Preferences");
    expect(wrapper.text()).toContain("Notifications");
    expect(wrapper.text()).toContain("Account");
    expect(wrapper.text()).toContain("System");
    expect(wrapper.text()).toContain("Reset");
  });

  it("shows only one h1 heading", () => {
    const wrapper = mount(SettingsPage);

    const h1s = wrapper.findAll("h1");
    expect(h1s.length).toBe(1);
  });

  it("displays environment and API base URL", () => {
    const wrapper = mount(SettingsPage);

    expect(wrapper.text()).toContain("Environment:");
    expect(wrapper.text()).toContain("API Base URL:");
  });
});
