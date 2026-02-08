# Story 15.4: Critical Atoms TypeScript Migration

**Epic:** 15 - TypeScript Hardening Sprint
**Status:** review
**Estimated Effort:** 3 hours
**Risk:** Medium (many dependents)

---

## User Story

**Como** desarrollador,
**Quiero** que los atoms más usados estén en TypeScript,
**Para que** los componentes que los usan tengan type safety.

---

## Context

### Why This Story Exists

Continuando la migración TypeScript de Epic 15:
- Story 15.1 migró hooks ✅
- Story 15.2 eliminó deprecated components ✅
- Story 15.3 migró providers ✅
- **Story 15.4** (esta) migra atoms críticos

Los buttons son componentes atómicos usados en header, menu, y overlays. La migración asegura que:
1. Props estén tipados correctamente
2. El barrel pueda exportar tipos
3. IDE autocompletado funcione

### Current State

**Buttons en JSX (requieren migración):**

| Archivo | Responsabilidad | Complejidad |
|---------|-----------------|-------------|
| `MenuButton/index.jsx` | Toggle menu overlay | Media - inner components |
| `ArrowButton/index.jsx` | Navigation arrows | Baja - solo props |
| `HireMeButton/index.jsx` | CTA button | Baja |
| `HireMeHeaderButton/index.jsx` | Header variant | Baja |
| `NavigationItemButton/index.jsx` | Nav items | Baja |
| `SkillSelectorButton/index.jsx` | Filter buttons | Baja |

**Buttons ya en TypeScript:**
- `AuthButton/index.tsx` ✅
- `ChatButton/index.tsx` ✅
- `ThemeButton/index.tsx` ✅
- `CopyButton/index.tsx` ✅
- `NeumorphicToggle/index.tsx` ✅

**Barrels en JS (requieren migración):**
- `src/ui/atoms/buttons/index.js` → `index.ts`
- `src/ui/atoms/index.js` → `index.ts`

### Target State

- Todos los buttons críticos migrados a `.tsx`
- Props interfaces definidas para todos
- Barrels migrados a `.ts`
- Build y typecheck pasan

---

## Acceptance Criteria

### AC1: Migrate MenuButton to TypeScript
- [x] Rename `src/ui/atoms/buttons/MenuButton/index.jsx` → `index.tsx`
- [x] Add `Props` interface for MenuTick and MenuIcon inner components
- [x] Type useMenuPanel hook return correctly
- [x] Verify button renders correctly in header

### AC2: Migrate remaining critical buttons
- [x] `ArrowButton/index.jsx` → `index.tsx` with Props interface
- [x] `HireMeButton/index.jsx` → `index.tsx` with Props interface
- [x] `HireMeHeaderButton/index.jsx` → `index.tsx` with Props interface
- [x] `NavigationItemButton/index.jsx` → `index.tsx` with Props interface
- [x] `SkillSelectorButton/index.jsx` → `index.tsx` with Props interface

### AC3: Migrate barrel files
- [x] Rename `src/ui/atoms/buttons/index.js` → `index.ts`
- [x] Rename `src/ui/atoms/index.js` → `index.ts`
- [x] Verify all re-exports work correctly

### AC4: Build verification
- [x] `npm run build` passes without errors
- [x] `npm run typecheck` passes without new errors introduced by this story
  - Note: 34+ pre-existing typecheck errors in test files (not related to atoms)

---

## Tasks / Subtasks

- [x] Task 1: Migrate MenuButton (AC1)
  - [x] Rename file to .tsx
  - [x] Add Props interfaces for inner components
  - [x] Type hook return

- [x] Task 2: Migrate remaining buttons (AC2)
  - [x] ArrowButton → .tsx with Props
  - [x] HireMeButton → .tsx with Props
  - [x] HireMeHeaderButton → .tsx with Props
  - [x] NavigationItemButton → .tsx with Props
  - [x] SkillSelectorButton → .tsx with Props

- [x] Task 3: Migrate barrels (AC3)
  - [x] buttons/index.js → index.ts
  - [x] atoms/index.js → index.ts

- [x] Task 4: Verify build and types (AC4)
  - [x] Run npm run build
  - [x] Run npm run typecheck
  - [x] Run npm test (verify no regressions)

- [x] Task 5: Commit changes

---

## Dev Notes

### Code Patterns from Previous Stories

Following patterns established in Stories 15.1, 15.3:

```typescript
// Type imports
import type { ReactNode } from "react";

// Props interface pattern
interface Props {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

// Inner component props
interface MenuTickProps {
  className: string;
}

interface MenuIconProps {
  isOpen: boolean;
}
```

### Expected MenuButton Code

```typescript
"use client";

import "./styles.css";

import clsx from "clsx";

import { useMenuPanel } from "@/state/slices";

interface MenuTickProps {
  className: string;
}

const MenuTick = ({ className }: MenuTickProps) => {
  return <span className={`menu_button-tick ${className}`}></span>;
};

interface MenuIconProps {
  isOpen: boolean;
}

const MenuIcon = ({ isOpen }: MenuIconProps) => {
  return (
    <>
      <MenuTick
        className={clsx({
          "rotate-45 translate-y-1": isOpen,
          "-translate-y-0.5": !isOpen,
        })}
      />
      <MenuTick
        className={clsx("my-0.5", {
          "opacity-0": isOpen,
          "opacity-100": !isOpen,
        })}
      />
      <MenuTick
        className={clsx({
          "-rotate-45 -translate-y-1": isOpen,
          "translate-y-0.5": !isOpen,
        })}
      />
    </>
  );
};

const MenuButton = () => {
  const { isOpen, toggleMenuPanel } = useMenuPanel();

  return (
    <button
      className="menu_button focus-ring"
      onClick={toggleMenuPanel}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
    >
      <MenuIcon isOpen={isOpen} />
    </button>
  );
};

export default MenuButton;
```

### Project Structure Notes

- Buttons location: `src/ui/atoms/buttons/`
- Main barrel: `src/ui/atoms/index.js` re-exports from `./buttons`
- Current TypeScript buttons: AuthButton, ChatButton, ThemeButton, CopyButton, NeumorphicToggle

### Previous Story Learnings (15.1, 15.3)

- Rename file, don't create new one (preserves git history)
- Import types with `import type { ... }` to avoid runtime overhead
- Check tsconfig.json path aliases if build fails
- JSDoc headers are nice-to-have but not critical
- Use `buttonPosition` instead of `position` for React Query devtools (API change)

### Risk Mitigation

**Medium Risk** - Many components depend on buttons:
1. Run build after each button migration
2. Run tests after all migrations
3. Verify header/menu functionality visually if needed

### References

- [Source: _bmad-output/planning-artifacts/epic-15-typescript-hardening.md#Story 15.4]
- [Source: _bmad-output/implementation-artifacts/15-3-providers-typescript-migration.md]
- [Source: _bmad-output/implementation-artifacts/15-1-hooks-typescript-migration.md]

---

## Definition of Done

- [x] All critical buttons migrated to TypeScript
- [x] Props interfaces defined for all buttons
- [x] Barrel files migrated to .ts
- [x] Build passes
- [x] Tests pass (no regressions)
- [x] Commit created with descriptive message

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Fixed tsconfig.json path aliases: `@/atoms` and `@/buttons` pointed to `.js`, updated to `.ts`
- SkillSelectorButton: Added generic type to `querySelector<HTMLDivElement>` for style access

### Completion Notes List

✅ All 6 buttons migrated to TypeScript:
- MenuButton: Added MenuTickProps, MenuIconProps interfaces
- ArrowButton: Added ArrowButtonProps interface
- HireMeButton: Added HireMeButtonProps interface
- HireMeHeaderButton: No props (already type-safe)
- NavigationItemButton: Added NavigationItemButtonProps interface
- SkillSelectorButton: Added SkillCategory type, SkillSelectorButtonProps interface

✅ Barrels migrated:
- `src/ui/atoms/buttons/index.js` → `index.ts`
- `src/ui/atoms/index.js` → `index.ts`

✅ tsconfig.json updated for new barrel extensions

### File List

#### Modified
- `src/ui/atoms/buttons/MenuButton/index.tsx` (renamed from .jsx)
- `src/ui/atoms/buttons/ArrowButton/index.tsx` (renamed from .jsx)
- `src/ui/atoms/buttons/HireMeButton/index.tsx` (renamed from .jsx)
- `src/ui/atoms/buttons/HireMeHeaderButton/index.tsx` (renamed from .jsx)
- `src/ui/atoms/buttons/NavigationItemButton/index.tsx` (renamed from .jsx)
- `src/ui/atoms/buttons/SkillSelectorButton/index.tsx` (renamed from .jsx)
- `src/ui/atoms/buttons/index.ts` (renamed from .js)
- `src/ui/atoms/index.ts` (renamed from .js)
- `tsconfig.json` (path alias updates)

#### Deleted (replaced by .tsx/.ts versions)
- `src/ui/atoms/buttons/MenuButton/index.jsx`
- `src/ui/atoms/buttons/ArrowButton/index.jsx`
- `src/ui/atoms/buttons/HireMeButton/index.jsx`
- `src/ui/atoms/buttons/HireMeHeaderButton/index.jsx`
- `src/ui/atoms/buttons/NavigationItemButton/index.jsx`
- `src/ui/atoms/buttons/SkillSelectorButton/index.jsx`
- `src/ui/atoms/buttons/index.js`
- `src/ui/atoms/index.js`

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-07 | Story created with comprehensive dev context |
| 2026-02-07 | Implementation complete - all 6 buttons + 2 barrels migrated to TypeScript |

---

**Created:** 2026-02-07
**Author:** BMAD SM Agent
