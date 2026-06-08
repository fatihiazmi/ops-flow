# Trade-offs

## Framework

### 1. Hono vs Elysia
**Decision:** Hono
**Why:** Node.js ecosystem compatibility, mature middleware ecosystem, and first-class Zod integration for request validation.
**Benefits/Costs:** Rich middleware ecosystem and broad Node.js deployment options; slightly heavier than Elysia's Bun-native approach but negligible for this scope.
**When to reconsider:** If targeting Bun as the primary runtime, Elysia offers better performance and tighter platform integration.

## Database

### 2. Supabase vs Local Postgres in Docker
**Decision:** Local Postgres in Docker
**Why:** Self-contained demo with zero external dependencies — the project runs entirely offline for interview evaluation.
**Benefits/Costs:** No network reliance, full control over schema and data; lacks Supabase's built-in auth, realtime, and storage APIs.
**When to reconsider:** When realtime features, managed auth, or file storage become requirements, Supabase eliminates significant boilerplate.

### 3. Drizzle vs Prisma
**Decision:** Drizzle
**Why:** SQL-like DX feels familiar, no code generation step, and the bundle is significantly lighter.
**Benefits/Costs:** Intuitive query building, fast type inference, zero codegen overhead; smaller community and fewer pre-built integrations than Prisma.
**When to reconsider:** If the team prefers declarative schema-first workflows or needs Prisma's migration studio and visual tools.

## State Management

### 4. Pinia vs Local State vs URL Query State
**Decision:** Hybrid (Pinia for auth, URL queries for ticket filters, local state for forms)
**Why:** Each concern has different lifetime and sharing requirements — auth is global, filters are shareable/bookmarkable, and forms are ephemeral.
**Benefits/Costs:** Right tool for each job; introduces three patterns to learn and document.
**When to reconsider:** If the team prefers consistency over precision, consolidating to Pinia everywhere simplifies onboarding.

## API Design

### 5. Single Dashboard Endpoint vs Multiple Endpoints
**Decision:** Single aggregated `/dashboard` endpoint
**Why:** The dashboard page needs a unified view of metrics, recent tickets, and workload — fetching in one round trip is simpler and cache-friendly.
**Benefits/Costs:** Fewer network requests, easier caching strategy, simpler frontend data loading; endpoint becomes a bottleneck if sub-resources diverge in access patterns or freshness requirements.
**When to reconsider:** When individual dashboard widgets need independent scaling, caching, or are consumed by other pages.

### 6. Optimistic vs Pessimistic Mutations
**Decision:** Pessimistic mutations (wait for server confirmation)
**Why:** Workflow validation and activity logging mean mutations can fail server-side — optimistic UI would mislead operators into thinking actions succeeded.
**Benefits/Costs:** Always displays correct state, no rollback complexity; feels slower than optimistic updates.
**When to reconsider:** For high-frequency, low-failure actions (e.g., toggling a flag), optimistic updates improve perceived responsiveness.

## Caching

### 7. Redis Cache Staleness vs Database Load
**Decision:** 60-second TTL with active invalidation on mutations
**Why:** Dashboard data changes infrequently but must be accurate after operator actions — short TTL balances freshness with reduced database load.
**Benefits/Costs:** Lowers average query load while staying fresh post-mutation; adds cache invalidation logic that must stay in sync with all write paths.
**When to reconsider:** If write volume is extremely low, skip the cache entirely; if near-real-time is required, drop the TTL and rely solely on invalidation.

## Frontend

### 8. SPA vs SSR
**Decision:** SPA with Vite dev server
**Why:** The entire application is behind authentication — SEO is irrelevant, and a SPA provides a snappy, app-like experience after initial load.
**Benefits/Costs:** Simple deployment (static files), fast client-side navigation, no server rendering overhead; larger initial bundle and blank-page loading flash.
**When to reconsider:** If public-facing pages (landing, docs, status) are added, SSR or a hybrid framework like Nuxt becomes valuable.

### 9. localStorage JWT vs httpOnly Cookie
**Decision:** localStorage JWT with documented trade-offs
**Why:** Simplest token storage for a demo — no CSRF configuration, no cookie-parsing middleware, trivially sent via `Authorization` header.
**Benefits/Costs:** Dead simple implementation; vulnerable to XSS token theft (cookies with httpOnly + SameSite are more secure).
**When to reconsider:** In production, switch to httpOnly cookies with CSRF protection, or use a BFF pattern to keep tokens server-side.

## Project Structure

### 10. Monorepo vs Multiple Repos
**Decision:** Single monorepo
**Why:** An interview project benefits from atomic commits, shared TypeScript types between client/server, and zero cross-repo coordination overhead.
**Benefits/Costs:** Simplifies CI, type sharing, and refactoring; doesn't demonstrate multi-repo orchestration skills.
**When to reconsider:** When teams scale independently or deployment cadences diverge significantly between packages.
