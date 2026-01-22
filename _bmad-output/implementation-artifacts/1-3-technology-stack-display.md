# Story 1.3: Technology Stack Display

**Status:** ready-for-dev

---

## Story

As a **visitor**,
I want **to see the technology stack and skills clearly**,
so that **I can assess the developer's technical expertise**.

---

## Acceptance Criteria

### AC1: Skills Organized by Category

**Given** I view the homepage
**When** I scroll to the technologies section
**Then** I see skills organized by category
**And** each technology displays an icon and name

### AC2: TypeScript Migration

**Given** the technology domain code
**When** I run `npm run typecheck`
**Then** all technology domain files pass type checking
**And** Zod schemas define the data types

### AC3: Component Tests

**Given** the Skills/Technology components
**When** I run `npm test`
**Then** component tests pass
**And** accessibility tests validate the section

---

## Tasks / Subtasks

- [ ] **Task 1: Create Zod schema for Technology** (AC: #2)
  - [ ] 1.1 Review existing `src/domains/technology/model/schema.js`
  - [ ] 1.2 Convert to TypeScript with Zod validation
  - [ ] 1.3 Export inferred types: `TechnologyModel`, `TechnologySchema`
  - [ ] 1.4 Add unit test for schema validation

- [ ] **Task 2: Migrate Technology queries to TypeScript** (AC: #2)
  - [ ] 2.1 Review existing `src/domains/technology/queries/`
  - [ ] 2.2 Convert hooks to TypeScript with proper return types
  - [ ] 2.3 Update domain index.ts exports

- [ ] **Task 3: Add component tests for Skills** (AC: #1, #3)
  - [ ] 3.1 Review existing Skills organism component
  - [ ] 3.2 Add render test for skills display
  - [ ] 3.3 Verify categories are displayed correctly
  - [ ] 3.4 Add accessibility test (landmarks, headings)

- [ ] **Task 4: Validate Technology Display** (AC: #1)
  - [ ] 4.1 Run `npm run typecheck` - must pass
  - [ ] 4.2 Run `npm test` - must pass
  - [ ] 4.3 Manual validation: verify technologies display on homepage
  - [ ] 4.4 Manual validation: verify categories and icons render

---

## Dev Notes

### Current State Analysis

Technology domain structure:
- `src/domains/technology/model/schema.js` - Current schema (JS)
- `src/domains/technology/model/index.js` - Model barrel exports
- `src/domains/technology/queries/` - React Query hooks
- `src/domains/technology/index.ts` - Domain barrel export

Skills components:
- `src/ui/organisms/Skills/` - Main skills display component
- `src/ui/molecules/SkillSelector/` - Category selection UI

### Architecture Constraints [Source: architecture.md]

| Decision | Value |
|----------|-------|
| TypeScript Strategy | Incremental Strict |
| Schema Tool | Zod with z.infer<typeof Schema> |
| Migration Order | Schemas first, then hooks |

---

## Previous Story Intelligence

**Story 1.2:** Migrated profile domain to TypeScript with error boundary.
- Pattern: schema.js → schema.ts with Zod type exports
- Pattern: useX.js → useX.ts with typed return values
- Created SectionErrorBoundary for error handling

**Learnings:**
- Use `z.infer<typeof Schema>` for type inference
- Named exports in addition to default exports
- Clear Jest cache if module resolution issues

---

## Library/Framework Requirements

| Library | Version | Purpose |
|---------|---------|---------|
| zod | ^3.25.76 | Schema validation (already installed) |
| @tanstack/react-query | ^5.x | Data fetching (already installed) |

---

## Testing Requirements

### Unit Tests

```typescript
// src/domains/technology/model/__tests__/schema.test.ts
describe("TechnologySchema", () => {
  it("validates valid technology data", () => {
    const valid = { id: 1, name: "React", category: "Frontend", icon: "react.svg" };
    expect(() => TechnologySchema.parse(valid)).not.toThrow();
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
- [ ] Technologies section visible en homepage/about
- [ ] Skills organizados por categoría
- [ ] Iconos y nombres de tecnologías visibles
- [ ] No hay errores en consola del browser

### Manual Validation Result

- **Date:** _pendiente_
- **Validated by:** _pendiente_
- **Result:** _pendiente_
- **Notes:** _pendiente_

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled after implementation_

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-22 | Story created | Claude Opus 4.5 |

### File List

_To be filled after implementation - list all files created/modified_
