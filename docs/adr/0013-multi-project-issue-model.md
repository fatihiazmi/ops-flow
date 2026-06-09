# ADR 0013: Introduce Project and Optional Epic Around Issues

**Status**: Accepted
**Date**: 2026-06-09

## Context

OpsFlow started as a single service desk ticket queue. All tickets were ungrouped and
unscoped. The product is evolving toward multi-project issue tracking that supports
multiple operational contexts.

## Decision

Introduce Project and Epic as domain entities around the existing Ticket/Issue concept:

- **Project** is the required ownership and key namespace boundary
- **Epic** is an optional planning container
- **Issue** is the executable work item

Domain hierarchy:

```
Project (required)
  ├── Epic (optional)
  │     ├── Issue
  │     └── Issue
  └── Issue without epic
```

## Rationale

- Supports multiple projects within a single OpsFlow instance
- Issue keys become meaningful per project (e.g., OPS-101, MRKT-310)
- Epics group work without forcing all issues into epics
- Preserves flexibility for small standalone issues
- Aligns with common issue tracking mental models (Jira-like)
- Better interview story around domain modeling

## Consequences

### Positive
- Clearer domain model with explicit ownership boundaries
- Supports project switching in the UI
- Enables epic-based planning and filtering
- Project-scoped issue key namespace makes keys readable
- Foundation for future features (roadmaps, boards, etc.)

### Negative
- More complex route structure (`/projects/:key/issues`)
- More complex database queries with project scoping
- Migration required to backfill existing data
- Backend terminology still uses "tickets" internally (table name, modules)
- Dashboard/cache not yet project-scoped (uses global metrics)

## Technical Decisions

### Backend table naming
The backend table is still named `tickets` (not `issues`) to avoid a risky,
big-bang rename. The UI uses "Issues" terminology. This is a documented trade-off
that may be addressed in a future migration.

### Issue key format
Format: `PROJECTKEY-NUMBER` (e.g., OPS-101). Keys are unique across all projects.
Numbers are assigned sequentially per project using `getNextIssueNumber()` within a
transaction.

### Route structure
- `/projects/:projectKey/issues` — project-scoped issue list
- `/projects/:projectKey/issues/:issueKey` — issue detail
- Legacy `/tickets` routes remain for backward compatibility

### API shape
- Project context in URL path, not query param
- Issue identity uses `issueKey` (not UUID) in project-scoped routes
- Legacy mutation endpoints (`PATCH /tickets/:id/status`) still work via UUID

## Migration Strategy

1. Created `projects` and `epics` tables
2. Added `project_id`, `epic_id`, `issue_number`, `issue_key`, `issue_type` to `tickets`
3. Seed: 3 projects (OPS, MRKT, MOB), 6 epics, 45 issues across projects
4. No backfill of existing data needed (seed recreates from scratch)

## Known Limitations

- Dashboard metrics are global, not project-scoped
- No epic creation API (epics are seeded/static for now)
- Issue counter is not fully concurrency-safe (adequate for demo)
- Backend table/module still uses "tickets" naming internally
- No project-level permissions or lead-based restrictions
