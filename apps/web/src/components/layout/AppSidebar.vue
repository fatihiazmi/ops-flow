<template>
  <nav
    class="app-sidebar flex flex-col h-full bg-slate-100 dark:bg-slate-950
                border-r border-slate-200 dark:border-slate-800
                w-60 flex-shrink-0"
    aria-label="Main navigation"
  >
    <!-- Logo / Brand -->
    <div class="flex-shrink-0 px-4 py-4 border-b border-slate-200 dark:border-slate-800">
      <router-link to="/tickets" class="flex items-center gap-3 group">
        <div
          class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20
                 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors"
        >
          <svg
            class="w-4 h-4 text-blue-400"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
                  stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 12l2 2 4-4"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">OpsFlow</span>
      </router-link>
    </div>

    <!-- Navigation sections -->
    <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      <!-- Workspace -->
      <div>
        <p class="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Workspace
        </p>
        <ul class="space-y-0.5">
          <li v-for="item in workspaceLinks" :key="item.to">
            <router-link
              v-if="!item.disabled"
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              :class="isActive(item.to)
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50'"
            >
              <component :is="item.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {{ item.label }}
            </router-link>
            <span
              v-else
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
              :class="'text-gray-400 dark:text-slate-600'"
              :title="item.disabledReason"
            >
              <component :is="item.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {{ item.label }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Operations -->
      <div>
        <p class="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Operations
        </p>
        <ul class="space-y-0.5">
          <li v-for="item in operationsLinks" :key="item.to">
            <router-link
              v-if="!item.disabled"
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              :class="isActive(item.to)
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50'"
            >
              <component :is="item.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {{ item.label }}
            </router-link>
            <span
              v-else
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
              :class="'text-gray-400 dark:text-slate-600'"
              :title="item.disabledReason"
            >
              <component :is="item.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {{ item.label }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Saved Views -->
      <div>
        <p class="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Saved Views
        </p>
        <ul class="space-y-0.5">
          <li v-for="item in savedViewLinks" :key="item.to">
            <router-link
              v-if="!item.disabled"
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              :class="isActive(item.to)
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50'"
            >
              <component :is="item.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {{ item.label }}
            </router-link>
            <span
              v-else
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
              :class="'text-gray-400 dark:text-slate-600'"
              :title="item.disabledReason"
            >
              <component :is="item.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {{ item.label }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Footer: user info -->
    <div class="flex-shrink-0 px-4 py-3 border-t border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <span class="text-xs font-semibold text-blue-400">
            {{ userInitials }}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium text-gray-900 dark:text-slate-200 truncate">
            {{ authStore.user?.name ?? "User" }}
          </p>
          <p class="text-[11px] text-gray-400 dark:text-slate-500 truncate">
            {{ authStore.user?.email ?? "" }}
          </p>
        </div>
        <button
          @click="handleLogout"
          class="flex-shrink-0 p-1.5 rounded-lg text-gray-400 dark:text-slate-500
                 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          aria-label="Log out"
          title="Log out"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 17l5-5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { h, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../app/stores/auth.store.js";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// ── Inline SVG icon components ─────────────────────────────────────
const iconDashboard = { render: () => h("svg", { class: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, [
  h("rect", { x: 3, y: 3, width: 7, height: 7, rx: 1, stroke: "currentColor", "stroke-width": "2" }),
  h("rect", { x: 14, y: 3, width: 7, height: 7, rx: 1, stroke: "currentColor", "stroke-width": "2" }),
  h("rect", { x: 3, y: 14, width: 7, height: 7, rx: 1, stroke: "currentColor", "stroke-width": "2" }),
  h("rect", { x: 14, y: 14, width: 7, height: 7, rx: 1, stroke: "currentColor", "stroke-width": "2" }),
])};
const iconTickets = { render: () => h("svg", { class: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, [
  h("path", { d: "M3 7h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z", stroke: "currentColor", "stroke-width": "2" }),
  h("path", { d: "M3 7l2-4h14l2 4", stroke: "currentColor", "stroke-width": "2" }),
  h("path", { d: "M9 12h6", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round" }),
])};
const iconSettings = { render: () => h("svg", { class: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, [
  h("path", { d: "M12 15a3 3 0 100-6 3 3 0 000 6z", stroke: "currentColor", "stroke-width": "2" }),
  h("path", { d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z", stroke: "currentColor", "stroke-width": "2" }),
])};
const iconCritical = { render: () => h("svg", { class: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, [
  h("path", { d: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", stroke: "currentColor", "stroke-width": "2", "stroke-linejoin": "round" }),
  h("path", { d: "M12 9v4M12 17h.01", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round" }),
])};

// ── Link definitions ───────────────────────────────────────────────
interface NavItem {
  to: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  disabled?: boolean;
  disabledReason?: string;
}

const workspaceLinks: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: iconDashboard },
  { to: "/tickets", label: "Tickets", icon: iconTickets },
];

const operationsLinks: NavItem[] = [
  { to: "/settings", label: "Settings", icon: iconSettings },
];

const savedViewLinks: NavItem[] = [
  { to: "/tickets?priority=critical", label: "Critical", icon: iconCritical },
];

// ── User initials ──────────────────────────────────────────────────
const userInitials = computed(() => {
  const name = authStore.user?.name ?? "";
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
});

// ── Active detection ────────────────────────────────────────────────
function isActive(to: string) {
  const [path, qs] = to.split("?");
  const currentPath = route.path;
  // For tickets?priority=critical, check both path and query
  if (qs) {
    const params = new URLSearchParams(qs);
    const priority = params.get("priority");
    return currentPath === path && route.query.priority === priority;
  }
  // For main nav items, exact match or starts-with for nested /tickets/:id
  if (path === "/tickets") return currentPath.startsWith("/tickets");
  if (path === "/dashboard") return currentPath === "/dashboard";
  return currentPath === path;
}

// ── Logout handler ─────────────────────────────────────────────────
function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>
