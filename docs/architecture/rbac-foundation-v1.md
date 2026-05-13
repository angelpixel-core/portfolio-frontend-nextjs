# RBAC Foundation v1

Date: 2026-05-13

## Purpose

Establish a minimal, explicit authorization model that separates roles from permissions and maps app actions/routes to required capabilities.

## Concepts

- Role: identity group assignment (`admin`, `operator`, `guest`).
- Permission: capability string required for an action.
- Action: page/API operation that checks one permission.
- Tier/Plan: commercial packaging (out of scope for admin RBAC v1).

## Role Hierarchy

- `admin` > `operator` > `guest`

Hierarchy means higher roles inherit all permissions from lower roles.

## Permission Set (v1)

- `admin.panel.access`
- `content.read`
- `content.write`
- `orders.manage`
- `subscriptions.manage`
- `resume.requests.manage`
- `settings.manage`

## Role -> Permission Matrix (v1)

| Role | Permissions |
| --- | --- |
| `admin` | all permissions |
| `operator` | `admin.panel.access`, `content.read`, `content.write`, `orders.manage`, `subscriptions.manage`, `resume.requests.manage` |
| `guest` | none of admin permissions |

## Route/Action -> Permission Mapping (initial)

### Admin pages

- `/admin` -> `admin.panel.access`
- `/admin/content/**` -> `content.read` (page access), `content.write` (mutations)
- `/admin/orders/**` -> `orders.manage`
- `/admin/subscriptions/**` -> `subscriptions.manage`
- `/admin/resume-request/**` -> `resume.requests.manage`
- `/admin/settings/**` -> `settings.manage`

### Admin APIs

- `/api/admin/content/**` -> `content.write` (GET can use `content.read` where applicable)
- `/api/admin/orders/**` -> `orders.manage`
- `/api/admin/subscriptions/**` -> `subscriptions.manage`
- `/api/admin/resume-request/**` -> `resume.requests.manage`
- `/api/admin/settings/**` -> `settings.manage`

## Transitional Role Resolution (v1)

Until role persistence exists in session/profile tables, resolve role from env allowlists:

- `ADMIN_EMAILS` -> role `admin`
- `OPERATOR_EMAILS` -> role `operator`
- otherwise -> role `guest`

This keeps backward compatibility with current `requireAdmin` behavior while enabling progressive migration.

## Implementation Slices

### RBAC-01 (foundation only)

- Add `application/authz` module with:
  - `roles.ts`
  - `permissions.ts`
  - `policy.ts` (`hasPermission(role, permission)`)
  - `resolveRole.ts` (allowlist-based transitional resolver)

### RBAC-02 (enforcement migration)

- Introduce `requirePermission(permission)` and route page/API calls through it.
- Migrate `requireAdmin()` callsites incrementally.

### RBAC-03 (hardening)

- Remove legacy admin-only checks.
- Add tests per protected surface.
- Add lint/docs checks for new protected routes.

## Testing Requirements

- Unit tests:
  - role resolution
  - role-permission matrix behavior
  - permission inheritance
- Integration tests:
  - representative admin page access for each role
  - representative admin API access for each role

## Non-Goals (v1)

- Subscription/paywall entitlement logic.
- Product-tier-based feature gating.
- Multi-tenant/team-scoped authorization.
