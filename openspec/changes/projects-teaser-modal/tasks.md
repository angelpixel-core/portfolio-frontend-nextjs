# Tasks: Projects Teaser Modal

## Phase 1: Foundation

- [ ] 1.1 Update `src/domains/project/model/schema.ts` to add `ProjectStatusSchema` enum and `status` field on `ProjectSchema`.
- [ ] 1.2 Update `src/domains/project/model/mock.ts` to assign `status` for every mock project fixture.
- [ ] 1.3 Update `src/ui/organisms/ProjectCard/ProjectCard.types.ts` to ensure project typing includes `status`.
- [ ] 1.4 Add contact validation schema in `src/services/contact/schema.ts` aligned to required fields and guards.
- [ ] 1.5 Add Postmark client helper in `src/services/contact/postmark.ts` with env-configured sender/recipient.
- [ ] 1.6 Add Upstash rate limiter wrapper in `src/services/contact/rateLimit.ts` using sliding window.
- [ ] 1.7 Add server analytics helper in `src/services/analytics/server.ts` to emit plausible events.
- [ ] 1.8 Extend `src/services/analytics/plausible.ts` event union with teaser/contact outcome names.
- [ ] 1.9 Update `.env.template` with Postmark and Upstash variables required by the API route.

## Phase 2: Core UI Behavior

- [ ] 2.1 Create `src/ui/organisms/ProjectCard/ProjectTeaserOverlay.tsx` using `Floating` (and `FloatingMobile` if needed) with CTA and copy placeholders.
- [ ] 2.2 Update `src/ui/organisms/ProjectCard/variants/Grid.tsx` to gate navigation by `status` and open teaser overlay for non-live.
- [ ] 2.3 Update `src/ui/organisms/ProjectCard/variants/Featured.tsx` to mirror gating and teaser overlay behavior.
- [ ] 2.4 Update `src/ui/organisms/ProjectCard/styles.css` with teaser modal styles and non-link affordances.
- [ ] 2.5 Update `src/state/slices/chatPanel/slice.ts` to add `context` and actions for set/clear.
- [ ] 2.6 Update `src/state/slices/chatPanel/hooks.ts` to expose context setters/getters for UI use.
- [ ] 2.7 Update `src/ui/organisms/Chat/ChatBox.tsx` to include hidden fields (`projectName`, `source`, `formStart`, `honeypot`) and to read context.

## Phase 3: Server Contact Flow

- [ ] 3.1 Create `src/app/api/messages/route.ts` POST handler to validate payload, enforce honeypot/timing guard, rate limit, send via Postmark, and emit server analytics.
- [ ] 3.2 Ensure API response conforms to `{ ok: true } | { ok: false; error: "invalid" | "rate_limited" | "provider_error" }` and avoids disclosing spam triggers.
- [ ] 3.3 Wire teaser CTA to set chat context (`projectName`, `source: "project_teaser"`) and open chat panel; emit `teaser_opened` and `teaser_cta_clicked` events from UI.

## Phase 4: Testing & Verification

- [ ] 4.1 Update `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` to cover live navigation vs non-live teaser modal open and CTA opening chat overlay.
- [ ] 4.2 Add `src/app/api/messages/__tests__/route.test.ts` to cover validation failure, honeypot spam path, timing guard, rate limit rejection, Postmark success, and provider failure.
- [ ] 4.3 Update `src/services/analytics/__tests__/plausible.test.ts` to include new teaser/contact event names.
- [ ] 4.4 Add/extend Playwright spec to validate teaser CTA opens ChatOverlay for non-live project cards.

## Phase 5: Cleanup & Docs

- [ ] 5.1 Update any relevant docs or comments for contact endpoint usage if referenced (e.g., API docs or README pointers).
