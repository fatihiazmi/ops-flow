import { Hono } from "hono";
import {
  listTickets,
  getTicketById,
  createTicket,
  patchTicket,
  changeTicketStatus,
  changeTicketAssignee,
  getTicketComments,
  addTicketComment,
  getTicketActivity,
} from "./ticket.service.js";
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

ticketRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const user = c.get("user");
  const result = await createTicket(body, user);
  return c.json(result, 201);
});

ticketRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!UUID_REGEX.test(id)) {
    return c.json(errorResponse("VALIDATION_ERROR", "Invalid ticket ID format"), 400);
  }
  const result = await getTicketById(id);
  return c.json(result);
});

ticketRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  if (!UUID_REGEX.test(id)) {
    return c.json(errorResponse("VALIDATION_ERROR", "Invalid ticket ID format"), 400);
  }
  const body = await c.req.json();
  const user = c.get("user");
  const result = await patchTicket(id, body, user);
  return c.json(result);
});

ticketRoutes.patch("/:id/status", async (c) => {
  const id = c.req.param("id");
  if (!UUID_REGEX.test(id)) {
    return c.json(errorResponse("VALIDATION_ERROR", "Invalid ticket ID format"), 400);
  }
  const body = await c.req.json();
  const user = c.get("user");
  const result = await changeTicketStatus(id, body, user);
  return c.json(result);
});

ticketRoutes.patch("/:id/assignee", async (c) => {
  const id = c.req.param("id");
  if (!UUID_REGEX.test(id)) {
    return c.json(errorResponse("VALIDATION_ERROR", "Invalid ticket ID format"), 400);
  }
  const body = await c.req.json();
  const user = c.get("user");
  const result = await changeTicketAssignee(id, body, user);
  return c.json(result);
});

ticketRoutes.get("/:id/comments", async (c) => {
  const id = c.req.param("id");
  if (!UUID_REGEX.test(id)) {
    return c.json(errorResponse("VALIDATION_ERROR", "Invalid ticket ID format"), 400);
  }
  const result = await getTicketComments(id);
  return c.json(result);
});

ticketRoutes.post("/:id/comments", async (c) => {
  const id = c.req.param("id");
  if (!UUID_REGEX.test(id)) {
    return c.json(errorResponse("VALIDATION_ERROR", "Invalid ticket ID format"), 400);
  }
  const body = await c.req.json();
  const user = c.get("user");
  const result = await addTicketComment(id, body, user);
  return c.json(result, 201);
});

ticketRoutes.get("/:id/activity", async (c) => {
  const id = c.req.param("id");
  if (!UUID_REGEX.test(id)) {
    return c.json(errorResponse("VALIDATION_ERROR", "Invalid ticket ID format"), 400);
  }
  const result = await getTicketActivity(id);
  return c.json(result);
});

export { ticketRoutes };
