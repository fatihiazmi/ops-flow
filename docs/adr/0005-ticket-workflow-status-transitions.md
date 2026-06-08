# ADR 0005: Model Ticket Status as Explicit Workflow Transitions

## Title

Model Ticket Status as Explicit Workflow Transitions

## Context

Tickets move through a service-desk workflow. Allowing arbitrary status changes can create invalid process states.

## Options Considered

1. Allow any status to become any other status
2. Enforce explicit status transition rules in the backend
3. Store transitions as configurable database rules

## Decision

Enforce explicit status transition rules in backend code for Phase 2.

## Rationale

- Makes business workflow rules explicit
- Prevents invalid ticket states
- Keeps implementation simple for this project phase
- Frontend can guide users but backend remains source of truth

## Consequences

### Positive

- Safer workflow behavior
- Clearer business logic
- Easier interview explanation
- Better auditability

### Negative

- Workflow changes require code changes
- Less flexible than configurable workflow engine
- Additional validation logic required

## Status

Accepted
