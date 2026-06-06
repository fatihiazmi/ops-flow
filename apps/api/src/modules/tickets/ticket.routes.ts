import { Hono } from "hono";
import { listTickets, getTicketById } from "./ticket.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { errorResponse } from "../../utils/api-response.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ticketRoutes = new Hono();

ticketRoutes.use(authMiddleware);

ticketRoutes.get("/", async (c) => {
  const query = c.req.query();
  const result = await listTickets(query);
  return c.json(result);
});

ticketRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!UUID_REGEX.test(id)) {
    return c.json(
      errorResponse("VALIDATION_ERROR", "Invalid ticket ID format"),
      400
    );
  }
  const result = await getTicketById(id);
  return c.json(result);
});

export { ticketRoutes };
