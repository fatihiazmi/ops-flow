# ADR 0002: Use Hono as the backend framework

## Title

Use Hono as the backend framework

## Context

We need a lightweight TypeScript REST API backend to support a frontend-heavy Vue interview project. The backend should be simple enough not to dominate the project but complete enough to demonstrate real integration patterns.

## Options Considered

1. **Hono**: Lightweight, edge-ready TypeScript web framework
2. **Elysia**: Bun-first TypeScript framework with excellent type inference
3. **Express**: Mature, battle-tested Node.js framework
4. **NestJS**: Full-featured enterprise framework with built-in patterns

## Decision

Use Hono.

## Rationale

Hono is a lightweight, TypeScript-friendly web framework that runs on multiple JavaScript runtimes. It provides enough features for REST APIs without the ceremony of larger frameworks. It keeps the backend simple so the frontend remains the focus of the project.

## Trade-off

Elysia has excellent Bun-first developer experience and strong type inference, but it introduces stronger Bun/ecosystem coupling. Hono is a more conservative and portable choice for this project.

## Consequences

### Positive

- Simple, fast backend with minimal boilerplate
- Easy to explain and justify in an interview setting
- Enough features for REST integration, health checks, validation, and auth later
- Portable across Node.js, Bun, and Deno runtimes
- Good middleware ecosystem (CORS, logger, etc.)

### Negative

- Less full-stack type magic than Elysia
- More manual decisions around validation, OpenAPI, and architecture
- Smaller community than Express
- Fewer pre-built plugins compared to NestJS

## Status

Accepted
