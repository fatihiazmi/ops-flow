# OpsFlow — Architecture Overview

> Service Desk Operations Dashboard · Interview Demo Project

---

## 1. Project Purpose

OpsFlow is a production-style Service Desk Operations Dashboard built to demonstrate
full-stack engineering skills. It covers authentication, CRUD, state machines,
dashboard metrics aggregation, caching, rate limiting, and audit logging — all
in a monorepo with modern TypeScript across frontend and backend.

This is an interview demo project, not a production service. It uses Docker Compose
for all infrastructure (PostgreSQL, Redis) and keeps auth simple (localStorage JWT).

### Tech Stack Summary

| Layer         | Technology                                       |
| ------------- | ------------------------------------------------ |
| Frontend      | Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS |
| Backend       | Hono (Node.js) + TypeScript + Zod + Drizzle ORM  |
| Database      | PostgreSQL 16                                    |
| Cache          | Redis 7                                          |
| Auth          | JWT (jose library), HS256, localStorage          |
| Shared Types  | `packages/shared` workspace package              |
| Monorepo      | pnpm workspaces                                  |
| Testing       | vitest (unit/integration) + Playwright (E2E)     |

---

## 2. System Context

```
Browser
  |
  v
Vue Router (history mode)
  |
  +-- LoginPage
  +-- AppLayout
        |
        +-- DashboardPage
        +-- TicketListPage
        +-- TicketDetailPage
        +-- SettingsPage
        |
        +-- Services (apiClient.ts)
              |  fetch() + localStorage token
              v
         Hono API (:3000)
              |
              +-- Auth Middleware (JWT verification)
              +-- Zod Validation (schemas)
              +-- Services (business logic)
              +-- Repositories (Drizzle queries)
              |
              +-----> PostgreSQL (tables)
              +-----> Redis (cache + rate limiting)
```

### Monorepo Layout

```
ops-flow/
  apps/
    api/          Hono backend
    web/          Vue 3 frontend
  packages/
    shared/       Shared TypeScript types (API shapes, enums, DTOs)
  pnpm-workspace.yaml
  docker-compose.yml   (PostgreSQL 16 + Redis 7)
```

---

## 3. Frontend Architecture

### Routing

Vue Router with history mode. Auth guard redirects unauthenticated users to `/login`.

```
/login           public, LoginPage
/                protected, AppLayout (wrapper)
  /dashboard     DashboardPage
  /tickets       TicketListPage (lists, filters, pagination)
  /tickets/:id   TicketDetailPage
  /settings      SettingsPage
/*               NotFoundPage (catch-all)
```

### State Ownership Model

| What                    | Where                          | Why                                     |
| ----------------------- | ------------------------------ | --------------------------------------- |
| Auth (user, token)      | Pinia `auth.store.ts`         | global; localStorage-backed; fetched on app init |
| Ticket list filters     | URL query params              | shareable/bookmarkable URLs; auto-refetch on query change |
| Dashboard metrics       | local component ref           | single-use data; no cross-component sharing |
| Form state (login, ticket create/edit) | local component ref | forms are isolated to a single view |
| Notification toasts     | Pinia `notification.store.ts` | app-wide trigger from any component |

### Key Patterns

- **Auth Store** (`apps/web/src/app/stores/auth.store.ts`): Composition API store. Reads token from `localStorage` on init, calls `GET /auth/me` to hydrate user. Sets `Authorization: Bearer <token>` header via the shared `apiClient`.
- **Ticket List Composable** (`apps/web/src/composables/useTicketList.ts`): Reads filters/sort/page from `route.query`, fetches tickets via `getTickets()`, exposes `updateQuery()` to push new query params. Uses a `watch` on `route.query` for auto-refetch.
- **API Client** (`apps/web/src/services/apiClient.ts`): Thin wrapper around `fetch()`. Reads token from `localStorage`, attaches `Authorization` header, parses error response shape into `ApiError` class.
- **Error/Loading/Empty States**: Each page or smart component manages its own `isLoading`, `error`, and empty-state flags derived from data arrays. No global loading overlay — component-level control.

---

## 4. Backend Architecture

### Framework

Hono running on Node.js (`@hono/node-server`). All routes, middleware, and error handling
use Hono's API (no Express). The adapters for Drizzle and Redis are initialized at
import time; Hono middleware simply attaches the verified JWT payload to the context.

### Route Registration

```
app.ts
  /health       -> healthRoutes     (public)
  /ready        -> readyRoutes      (public)
  /auth         -> authRoutes       (login/register/me)
  /tickets      -> ticketRoutes     (authMiddleware)
  /users        -> userRoutes       (authMiddleware)
  /dashboard    -> dashboardRoutes  (authMiddleware)
```

### Layered Architecture

Each module follows a consistent 4-layer pattern:

```
Routes  -->  Schemas (Zod)  -->  Services (business logic)  -->  Repositories (Drizzle)
   |                                                                       |
   |  parse body/query                                                     |  raw SQL
   |  extract JWT payload (c.get("user"))                                  |  Drizzle query builder
   |  call service                                                         |  transaction support
   v                                                                       v
  Response                                                              PostgreSQL
  (api-response.ts helpers)
```

#### Layer Responsibilities

- **Routes** (`*.routes.ts`): Parse request (body, query, params), extract JWT actor from context, delegate to service, return JSON.
- **Schemas** (`*.schemas.ts`): Zod schemas for request validation. `safeParse()` is used in all services — failures throw `AppError` with `VALIDATION_ERROR`.
- **Services** (`*.service.ts`): Business logic. Validates, checks existence, enforces state transitions, wraps multi-step operations in Drizzle transactions, inserts audit trail, invalidates caches.
- **Repositories** (`*.repository.ts`): Drizzle query functions. Accept optional transaction object (`tx`) to participate in service-level transactions.

### Transactions & Audit Logging

Every mutation (create ticket, change status, change assignee, add comment) runs inside
a `db.transaction()`. The same transaction handles both the data mutation and the
insertion of a corresponding `ticket_activity` row. This guarantees that the audit
trail is never out of sync with the data.

### Ticket State Machine

```
 open ──> in_progress ──> resolved ──> closed
  │                        │
  └──────> closed <────────┘
```

The `ticket.workflow.ts` module defines the `allowedTransitions` map.
`isValidStatusTransition(from, to)` is called in the service layer before any
status change. Statuses: `open`, `in_progress`, `resolved`, `closed`.

### Error Handling

Centralized in `error.middleware.ts`. Three error types:
- `AppError` (custom class): carries `code`, `message`, `status`, `details` — used for business errors.
- `HTTPException` (Hono built-in): mapped by status code to error codes.
- Unknown errors: wrapped as `INTERNAL_SERVER_ERROR`.

All errors return the consistent shape: `{ error: { code, message, details } }`.

---

## 5. Database Model

Four tables. All use UUID primary keys, timestamps, and foreign keys with
appropriate `ON DELETE` behavior.

```
users
  id              UUID PK
  name            VARCHAR(255) NOT NULL
  email           VARCHAR(255) NOT NULL UNIQUE
  password_hash   TEXT NOT NULL
  role            VARCHAR(50) NOT NULL DEFAULT 'viewer'
  created_at      TIMESTAMP NOT NULL
  updated_at      TIMESTAMP NOT NULL

tickets
  id              UUID PK
  title           VARCHAR(255) NOT NULL
  description     TEXT NOT NULL
  status          VARCHAR(50) NOT NULL DEFAULT 'open'
  priority        VARCHAR(50) NOT NULL DEFAULT 'medium'
  category        VARCHAR(50) NOT NULL DEFAULT 'other'
  assignee_id     UUID FK -> users.id (SET NULL on delete)
  created_by_id   UUID FK -> users.id (CASCADE on delete)
  due_at          TIMESTAMP
  created_at      TIMESTAMP NOT NULL
  updated_at      TIMESTAMP NOT NULL

  Indexes: status, priority, assignee_id, created_at, due_at

comments
  id              UUID PK
  ticket_id       UUID FK -> tickets.id (CASCADE)
  author_id       UUID FK -> users.id (CASCADE)
  body            TEXT NOT NULL
  created_at      TIMESTAMP NOT NULL
  updated_at      TIMESTAMP NOT NULL

  Indexes: ticket_id, author_id, created_at

ticket_activity
  id              UUID PK
  ticket_id       UUID FK -> tickets.id (CASCADE)
  actor_id        UUID FK -> users.id (CASCADE)
  event_type      VARCHAR(50) NOT NULL
  from_value      TEXT
  to_value        TEXT
  metadata        JSONB
  created_at      TIMESTAMP NOT NULL

  Indexes: ticket_id, actor_id, event_type, created_at
```

### Relationships

```
users 1──N tickets (assignee_id)
users 1──N tickets (created_by_id)
users 1──N comments (author_id)
users 1──N ticket_activity (actor_id)
tickets 1──N comments (ticket_id)
tickets 1──N ticket_activity (ticket_id)
```

---

## 6. Cache Usage

Redis is used for two purposes:

### Dashboard Metrics Cache

- **Key**: `dashboard:metrics:v1`
- **TTL**: 60 seconds
- **Pattern**: Read-through cache. On `GET /dashboard/metrics`, check Redis first.
  On cache miss, run 10 parallel DB queries via `Promise.all()`, store result as JSON.
- **Invalidation**: Every ticket mutation (create, update, status change, assignee change,
  comment added) calls `invalidateDashboardCache()` which deletes the key. Next request
  repopulates it fresh.

### Login Rate Limiting

- **Key pattern**: `rate-limit:login:<ip>`
- **Window**: 60 seconds, max 5 attempts
- **IP detection**: `x-forwarded-for` > `x-real-ip` > `127.0.0.1`
- **Response headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- **Graceful degradation**: If Redis is unavailable, rate limiting silently passes.

---

## 7. API Boundary

### REST Endpoints

| Method   | Path                          | Auth | Description               |
| -------- | ----------------------------- | ---- | ------------------------- |
| POST     | `/auth/login`                 | No   | Email + password login    |
| POST     | `/auth/register`              | No   | Create new user account   |
| GET      | `/auth/me`                    | Yes  | Get current user profile  |
| GET      | `/tickets`                    | Yes  | List tickets (filtered, paginated) |
| POST     | `/tickets`                    | Yes  | Create ticket             |
| GET      | `/tickets/:id`                | Yes  | Get ticket detail         |
| PATCH    | `/tickets/:id`                | Yes  | Update ticket fields      |
| PATCH    | `/tickets/:id/status`         | Yes  | Change ticket status      |
| PATCH    | `/tickets/:id/assignee`       | Yes  | Assign/unassign ticket    |
| GET      | `/tickets/:id/comments`       | Yes  | List ticket comments      |
| POST     | `/tickets/:id/comments`       | Yes  | Add comment to ticket     |
| GET      | `/tickets/:id/activity`       | Yes  | View ticket audit trail   |
| GET      | `/dashboard/metrics`          | Yes  | Aggregated dashboard data |
| GET      | `/users`                      | Yes  | List users (for assignee picker) |
| GET      | `/health`                     | No   | Liveness probe            |
| GET      | `/ready`                      | No   | Readiness probe (DB + Redis check) |

### Response Shapes

**Success (single):**
```json
{ "data": { ... } }
```

**Success (list):**
```json
{ "data": [ ... ], "meta": { "page": 1, "pageSize": 20, "total": 100, "totalPages": 5 } }
```

**Error:**
```json
{ "error": { "code": "TICKET_NOT_FOUND", "message": "Ticket not found", "details": {} } }
```

Error codes used: `VALIDATION_ERROR`, `UNAUTHORIZED`, `TICKET_NOT_FOUND`, `USER_NOT_FOUND`,
`INVALID_STATUS_TRANSITION`, `RATE_LIMITED`, `INTENAL_SERVER_ERROR`.

### Auth

All protected routes use `authMiddleware` which extracts `Bearer <token>` from
`Authorization` header, verifies it with jose (`HS256`, `clockTolerance: 60`),
and attaches the payload to `c.set("user", payload)`. The JWT payload contains
`{ sub, email, role }`.

---

## 8. Auth Approach

- **Token format**: JWT with HS256 signing using the `jose` library.
- **Expiry**: 1 day (`setExpirationTime("1d")`).
- **Storage**: Frontend stores token in `localStorage` under key `opsflow_token`.
- **Actor derivation**: Backend middleware decodes the JWT and attaches it to
  the Hono context. All services read the actor from `user.sub`.
- **Security note**: localStorage is chosen intentionally for demo simplicity.
  A production system would use httpOnly cookies with CSRF protection.

---

## 9. Dashboard Metrics Flow

The dashboard uses a single aggregated endpoint rather than multiple API calls:

```
GET /dashboard/metrics
  |
  +-- Cache hit? --> return cached JSON
  |
  +-- Cache miss:
       |
       Promise.all([
         countByStatus("open"),
         countByStatus("in_progress"),
         countResolvedToday(),
         countCriticalActive(),
         countOverdue(),
         countUnassigned(),
         getStatusDistribution(),       // GROUP BY status
         getPriorityDistribution(),      // GROUP BY priority
         getRecentActivity(),            // JOIN users, tickets, activity — LIMIT 10
         getSlaRiskTickets(),            // due within 24h, non-closed
       ])
       |
       +-- Cache result (60s TTL)
       +-- Return metrics object
```

Cache is invalidated after every mutation (ticket create, update, status change,
assignee change, comment add) via `invalidateDashboardCache()`.

---

## 10. Testing Approach

Risk-based testing strategy: prioritize auth, validation, workflows, and the
dashboard — the areas where bugs have highest impact.

### Backend — vitest (58 tests across 8 files)

| File                          | Focus                           | Tests |
| ----------------------------- | ------------------------------- | ----- |
| `auth.test.ts`                | Login/register flows, JWT       | 14    |
| `ticket-crud.test.ts`         | Create/read/update tickets      | 13    |
| `ticket-workflow.test.ts`     | Status transitions, state machine | 11  |
| `comments-activity.test.ts`   | Comments and audit trail        | 11    |
| `ticket-validation.test.ts`  | Zod schema validation, edge cases | 10  |
| `protected.test.ts`           | Auth middleware on all routes   | 9     |
| `dashboard.test.ts`           | Metrics aggregation, caching    | 6     |
| `rate-limit.test.ts`          | Login rate limiting             | 4     |

**Total: ~58 tests**

### Frontend — vitest (19 tests across 3 files)

| File                          | Focus                           | Tests |
| ----------------------------- | ------------------------------- | ----- |
| `auth-store.test.ts`          | Login/logout/init flows         | 8     |
| `status-control.test.ts`      | Status dropdown logic           | 11    |
| `dashboard.test.ts`           | Dashboard component rendering   | 5     |

**Total: ~19 tests**

### E2E — Playwright (9 tests, 1 spec file)

| File                          | Focus                           | Tests |
| ----------------------------- | ------------------------------- | ----- |
| `happy-path.spec.ts`          | Login, create ticket, navigate, update status, logout | 9 |

**Total: 9 E2E tests**

### Running Tests

```bash
pnpm --filter api test          # Backend unit/integration tests
pnpm --filter web test          # Frontend vitest tests
pnpm --filter web test:e2e      # Playwright E2E (needs running app)
```
