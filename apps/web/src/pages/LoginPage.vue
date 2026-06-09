<template>
  <main class="login-page relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-100 dark:bg-slate-950">
    <!-- ============================================================
         Decorative background layer — aria-hidden, non-interactive
         ============================================================ -->
    <div aria-hidden="true" class="absolute inset-0 pointer-events-none">
      <!-- Radial glow behind the card -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(59,130,246,0.07),transparent_65%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(6,182,212,0.04),transparent_60%)]"></div>

      <!-- SVG circuit-line decoration (visible only in dark mode) -->
      <svg
        class="absolute inset-0 w-full h-full hidden dark:block opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Horizontal traces -->
        <line x1="0%" y1="22%" x2="100%" y2="22%" stroke="rgb(59,130,246)" stroke-width="1" />
        <line x1="8%" y1="48%" x2="42%" y2="48%" stroke="rgb(59,130,246)" stroke-width="1" />
        <line x1="55%" y1="48%" x2="100%" y2="48%" stroke="rgb(6,182,212)" stroke-width="1" />
        <line x1="0%" y1="78%" x2="100%" y2="78%" stroke="rgb(6,182,212)" stroke-width="1" />
        <!-- Vertical traces -->
        <line x1="22%" y1="0%" x2="22%" y2="22%" stroke="rgb(59,130,246)" stroke-width="1" />
        <line x1="48%" y1="48%" x2="48%" y2="22%" stroke="rgb(59,130,246)" stroke-width="1" />
        <line x1="48%" y1="48%" x2="48%" y2="100%" stroke="rgb(59,130,246)" stroke-width="1" />
        <line x1="78%" y1="78%" x2="78%" y2="100%" stroke="rgb(6,182,212)" stroke-width="1" />
        <!-- Circuit nodes -->
        <circle cx="22%" cy="22%" r="3" fill="rgb(59,130,246)" />
        <circle cx="42%" cy="48%" r="3" fill="rgb(59,130,246)" />
        <circle cx="55%" cy="48%" r="3" fill="rgb(6,182,212)" />
        <circle cx="48%" cy="22%" r="3" fill="rgb(59,130,246)" />
        <circle cx="48%" cy="78%" r="3" fill="rgb(6,182,212)" />
        <circle cx="78%" cy="78%" r="3" fill="rgb(6,182,212)" />
      </svg>
    </div>

    <!-- ============================================================
         Login card
         ============================================================ -->
    <div class="relative w-full max-w-[26rem] z-10">
      <!-- Glass card body -->
      <div
        class="bg-white dark:bg-slate-900/70 dark:backdrop-blur-xl
               border border-slate-200 dark:border-slate-700/50
               rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-blue-500/5
               px-6 py-8 sm:px-8"
      >
        <!-- Logo mark -->
        <div class="flex justify-center mb-6">
          <div
            class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10
                   border border-blue-200 dark:border-blue-500/20
                   flex items-center justify-center"
          >
            <!-- Shield + check icon representing secure operations -->
            <svg
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <!-- Heading -->
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white text-center mb-1">
          Welcome back
        </h1>
        <p class="text-sm text-gray-500 dark:text-slate-400 text-center mb-6">
          Sign in to manage service desk operations.
        </p>

        <!-- Error message (server / auth-store level) -->
        <div
          v-if="authStore.error"
          role="alert"
          class="mb-4 p-3 rounded-lg text-sm
                 bg-red-50 border border-red-200 text-red-700
                 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
        >
          {{ authStore.error }}
        </div>

        <!-- Login form -->
        <form @submit.prevent="handleLogin" novalidate class="space-y-4">
          <!-- Email field -->
          <div>
            <label for="login-email" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
              Email address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <!-- Envelope icon -->
                <svg
                  class="w-4 h-4 text-gray-400 dark:text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22 6l-10 7L2 6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <input
                id="login-email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                :aria-invalid="emailError ? 'true' : undefined"
                :aria-describedby="emailError ? 'login-email-error' : undefined"
                placeholder="admin@opsflow.local"
                class="w-full pl-10 pr-3 py-2.5
                       bg-gray-50 dark:bg-slate-800/50
                       border rounded-lg text-sm
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-slate-500
                       transition-colors
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                       dark:hover:border-slate-600"
                :class="emailError
                  ? 'border-red-400 dark:border-red-500/50'
                  : 'border-gray-300 dark:border-slate-700'"
              />
            </div>
            <p v-if="emailError" id="login-email-error" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {{ emailError }}
            </p>
          </div>

          <!-- Password field -->
          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <!-- Lock icon -->
                <svg
                  class="w-4 h-4 text-gray-400 dark:text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M7 11V7a5 5 0 0110 0v4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
              </div>
              <input
                id="login-password"
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                :aria-invalid="passwordError ? 'true' : undefined"
                :aria-describedby="passwordError ? 'login-password-error' : undefined"
                placeholder="••••••••••"
                class="w-full pl-10 pr-3 py-2.5
                       bg-gray-50 dark:bg-slate-800/50
                       border rounded-lg text-sm
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-slate-500
                       transition-colors
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                       dark:hover:border-slate-600"
                :class="passwordError
                  ? 'border-red-400 dark:border-red-500/50'
                  : 'border-gray-300 dark:border-slate-700'"
              />
            </div>
            <p v-if="passwordError" id="login-password-error" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {{ passwordError }}
            </p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full flex items-center justify-center gap-2 py-2.5 px-4
                   bg-blue-600 hover:bg-blue-500
                   text-white text-sm font-medium rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
                   focus:ring-offset-white dark:focus:ring-offset-slate-900
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
          >
            <!-- Spinner for loading state -->
            <svg
              v-if="authStore.loading"
              class="animate-spin w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ authStore.loading ? "Signing in..." : "Sign in" }}
          </button>
        </form>
      </div>

      <!-- ============================================================
           Demo accounts — interview-only quick-fill (not production)
           ============================================================ -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-400 dark:text-slate-500 mb-3">
          Demo accounts
        </p>
        <div class="flex gap-2 justify-center flex-wrap">
          <button
            v-for="demo in demoAccounts"
            :key="demo.role"
            @click="fillDemo(demo)"
            class="px-3 py-1.5 text-xs font-medium rounded-lg border
                   text-gray-500 dark:text-slate-400
                   border-gray-200 dark:border-slate-700/50
                   bg-gray-50 dark:bg-slate-800/30
                   hover:text-gray-700 dark:hover:text-slate-200
                   hover:border-gray-300 dark:hover:border-slate-600
                   hover:bg-gray-100 dark:hover:bg-slate-800/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30
                   transition-colors"
          >
            {{ demo.label }}
          </button>
        </div>
        <p class="mt-2 text-xs text-gray-400 dark:text-slate-600">
          Password: password123
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../app/stores/auth.store.js";

// ── State ──────────────────────────────────────────────────────────
const email = ref("");
const password = ref("");
const formSubmitted = ref(false);

const authStore = useAuthStore();
const router = useRouter();

// ── Validation ─────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailError = computed(() => {
  if (!formSubmitted.value) return "";
  const val = email.value.trim();
  if (!val) return "Email address is required.";
  if (!EMAIL_RE.test(val)) return "Enter a valid email address.";
  return "";
});

const passwordError = computed(() => {
  if (!formSubmitted.value) return "";
  if (!password.value) return "Password is required.";
  return "";
});

// ── Demo accounts ──────────────────────────────────────────────────
interface DemoAccount {
  role: string;
  label: string;
  email: string;
  password: string;
}

const demoAccounts: DemoAccount[] = [
  { role: "admin", label: "Admin", email: "admin@opsflow.local", password: "password123" },
  { role: "agent", label: "Agent", email: "agent@opsflow.local", password: "password123" },
  { role: "viewer", label: "Viewer", email: "viewer@opsflow.local", password: "password123" },
];

function fillDemo(demo: DemoAccount) {
  email.value = demo.email;
  password.value = demo.password;
  formSubmitted.value = false;
  // Clear any previous auth store error so the user sees clean state
  // (authStore.error is cleared on next login attempt anyway)
}

// ── Login handler ──────────────────────────────────────────────────
async function handleLogin() {
  formSubmitted.value = true;

  // Block if client-side validation fails
  if (emailError.value || passwordError.value) return;

  try {
    await authStore.loginUser(email.value.trim(), password.value);
    const redirect = router.currentRoute.value.query.redirect as string;
    router.push(redirect || "/tickets");
  } catch {
    // Error is surfaced via authStore.error in the template
  }
}
</script>
