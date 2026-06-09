# OpsFlow — Interview Walkthrough

> Service Desk Operations Dashboard · Live Demo Script + FAQ

---

## Demo Script (~12 minutes)

### 1. Spin Up the Stack

```bash
docker compose up --build
```

Let the build logs scroll — Postgres 16, Redis 7, API (Hono), and Web (Vite) all start with health checks. This proves I can wire up multi-service local infrastructure without a platform team. The `depends_on` with `condition: service_healthy` ensures services don't start until their dependencies are actually ready, not just running.

### 2. Explain the Stack

| Layer       | Choice                                   |
| ----------- | ---------------------------------------- |
| Frontend    | Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS |
| Backend     | Hono (Node.js 22) + Zod + Drizzle ORM    |
| Database    | PostgreSQL 16                            |
| Cache       | Redis 7                                  |
| Monorepo    | pnpm workspaces (`apps/web`, `apps/api`, `packages/shared`) |
| Auth        | JWT (jose, HS256)                        |
| Testing     | vitest (unit/integration) + Playwright (E2E) |

Shared types live in `packages/shared` — DTOs, enums, API shapes — imported by both apps so the contract stays in sync at compile time.

### 3. Login

Navigate to `http://localhost:5173`, auto-redirected to `/login`.

The login page is a dark SaaS control-center design with glassmorphism card, circuit-line decorative background, and embedded SVG icons. It communicates "secure operations dashboard" visually.

**Credentials:** `admin@opsflow.local` / `password123`

For quick demo access, click any of the **Demo accounts** buttons (Admin / Agent / Viewer) below the card — they auto-fill the form fields with the seeded credentials. Then click "Sign in."

JWT gets stored in `localStorage` under `opsflow_token`. The Pinia auth store hydrates on app init by calling `GET /auth/me` with the stored token. If that fails, we redirect to login.

### 4. Dashboard

The shell now uses a professional operations-cockpit layout:

| Area       | Purpose |
| ---------- | ------- |
| **Sidebar** (240px) | Product navigation (Workspace: Dashboard, Tickets; Operations: Settings; Saved Views: Critical), user info + logout |
| **Topbar** | Global search (placeholder), "Create" button, SLA alerts icon |
| **Main content** | Page-specific content, scrollable |

The global "Create Ticket" button is always accessible in the topbar — it auto-opens the creation dialog regardless of which page you're on. Created tickets navigate directly to their detail view.

Six metric cards at the top: Total Open, In Progress, Resolved Today, Critical, Overdue, Unassigned. Below: status distribution bar chart, priority distribution, SLA risk table (tickets due within 24h or already overdue), and recent activity feed.

All of this comes from a single `GET /dashboard/metrics` call — one aggregated endpoint instead of 5+ micro-requests. No frontend waterfalls.

### 5. Explain Redis Caching

- Cache key: `dashboard:metrics:v1`
- TTL: 60 seconds
- Pattern: read-through — check Redis, on miss run 10 parallel DB queries via `Promise.all()`, store as JSON
- Every API request logs `cache=hit` or `cache=miss` to the console — open the API logs to show this
- Cache is invalidated after any mutation: create ticket, update ticket, status change, assignee change, add comment
- Invalidation failure is logged but never blocks the mutation — writes always succeed

### 6. Tickets List

Navigate to `/tickets` — the ticket workspace opens with a **card-based queue** on the left and a "Select a ticket" placeholder on the right. This is a master-detail layout common in operations/helpdesk tools:

| Column | Width | Content |
| ------ | ----- | ------- |
| Queue | 320px | Search bar, status/priority filter pills, paginated ticket cards |
| Detail | flex-1 | Ticket header, description, Comments/Activity tabs |
| Context | 288px (xl+) | Status control, assignee control, metadata, reporter info |

Each ticket card shows: key (T-xxxxxx), priority badge with colored accent strip, title, status dot + label, assignee, due date, and category. Priority determines the left accent strip color (red=critical, orange=high, blue=medium, gray=low). The selected card is highlighted with a blue border glow.

Clicking a ticket card navigates to `/tickets/:id` — the queue persists on the left while the detail opens in the center. The URL is shareable and refreshable.

Filters are still URL-driven: search updates `?q=`, status/priority pills update the query params with `page=1` reset. All existing filter/pagination behavior is preserved.

### 7. URL-Driven Filters

Click "Open" filter → URL updates to `?status=open`. Click "High Priority" → `?status=open&priority=high`. Search "billing" → `?status=open&priority=high&q=billing`. Back button works naturally. Sorting and pagination are also in the URL.

This is a deliberate design choice: URL as state means shareable, bookmarkable, refreshable URLs with zero global state bloat.

### 8. Ticket Detail

Click a ticket card → `/tickets/:id`. The center area shows:
- Breadcrumb: Tickets → T-xxxxxx
- Title and full description
- **Comments tab**: comment form + chronological comment list
- **Activity tab**: audit trail of all status/assignee/priority changes

The right context panel (visible on xl+ screens) shows:
- Status dropdown with valid transitions
- Priority badge
- Category
- Due date
- Created/updated timestamps
- Assignee dropdown with agent list
- Reporter avatar + name

Status changes and assignments happen directly from the context panel, keeping the center area focused on reading the ticket.

### 9. Status Transition (Workflow Engine)

Change status via dropdown. Show the workflow rules live:

```
open → in_progress → resolved → closed
  |                     |
  +---→ closed ←--------+
```

Try an invalid transition (e.g. closed → open) — the backend rejects it with `INVALID_STATUS_TRANSITION` because the `ticket.workflow.ts` module enforces explicit transition rules. The frontend dropdown also filters valid next statuses using the `getValidNextStatuses()` function from the shared workflow logic.

### 10. Assign/Unassign

Assign a ticket from the user dropdown. The backend validates the assignee exists, records an `assignee_changed` activity event, and updates the ticket — all in one `db.transaction()`.

### 11. Add a Comment

Type a comment → appears immediately in the timeline. Backend creates the comment row AND inserts a `comment_added` activity event in the same Drizzle transaction. The audit trail is never out of sync with the data.

### 12. Activity Timeline

Every mutation writes an activity record in the same DB transaction: `ticket_created`, `status_changed`, `assignee_changed`, `priority_changed`, `comment_added`. The timeline view joins `ticket_activity` with `users` to show actor names and timestamps. This is a transaction-based activity log, not an append-only event log — the guarantee is that every state change has exactly one corresponding audit record.

### 13. Create a Ticket

"Create Ticket" button opens a modal with form fields: title, description, priority, category, assignee (optional), due date (optional). Submit → POST request → new ticket appears in the list and a `ticket_created` activity record is created.

### 14. State Ownership Philosophy

- **Pinia**: Auth state only (user, token, loading, error) — global because it's needed everywhere
- **URL query params**: Ticket list filters, search, pagination, sorting — shareable, refreshable, bookmarkable
- **Local component refs**: Form inputs, modal open/close, temporary UI state — stays where it's used

This is a deliberate design: don't put everything in a store. Each piece of state lives in the right layer based on its scope and lifetime.

### 15. Logout

Click logout → token cleared from localStorage → redirected to `/login` → auth middleware on the API rejects any further requests with 401.

### 16. Last-Minute Highlights

- **Information Architecture**: Sidebar for product nav, topbar for global actions (Create, search), main area for page content — clearly separated concerns. Sidebar uses `<nav aria-label>`, topbar uses `<header>`, content uses `<main>`.
- **Accessibility**: Semantic HTML landmarks, ticket cards are real `<router-link>` elements, visible focus rings, `aria-current="page"` on selected cards, labeled form controls, status/priority badges include text labels
- **Security**: JWT verification via jose with clock tolerance, per-endpoint auth middleware, rate limiting on login (5 attempts/60s per IP, `x-forwarded-for` aware), backend actor derivation from JWT claims (no client-provided `userId`), CORS restricted to configured origin
- **Testing**: 58 backend tests (vitest) + 35 frontend tests (vitest) + 9 E2E tests (Playwright) — risk-based: auth, validation, workflows, dashboard metrics, critical user journeys

---

## Interview FAQ

### 1. Why Hono over Express or Fastify?

- Hono is lighter than Express/Fastify — fewer middleware layers, simpler mental model
- Runtime-portable: same code runs on Node, Bun, Deno — good for evolving infrastructure
- First-class TypeScript support with `Context` generic that carries typed `c.get("user")` payloads
- For this project, Express is overkill and Fastify's plugin system adds ceremony I don't need

### 2. Why Drizzle over Prisma?

- Drizzle is a thin SQL-first query builder — I write queries that look like SQL, not a DSL
- No code generation step; schema is just TypeScript files, types are inferred from the schema
- Full control over query shape and performance; Prisma's query engine adds a black-box layer
- Migration files are plain SQL, easy to review in PRs and rerun

### 3. How do you handle auth?

- JWT signed with HS256 via `jose` library, 1-day expiry, `clockTolerance: 60`
- `authMiddleware` extracts `Bearer` token from `Authorization` header, verifies, attaches payload to `c.set("user", payload)`
- All services read the actor from `user.sub` — the backend is the source of truth, not the client
- Login rate-limited: 5 attempts per 60s per IP in Redis (`rate-limit:login:<ip>`), with `x-forwarded-for` support

### 4. Why localStorage JWT instead of cookies?

- Intentional demo trade-off: localStorage is trivially inspectable during a demo (DevTools → Application → Local Storage)
- Simpler implementation — no CSRF tokens, no server-side session store, no cookie config
- Documented as a known limitation; production would use httpOnly, Secure, SameSite=Strict cookies with CSRF protection

### 5. How does the workflow engine work?

- `ticket.workflow.ts` defines an `allowedTransitions` map: explicit adjacency list of which statuses can go where
- `isValidStatusTransition(from, to)` is called in `ticket.service.ts` before any status mutation
- Invalid transitions return `INVALID_STATUS_TRANSITION` with the attempted from/to in the error details
- Frontend also calls `getValidNextStatuses()` to filter the dropdown options — backend is still authority

### 6. Why one dashboard endpoint vs multiple micro-endpoints?

- Avoids frontend request waterfalls — one call loads the entire dashboard vs. 5+ sequential or parallel calls
- Easier to cache: one Redis key covers all panels
- Simpler loading/error handling: one skeleton loader, one error state
- Appropriate for this project's scale; if panels ever need independent freshness policies, I'd split then

### 7. How does Redis caching work and when does it invalidate?

- Read-through: `cacheGet()` → miss → compute 10 queries in parallel via `Promise.all()` → `cacheSet()` with 60s TTL
- Invalidation: every mutation service calls `invalidateDashboardCache()` which `cacheDelete()`s the key
- Invalidation trigger points: create ticket, update fields, status change, assignee change, add comment
- Invalidation failure is caught and logged but never blocks the successful mutation

### 8. What's your testing strategy?

- Risk-based: auth, validation, workflows, dashboard metrics — where bugs hurt most
- Backend: vitest with real Postgres test DB (the test setup runs migrations and seeds); 58 tests across 8 files
- Frontend: vitest with mocked API — Pinia store behavior, status dropdown logic, dashboard rendering; 19 tests
- E2E: Playwright — one happy-path spec covering login → create ticket → navigate → update status → logout; 9 tests
- Not aiming for coverage numbers — aiming for confidence in critical paths

### 9. How do you handle loading, error, and empty states?

- Every page/component owns its own `isLoading`, `error`, and empty-state flags derived from data
- Loading: skeleton loaders (cards with shimmer, rows with placeholders) — not a global spinner
- Error: each section shows its own error message with a retry button; API client parses `ApiError` from the response shape
- Empty: contextual messages — "No tickets match your filters. Try adjusting the search criteria." vs. "No tickets yet. Create your first ticket."

### 10. If this were production, what would you change?

- Auth: httpOnly cookies + CSRF protection + short-lived access tokens with refresh rotation
- CI/CD: GitHub Actions pipeline with typecheck, lint, tests, Docker build → deploy
- Observability: structured logging (pino), metrics (Prometheus), distributed tracing (OpenTelemetry)
- RBAC: role-based route guards — currently all authenticated users share the same access level
- Database: connection pooling (pgbouncer), read replicas for dashboard queries, proper migration CI
- Feature additions: WebSocket for real-time updates, file attachments, push notifications, delete/edit comments

### 11. How do you handle CORS and security?

- CORS: `hono/cors` middleware restricted to `CORS_ORIGIN` env var (default: `http://localhost:5173`)
- Auth: JWT verified on every protected request via middleware — not just checked at login
- Actor derivation: services read `user.sub` from the JWT, never trust a client-provided `userId`
- Rate limiting: login endpoint has Redis-backed rate limiting (5 attempts/60s per IP)
- Input validation: Zod `safeParse()` on every request body/query — validation errors return 400 with structured details
- Graceful degradation: Redis unavailable → rate limiting silently passes; cache misses fall through to DB

### 12. Why Vue 3 over React?

- Vue 3's Composition API is ergonomic without the hooks mental model overhead (dependency arrays, stale closures, etc.)
- Single-file components (SFCs) keep template, logic, and styles co-located naturally
- Reactivity is opt-in and explicit with `ref()`/`reactive()` — less "magic" than React's re-render model
- Pinia for state management is simpler than Redux and was built for Vue 3's Composition API
- Tailwind CSS + Vue's scoped styles work cleanly together without CSS-in-JS overhead
- I enjoy React too — for this project, Vue gave me faster iteration with less boilerplate
