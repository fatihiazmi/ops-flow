import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { env } from "./config/env.js";

const port = env.API_PORT;

console.log(`Starting OpsFlow API on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
