# Auth Contract Draft

> Generated: 2026-02-11
> Phase: Architectural Consolidation (pre-production)
> Status: DRAFT — requires backend team review

## Current State

El frontend implementa un sistema **mock-first** con abstraccion limpia via `OAuthService` interface:

| Layer | File | Status |
|-------|------|--------|
| State | `src/state/slices/authPanel/slice.ts` | Redux: `isOpen`, `isAuthenticated`, `user`, `error` |
| Session | `src/services/auth/session.ts` | localStorage con TTL 7 dias |
| Mock | `src/services/auth/mock.ts` | Delays simulados (800ms login, 1200ms OAuth) |
| Interface | `src/services/auth/oauth.ts` | `OAuthService` con `MockOAuthService` implementado |
| Sync | `src/state/providers/AuthProvider/index.tsx` | Cross-tab sync via `StorageEvent` |

**Mecanismo actual:** Mock token en localStorage. NO JWT, NO cookies, NO backend real.

## Required Backend Contract (JSON)

```json
{
  "auth_contract": {
    "version": "1.0",
    "flow": "Frontend -> Backend -> OAuth Provider",
    "session_mechanism": "httpOnly cookie (backend-managed)",
    "endpoints": {
      "POST /api/v1/auth/login": {
        "description": "Email/password login",
        "request": {
          "body": { "email": "string", "password": "string" }
        },
        "response_200": {
          "body": { "user": { "email": "string", "name": "string|null" } }
        },
        "response_401": {
          "body": { "error": "Invalid email or password" }
        },
        "side_effect": "Sets httpOnly session cookie"
      },
      "POST /api/v1/auth/signup": {
        "description": "Create account",
        "request": {
          "body": { "email": "string", "password": "string", "name": "string|null" }
        },
        "response_201": {
          "body": { "user": { "email": "string", "name": "string|null" } }
        },
        "response_409": {
          "body": { "error": "An account with this email already exists" }
        },
        "response_422": {
          "body": { "error": "Password must be at least 8 characters" }
        },
        "side_effect": "Sets httpOnly session cookie"
      },
      "GET /api/v1/auth/oauth/:provider": {
        "description": "Initiate OAuth flow (redirect to provider)",
        "params": { "provider": "google|linkedin|microsoft" },
        "response_302": "Redirect to OAuth provider authorize URL",
        "requirements": ["PKCE code_challenge", "state parameter for CSRF"]
      },
      "GET /api/v1/auth/callback": {
        "description": "OAuth callback (provider redirects here)",
        "query": { "code": "string", "state": "string" },
        "response_302": "Redirect to frontend / with httpOnly cookie set",
        "response_401": { "body": { "error": "OAuth authentication failed" } }
      },
      "GET /api/v1/auth/session": {
        "description": "Check current session",
        "response_200": {
          "body": { "user": { "email": "string", "name": "string|null" } }
        },
        "response_401": {
          "body": { "user": null }
        },
        "note": "Reads httpOnly cookie, no token in request body"
      },
      "DELETE /api/v1/auth/session": {
        "description": "Logout (destroy session)",
        "response_200": {
          "body": { "success": true }
        },
        "side_effect": "Clears httpOnly session cookie"
      }
    },
    "security_requirements": {
      "tokens": "NEVER in localStorage -- httpOnly cookies only",
      "csrf": "state parameter in OAuth + CSRF token in forms",
      "pkce": "code_verifier + code_challenge (RFC 7636)",
      "cors": "Allow only frontend origin",
      "rate_limiting": "5 login attempts per minute per IP"
    }
  }
}
```

## Migration Plan: Mock -> Real

| Phase | Action | Frontend Changes | Backend Required |
|-------|--------|-----------------|-----------------|
| **1** | Create `RealOAuthService` class | New file implementing `OAuthService` interface | Endpoints ready |
| **2** | Feature flag switch | `oauth.ts`: `isOAuthEnabled ? new RealOAuthService() : new MockOAuthService()` | None |
| **3** | Replace localStorage session | AuthProvider reads from `GET /api/v1/auth/session` instead of `loadSession()` | Session endpoint |
| **4** | Remove mock login/signup | AuthForm calls real endpoints instead of `mockLogin()`/`mockSignup()` | Login/signup endpoints |
| **5** | Implement OAuth redirect | `initiateOAuth()` -> `window.location.href = /api/v1/auth/oauth/:provider` | OAuth endpoints |
| **6** | Remove localStorage persistence | Delete `session.ts`, cross-tab sync via cookie | Cookie-based session |
| **7** | Update E2E tests | Mock API responses with Playwright route interception | Staging environment |

**Esfuerzo estimado:** 1-2 sprints (con backend listo).

## Key Frontend Files to Modify

| File | Current | After Migration |
|------|---------|----------------|
| `src/services/auth/oauth.ts` | `MockOAuthService` | `RealOAuthService` + feature flag |
| `src/services/auth/session.ts` | localStorage read/write | DELETE (cookie-managed) |
| `src/state/providers/AuthProvider/index.tsx` | `loadSession()` from localStorage | `GET /api/v1/auth/session` on mount |
| `src/services/auth/mock.ts` | Active | Kept for dev/test only |
| `src/services/auth/types.ts` | `OAuthService` interface | No change (already correct) |
| `e2e/auth.spec.ts` | Tests mock flow | Mock API via Playwright `page.route()` |
