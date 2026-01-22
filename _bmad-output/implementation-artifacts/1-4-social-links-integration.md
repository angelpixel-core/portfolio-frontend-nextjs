# Story 1.4: Social Links Integration

**Status:** ready-for-dev

---

## Story

As a **visitor**,
I want **to access GitHub and LinkedIn profiles easily**,
so that **I can verify credentials and connect professionally**.

---

## Acceptance Criteria

### AC1: Social Links Visibility

**Given** I view the profile section
**When** I see social links
**Then** GitHub and LinkedIn icons are visible and clickable
**And** links open in new tab with `rel="noopener noreferrer"`

### AC2: Keyboard Accessibility

**Given** I navigate using keyboard
**When** I tab to social links
**Then** each link receives visible focus
**And** I can activate links with Enter key

### AC3: TypeScript Migration

**Given** the contact-point domain code
**When** I run `npm run typecheck`
**Then** all contact-point domain files pass type checking
**And** Zod schemas define the data types

### AC4: Component Tests

**Given** the SocialNetworkLink component
**When** I run `npm test`
**Then** component tests pass
**And** accessibility tests validate the links

---

## Tasks / Subtasks

- [ ] **Task 1: Create Zod schema for ContactPoint** (AC: #3)
  - [ ] 1.1 Review existing `src/domains/contact-point/model/schema.js` (empty)
  - [ ] 1.2 Analyze mock.js structure: `{ id, type, provider, label, href, value, icon }`
  - [ ] 1.3 Create schema.ts with Zod validation
  - [ ] 1.4 Export types: `ContactPointModel`, `ContactPointsModel`
  - [ ] 1.5 Add unit test for schema validation

- [ ] **Task 2: Migrate ContactPoint queries to TypeScript** (AC: #3)
  - [ ] 2.1 Review existing `src/domains/contact-point/queries/useContactPoints.js`
  - [ ] 2.2 Convert to TypeScript with proper return types
  - [ ] 2.3 Add Zod runtime validation in queryFn
  - [ ] 2.4 Update domain index.ts exports

- [ ] **Task 3: Add component tests for SocialNetworkLink** (AC: #1, #2, #4)
  - [ ] 3.1 Review existing SocialNetworkLink molecule component
  - [ ] 3.2 Add render test verifying link attributes
  - [ ] 3.3 Add test for `rel="noopener noreferrer"` presence
  - [ ] 3.4 Add keyboard accessibility test
  - [ ] 3.5 Add jest-axe accessibility test

- [ ] **Task 4: Validate Social Links Display** (AC: #1, #2)
  - [ ] 4.1 Run `npm run typecheck` - must pass
  - [ ] 4.2 Run `npm test` - must pass
  - [ ] 4.3 Manual validation: verify GitHub/LinkedIn links in profile section
  - [ ] 4.4 Manual validation: verify links open in new tab

---

## Dev Notes

### Current State Analysis

ContactPoint domain structure:
- `src/domains/contact-point/model/schema.js` - **EMPTY** (needs creation)
- `src/domains/contact-point/model/mock.js` - Has data structure
- `src/domains/contact-point/model/index.js` - Model barrel exports
- `src/domains/contact-point/queries/useContactPoints.js` - React Query hook (JS)
- `src/domains/contact-point/queries/index.ts` - Query exports
- `src/domains/contact-point/index.ts` - Domain barrel export

SocialNetworkLink component:
- `src/ui/molecules/SocialNetworkLink/index.jsx` - Main component
- `src/ui/molecules/SocialNetworkLink/Icon.jsx` - Icon renderer
- `src/ui/molecules/SocialNetworkLink/Skeleton.jsx` - Loading state

### Mock Data Structure [Source: contact-point/model/mock.js]

```typescript
interface ContactPoint {
  id: number;
  type: "communication" | "social" | "messaging";
  provider: "email" | "linkedin" | "github" | "whatsapp" | "twitter" | "dribbble" | "telegram";
  label: string;
  href: string;
  value: string;
  icon: string;
}
```

### Architecture Constraints [Source: architecture.md]

| Decision | Value |
|----------|-------|
| TypeScript Strategy | Incremental Strict |
| Schema Tool | Zod with z.infer<typeof Schema> |
| Migration Order | Schemas first, then hooks |
| Testing | Jest + RTL + jest-axe |

### SocialNetworkLink Props [Source: SocialNetworkLink/index.jsx]

```typescript
interface SocialNetworkLinkProps {
  href: string;
  iconName: string;
  iconClassName?: string;
  ariaLabel?: string;
}
```

El componente ya tiene:
- `target="_blank"` ✅
- `rel="noopener noreferrer"` ✅
- `aria-label` ✅
- framer-motion hover/tap animations

---

## Previous Story Intelligence

**Story 1.3:** Migrated technology domain to TypeScript.
- Pattern: schema.js (empty) → schema.ts with Zod type exports
- Pattern: useX.js → useX.ts with typed return values
- Fixed typo in hook filename (useTechonologies → useTechnologies)
- Updated React Query v5: `cacheTime` → `gcTime`
- Added tsconfig path mappings for @/hooks and @/molecules

**Story 1.2:** Migrated profile domain to TypeScript with error boundary.
- Created SectionErrorBoundary for error handling
- Pattern: Named exports + default exports

**Learnings:**
- Delete empty .js files BEFORE creating .ts (Jest cache issues)
- Clear Jest cache: `npm test -- --clearCache`
- Use `z.infer<typeof Schema>` for type inference
- Use `unknown as jest.Mock` for mock typing in tests

---

## Library/Framework Requirements

| Library | Version | Purpose |
|---------|---------|---------|
| zod | ^3.25.76 | Schema validation (already installed) |
| @tanstack/react-query | ^5.x | Data fetching (already installed) |
| jest-axe | Installed | Accessibility testing |
| framer-motion | Installed | Animations (component uses it) |

---

## Testing Requirements

### Unit Tests

```typescript
// src/domains/contact-point/model/__tests__/schema.test.ts
describe("ContactPointSchema", () => {
  const validContactPoint = {
    id: 1,
    type: "social",
    provider: "github",
    label: "GitHub",
    href: "https://github.com/user",
    value: "https://github.com/user",
    icon: "GitHub",
  };

  it("validates valid contact point data", () => {
    expect(() => ContactPointSchema.parse(validContactPoint)).not.toThrow();
  });

  it("validates type enum", () => {
    const invalid = { ...validContactPoint, type: "invalid" };
    expect(() => ContactPointSchema.parse(invalid)).toThrow();
  });
});
```

```typescript
// src/ui/molecules/SocialNetworkLink/__tests__/SocialNetworkLink.test.tsx
describe("SocialNetworkLink", () => {
  it("renders with correct attributes", () => {
    render(<SocialNetworkLink href="https://github.com/user" iconName="GitHub" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has accessible name", () => {
    render(<SocialNetworkLink href="..." iconName="GitHub" ariaLabel="GitHub Profile" />);
    expect(screen.getByRole("link", { name: /github profile/i })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SocialNetworkLink href="..." iconName="GitHub" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
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
- [ ] GitHub icon visible en profile/header section
- [ ] LinkedIn icon visible en profile/header section
- [ ] Click en GitHub → abre nueva pestaña con GitHub profile
- [ ] Click en LinkedIn → abre nueva pestaña con LinkedIn profile
- [ ] Tab navigation funciona en social links
- [ ] Focus visible en cada link al hacer Tab
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
