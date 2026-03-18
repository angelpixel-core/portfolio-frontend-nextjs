# Proposal: Add Plausible Analytics (npm)

## Intent

Add privacy-friendly analytics with Plausible (npm tracker) to measure core portfolio interactions in production only, so we can understand CTA performance and content engagement without affecting local/dev behavior.

## Scope

### In Scope

- Add Plausible tracker via npm with production-only initialization.
- Configure Plausible `data-domain` as `angelpixel.io` and host `https://plausible.io` using env variables.
- Implement a minimal analytics service wrapper with typed helper for custom events.
- Instrument key CTA, navigation, and content engagement events (see taxonomy below).
- Document env keys in `.env.template`.

### Out of Scope

- Historical migration from any existing analytics.
- Advanced funnel dashboards or reporting setup in Plausible UI.
- Tracking in non-production environments.

### Recommended Event Taxonomy (CTA / Navigation / Content)

**CTA**

- `cta_resume_click` — resume button.
- `cta_book_call_click` — calendar/book-a-call link.
- `cta_contact_click` — contact email or primary contact CTA.

**Navigation**

- `nav_primary_click` — header/main nav links.
- `nav_menu_click` — mobile/menu links.
- `nav_footer_click` — footer navigation links.

**Content & Engagement**

- `article_view` — article detail page view.
- `project_view` — project detail page view.
- `project_demo_click` — demo link click on project detail/card.
- `project_architecture_click` — architecture link click.
- `details_expand` — expand/collapse details in timeline or cards.
- `social_click` — social link click (github/linkedin/etc.).

**Recommended properties** (when available): `label`, `href`, `slug`, `section`, `source`.

## Approach

1. Add Plausible npm package and create `src/services/analytics/plausible.ts` with:
   - `initPlausible()` that only runs when `process.env.NODE_ENV === "production"` and envs exist.
   - `trackEvent(name, props?)` wrapper that safely no-ops in dev/local.
2. Register analytics initialization in `src/providers/RootProvider/index.tsx` (client-side) so it runs once.
3. Add event calls to CTA and navigation components (resume, calendar/book call, nav links, social links).
4. Fire page-view style events on article/project detail pages for `article_view` / `project_view`.
5. Add env keys to `.env.template`:
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=angelpixel.io`
   - `NEXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io`

## Affected Areas

| Area                                              | Impact   | Description                                        |
| ------------------------------------------------- | -------- | -------------------------------------------------- |
| `src/providers/RootProvider/index.tsx`            | Modified | Initialize Plausible on client in production only. |
| `src/services/analytics/plausible.ts`             | New      | Wrapper for Plausible init and custom events.      |
| `src/ui/molecules/Resume/Button.tsx`              | Modified | Track `cta_resume_click`.                          |
| `src/ui/atoms/links/CalendarLink/index.tsx`       | Modified | Track `cta_book_call_click`.                       |
| `src/ui/atoms/links/NavigationItemLink/index.tsx` | Modified | Track `nav_primary_click` / `nav_menu_click`.      |
| `src/ui/organisms/MenuFloatingClient/index.tsx`   | Modified | Track menu navigation events.                      |
| `src/ui/molecules/SocialNetworkLink/index.tsx`    | Modified | Track `social_click`.                              |
| `src/app/articles/[slug]/page.tsx`                | Modified | Fire `article_view`.                               |
| `src/app/projects/[slug]/page.tsx`                | Modified | Fire `project_view` and project link events.       |
| `.env.template`                                   | Modified | Add Plausible env keys.                            |

## Risks

| Risk                              | Likelihood | Mitigation                                                              |
| --------------------------------- | ---------- | ----------------------------------------------------------------------- |
| Events fire in dev/local or tests | Low        | Guard initialization and `trackEvent` with `NODE_ENV === "production"`. |
| Missing/incorrect domain or host  | Low        | Validate envs before init; fallback to no-op.                           |
| Over-instrumentation noise        | Medium     | Start with recommended taxonomy only; keep event names consistent.      |

## Rollback Plan

Remove Plausible initialization from `src/providers/RootProvider/index.tsx`, delete `src/services/analytics/plausible.ts`, and revert event calls from CTA/navigation/content components. Remove env keys from `.env.template` and uninstall the Plausible npm dependency.

## Dependencies

- Plausible npm tracker package (e.g., `plausible-tracker`).

## Success Criteria

- [ ] Plausible tracker loads only in production and does not run in dev/local.
- [ ] Plausible dashboard shows events for CTA, navigation, and content interactions with expected names.
- [ ] No console errors or runtime warnings introduced by analytics integration.
