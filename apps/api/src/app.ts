import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { healthRoutes, readyRoutes } from "./routes/health.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { ticketRoutes } from "./modules/tickets/ticket.routes.js";
import { projectRoutes } from "./modules/projects/project.routes.js";
import { epicRoutes } from "./modules/epics/epic.routes.js";
import { userRoutes } from "./modules/users/user.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import {
  listTickets,
  getTicketByIssueKey,
  createTicket,
} from "./modules/tickets/ticket.service.js";

const app = new Hono();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(logger());

app.route("/health", healthRoutes);
app.route("/ready", readyRoutes);
app.route("/auth", authRoutes);

// Project-scoped routes
app.route("/projects", projectRoutes);
app.route("/projects/:projectKey/epics", epicRoutes);

// Ticket routes (legacy)
app.route("/tickets", ticketRoutes);

// Project-scoped issue routes
const projectIssueRoutes = new Hono();
projectIssueRoutes.use(authMiddleware);

projectIssueRoutes.get("/", async (c) => {
  const projectKey = c.req.param("projectKey")!;
  const query = c.req.query();
  const result = await listTickets(query, projectKey);
  return c.json(result);
});

projectIssueRoutes.post("/", async (c) => {
  const projectKey = c.req.param("projectKey")!;
  const body = await c.req.json();
  const user = c.get("user");
  const result = await createTicket(body, user, projectKey);
  return c.json(result, 201);
});

projectIssueRoutes.get("/:issueKey", async (c) => {
  const projectKey = c.req.param("projectKey")!;
  const issueKey = c.req.param("issueKey")!;
  const result = await getTicketByIssueKey(projectKey, issueKey);
  return c.json(result);
});

app.route("/projects/:projectKey/issues", projectIssueRoutes);

app.route("/users", userRoutes);
app.route("/dashboard", dashboardRoutes);

app.onError(errorMiddleware);

export { app };