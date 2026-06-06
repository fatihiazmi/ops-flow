# ADR 0003: Use URL Query Parameters for Ticket List View State

## Title

Use URL Query Parameters for Ticket List View State

## Context

The ticket list needs search, filtering, pagination, and sorting. These values affect what the user sees and should survive refresh, browser navigation, and sharing.

## Options Considered

1. Store all filter state in Pinia
2. Store all filter state locally in TicketListPage
3. Store view state in URL query params
4. Store filters on the backend session

## Decision

Use URL query params for ticket list filters, search, pagination, and sorting. Use Pinia for auth/shared app state. Use local component state for temporary UI concerns.

## Rationale

- URL state is shareable
- URL state survives refresh
- browser back/forward works naturally
- avoids bloating global state
- makes data fetching deterministic from route state

## Consequences

### Positive

- better navigation behavior
- clearer state ownership
- easier debugging
- easier to bookmark filtered views

### Negative

- query parsing and validation are needed
- URLs can become noisy
- components must sync carefully with router state

## Status

Accepted
