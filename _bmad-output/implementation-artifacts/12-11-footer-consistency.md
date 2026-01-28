# Story 12.11: Footer Consistency

Status: done

## Story

As a visitor navigating the portfolio,
I want the Footer behavior to be consistent across all pages with proper Hire Me hover interactions,
so that I have a predictable, cohesive experience throughout the site without visual inconsistencies.

## Acceptance Criteria

1. **AC1: Footer Consistent Across All Pages**
   - **Given** the visitor navigates to any page (Home, About, Projects, Articles)
   - **When** the Footer component renders
   - **Then** the Footer structure and styling are identical across all pages
   - **And** The Footer contains: Copyright, Author, Chat, WhatsApp, CopyEmail
   - **Note:** FR25 specifies "Comportamiento consistente en todas las páginas"

2. **AC2: Hire Me Circular Component Hover Inverse**
   - **Given** the HireMe circular component is visible (viewport ≥841px)
   - **When** the user hovers over the "hire me" link inside the circular text
   - **Then** the colors invert (light ↔ dark theme appropriate)
   - **And** The hover transition is smooth
   - **Note:** FR26 specifies "Hire Me button: hover con color inverso"

3. **AC3: Hire Me Not Duplicated**
   - **Given** the Home page renders with secondary blade containing Footer
   - **When** inspecting the DOM
   - **Then** there is exactly ONE visible HireMe component on screen
   - **And** The global layout Footer is hidden on Home page (existing CSS rule)
   - **Note:** FR27 specifies "Hire Me NO duplicado ni fuera de contexto"

4. **AC4: Footer Does Not Break Visual Narrative**
   - **Given** any page with Footer rendered
   - **When** scrolling to the bottom of the page
   - **Then** the Footer provides a clear visual closure
   - **And** There are no orphaned elements or broken layouts
   - **And** The Footer border-top provides visual separation

5. **AC5: Footer data-testid Attributes**
   - **Given** the Footer component renders
   - **When** E2E tests run
   - **Then** Footer has `data-testid="footer"` attribute
   - **And** Key child elements have appropriate data-testid attributes

6. **AC6: HireMe Visibility Per Breakpoint**
   - **Given** the HireMe circular component
   - **When** viewport is <841px (mobile/tablet)
   - **Then** HireMe circular is hidden (HireMeHeaderButton is in header instead)
   - **When** viewport is ≥841px (nav+)
   - **Then** HireMe circular is visible in top-right position

## Tasks / Subtasks

- [x] Task 1: Verify Footer Consistency (AC: 1, 4)
  - [x] 1.1: Audit Footer rendering on Home, About, Projects, Articles pages
  - [x] 1.2: Confirm Footer structure is identical across all pages
  - [x] 1.3: Verify Footer border-top provides consistent visual separation
  - [x] 1.4: Document any page-specific differences (should be none)

- [x] Task 2: Verify HireMe Hover States (AC: 2)
  - [x] 2.1: Audit current HireMe hover CSS in `src/ui/molecules/HireMe/styles.css`
  - [x] 2.2: Verify light theme hover: bg-dark → bg-light, text-light → text-dark
  - [x] 2.3: Verify dark theme hover: bg-light → bg-dark, text-dark → text-light
  - [x] 2.4: Ensure transition is smooth (already has hover: classes)

- [x] Task 3: Verify No HireMe Duplication (AC: 3)
  - [x] 3.1: Audit Home page for HireMe instances
  - [x] 3.2: Confirm CSS rule `.layout:has(.main_home) > footer` hides global Footer
  - [x] 3.3: Verify only ONE HireMe circular component visible
  - [x] 3.4: Test at different viewports (HireMe hidden mobile, visible nav+)

- [x] Task 4: Add data-testid Attributes (AC: 5)
  - [x] 4.1: Add `data-testid="footer"` to Footer component
  - [x] 4.2: Add `data-testid="footer-content"` to footer-content div
  - [x] 4.3: Add `data-testid="hire-me-circular"` to HireMe container

- [x] Task 5: E2E Tests (AC: 1-6)
  - [x] 5.1: Test Footer presence on all pages
  - [x] 5.2: Test Footer structure consistency
  - [x] 5.3: Test HireMe hover color inversion
  - [x] 5.4: Test no HireMe duplication on Home page
  - [x] 5.5: Test HireMe visibility per breakpoint
  - [x] 5.6: Test Footer visual closure (no orphaned elements)

- [x] Task 6: Documentation Update
  - [x] 6.1: Add changelog entry for Story 12.11 in layout-system.md
  - [x] 6.2: Document Footer consistency pattern

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR25:** Comportamiento consistente en todas las páginas
**FR26:** Hire Me button: hover con color inverso
**FR27:** Hire Me NO duplicado ni fuera de contexto

**From epic-12-ux-behavior.md Section 6 (Footer):**
> • Comportamiento consistente en todas las páginas
> • El botón Hire Me:
>   • Hover con color inverso
>   • No debe aparecer duplicado
>   • No debe romper la narrativa visual del cierre

### Risk Assessment

**Riesgo:** 🟢 Bajo (Estructural)

From epics-v2.md: Story 12.11 is categorized as low risk - primarily verification and consistency checks.

### Current Implementation Analysis

**Footer Component (`src/ui/organisms/Footer/index.jsx`):**
```jsx
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Copyright />
        <Author />
        <Chat />
        <WhatsApp />
        <CopyEmail />
      </div>
    </footer>
  );
};
```
- Simple structure with 5 child components
- Used in global layout (`src/app/layout.jsx` line 56)
- Used in Home secondary blade (`src/app/page.jsx` line 56)
- CSS rule hides global Footer on Home: `.layout:has(.main_home) > footer`

**HireMe Component (`src/ui/molecules/HireMe/index.jsx`):**
```jsx
const HireMe = () => {
  return (
    <div className="hire-me_container">
      <div className="hire-me_content">
        <CircularText className="hire-me_circular-text" />
        <Link href={profile.telegram} className="hire-me_link">
          hire me
        </Link>
      </div>
    </div>
  );
};
```

**HireMe Current Hover CSS (already implemented):**
```css
.hire-me_link {
  @apply bg-dark hover:bg-light
  text-light hover:text-dark
  dark:bg-light hover:dark:bg-dark
  dark:text-dark hover:dark:text-light;
}
```
- ✅ Light theme: bg-dark → bg-light, text-light → text-dark
- ✅ Dark theme: bg-light → bg-dark, text-dark → text-light
- FR26 already satisfied - just need to verify and test

**HireMe Visibility (from styles.css):**
```css
.hire-me_container {
  @apply hidden nav:flex
  nav:absolute
  nav:top-0 nav:right-10;
}
```
- Hidden on mobile/tablet (<841px)
- Visible on nav+ (≥841px)
- FR27 satisfied by this + HireMeHeaderButton in header for mobile

### What This Story REALLY Needs

This is largely a **verification story** rather than implementation:

1. **Verify** existing Footer consistency (should already be consistent)
2. **Verify** HireMe hover works correctly (CSS already exists)
3. **Verify** no duplication (CSS rule already exists)
4. **Add** data-testid attributes for E2E testing
5. **Create** E2E tests to lock down behavior

### Component File Locations

```
src/ui/organisms/Footer/
├── index.jsx        # Add data-testid
├── styles.css       # No changes expected

src/ui/molecules/HireMe/
├── index.jsx        # Add data-testid
├── styles.css       # Verify hover states
```

### Previous Story Intelligence (Story 12.10)

**Patterns Established:**
- Use `data-testid` for E2E testing
- Verify FR compliance with exact specification wording
- Remove redundant code during review
- Update layout-system.md changelog

**Code Review Learnings:**
- Native button elements handle Enter/Space automatically
- Test assertions should be robust (not fragile)

### E2E Test Patterns

```typescript
// e2e/footer-consistency.spec.ts

test.describe("Footer Consistency (Story 12.11)", () => {
  const pages = ["/", "/about", "/projects", "/articles"];

  test("footer is present on all pages", async ({ page }) => {
    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      const footer = page.getByTestId("footer");
      await expect(footer).toBeVisible();
    }
  });

  test("hire me hover inverts colors (light theme)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const hireMe = page.getByTestId("hire-me-circular").locator("a");

    // Get initial colors
    const initialBg = await hireMe.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );

    // Hover
    await hireMe.hover();

    // Colors should change
    const hoverBg = await hireMe.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );

    expect(hoverBg).not.toBe(initialBg);
  });

  test("no hire me duplication on home page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Only ONE HireMe circular should be visible
    const hireMeCircular = page.getByTestId("hire-me-circular");
    await expect(hireMeCircular).toHaveCount(1);
  });
});
```

### Breakpoints Reference

| Breakpoint | Range | CSS | HireMe Visibility |
|------------|-------|-----|-------------------|
| Base (mobile) | 0-640px | (default) | Hidden (HireMeHeaderButton in header) |
| `tablet:` | 641-840px | `@media (min-width: 641px)` | Hidden |
| `nav:` | 841-1024px | `@media (min-width: 841px)` | **Visible** |
| `desktop:` | 1025-1440px | `@media (min-width: 1025px)` | Visible |
| `wide:` | ≥1441px | `@media (min-width: 1441px)` | Visible |

### References

- [Source: docs/layout-system.md] - Breakpoint system, data-testid patterns
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:178-185] - FR25-FR27 specifications
- [Source: _bmad-output/planning-artifacts/epics-v2.md:87-89] - Story 12.11 definition
- [Source: src/ui/organisms/Footer/] - Footer component implementation
- [Source: src/ui/molecules/HireMe/] - HireMe component implementation
- [Source: src/app/styles.css:26-29] - CSS rule hiding global Footer on Home
- [Source: Story 12.10] - Previous story patterns and learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - Implementation completed without debugging issues.

### Completion Notes List

1. Verified Footer consistency across all 4 pages (Home, About, Projects, Articles)
2. Verified HireMe hover CSS already implements FR26 color inversion correctly
3. Verified no HireMe duplication - CSS rule hides global Footer on Home
4. Added data-testid attributes to Footer and HireMe components
5. Created 16 E2E tests covering all 6 acceptance criteria
6. This was primarily a verification story - most FRs were already satisfied

### File List

**Modified Files:**
- `src/ui/organisms/Footer/index.jsx` - Added data-testid="footer" and data-testid="footer-content"
- `src/ui/molecules/HireMe/index.jsx` - Added data-testid="hire-me-circular" and data-testid="hire-me-link"
- `docs/layout-system.md` - Changelog entry for Story 12.11

**New Test Files:**
- `e2e/footer-consistency.spec.ts` - 16 E2E tests

## Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.5 (claude-opus-4-5-20251101)
**Date:** 2026-01-28
**Outcome:** ✅ APPROVED (after fixes)

### Issues Found and Fixed

| Severity | Issue | File | Fix Applied |
|----------|-------|------|-------------|
| 🔴 HIGH | HireMe Link missing `rel="noopener noreferrer"` (security) | `src/ui/molecules/HireMe/index.jsx:17-24` | ✅ Added `rel="noopener noreferrer"` |
| 🟡 MEDIUM | TODO comment obsoleto con import comentado | `src/ui/organisms/Footer/index.jsx:3-4` | ✅ Eliminado TODO y import comentado |
| 🟡 MEDIUM | `waitForTimeout` anti-pattern en E2E tests | `e2e/footer-consistency.spec.ts:96,126` | ✅ Removido waits innecesarios |

### Low Issues (Not Fixed - Acceptable)

| Severity | Issue | Rationale |
|----------|-------|-----------|
| 🟢 LOW | Tests de visibilidad potencialmente redundantes (nav+ y desktop) | Aceptable como regression coverage |
| 🟢 LOW | Test title "at nav+" usa VIEWPORTS.desktop | Minor inconsistency, funciona correctamente |

### Verification

- ✅ All 16 E2E tests pass (22.5s)
- ✅ All 6 ACs verified implemented
- ✅ All tasks marked [x] are actually done
- ✅ Git changes match story File List
- ✅ FR25, FR26, FR27 compliant
