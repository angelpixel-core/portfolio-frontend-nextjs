# Story 5.5: Copy Contact to Clipboard

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to copy contact information to clipboard**,
So that **I can paste it elsewhere easily**.

---

## Acceptance Criteria

### AC1: Copy to Clipboard Functionality
**Given** I view an email or phone number
**When** I click the copy button
**Then** the text is copied to clipboard
**And** I see visual feedback (toast or icon change)

### AC2: Keyboard Accessibility
**Given** I use keyboard
**When** I press Enter on the copy button
**Then** it copies and shows feedback

### AC3: Clipboard Access Denied Fallback
**Given** clipboard access is denied
**When** I try to copy
**Then** a fallback message is shown (select and copy manually)

---

## Tasks / Subtasks

- [x] **Task 1: Migrate EmailClipboard Redux slice to TypeScript** (AC: #1)
  - [x] 1.1 Migrate `src/state/slices/EmailClipboard/slice.js` → `slice.ts`
  - [x] 1.2 Migrate `src/state/slices/EmailClipboard/hooks.js` → `hooks.ts`
  - [x] 1.3 Migrate `src/state/slices/EmailClipboard/index.js` → `index.ts`
  - [x] 1.4 Define EmailClipboardState interface

- [ ] **Task 2: Implement clipboard error fallback** (AC: #3)
  - [ ] 2.1 Add `error` state to EmailClipboard slice (null | string)
  - [ ] 2.2 Update CopyButton to set error state on clipboard failure
  - [ ] 2.3 Display fallback message when error state is set
  - [ ] 2.4 Auto-clear error state after 3 seconds (or on next attempt)

- [ ] **Task 3: Add keyboard accessibility tests** (AC: #2)
  - [ ] 3.1 Test: CopyButton responds to Enter key
  - [ ] 3.2 Test: CopyButton responds to Space key
  - [ ] 3.3 Verify focus-visible styles are present (already in CSS)

- [ ] **Task 4: Add error fallback tests** (AC: #3)
  - [ ] 4.1 Test: When clipboard.writeText rejects, error message displays
  - [ ] 4.2 Test: Error message has accessible text
  - [ ] 4.3 Test: Error auto-clears after timeout
  - [ ] 4.4 Test: Successful copy clears previous error

- [ ] **Task 5: Final Validation** (AC: #1, #2, #3)
  - [ ] 5.1 Run `npm run lint` - must pass
  - [ ] 5.2 Run `npm run typecheck` - must pass
  - [ ] 5.3 Run `npm test` - must pass
  - [ ] 5.4 Manual: Click copy button → text copied to clipboard
  - [ ] 5.5 Manual: Icon changes from copy to check, then back
  - [ ] 5.6 Manual: Tab to copy button → press Enter → copies
  - [ ] 5.7 Manual: Simulate clipboard deny (browser settings) → fallback shows

---

## Dev Notes

### Previous Story Learnings (Story 5.1, 5.4)

**APPLY THESE PATTERNS:**
- TypeScript migration pattern: slice.ts, hooks.ts, index.ts
- Error handling with user-visible feedback (not just console.log)
- Tests: rendering, accessibility, error states
- TDD approach: Write tests BEFORE implementation (RED → GREEN → REFACTOR)
- Fix regressions immediately, document non-blocking issues in backlog

**Story 5.1 Insight:**
- CopyButton already has `navigator.clipboard.writeText()` implementation
- Visual feedback (icon change) already works
- 44x44px touch target already met
- Missing: user-visible error fallback (only console.error currently)

**Story 5.4 Code Review Insight:**
- "Clipboard fake" was identified as a blocker issue
- Implementation EXISTS but error fallback needs user-facing message

### Current State Analysis

**CopyButton Atom (TypeScript, ALREADY MIGRATED):**
```
src/ui/atoms/buttons/CopyButton/
├── index.tsx         # Copy button with clipboard API ✅
├── styles.css        # 44x44px touch target ✅
└── __tests__/CopyButton.test.tsx  # 10 tests ✅
```

**Current CopyButton Implementation:**
```typescript
const handleCopy = async () => {
  const el = document.getElementById("emailTextId");
  if (!el) return;

  const text = el.innerText;

  try {
    await navigator.clipboard.writeText(text);
    markEmailClipboard();
    setTimeout(resetEmailClipboard, 2000);
  } catch (error) {
    // Fallback: Log error - could show toast notification here
    console.error("Failed to copy to clipboard:", error);
  }
};
```

**Issue:** Error handling only logs to console. AC3 requires user-visible fallback message.

**EmailClipboard Redux Slice (JavaScript, needs migration):**
```
src/state/slices/EmailClipboard/
├── slice.js          # Redux slice (isCopied state)
├── hooks.js          # useEmailClipboard hook
└── index.js          # Barrel export
```

**Current Slice State:**
```javascript
const initialState = {
  isCopied: false,
};
```

**Needs:**
```typescript
interface EmailClipboardState {
  isCopied: boolean;
  error: string | null;  // NEW: for fallback message
}
```

### Implementation Plan

**1. Add error state to slice:**
```typescript
// slice.ts
interface EmailClipboardState {
  isCopied: boolean;
  error: string | null;
}

const initialState: EmailClipboardState = {
  isCopied: false,
  error: null,
};

// New actions:
setError: (state, action: PayloadAction<string>) => {
  state.error = action.payload;
},
clearError: (state) => {
  state.error = null;
},
```

**2. Update CopyButton error handling:**
```typescript
catch (error) {
  setClipboardError("Unable to copy. Please select the email and copy manually.");
  setTimeout(clearClipboardError, 3000);
}
```

**3. Display error fallback:**
```typescript
{error && (
  <span className="copy-error-message" role="alert">
    {error}
  </span>
)}
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/state/slices/` |
| Redux Toolkit | Extend existing EmailClipboard slice |
| Test convention | Tests in `__tests__/` folders |
| Accessibility | aria-label on button, role="alert" on error |
| Error handling | User-visible message, not just console |

### Testing Strategy

**Existing Tests (10 tests in CopyButton.test.tsx):**
- renders copy button with accessible label ✅
- renders copy icon by default ✅
- copies email to clipboard on click ✅
- calls markEmailClipboard on successful copy ✅
- shows check icon when copied ✅
- logs error when clipboard fails ✅
- icons are aria-hidden ✅
- button is keyboard focusable ✅

**New Tests Needed:**
- Enter key triggers copy
- Space key triggers copy
- Error message displays on clipboard failure
- Error message has role="alert" for accessibility
- Error auto-clears after timeout
- Successful copy clears previous error

### Related Files

```
src/ui/atoms/buttons/CopyButton/          # Copy button component
src/state/slices/EmailClipboard/          # Redux slice for copy state
src/ui/molecules/CopyEmail/               # Uses CopyButton
src/ui/organisms/Footer/                  # Contains CopyEmail
```

### NFR Compliance (from PRD)

**NFR15:** 100% funcionalidad accesible por teclado
- CopyButton already keyboard accessible (Enter/Space work via native button)

**NFR18:** Focus visible en todos los interactivos
- Already has focus-visible styles in CSS

**NFR26:** Error Boundary con graceful degradation
- Fallback message provides graceful degradation when clipboard fails

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

- [ ] Navigate to contact section → CopyEmail visible
- [ ] Click copy button → email copied to clipboard (paste test)
- [ ] Icon changes from copy to check (visual feedback)
- [ ] After 2 seconds, icon returns to copy
- [ ] Tab to copy button → Enter key copies
- [ ] Tab to copy button → Space key copies
- [ ] Simulate clipboard deny → fallback message visible
- [ ] Fallback message disappears after 3 seconds
- [ ] Screen reader announces error message (role="alert")

---

## References

- [Source: epics.md#Story 5.5] - Original acceptance criteria (FR22)
- [Source: 5-1-email-contact-access.md] - CopyButton implementation details
- [Source: 5-4-chat-panel-interaction-[code-review].md] - Clipboard fix identified as blocker
- [Source: src/ui/atoms/buttons/CopyButton/] - Current implementation
- [Source: src/state/slices/EmailClipboard/] - Redux state to migrate
- [WAI-ARIA Live Regions](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) - Error message a11y

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

### Completion Notes List

### File List
