# ADR 0010: Use localStorage JWT for Demo Authentication with Documented Production Trade-offs

## Status

Accepted

## Context

OpsFlow uses simple JWT-based authentication for the interview demo.
The frontend needs to preserve the auth token across browser refreshes so
the user is not forced to re-authenticate on every page load. The
project scope is a local demo, not a production SaaS application.

## Options Considered

1. **localStorage JWT** — store the JWT in `localStorage` after login,
   attach it to every API request via an `Authorization` header. Survives
   refreshes, trivial to implement.
2. **Memory-only token** — hold the JWT in a JavaScript variable.
   No XSS risk via storage APIs, but lost on every page refresh.
3. **httpOnly cookie sessions** — server sets an `httpOnly`, `Secure`,
   `SameSite` cookie. Token is inaccessible to JavaScript, survives
   refreshes. Requires backend session management and CSRF protection.
4. **Full refresh-token rotation** — short-lived access tokens with
   silent refresh via a long-lived refresh token stored in an httpOnly
   cookie. Adds token rotation, revocation, and refresh endpoint
   complexity.

## Decision

Use `localStorage` to store the JWT for the demo. Attach the token as a
`Bearer` token in the `Authorization` header for all authenticated API
requests. Document the production trade-offs clearly so the decision
can be discussed in an interview.

## Rationale

- Simplest implementation: a few lines of client-side code to read,
  write, and attach the token.
- Easy to inspect during a demo: open DevTools → Application → Local
  Storage to show the token and its payload.
- Survives page refresh, which is the minimum UX bar for a functional
  demo.
- Sufficient for a local, single-user interview project where the threat
  model is trivial.
- Avoids expanding scope into backend session stores, CSRF tokens, or
  refresh-token infrastructure that a demo does not need.

## Consequences

### Positive

- Simple frontend auth flow: login → store token → attach to requests.
- Token survives browser refresh and tab restore.
- Clear, inspectable behavior for demo purposes.
- Minimal backend complexity (no session store, no CSRF middleware).
- Easy to explain the decision and its trade-offs in an interview.

### Negative

- Vulnerable to XSS: any JavaScript running on the page can read the
  token from `localStorage`. If an XSS vulnerability exists, the
  attacker can exfiltrate the JWT.
- Not ideal for production token confidentiality. `httpOnly` cookies
  provide stronger protection against token theft via script injection.
- No automatic expiry handling: the frontend must manually detect
  expired tokens and redirect to login.
- No token rotation or revocation mechanism.

### Production Recommendations

For a production deployment, the following should be considered:

- **httpOnly cookies** — store the session token in an `httpOnly`,
  `Secure`, `SameSite=Strict` cookie to prevent JavaScript access.
- **CSRF protection** — implement double-submit cookie pattern or
  synchronizer token pattern when using cookie-based auth.
- **Token expiry** — use short-lived access tokens (e.g., 15 minutes)
  with a refresh mechanism.
- **Token rotation** — rotate refresh tokens on each use and maintain
  a token family for revocation.
- **Stronger session management** — consider server-side session stores
  (Redis) with session invalidation on logout or password change.
