import { ticketListQuerySchema } from "./ticket.schemas.js";
import { findManyTickets, findTicketById, countTickets } from "./ticket.repository.js";
import { AppError } from "../../utils/errors.js";
import { listSuccess, success } from "../../utils/api-response.js";

export async function listTickets(query: unknown) {
  const parsed = ticketListQuerySchema.safeParse(query);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid query parameters", 400);
  }

  const { page, pageSize, sortBy, sortDirection, ...filters } = parsed.data;
  const [data, total] = await Promise.all([
    findManyTickets(parsed.data),
    countTickets(filters),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  return listSuccess(data, { page, pageSize, total, totalPages });
}

export async function getTicketById(id: string) {
  const ticket = await findTicketById(id);
  if (!ticket) {
    throw new AppError("TICKET_NOT_FOUND", "Ticket not found", 404);
  }
  return success(ticket);
}
