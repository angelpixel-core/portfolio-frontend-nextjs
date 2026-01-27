# Story 11.1: Define Official Project Breakpoints

Status: done

## Story

As a developer,
I want officially defined and documented breakpoints,
so that all responsive decisions are consistent across the codebase.

## Acceptance Criteria

1. **AC1: Design System Documentation**
   - **Given** the design system documentation
   - **When** I need to make responsive decisions
   - **Then** I can reference documented breakpoint definitions

2. **AC2: Tailwind Configuration**
   - **Given** Tailwind configuration
   - **When** I check theme.screens
   - **Then** custom breakpoints match documented values

3. **AC3: Component Alignment**
   - **Given** any component using responsive styles
   - **When** I review the breakpoint used
   - **Then** it aligns with the official breakpoint names

> **Scope Clarification:** This story defines the breakpoint system infrastructure (configuration + documentation). Migration of existing components to use new semantic breakpoints is explicitly OUT OF SCOPE and will be addressed in Story 11.3 (Implement Visibility Rules) and Story 11.4 (Refactor Header Layout). Legacy breakpoints are preserved for backward compatibility.

## Tasks / Subtasks

- [x] Task 1: Analyze current breakpoint system (AC: 2, 3)
  - [x] 1.1: Document current `tailwind.config.js` screens configuration
  - [x] 1.2: Audit all components using responsive classes (lg:, md:, sm:, etc.)
  - [x] 1.3: Identify magic numbers in styles (arbitrary pixel values)
  - [x] 1.4: Map current behavior to breakpoint ranges

- [x] Task 2: Define official breakpoints (AC: 1, 2)
  - [x] 2.1: Create breakpoint specification matching Epic 11 design intent
  - [x] 2.2: Document Mobile (≤640px), Tablet (641-1024px), Desktop (1025-1440px), Wide (≥1441px)
  - [x] 2.3: Decide approach: min-width (standard) vs max-width (current)
  - [x] 2.4: Update `tailwind.config.js` with new/adjusted screen values

- [x] Task 3: Document breakpoint system (AC: 1)
  - [x] 3.1: Create breakpoints section in architecture.md or layout-system.md
  - [x] 3.2: Include usage examples for each breakpoint
  - [x] 3.3: Document the responsive class naming convention

- [x] Task 4: Validate no regressions (AC: 3)
  - [x] 4.1: Visual check at each breakpoint boundary
  - [x] 4.2: Run existing E2E tests to verify no breakage

## Dev Notes

### 🚨 CRITICAL FINDING: Inverted Breakpoint System

**Current Configuration (`tailwind.config.js:52-59`):**
```javascript
screens: {
  "2xl": { max: "1535px" },
  xl: { max: "1279px" },
  lg: { max: "1023px" },
  md: { max: "767px" },
  sm: { max: "639px" },
  xs: { max: "479px" },
}
```

**This is MAX-WIDTH based (inverted from Tailwind defaults):**
- `lg:flex` = "apply flex when viewport ≤ 1023px"
- Standard Tailwind: `lg:flex` = "apply flex when viewport ≥ 1024px"

**Impact on Current NavBar:**
- `.menu-bar { @apply hidden lg:flex }` → HIDES on desktop (>1023px), SHOWS on mobile
- `.menu-floating { @apply flex lg:hidden }` → SHOWS on desktop, HIDES on mobile

This explains user report of navbar issues at ~1250px - the system is working as coded but may not match designer intent.

### Target Breakpoints (Epic 11)

| Nombre | Rango | Descripción |
|--------|-------|-------------|
| Mobile | ≤640px | Single column, burger menu |
| Tablet | 641-1024px | Transitional, selective collapse |
| Desktop | 1025-1440px | Full navigation visible |
| Wide | ≥1441px | All elements visible, expanded |

### Decision Required: MIN-WIDTH vs MAX-WIDTH

**Option A: Convert to min-width (standard Tailwind)**
```javascript
screens: {
  sm: '640px',    // @media (min-width: 640px)
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```
- Pros: Standard, familiar, most tutorials/docs use this
- Cons: Requires updating ALL responsive classes in codebase

**Option B: Keep max-width but clarify**
- Pros: No code changes needed
- Cons: Counter-intuitive, requires documentation

**Option C: Hybrid - add named breakpoints**
```javascript
screens: {
  // Keep existing max-width for backward compatibility
  "2xl": { max: "1535px" },
  xl: { max: "1279px" },
  lg: { max: "1023px" },
  md: { max: "767px" },
  sm: { max: "639px" },
  xs: { max: "479px" },
  // Add new semantic breakpoints (min-width)
  'mobile': '640px',
  'tablet': '1024px',
  'desktop': '1440px',
  'wide': '1441px',
}
```
- Pros: Gradual migration, clear intent
- Cons: Two systems in parallel

**Recommendation:** Option C (Hybrid) - allows incremental adoption of semantic breakpoints while maintaining backward compatibility. Story 11.3+ can migrate components gradually.

### Project Structure Notes

**Files to Modify:**
- `tailwind.config.js` - Add/update screen definitions
- `_bmad-output/planning-artifacts/architecture.md` - Document breakpoint system (new section)
- Potentially create `docs/layout-system.md` if architecture.md becomes too large

**Files to Audit for Magic Numbers:**
- `src/ui/organisms/NavBar/styles.css`
- `src/ui/organisms/Menu/styles.css`
- `src/ui/organisms/MenuFloating/styles.css`
- All files using responsive Tailwind classes

### Current NavBar Component Structure

```
NavBar/
├── index.jsx         # Header container with Menu, MenuFloating, Logo
├── styles.css        # .layout_navbar-container, .layout_logo-container

Menu/                 # Desktop navigation (currently inverted)
├── index.jsx         # Primary nav, social links, auth buttons, theme
├── styles.css        # .menu-bar { hidden lg:flex } ← INVERTED
├── skeletons/        # Loading states

MenuFloating/         # Mobile navigation (burger menu)
├── index.jsx         # Wrapper for MenuFloatingClient
├── styles.css        # .menu-floating { flex lg:hidden } ← INVERTED
├── skeletons/        # Loading states

MenuFloatingClient/   # Client-side burger menu logic
├── index.jsx
```

### Header Zones (for Story 11.2 context)

1. **Brand zone** - Logo (center positioned absolute)
2. **Primary navigation** - Home / About / Projects / Articles
3. **Social / Contact** - WhatsApp, Telegram, Twitter, LinkedIn, etc.
4. **Auth actions** - LinkedIn / Microsoft / Google sign-in buttons
5. **UI controls** - ThemeButton
6. **Floating CTA** - "Hire me" (separate from header)

### References

- [Source: tailwind.config.js:52-59] - Current breakpoint configuration
- [Source: src/ui/organisms/Menu/styles.css:1-4] - Menu responsive rules
- [Source: src/ui/organisms/MenuFloating/styles.css:1-3] - MenuFloating responsive rules
- [Source: _bmad-output/planning-artifacts/epics.md:1408-1414] - Epic 11 breakpoint definitions
- [Source: _bmad-output/planning-artifacts/architecture.md] - Architecture patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Analyzed 67 usages of `lg:`, 48 of `md:`, 35 of `sm:`, 25 of `xs:`, 15 of `xl:`
- Found 2 hardcoded media queries (@media max-width: 768px, 600px)
- WCAG 44px touch targets are intentional, not magic numbers

### Completion Notes List

1. **Analysis Complete**: Documented inverted max-width breakpoint system causing navbar confusion
2. **Hybrid Solution Implemented**: Added semantic breakpoints (tablet:, desktop:, wide:) using min-width
3. **Backward Compatibility**: Preserved legacy breakpoints (lg:, md:, sm:, etc.) with deprecation comments
4. **Documentation Created**: New docs/layout-system.md with usage guidelines and migration path
5. **Validation Passed**: All 33 E2E tests pass, lint check clean
6. **Code Review Fixes (2026-01-27)**:
   - H1: Aligned breakpoints with Epic 11 ranges (tablet: 641px, desktop: 1025px, wide: 1441px)
   - H3: Removed confusing `mobile:` breakpoint - base styles cover mobile (0-640px)
   - H2: Added scope clarification - component migration is Story 11.3+
   - M1: Removed broken ADR documentation link
   - L2: Fixed CSS example to show single declaration pattern
   - L3: Removed fragile relative path references

### File List

- `tailwind.config.js` - Added semantic breakpoints (mobile, tablet, desktop, wide) with min-width
- `docs/layout-system.md` - NEW: Comprehensive breakpoint documentation
- `docs/index.md` - Updated to include layout-system.md link


