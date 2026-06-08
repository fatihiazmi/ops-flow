# ADR 0008: Use One Aggregated Dashboard Metrics Endpoint

## Status

Accepted

## Context

The dashboard displays multiple operational panels (metric cards, status
distribution, priority distribution, SLA risk, recent activity) that are
loaded together as one view.

## Options Considered

1. **One aggregated endpoint** — single GET request returns all dashboard
   data. Avoids frontend waterfall.
2. **Multiple panel-specific endpoints** — GET /metrics, GET
   /status-distribution, GET /priority-distribution, etc. Independent
   loading, but more requests and frontend orchestration.
3. **Frontend computes metrics from ticket list API** — would require
   loading all tickets client-side, defeating server-side aggregation.

## Decision

Use one aggregated endpoint for Phase 3:

```
GET /dashboard/metrics
```

## Rationale

- Avoids frontend request waterfalls (N+1 problem for dashboard panels)
- Keeps dashboard data contract explicit
- Simpler frontend orchestration and error/loading handling
- Easier to cache the entire dashboard payload in Redis
- Appropriate for this project scale

## Response Shape

```json
{
  "data": {
    "totalOpen": 18,
    "totalInProgress": 9,
    "totalResolvedToday": 4,
    "totalCritical": 3,
    "totalOverdue": 6,
    "unassignedTickets": 5,
    "statusDistribution": [
      { "status": "open", "count": 18 }
    ],
    "priorityDistribution": [
      { "priority": "low", "count": 10 }
    ],
    "recentActivity": [...],
    "slaRiskTickets": [...]
  }
}
```

## Consequences

### Positive

- Fewer API calls (1 instead of 5+)
- Simpler loading/error handling on the frontend
- Easier Redis caching (one key for the whole dashboard)
- Clear dashboard contract

### Negative

- Endpoint can become broad over time as more panels are added
- Partial failure handling is less granular (all-or-nothing)
- Different panels cannot easily have different freshness policies
- If one query is slow, all panels wait

## Future Considerations

If panels diverge in freshness requirements or ownership, split into
multiple endpoints with independent caching strategies.
