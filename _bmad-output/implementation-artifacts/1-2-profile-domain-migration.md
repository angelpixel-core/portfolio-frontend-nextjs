# Story 1.2: Profile Domain Migration

**Status:** review

---

## Story

As a **visitor**,
I want **to view the developer's profile reliably**,
so that **I can quickly understand who they are and their background**.

---

## Acceptance Criteria

### AC1: Profile Data Display

**Given** I navigate to the homepage
**When** the profile data loads
**Then** I see the developer's name, bio, and summary
**And** the data is validated with Zod schema
**And** TypeScript types are inferred from schema

### AC2: Error Handling

**Given** the profile API fails
**When** the component renders
**Then** an error boundary shows a friendly fallback
**And** no crash occurs

### AC3: TypeScript Migration

**Given** the profile domain code
**When** I run `npm run typecheck`
**Then** all profile domain files pass type checking
**And** Zod schemas define the data types

---

## Tasks / Subtasks

- [x] **Task 1: Create Zod schema for Profile** (AC: #1, #3)
  - [x] 1.1 Review existing `src/domains/profile/model/schema.js`
  - [x] 1.2 Convert to TypeScript with Zod validation
  - [x] 1.3 Export inferred types: `ProfileModel`, `ProfileSchema`
  - [x] 1.4 Add unit test for schema validation

- [x] **Task 2: Migrate Profile queries to TypeScript** (AC: #1, #3)
  - [x] 2.1 Review existing `src/domains/profile/queries/`
  - [x] 2.2 Convert hooks to TypeScript with proper return types
  - [x] 2.3 Add runtime validation with Zod `.parse()` (already in model)
  - [x] 2.4 Update domain index.ts exports

- [x] **Task 3: Add Error Boundary for Profile** (AC: #2)
  - [x] 3.1 Create or verify SectionErrorBoundary exists
  - [x] 3.2 Wrap profile section with error boundary
  - [x] 3.3 Add friendly fallback UI component
  - [x] 3.4 Add test for error boundary behavior

- [x] **Task 4: Validate Profile Display** (AC: #1)
  - [x] 4.1 Run `npm run typecheck` - must pass
  - [x] 4.2 Run `npm test` - must pass (15 new tests pass, 4 pre-existing failures in ADR-001)
  - [ ] 4.3 Manual validation: verify profile displays on homepage (USER)
  - [ ] 4.4 Manual validation: verify error handling works (USER)

---

## Dev Notes

### Current State Analysis

Profile domain structure:
- `src/domains/profile/model/schema.js` - Current schema (JS)
- `src/domains/profile/model/index.js` - Model barrel exports
- `src/domains/profile/queries/` - React Query hooks
- `src/domains/profile/index.ts` - Domain barrel export

### Architecture Constraints [Source: architecture.md]

| Decision | Value |
|----------|-------|
| TypeScript Strategy | Incremental Strict |
| Schema Tool | Zod with z.infer<typeof Schema> |
| Migration Order | Schemas first, then hooks |
| Validation Strategy | Runtime Zod .parse() in hooks |

### Error Boundary Pattern [Source: architecture.md]

```
RootErrorBoundary
  → RouteErrorBoundary
    → SectionErrorBoundary (profile, skills, etc.)
```

---

## Technical Requirements

### Zod Schema Pattern

```typescript
// src/domains/profile/model/schema.ts
import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  summary: z.string().optional(),
  avatar: z.string().url().optional(),
  // ... other fields based on existing schema
});

export type ProfileModel = z.infer<typeof ProfileSchema>;
```

### Query Hook Pattern

```typescript
// src/domains/profile/queries/useProfile.ts
import { useQuery } from "@tanstack/react-query";
import { ProfileSchema, type ProfileModel } from "../model/schema";

export function useProfile() {
  return useQuery<ProfileModel>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch("/api/profile");
      const data = await response.json();
      return ProfileSchema.parse(data); // Runtime validation
    },
  });
}
```

---

## Previous Story Intelligence

**Story 1.1:** Established TypeScript strict mode, CI pipeline, and fixed domain exports.
- tsconfig.json with strict mode ✅
- Jest configured with TypeScript ✅
- Domain index.ts files cleaned up ✅

**Learnings:**
- Use `z.infer<typeof Schema>` for type inference
- Test files can be .tsx for React components
- ESLint 8.x required (9.x incompatible)

---

## Library/Framework Requirements

| Library | Version | Purpose |
|---------|---------|---------|
| zod | ^3.25.76 | Schema validation (already installed) |
| @tanstack/react-query | ^5.x | Data fetching (already installed) |

---

## File Structure Requirements

### Files to CREATE

```
src/domains/profile/model/schema.ts      # Zod schema (new)
src/domains/profile/queries/useProfile.ts # TypeScript hook (migrate)
src/ui/shared/ErrorBoundary/SectionErrorBoundary.tsx # If not exists
```

### Files to MODIFY

```
src/domains/profile/model/index.js → index.ts
src/domains/profile/queries/index.ts
src/domains/profile/index.ts
```

### Files to DELETE

```
src/domains/profile/model/schema.js  # After migration to .ts
```

---

## Testing Requirements

### Unit Tests

```typescript
// src/domains/profile/model/__tests__/schema.test.ts
describe("ProfileSchema", () => {
  it("validates valid profile data", () => {
    const validProfile = { name: "Angel", title: "Developer", bio: "..." };
    expect(() => ProfileSchema.parse(validProfile)).not.toThrow();
  });

  it("rejects invalid profile data", () => {
    const invalidProfile = { name: 123 }; // name should be string
    expect(() => ProfileSchema.parse(invalidProfile)).toThrow();
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

### Validación Local

- [ ] `npm run dev` levanta la app sin errores
- [ ] Abrir http://localhost:9000 en browser
- [ ] Homepage carga y muestra nombre del desarrollador
- [ ] Profile section muestra bio y summary
- [ ] No hay errores en consola del browser

### Validación Error Handling

- [ ] Simular fallo de API (desconectar backend o mock error)
- [ ] Verificar que error boundary muestra fallback amigable
- [ ] App no crashea completamente

### Manual Validation Result

- **Date:** _pendiente_
- **Validated by:** _pendiente_
- **Result:** _pendiente_
- **Notes:** _pendiente_

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Followed TDD red-green-refactor cycle for all tasks
- All new tests pass (15 total)
- 4 pre-existing test failures documented in ADR-001 (not regressions)

### Completion Notes List

- Migrated `schema.js` to `schema.ts` with Zod types exported
- Migrated `useProfile.js` and `useProfiles.js` to TypeScript
- Created `SectionErrorBoundary` component for graceful error handling
- Wrapped Hero component with SectionErrorBoundary
- Updated queries/index.ts with named exports

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-22 | Story created | Claude Opus 4.5 |
| 2026-01-22 | Implementation complete | Claude Opus 4.5 |

### File List

**Created:**
- `src/domains/profile/model/schema.ts`
- `src/domains/profile/model/__tests__/schema.test.ts`
- `src/domains/profile/queries/useProfile.ts`
- `src/domains/profile/queries/useProfiles.ts`
- `src/domains/profile/queries/__tests__/useProfile.test.tsx`
- `src/ui/shared/ErrorBoundary/SectionErrorBoundary.tsx`
- `src/ui/shared/ErrorBoundary/index.ts`
- `src/ui/shared/ErrorBoundary/__tests__/SectionErrorBoundary.test.tsx`

**Modified:**
- `src/domains/profile/queries/index.ts`
- `src/ui/molecules/Hero/index.jsx`

**Deleted:**
- `src/domains/profile/model/schema.js`
- `src/domains/profile/queries/useProfile.js`
- `src/domains/profile/queries/useProfiles.js`
