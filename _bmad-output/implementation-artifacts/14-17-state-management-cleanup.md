# Story 14.17: State Management Cleanup

Status: ready-for-dev

<!-- Note: This story is part of Code Quality & Refactorization work merged into Epic 14. -->
<!-- Source: _bmad-output/planning-artifacts/epic-17-code-quality-refactor.md Story 17.7 -->

## Story

As a **developer maintaining this codebase**,
I want **consistent TypeScript patterns and typed selectors across all Redux slices**,
so that **state management is type-safe, predictable, and easier to maintain**.

## Background

Engineering analysis identified inconsistencies in the Redux layer:

| Issue | Location | Impact |
|-------|----------|--------|
| menuPanel uses .js | `src/state/slices/menuPanel/` | Only slice in JavaScript |
| Multiple useAppSelector calls | `emailClipboard/hooks.ts` | 2 separate selectors instead of 1 combined |
| Duplicate action exports | All hooks | Both `open()` and `openPanel()` variations |
| Hardcoded state types | All hooks | Each repeats `(state: { sliceName: StateInterface })` |

**Current state:**
- 4 slices in TypeScript: `authPanel`, `chatPanel`, `emailClipboard`, `themeMode`
- 1 slice in JavaScript: `menuPanel`
- No centralized `RootState` type exported from store

**Target state:**
- All slices in TypeScript
- `RootState` exported from store, used in all selectors
- Consolidated selectors (1 per concept)
- Clean action API (no duplicates)

## Acceptance Criteria

### AC1: menuPanel slice migrated to TypeScript
**Given** menuPanel/slice.js is the only JavaScript slice
**When** I migrate to TypeScript
**Then** menuPanel/slice.ts exists with proper types
**And** MenuPanelState interface is exported
**And** PayloadAction types are used for actions

### AC2: menuPanel hooks migrated to TypeScript
**Given** menuPanel/hooks.js uses untyped selectors
**When** I migrate to TypeScript
**Then** menuPanel/hooks.ts exists with UseMenuPanelReturn interface
**And** selectors use RootState type
**And** return type is explicitly typed

### AC3: menuPanel barrel file migrated
**Given** menuPanel/index.js re-exports slice and hooks
**When** I migrate to TypeScript
**Then** menuPanel/index.ts exists
**And** exports match pattern of other slices

### AC4: RootState type exported from store
**Given** store uses configureStore with reducer object
**When** I add RootState type
**Then** `export type RootState = ReturnType<typeof ReduxStore.getState>` exists
**And** `export type AppDispatch = typeof ReduxStore.dispatch` exists
**And** types are importable from store

### AC5: EmailClipboard selectors consolidated
**Given** emailClipboard hooks has 2 separate useAppSelector calls
**When** I consolidate selectors
**Then** a single selector returns both `isCopied` and `error`
**And** selector uses RootState type

### AC6: Duplicate actions removed from hooks
**Given** hooks export both `open()` and `openMenuPanel()` style actions
**When** I clean up
**Then** only canonical action names remain (full names: openMenuPanel, closeChatPanel, etc.)
**And** short aliases are removed from hook returns

### AC7: All JS files in state/ migrated
**Given** multiple .js files remain in state/
**When** migration completes
**Then** `find src/state -name "*.js" | wc -l` returns 0 (excluding tests)

### AC8: Build and tests pass
**Given** all state changes applied
**When** running validation
**Then** `npm run build` passes
**And** `npm run typecheck` passes
**And** `npm test` passes (slice tests)
**And** Smoke test: all panels (menu, chat, auth) function correctly

## Tasks / Subtasks

- [ ] **Task 1: Migrate menuPanel slice to TypeScript** (AC: 1)
  - [ ] 1.1 Create MenuPanelState interface
  - [ ] 1.2 Add PayloadAction types to actions
  - [ ] 1.3 Rename slice.js → slice.ts
  - [ ] 1.4 Export MenuPanelState from slice
  - [ ] 1.5 Run `npm run build` to verify

- [ ] **Task 2: Migrate menuPanel hooks to TypeScript** (AC: 2)
  - [ ] 2.1 Create UseMenuPanelReturn interface
  - [ ] 2.2 Type selector function parameter
  - [ ] 2.3 Rename hooks.js → hooks.ts
  - [ ] 2.4 Verify selector types work

- [ ] **Task 3: Migrate menuPanel barrel and related files** (AC: 3, 7)
  - [ ] 3.1 Rename menuPanel/index.js → index.ts
  - [ ] 3.2 Update exports to match TS pattern
  - [ ] 3.3 Migrate slices/index.js → index.ts
  - [ ] 3.4 Migrate state/index.js → index.ts
  - [ ] 3.5 Migrate stores/index.js → index.ts
  - [ ] 3.6 Migrate stores/ReduxStore/index.js → index.ts
  - [ ] 3.7 Migrate providers/index.js → index.ts

- [ ] **Task 4: Extract RootState from store** (AC: 4)
  - [ ] 4.1 Add RootState type definition to ReduxStore
  - [ ] 4.2 Add AppDispatch type definition
  - [ ] 4.3 Export types from store barrel
  - [ ] 4.4 Update store imports where needed

- [ ] **Task 5: Consolidate EmailClipboard selectors** (AC: 5)
  - [ ] 5.1 Create single selector that returns { isCopied, error }
  - [ ] 5.2 Use RootState type in selector
  - [ ] 5.3 Update useEmailClipboard hook to use combined selector
  - [ ] 5.4 Verify no behavior change

- [ ] **Task 6: Clean up duplicate actions** (AC: 6)
  - [ ] 6.1 Audit all hooks for duplicate action exports
  - [ ] 6.2 Keep only canonical full-name actions (openMenuPanel, closeMenuPanel, etc.)
  - [ ] 6.3 Remove short aliases (open, close, toggle) from return objects
  - [ ] 6.4 Update consuming components if needed
  - [ ] 6.5 Verify all panels still work

- [ ] **Task 7: Migrate remaining JS files in state/** (AC: 7)
  - [ ] 7.1 Run `find src/state -name "*.js" -not -path "*/__tests__/*"` to find remaining
  - [ ] 7.2 Migrate each file, preserving functionality
  - [ ] 7.3 Verify no JS files remain (except tests if applicable)

- [ ] **Task 8: Validation** (AC: 8)
  - [ ] 8.1 Run `npm run build`
  - [ ] 8.2 Run `npm run typecheck`
  - [ ] 8.3 Run `npm test src/state`
  - [ ] 8.4 Smoke test: open/close menu panel
  - [ ] 8.5 Smoke test: open/close chat panel
  - [ ] 8.6 Smoke test: open/close auth panel
  - [ ] 8.7 Smoke test: copy email to clipboard

## Dev Notes

### TypeScript Pattern Reference

Follow the pattern from `chatPanel/slice.ts`:

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY_NAME = "menuPanel";
const OPEN = true;
const CLOSED = false;

export interface MenuPanelState {
  isOpen: boolean;
}

const initialState: MenuPanelState = {
  isOpen: CLOSED,
};

const menuPanelSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setMenuPanel: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    open: (state) => {
      state.isOpen = OPEN;
    },
    close: (state) => {
      state.isOpen = CLOSED;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});
```

### RootState Pattern

Add to `stores/ReduxStore/index.ts`:

```typescript
import { configureStore } from "@reduxjs/toolkit";
// ... imports ...

const ReduxStore = configureStore({
  reducer: { ... },
  devTools: process.env.NODE_ENV !== "production",
});

// Type inference for state and dispatch
export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;
```

### Consolidated Selector Pattern

For EmailClipboard, change from:

```typescript
// ❌ Current: 2 separate selectors
const isCopied = useAppSelector(state => state.emailClipboard.isCopied);
const error = useAppSelector(state => state.emailClipboard.error);
```

To:

```typescript
// ✅ Target: 1 combined selector
const { isCopied, error } = useAppSelector((state: RootState) => ({
  isCopied: state.emailClipboard.isCopied,
  error: state.emailClipboard.error,
}));
```

### Files to Migrate

| File | Current | Target |
|------|---------|--------|
| `state/index.js` | JS | TS |
| `state/providers/index.js` | JS | TS |
| `state/stores/index.js` | JS | TS |
| `state/stores/ReduxStore/index.js` | JS | TS (+RootState) |
| `state/slices/index.js` | JS | TS |
| `state/slices/menuPanel/slice.js` | JS | TS (+interface) |
| `state/slices/menuPanel/hooks.js` | JS | TS (+types) |
| `state/slices/menuPanel/index.js` | JS | TS |

### Previous Story Learnings (14-16)

From Export & Barrel Cleanup:
- When changing export patterns, update consuming imports
- Test imports work after each migration
- Use default exports consistently in barrel files
- Run build after each file migration to catch issues early

### Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Selector type errors | 🟡 Medio | Incremental migration, verify each change |
| State access breaks | 🟡 Medio | Run build after each file |
| Panel functionality | 🟢 Bajo | Smoke test all panels after migration |
| Import path breaks | 🟢 Bajo | No path changes, only extension changes |

### Verification Commands

```bash
# Verify no JS files remain in state (except test files)
find src/state -name "*.js" -not -path "*/__tests__/*" | wc -l  # Should be 0

# Verify RootState is exported
grep -r "export type RootState" src/state  # Should find 1 result

# Verify typecheck passes
npm run typecheck

# Full validation
npm run build && npm run typecheck && npm test src/state
```

### Definition of Done

- [ ] menuPanel slice is TypeScript with MenuPanelState interface
- [ ] menuPanel hooks is TypeScript with typed selectors
- [ ] RootState and AppDispatch exported from store
- [ ] EmailClipboard uses single combined selector
- [ ] No duplicate action exports in hooks
- [ ] `find src/state -name "*.js" -not -path "*/__tests__/*" | wc -l` returns 0
- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes
- [ ] All panel smoke tests pass (menu, chat, auth)

### References

- [Source: epic-17-code-quality-refactor.md] - Story 17.7 State Management Cleanup
- [Source: code-quality-and-refactoriztion-2026-02-06.md] - Section 1.5 State Management Issues
- [Source: src/state/slices/chatPanel/slice.ts] - Reference TS pattern
- [Source: src/state/slices/emailClipboard/hooks.ts] - Current selector pattern to fix

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change |
|------|--------|
| 2026-02-06 | Story created from Epic 17.7 merged into Epic 14 |
