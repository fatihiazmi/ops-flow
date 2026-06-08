import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useSettingsStore } from "../src/app/stores/settings.store.js";

const STORAGE_KEY = "opsflow:settings:v1";

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

function mockLocalStorageGetItem(returnValue: string | null) {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation((key: string) => {
    if (key === STORAGE_KEY) return returnValue;
    return null;
  });
}

describe("Settings Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    mockMatchMedia(false);
    vi.spyOn(Storage.prototype, "setItem");
  });

  it("has correct default values when no stored settings exist", () => {
    const store = useSettingsStore();

    expect(store.theme).toBe("system");
    expect(store.ticketTableDensity).toBe("comfortable");
    expect(store.defaultTicketPageSize).toBe(20);
    expect(store.showSuccessToasts).toBe(true);
    expect(store.showDashboardCacheBadge).toBe(true);
    expect(store.showSlaWarningBanners).toBe(true);
  });

  it("persists settings to localStorage", () => {
    const store = useSettingsStore();

    store.setTheme("dark");
    store.setTicketTableDensity("compact");
    store.setDefaultTicketPageSize(10);
    store.setShowSuccessToasts(false);

    const storedRaw = localStorage.getItem(STORAGE_KEY);
    expect(storedRaw).not.toBeNull();

    const stored = JSON.parse(storedRaw!);
    expect(stored.theme).toBe("dark");
    expect(stored.ticketTableDensity).toBe("compact");
    expect(stored.defaultTicketPageSize).toBe(10);
    expect(stored.showSuccessToasts).toBe(false);
  });

  it("hydrates from localStorage", () => {
    const saved = {
      theme: "light",
      ticketTableDensity: "compact",
      defaultTicketPageSize: 50,
      showSuccessToasts: false,
      showDashboardCacheBadge: false,
      showSlaWarningBanners: false,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    const store = useSettingsStore();

    expect(store.theme).toBe("light");
    expect(store.ticketTableDensity).toBe("compact");
    expect(store.defaultTicketPageSize).toBe(50);
    expect(store.showSuccessToasts).toBe(false);
    expect(store.showDashboardCacheBadge).toBe(false);
    expect(store.showSlaWarningBanners).toBe(false);
  });

  it("resetToDefaults reverts all values and persists", () => {
    const store = useSettingsStore();

    store.setTheme("dark");
    store.setTicketTableDensity("compact");
    store.setDefaultTicketPageSize(50);
    store.setShowSuccessToasts(false);

    store.resetToDefaults();

    expect(store.theme).toBe("system");
    expect(store.ticketTableDensity).toBe("comfortable");
    expect(store.defaultTicketPageSize).toBe(20);
    expect(store.showSuccessToasts).toBe(true);

    const storedRaw = localStorage.getItem(STORAGE_KEY);
    const stored = JSON.parse(storedRaw!);
    expect(stored.theme).toBe("system");
  });

  it("setTheme applies dark class to documentElement for dark theme", () => {
    const store = useSettingsStore();

    store.setTheme("dark");
    expect(
      document.documentElement.classList.contains("dark")
    ).toBe(true);

    store.setTheme("light");
    expect(
      document.documentElement.classList.contains("dark")
    ).toBe(false);
  });

  it("setTheme follows system preference when theme is system", () => {
    mockMatchMedia(true);

    const store = useSettingsStore();
    store.setTheme("system");

    expect(
      document.documentElement.classList.contains("dark")
    ).toBe(true);
  });

  it("handles corrupt localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json{{");

    const store = useSettingsStore();

    expect(store.theme).toBe("system");
    expect(store.defaultTicketPageSize).toBe(20);
  });

  it("setters persist after each change", () => {
    const store = useSettingsStore();
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    store.setTicketTableDensity("compact");
    expect(setItemSpy).toHaveBeenCalled();

    setItemSpy.mockClear();
    store.setDefaultTicketPageSize(10);
    expect(setItemSpy).toHaveBeenCalled();
  });

  it("maintains independent preference state", () => {
    const store = useSettingsStore();

    store.setShowSuccessToasts(false);
    expect(store.showSuccessToasts).toBe(false);
    expect(store.showDashboardCacheBadge).toBe(true);
    expect(store.showSlaWarningBanners).toBe(true);
  });
});
