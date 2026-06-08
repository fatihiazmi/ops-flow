# ADR 0007: Use Redis to Cache Dashboard Metrics

## Status

Accepted

## Context

The dashboard displays derived operational metrics such as open tickets,
overdue tickets, priority distribution, SLA risk, and recent activity.
These are read-heavy and can be recomputed from PostgreSQL, but repeated
aggregation can become wasteful on every page load.

## Options Considered

1. **Query PostgreSQL every time** — simplest, but puts unnecessary
   aggregation load on the database for read-heavy dashboard views.
2. **Cache dashboard metrics in Redis with short TTL** — reduces
   repeated aggregation, tolerable staleness, bounded complexity.
3. **Precompute metrics into database summary tables** — more
   sophisticated but adds schema complexity and refresh orchestration.
4. **Compute metrics entirely on the frontend from ticket list data** —
   would require loading all tickets and defeats server-side
   aggregation benefits.

## Decision

Cache dashboard metrics in Redis for 60 seconds using key
`dashboard:metrics:v1`.

## Rationale

- Dashboard metrics are derived data; short staleness is acceptable.
- Redis reduces repeated aggregation work on PostgreSQL.
- PostgreSQL remains the source of truth.
- Simpler than summary tables for this phase.
- Clear cache hit/miss observability via console logs.

## Cache Invalidation

The cache is invalidated after any mutation that could affect dashboard
metrics:

- POST /tickets (create ticket)
- PATCH /tickets/:id (update ticket fields)
- PATCH /tickets/:id/status (change status)
- PATCH /tickets/:id/assignee (reassign ticket)
- POST /tickets/:id/comments (add comment — affects recent activity)

Invalidation happens after successful transaction commit. If cache
invalidation fails, the mutation still succeeds and the failure is
logged. This ensures cache issues do not block write operations.

## Cache Key and TTL

- **Key**: `dashboard:metrics:v1`
- **TTL**: 60 seconds
- **Version**: v1 (for future cache key versioning)

## Consequences

### Positive

- Faster repeated dashboard loads (cache hits return in ~1ms vs ~50-100ms)
- Reduced database aggregation load
- Clear performance trade-off story for interview discussion
- Bounded use of Redis (single key, not a second database)

### Negative

- Cache invalidation complexity (must remember to invalidate after every mutation)
- Dashboard may be stale for up to 60 seconds if invalidation fails
- Additional dependency in the read path
- Need logging to understand cache hit/miss behavior
