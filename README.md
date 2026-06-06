# OpsFlow

A production-style Service Desk Operations Dashboard.

## Phase 0: Infrastructure Foundation

This phase establishes a reproducible local full-stack development environment using Docker and Docker Compose. No business features are implemented yet.

## Tech Stack

- **Frontend:** Vue 3, TypeScript, Vite, Vue Router, Pinia, Tailwind CSS
- **Backend:** Hono, TypeScript, Node.js 22
- **Database:** PostgreSQL
- **Cache:** Redis
- **Infrastructure:** Docker, Docker Compose, Adminer
- **Package Manager:** pnpm

## Project Structure

```
opsflow/
  apps/
    web/          # Vue 3 frontend
    api/          # Hono backend
  packages/
    shared/       # Shared types and schemas
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

2. Start all services:
   ```bash
   pnpm dev
   ```
   Or with Docker directly:
   ```bash
   docker compose up --build
   ```

3. Verify the setup:
   - Frontend: http://localhost:5173
   - API Health: http://localhost:3000/health
   - API Ready: http://localhost:3000/ready
   - Adminer: http://localhost:8080

## Available Scripts

- `pnpm dev` - Start all services with Docker Compose
- `pnpm dev:web` - Start frontend only
- `pnpm dev:api` - Start backend only
- `pnpm docker:up` - Start services in background
- `pnpm docker:down` - Stop services
- `pnpm docker:logs` - Follow logs
- `pnpm typecheck` - Run TypeScript checks across workspace
- `pnpm lint` - Run linting across workspace

## Verification Commands

```bash
# Check API health
curl http://localhost:3000/health

# Check API readiness (postgres + redis)
curl http://localhost:3000/ready

# Open frontend
open http://localhost:5173

# Open Adminer
open http://localhost:8080
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

## Current Limitations

- No business features (tickets, comments, etc.)
- No authentication implemented
- No database migrations or seed data
- Development-only configuration
- No CI/CD pipeline

## Next Phases

- Phase 1: Ticket management (CRUD, listing, basic UI)
- Phase 2: Comments and activity logs
- Phase 3: Dashboard metrics and filtering
- Phase 4: Authentication and authorization
- Phase 5: Performance optimization and deployment

## Architecture Decisions

See `docs/adr/` for detailed architecture decision records.

- ADR 0001: Docker Compose for local development infrastructure
- ADR 0002: Hono as the backend framework
