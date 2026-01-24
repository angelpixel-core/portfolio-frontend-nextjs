# Story 1.8: Responsive Design & Reduced Motion

**Status:** ready-for-dev
**Branch:** story/1.8-responsive-design-reduced-motion

---

## Story

As a **visitor on any device**,
I want **the site to display perfectly and respect my motion preferences**,
so that **I have an optimal, comfortable experience**.

---

## Acceptance Criteria

### AC1: Mobile Viewport (320px-767px)

**Given** I view the site on mobile (320px-767px)
**When** the page renders
**Then** all content is readable without horizontal scroll
**And** touch targets are at least 44x44px

### AC2: Reduced Motion Preference

**Given** my system preference is reduce-motion
**When** animations would normally play
**Then** animations are disabled or minimized
**And** transitions are instant or very short (<100ms)

### AC3: Framer Motion Integration

**Given** components use framer-motion animations
**When** prefers-reduced-motion is enabled
**Then** motion variants are simplified or disabled
**And** no jarring movements occur

### AC4: Automated Testing

**Given** responsive and reduced-motion tests run
**When** tests execute in CI
**Then** viewport tests pass for mobile/tablet/desktop
**And** reduced-motion CSS is verified

---

## Tasks / Subtasks

- [ ] **Task 1: Audit Current Responsive State** (AC: #1)
  - [ ] 1.1 Test all pages at 320px, 375px, 768px viewports
  - [ ] 1.2 Document any horizontal scroll issues
  - [ ] 1.3 Identify touch targets smaller than 44x44px
  - [ ] 1.4 Create list of components needing responsive fixes

- [ ] **Task 2: Fix Mobile Viewport Issues** (AC: #1)
  - [ ] 2.1 Fix any horizontal overflow issues found
  - [ ] 2.2 Ensure touch targets meet 44x44px minimum
  - [ ] 2.3 Verify text readability at mobile widths
  - [ ] 2.4 Atomic commit

- [ ] **Task 3: Implement CSS prefers-reduced-motion** (AC: #2)
  - [ ] 3.1 Create `src/styles/reduced-motion.css` with base rules
  - [ ] 3.2 Add `@media (prefers-reduced-motion: reduce)` rules
  - [ ] 3.3 Import in `globals.css`
  - [ ] 3.4 Test with Chrome DevTools emulation
  - [ ] 3.5 Atomic commit

- [ ] **Task 4: Implement useReducedMotion for Framer Motion** (AC: #3)
  - [ ] 4.1 Create `src/hooks/useReducedMotion.ts` wrapper hook
  - [ ] 4.2 Update `Floating/index.jsx` to use reduced motion
  - [ ] 4.3 Update `FloatingMobile/index.jsx` to use reduced motion
  - [ ] 4.4 Update `AnimatedChildren` to respect preference
  - [ ] 4.5 Test all overlay animations with reduced-motion enabled
  - [ ] 4.6 Atomic commit

- [ ] **Task 5: Create Responsive Tests** (AC: #4)
  - [ ] 5.1 Create `src/ui/__tests__/responsive.test.tsx`
  - [ ] 5.2 Test key components render without overflow at 320px
  - [ ] 5.3 Verify touch target sizes programmatically
  - [ ] 5.4 Atomic commit

- [ ] **Task 6: Validation** (AC: #1-4)
  - [ ] 6.1 Run `npm run typecheck` - verify no errors
  - [ ] 6.2 Run `npm run test` - all tests pass
  - [ ] 6.3 Run `npm run lint` - verify no errors
  - [ ] 6.4 Manual testing on real mobile device (iPhone/Android)
  - [ ] 6.5 Manual testing with macOS "Reduce motion" enabled

---

## Dev Notes

### NFRs Addressed

| NFR | Requirement | Implementation |
|-----|-------------|----------------|
| NFR13 | WCAG 2.2 Level AA | prefers-reduced-motion support (WCAG 2.3.3) |
| NFR19 | Respetar prefers-reduced-motion | CSS + Framer Motion hooks |
| FR24 | Navigate on any device | Responsive viewport fixes |
| FR27 | Reduced motion when preferred | useReducedMotion integration |

### Architecture Constraints [Source: architecture.md]

| Decision | Value |
|----------|-------|
| Accessibility | WCAG 2.2 AA compliance |
| Testing | Jest 29 + RTL 14 |
| CSS | Tailwind CSS 3.4.18 |
| Animation Library | framer-motion (via motion/react) |

### CSS Implementation Pattern

```css
/* src/styles/reduced-motion.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Important:** Use `0.01ms` instead of `0` to ensure animations complete their final state immediately rather than being stuck at initial state.

### Framer Motion Hook Pattern

```typescript
// src/hooks/useReducedMotion.ts
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Wrapper hook for framer-motion's useReducedMotion
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
```

### Component Update Pattern

```jsx
// Before (Floating/index.jsx)
<motion.div
  initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
  animate={{ scale: 1, opacity: 1 }}
  ...
>

// After
import { useReducedMotion } from "@/hooks/useReducedMotion";

const Floating = ({ id, title = "Dialog", children }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion
        ? { opacity: 0 }
        : { scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
      animate={shouldReduceMotion
        ? { opacity: 1 }
        : { scale: 1, opacity: 1 }}
      transition={shouldReduceMotion
        ? { duration: 0.01 }
        : undefined}
      ...
    >
```

### Touch Target Requirements (WCAG 2.5.5)

- **Minimum:** 44x44px for all interactive elements
- **Check with:**
  ```javascript
  const element = screen.getByRole('button');
  const rect = element.getBoundingClientRect();
  expect(rect.width).toBeGreaterThanOrEqual(44);
  expect(rect.height).toBeGreaterThanOrEqual(44);
  ```

### Testing Reduced Motion in Chrome DevTools

1. Open DevTools (F12)
2. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Type "Rendering"
4. Select "Show Rendering"
5. Scroll to "Emulate CSS media feature prefers-reduced-motion"
6. Select "prefers-reduced-motion: reduce"

### Testing Reduced Motion on macOS

1. System Preferences → Accessibility → Display
2. Check "Reduce motion"

---

## Previous Story Intelligence

**Story 1.7:** Screen Reader Compatibility
- Pattern: jest-axe for automated a11y testing
- Pattern: `@/test-utils/axe-helper.ts` helper function
- Pattern: Mock hooks for isolated component testing
- Learning: Use `aria-hidden="true"` for decorative icons
- Learning: Use sr-only class for screen reader only text
- Files: Floating.jsx, FloatingMobile.jsx already have a11y attributes
- **Tech Debt:**
  - Only 10/52 icons have aria-hidden (others decorative too)
  - Manual VoiceOver validation pending

**Story 1.6:** Keyboard Navigation Excellence
- Pattern: Focus trap in FloatingMobile
- Pattern: Escape key handling for overlays
- Pattern: Skip link implementation
- Files modified: FloatingMobile, layout.jsx

**Relevant Commits (Story 1.7):**
```
19ba5a7 docs(story-1.7): mark story as done after merge to epic
d5041db fix(tests): resolve failing a11y tests from code review
e8cc651 a11y(icons): add aria-hidden to decorative icons
42951ed a11y(dialogs): add aria-labelledby to Floating components
```

---

## Library/Framework Requirements

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| framer-motion | ^11.x | Animation library with useReducedMotion | INSTALLED |
| tailwindcss | 3.4.18 | Responsive utilities | INSTALLED |
| @testing-library/react | ^14.1.2 | Component testing | INSTALLED |

### Framer Motion useReducedMotion

From [Motion for React docs](https://motion.dev/docs/react/-use-reduced-motion):

> The `useReducedMotion` hook returns `true` if the current device has the Reduced Motion setting enabled. This is crucial for creating accessible user experiences.

**Import:**
```javascript
import { useReducedMotion } from "framer-motion"
// OR
import { useReducedMotion } from "motion/react"
```

---

## Testing Requirements

### Responsive Tests

```typescript
// src/ui/__tests__/responsive.test.tsx
import { render, screen } from "@testing-library/react";

describe("Responsive Design", () => {
  it("renders NavBar without horizontal overflow at 320px", () => {
    // Set viewport
    Object.defineProperty(window, 'innerWidth', { value: 320 });

    const { container } = render(<NavBar />);

    // Check no horizontal overflow
    expect(container.scrollWidth).toBeLessThanOrEqual(320);
  });

  it("touch targets meet 44x44px minimum", () => {
    render(<MenuButton />);
    const button = screen.getByRole("button");
    const rect = button.getBoundingClientRect();

    expect(rect.width).toBeGreaterThanOrEqual(44);
    expect(rect.height).toBeGreaterThanOrEqual(44);
  });
});
```

### Reduced Motion CSS Test

```typescript
// src/styles/__tests__/reduced-motion.test.ts
describe("Reduced Motion CSS", () => {
  it("reduced-motion.css contains media query", () => {
    const cssPath = path.resolve(__dirname, "../reduced-motion.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    expect(cssContent).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssContent).toContain("animation-duration");
    expect(cssContent).toContain("transition-duration");
  });
});
```

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm run test          # Jest unit tests
```

---

## Manual Validation Checklist

> **OBLIGATORIO antes de merge a epic branch**

### Pre-requisitos

- [ ] Todos los tests automáticos pasan (`npm test`)
- [ ] Lint pasa (`npm run lint`)
- [ ] TypeScript compila (`npm run typecheck`)

### Mobile Viewport Testing

- [ ] Test at 320px width (iPhone SE)
- [ ] Test at 375px width (iPhone 12/13)
- [ ] Test at 768px width (iPad)
- [ ] Verify no horizontal scroll on any page
- [ ] Verify all touch targets ≥44x44px
- [ ] Test navigation menu on mobile

### Reduced Motion Testing

- [ ] Enable Chrome DevTools reduced-motion emulation
- [ ] Verify Floating overlay uses opacity fade only
- [ ] Verify FloatingMobile uses opacity fade only
- [ ] Verify page transitions are instant/minimal
- [ ] Enable macOS "Reduce motion" and verify real behavior
- [ ] Verify no jarring movements with setting enabled

### Manual Validation Result

- **Date:**
- **Validated by:**
- **Result:**
- **Notes:**

---

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

**To Create:**
- `src/styles/reduced-motion.css` (CSS reduced-motion rules)
- `src/hooks/useReducedMotion.ts` (wrapper hook)
- `src/ui/__tests__/responsive.test.tsx` (responsive tests)
- `src/styles/__tests__/reduced-motion.test.ts` (CSS verification test)

**To Modify:**
- `src/styles/globals.css` (import reduced-motion.css)
- `src/ui/overlays/Floating/index.jsx` (use reduced motion)
- `src/ui/overlays/FloatingMobile/index.jsx` (use reduced motion)
- `src/ui/molecules/AnimatedChildren/index.jsx` (if exists, use reduced motion)
- Any components with horizontal overflow at mobile widths

---

## References

### Web Sources

- [prefers-reduced-motion - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [prefers-reduced-motion | CSS-Tricks](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)
- [Design accessible animation and movement - Pope Tech Blog](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [Motion for React - Accessibility](https://motion.dev/docs/react/-accessibility)
- [C39: Using CSS prefers-reduced-motion | WAI | W3C](https://www.w3.org/WAI/WCAG21/Techniques/css/C39)

### Project Sources

- [Source: architecture.md#Testing-Architecture]
- [Source: architecture.md#Accessibility]
- [Source: epics.md#Story-1.8]
- [Source: prd.md#NFR19]
