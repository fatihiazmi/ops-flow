# ADR 0001: Use Docker Compose for local development infrastructure

## Title

Use Docker Compose for local development infrastructure

## Context

We need a reproducible local development environment for a full-stack Vue + Hono + PostgreSQL + Redis project. The setup must be interview-friendly and easy to demonstrate.

## Options Considered

1. **Supabase**: Managed backend-as-a-service with built-in auth, database, and realtime.
2. **Local Docker Compose with Postgres and Redis**: Self-managed containers orchestrated with Docker Compose.
3. **SQLite**: File-based database with no server required.
4. **Hosted database**: External PostgreSQL and Redis instances.

## Decision

Use Docker Compose with services for web, api, postgres, redis, and adminer.

## Rationale

Docker Compose provides the best balance of realism and control for a local development environment. It mirrors production infrastructure closely without requiring cloud accounts or external dependencies.

## Consequences

### Positive

- Reproducible local setup across different machines
- Realistic REST API integration with a real database
- Local database ownership allows schema experimentation
- Easy interview demonstration without internet dependencies
- Supports migrations, seed data, and complex queries later
- Includes Adminer for easy database inspection

### Negative

- More initial setup than using a managed service like Supabase
- Need to manage database migrations manually
- Requires Docker knowledge from contributors
- Local environment may differ from production if not carefully maintained
- Slightly higher resource usage on the local machine

## Status

Accepted
