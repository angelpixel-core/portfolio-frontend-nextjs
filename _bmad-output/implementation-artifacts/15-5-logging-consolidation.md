# Story 15.5: Logging Consolidation

**Epic:** 15 - TypeScript Hardening Sprint
**Status:** ready-for-dev
**Estimated Effort:** 3 hours
**Risk:** Low

---

## User Story

**Como** desarrollador,
**Quiero** que todos los console.log/warn/error usen el sistema de logging centralizado,
**Para que** el debugging sea consistente y controlable.

---

## Context

### Why This Story Exists

Continuando la migración TypeScript de Epic 15:
- Story 15.1 migró hooks ✅
- Story 15.2 eliminó deprecated components ✅
- Story 15.3 migró providers ✅
- Story 15.4 migró atoms críticos ✅
- **Story 15.5** (esta) consolida logging

El objetivo del Epic 15 incluye "0 console.log/warn/error directos (excepto logger)". Actualmente hay ~17 console statements dispersos que deberían usar el logger centralizado.

### Current State

**Logger existente:** `src/lib/logger.js`
- Ya proporciona `logger.debug`, `logger.info`, `logger.warn`, `logger.error`, `logger.mock`
- Tiene level control (DEBUG en dev, ERROR en prod)
- Está en JavaScript, puede migrar a TypeScript

**Console statements actuales (código de producción):**

| Archivo | Línea | Tipo | Contexto |
|---------|-------|------|----------|
| `src/lib/utils.js` | 19 | `console.error` | Database Error |
| `src/lib/actions.js` | 13, 35 | `console.log` | Create User, Form data |
| `src/state/providers/TransitionProvider/TransitionContext.ts` | 17 | `console.warn` | Context warning |
| `src/state/providers/TransitionProvider/index.tsx` | 175 | `console.error` | 50% callback error |
| `src/state/providers/TransitionProvider/index.tsx` | 295, 381 | `console.warn` | Transition warnings |
| `src/domains/customer/model/mock.ts` | 35 | `console.warn` | Parse fallback |
| `src/domains/navigation-item/model/mock.ts` | 34 | `console.warn` | Parse fallback |
| `src/domains/technology/model/mock.ts` | 51 | `console.warn` | Parse fallback |
| `src/ui/shared/ErrorBoundary/SectionErrorBoundary.tsx` | 30 | `console.error` | Error boundary |
| `src/ui/organisms/WordCloud/telemetry.js` | 56 | `console.log` | Telemetry event |
| `src/ui/organisms/Chat/ChatBox.tsx` | 24, 28, 31 | `console.error/log` | Chat errors/debug |
| `src/ui/molecules/CopyEmail/EmailLink.tsx` | 14 | `console.warn` | Missing env var |

**Archivos especiales (NO tocar):**
- `src/lib/logger.js` - Es el propio logger (usa console internamente)
- `src/lib/suppressWarnings.js` - Utilidad de testing

### Target State

- `src/lib/logger.js` migrado a `logger.ts` con tipos
- 0 console.log/warn/error directos en código de producción
- Todos usan `logger.{level}('Module', 'message', data)`
- Build y tests pasan

---

## Acceptance Criteria

### AC1: Migrate logger to TypeScript
- [ ] Rename `src/lib/logger.js` → `logger.ts`
- [ ] Add types for LogLevel, LogFunction interfaces
- [ ] Maintain backward compatibility (same API)
- [ ] Update any imports if needed

### AC2: Replace console statements in lib/
- [ ] `src/lib/utils.js:19` - Use `logger.error('Database', 'Error', error)`
- [ ] `src/lib/actions.js:13,35` - Use `logger.debug('Actions', ...)`

### AC3: Replace console statements in TransitionProvider
- [ ] `TransitionContext.ts:17` - Use `logger.warn('Transition', ...)`
- [ ] `index.tsx:175` - Use `logger.error('Transition', ...)`
- [ ] `index.tsx:295,381` - Use `logger.warn('Transition', ...)`

### AC4: Replace console statements in domain mocks
- [ ] `customer/model/mock.ts:35` - Use `logger.warn('Customer', ...)`
- [ ] `navigation-item/model/mock.ts:34` - Use `logger.warn('NavItem', ...)`
- [ ] `technology/model/mock.ts:51` - Use `logger.warn('Technology', ...)`

### AC5: Replace console statements in UI components
- [ ] `ErrorBoundary/SectionErrorBoundary.tsx:30` - Use `logger.error('ErrorBoundary', ...)`
- [ ] `WordCloud/telemetry.js:56` - Use `logger.debug('Telemetry', ...)`
- [ ] `Chat/ChatBox.tsx:24,28,31` - Use `logger.error/debug('Chat', ...)`
- [ ] `CopyEmail/EmailLink.tsx:14` - Use `logger.warn('Email', ...)`

### AC6: Build verification
- [ ] `npm run build` passes without errors
- [ ] `npm run typecheck` passes without new errors
- [ ] `npm test` passes (no regressions)

---

## Tasks / Subtasks

- [ ] Task 1: Migrate logger to TypeScript (AC1)
  - [ ] Rename logger.js → logger.ts
  - [ ] Add LogLevel type: `type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'`
  - [ ] Add LEVELS typing with Record<LogLevel, number>
  - [ ] Type all function parameters

- [ ] Task 2: Replace lib/ console statements (AC2)
  - [ ] Update utils.js with logger import
  - [ ] Update actions.js with logger import

- [ ] Task 3: Replace TransitionProvider console statements (AC3)
  - [ ] Import logger in TransitionContext.ts
  - [ ] Import logger in TransitionProvider/index.tsx
  - [ ] Replace all 4 console calls

- [ ] Task 4: Replace domain mock console statements (AC4)
  - [ ] Update customer/model/mock.ts
  - [ ] Update navigation-item/model/mock.ts
  - [ ] Update technology/model/mock.ts

- [ ] Task 5: Replace UI component console statements (AC5)
  - [ ] Update SectionErrorBoundary.tsx
  - [ ] Update WordCloud/telemetry.js
  - [ ] Update Chat/ChatBox.tsx
  - [ ] Update CopyEmail/EmailLink.tsx

- [ ] Task 6: Verify zero direct console statements (AC6)
  - [ ] Run grep to verify no console.log/warn/error remain
  - [ ] Exceptions: logger.ts, suppressWarnings.js, test files
  - [ ] Run build, typecheck, tests

- [ ] Task 7: Commit changes

---

## Dev Notes

### Logger TypeScript Migration Pattern

```typescript
// src/lib/logger.ts
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const LOG_LEVEL: LogLevel = IS_PRODUCTION ? 'ERROR' : 'DEBUG';

const LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const shouldLog = (level: LogLevel): boolean => {
  return LEVELS[level] >= LEVELS[LOG_LEVEL];
};

export const logger = {
  debug: (module: string, message: string, data?: unknown): void => {
    if (shouldLog('DEBUG')) {
      console.log(`🔧 [${module}]`, message, data !== undefined ? data : '');
    }
  },
  // ... rest of methods with same signature
};
```

### Replacement Pattern

```typescript
// BEFORE
console.warn("Failed to parse NEXT_PUBLIC_CUSTOMERS, using defaults");

// AFTER
import { logger } from '@/lib/logger';
logger.warn('Customer', 'Failed to parse NEXT_PUBLIC_CUSTOMERS, using defaults');
```

### Module Names Convention

Use short, consistent module names:
- `'Database'` - for utils.js database errors
- `'Actions'` - for lib/actions.js
- `'Transition'` - for TransitionProvider
- `'Customer'`, `'NavItem'`, `'Technology'` - for domain mocks
- `'ErrorBoundary'` - for error boundary
- `'Telemetry'` - for WordCloud telemetry
- `'Chat'` - for ChatBox
- `'Email'` - for EmailLink

### Files NOT to modify

- `src/lib/logger.ts` (after migration) - Uses console internally
- `src/lib/suppressWarnings.js` - Testing utility
- Any `__tests__/` files - Test utilities may mock console

### Previous Story Learnings (15.4)

- Check tsconfig.json path aliases after file renames
- Run build after each major change group
- Type parameters explicitly when migrating to TypeScript

### Verification Command

```bash
# After all changes, run:
grep -r "console\.\(log\|warn\|error\)" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v "__tests__" | grep -v "logger.ts" | grep -v "suppressWarnings.js"
# Expected: No output (0 matches)
```

### References

- [Source: _bmad-output/planning-artifacts/epic-15-typescript-hardening.md#Story 15.5]
- [Source: _bmad-output/implementation-artifacts/15-4-critical-atoms-typescript-migration.md]
- [Source: src/lib/logger.js - Current implementation]

---

## Definition of Done

- [ ] Logger migrated to TypeScript with proper types
- [ ] All console.log/warn/error replaced with logger calls
- [ ] 0 direct console statements in production code
- [ ] Build passes
- [ ] Tests pass (no regressions)
- [ ] Commit created with descriptive message

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-07 | Story created with comprehensive dev context |

---

**Created:** 2026-02-07
**Author:** BMAD SM Agent
