# Story 12.8: About Biography & Stats Degradation

Status: ready-for-dev

## Story

As a visitor viewing the About page,
I want the Stats component to gracefully degrade without breaking the page layout,
so that the biography section remains visually coherent even when stats fail to load.

## Acceptance Criteria

1. **AC1: Stats Component Does Not Break First Blade**
   - **Given** the About page loads
   - **When** the Stats component (ExperienceStats) renders
   - **Then** the Stats container maintains its grid position (`col-span-8`)
   - **And** the Stats does NOT push Biography or Hero image out of the first viewport
   - **And** the first blade contains: Biography + Hero Image + Stats in proper grid layout
   - **Note:** FR18 specifies "El componente Stats no debe romper el primer blade"

2. **AC2: Stats Graceful Degradation on Error**
   - **Given** the Stats data fails to load (API error or empty response)
   - **When** the ExperienceStats component renders error state
   - **Then** the error state maintains visual coherence (no loose text)
   - **And** the container structure is preserved (flex column layout)
   - **And** an appropriate fallback is shown (skeleton or styled message)
   - **Note:** FR19 specifies "No mostrar texto suelto tipo 'Unable to load stats' sin contexto"

3. **AC3: Stats Loading State Maintains Layout**
   - **Given** the About page is loading
   - **When** the Stats data is being fetched
   - **Then** a skeleton placeholder maintains the expected dimensions
   - **And** the skeleton matches the final Stats layout structure
   - **And** no layout shift occurs when data arrives

4. **AC4: Biography Degradation Consistency**
   - **Given** the Biography data fails to load
   - **When** the Biography component renders error state
   - **Then** the error message is styled consistently with Stats fallback
   - **And** the title "biography" remains visible
   - **And** no loose text appears without proper styling

5. **AC5: Visual Coherence in All States**
   - **Given** the About page in any state (loading, error, success)
   - **When** rendered at mobile viewport (375px)
   - **Then** the first blade displays coherent content
   - **And** no empty gaps or broken grid cells appear
   - **And** the visual hierarchy is maintained

## Tasks / Subtasks

- [ ] Task 1: Audit Current Stats Degradation Behavior (AC: 1, 2, 3)
  - [ ] 1.1: Verify ExperienceStats error state rendering
  - [ ] 1.2: Test Stats loading skeleton dimensions vs final component
  - [ ] 1.3: Check if Stats can overflow and break the first blade grid
  - [ ] 1.4: Document current error message styling

- [ ] Task 2: Improve Stats Error State (AC: 2)
  - [ ] 2.1: Replace plain text error with styled fallback component
  - [ ] 2.2: Ensure error state has min-height matching skeleton
  - [ ] 2.3: Add visual indicator (icon or styled box) instead of loose text
  - [ ] 2.4: Test error state at all breakpoints

- [ ] Task 3: Verify Biography Degradation (AC: 4)
  - [ ] 3.1: Audit Biography error state rendering
  - [ ] 3.2: Ensure Biography error matches Stats error styling
  - [ ] 3.3: Verify "biography" title persists on error

- [ ] Task 4: First Blade Layout Validation (AC: 1, 5)
  - [ ] 4.1: Test About page at mobile viewport (375px)
  - [ ] 4.2: Verify grid layout integrity with Stats in all states
  - [ ] 4.3: Check for layout shifts during loading → loaded transition
  - [ ] 4.4: Confirm Stats does not push content below fold incorrectly

- [ ] Task 5: E2E Tests (AC: 1-5)
  - [ ] 5.1: Test Stats container exists with proper grid position
  - [ ] 5.2: Test Biography and Stats are in first viewport on mobile
  - [ ] 5.3: Test error states maintain layout structure
  - [ ] 5.4: Test loading states show skeletons

- [ ] Task 6: Documentation Update
  - [ ] 6.1: Add changelog entry for Story 12.8 in layout-system.md
  - [ ] 6.2: Document degradation pattern if new pattern established

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR18:** El componente Stats no debe romper el primer blade
**FR19:** Si falla la carga, debe degradar visualmente. No mostrar texto suelto tipo "Unable to load stats" sin contexto

**From epic-12-ux-behavior.md Section 5.1 (Biography):**
> • El componente Stats:
>   • No debe romper el primer blade
>   • Si falla la carga, debe degradar visualmente
>   • No mostrar texto suelto tipo "Unable to load stats" sin contexto

### Current State Analysis

**About Page Grid Structure (`src/app/about/page.jsx`):**
```jsx
<div className="about-content">
  // Biography: col-span-3 (xl:col-span-4, md:col-span-8)
  <div className="about_biography-container">
    <Biography />
  </div>

  // Hero image: col-span-3 (xl:col-span-4, md:col-span-8)
  <div className="about-hero_image-container">
    <Hero />
  </div>

  // Stats: col-span-8 (lg:col-span-2, xl:col-span-8)
  <ExperienceStats />
</div>
```

**CSS Grid (`src/app/about/styles.css`):**
```css
.about-content {
  @apply grid grid-cols-8 gap-16 sm:gap-8;
}

.experience-stats {
  @apply flex flex-col xl:flex-row
  justify-between
  items-end xl:items-center
  col-span-8 lg:col-span-2 xl:col-span-8
  md:order-3;
}
```

### Current ExperienceStats Error Handling

**Current Implementation (`src/ui/organisms/ExperienceStats/index.jsx`):**
```jsx
if (isError || !experienceStats.length) {
  return (
    <div className="experience-stats">
      <p>Unable to load stats.</p>  // ⚠️ VIOLATES FR19 - loose text
    </div>
  );
}
```

**Issue:** Plain `<p>` tag with text violates FR19 - needs styled fallback.

### Current Biography Error Handling

**Current Implementation (`src/ui/organisms/Biography/index.jsx`):**
```jsx
if (isError || !profile?.biography) {
  return <>
    <h2 className="biography-title">biography</h2>
    <p>Unable to load biography.</p>  // ⚠️ Loose text
  </>;
}
```

**Issue:** Similar loose text pattern - needs styled fallback.

### Previous Story Intelligence (Story 12.7)

**Patterns Established:**
- Use `data-testid` for E2E testing
- Use semantic breakpoints: `tablet:`, `nav:`, `desktop:`, `wide:`
- Update layout-system.md changelog when making changes
- Test at multiple viewports (mobile, tablet, desktop)
- Handle component duplication carefully (Footer case)

**Code Review Learnings:**
- Always verify visual behavior matches specification
- Test error states explicitly, not just happy path
- Ensure containers maintain structure even on failure

### Proposed Implementation

**Step 1: Create Styled Fallback Component**
```jsx
// src/ui/shared/FallbackMessage/index.jsx
const FallbackMessage = ({ message, icon = null }) => {
  return (
    <div className="fallback-message">
      {icon && <span className="fallback-message_icon">{icon}</span>}
      <p className="fallback-message_text">{message}</p>
    </div>
  );
};
```

```css
/* src/ui/shared/FallbackMessage/styles.css */
.fallback-message {
  @apply flex flex-col items-center justify-center
  p-4
  text-dark/50 dark:text-light/50
  min-h-[100px];
}

.fallback-message_text {
  @apply text-sm italic;
}
```

**Step 2: Update ExperienceStats Error State**
```jsx
if (isError || !experienceStats.length) {
  return (
    <div className="experience-stats">
      <FallbackMessage message="Stats unavailable" />
    </div>
  );
}
```

**Step 3: Update Biography Error State**
```jsx
if (isError || !profile?.biography) {
  return <>
    <h2 className="biography-title">biography</h2>
    <FallbackMessage message="Biography unavailable" />
  </>;
}
```

### Component File Locations

```
src/app/about/
├── page.jsx              # About page - verify grid layout
├── layout.jsx            # About layout
├── styles.css            # Grid and blade styles

src/ui/organisms/
├── ExperienceStats/
│   ├── index.jsx         # Stats component - update error state
│   ├── skeleton.jsx      # Loading skeleton
│   └── styles.css        # Stats styling
├── Biography/
│   ├── index.jsx         # Biography component - update error state
│   ├── skeletons.jsx     # Loading skeleton
│   └── styles.css        # Biography styling

src/ui/shared/
├── FallbackMessage/      # NEW: Reusable fallback component
│   ├── index.jsx
│   └── styles.css
```

### E2E Test Patterns

```typescript
// e2e/about-stats-degradation.spec.ts

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

test.describe("About Stats Degradation (Story 12.8)", () => {
  test("stats container exists with proper grid position", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    const stats = page.locator(".experience-stats");
    await expect(stats).toBeVisible();

    // Verify grid position
    const gridColumn = await stats.evaluate(el =>
      window.getComputedStyle(el).gridColumn
    );
    expect(gridColumn).toContain("span 8");
  });

  test("biography and stats are in first viewport on mobile", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    const biography = page.locator(".about_biography-container");
    const stats = page.locator(".experience-stats");

    // Both should be in initial viewport (first blade)
    await expect(biography).toBeInViewport();
    // Stats may or may not be in viewport depending on content
    // But should not break the grid
    await expect(stats).toBeVisible();
  });

  test("loading states show skeletons", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);

    // Intercept API to delay response
    await page.route("**/api/**", route =>
      setTimeout(() => route.continue(), 2000)
    );

    await page.goto("/about");

    // Should see skeleton during load
    const skeleton = page.locator(".experience-stats-skeleton, .biography-skeleton");
    // Skeleton should exist during loading
  });
});
```

### Risk Assessment

**Riesgo:** 🟡 Medio (Requires styling decisions)

**Potential Issues:**
1. Fallback component styling may not match existing design system
2. Error state min-height may affect layout differently at breakpoints
3. Skeleton dimensions may not perfectly match loaded content

**Mitigations:**
1. Review existing skeleton patterns for styling consistency
2. Test at all breakpoints (mobile, tablet, desktop, wide)
3. Use existing color tokens and spacing from Tailwind config
4. Keep fallback simple - avoid over-engineering

### Breakpoints Reference

| Breakpoint | Range | CSS | Notes |
|------------|-------|-----|-------|
| Base (mobile) | 0-640px | (default) | Primary focus |
| `tablet:` | 641-840px | `@media (min-width: 641px)` | - |
| `nav:` | 841-1024px | `@media (min-width: 841px)` | - |
| `desktop:` | 1025-1440px | `@media (min-width: 1025px)` | - |
| `wide:` | ≥1441px | `@media (min-width: 1441px)` | - |

### References

- [Source: docs/layout-system.md] - Breakpoint system
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:132-141] - FR18-FR19 specifications
- [Source: _bmad-output/planning-artifacts/epics-v2.md:65-67] - Story 12.8 definition
- [Source: src/app/about/page.jsx] - About page grid structure
- [Source: src/app/about/styles.css] - About page styles
- [Source: src/ui/organisms/ExperienceStats/] - Stats component
- [Source: src/ui/organisms/Biography/] - Biography component
- [Source: Story 12.7] - Previous story patterns and learnings

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
