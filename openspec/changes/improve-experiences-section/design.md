# Design: Improve Experiences Section

## Technical Approach

Implement a focused UI/content patch in existing About and header modules without changing domain schemas or navigation architecture.

- Update `job-experience` mock copy to concise, impact-oriented bullet text (max ~3 bullets per role where content allows), including a stronger independent consulting role label.
- Refactor `Experience` metadata rendering order to `Role @ Company` -> `Date` -> `Location`, while preserving current expand/collapse, a11y attributes, reduced-motion behavior, and optional company-logo rendering.
- Tighten timeline readability/density via targeted CSS adjustments in Experience styles (spacing and timeline visual prominence), keeping existing History wrapper behavior in `Experiences` unchanged.
- Split social provider filtering by surface: curated providers for desktop/tablet header slots, broader provider set preserved for mobile overlays.

This aligns directly with `specs/experiences/spec.md` and `specs/navigation/spec.md`.

## Architecture Decisions

### Decision: Keep data contract unchanged; adjust mock content only

**Choice**: Modify only `src/domains/job-experience/model/mock.ts` content and labels; keep `JobExperienceSchema` unchanged.
**Alternatives considered**: Add new schema fields (e.g., `summary`, `highlights`) or normalize tasks into a richer content model.
**Rationale**: Specs require presentation/copy improvements, not data-model evolution. Current `work: JobExperienceTask[]` already maps to concise bullet rendering and avoids API/schema churn.

### Decision: Reorder metadata in component layout (not data layer)

**Choice**: Reorder rendered blocks in `src/ui/molecules/Experience/index.tsx` so visual sequence is `Role @ Company`, then `Date`, then `Location`.
**Alternatives considered**: Preformat combined strings in mock data or use a formatter utility in domain/model.
**Rationale**: Ordering is a view concern tied to breakpoint-specific layout; keeping it in the molecule follows existing atomic/organism UI layering and minimizes side effects.

### Decision: Preserve logo fallback with text-first identity

**Choice**: Keep optional logo lookup (`COMPANY_LOGOS`) and render text metadata regardless of image availability.
**Alternatives considered**: Remove logos entirely or add generated initials/avatar fallback component.
**Rationale**: Spec requires graceful fallback when logos are unavailable. Existing conditional image render already satisfies this with low complexity.

### Decision: Split social provider allowlists by surface

**Choice**: Replace single shared `HEADER_SOCIAL_PROVIDERS` with explicit constants for desktop/tablet header curation vs mobile overlay preservation.
**Alternatives considered**: Keep one shared list and add per-component conditional logic; derive lists dynamically from viewport.
**Rationale**: A shared list currently couples all surfaces (`Menu`, `NavBar`, `MenuFloatingClient`, `MobileMenuOverlay`). Separate constants make intent explicit, prevent regressions, and satisfy divergent desktop/mobile requirements.

## Data Flow

### Experiences

`useJobExperiences()`
  -> `job-experience/model/fetchAll()`
  -> mock/API `JobExperience[]`
  -> `Experiences` maps entries
  -> `Experience` renders metadata + expandable `work[]`

```text
JobExperience model
   |
   v
useJobExperiences (React Query)
   |
   v
Experiences organism (maps list)
   |
   v
Experience molecule
   |- Header line: Role @ Company (+ optional logo)
   |- Meta line: Date
   |- Meta line: Location
   \- Expand/collapse details + tags
```

### Header Socials

```text
useContactPoints()
   |
   +--> Menu (desktop navContent+) -------- filter: DESKTOP_HEADER_SOCIAL_PROVIDERS
   |
   +--> NavBar tablet-social (720-879) ---- filter: DESKTOP_HEADER_SOCIAL_PROVIDERS
   |
   +--> MenuFloatingClient (mobile) ------- filter: MOBILE_MENU_SOCIAL_PROVIDERS
   |
   \--> MobileMenuOverlay (mobile) -------- filter: MOBILE_MENU_SOCIAL_PROVIDERS
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/domains/job-experience/model/mock.ts` | Modify | Rewrite long descriptions into concise impact bullets; update independent consulting role/company label text. |
| `src/ui/molecules/Experience/index.tsx` | Modify | Reorder metadata render sequence; retain optional logo + accessible expand/collapse behavior. |
| `src/ui/molecules/Experience/styles.css` | Modify | Tighten vertical spacing and reduce timeline visual dominance while preserving readability and touch targets. |
| `src/ui/organisms/Menu/constants.ts` | Modify | Split social provider constants into desktop/tablet curated vs mobile-preserved sets. |
| `src/ui/organisms/Menu/index.tsx` | Modify | Apply curated desktop social provider filter only. |
| `src/ui/organisms/NavBar/index.tsx` | Modify | Align tablet header-social filtering with curated desktop providers. |
| `src/ui/organisms/MenuFloatingClient/index.tsx` | Modify | Keep mobile social behavior using mobile-preserved provider set. |
| `src/ui/organisms/MobileMenuOverlay/index.tsx` | Modify | Keep mobile overlay social behavior using mobile-preserved provider set. |
| `src/ui/molecules/Experience/__tests__/Experience.test.tsx` | Modify | Update metadata-order/content expectations and preserve expand/collapse/accessibility assertions. |
| `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx` | Modify | Update brittle copy assertions to new concise content (or less fragile selectors). |
| `src/ui/organisms/Menu/__tests__/Menu.test.tsx` | Modify | Validate curated desktop social filter against new constants. |
| `e2e/about-experiences-education-ux.spec.ts` | Modify (if needed) | Update any text-dependent assertions affected by concise copy changes. |

## Interfaces / Contracts

No backend/API contract changes are required.

Existing interface remains:

```ts
type JobExperience = {
  id: number;
  position: string;
  company: string;
  companyLink: string;
  time: string;
  address: string;
  work?: Array<{
    description: string;
    tags?: string[];
  }>;
};
```

Proposed social filter contract in `Menu/constants.ts`:

```ts
export const DESKTOP_HEADER_SOCIAL_PROVIDERS = [
  "linkedin",
  "github",
] as const;

export const MOBILE_MENU_SOCIAL_PROVIDERS = [
  "linkedin",
  "github",
  "twitter",
  "dribbble",
] as const;
```

Notes:
- Desktop/tablet header social slots use `DESKTOP_HEADER_SOCIAL_PROVIDERS`.
- Mobile overlay/floating menus use `MOBILE_MENU_SOCIAL_PROVIDERS`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Unit | Experience metadata order and logo fallback rendering | Update `Experience.test.tsx` to assert role/company line, date before location, and no broken rendering without known logo key. |
| Unit | Social provider filtering split by surface | Update `Menu.test.tsx`; add/assert per-surface filtering expectations in header/mobile menu component tests where applicable. |
| Integration | Experiences list rendering with updated concise content | Update `Experiences.test.tsx` to avoid brittle long-paragraph matching and verify expandable details still work. |
| E2E | Desktop curated socials vs mobile preserved socials | Re-run/adjust `e2e/header-visibility.spec.ts`, `e2e/header-mobile-layout.spec.ts`, `e2e/menu-autoclose.spec.ts`, and `e2e/contact.spec.ts` with provider expectations by breakpoint. |
| E2E | About experience UX stability after copy/layout changes | Re-run `e2e/about-experiences-education-ux.spec.ts` ensuring toggle behavior, a11y attributes, and responsive layout remain stable. |

## Migration / Rollout

No migration required.

Rollout plan:
1. Land code + tests together (UI/test synchronization rule).
2. Validate responsive behavior at base, `mobile`, `tablet`, `nav`, `desktop` breakpoints.
3. If regression occurs, rollback by reverting provider constants and dependent imports first, then Experience copy/style updates.

## Open Questions

- [ ] Confirm final independent consulting label copy (for example, `Independent Consultant` vs `Independent Consulting`).
- [ ] Confirm whether tablet social slot (720-879) is intentionally treated as desktop-curated (current design assumes yes).
