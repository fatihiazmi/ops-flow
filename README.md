# OpsFlow

A production-style Service Desk Operations Dashboard.

## Phase 0: Infrastructure Foundation

This phase establishes a reproducible local full-stack development environment using Docker and Docker Compose.

## Phase 1: Domain Foundation + Read-Only Ticket Flow

Phase 1 builds the first real vertical slice of OpsFlow. A user can run the full stack locally, log in with a seeded user, view a paginated list of tickets, filter/search by URL query parameters, and open a ticket detail page.

## Tech Stack

- **Frontend:** Vue 3, TypeScript, Vite, Vue Router, Pinia, Tailwind CSS
- **Backend:** Hono, TypeScript, Zod, Drizzle ORM, Node.js 22
- **Database:** PostgreSQL
- **Cache:** Redis (readiness checks only in Phase 1)
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
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (requires JWT)

### Tickets
- `GET /api/tickets` - List tickets with query params: `q`, `status`, `priority`, `assigneeId`, `page`, `pageSize`, `sortBy`, `sortDirection`
- `GET /api/tickets/:id` - Get single ticket by ID (requires JWT)

## Frontend Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/login` | Login page | No |
| `/tickets` | Ticket list with filters/pagination | Yes |
| `/tickets/:id` | Ticket detail page | Yes |
| `/dashboard` | Dashboard placeholder | Yes |
| `/settings` | Settings placeholder | Yes |
| `*` | 404 Not Found | No |

## State Ownership

- **Pinia:** Auth state (user, token, loading, error)
- **URL Query Params:** Ticket list filters, search, pagination, sorting
- **Local Component State:** Temporary UI concerns (form inputs, scoped loading)

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

- Read-only ticket flow (no create/update/delete)
- No comments or activity timeline
- No advanced dashboard metrics
- No Redis caching yet
- No role-based permissions
- No CI/CD pipeline
- localStorage token storage (XSS risk)

## Next Phases

- Phase 2: Ticket write operations (create, update, delete) + comments + activity timeline
- Phase 3: Dashboard metrics, filtering, and reporting
- Phase 4: Role-based permissions and advanced auth
- Phase 5: Performance optimization, Redis caching, and deployment

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
