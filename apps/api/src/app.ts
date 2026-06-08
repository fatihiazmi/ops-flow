import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { healthRoutes, readyRoutes } from "./routes/health.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { ticketRoutes } from "./modules/tickets/ticket.routes.js";
import { userRoutes } from "./modules/users/user.routes.js";

const app = new Hono();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(logger());

app.route("/health", healthRoutes);
app.route("/ready", readyRoutes);
app.route("/auth", authRoutes);
app.route("/tickets", ticketRoutes);
app.route("/users", userRoutes);

app.onError(errorMiddleware);

export { app };
