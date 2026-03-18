# Tasks: Add Plausible Analytics (npm)

## Phase 1: Foundation

- [x] 1.1 Add Plausible tracker dependency to `package.json` (e.g., `plausible-tracker`) and lockfile via install.
- [x] 1.2 Create `src/services/analytics/plausible.ts` with production-only guard, `AnalyticsEventName`, `AnalyticsEventProps`, `initPlausible()`, and `trackEvent()`.
- [x] 1.3 Create `src/services/analytics/index.ts` to export analytics service APIs.
- [x] 1.4 Update `.env.template` with `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and `NEXT_PUBLIC_PLAUSIBLE_HOST` defaults.

## Phase 2: Core Implementation (Initialization)

- [x] 2.1 Update `src/providers/RootProvider/index.tsx` to call `initPlausible()` in a client-only `useEffect` and ensure it runs once.

## Phase 3: Core Implementation (Instrumentation)

- [x] 3.1 Update `src/ui/atoms/buttons/ArrowButton/index.tsx` to accept optional `onClick` and wire through.
- [x] 3.2 Update `src/ui/molecules/Resume/Button.tsx` to track `cta_resume_click` with label/href when the resume CTA is clicked.
- [x] 3.3 Update `src/ui/atoms/links/CalendarLink/index.tsx` to track `cta_book_call_click` with label/href.
- [x] 3.4 Update `src/ui/molecules/Telegram/Link.tsx` to track `cta_contact_click` (or `social_click` per design) with label/href.
- [x] 3.5 Update `src/ui/molecules/CopyEmail/EmailLink.tsx` to track `cta_contact_click` on mailto click.
- [x] 3.6 Update `src/ui/molecules/HireMe/index.tsx` to track `cta_contact_click` with label/href.
- [x] 3.7 Update `src/ui/atoms/links/NavigationItemLink/index.tsx` to call `trackEvent` for `nav_primary_click`/`nav_menu_click` based on a new `source` or context prop.
- [x] 3.8 Update `src/ui/organisms/Menu/index.tsx` to pass nav source metadata for primary navigation events.
- [x] 3.9 Update `src/ui/organisms/MenuFloatingClient/index.tsx` to pass nav source metadata for menu navigation events.
- [x] 3.10 Update `src/ui/organisms/MobileMenuOverlay/index.tsx` to pass nav source metadata for menu navigation events.
- [x] 3.11 Update `src/ui/molecules/SocialNetworkLink/index.tsx` to track `social_click` with provider label and href.
- [x] 3.12 Update `src/ui/organisms/Footer/index.tsx` to track `nav_footer_click` for footer navigation links.
- [x] 3.13 Update `src/ui/organisms/ArticleContent/index.tsx` to emit `article_view` on client render with slug.
- [x] 3.14 Update `src/ui/organisms/ProjectDetail/index.tsx` to emit `project_view` on client render and track demo/repo clicks.
- [x] 3.15 Update `src/ui/organisms/ProjectCard/ActionLinks.tsx` to track `project_demo_click` and `project_architecture_click`.
- [x] 3.16 Update `src/ui/molecules/Experience/index.tsx` to track `details_expand` with section/label.
- [x] 3.17 Update `src/ui/molecules/Education/index.tsx` to track `details_expand` with section/label.

## Phase 4: Testing and Verification

- [x] 4.1 Add unit tests for `src/services/analytics/plausible.ts` verifying production-only init and no-op behavior (spec scenarios: Initialize analytics in production; Skip initialization outside production; Missing configuration prevents initialization; No-op tracking in development/tests).
- [x] 4.2 Add unit tests for `src/services/analytics/plausible.ts` verifying domain/host config is passed to tracker when both env vars set (spec scenario: Configure tracker with domain and host).
- [x] 4.3 Add component tests for `src/ui/organisms/ProjectCard/ActionLinks.tsx` to assert `trackEvent` calls for `project_demo_click` and `project_architecture_click` with props (spec scenario: Track a CTA click with properties).
- [x] 4.4 Add component tests for `src/ui/molecules/Experience/index.tsx` to assert `details_expand` event fires on expand with section/label (spec scenario: Track an event without optional properties).
- [x] 4.5 Add component tests for `src/ui/molecules/Education/index.tsx` to assert `details_expand` event fires on expand with section/label (spec scenario: Track an event without optional properties).
- [x] 4.6 Add integration test for `src/providers/RootProvider/index.tsx` to assert `initPlausible` called once on client render (spec scenario: Initialize analytics in production).

## Phase 5: Cleanup

- [ ] 5.1 Ensure any new analytics exports are used consistently (remove unused imports/props) across touched files.
