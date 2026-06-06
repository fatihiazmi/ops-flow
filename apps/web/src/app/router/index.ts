import { createRouter, createWebHistory } from "vue-router";
import { setupAuthGuard } from "./guards.js";

const routes = [
  {
    path: "/login",
    component: () => import("../../pages/LoginPage.vue"),
    meta: { title: "Login", public: true },
  },
  {
    path: "/",
    component: () => import("../../components/layout/AppLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/tickets" },
      {
        path: "dashboard",
        component: () => import("../../pages/DashboardPage.vue"),
        meta: { title: "Dashboard" },
      },
      {
        path: "tickets",
        component: () => import("../../pages/TicketListPage.vue"),
        meta: { title: "Tickets" },
      },
      {
        path: "tickets/:id",
        component: () => import("../../pages/TicketDetailPage.vue"),
        meta: { title: "Ticket Detail" },
      },
      {
        path: "settings",
        component: () => import("../../pages/SettingsPage.vue"),
        meta: { title: "Settings" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../../pages/NotFoundPage.vue"),
    meta: { title: "Not Found" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — OpsFlow` : "OpsFlow";
});

setupAuthGuard(router);

export default router;
