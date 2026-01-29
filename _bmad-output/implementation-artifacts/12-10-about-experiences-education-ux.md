# Story 12.10: About Experiences/Education UX

Status: done

## Story

As a visitor viewing the About page Experiences and Education sections,
I want the "Show details" text replaced with a contextual icon interaction and Education to follow the same visual pattern as Experiences,
so that I have a cleaner, more intuitive experience without noisy text buttons.

## Acceptance Criteria

1. **AC1: Replace "Show details" Text with Contextual Icon**
   - **Given** the About page Experiences section loads with work history items
   - **When** an experience entry has expandable details (work array is non-empty)
   - **Then** the expand trigger is an icon (chevron, plus, or ellipsis menu) instead of "Show details" text
   - **And** the icon has `aria-label="Show details"` for accessibility
   - **And** the icon has `aria-expanded` attribute reflecting current state
   - **Note:** FR23 specifies "ícono contextual" or "menú de tres puntos"

2. **AC2: Icon Toggle Behavior**
   - **Given** the details icon is in collapsed state
   - **When** the user clicks or presses Enter/Space on the icon
   - **Then** the details expand with the existing slide animation
   - **And** the icon visually rotates or changes to indicate expanded state
   - **And** `aria-expanded` updates to "true"

3. **AC3: Icon Collapsed Behavior**
   - **Given** the details icon is in expanded state
   - **When** the user clicks or presses Enter/Space on the icon
   - **Then** the details collapse
   - **And** the icon returns to original state
   - **And** `aria-expanded` updates to "false"

4. **AC4: Education Follows Experiences Visual Pattern**
   - **Given** the About page Education section loads
   - **When** comparing Education and Experiences components side by side
   - **Then** Education uses the same CSS class naming pattern (education_title, education_history-info)
   - **And** Education typography matches Experiences (font-bold, text-2xl sm:text-xl xs:text-lg)
   - **And** Both sections use the TransitionerLi wrapper for consistent animations
   - **Note:** FR24 specifies "Education sigue patrón visual de Experiences"

5. **AC5: Education Verification Link Styling**
   - **Given** an Education entry has a verification_url
   - **When** the Education component renders
   - **Then** the "Verify credential" link styling matches the new icon interaction style
   - **And** The link has proper hover/focus states
   - **And** The link has `aria-label` for accessibility

6. **AC6: Minimum Touch Target Size**
   - **Given** the new icon toggle button
   - **When** rendered on any viewport
   - **Then** the icon button meets WCAG 2.5.5 minimum target size (44x44px)
   - **And** There is adequate spacing between interactive elements

7. **AC7: Reduced Motion Respected**
   - **Given** the user has `prefers-reduced-motion` enabled
   - **When** interacting with the details toggle icon
   - **Then** icon rotation is immediate without animation
   - **And** details expand/collapse without slide animation

## Tasks / Subtasks

- [x] Task 1: Design Icon Toggle Component (AC: 1, 2, 3)
  - [x] 1.1: Choose appropriate icon (chevron-down recommended for expand/collapse pattern)
  - [x] 1.2: Create or reuse icon from existing icon system
  - [x] 1.3: Define rotation animation for expanded state (0° → 180°)
  - [x] 1.4: Ensure icon has proper contrast in light/dark themes

- [x] Task 2: Update Experience Component (AC: 1, 2, 3, 6, 7)
  - [x] 2.1: Replace "Show details" / "Hide details" text button with icon button
  - [x] 2.2: Add `aria-label="Show details"` or `aria-label="Hide details"` based on state
  - [x] 2.3: Maintain existing `aria-expanded` and `aria-controls` attributes
  - [x] 2.4: Add icon rotation CSS with transition
  - [x] 2.5: Ensure 44x44px minimum touch target
  - [x] 2.6: Add `prefers-reduced-motion` media query for icon animation

- [x] Task 3: Update Experience Styles (AC: 1, 2, 3, 7)
  - [x] 3.1: Create `.experience_toggle-icon` class replacing `.experience_toggle-btn`
  - [x] 3.2: Add rotation transform for expanded state
  - [x] 3.3: Ensure focus ring visibility
  - [x] 3.4: Maintain hover states for desktop

- [x] Task 4: Verify Education Visual Consistency (AC: 4, 5)
  - [x] 4.1: Audit Education component CSS class naming
  - [x] 4.2: Compare typography tokens with Experience component
  - [x] 4.3: Verify TransitionerLi usage in both components
  - [x] 4.4: Document any intentional differences

- [x] Task 5: Update Education Verification Link (AC: 5)
  - [x] 5.1: Ensure verification link has explicit `aria-label`
  - [x] 5.2: Add consistent hover/focus states
  - [x] 5.3: Match styling pattern with icon toggle button

- [x] Task 6: Add data-testid Attributes (AC: 1-5)
  - [x] 6.1: Add `data-testid="experience-toggle"` to icon button
  - [x] 6.2: Add `data-testid="experience-details"` to details container
  - [x] 6.3: Add `data-testid="education-verification-link"` if not present
  - [x] 6.4: Ensure Experiences container has `data-testid`

- [x] Task 7: E2E Tests (AC: 1-7)
  - [x] 7.1: Test icon toggle visibility instead of text button
  - [x] 7.2: Test aria-expanded toggle behavior
  - [x] 7.3: Test icon rotation on expand/collapse
  - [x] 7.4: Test Education visual consistency with Experiences
  - [x] 7.5: Test minimum touch target size (44x44px)
  - [x] 7.6: Test reduced motion behavior

- [x] Task 8: Documentation Update
  - [x] 8.1: Add changelog entry for Story 12.10 in layout-system.md
  - [x] 8.2: Document icon toggle interaction pattern

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR23:** "Show details" debe ser ícono/menú contextual, no texto plano
**FR24:** Education sigue patrón visual de Experiences

**From epic-12-ux-behavior.md Section 5.3 (Experiences):**
> • La estructura general es correcta
> • El texto "Show details" resulta ruidoso
> • Alternativas válidas:
>   • Ícono contextual
>   • Menú de tres puntos
>   • Interacción sobre el nodo / marcador
> • Debe mantener coherencia visual con Education

**From epic-12-ux-behavior.md Section 5.4 (Education):**
> • Sigue el patrón visual de Experiences
> • Ocupa menos blades
> • No introduce nuevos patrones de interacción

### Risk Assessment

**Riesgo:** 🟢 Bajo (Estructural)

From epics-v2.md: Story 12.10 is categorized as low risk - primarily structural changes.

### Current Implementation Analysis

**Experience Component (`src/ui/molecules/Experience/index.tsx`):**
- Uses `useState` for `isExpanded` local state
- Button with text "Show details" / "Hide details"
- Has proper `aria-expanded` and `aria-controls`
- Keyboard handling for Enter/Space
- Details section with slide animation

**Current Button (Line 75-84):**
```tsx
<button
  type="button"
  className="experience_toggle-btn"
  aria-expanded={isExpanded}
  aria-controls={detailsId}
  onClick={handleToggle}
  onKeyDown={handleKeyDown}
>
  {isExpanded ? "Hide details" : "Show details"}
</button>
```

**Education Component (`src/ui/molecules/Education/index.tsx`):**
- Simpler structure (no expandable details)
- Uses TransitionerLi like Experience
- Has verification_url optional link
- CSS classes follow same pattern: education_title, education_history-info

### Icon Recommendation

**Chevron Down (ChevronDownIcon)** is recommended:
- Industry standard for expand/collapse
- Rotation from 0° to 180° indicates expanded state
- Can be implemented with Heroicons or custom SVG
- Simpler than ellipsis menu (which implies more options)

**Icon Implementation Options:**
1. Use existing `@heroicons/react` if installed
2. Create simple SVG inline in component
3. Use Lucide icons if already in project

### CSS Transform for Icon Rotation

```css
.experience_toggle-icon {
  @apply transition-transform duration-200;
}

.experience_toggle-icon--expanded {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .experience_toggle-icon {
    transition: none;
  }
}
```

### Component File Locations

```
src/ui/molecules/Experience/
├── index.tsx        # Main component - replace text with icon
├── styles.css       # Update toggle button styles
├── skeleton.jsx     # No changes needed
├── __tests__/       # Update tests for icon

src/ui/molecules/Education/
├── index.tsx        # Verify pattern consistency
├── styles.css       # Verify matches Experience
├── skeleton.jsx     # No changes needed
├── __tests__/       # Verify tests

src/ui/organisms/Experiences/
├── index.tsx        # Container - add data-testid if missing
├── styles.css       # No changes expected
```

### Previous Story Intelligence (Story 12.9)

**Patterns Established:**
- Use `data-testid` for E2E testing
- Enhanced active states with multiple indicators (ring, background, border, shadow)
- Reduced motion support via `@media (prefers-reduced-motion: reduce)`
- Update layout-system.md changelog when making changes

**Code Review Learnings:**
- Verify FR compliance with exact specification wording
- Remove unused code/properties
- Avoid data mutation in render functions

### E2E Test Patterns

```typescript
// e2e/about-experiences-education-ux.spec.ts

test.describe("About Experiences/Education UX (Story 12.10)", () => {
  test("experience toggle uses icon instead of text", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    const toggle = page.locator('[data-testid="experience-toggle"]').first();
    await expect(toggle).toBeVisible();

    // Should not contain text "Show details"
    await expect(toggle).not.toContainText("Show details");

    // Should have aria-label
    await expect(toggle).toHaveAttribute("aria-label", /details/i);
  });

  test("icon rotates on expand", async ({ page }) => {
    await page.goto("/about");
    const toggle = page.locator('[data-testid="experience-toggle"]').first();

    // Get initial rotation
    const initialTransform = await toggle.evaluate((el) =>
      getComputedStyle(el).transform
    );

    await toggle.click();

    // Rotation should change
    const expandedTransform = await toggle.evaluate((el) =>
      getComputedStyle(el).transform
    );

    expect(expandedTransform).not.toBe(initialTransform);
  });

  test("education follows experiences visual pattern", async ({ page }) => {
    await page.goto("/about");

    const experienceTitle = page.locator('.experience_title').first();
    const educationTitle = page.locator('.education_title').first();

    const expFontSize = await experienceTitle.evaluate((el) =>
      getComputedStyle(el).fontSize
    );
    const eduFontSize = await educationTitle.evaluate((el) =>
      getComputedStyle(el).fontSize
    );

    expect(expFontSize).toBe(eduFontSize);
  });
});
```

### Breakpoints Reference

| Breakpoint | Range | CSS | Notes |
|------------|-------|-----|-------|
| Base (mobile) | 0-640px | (default) | Primary focus |
| `tablet:` | 641-840px | `@media (min-width: 641px)` | - |
| `nav:` | 841-1024px | `@media (min-width: 841px)` | - |
| `desktop:` | 1025-1440px | `@media (min-width: 1025px)` | - |
| `wide:` | ≥1441px | `@media (min-width: 1441px)` | - |

### References

- [Source: docs/layout-system.md] - Breakpoint system, data-testid patterns
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:160-175] - FR23-FR24 specifications
- [Source: _bmad-output/planning-artifacts/epics-v2.md:79-80] - Story 12.10 definition
- [Source: src/ui/molecules/Experience/] - Experience component implementation
- [Source: src/ui/molecules/Education/] - Education component implementation
- [Source: Story 12.9] - Previous story patterns and learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - Implementation completed without debugging issues.

### Completion Notes List

1. Created ChevronDownIcon component following existing project icon pattern
2. Replaced text button with icon-only button maintaining all accessibility attributes
3. Added 180° rotation animation for expanded state
4. Education already followed Experiences visual pattern - only added data-testid
5. All 20 E2E tests pass validating all 7 acceptance criteria

### Code Review Fixes

1. Removed redundant `handleKeyDown` handler - native buttons handle Enter/Space automatically
2. Improved test assertion to use `not.toContainText()` instead of empty string check (more robust)

### File List

**New Files:**
- `src/ui/atoms/icons/ChevronDownIcon/index.jsx` - Chevron icon component

**Modified Files:**
- `src/ui/atoms/icons/index.js` - Export ChevronDownIcon
- `src/ui/molecules/Experience/index.tsx` - Icon toggle instead of text button
- `src/ui/molecules/Experience/styles.css` - Icon toggle styles
- `src/ui/molecules/Education/index.tsx` - Added data-testid
- `src/ui/organisms/Experiences/index.tsx` - Added data-testid attributes
- `docs/layout-system.md` - Changelog entry

**New Test Files:**
- `e2e/about-experiences-education-ux.spec.ts` - 20 E2E tests
