# Story 12.9: About Skills Interaction States

Status: ready-for-dev

## Story

As a visitor viewing the About page Skills section,
I want the skill category buttons to clearly indicate their active state and synchronize with the visual galaxy/spiral display,
so that I can easily see which skills belong to each proficiency level.

## Acceptance Criteria

1. **AC1: Skill Category Buttons Present**
   - **Given** the About page Skills section loads
   - **When** the SkillSelector component renders
   - **Then** 5 category buttons are visible: Senior (5 años), Middle (3 años), Junior (1 año), Trainee (Training), Roadmap
   - **And** each button has a distinct color per category
   - **Note:** FR20 specifies "Botones: 1 año, 3 años, 5 años, Training, Roadmap"

2. **AC2: Button Active State Visually Distinct**
   - **Given** a category button is clicked
   - **When** the button transitions to active state
   - **Then** the button has a clearly visible active indicator (ring, background change, or similar)
   - **And** the `aria-pressed="true"` attribute is set
   - **And** the visual change is obvious without relying solely on color
   - **Note:** FR21 specifies "activo por color" + FR22 "estado activo debe ser claro y persistente"

3. **AC3: Skills Visual Sync on Button Activation**
   - **Given** a category button is clicked
   - **When** the button becomes active
   - **Then** all skill icons matching that proficiency category illuminate/highlight
   - **And** the skill name labels become visible (no longer hidden)
   - **And** the visual synchronization is immediate (no perceptible delay)
   - **Note:** FR21 specifies "elementos visuales se iluminan en sincronía"

4. **AC4: Active State Persistence**
   - **Given** a category button is active
   - **When** the user scrolls away and back to the Skills section
   - **Then** the active state persists (button remains active, skills remain highlighted)
   - **And** the state is maintained until the user explicitly deactivates
   - **Note:** FR22 specifies "estado activo debe ser claro y persistente"

5. **AC5: Multiple Categories Can Be Active**
   - **Given** one or more category buttons are active
   - **When** the user clicks another category button
   - **Then** that button also becomes active (multi-select behavior)
   - **And** skills from all active categories are highlighted
   - **And** deactivating one category does not affect others

6. **AC6: Reduced Motion Respected**
   - **Given** the user has `prefers-reduced-motion` enabled
   - **When** interacting with skill buttons
   - **Then** highlight transitions are immediate without animation
   - **And** skill icons do not animate position changes

## Tasks / Subtasks

- [ ] Task 1: Audit Current Skills Interaction Implementation (AC: 1-5)
  - [ ] 1.1: Review SkillSelectorButton click handler and DOM manipulation
  - [ ] 1.2: Verify current active state visual styling
  - [ ] 1.3: Test skill icon highlight synchronization timing
  - [ ] 1.4: Check aria-pressed attribute implementation
  - [ ] 1.5: Document current behavior vs expected FR20-FR22

- [ ] Task 2: Improve Button Active State Visibility (AC: 2, 4)
  - [ ] 2.1: Enhance active state CSS beyond ring-primary-300
  - [ ] 2.2: Add non-color visual indicator (border, shadow, or icon)
  - [ ] 2.3: Ensure active state persists across scroll/re-render
  - [ ] 2.4: Test at all breakpoints (mobile, tablet, desktop)

- [ ] Task 3: Verify Skills Visual Sync (AC: 3, 6)
  - [ ] 3.1: Test highlight sync timing (should be immediate)
  - [ ] 3.2: Verify skill labels show/hide correctly
  - [ ] 3.3: Check reduced motion behavior in animations
  - [ ] 3.4: Ensure glow effect activates for correct categories

- [ ] Task 4: Add data-testid Attributes (AC: 1-5)
  - [ ] 4.1: Add data-testid to SkillSelector container
  - [ ] 4.2: Add data-testid to each category button
  - [ ] 4.3: Add data-testid to Skills container
  - [ ] 4.4: Ensure Skill items have data-category attribute

- [ ] Task 5: E2E Tests (AC: 1-6)
  - [ ] 5.1: Test all 5 category buttons visible
  - [ ] 5.2: Test button click toggles aria-pressed
  - [ ] 5.3: Test skill highlight sync on button activation
  - [ ] 5.4: Test active state persists across scroll
  - [ ] 5.5: Test multi-select behavior
  - [ ] 5.6: Test reduced motion behavior (if possible in E2E)

- [ ] Task 6: Documentation Update
  - [ ] 6.1: Add changelog entry for Story 12.9 in layout-system.md
  - [ ] 6.2: Document any new interaction patterns

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR20:** Botones: 1 año, 3 años, 5 años, Training, Roadmap
**FR21:** Al seleccionar botón: activo por color + elementos visuales se iluminan en sincronía
**FR22:** Estado activo debe ser claro y persistente

**From epic-12-ux-behavior.md Section 5.2 (Skills):**
> • Botones:
>   • 1 año
>   • 3 años
>   • 5 años
>   • Training
>   • Roadmap
>
> Interacción
> • Al seleccionar un botón:
>   • El botón queda activo por color
>   • Los elementos visuales (galaxia / espiral) se iluminan en sincronía
>   • El estado activo debe ser claro y persistente

### Risk Assessment

**Riesgo:** 🔴 Alto (CSS + JS coordination)

From epics-v2.md: Story 12.9 is categorized as high risk due to CSS + JS synchronization requirements.

### Current Implementation Analysis

**SkillSelectorButton Current Behavior (`src/ui/atoms/buttons/SkillSelectorButton/index.jsx`):**
```jsx
const handleClick = () => {
  setIsActive(!isActive);
  // DOM manipulation to show/hide skills
  const skills = document.querySelectorAll(`.skill_category--${category}`);
  skills.forEach((skill) => {
    const svg = skill.querySelector("svg");
    const label = skill.querySelector(".skill-label");
    if (!isActive) {
      svg?.classList.add("highlight");
      label?.classList.remove("hidden");
    } else {
      svg?.classList.remove("highlight");
      label?.classList.add("hidden");
    }
  });
};
```

**Current Issues to Investigate:**
1. DOM manipulation pattern (direct querySelector) - may cause sync issues
2. State is local to button component - may not persist correctly
3. No data-testid attributes for E2E testing
4. Need to verify highlight class styling is sufficient for FR21

**Color Mapping by Category:**
- **Senior:** Green (#4d7c0f)
- **Middle:** Cyan (#06b6d4)
- **Junior:** Magenta (#d946ef)
- **Trainee:** Amber (#f59e0b)
- **Roadmap:** Red (#ef4444)

### Component File Locations

```
src/ui/atoms/buttons/SkillSelectorButton/
├── index.jsx         # Button component - check active state
├── styles.css        # Active state styling
├── __tests__/        # Existing unit tests

src/ui/molecules/
├── SkillSelector/
│   ├── index.jsx     # Container for category buttons
│   └── styles.css
├── Skill/
│   ├── index.jsx     # Individual skill item
│   ├── Icon.jsx      # Icon subcomponent
│   └── styles.css    # Highlight/glow effects

src/ui/organisms/Skills/
├── index.jsx         # Main skills grid
├── skeleton.jsx      # Loading skeleton
├── styles.css        # Grid layout
├── __tests__/        # Existing unit tests
```

### Previous Story Intelligence (Story 12.8)

**Patterns Established:**
- Use `data-testid` for E2E testing
- Data comes from mocks, not network - can't intercept API for error states
- Use computed styles instead of classList for CSS applied via @apply
- Test conditional states with structure validation, not forced states
- Update layout-system.md changelog when making changes

**Code Review Learnings:**
- Always add min-height to fallback/placeholder states
- Tests should validate structure without assuming network behavior
- Legacy breakpoints apply CSS via @apply, not direct classes

### E2E Test Patterns

```typescript
// e2e/about-skills-interaction.spec.ts

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

const CATEGORIES = ["senior", "middle", "junior", "trainee", "roadmap"];

test.describe("About Skills Interaction (Story 12.9)", () => {
  test("all 5 category buttons are visible", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    const selector = page.locator(".skill-selector");
    await expect(selector).toBeVisible();

    // Check all 5 buttons exist
    const buttons = selector.locator("button");
    await expect(buttons).toHaveCount(5);
  });

  test("button click toggles aria-pressed", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    const seniorButton = page.locator('button:has-text("Senior")');
    await expect(seniorButton).toHaveAttribute("aria-pressed", "false");

    await seniorButton.click();
    await expect(seniorButton).toHaveAttribute("aria-pressed", "true");

    await seniorButton.click();
    await expect(seniorButton).toHaveAttribute("aria-pressed", "false");
  });

  test("skill icons highlight on button activation", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    const seniorButton = page.locator('button:has-text("Senior")');
    await seniorButton.click();

    // Skills with senior proficiency should have highlight class on SVG
    const seniorSkills = page.locator('[data-category="senior"] svg');
    const highlightCount = await seniorSkills.evaluateAll((svgs) =>
      svgs.filter((svg) => svg.classList.contains("highlight")).length
    );
    expect(highlightCount).toBeGreaterThan(0);
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
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:144-157] - FR20-FR22 specifications
- [Source: _bmad-output/planning-artifacts/epics-v2.md:74-78] - Story 12.9 definition
- [Source: src/ui/atoms/buttons/SkillSelectorButton/] - Button component
- [Source: src/ui/molecules/Skill/] - Skill item with highlight effect
- [Source: src/ui/organisms/Skills/] - Skills grid container
- [Source: Story 12.8] - Previous story patterns and learnings

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
