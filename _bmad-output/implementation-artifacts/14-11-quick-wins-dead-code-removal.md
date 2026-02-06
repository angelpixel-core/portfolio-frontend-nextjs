# Story 14.11: Quick Wins - Dead Code Removal

Status: ready-for-dev

<!-- Note: This story is part of Code Quality & Refactorization work merged into Epic 14. -->
<!-- Source: _bmad-output/analysis/code-quality-and-refactorization-2026-02-06.md Phase 1 -->

## Story

As a **developer maintaining this codebase**,
I want **dead code, empty files, and inconsistent naming removed**,
so that **the codebase is cleaner, more navigable, and free of confusion-causing artifacts**.

## Background

Engineering analysis identified 8 dead/empty files and inconsistent skeleton naming patterns. This story addresses low-risk, high-value cleanup that doesn't change runtime behavior.

**Problems addressed:**
- 3 empty hook files exported but never implemented
- Zustand adapter placeholder (library not even installed)
- Residual debug comment in ReduxProvider
- 4 skeleton files with inconsistent PascalCase naming
- Duplicate React import in articles/layout.tsx

## Acceptance Criteria

### AC1: Empty hook files removed
**Given** the hooks directory contains empty files
**When** I search for useIsMobile, useOutsideClick, useScrollLock
**Then** no files or references exist in the codebase
**And** `src/hooks/ui/index.js` barrel file is updated (if exists)

### AC2: Zustand adapter removed
**Given** `src/state/adapters/zustand/` exists as placeholder
**When** I search for zustand references
**Then** no files or references exist in the codebase
**And** Zustand is not in package.json (verify)

### AC3: Debug comment removed
**Given** `src/state/providers/ReduxProvider/index.jsx` contains "HASTA aca aver que pasa"
**When** the cleanup is complete
**Then** no debug comments remain in that file

### AC4: Skeleton naming standardized
**Given** skeleton files with PascalCase naming
**When** renamed to lowercase
**Then** all skeleton files follow pattern `skeleton.jsx` or `skeleton.tsx`
**And** all imports referencing old names are updated
**And** `npm run build` passes without errors

### AC5: Duplicate import fixed
**Given** `src/app/articles/layout.tsx` imports React twice
**When** the fix is applied
**Then** only one React import exists
**And** file functions correctly

### AC6: No regressions
**Given** all cleanup tasks are complete
**When** I run validation
**Then** `npm run build` passes
**And** `npm test` passes 100%
**And** no new TypeScript errors introduced

## Tasks / Subtasks

- [ ] **Task 1: Remove empty hook files** (AC: 1)
  - [ ] 1.1 Delete `src/hooks/ui/useIsMobile.js`
  - [ ] 1.2 Delete `src/hooks/ui/useOutsideClick.js`
  - [ ] 1.3 Delete `src/hooks/ui/useScrollLock.js`
  - [ ] 1.4 Update `src/hooks/ui/index.js` if it exports these hooks
  - [ ] 1.5 Verify no imports reference these hooks (`grep -r`)

- [ ] **Task 2: Remove Zustand adapter** (AC: 2)
  - [ ] 2.1 Delete `src/state/adapters/zustand/` directory
  - [ ] 2.2 Update `src/state/adapters/index.js` if it exports zustand
  - [ ] 2.3 Verify zustand not in package.json dependencies
  - [ ] 2.4 Verify no imports reference zustand adapter

- [ ] **Task 3: Remove debug comment** (AC: 3)
  - [ ] 3.1 Remove "HASTA aca aver que pasa" from `src/state/providers/ReduxProvider/index.jsx`
  - [ ] 3.2 Verify no other debug comments in that file

- [ ] **Task 4: Standardize skeleton naming** (AC: 4)
  - [ ] 4.1 Rename `src/ui/atoms/links/NavigationItemLink/Skeleton.jsx` → `skeleton.jsx`
  - [ ] 4.2 Update imports in NavigationItemLink/index if needed
  - [ ] 4.3 Rename `src/ui/molecules/SocialNetworkLink/Skeleton.jsx` → `skeleton.jsx`
  - [ ] 4.4 Update imports in SocialNetworkLink/index if needed
  - [ ] 4.5 Rename `src/ui/molecules/WhatsApp/Skeleton.tsx` → `skeleton.tsx`
  - [ ] 4.6 Update imports in WhatsApp/index if needed
  - [ ] 4.7 Verify all skeleton imports work correctly

- [ ] **Task 5: Fix duplicate React import** (AC: 5)
  - [ ] 5.1 Check `src/app/articles/layout.tsx` for duplicate React imports
  - [ ] 5.2 Remove duplicate import if found
  - [ ] 5.3 Verify file compiles correctly

- [ ] **Task 6: Validation** (AC: 6)
  - [ ] 6.1 Run `npm run build` - must pass
  - [ ] 6.2 Run `npm test` - must pass 100%
  - [ ] 6.3 Run `npm run typecheck` - no new errors
  - [ ] 6.4 Grep verification: no references to deleted files

## Dev Notes

### Files to delete

```
src/hooks/ui/useIsMobile.js        # EMPTY (0 bytes)
src/hooks/ui/useOutsideClick.js    # EMPTY (0 bytes)
src/hooks/ui/useScrollLock.js      # EMPTY (0 bytes)
src/state/adapters/zustand/        # Placeholder, zustand not installed
```

### Files to rename

```
src/ui/atoms/links/NavigationItemLink/Skeleton.jsx → skeleton.jsx
src/ui/molecules/SocialNetworkLink/Skeleton.jsx → skeleton.jsx
src/ui/molecules/WhatsApp/Skeleton.tsx → skeleton.tsx
```

### Files to edit

```
src/state/providers/ReduxProvider/index.jsx  # Remove debug comment line 4
src/app/articles/layout.tsx                   # Fix duplicate React import
```

### Verification commands

```bash
# Check for references to deleted hooks
grep -r "useIsMobile\|useOutsideClick\|useScrollLock" src/

# Check for zustand references
grep -r "zustand" src/

# Check skeleton naming
find src -name "Skeleton.*" -type f

# Full validation
npm run build && npm test && npm run typecheck
```

### Risk assessment

| Task | Risk | Notes |
|------|------|-------|
| Delete empty hooks | 🟢 Low | Files are empty, no functionality |
| Delete zustand adapter | 🟢 Low | Placeholder only, library not installed |
| Remove debug comment | 🟢 Low | Comment only, no code change |
| Rename skeletons | 🟢 Low | File renames with import updates |
| Fix duplicate import | 🟢 Low | Syntax cleanup only |

### Definition of Done

- [ ] `npm run build` passes without errors
- [ ] `npm test` passes at 100%
- [ ] `grep -r "useIsMobile\|useOutsideClick\|useScrollLock" src/` returns 0 results
- [ ] `grep -r "zustand" src/` returns 0 results
- [ ] `find src -name "Skeleton.*" -type f` returns 0 results (all lowercase now)
- [ ] No debug comments in ReduxProvider

### References

- [Source: code-quality-and-refactorization-2026-02-06.md] - Phase 1 Quick Wins
- [Source: epic-17-code-quality-refactor.md] - Story 17.1 (now 14.11)

## Dev Agent Record

### Agent Model Used

(To be filled during implementation)

### Debug Log References

N/A

### Completion Notes List

(To be filled during implementation)

### File List

**Deleted:**
(To be filled during implementation)

**Modified:**
(To be filled during implementation)

**Renamed:**
(To be filled during implementation)
