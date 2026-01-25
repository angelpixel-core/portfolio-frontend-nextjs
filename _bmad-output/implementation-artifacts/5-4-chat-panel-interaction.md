# Story 5.4: Chat Panel Interaction

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to interact with a chat panel**,
So that **I can get quick information or feel engaged**.

---

## Acceptance Criteria

### AC1: Chat Panel Opening
**Given** I view any page
**When** I click the chat icon
**Then** the chat panel opens with smooth animation
**And** I can see predefined quick responses

### AC2: Chat Panel Closing
**Given** the chat panel is open
**When** I press Escape or click outside
**Then** the panel closes
**And** focus returns to the trigger button

### AC3: Keyboard Accessibility
**Given** I use keyboard navigation
**When** I interact with chat
**Then** all controls are keyboard accessible
**And** focus is trapped within the panel when open

---

## Tasks / Subtasks

- [ ] **Task 1: Migrate Chat organism to TypeScript** (AC: #1, #2, #3)
  - [ ] 1.1 Migrate `src/ui/organisms/Chat/index.jsx` → `index.tsx`
  - [ ] 1.2 Migrate `src/ui/organisms/Chat/ChatBox.jsx` → `ChatBox.tsx`
  - [ ] 1.3 Migrate `src/ui/organisms/Chat/presets.js` → `presets.ts`
  - [ ] 1.4 Define TypeScript interfaces for Chat props
  - [ ] 1.5 Wire ChatButton to open FloatingMobile with ChatBox (TODO in current code)

- [ ] **Task 2: Migrate Chat Form components to TypeScript** (AC: #1)
  - [ ] 2.1 Migrate `Form/EmailBox.jsx` → `EmailBox.tsx`
  - [ ] 2.2 Migrate `Form/EmailInput.jsx` → `EmailInput.tsx`
  - [ ] 2.3 Migrate `Form/JobTypeBox.jsx` → `JobTypeBox.tsx`
  - [ ] 2.4 Migrate `Form/MessageBox.jsx` → `MessageBox.tsx`
  - [ ] 2.5 Migrate `Form/AttachmentBox.jsx` → `AttachmentBox.tsx`
  - [ ] 2.6 Migrate `Form/Submit.jsx` → `Submit.tsx`
  - [ ] 2.7 Define TypeScript interfaces for all form components

- [ ] **Task 3: Migrate ChatButton atom to TypeScript** (AC: #1, #3)
  - [ ] 3.1 Migrate `src/ui/atoms/buttons/ChatButton/index.jsx` → `index.tsx`
  - [ ] 3.2 Define ChatButtonProps interface
  - [ ] 3.3 Add proper aria-label ("Open chat panel" / "Close chat panel")
  - [ ] 3.4 Update barrel export in `src/ui/atoms/buttons/index.js`

- [ ] **Task 4: Migrate chatPanel Redux slice to TypeScript** (AC: #1, #2)
  - [ ] 4.1 Migrate `src/state/slices/chatPanel/slice.js` → `slice.ts`
  - [ ] 4.2 Migrate `src/state/slices/chatPanel/hooks.js` → `hooks.ts`
  - [ ] 4.3 Migrate `src/state/slices/chatPanel/index.js` → `index.ts`
  - [ ] 4.4 Define ChatPanelState interface

- [ ] **Task 5: Implement Chat Panel integration** (AC: #1, #2)
  - [ ] 5.1 Wire Chat organism to render FloatingMobile when isOpen
  - [ ] 5.2 Pass ChatBox as children to FloatingMobile
  - [ ] 5.3 Verify Escape key closes panel (already in FloatingMobile)
  - [ ] 5.4 Verify click outside closes panel (already in FloatingMobile)
  - [ ] 5.5 Verify focus returns to trigger button (already in FloatingMobile)

- [ ] **Task 6: Add accessibility improvements** (AC: #3)
  - [ ] 6.1 Add aria-label to ChatButton based on isOpen state
  - [ ] 6.2 Verify focus trap is working (already in FloatingMobile)
  - [ ] 6.3 Add focus-visible styles to ChatButton (verify current styles)
  - [ ] 6.4 Ensure 44x44px minimum touch target for ChatButton
  - [ ] 6.5 Add aria-live region for chat responses (if applicable)

- [ ] **Task 7: Add component tests** (AC: #1, #2, #3) - TDD Approach
  - [ ] 7.1 Create `Chat/__tests__/Chat.test.tsx`
  - [ ] 7.2 Test: ChatButton renders with correct aria-label
  - [ ] 7.3 Test: Clicking ChatButton opens chat panel
  - [ ] 7.4 Test: Pressing Escape closes chat panel
  - [ ] 7.5 Test: Focus returns to ChatButton after close
  - [ ] 7.6 Test: Focus is trapped within panel when open
  - [ ] 7.7 Test: ChatButton is keyboard accessible (Enter/Space)
  - [ ] 7.8 Create `ChatButton/__tests__/ChatButton.test.tsx`

- [ ] **Task 8: Final Validation** (AC: #1, #2, #3)
  - [ ] 8.1 Run `npm run lint` - PASS
  - [ ] 8.2 Run `npm run typecheck` - PASS
  - [ ] 8.3 Run `npm test` - PASS
  - [ ] 8.4 Manual: Click chat button → panel opens with animation
  - [ ] 8.5 Manual: Press Escape → panel closes, focus returns
  - [ ] 8.6 Manual: Click outside panel → panel closes
  - [ ] 8.7 Manual: Tab through panel → focus trapped
  - [ ] 8.8 Manual: Mobile test → touch targets ≥44x44px

---

## Dev Notes

### Previous Story Learnings (Story 5.1, 5.2, 5.3)

**APPLY THESE PATTERNS:**
- TypeScript migration pattern: index.tsx, Component.tsx
- 44x44px minimum touch targets for mobile a11y
- aria-labels on interactive elements (dynamic based on state)
- focus-visible styles with outline
- Graceful fallback when data not available
- Tests: rendering, accessibility, keyboard interaction
- TDD approach: Write tests BEFORE implementation (RED → GREEN → REFACTOR)
- Fix regressions immediately, document non-blocking issues in backlog

**Story 5.3 Insights:**
- Icon links should be aria-hidden if text link already has aria-label
- Check for duplicate aria-labels across related elements
- Suspense patterns for async loading

### Current State Analysis

**Chat Organism (JSX, needs TypeScript migration + wiring):**
```
src/ui/organisms/Chat/
├── index.jsx         # Main component (currently only renders ChatButton)
├── ChatBox.jsx       # Form container (not wired to overlay)
├── presets.js        # Job type options
├── styles.css        # Chat styles
└── Form/
    ├── EmailBox.jsx
    ├── EmailInput.jsx
    ├── JobTypeBox.jsx
    ├── MessageBox.jsx
    ├── AttachmentBox.jsx
    └── Submit.jsx
```

**ChatButton Atom (JSX, needs TypeScript migration):**
```
src/ui/atoms/buttons/ChatButton/
├── index.jsx         # Button with toggle logic
└── styles.css        # Button styles (has focus-visible)
```

**Redux State (JS, needs TypeScript migration):**
```
src/state/slices/chatPanel/
├── index.js          # Barrel export
├── slice.js          # Redux slice (isOpen state)
└── hooks.js          # useChatPanel hook
```

**FloatingMobile Overlay (JSX, already functional):**
```
src/ui/overlays/FloatingMobile/
├── index.jsx         # Modal with focus trap, Escape, click outside
└── styles.css        # Modal styles
```

**Issues Found in Current Implementation:**

1. **Chat organism doesn't wire to FloatingMobile:**
   ```javascript
   // Current code has TODO comment:
   // TODO: When the chat overlay is ready, wire ChatButton to open
   // FloatingMobile with ChatBox. For now, we only render the button
   ```
   - Need to complete this wiring

2. **ChatButton has text "Say Hello!" / "Cerrar Chat":**
   - Missing proper aria-label for screen readers
   - Text changes based on state but no accessible announcement

3. **ChatButton lacks aria-expanded attribute:**
   - Should indicate panel state to screen readers

4. **No tests exist for Chat components:**
   - No test files in `__tests__` folders

5. **FloatingMobile already has a11y features:**
   - Focus trap ✅
   - Escape key close ✅
   - Click outside close ✅
   - Focus return ✅
   - role="dialog" ✅
   - aria-modal="true" ✅
   - aria-labelledby ✅

### Chat Panel State (Redux)

```typescript
// Current slice structure
interface ChatPanelState {
  isOpen: boolean;
}

// Actions available:
setChatPanel(value: boolean)
openChatPanel()
closeChatPanel()
toggleChatPanel()

// Hook usage:
const { isOpen, toggle, open, close } = useChatPanel();
```

### Chat Form Structure

The ChatBox contains a contact form with:
- Email input (required)
- Job type selection (hours, part-time, full-time)
- Message textarea
- File attachment (PDF, DOC, DOCX)
- Submit button

**Note:** This story focuses on panel interaction, NOT form validation or submission. Form functionality is existing code that should continue to work.

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/organisms/`, `@/buttons/`, `@/state/slices` |
| Atomic Design | Chat in `organisms/`, ChatButton in `atoms/buttons/` |
| Redux Toolkit | Continue using existing chatPanel slice |
| Test convention | Tests in `__tests__/` folders |
| Accessibility | aria-labels, aria-expanded, focus trap, keyboard nav |
| Client Components | Chat components need "use client" (Redux hooks) |

### Testing Strategy

**Chat Tests:**
- ChatButton renders with correct initial aria-label
- ChatButton aria-label changes when panel opens/closes
- ChatButton has aria-expanded attribute matching isOpen
- Clicking ChatButton toggles panel visibility
- Pressing Escape when panel open closes it
- Focus returns to ChatButton after close
- Focus is trapped within panel when open
- Tab navigation works correctly within panel
- ChatButton responds to Enter and Space keys

**Test Mocks Needed:**
- Redux store with chatPanel slice
- framer-motion (use existing mock utility)
- FloatingMobile (or test integration)

### Related Files

```
src/ui/organisms/Chat/           # Main Chat organism
src/ui/atoms/buttons/ChatButton/ # Chat trigger button
src/state/slices/chatPanel/      # Redux state management
src/ui/overlays/FloatingMobile/  # Modal overlay (already functional)
src/hooks/store.js               # useAppSelector, useAppDispatch
```

### NFR Compliance (from PRD)

**NFR15:** 100% funcionalidad accesible por teclado
- Chat panel must be fully keyboard accessible

**NFR18:** Focus visible en todos los interactivos
- ChatButton already has focus-visible styles

**NFR19:** Respetar prefers-reduced-motion
- FloatingMobile already handles reduced motion

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm test              # Jest unit tests
```

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] Navigate to any page → Chat button visible in footer
- [ ] Click chat button → panel opens with animation
- [ ] Panel shows ChatBox form with email, job type, message, attachment
- [ ] Press Escape → panel closes
- [ ] Click outside panel → panel closes
- [ ] Focus returns to chat button after close
- [ ] Tab through panel → focus stays trapped inside
- [ ] Shift+Tab → focus cycles backwards correctly
- [ ] Chat button shows "Close" state when panel open
- [ ] Screen reader announces button state changes
- [ ] Touch target is at least 44x44px on mobile
- [ ] Reduced motion preference → animation is minimal/instant

---

## References

- [Source: epics.md#Story 5.4] - Original acceptance criteria (FR21)
- [Source: 5-3-calendly-scheduling.md] - Calendly patterns (TypeScript, a11y)
- [Source: src/ui/organisms/Chat/] - Current Chat implementation
- [Source: src/ui/overlays/FloatingMobile/] - Modal overlay with focus trap
- [Source: src/state/slices/chatPanel/] - Redux state for panel
- [Source: architecture.md] - TypeScript migration, testing patterns
- [WCAG 2.4.3] - Focus Order requirements
- [WCAG 2.4.7] - Focus Visible requirements
- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) - Modal a11y

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
