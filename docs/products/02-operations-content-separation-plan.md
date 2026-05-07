# Operations vs Content Dashboard Separation Plan

## Goal

Separate admin surfaces into two clear dashboards:

- **Operations**: overview, orders, subscriptions, users.
- **Content Dashboard**: profile (site profile, not admin user), job experiences, projects, articles, word cloud content.

This split reduces cognitive load and avoids mixing operational flows with editorial workflows.

## Current State

- `src/app/admin/layout.tsx` currently includes:
  - Overview (`/admin`)
  - Orders (`/admin/orders`)
  - Subscriptions (`/admin/subscriptions`)
  - Users (`/admin/users`)
  - Settings (`/admin/settings`)
- `src/app/admin/settings/page.tsx` manages public profile/contact channels and behaves as content configuration.

## Target Information Architecture

### Operations Console (keep under `/admin`)

- `/admin` (Overview)
- `/admin/orders`
- `/admin/subscriptions`
- `/admin/users`

### Content Dashboard (new namespace)

- `/admin/content` (Content overview)
- `/admin/content/profile`
- `/admin/content/job-experiences`
- `/admin/content/projects`
- `/admin/content/articles`
- `/admin/content/word-cloud`

## Route and Layout Strategy

1. Keep `src/app/admin/layout.tsx` focused on operations-only nav.
2. Add `src/app/admin/content/layout.tsx` with content-specific nav.
3. Add cross-links between consoles:
   - Operations header includes "Go to Content Dashboard".
   - Content header includes "Go to Operations Console".
4. Move or replace `/admin/settings` with `/admin/content/profile`.
5. Keep temporary compatibility redirect from `/admin/settings` for transition.

## API Namespace Strategy

Standardize content admin APIs under `/api/admin/content/*`:

- `/api/admin/content/profile`
- `/api/admin/content/job-experiences`
- `/api/admin/content/projects`
- `/api/admin/content/articles`
- `/api/admin/content/word-cloud`

Guidelines:

- Keep `requireAdmin` for every admin content endpoint.
- Validate payloads with Zod.
- Use existing runtime split (`memory` for tests, `postgres` for runtime).
- Keep response contracts explicit and stable across entities.

## Implementation Phases

### Phase 1: Navigation and Structure

- [x] Introduce `/admin/content` route group and layout.
- [x] Update operations nav to remove content settings link.
- [x] Add cross-links between operations and content dashboards.
- [x] Add redirect from `/admin/settings` to `/admin/content/profile`.

### Phase 2: Content Profile

- [x] Move current general settings form into `/admin/content/profile`.
- [x] Keep behavior unchanged (public contact/social channels).

### Phase 3: Job Experiences

- [x] Add admin list/edit/publish UI for job experiences.
- [x] Back with `/api/admin/content/job-experiences` endpoints.

### Phase 4: Projects

- [x] Add admin list/edit/publish/reorder UI for projects.
- [x] Back with `/api/admin/content/projects` endpoints.

### Phase 5: Articles

- [ ] Add admin list/edit/publish UI for articles.
- [ ] Back with `/api/admin/content/articles` endpoints.

### Phase 6: Word Cloud

- [ ] Add admin edit UI for word cloud terms/weights/categories.
- [ ] Back with `/api/admin/content/word-cloud` endpoints.

## Testing Strategy

- **Unit/API tests** for each new `/api/admin/content/*` route.
- **Page tests** for operations and content layouts/nav separation.
- **Smoke E2E** for:
  - admin access to `/admin/*`
  - admin access to `/admin/content/*`
  - transition links between both consoles
  - one successful content edit and persistence check
- Keep CI aligned with `DB_DRIVER=memory` for deterministic tests.

## Rollout Plan

1. PR 1: IA + routes + layouts + nav split + `/admin/settings` redirect.
2. PR 2: `/admin/content/profile` migration.
3. PR 3+: one entity per PR (job experiences, projects, articles, word cloud).
4. Remove legacy `/admin/settings` route once all links/bookmarks are migrated.

## Acceptance Criteria

- Operations and content are separated into different dashboards and menus.
- Operations routes continue to work unchanged.
- Content entities are reachable from `/admin/content/*`.
- Existing auth/authorization behavior remains intact.
- Lint, typecheck, and relevant tests pass in CI.

## Open Decision

- Recommended namespace: `/admin/content/*`.
- Alternative (not selected): `/content-admin/*`.

Using `/admin/content/*` keeps a single admin boundary, simplifies guard reuse, and avoids duplicate top-level concepts.
