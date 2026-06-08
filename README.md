# OpsFlow

A production-style Service Desk Operations Dashboard.

## Phase 0: Infrastructure Foundation

This phase establishes a reproducible local full-stack development environment using Docker and Docker Compose.

## Phase 1: Domain Foundation + Read-Only Ticket Flow

Phase 1 builds the first real vertical slice of OpsFlow. A user can run the full stack locally, log in with a seeded user, view a paginated list of tickets, filter/search by URL query parameters, and open a ticket detail page.

## Phase 2: Ticket Workflow + Command Side

Phase 2 turns OpsFlow from a read-only dashboard into a real workflow application. A logged-in user can create tickets, update status, assign/unassign tickets, add comments, and view an activity timeline.

### Phase 2 Scope
- Create ticket
- Update ticket status
- Assign/unassign ticket
- Add/view comments
- View activity history
- Fetch users for assignee dropdown
- Record activity events for important workflow actions

## Phase 3: Operational Dashboard + Performance Layer

Phase 3 adds operational visibility with a real dashboard, backend aggregation,
Redis caching, SLA/overdue indicators, recent activity, debounced search, and
improved loading UX.

### Phase 3 Scope
- Dashboard metrics endpoint (`GET /dashboard/metrics`)
- Redis caching for dashboard metrics (key: `dashboard:metrics:v1`, TTL: 60s)
- Cache invalidation after ticket workflow mutations
- Real dashboard page with metric cards, distributions, SLA risk, recent activity
- Debounced ticket search (300ms delay)
- Improved skeleton loading states
- Cache hit/miss and request timing logs

### Dashboard Metric Definitions

| Metric | Definition |
|--------|-----------|
| totalOpen | Tickets where status = open |
| totalInProgress | Tickets where status = in_progress |
| totalResolvedToday | Tickets where status = resolved and updatedAt is today (server timezone) |
| totalCritical | Tickets where priority = critical and status != closed |
| totalOverdue | Tickets where dueAt < now and status not in (resolved, closed) |
| unassignedTickets | Tickets where assigneeId is null and status not in (resolved, closed) |
| statusDistribution | Ticket count grouped by status (open, in_progress, resolved, closed) |
| priorityDistribution | Ticket count grouped by priority (low, medium, high, critical) |
| recentActivity | Latest 10 activity events with ticket title, actor, and timestamp |
| slaRiskTickets | Tickets due within 24h or overdue, open or in_progress, max 10 |

### Redis Caching Behavior

- Cache key: `dashboard:metrics:v1`
- TTL: 60 seconds
- On cache hit: return cached JSON, log `cache=hit`
- On cache miss: compute from PostgreSQL, store in Redis, log `cache=miss`
- Cache invalidated after: create ticket, update ticket, status change, assignee change, add comment
- Invalidation failures are logged but do not break successful mutations

### What's Not in Phase 3
- Advanced analytics or custom charting system
- Realtime updates (WebSockets)
- Alerting or notifications
- File attachments
- PWA or mobile app support
- Advanced role-based permissions (RBAC)
- Multi-tenancy
- Production CI/CD pipeline
- Delete ticket or edit/delete comments

## Tech Stack

- **Frontend:** Vue 3, TypeScript, Vite, Vue Router, Pinia, Tailwind CSS
- **Backend:** Hono, TypeScript, Zod, Drizzle ORM, Node.js 22
- **Database:** PostgreSQL
- **Cache:** Redis (dashboard metrics caching, 60s TTL)
- **Infrastructure:** Docker, Docker Compose, pgAdmin
- **Package Manager:** pnpm

## Project Structure

```
opsflow/
  apps/
    web/          # Vue 3 frontend
    api/          # Hono backend
  packages/
    shared/       # Shared DTO types
  docs/
    adr/          # Architecture Decision Records
  docker-compose.yml
  .env.example
  package.json
  pnpm-workspace.yaml
```

## Quick Start

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start all services:
   ```bash
   docker compose up --build
   ```

4. In another terminal, run migrations and seed data:
   ```bash
   pnpm --filter api db:migrate
   pnpm --filter api db:seed
   ```

5. Verify:
   - Frontend: http://localhost:5173
   - API Health: http://localhost:3000/health
   - API Ready: http://localhost:3000/ready

## Available Scripts

- `pnpm dev` - Start all services with Docker Compose
- `pnpm dev:web` - Start frontend only
- `pnpm dev:api` - Start backend only
- `pnpm docker:up` - Start services in background
- `pnpm docker:down` - Stop services
- `pnpm docker:logs` - Follow logs
- `pnpm typecheck` - Run TypeScript checks across workspace
- `pnpm lint` - Run linting across workspace
- `pnpm --filter api test` - Run backend tests
- `pnpm --filter web test` - Run frontend tests
- `pnpm --filter web test:e2e` - Run Playwright E2E tests

### Backend Database Scripts

- `pnpm --filter api db:generate` - Generate Drizzle migration
- `pnpm --filter api db:migrate` - Run pending migrations
- `pnpm --filter api db:push` - Push schema to database (dev only)
- `pnpm --filter api db:seed` - Seed database with users and tickets

## Seeded Login Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@opsflow.local | password123 | admin |
| agent@opsflow.local | password123 | agent |
| viewer@opsflow.local | password123 | viewer |

## API Endpoints

### System
- `GET /health` - Health check
- `GET /ready` - Readiness check (postgres + redis)

### Auth
- `POST /auth/login` - Login with email/password
- `GET /auth/me` - Get current user (requires JWT)

### Tickets
- `GET /tickets` - List tickets with query params: `q`, `status`, `priority`, `assigneeId`, `page`, `pageSize`, `sortBy`, `sortDirection`
- `POST /tickets` - Create a new ticket (requires JWT)
- `GET /tickets/:id` - Get single ticket by ID (requires JWT)
- `PATCH /tickets/:id` - Update ticket fields (title, description, priority, category, dueAt) (requires JWT)
- `PATCH /tickets/:id/status` - Update ticket status (requires JWT)
- `PATCH /tickets/:id/assignee` - Assign or unassign ticket (requires JWT)
- `GET /tickets/:id/comments` - Get comments for a ticket (requires JWT)
- `POST /tickets/:id/comments` - Add a comment to a ticket (requires JWT)
- `GET /tickets/:id/activity` - Get activity history for a ticket (requires JWT)

### Dashboard
- `GET /dashboard/metrics` - Get dashboard metrics (requires JWT, 60s Redis cache)

### Users
- `GET /users` - List users with optional `role` filter (requires JWT)

## Frontend Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/login` | Login page | No |
| `/tickets` | Ticket list with filters/pagination | Yes |
| `/tickets/:id` | Ticket detail page | Yes |
| `/dashboard` | Dashboard with metrics, distributions, SLA risk, activity | Yes |
| `/settings` | Settings page with appearance, preferences, account, system info | Yes |
| `*` | 404 Not Found | No |

## State Ownership

- **Pinia:** Auth state (user, token, loading, error), UI settings/preferences (theme, density, page size, notification toggles)
- **URL Query Params:** Ticket list filters, search, pagination, sorting
- **Local Component State:** Temporary UI concerns (form inputs, scoped loading)
- **localStorage:** Settings persistence (`opsflow:settings:v1`), Auth token (`opsflow_token`)

## Auth Security Limitation

Phase 1 uses simple JWT auth with tokens stored in localStorage for demo speed. This is vulnerable to XSS if malicious scripts can access localStorage. Production token handling requires careful XSS/CSRF trade-off analysis, preferably using httpOnly cookies with CSRF protection.

## Verification Commands

```bash
# Check API health
curl http://localhost:3000/health

# Check API readiness
curl http://localhost:3000/ready

# Login
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@opsflow.local","password":"password123"}' | jq -r '.data.token')

# Get current user
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer $TOKEN"

# List tickets
curl "http://localhost:3000/tickets?page=1&pageSize=20" \
  -H "Authorization: Bearer $TOKEN"

# Filtered tickets
curl "http://localhost:3000/tickets?status=open&priority=high&page=1&pageSize=20" \
  -H "Authorization: Bearer $TOKEN"

# Single ticket
curl "http://localhost:3000/tickets/<TICKET_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| WEB_PORT | Frontend port | 5173 |
| API_PORT | API port | 3000 |
| DATABASE_URL | Postgres connection string | postgres://opsflow:opsflow_password@postgres:5432/opsflow |
| POSTGRES_USER | Postgres user | opsflow |
| POSTGRES_PASSWORD | Postgres password | opsflow_password |
| POSTGRES_DB | Postgres database | opsflow |
| REDIS_URL | Redis connection string | redis://redis:6379 |
| JWT_SECRET | Secret for JWT signing | dev_only_change_me_later |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| PGADMIN_EMAIL | pgAdmin login email | admin@opsflow.com |
| PGADMIN_PASSWORD | pgAdmin login password | admin |

## Known Limitations

- Advanced analytics and custom charting not yet implemented
- Realtime updates not yet implemented
- No file attachments
- No notifications
- No advanced role-based permissions (RBAC)
- No multi-tenancy
- No CI/CD pipeline
- Delete ticket or edit/delete comments not yet implemented
- localStorage token storage (XSS risk — httpOnly cookies recommended for production)
- Dashboard cache may be stale for up to 60 seconds after mutation

## Next Phases

- Phase 4: Quality Gate + Interview Readiness (testing, accessibility, security, documentation)
- Phase 5: Production deployment, CI/CD, monitoring, advanced features

## Phase 4: Quality Gate + Interview Readiness

Phase 4 hardens OpsFlow into a professionally defensible interview project. No new product features. Focus on testing, accessibility, security, performance, error handling, and documentation.

### Phase 4 Scope
- Backend API tests (vitest, 58 tests across 8 files)
- Frontend unit/component tests (vitest, 19 tests across 3 files)
- Playwright E2E happy path tests (9 tests covering full user journey)
- Login rate limiting via Redis (5 attempts/60s window)
- Auth guard race condition fix (token-based guard, async user fetch)
- Accessibility review and improvements (semantic HTML, labels, focus, non-color-only indicators)
- Security review (JWT actor derivation, input validation, CORS, rate limiting, XSS prevention)
- Performance verification (lazy loading, debounced search, pagination, Redis caching)
- Error handling consistency across all views
- Architecture documentation, trade-off matrix, interview walkthrough
- Quality checklist for all hardening areas
- ADRs for testing strategy (0009) and demo auth trade-offs (0010)

### Running Tests

```bash
# Backend tests (requires Docker services running)
pnpm --filter api test

# Frontend tests
pnpm --filter web test

# E2E tests (requires Docker services running)
pnpm --filter web test:e2e

# Run all tests
pnpm --filter api test && pnpm --filter web test && pnpm --filter web test:e2e
```

### Test Summary

| Layer | Framework | Tests | Focus |
|-------|-----------|-------|-------|
| Backend | Vitest | 58 | Auth, protected endpoints, validation, workflow transitions, comments, activity, dashboard, rate limiting |
| Frontend | Vitest + Vue Test Utils | 19 | Auth store, status control, badges, dashboard rendering, loading/error states |
| E2E | Playwright | 9 | Login, logout, dashboard, ticket list, ticket detail, create ticket, status change, comment, full workflow |

### Security Additions in Phase 4

- **Login Rate Limiting:** Redis-backed, 5 failed attempts per 60-second window per IP
  - On rate limit exceeded, returns 429 with `RATE_LIMITED` error and `retryAfterSeconds`
  - Successful login resets the counter
  - Rate limit headers included on failed attempts (`X-RateLimit-Limit`, `X-RateLimit-Remaining`)
- **Auth Guard Fix:** Guard now uses token presence (not user object) for route protection to avoid race conditions on page reload
- **Actor Spoofing Prevention:** Backend derives actor identity from JWT payload, not request body

### Documentation Added in Phase 4

- `docs/architecture-overview.md` — System architecture with diagrams
- `docs/interview-walkthrough.md` — Demo script and likely interview questions
- `docs/trade-offs.md` — 10 key architectural trade-offs with rationale
- `docs/quality-checklist.md` — Quality gate sign-off across testing, accessibility, security, performance
- `docs/adr/0009-quality-gate-testing-strategy.md` — Risk-based testing decision
- `docs/adr/0010-demo-auth-token-storage.md` — localStorage JWT trade-off documentation

## Status Transition Rules

Allowed transitions:
- `open` → `in_progress`
- `open` → `closed`
- `in_progress` → `resolved`
- `in_progress` → `closed`
- `resolved` → `closed`
- `resolved` → `in_progress`

Not allowed:
- `closed` → `open`
- `closed` → `in_progress`
- `closed` → `resolved`
- Any same-status transition

## Verification Commands

```bash
# Check API health
curl http://localhost:3000/health

# Check API readiness
curl http://localhost:3000/ready

# Login
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@opsflow.local","password":"password123"}' | jq -r '.data.token')

# Get current user
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer $TOKEN"

# List tickets
curl "http://localhost:3000/tickets?page=1&pageSize=20" \
  -H "Authorization: Bearer $TOKEN"

# Create ticket
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Cannot access billing portal",
    "description": "User receives 403 when opening billing portal.",
    "priority": "high",
    "category": "access",
    "assigneeId": null,
    "dueAt": "2026-06-10T10:00:00.000Z"
  }'

# Update status
curl -X PATCH http://localhost:3000/tickets/<TICKET_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"in_progress"}'

# Assign/unassign ticket
curl -X PATCH http://localhost:3000/tickets/<TICKET_ID>/assignee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"assigneeId":null}'

# Add comment
curl -X POST http://localhost:3000/tickets/<TICKET_ID>/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"body":"I reproduced this issue and started investigation."}'

# Get comments
curl http://localhost:3000/tickets/<TICKET_ID>/comments \
  -H "Authorization: Bearer $TOKEN"

# Get activity
curl http://localhost:3000/tickets/<TICKET_ID>/activity \
  -H "Authorization: Bearer $TOKEN"

# Get users
curl http://localhost:3000/users?role=agent \
  -H "Authorization: Bearer $TOKEN"

# Get dashboard metrics
curl http://localhost:3000/dashboard/metrics \
  -H "Authorization: Bearer $TOKEN"

# Verify cache hit (second call should be faster)
curl http://localhost:3000/dashboard/metrics \
  -H "Authorization: Bearer $TOKEN"
```

## Database Management

pgAdmin is available at `http://localhost:5050` for database inspection.

Default login:
- Email: `admin@opsflow.com`
- Password: `admin`

To connect to the database in pgAdmin:
1. Log in with the credentials above
2. Right-click on "Servers" → "Register" → "Server"
3. General tab: Name = `opsflow`
4. Connection tab:
   - Host: `postgres`
   - Port: `5432`
   - Database: `opsflow`
   - Username: `opsflow`
   - Password: `opsflow_password`

## Architecture Decisions

See `docs/adr/` for detailed architecture decision records.

- ADR 0001: Docker Compose for local development infrastructure
- ADR 0002: Hono as the backend framework
- ADR 0003: Use URL Query Parameters for Ticket List View State
- ADR 0004: Separate Backend Routes, Services, Repositories, and Schemas
- ADR 0005: Model Ticket Status as Explicit Workflow Transitions
- ADR 0006: Use Pessimistic Mutations for Ticket Workflow Actions
- ADR 0007: Use Redis to Cache Dashboard Metrics
- ADR 0008: Use One Aggregated Dashboard Metrics Endpoint
- ADR 0009: Risk-Based Testing for Phase 4 Quality Gate
- ADR 0010: localStorage JWT for Demo Authentication with Documented Production Trade-offs
- ADR 0011: Local UI Preferences via Pinia and localStorage

## Settings Page

The `/settings` page provides local app preferences:

- **Appearance:** Theme selector (System / Light / Dark). Dark mode uses Tailwind `class` strategy.
- **Ticket List Preferences:** Table density (Comfortable / Compact) and default page size (10 / 20 / 50).
- **Notifications:** Toggle success toasts, dashboard cache badge, and SLA warning banners.
- **Account:** Displays current user name, email, and role. Logout button.
- **System:** Environment info, API base URL, and health check button.
- **Reset:** One-click reset to factory defaults.

**State Ownership Decision:**
- Settings stored in Pinia + `localStorage` (`opsflow:settings:v1`)
- URL query params still override settings defaults (e.g., `?pageSize=50` overrides the user's default page size)
- Preferences are local only — they do not follow the user across devices

**localStorage Persistence:**
- Key: `opsflow:settings:v1`
- Persisted on every setting change
- Hydrated on app load and on route to settings page
- Theme applied before Vue mounts to avoid flash
