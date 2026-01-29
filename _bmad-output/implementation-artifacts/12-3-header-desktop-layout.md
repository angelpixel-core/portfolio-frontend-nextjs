# Story 12.3: Header Desktop Layout

Status: done

## Story

As a desktop user,
I want the header to show full navigation, social links, and auth options when there's sufficient space,
So that I can access all features without needing the hamburger menu.

## Acceptance Criteria

1. **AC1: Navigation Visible at Nav Breakpoint**
   - **Given** viewport width ≥ 841px (nav breakpoint)
   - **When** header is displayed
   - **Then** Primary Navigation zone is visible (Home, About, Projects, Articles)

2. **AC2: Social Links Visible at Nav+**
   - **Given** viewport width ≥ 841px
   - **When** header is displayed
   - **Then** Social links zone shows available contact points (GitHub, LinkedIn, etc.)
   - **Note:** Current implementation shows Social only at wide (1441px+). This story adjusts to nav+ (841px+) per FR3.

3. **AC3: Auth Actions Visible When Space Allows**
   - **Given** viewport width ≥ 1025px (desktop breakpoint)
   - **When** header is displayed
   - **Then** Auth zone shows sign-in buttons (LinkedIn, Microsoft, Google)
   - **Note:** Auth requires more space than Social, so visible at desktop+ (1025px+) not nav+

4. **AC4: Hamburger Hidden at Nav+**
   - **Given** viewport width ≥ 841px
   - **When** header is displayed
   - **Then** hamburger menu (burger zone) is NOT visible
   - **Note:** Already implemented in Story 12.1, this AC validates the complete desktop experience

5. **AC5: Layout Balance Without Overflow**
   - **Given** any desktop viewport (841px - 1920px)
   - **When** all visible zones render
   - **Then** no horizontal overflow occurs, zones are balanced visually

## Tasks / Subtasks

- [x] Task 1: Audit Current Desktop Header (AC: 1, 2, 3, 4)
  - [x] 1.1: Screenshot header at 841px, 1025px, 1441px to document current state
  - [x] 1.2: Identify current visibility of Social and Auth zones
  - [x] 1.3: Measure available space for Social links at nav breakpoint
  - [x] 1.4: Document any existing layout issues at desktop widths

- [x] Task 2: Adjust Social Zone Visibility (AC: 2)
  - [x] 2.1: Change `.menu-bar__social-links` from `wide:flex` to `nav:flex`
  - [x] 2.2: Verify Social links fit at 841px viewport without overflow
  - [x] 2.3: Test Social links with all HEADER_SOCIAL_PROVIDERS rendered
  - [x] 2.4: Adjust spacing/gap if needed for nav breakpoint

- [x] Task 3: Adjust Auth Zone Visibility (AC: 3)
  - [x] 3.1: Change `.menu-bar__social-login` from `wide:flex` to `desktop:flex`
  - [x] 3.2: Verify Auth buttons fit at 1025px viewport without overflow
  - [x] 3.3: Test layout with Social + Auth both visible at desktop+
  - [x] 3.4: Ensure touch targets remain WCAG compliant (min 44x44px)

- [x] Task 4: Layout Balance Validation (AC: 5)
  - [x] 4.1: Test header layout at 841px (nav: Social visible, Auth hidden)
  - [x] 4.2: Test header layout at 1025px (desktop: Social + Auth visible)
  - [x] 4.3: Test header layout at 1441px (wide: all zones visible)
  - [x] 4.4: Ensure no horizontal scroll at any breakpoint

- [x] Task 5: E2E Tests (AC: 1-5)
  - [x] 5.1: Add test for Social zone visibility at nav breakpoint
  - [x] 5.2: Add test for Auth zone visibility at desktop breakpoint
  - [x] 5.3: Add test for no horizontal overflow at desktop viewports
  - [x] 5.4: Update header-visibility.spec.ts with new visibility matrix

- [x] Task 6: Documentation Update (AC: 2, 3)
  - [x] 6.1: Update docs/layout-system.md visibility matrix
  - [x] 6.2: Update Menu component JSDoc with new visibility rules
  - [x] 6.3: Add changelog entry for Story 12.3

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR3:** Header desktop (>840px): navegación + redes sociales + auth visible

**From epic-12-ux-behavior.md Section 3.3:**
> Header — Estado Desktop (> 840px)
> • El menú hamburguesa desaparece
> • Se muestran directamente:
>   • Navegación principal
>   • Barra de redes sociales
>   • Acciones de autenticación (si hay espacio suficiente)
> • El menú flotante solo existe si el viewport lo justifica

**Key Insight:** "si hay espacio suficiente" - Auth needs more space than Social, so tiered visibility:
- nav+ (841px): Nav + Social
- desktop+ (1025px): Nav + Social + Auth

### Current State (Post Stories 12.1, 12.2)

**Visibility Matrix (Current):**
| Breakpoint | Range | Nav | Social | Auth | Theme | Burger |
|------------|-------|-----|--------|------|-------|--------|
| Base | 0-640px | ❌ | ❌ | ❌ | ❌ | ✅ |
| tablet: | 641-840px | ❌ | ❌ | ❌ | ✅ | ✅ |
| nav: | 841-1024px | ✅ | ❌ | ❌ | ✅ | ❌ |
| desktop: | 1025-1440px | ✅ | ❌ | ❌ | ✅ | ❌ |
| wide: | ≥1441px | ✅ | ✅ | ✅ | ✅ | ❌ |

**Target Visibility Matrix (After Story 12.3):**
| Breakpoint | Range | Nav | Social | Auth | Theme | Burger |
|------------|-------|-----|--------|------|-------|--------|
| Base | 0-640px | ❌ | ❌ | ❌ | ❌ | ✅ |
| tablet: | 641-840px | ❌ | ❌ | ❌ | ✅ | ✅ |
| nav: | 841-1024px | ✅ | ✅ | ❌ | ✅ | ❌ |
| desktop: | 1025-1440px | ✅ | ✅ | ✅ | ✅ | ❌ |
| wide: | ≥1441px | ✅ | ✅ | ✅ | ✅ | ❌ |

### Files to Modify

```
src/ui/organisms/Menu/styles.css     # Change visibility rules
src/ui/organisms/Menu/index.jsx      # Update JSDoc comment
docs/layout-system.md                # Update visibility matrix
e2e/header-visibility.spec.ts        # Add new visibility tests
e2e/header-desktop-layout.spec.ts    # New E2E test file (optional)
```

### CSS Changes Required

```css
/* BEFORE (Story 12.2 state) */
.menu-bar__social-links {
  @apply hidden wide:flex flex-wrap items-center justify-center;
}
.menu-bar__social-login {
  @apply hidden wide:flex;
}

/* AFTER (Story 12.3) */
.menu-bar__social-links {
  @apply hidden nav:flex flex-wrap items-center justify-center;
}
.menu-bar__social-login {
  @apply hidden desktop:flex;
}
```

### Testing Strategy

**TDD Approach:**
1. Write failing test: expect Social zone visible at 841px
2. Write failing test: expect Auth zone visible at 1025px
3. Implement CSS changes
4. Verify tests pass

**Critical Test Viewports:**
- 841px: Nav + Social visible, Auth hidden
- 1024px: Last nav viewport (Nav + Social, no Auth)
- 1025px: First desktop viewport (Nav + Social + Auth)
- 1440px: Last desktop viewport (all visible)
- 1441px: First wide viewport (verify no change)

### Previous Story Intelligence (Stories 12.1, 12.2)

**Patterns Established:**
- Use semantic breakpoints: `tablet:`, `nav:`, `desktop:`, `wide:`
- TDD RED-GREEN cycle works well for layout tests
- Zone visibility uses pattern: `hidden nav:flex` or `nav:hidden`
- Update layout-system.md visibility matrix when changing rules
- Add changelog entry with story number

**Code Review Learnings:**
- Always update JSDoc in component when changing visibility
- Align test file comments with docs/layout-system.md
- Test at boundary viewports (841, 1025, 1441)

### Component References

**Menu Zones (src/ui/organisms/Menu):**
- `.menu-bar__primary-nav` - Primary navigation (currently `nav:flex`)
- `.menu-bar__social-links` - Social links (currently `wide:flex`, change to `nav:flex`)
- `.menu-bar__social-login` - Auth buttons (currently `wide:flex`, change to `desktop:flex`)
- `.menu-bar__ui-controls` - Theme toggle (currently `tablet:flex`, no change)

**Social Providers (HEADER_SOCIAL_PROVIDERS):**
```javascript
// src/ui/organisms/Menu/constants.js
export const HEADER_SOCIAL_PROVIDERS = ["github", "linkedin", "twitter", "whatsapp"];
```

### E2E Test Patterns

From `e2e/header-visibility.spec.ts`:
```typescript
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 720, height: 1024 },
  nav: { width: 900, height: 800 },
  desktop: { width: 1280, height: 800 },
  wide: { width: 1920, height: 1080 },
};

test("social zone visible at nav viewport", async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.nav);
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const socialZone = page.getByTestId("header-social-zone");
  await expect(socialZone).toBeVisible();
});
```

### Risk Assessment

**Riesgo:** 🟡 Medio (Mayormente layout)

**Potential Issues:**
1. Social links may not fit at 841px if too many providers configured
2. Auth buttons add ~132px width, may cause overflow at 1025px
3. Layout balance between zones may need flexbox adjustments

**Mitigations:**
1. Test with actual HEADER_SOCIAL_PROVIDERS data
2. Use `flex-shrink` if needed for tight viewports
3. Ensure `justify-between` distributes space properly

### References

- [Source: docs/layout-system.md] - Current visibility matrix
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:90-98] - Desktop header specification
- [Source: _bmad-output/planning-artifacts/epics-v2.md:138] - FR3 coverage
- [Source: src/ui/organisms/Menu/styles.css] - Current zone visibility rules
- [Source: _bmad-output/implementation-artifacts/12-1-header-breakpoint-definition.md] - Breakpoint patterns
- [Source: _bmad-output/implementation-artifacts/12-2-header-mobile-layout.md] - Mobile layout patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TDD RED phase: 4 tests failed as expected before implementation
- TDD GREEN phase: All 34 tests passed after CSS changes
- Visual validation: Screenshots at 841px, 1025px, 1441px confirmed correct visibility

### Completion Notes List

- Used TDD approach: wrote failing tests first, then implemented CSS changes
- Social zone changed from `wide:flex` to `nav:flex` (841px+)
- Auth zone changed from `wide:flex` to `desktop:flex` (1025px+)
- No horizontal overflow detected at any viewport
- All 34 header-visibility tests pass

### File List

- `src/ui/organisms/Menu/styles.css` - Changed Social/Auth zone visibility breakpoints
- `src/ui/organisms/Menu/index.jsx` - Updated JSDoc with new visibility rules
- `e2e/header-visibility.spec.ts` - Updated visibility matrix and transition tests
- `docs/layout-system.md` - Updated visibility matrix and changelog
