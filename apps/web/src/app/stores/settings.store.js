import { defineStore } from "pinia";
import { ref, watch } from "vue";
const STORAGE_KEY = "opsflow:settings:v1";
function getDefaults() {
    return {
        theme: "system",
        ticketTableDensity: "comfortable",
        defaultTicketPageSize: 20,
        showSuccessToasts: true,
        showDashboardCacheBadge: true,
        showSlaWarningBanners: true,
    };
}
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return getDefaults();
        const parsed = JSON.parse(raw);
        const defaults = getDefaults();
        return { ...defaults, ...parsed };
    }
    catch {
        return getDefaults();
    }
}
function applyThemeClass(theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    }
    else if (theme === "light") {
        document.documentElement.classList.remove("dark");
    }
    else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
    }
}
function readThemeFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return "system";
        const parsed = JSON.parse(raw);
        return parsed.theme || "system";
    }
    catch {
        return "system";
    }
}
export function applyInitialTheme() {
    applyThemeClass(readThemeFromStorage());
}
let systemThemeQuery = null;
function watchSystemTheme(store) {
    if (systemThemeQuery) {
        systemThemeQuery.removeEventListener("change", () => { });
    }
    systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemThemeQuery.addEventListener("change", () => {
        if (store.theme === "system") {
            applyThemeClass("system");
        }
    });
}
export const useSettingsStore = defineStore("settings", () => {
    const stored = loadFromStorage();
    const theme = ref(stored.theme);
    const ticketTableDensity = ref(stored.ticketTableDensity);
    const defaultTicketPageSize = ref(stored.defaultTicketPageSize);
    const showSuccessToasts = ref(stored.showSuccessToasts);
    const showDashboardCacheBadge = ref(stored.showDashboardCacheBadge);
    const showSlaWarningBanners = ref(stored.showSlaWarningBanners);
    function persist() {
        const payload = {
            theme: theme.value,
            ticketTableDensity: ticketTableDensity.value,
            defaultTicketPageSize: defaultTicketPageSize.value,
            showSuccessToasts: showSuccessToasts.value,
            showDashboardCacheBadge: showDashboardCacheBadge.value,
            showSlaWarningBanners: showSlaWarningBanners.value,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    function hydrateFromStorage() {
        const data = loadFromStorage();
        theme.value = data.theme;
        ticketTableDensity.value = data.ticketTableDensity;
        defaultTicketPageSize.value = data.defaultTicketPageSize;
        showSuccessToasts.value = data.showSuccessToasts;
        showDashboardCacheBadge.value = data.showDashboardCacheBadge;
        showSlaWarningBanners.value = data.showSlaWarningBanners;
    }
    function resetToDefaults() {
        const defaults = getDefaults();
        theme.value = defaults.theme;
        ticketTableDensity.value = defaults.ticketTableDensity;
        defaultTicketPageSize.value = defaults.defaultTicketPageSize;
        showSuccessToasts.value = defaults.showSuccessToasts;
        showDashboardCacheBadge.value = defaults.showDashboardCacheBadge;
        showSlaWarningBanners.value = defaults.showSlaWarningBanners;
        persist();
        applyThemeClass(theme.value);
    }
    function setTheme(newTheme) {
        theme.value = newTheme;
        applyThemeClass(newTheme);
        persist();
    }
    function setTicketTableDensity(density) {
        ticketTableDensity.value = density;
        persist();
    }
    function setDefaultTicketPageSize(pageSize) {
        defaultTicketPageSize.value = pageSize;
        persist();
    }
    function setShowSuccessToasts(enabled) {
        showSuccessToasts.value = enabled;
        persist();
    }
    function setShowDashboardCacheBadge(enabled) {
        showDashboardCacheBadge.value = enabled;
        persist();
    }
    function setShowSlaWarningBanners(enabled) {
        showSlaWarningBanners.value = enabled;
        persist();
    }
    watch(theme, (newTheme) => {
        applyThemeClass(newTheme);
        if (newTheme === "system") {
            watchSystemTheme(useSettingsStore());
        }
    });
    if (theme.value === "system") {
        watchSystemTheme(useSettingsStore());
    }
    return {
        theme,
        ticketTableDensity,
        defaultTicketPageSize,
        showSuccessToasts,
        showDashboardCacheBadge,
        showSlaWarningBanners,
        hydrateFromStorage,
        persist,
        resetToDefaults,
        setTheme,
        setTicketTableDensity,
        setDefaultTicketPageSize,
        setShowSuccessToasts,
        setShowDashboardCacheBadge,
        setShowSlaWarningBanners,
    };
});
//# sourceMappingURL=settings.store.js.map