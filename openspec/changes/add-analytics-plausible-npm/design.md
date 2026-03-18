# Design: Add Plausible Analytics (npm)

## Technical Approach

Integrate Plausible via npm using a small analytics service wrapper in `src/services/analytics/` that guards initialization and event dispatch to production-only. Initialize the tracker once from `src/providers/RootProvider/index.tsx` on the client. Instrument existing CTA, navigation, and content components with `trackEvent` calls, and emit view events inside client-rendered detail components (`ArticleContent`, `ProjectDetail`) so no server code tries to touch the browser.

## Architecture Decisions

### Decision: Use plausible-tracker npm with a thin service wrapper

**Choice**: Use the Plausible npm tracker (e.g. `plausible-tracker`) behind `src/services/analytics/plausible.ts` with `initPlausible()` and `trackEvent()`.
**Alternatives considered**: Directly loading the script tag in `app/layout.tsx`; using Plausible script snippet without a wrapper.
**Rationale**: The npm tracker avoids manual script tags and allows typed, centralized event dispatch with a no-op guard for dev/test. The wrapper aligns with existing service patterns and keeps UI components simple.

### Decision: Client-only initialization in RootProvider

**Choice**: Call `initPlausible()` in `src/providers/RootProvider/index.tsx` using a `useEffect` so it runs once per session on the client.
**Alternatives considered**: Initialize in `app/layout.tsx`; initialize in each page component.
**Rationale**: RootProvider is already the client boundary for global setup. Using `useEffect` ensures no SSR execution and keeps initialization centralized.

### Decision: Event hooks in components closest to interaction

**Choice**: Add `trackEvent()` calls in CTA/nav/content components (e.g., `NavigationItemLink`, `SocialNetworkLink`, `ProjectDetail`, `ArticleContent`, `Experience`, `Education`).
**Alternatives considered**: Centralized click delegation; route-level analytics wrapper.
**Rationale**: Localized handlers preserve existing component responsibilities and data access (labels, hrefs, slugs) with minimal refactors.

## Data Flow

Production-only initialization

    RootProvider (client) ──useEffect──→ initPlausible()
            │                              │
            │                              └── createPlausibleTracker({ domain, host })
            │
            └── UI events call trackEvent(name, props)

Event dispatch

    CTA/Nav/Content component ──onClick/useEffect──→ trackEvent()
            │
            └── analytics service (guarded) ──→ plausible tracker

## File Changes

| File                                              | Action | Description                                                                          |
| ------------------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| `src/services/analytics/plausible.ts`             | Create | Plausible wrapper with init + trackEvent, production guard, typed event names/props. |
| `src/services/analytics/index.ts`                 | Create | Export analytics service API from the analytics module.                              |
| `src/providers/RootProvider/index.tsx`            | Modify | Client-only `useEffect` to initialize Plausible once.                                |
| `src/ui/atoms/buttons/ArrowButton/index.tsx`      | Modify | Accept optional onClick to track CTA resume click.                                   |
| `src/ui/molecules/Resume/Button.tsx`              | Modify | Pass analytics handler to ArrowButton with `cta_resume_click`.                       |
| `src/ui/atoms/links/CalendarLink/index.tsx`       | Modify | Track `cta_book_call_click` with label/href.                                         |
| `src/ui/molecules/Telegram/Link.tsx`              | Modify | Track `cta_contact_click` or `social_click` with label/href.                         |
| `src/ui/molecules/CopyEmail/EmailLink.tsx`        | Modify | Track `cta_contact_click` on mailto click.                                           |
| `src/ui/molecules/HireMe/index.tsx`               | Modify | Track `cta_contact_click` (Hire Me) with label/href.                                 |
| `src/ui/atoms/links/NavigationItemLink/index.tsx` | Modify | Track `nav_primary_click` and `nav_menu_click` based on usage.                       |
| `src/ui/organisms/Menu/index.tsx`                 | Modify | Provide source prop for primary nav tracking.                                        |
| `src/ui/organisms/MenuFloatingClient/index.tsx`   | Modify | Provide source prop for menu nav tracking.                                           |
| `src/ui/organisms/MobileMenuOverlay/index.tsx`    | Modify | Provide source prop for menu nav tracking.                                           |
| `src/ui/molecules/SocialNetworkLink/index.tsx`    | Modify | Track `social_click` with provider label and href.                                   |
| `src/ui/organisms/Footer/index.tsx`               | Modify | Track `nav_footer_click` for footer links.                                           |
| `src/ui/organisms/ArticleContent/index.tsx`       | Modify | Emit `article_view` on client render (useEffect) with slug.                          |
| `src/ui/organisms/ProjectDetail/index.tsx`        | Modify | Emit `project_view` on client render; track demo/repo clicks.                        |
| `src/ui/organisms/ProjectCard/ActionLinks.tsx`    | Modify | Track `project_demo_click` and `project_architecture_click`.                         |
| `src/ui/molecules/Experience/index.tsx`           | Modify | Track `details_expand` when expanded.                                                |
| `src/ui/molecules/Education/index.tsx`            | Modify | Track `details_expand` when expanded.                                                |
| `.env.template`                                   | Modify | Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and `NEXT_PUBLIC_PLAUSIBLE_HOST`.                 |

## Interfaces / Contracts

```ts
// src/services/analytics/plausible.ts
export type AnalyticsEventName =
  | "cta_resume_click"
  | "cta_book_call_click"
  | "cta_contact_click"
  | "nav_primary_click"
  | "nav_menu_click"
  | "nav_footer_click"
  | "article_view"
  | "project_view"
  | "project_demo_click"
  | "project_architecture_click"
  | "details_expand"
  | "social_click";

export type AnalyticsEventProps = {
  label?: string;
  href?: string;
  slug?: string;
  section?: string;
  source?: string;
};

export const initPlausible: () => void;
export const trackEvent: (
  name: AnalyticsEventName,
  props?: AnalyticsEventProps
) => void;
```

```ts
// Example usage in UI components
trackEvent("nav_primary_click", { label: name, href, source: "header" });
trackEvent("project_demo_click", { href: demo, slug: project.slug });
trackEvent("details_expand", { section: "experience", label: company });
```

## Testing Strategy

| Layer       | What to Test     | Approach                                                                                                                                                              |
| ----------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | Analytics guards | Jest tests for `initPlausible()` and `trackEvent()` to ensure no-op in non-production and no init without env vars (mock `plausible-tracker`).                        |
| Unit        | Event calls      | Component tests for `ProjectCard/ActionLinks`, `Experience`, and `Education` to confirm handlers call `trackEvent` with expected names/props (mock analytics module). |
| Integration | Client init      | Shallow render RootProvider and assert `initPlausible` called once on client (mock in test).                                                                          |
| E2E         | Not required     | Analytics is production-only and should not run in local tests; ensure no new E2E coverage added unless desired.                                                      |

## Migration / Rollout

No migration required. Add env keys to production; analytics runs only when `NODE_ENV=production` and both Plausible env vars are present.

## Open Questions

- [ ] Confirm which interactions count as `cta_contact_click` (email, Telegram, Hire Me, Calendly). Current design includes all contact CTAs.
- [ ] Confirm whether `nav_footer_click` should include footer social links or only footer navigation links (current footer is social links).
