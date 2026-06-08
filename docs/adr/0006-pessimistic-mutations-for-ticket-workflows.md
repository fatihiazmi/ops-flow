# ADR 0006: Use Pessimistic Mutations for Ticket Workflow Actions

## Title

Use Pessimistic Mutations for Ticket Workflow Actions

## Context

Ticket creation, status changes, assignment, and comments are workflow records that require backend validation and activity logging.

## Options Considered

1. Optimistic updates
2. Pessimistic updates
3. Hybrid approach

## Decision

Use pessimistic updates by default for Phase 2 workflow mutations.

## Rationale

- Backend validation must succeed first
- Audit trail must be written consistently
- Avoids temporarily showing invalid workflow states
- Simpler error handling for interview project

## Consequences

### Positive

- Safer UI behavior
- Simpler rollback logic
- Consistent with transaction-based backend
- Easier to reason about

### Negative

- UI may feel slightly less instant
- Requires clear loading states
- May need later optimization if latency becomes noticeable

## Status

Accepted
