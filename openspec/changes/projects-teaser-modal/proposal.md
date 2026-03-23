# Proposal: Projects Teaser Modal

## Intent

Provide a clear, data-driven experience for non-live projects by replacing direct navigation with a teaser modal that routes users into the ChatOverlay contact form, while protecting email delivery from spam and abuse.

## Scope

### In Scope

- Add explicit project `status` field to the domain model and use it to gate card click behavior.
- Introduce a teaser modal for `status !== "live"` projects with a CTA that opens the ChatOverlay contact form.
- Add server-side contact delivery via Postmark with Upstash rate limiting and baseline anti-spam measures.
- Instrument teaser/contact analytics events aligned with existing plausible event typing.
- Update tests to reflect link gating, modal behavior, and contact submission guards.

### Out of Scope

- Changing project detail page access control beyond card gating (direct slug access remains).
- Full CAPTCHA integration (reserved for escalation if abuse persists).
- New design system for overlays beyond the existing Floating/FloatingMobile patterns.

## Approach

- **Status modeling**: add `status: "live" | "in-progress" | "planned"` to the Project schema and mock data. Use status to determine link vs. modal behavior and keep ribbon as purely visual (optionally default ribbon for non-live statuses).
- **Modal and CTA behavior**: when a non-live card is clicked, open a teaser modal (Floating/FloatingMobile) with context and a single CTA that opens the ChatOverlay contact form (pre-fill project name if available). No navigation occurs for non-live projects.
- **Contact delivery**: implement a server-side contact handler using Postmark; include environment variables for API key and sender/recipient addresses.
- **Rate limiting**: use Upstash Redis with `@upstash/ratelimit` sliding window (e.g., 5/min per IP) for `/api/send-contact` or server action.
- **Anti-spam measures**: zod validation, honeypot field, timing guard, and silent ignore for honeypot hits; log/track `spam_blocked`, `rate_limited`, and `message_sent` analytics events.
- **Testing notes**: update unit tests for ProjectCard variants to assert link removal and modal open for non-live statuses; add/extend contact handler tests for rate limit and honeypot; update E2E flows if CTA touches chat overlay.

## Affected Areas

| Area                                                          | Impact       | Description                                                        |
| ------------------------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| `src/ui/organisms/ProjectCard/variants/Grid.tsx`              | Modified     | Gate card navigation and trigger teaser modal for non-live status. |
| `src/ui/organisms/ProjectCard/variants/Featured.tsx`          | Modified     | Align featured card behavior with status gating and teaser modal.  |
| `src/ui/organisms/ProjectCard/ProjectCard.types.ts`           | Modified     | Add `status` to props/model typing.                                |
| `src/domains/project/model/schema.ts`                         | Modified     | Add `status` field to schema/type.                                 |
| `src/domains/project/model/mock.ts`                           | Modified     | Populate `status` for mock projects.                               |
| `src/ui/overlays/Floating/index.tsx`                          | Modified/New | Host teaser modal layout in existing overlay system.               |
| `src/services/contact/*`                                      | New          | Postmark client, schema validation, rate limit helper.             |
| `src/services/analytics/plausible.ts`                         | Modified     | Add teaser and anti-spam analytics events.                         |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | Modified     | Assert gating and modal behavior.                                  |

## Risks

| Risk                                        | Likelihood | Mitigation                                                                   |
| ------------------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| Touch behavior blocks modal trigger         | Medium     | Validate `useTouchState` handling for non-link elements; add targeted tests. |
| Rate limiting false positives in shared IPs | Low/Med    | Start with conservative limits and monitor analytics.                        |
| Postmark delivery failures or misconfig     | Medium     | Add clear error responses and logging for support visibility.                |

## Rollback Plan

Revert status gating to link behavior, remove teaser modal triggers, and disable contact handler endpoints. Restore existing `ProjectCard` behavior and analytics events, and roll back Postmark/Upstash integrations if needed.

## Dependencies

- Postmark API key and sender/recipient configuration in environment variables.
- Upstash Redis REST URL and token for rate limiting.

## Success Criteria

- [ ] Non-live project cards open teaser modal instead of navigating.
- [ ] Teaser CTA opens ChatOverlay contact form with project context.
- [ ] Contact submissions are rate limited and protected by honeypot + timing guard.
- [ ] Postmark emails send successfully in local/preview and production environments.
- [ ] Tests updated to reflect new modal and contact behavior.
