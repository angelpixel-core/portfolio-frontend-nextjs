# Proposal: Improve Experiences Section

## Intent

Improve recruiter scanability and visual hierarchy in the Experience section, while reducing desktop header social noise so navigation remains the primary focus. Keep behavior and information architecture stable on mobile.

## Scope

### In Scope
- Shorten expanded experience copy to concise, impact-oriented bullets (target: max 3 per role where content allows).
- Increase timeline density by tightening item spacing and reducing vertical line prominence.
- Reorder metadata in each experience row to `Role @ Company` -> `Date` -> `Location` and strengthen the independent consulting role label.
- Keep optional company logos support and refine fallback behavior when logos are unavailable.
- De-emphasize desktop header socials by limiting visible providers (GitHub + LinkedIn), without changing mobile menu social behavior.

### Out of Scope
- Full information architecture redesign (for example, splitting into "Core Product Experience" vs "Selected Projects").
- Global typography/theme redesign outside Experience and desktop header social filtering.
- Backend/API schema changes for experience data.

## Approach

Apply a minimal UI/content patch in existing frontend modules: update job experience mock copy, adjust Experience molecule render order and styling, and tune timeline spacing/line opacity in existing styles. For header socials, separate desktop filtering from mobile menu filtering so desktop can be curated without regressing current mobile social coverage.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/domains/job-experience/model/mock.ts` | Modified | Replace long paragraphs with concise impact bullets and update independent consulting label copy. |
| `src/ui/molecules/Experience/index.tsx` | Modified | Reorder metadata presentation and preserve optional logo rendering with graceful fallback. |
| `src/ui/molecules/Experience/styles.css` | Modified | Tighten spacing, reduce timeline visual dominance, and align new metadata order styling. |
| `src/ui/organisms/Experiences/index.tsx` | Modified | Keep section behavior stable while consuming updated experience presentation. |
| `src/ui/organisms/Menu/constants.ts` | Modified | Introduce explicit desktop vs mobile social provider filters (or equivalent split constants). |
| `src/ui/organisms/Menu/index.tsx` | Modified | Apply desktop-only social de-emphasis provider filter. |
| `src/ui/organisms/NavBar/index.tsx` | Modified | Keep tablet/header-social behavior aligned with desktop curation rules where applicable. |
| `src/ui/organisms/MenuFloatingClient/index.tsx` | Modified | Preserve current mobile social provider set despite desktop social reduction. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Desktop social filtering unintentionally affects mobile menus | Medium | Split provider constants by surface (desktop/mobile) and verify each header mode manually. |
| Experience copy truncation loses key context for certain roles | Medium | Keep role-specific high-signal bullets and validate against original mock before finalize. |
| CSS spacing tweaks create breakpoint regressions | Low | Validate at base, `mobile`, `tablet`, `nav`, and `desktop` breakpoints with existing layout matrix. |

## Rollback Plan

Revert the change commit to restore previous experience copy, metadata order, timeline styling, and shared social provider filtering. If partial rollback is needed, first restore `src/ui/organisms/Menu/constants.ts` and dependent menu components to pre-change provider logic, then revert Experience molecule/styles and mock content.

## Dependencies

- Existing `job-experience` mock/schema contract (no schema changes planned).
- Existing header/menu contact-point query data and provider identifiers (`github`, `linkedin`, `twitter`, `dribbble`).
- Regression checks for header/menu and Experience component tests/stories.

## Success Criteria

- [ ] Experience entries render with concise, impact-oriented detail bullets and improved scanability.
- [ ] Timeline appears denser and vertical line emphasis is visibly reduced without hurting readability.
- [ ] Metadata order is `Role @ Company` -> `Date` -> `Location` across experience cards.
- [ ] Desktop header shows only curated social providers (GitHub + LinkedIn), while mobile social menus remain unchanged.
- [ ] No regressions in critical navigation/menu behavior across target breakpoints.
