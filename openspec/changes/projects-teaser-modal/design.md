# Design: Projects Teaser Modal

## Technical Approach

Introduce an explicit `status` field in the Project domain model and use it to gate navigation for project cards. Non-live cards open a teaser modal built on the existing `Floating` overlay pattern with a single CTA that opens the ChatOverlay contact form and passes project context via chat panel state. Contact submissions move to a server-side `/api/messages` handler that validates payloads, applies honeypot/timing guards, enforces Upstash rate limiting, and delivers email through Postmark. Analytics events are emitted for teaser interactions and contact outcomes using the existing plausible event typing, with server-side tracking for submission outcomes to avoid disclosing anti-spam signals.

## Architecture Decisions

### Decision: Add explicit project status to domain model

**Choice**: Extend `ProjectSchema` with `status: "live" | "in-progress" | "planned"` and update mocks.
**Alternatives considered**: Infer status from ribbon variant; add a generic boolean `isClickable`.
**Rationale**: Status is domain intent and supports consistent UI gating, validation, and future policy (SEO, filtering). This aligns with the proposal and avoids coupling behavior to visual ribbons.

### Decision: Teaser modal as overlay component tied to ProjectCard

**Choice**: Add a `ProjectTeaserOverlay` component (local to ProjectCard) that renders within `Floating` (and `FloatingMobile` if needed by breakpoint) and is controlled by card-level state.
**Alternatives considered**: Reuse ArchitectureOverlay directly; create a global overlay in `src/ui/overlays/`.
**Rationale**: Project teaser is tightly scoped to project cards and shares similar behavior with `ArchitectureOverlay` (modal lifecycle, focus management). Keeping it near ProjectCard reduces cross-area coupling while still using the established overlay pattern.

### Decision: Chat context stored in chat panel state

**Choice**: Extend `chatPanel` slice to include `context` (e.g., `projectName`, `source`) and add actions to set/clear it. The teaser CTA sets context before opening the chat panel; `ChatBox` reads the context and injects it into form data.
**Alternatives considered**: Pass context through component props only; encode as query param; store in local component state only.
**Rationale**: ChatOverlay is opened from multiple entry points; a store-level context avoids prop-drilling and aligns with the existing panel state architecture.

### Decision: Server-side analytics for contact outcomes

**Choice**: Add a lightweight server analytics helper to send plausible events for `message_sent`, `spam_blocked`, and `rate_limited` from the API route.
**Alternatives considered**: Emit only client-side events based on API response; return explicit spam flags to client.
**Rationale**: The contact spec discourages disclosing anti-spam triggers in responses, so server-side event emission preserves observability without leaking details.

## Data Flow

ProjectCard (Grid/Featured)
├─ if status === "live" → Link → /projects/[slug]
└─ if status !== "live" → open ProjectTeaserOverlay
└─ CTA click → set chatPanel.context + openChatPanel
└─ ChatOverlay → ChatBox → POST /api/messages
├─ validate payload (zod)
├─ honeypot + timing guards
├─ Upstash rate limit
├─ Postmark send
└─ server analytics event

## File Changes

| File                                                          | Action | Description                                                                 |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| `src/domains/project/model/schema.ts`                         | Modify | Add `status` enum field to `ProjectSchema` and exported type.               |
| `src/domains/project/model/mock.ts`                           | Modify | Populate `status` for all project fixtures.                                 |
| `src/ui/organisms/ProjectCard/ProjectCard.types.ts`           | Modify | Ensure `ProjectModel` includes status; no new prop surface needed.          |
| `src/ui/organisms/ProjectCard/variants/Grid.tsx`              | Modify | Gate navigation for non-live status; open teaser modal instead of `Link`.   |
| `src/ui/organisms/ProjectCard/variants/Featured.tsx`          | Modify | Same gating as grid; integrate teaser modal state.                          |
| `src/ui/organisms/ProjectCard/ProjectTeaserOverlay.tsx`       | Create | Teaser modal UI using `Floating` (optional `FloatingMobile`) with CTA.      |
| `src/ui/organisms/ProjectCard/styles.css`                     | Modify | Add teaser modal styling and non-link card affordances.                     |
| `src/state/slices/chatPanel/slice.ts`                         | Modify | Add `context` field and actions to set/clear it.                            |
| `src/state/slices/chatPanel/hooks.ts`                         | Modify | Expose context helpers to UI.                                               |
| `src/ui/organisms/Chat/ChatBox.tsx`                           | Modify | Include hidden fields for `projectName`, `source`, `formStart`, `honeypot`. |
| `src/app/api/messages/route.ts`                               | Create | POST handler for contact submissions.                                       |
| `src/services/contact/schema.ts`                              | Create | Zod validation for contact payload.                                         |
| `src/services/contact/postmark.ts`                            | Create | Postmark client send helper.                                                |
| `src/services/contact/rateLimit.ts`                           | Create | Upstash rate limiter wrapper.                                               |
| `src/services/analytics/plausible.ts`                         | Modify | Add new event names to `AnalyticsEventName`.                                |
| `src/services/analytics/server.ts`                            | Create | Server-side event sender for plausible host.                                |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | Modify | Assert gating for non-live; teaser CTA opens chat panel.                    |
| `src/services/analytics/__tests__/plausible.test.ts`          | Modify | Update event union tests if needed.                                         |
| `src/app/api/messages/__tests__/route.test.ts`                | Create | API tests for validation, rate limit, honeypot, Postmark failures.          |
| `.env.template`                                               | Modify | Add Postmark and Upstash env vars.                                          |

## Interfaces / Contracts

```ts
// src/domains/project/model/schema.ts
export const ProjectStatusSchema = z.enum(["live", "in-progress", "planned"]);
export type ProjectStatusModel = z.infer<typeof ProjectStatusSchema>;

export const ProjectSchema = z.object({
  // ...existing fields
  status: ProjectStatusSchema,
});
```

```ts
// src/state/slices/chatPanel/slice.ts
export interface ChatPanelState {
  isOpen: boolean;
  context?: {
    projectName?: string;
    source?: "project_teaser" | "header" | "footer";
  };
}
```

```ts
// src/services/contact/schema.ts
export const ContactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1).max(4500),
  projectName: z.string().optional(),
  jobTypes: z.array(z.string()).optional(),
  formStart: z.coerce.number().optional(),
  honeypot: z.string().optional(),
});
```

```ts
// src/app/api/messages/route.ts (response shape)
type ContactResponse =
  | { ok: true }
  | { ok: false; error: "invalid" | "rate_limited" | "provider_error" };
```

## Testing Strategy

| Layer       | What to Test                    | Approach                                                      |
| ----------- | ------------------------------- | ------------------------------------------------------------- |
| Unit        | Project schema validates status | Update schema tests or add new unit tests.                    |
| Unit        | Teaser gating logic             | ProjectCard tests to assert link removal and modal open.      |
| Unit        | Analytics event typing          | Extend plausible tests to include new event names.            |
| Integration | Contact API validation          | Jest tests for `/api/messages` using mocked Postmark/Upstash. |
| Integration | Honeypot + timing guard         | Verify spam path returns generic response and no send.        |
| E2E         | Teaser CTA opens ChatOverlay    | Playwright for modal open and chat panel open.                |

## Migration / Rollout

No migration required. Add new env vars to `.env.template`. If Postmark/Upstash vars are absent, API should return a controlled error and log via `logger`.

## Open Questions

- [ ] Confirm desired rate limit values (e.g., 5/min per IP) and timing guard threshold (e.g., 3s).
- [ ] Confirm whether attachments should be forwarded to Postmark or ignored server-side.
- [ ] Confirm CTA label and teaser copy (copy is currently undefined in specs).
