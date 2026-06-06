# ADR 0004: Separate Backend Routes, Services, Repositories, and Schemas

## Title

Separate Backend Routes, Services, Repositories, and Schemas

## Context

The backend needs a consistent architecture for handling HTTP requests, validating input, executing business logic, and accessing the database. Without clear separation, code becomes difficult to test, maintain, and reason about.

## Options Considered

1. Put everything in route handlers (fat controllers)
2. Use a layered architecture: routes → schemas → services → repositories
3. Use a full framework like NestJS with built-in DI and layering

## Decision

Use a layered backend module structure where routes handle HTTP concerns, schemas validate input, services coordinate application logic, and repositories handle database access.

## Rationale

- Separation of concerns makes each layer independently testable
- Routes stay thin and focused on HTTP (status codes, headers, JSON serialization)
- Schemas provide a single source of truth for validation rules
- Services encapsulate business logic without SQL noise
- Repositories isolate database queries and Drizzle ORM specifics
- Easy to explain and justify in an interview setting

## Consequences

### Positive

- Clear data flow direction: route → schema → service → repository → database
- Each module follows the same structure, making the codebase predictable
- Unit testing business logic does not require HTTP or database setup
- Swapping the ORM or adding caching happens mostly in the repository layer

### Negative

- More files and boilerplate than a minimal script
- New developers must learn the layering convention
- Over-engineering risk for very simple endpoints

## Status

Accepted
