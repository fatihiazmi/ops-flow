# ADR 0009: Use Risk-Based Testing for Phase 4 Quality Gate

## Status

Accepted

## Context

OpsFlow now spans infrastructure (Docker, PostgreSQL, Redis), read flows
(ticket listing, dashboard metrics), write workflows (ticket create,
status transitions, assignment, comments), dashboard aggregation with
caching, and activity logging. Phase 4 introduces a quality gate before
the project is considered interview-ready. Tests must be defensible in an
interview setting without requiring exhaustive coverage of every UI
interaction or edge case.

## Options Considered

1. **No automated tests** — relies entirely on manual verification.
   Fastest to "complete" but offers no regression protection and is
   difficult to defend in an interview.
2. **Exhaustive coverage** — unit, integration, and E2E tests covering
   every endpoint, every UI state, every edge case. High confidence but
   requires significant maintenance and feels disproportionate for a demo
   project.
3. **Risk-based testing** — targeted tests focused on high-risk and
   high-value behavior: authentication, protected endpoints, data
   validation, workflow state transitions, activity logging, dashboard
   metric correctness, and critical user journeys.

## Decision

Use risk-based testing for the Phase 4 quality gate. Focus test effort
on the following areas, ordered by risk impact:

1. **Authentication & authorization** — verify JWT issuance, protected
   endpoint guards, and role-appropriate access.
2. **Protected endpoints** — confirm that unauthenticated requests
   receive 401 and that mutation endpoints enforce ownership or role
   checks.
3. **Data validation** — test required fields, enum values, field length
   limits, and meaningful error responses.
4. **Workflow status transitions** — verify that valid transitions
   (open → in-progress → resolved) succeed and invalid transitions
   (resolved → open, skipping states) are rejected.
5. **Activity logging** — confirm that ticket creation, status changes,
   assignment changes, and comment creation produce correct activity log
   entries.
6. **Dashboard metrics** — verify that metric counts (open, in-progress,
   critical, overdue, unassigned) match actual ticket state and reflect
   mutations.
7. **Critical user journeys** — end-to-end walkthrough of the primary
   flows: create a ticket, assign it, move it through statuses, add
   comments, and verify it appears correctly on the dashboard.

## Rationale

- Focuses test effort on behavior where failures have the highest
  interview impact (auth bypass, broken workflows, incorrect metrics).
- Provides meaningful confidence in the system without the maintenance
  burden of exhaustive coverage.
- Demonstrates professional judgment: the ability to prioritize testing
  based on risk is a valuable engineering signal in interviews.
- Tests serve as executable documentation of expected system behavior.
- The targeted scope is achievable within Phase 4 time constraints.

## Consequences

### Positive

- Practical test suite that can be written and maintained quickly.
- High-value coverage: every test justifies its existence by the risk
  it mitigates.
- Easy to explain in an interview: each test area maps to a clear
  business or security concern.
- Regression protection for the most critical paths.
- Tests double as API and workflow documentation for reviewers.

### Negative

- Not exhaustive: some UI rendering edge cases and form interactions
  remain manual-only.
- Some UI edge cases (empty states, error boundaries, loading spinners)
  are not covered by automated tests.
- E2E tests require stable seed data and a running infrastructure stack,
  adding CI complexity.
- Coverage percentages alone do not tell the full story; the team must
  communicate the risk-based rationale rather than pointing to a number.

## Future Considerations

If the project evolves beyond a demo, expand test coverage into UI
component tests, performance regression tests, and broader E2E
scenarios. Adopt a coverage threshold once the risk-based baseline is
established.
