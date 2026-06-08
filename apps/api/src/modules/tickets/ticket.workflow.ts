import type { TicketStatus } from "@opsflow/shared";

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["resolved", "closed"],
  resolved: ["closed", "in_progress"],
  closed: [],
};

export function isValidStatusTransition(from: TicketStatus, to: TicketStatus): boolean {
  if (from === to) return false;
  return allowedTransitions[from].includes(to);
}

export function getValidNextStatuses(current: TicketStatus): TicketStatus[] {
  return allowedTransitions[current];
}
