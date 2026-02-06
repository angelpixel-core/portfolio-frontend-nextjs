# Story 14.13: Domain TypeScript Migration

Status: ready-for-dev

<!-- Note: This story is part of Code Quality & Refactorization work merged into Epic 14. -->
<!-- Source: _bmad-output/analysis/code-quality-and-refactoriztion-2026-02-06.md Phase 3 -->

## Story

As a **developer maintaining this codebase**,
I want **all domain modules fully migrated to TypeScript with Zod schemas**,
so that **data validation is consistent, type-safe, and catches errors at compile time**.

## Background

Engineering analysis identified incomplete TypeScript migration in domains:

| Domain | JS Files | TS Files | Empty Schema | Status |
|--------|----------|----------|--------------|--------|
| content | 5 | 0 | YES | 100% JS |
| customer | 5 | 1 | YES | 100% JS |
| experience-stat | 3 | 2 | NO | Mixed |
| navigation-item | 3 | 2 | YES | Mixed |
| contact-point | 2 | 3 | NO | Partial |
| profile | 2 | 4 | NO | Partial |
| technology | 1 | 4 | NO | Almost done |

This story completes the migration for type safety across all domains.

## Acceptance Criteria

### AC1: Empty schemas populated with Zod definitions
**Given** domains with empty schema files (content, customer, navigation-item)
**When** Zod schemas are created
**Then** each schema defines the data structure with proper types
**And** each schema exports inferred TypeScript type (`z.infer<typeof Schema>`)
**And** validation works for single and array forms

### AC2: All domain files migrated to TypeScript
**Given** all .js files in src/domains/
**When** migrated to .ts/.tsx
**Then** `find src/domains -name "*.js" | wc -l` returns 0
**And** all imports resolve correctly
**And** no `any` types except where absolutely necessary

### AC3: Queries use gcTime instead of cacheTime
**Given** React Query hooks in domains
**When** using deprecated `cacheTime` option
**Then** all occurrences replaced with `gcTime`
**And** no deprecated warnings in console

### AC4: Type safety verified
**Given** all domain migrations complete
**When** running `npm run typecheck`
**Then** no TypeScript errors related to domains
**And** IDE autocomplete works for domain types

### AC5: Typo in experience-stat fixed
**Given** the QUERY_KEY in experience-stat
**When** checking the value
**Then** 'experiencie' is corrected to 'experience'

### AC6: Build and tests pass
**Given** all TypeScript migrations
**When** running validation
**Then** `npm run build` passes
**And** `npm test` passes
**And** no runtime errors

## Tasks / Subtasks

- [ ] **Task 1: Create Zod schemas for empty schema files** (AC: 1)
  - [ ] 1.1 Create `content/model/schema.ts` with ContentSchema
  - [ ] 1.2 Create `customer/model/schema.ts` with CustomerSchema
  - [ ] 1.3 Create `navigation-item/model/schema.ts` with NavigationItemSchema
  - [ ] 1.4 Export inferred types from each schema

- [ ] **Task 2: Migrate content domain** (AC: 2, 4)
  - [ ] 2.1 `model/index.js` → `model/index.ts`
  - [ ] 2.2 `model/mock.js` → `model/mock.ts`
  - [ ] 2.3 `queries/useContent.js` → `queries/useContent.ts`
  - [ ] 2.4 `queries/useContents.js` → `queries/useContents.ts`
  - [ ] 2.5 Verify imports and type inference

- [ ] **Task 3: Migrate customer domain** (AC: 2, 4)
  - [ ] 3.1 `model/index.js` → `model/index.ts`
  - [ ] 3.2 `model/mock.js` → `model/mock.ts`
  - [ ] 3.3 `queries/useCustomer.js` → `queries/useCustomer.ts`
  - [ ] 3.4 `queries/useCustomers.js` → `queries/useCustomers.ts`
  - [ ] 3.5 `queries/index.js` → `queries/index.ts`

- [ ] **Task 4: Migrate experience-stat domain** (AC: 2, 3, 5)
  - [ ] 4.1 `model/schema.js` → `model/schema.ts`
  - [ ] 4.2 `model/index.js` → `model/index.ts`
  - [ ] 4.3 `model/mock.js` → `model/mock.ts`
  - [ ] 4.4 `queries/useExperienceStats.js` → `queries/useExperienceStats.ts`
  - [ ] 4.5 Fix QUERY_KEY typo: 'experiencie' → 'experience'
  - [ ] 4.6 Replace cacheTime → gcTime if present

- [ ] **Task 5: Migrate navigation-item domain** (AC: 2, 4)
  - [ ] 5.1 `model/index.js` → `model/index.ts`
  - [ ] 5.2 `model/mock.js` → `model/mock.ts`
  - [ ] 5.3 `queries/useNavigationItems.js` → `queries/useNavigationItems.ts`

- [ ] **Task 6: Complete contact-point domain** (AC: 2, 4)
  - [ ] 6.1 `model/index.js` → `model/index.ts`
  - [ ] 6.2 `model/mock.js` → `model/mock.ts`

- [ ] **Task 7: Complete profile domain** (AC: 2, 4)
  - [ ] 7.1 `model/index.js` → `model/index.ts`
  - [ ] 7.2 `model/mock.js` → `model/mock.ts`

- [ ] **Task 8: Complete technology domain** (AC: 2, 4)
  - [ ] 8.1 `model/mock.js` → `model/mock.ts`

- [ ] **Task 9: Replace deprecated cacheTime** (AC: 3)
  - [ ] 9.1 Search all JS query hooks for cacheTime
  - [ ] 9.2 Replace with gcTime
  - [ ] 9.3 Verify no deprecation warnings

- [ ] **Task 10: Validation** (AC: 4, 6)
  - [ ] 10.1 `find src/domains -name "*.js" | wc -l` returns 0
  - [ ] 10.2 `npm run typecheck` passes
  - [ ] 10.3 `npm run build` passes
  - [ ] 10.4 `npm test` passes
  - [ ] 10.5 Verify domain data loads in UI

## Dev Notes

### Domain Layer Pattern

Each domain follows this structure:
```
domain-name/
├── model/
│   ├── index.ts    # fetchAll, fetchById functions with Zod parsing
│   ├── mock.ts     # Development mock data typed with schema
│   └── schema.ts   # Zod schema + TypeScript types
└── queries/
    ├── index.ts    # Re-exports
    └── useDomain.ts  # React Query hooks with types
```

### Schema Pattern (from existing TypeScript domains)

```typescript
// schema.ts pattern
import { z } from "zod";

export const DomainSchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... fields
});

export const DomainsSchema = z.array(DomainSchema);

// Export inferred types
export type Domain = z.infer<typeof DomainSchema>;
export type Domains = z.infer<typeof DomainsSchema>;
```

### Model Index Pattern

```typescript
// model/index.ts pattern
import { DomainsSchema, type Domains } from "./schema";
import { mockDomains } from "./mock";

const QUERY_KEY = "domains";

export const model = {
  queryKey: QUERY_KEY,

  async fetchAll(useMockFallback = true): Promise<Domains> {
    if (useMockFallback) {
      return DomainsSchema.parse(mockDomains);
    }
    // Real API call would go here
    const response = await fetch("/api/domains");
    const data = await response.json();
    return DomainsSchema.parse(data);
  },
};

export default model;
```

### Query Hook Pattern

```typescript
// queries/useDomains.ts pattern
import { useQuery } from "@tanstack/react-query";
import model from "../model";
import type { Domains } from "../model/schema";

export const useDomains = () => {
  return useQuery<Domains>({
    queryKey: [model.queryKey],
    queryFn: () => model.fetchAll(),
    staleTime: 1000 * 60 * 5,  // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes (NOT cacheTime!)
  });
};
```

### Existing Schema Examples

**profile/model/schema.ts** - Good reference:
```typescript
export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  avatar: z.string().url(),
  // ...
});
```

**technology/model/schema.ts** - Good reference:
```typescript
export const TechnologySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  category: z.string(),
});
```

### Files to Migrate (Total: 21)

| Domain | Files to Convert |
|--------|-----------------|
| content | 4 (index, mock, useContent, useContents) + create schema |
| customer | 5 (index, mock, useCustomer, useCustomers, queries/index) + create schema |
| experience-stat | 4 (schema, index, mock, useExperienceStats) |
| navigation-item | 3 (index, mock, useNavigationItems) + create schema |
| contact-point | 2 (index, mock) |
| profile | 2 (index, mock) |
| technology | 1 (mock) |

### Known Issues to Fix

1. **experience-stat QUERY_KEY typo**: 'experiencie' should be 'experience'
2. **cacheTime deprecated**: Replace with gcTime in all hooks

### Verification Commands

```bash
# Check for remaining JS files
find src/domains -name "*.js" | wc -l

# Should return 0 after migration

# Check TypeScript errors
npm run typecheck

# Check for deprecated cacheTime
grep -r "cacheTime" src/domains/

# Should return 0 after migration

# Check for typo
grep -r "experiencie" src/

# Should return 0 after fix
```

### Risk Assessment

| Task | Risk | Notes |
|------|------|-------|
| Schema creation | 🟢 Low | Additive, based on mock data structure |
| File renaming | 🟡 Medium | Must update all imports |
| Type inference | 🟡 Medium | May expose existing type issues |
| cacheTime → gcTime | 🟢 Low | Direct rename |

### Migration Order (Recommended)

1. **technology** (1 file) - Easiest, quick win
2. **profile** (2 files) - Schema exists, just model layer
3. **contact-point** (2 files) - Schema exists, just model layer
4. **experience-stat** (4 files) - Schema has content, needs conversion
5. **navigation-item** (4 files) - Need schema + migrations
6. **customer** (6 files) - Need schema + migrations
7. **content** (5 files) - Need schema + migrations

### Previous Story Learnings (14-12)

From CSS Utilities Consolidation:
- Pattern: Add utility first, then migrate components
- Verification: Use grep to confirm no hardcoded values remain
- Testing: Build must pass before marking complete
- Commits: Atomic commits per domain for easy rollback

### References

- [Source: code-quality-and-refactoriztion-2026-02-06.md] - Phase 3 Domain TypeScript Migration
- [Source: CLAUDE.md] - Domain layer pattern documentation
- [Source: profile/model/schema.ts] - Reference TypeScript schema implementation
- [Source: technology/model/schema.ts] - Reference TypeScript schema implementation

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

N/A

### Completion Notes List

(To be filled during implementation)

### File List

(To be filled during implementation)
