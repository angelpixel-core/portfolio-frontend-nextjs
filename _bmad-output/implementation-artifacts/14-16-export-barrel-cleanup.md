# Story 14.16: Export & Barrel Cleanup

Status: ready-for-dev

<!-- Note: This story is part of Code Quality & Refactorization work merged into Epic 14. -->
<!-- Source: _bmad-output/planning-artifacts/epic-17-code-quality-refactor.md Story 17.6 -->

## Story

As a **developer maintaining this codebase**,
I want **consistent export patterns across all barrel files**,
so that **imports are predictable, IDE autocomplete works reliably, and code navigation is intuitive**.

## Background

Engineering analysis identified inconsistent export patterns:
- **Pattern A (standard):** `export { default as X } from "./X"` - used by majority (27 components)
- **Pattern B (named):** `export { X } from "./X"` - used by 4 components

This inconsistency causes:
- Confusion about correct import syntax
- IDE autocomplete inconsistencies
- Cognitive load when adding new components

**Current state:** Mix of default and named exports without clear pattern
**Target state:** All barrel files use `export { default as X }` pattern

## Acceptance Criteria

### AC1: NeumorphicToggle uses default export
**Given** NeumorphicToggle currently uses `export function NeumorphicToggle`
**When** I refactor the component
**Then** it uses `export default NeumorphicToggle`
**And** the barrel file uses `export { default as NeumorphicToggle }`

### AC2: FeaturedProject uses default export
**Given** FeaturedProject currently uses `export const FeaturedProject`
**When** I refactor the component (deprecated)
**Then** it uses `export default FeaturedProject`
**And** the barrel file uses `export { default as FeaturedProject }`

### AC3: Project uses default export
**Given** Project currently uses `export const Project`
**When** I refactor the component (deprecated)
**Then** it uses `export default Project`
**And** the barrel file uses `export { default as Project }`

### AC4: TechnologyFilter uses default export
**Given** TechnologyFilter currently uses `export const TechnologyFilter`
**When** I refactor the component
**Then** it uses `export default TechnologyFilter`
**And** the barrel file uses `export { default as TechnologyFilter }`

### AC5: ArticleListItem uses default export
**Given** ArticleListItem currently uses named export
**When** I refactor the component
**Then** it uses `export default ArticleListItem`
**And** the barrel file uses `export { default as ArticleListItem }`

### AC6: SocialShareButtons uses default export
**Given** SocialShareButtons currently uses named export
**When** I refactor the component
**Then** it uses `export default SocialShareButtons`
**And** the barrel file uses `export { default as SocialShareButtons }`

### AC7: FeaturedArticlesCarousel uses default export
**Given** FeaturedArticlesCarousel currently uses named export
**When** I refactor the component
**Then** it uses `export default FeaturedArticlesCarousel`
**And** the barrel file uses `export { default as FeaturedArticlesCarousel }`

### AC8: No commented exports remain
**Given** molecules/index.js has commented exports
**When** I clean up the file
**Then** no commented `// export` lines remain
**And** barrel file is organized with section comments

### AC9: Build and tests pass
**Given** all export changes applied
**When** running validation
**Then** `npm run build` passes
**And** `npm run typecheck` passes
**And** `npm test` passes

## Tasks / Subtasks

- [ ] **Task 1: Refactor atoms/buttons exports** (AC: 1)
  - [ ] 1.1 Change NeumorphicToggle to use `export default`
  - [ ] 1.2 Update atoms/buttons/index.js barrel file
  - [ ] 1.3 Run `npm run build` to verify

- [ ] **Task 2: Refactor molecules exports** (AC: 2, 3, 4, 5, 6, 7)
  - [ ] 2.1 Change FeaturedProject to use `export default`
  - [ ] 2.2 Change Project to use `export default`
  - [ ] 2.3 Change TechnologyFilter to use `export default`
  - [ ] 2.4 Change ArticleListItem to use `export default`
  - [ ] 2.5 Change SocialShareButtons to use `export default`
  - [ ] 2.6 Change FeaturedArticlesCarousel to use `export default`
  - [ ] 2.7 Update molecules/index.js barrel file for all components

- [ ] **Task 3: Clean up commented exports** (AC: 8)
  - [ ] 3.1 Remove `// export * from "./FeaturedArticle"` from molecules/index.js
  - [ ] 3.2 Remove `// export * from "./Article"` from molecules/index.js
  - [ ] 3.3 Remove `// export * from "./MovingImage"` from molecules/index.js
  - [ ] 3.4 Remove `// export * from "./NavigationItemButtons"` from molecules/index.js
  - [ ] 3.5 Ensure section comments are clear and organized

- [ ] **Task 4: Verify organisms exports** (AC: 9)
  - [ ] 4.1 Check ArticleContent export pattern
  - [ ] 4.2 Check ArticleCard exports (multiple named exports - special case)
  - [ ] 4.3 Document ArticleCard exception if needed

- [ ] **Task 5: Validation** (AC: 9)
  - [ ] 5.1 Run `npm run build`
  - [ ] 5.2 Run `npm run typecheck`
  - [ ] 5.3 Run `npm test`
  - [ ] 5.4 Verify imports work in consuming components

## Dev Notes

### Export Pattern Standard

**Component files should use:**
```typescript
// At end of component file
export default ComponentName;
```

**Barrel files should use:**
```javascript
export { default as ComponentName } from "./ComponentName";
```

### Components to Migrate

| Component | Location | Current Export | Status |
|-----------|----------|----------------|--------|
| NeumorphicToggle | atoms/buttons/ | `export function` | Named |
| FeaturedProject | molecules/ | `export const` | Named (deprecated) |
| Project | molecules/ | `export const` | Named (deprecated) |
| TechnologyFilter | molecules/ | `export const` | Named |
| ArticleListItem | molecules/ | `export const` | Named |
| SocialShareButtons | molecules/ | `export const` | Named |
| FeaturedArticlesCarousel | molecules/ | `export const` | Named |

### Special Cases

**ArticleCard (organisms/ArticleCard):**
Exports multiple components from single file. This is acceptable as an exception:
```javascript
export { ArticleCard, FeaturedArticleCard, GridArticleCard, ArticleMeta, ArticleLink }
```
Document this as intentional design decision for related components.

### Previous Story Learnings (14-15)

From Breakpoint Standardization:
- Pattern: Atomic commits per file/component
- Testing: Run `npm run build` after each change
- Verify: Check consuming components still import correctly

### Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Import breaks in pages | 🟡 Medio | Run full build after each change |
| TypeScript errors | 🟢 Bajo | Components already typed |
| Runtime errors | 🟢 Bajo | Imports are compile-time checked |

### Verification Commands

```bash
# Verify no named exports remain (except documented exceptions)
grep "export { NeumorphicToggle" src/ui/atoms/buttons/index.js  # Should be 0
grep "export { FeaturedProject" src/ui/molecules/index.js  # Should be 0
grep "export { Project" src/ui/molecules/index.js  # Should be 0
grep "export { TechnologyFilter" src/ui/molecules/index.js  # Should be 0

# Full validation
npm run build && npm run typecheck && npm test

# Verify barrel patterns
grep -c "export { default as" src/ui/atoms/buttons/index.js  # Count default exports
grep -c "export { default as" src/ui/molecules/index.js  # Count default exports
```

### Definition of Done

- [ ] NeumorphicToggle uses `export default`
- [ ] FeaturedProject uses `export default`
- [ ] Project uses `export default`
- [ ] TechnologyFilter uses `export default`
- [ ] ArticleListItem uses `export default`
- [ ] SocialShareButtons uses `export default`
- [ ] FeaturedArticlesCarousel uses `export default`
- [ ] All barrel files use `export { default as X }` pattern
- [ ] No commented exports remain in molecules/index.js
- [ ] ArticleCard exception documented
- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes

### References

- [Source: epic-17-code-quality-refactor.md] - Story 17.6 Export & Barrel Cleanup
- [Source: code-quality-and-refactoriztion-2026-02-06.md] - Section 1.1D Exports Inconsistentes
- [Source: src/ui/atoms/buttons/index.js] - Atoms barrel file
- [Source: src/ui/molecules/index.js] - Molecules barrel file
- [Source: src/ui/organisms/index.js] - Organisms barrel file

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change |
|------|--------|
| 2026-02-06 | Story created from Epic 17.6 merged into Epic 14 |
