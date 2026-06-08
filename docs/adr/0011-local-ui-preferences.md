# ADR 0011: Local UI Preferences via Pinia and localStorage

## Title

Store App UI Preferences in Pinia and localStorage

## Context

OpsFlow needs user-configurable UI preferences: theme, ticket table density, default page size, and notification toggles. There is no backend user-profile system, and building one would add unnecessary scope for this demo phase.

## Options Considered

1. Build a backend user-preferences endpoint with database persistence
2. Store preferences only in reactive component state (lost on refresh)
3. Store preferences in Pinia with localStorage persistence
4. Store preferences in URL query parameters (like ticket filters)

## Decision

Store app UI preferences in a Pinia store (`settings`) with persistence to `localStorage` under the key `opsflow:settings:v1`. Apply theme on app startup before Vue mounts.

## Rationale

- Preferences affect app-wide UI behavior (theme, table density, toasts)
- No backend user-preference system exists, and building one is out of scope
- localStorage is sufficient for a demo — preferences persist across page refreshes
- Pinia provides reactive state that all components can consume
- Avoids polluting URL query params with UI-only concerns
- Theme must be applied before render to avoid flash of wrong theme

## Consequences

### Positive

- No backend changes needed
- Instant reactivity across all components
- Persists across page refreshes
- Clean separation: URL params = view state, Pinia = app state, localStorage = preferences

### Negative

- Preferences do not follow the user across devices or browsers
- localStorage can be cleared, resetting preferences
- Not suitable for multi-user shared devices without logout

### Production Consideration

In production, user preferences could be persisted server-side and synced to localStorage as a cache. The Pinia store interface would remain the same; only the persistence layer would change.

## Related

- ADR 0003: URL Query Parameters for Ticket List View State
- URL query params (`pageSize`) override settings defaults — URL is the stronger signal

## Status

Accepted
