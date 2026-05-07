# Resume Request Single-Use Link Plan

## Goal

Enable operations to generate single-use public links (no login required) so a recipient can submit a resume request with an email form, and persist the request in the database.

## Scope Summary

- Public access via tokenized link (no authentication).
- Link can be used once only.
- Link expires either when submitted successfully or when validity window ends.
- Operations can revoke links manually.
- Operations section for Resume Request will contain two subsections:
  - Invite Links
  - Submissions

## Functional Decisions

1. Public route uses token and no login.
2. Form fields:
   - Required: `email`
   - Optional: `context`, `role`, `company`, `notes`
   - `name` is prefilled from link creation and is read-only (user cannot edit).
3. A user can request the resume multiple times across different links.
4. Link invalidation rules:
   - invalid after successful submit
   - invalid after expiration date
   - invalid after manual revoke
5. Default TTL is 7 days; operator can configure per-link TTL.
6. Link creation is one-by-one (no batch mode).
7. On submit, persist to DB with status `requested` and origin `on_demand_link`.
8. Keep existing `activity` table as historical log, and add dedicated tables for links + submissions.

## Data Model Plan

### New table: `resume_request_link`

- `id` (uuid, primary key)
- `token_hash` (unique, required)
- `recipient_name` (required)
- `ttl_days` (required, default 7)
- `expires_at` (required)
- `used_at` (nullable)
- `revoked_at` (nullable)
- `created_by_admin_email` (required)
- `created_at`, `updated_at`

Indexes/constraints:

- unique index on `token_hash`
- index on `expires_at`
- index on `used_at`
- index on `revoked_at`

### New table: `resume_request_submission`

- `id` (uuid, primary key)
- `link_id` (foreign key -> `resume_request_link.id`, required)
- `email` (required)
- `name` (required, copied from link recipient)
- `context` (nullable)
- `role` (nullable)
- `company` (nullable)
- `notes` (nullable)
- `status` (required, enum-like text; initial value `requested`)
- `origin` (required, value `on_demand_link`)
- `created_at`, `updated_at`

Indexes:

- index on `email`
- index on `status`
- index on `created_at`

## API Plan

### Admin APIs (protected)

- `POST /api/admin/resume-request/links`
  - input: `recipientName`, `ttlDays?`
  - output: link metadata + generated public URL
- `GET /api/admin/resume-request/links`
  - list links with computed state (`active`, `used`, `expired`, `revoked`)
- `POST /api/admin/resume-request/links/[id]/revoke`
  - sets `revoked_at`
- `GET /api/admin/resume-request/submissions`
  - list received submissions

### Public APIs (no login)

- `GET /api/resume-request/public/[token]`
  - validates token and returns form bootstrap data (`recipientName`)
- `POST /api/resume-request/public/[token]`
  - validates token state
  - inserts `resume_request_submission`
  - marks link as used (`used_at`)
  - writes historical event into `activity` (`type=request_resume`, `status=requested`, `source=on_demand_link`)

## Public UI Plan

### Route

- `/resume-request/[token]`

### Behavior

- If token valid: render form
- If token invalid/expired/used/revoked: render explicit status message
- On success: confirmation state and no resubmit

### Form fields

- `email` (required)
- `name` (read-only, prefilled)
- `context` (optional)
- `role` (optional)
- `company` (optional)
- `notes` (optional)

## Operations UI Plan

Within existing operations Resume Request section, provide two subsections:

1. **Invite Links**
   - create link (recipient name + configurable TTL)
   - copy link
   - list links with state
   - revoke action
2. **Submissions**
   - list submitted requests
   - show email, prefilled name, optional metadata, status, origin, created date

## Security and Integrity

- Token storage must be hash-only (`token_hash`), never plain token.
- Generate cryptographically secure token (at least 32 random bytes).
- Validate and consume token in a single DB transaction to guarantee single-use behavior under concurrent requests.
- Keep errors generic on public endpoints to avoid leaking internal details.
- Optional next step: rate limit public submission endpoint.

## Implementation Phases

### Phase A: Schema and persistence

- Add schema definitions and SQL migrations for both tables.
- Add model/repository methods for create/list/revoke/consume.

### Phase B: API endpoints

- Implement admin endpoints.
- Implement public token validation and submission endpoint.

### Phase C: UI

- Build public token form route.
- Build operations subsections (Invite Links and Submissions).

### Phase D: Verification

- Unit/integration tests for token lifecycle and single-use semantics.
- Route tests for admin/public endpoints.
- E2E smoke for link creation -> submit -> invalidated reuse.

## Acceptance Criteria

- Operations can create single-use links with configurable TTL.
- Public user can submit resume request without login using valid link.
- Name appears prefilled and is not editable.
- Submitted link cannot be reused.
- Expired links are rejected.
- Revoked links are rejected.
- Request is persisted in dedicated submissions table and logged in `activity`.
- Operations can review links and submissions in separate subsections.
