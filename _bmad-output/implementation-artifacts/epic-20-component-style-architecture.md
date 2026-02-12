# Epic 20 — Component & Style Architecture, Naming, Layout & Tests

> Status: BACKLOG
> Phase: Architectural Consolidation
> Type: DOCUMENTATION + CONVENTIONS (no code changes — docs first)
> Depends on: Epic 19 (production safety)

---

## Objective

Establish a comprehensive, enforceable architecture standard for the frontend codebase covering folder structure, naming conventions, styles architecture, component API patterns, import paths, test placement, layout utilities, and TypeScript migration strategy.

All deliverables are **documentation artifacts** that define conventions. Code migration is a separate follow-up epic.

---

## Out of Scope

- **Storybook setup** — No Storybook exists. Adoption is a separate epic-sized effort (future Epic 21).
- **Code refactoring** — This epic produces standards. Applying them to existing code is a follow-up.
- **Every Layout library adoption** — Evaluate only. Implementation is a separate decision.
- **New component creation** — Standards for new work, not rewriting existing.
- **Backend integration** — Frontend-only conventions.
- **CSS-in-JS migration** — Not planned. Current approach (BEM + Tailwind) is maintained.

---

## Success Criteria

1. Each story produces a markdown document in `docs/architecture/` or `_bmad-output/standards/`
2. All conventions are concrete: include file paths, naming examples, before/after snippets
3. Each convention is lintable or verifiable (ESLint rule, naming check, PR checklist)
4. Standards account for incremental adoption — no "rewrite everything" requirements
5. Existing CLAUDE.md is updated with references to new standards
6. Standards are approved before any migration work begins

---

## Current State (measured from codebase audit)

| Metric | Value |
|--------|-------|
| Components with co-located `styles.css` | 75 (48%) |
| Components Tailwind-only | ~80 (52%) |
| TypeScript files in `src/ui/` | 128 (46%) |
| JavaScript files in `src/ui/` | 153 (54%) |
| Barrel files (icons, atoms, etc.) | 8+ (including contaminated icons barrel) |
| Every Layout utilities | 0 (not implemented) |
| Storybook stories | 0 (not installed) |
| Skeleton components | ~15 (no convention) |
| Custom breakpoints | 13 (6 deprecated + 7 semantic) |
| Naming inconsistencies | 5+ categories (see audit) |
| CSS Modules usage | 0 (BEM + Tailwind approach) |

---

## Story Breakdown

---

### Story 20.1 — Folder Structure & Naming Conventions

**Objective:** Define the canonical folder structure, component file naming, and placement rules for every layer of the application.

**Affected Files:**
| File | Action |
|------|--------|
| `docs/architecture/folder-structure.md` | CREATE |
| `CLAUDE.md` | MODIFY — add reference to new doc |

**Scope:**
- Define canonical paths for atoms, molecules, organisms, overlays, shared
- Define atom subcategory rules (buttons/, icons/, links/, texts/, motion/, shadows/, hocs/)
- Define component folder contents: `index.tsx` + `styles.css` + `__tests__/` + `skeleton.tsx` + `*.types.ts`
- Address misplacements found in audit:
  - `molecules/model/` (should be in domains or deleted)
  - `molecules/skill/` lowercase (should be `Skill/`)
  - `atoms/ArticleHoverThumbnail/` (not in a category subdirectory)
- Define naming rules:
  - Component folders: PascalCase
  - Domain folders: kebab-case
  - Hook files: camelCase (`useHookName.ts`)
  - Type files: `ComponentName.types.ts`
  - Test files: `ComponentName.test.tsx`
  - Skeleton files: `skeleton.tsx`
- Define file extension rules: `.tsx` for components, `.ts` for logic, never `.jsx`/`.js` for new files
- Define barrel file rules (cross-reference Story 20.5)

**Risk Level:** Low (documentation only)

**Definition of Done:**
- [ ] Document defines canonical path for every file type
- [ ] Document includes directory tree visualization
- [ ] Document lists all known misplacements with proposed resolution
- [ ] Before/after examples for 3 component types
- [ ] Naming rules table with valid/invalid examples
- [ ] CLAUDE.md updated with link to document

**Complexity:** Medium

---

### Story 20.2 — Styles Architecture

**Objective:** Define when and how to use component-scoped CSS, Tailwind utilities, and global CSS. Establish BEM conventions, dark mode patterns, and breakpoint strategy.

**Affected Files:**
| File | Action |
|------|--------|
| `docs/architecture/styles-architecture.md` | CREATE |
| `CLAUDE.md` | MODIFY — add reference |

**Scope:**
- **Decision framework:** When to use co-located `styles.css` vs Tailwind-only
  - Rule: Use `styles.css` when component has > 5 utility classes, animations, clip-paths, pseudo-elements, or complex responsive behavior
  - Rule: Use Tailwind-only for simple compositions (< 5 utilities, no pseudo-elements)
- **BEM naming convention:** `.block__element--modifier` formalized with examples
- **Dark mode pattern:** `:is(.dark .component)` convention documented with examples
- **Breakpoint strategy:**
  - Semantic breakpoints (mobile-first, min-width): use for all new code
  - Legacy breakpoints (max-width, inverted): document as deprecated, migration path
  - Progressive typography: `phablet:` (+10%) and `mobile:` (+25%) usage
- **Global CSS rules:** What belongs in `globals.css` vs component CSS
- **No CSS Modules policy:** Rationale (BEM scoping sufficient, simpler toolchain)
- **Tailwind plugin/utility recommendations:** Custom utilities for recurring patterns
- **`@apply` usage rules:** When acceptable vs when to use raw CSS

**Risk Level:** Low (documentation only)

**Definition of Done:**
- [ ] Decision flowchart: "Where should this style live?"
- [ ] BEM naming guide with 5+ examples from real components
- [ ] Dark mode pattern guide with before/after
- [ ] Breakpoint reference table (all 13, with status: active/deprecated)
- [ ] At least 3 component examples showing correct style placement
- [ ] `@apply` policy with rationale

**Complexity:** Medium

---

### Story 20.3 — Component API & Props Standard

**Objective:** Define how component props should be typed, named, and structured. Include patterns for event handlers, stateful vs stateless, and default values.

**Affected Files:**
| File | Action |
|------|--------|
| `docs/architecture/component-api.md` | CREATE |

**Scope:**
- **Props typing:** Always use TypeScript `interface`, never `type` alias for component props
- **Interface naming:** `ComponentNameProps` (e.g., `ProjectCardProps`)
- **Props file placement:**
  - Inline in component file if < 10 properties
  - Separate `ComponentName.types.ts` if >= 10 properties or shared across files
- **Naming conventions:**
  - Boolean props: `is*`, `has*`, `should*` prefix (e.g., `isDisabled`, `hasIcon`)
  - Event handlers: `on*` prefix (e.g., `onClick`, `onClose`, `onSubmit`)
  - Render props: `render*` prefix (e.g., `renderIcon`)
- **Required vs optional:** Required by default. Use `?` only for genuinely optional behavior.
- **Default values:** Use destructuring defaults, not `defaultProps`
- **Children pattern:** `React.ReactNode` for content projection, named props for specific slots
- **Stateful vs stateless:** Document when state belongs in component vs lifted to parent/Redux
- **Framer Motion convention:** Use `m.*` not `motion.*`. Import from `framer-motion` directly.

**Risk Level:** Low (documentation only)

**Definition of Done:**
- [ ] Props interface template with annotated example
- [ ] Naming rules table (valid/invalid for each category)
- [ ] 3 example components: atom (props < 5), molecule (props 5-10), organism (props > 10 with .types.ts)
- [ ] Event handler pattern guide
- [ ] Stateful vs stateless decision guide
- [ ] framer-motion usage rules

**Complexity:** Low

---

### Story 20.4 — Test Placement & Convention Update

**Objective:** Consolidate test conventions from `test-strategy-2026-02-11.md` into an actionable placement guide with templates.

**Affected Files:**
| File | Action |
|------|--------|
| `docs/architecture/test-conventions.md` | CREATE |
| `_bmad-output/analysis/test-strategy-2026-02-11.md` | REFERENCE (not modified) |

**Scope:**
- Merge placement rules from existing test-strategy document
- Add test file templates:
  - Atom test template (render + interactions)
  - Domain schema test template (Zod validation)
  - Redux slice test template (actions + reducers)
  - Hook test template (renderHook pattern)
  - E2E test template (Playwright pattern)
- Define mock patterns reference:
  - Redux store mock
  - framer-motion mock (`src/test-utils/framer-motion-mock.ts`)
  - Hook mock (jest.mock with __esModule)
  - Direct import mock (jest.mock with factory)
- Jest mock hoisting rules (reference MEMORY.md lessons)
- Snapshot policy: keep existing, don't add new. Prefer explicit assertions.

**Risk Level:** Low (documentation only)

**Definition of Done:**
- [ ] Test placement rules formalized (unit/integration/E2E)
- [ ] 5 test templates (atom, domain schema, slice, hook, E2E)
- [ ] Mock patterns reference with 4+ patterns
- [ ] Jest mock hoisting warning documented
- [ ] Legacy test placement (2 slice tests in shared __tests__/) documented as known debt

**Complexity:** Low

---

### Story 20.5 — Barrel File & Import Path Rules

**Objective:** Define rules for barrel files (`index.ts` re-exports) and import paths to prevent bundle contamination and ensure tree-shaking.

**Affected Files:**
| File | Action |
|------|--------|
| `docs/architecture/import-rules.md` | CREATE |
| `CLAUDE.md` | MODIFY — reinforce anti-pattern in Performance section |

**Scope:**
- **Anti-pattern documented:** Icons barrel contamination (58 re-exports → 50 KiB chunk)
- **Barrel file rules:**
  - ALLOWED: Category barrels with < 10 exports (e.g., `buttons/index.ts`, `hooks/index.ts`)
  - PROHIBITED: Large barrels with > 15 exports (e.g., `icons/index.js`)
  - REQUIRED: All barrel exports must be named exports, never `export *`
- **Direct import rule for icons:** Always `@/atoms/icons/GitHubIcon` not `@/icons`
- **Import alias rules:**
  - `@/atoms`, `@/molecules`, `@/organisms` — component layer aliases
  - `@/buttons`, `@/icons`, `@/links`, `@/texts` — atom subcategory aliases
  - `@/domains/*` — domain model imports
  - `@/hooks`, `@/state/*`, `@/lib/*` — core module aliases
- **ESLint enforcement suggestion:** `no-restricted-imports` rule for banned barrel paths
- **Codemod target:** Script to find and replace barrel imports → direct imports

**Risk Level:** Low (documentation only, but HIGH impact when applied)

**Definition of Done:**
- [ ] Barrel file decision matrix (when to use / when to avoid)
- [ ] Icons barrel anti-pattern documented with bundle size data
- [ ] Import alias reference table (all aliases from tsconfig)
- [ ] ESLint `no-restricted-imports` rule draft
- [ ] Before/after code snippets for barrel → direct import migration

**Complexity:** Low

---

### Story 20.6 — Layout Patterns & Global Utilities Guide

**Objective:** Document layout composition patterns, evaluate Every Layout adoption, and define global CSS utility conventions.

**Affected Files:**
| File | Action |
|------|--------|
| `docs/architecture/layout-patterns.md` | CREATE |

**Scope:**
- **Current state:** `globals.css` has minimal layout (flexbox column, 320px min-width, 1024px max-width centering). No Every Layout primitives.
- **Every Layout evaluation:**
  - Assess which primitives would benefit the project: Stack (vertical rhythm), Center (max-width containment), Cluster (inline grouping)
  - Recommend Tailwind utility equivalents where possible (e.g., Stack ≈ `space-y-*`, Center ≈ `max-w-* mx-auto`)
  - Recommend custom CSS classes only where Tailwind utilities are insufficient (e.g., Sidebar, Switcher)
  - Decision: adopt 0-3 primitives as global utilities, not the full library
- **Page composition patterns:**
  - Hero + main + footer layout
  - Centered content containers
  - Responsive grid lists (projects, articles)
  - Full-bleed sections within constrained layouts
- **Responsive design rules:**
  - Mobile-first (semantic breakpoints only)
  - Min/max width controls
  - Content-based breakpoints vs device-based

**Risk Level:** Low (documentation only)

**Definition of Done:**
- [ ] Current layout system documented (globals.css analysis)
- [ ] Every Layout evaluation matrix (adopt / skip / defer per primitive)
- [ ] 4 page composition pattern examples with code
- [ ] Tailwind equivalents for adopted layout primitives
- [ ] Responsive design rules with breakpoint decision guide

**Complexity:** Medium

---

### Story 20.7 — TypeScript Migration Plan

**Objective:** Define the prioritized migration strategy from JavaScript (.jsx/.js) to TypeScript (.tsx/.ts) for the 153 remaining JS files in `src/ui/`.

**Affected Files:**
| File | Action |
|------|--------|
| `docs/architecture/typescript-migration.md` | CREATE |

**Scope:**
- **Current state:** 153 .jsx/.js files in src/ui/, 128 .tsx/.ts files (46% TS)
- **Priority tiers:**
  - P1: Components with existing `.types.ts` but `.jsx` index (easy wins)
  - P2: Organisms (most complex, highest value from typing)
  - P3: Molecules (medium complexity)
  - P4: Atoms/icons (simplest, most numerous — batch-convertible)
- **Migration rules:**
  - Rename `.jsx` → `.tsx`, add props interface
  - Rename `.js` → `.ts` for non-React files
  - No behavioral changes during migration
  - Tests must pass before and after
- **Barrel file migration:** `.js` barrels → `.ts` barrels (8 files)
- **Provider migration:** `RootProvider/index.jsx` → `.tsx`, `providers/index.js` → `.ts`
- **Codemod suggestion:** Script to rename files + add minimal typing
- **Acceptance criteria per batch:** lint + typecheck + test pass

**Risk Level:** Medium (migration plan involves touching many files)

**Definition of Done:**
- [ ] Full inventory of 153 JS files with priority tier assignment
- [ ] Migration rules (what to change, what NOT to change)
- [ ] Batch size recommendation (files per PR)
- [ ] Codemod script specification (rename + basic interface scaffolding)
- [ ] Rollback strategy (per-file, not big-bang)

**Complexity:** Medium

---

## Recommended Execution Order

| Order | Story | Rationale |
|:-----:|-------|-----------|
| 1 | **20.1** Folder Structure | Foundation — all other docs reference this |
| 2 | **20.2** Styles Architecture | High impact on daily development decisions |
| 3 | **20.5** Import & Barrel Rules | Critical for performance (icons barrel lesson) |
| 4 | **20.3** Component API | Standardizes new component creation |
| 5 | **20.4** Test Conventions | Builds on existing test-strategy doc |
| 6 | **20.6** Layout Patterns | Lower urgency, evaluative |
| 7 | **20.7** TS Migration Plan | Plan only, execution is a separate epic |

Stories 20.1 + 20.2 + 20.5 son el **critical path** (se pueden hacer en 1 día).
Stories 20.3 + 20.4 son el **segundo bloque** (1 día).
Stories 20.6 + 20.7 son el **tercer bloque** (1 día).

---

## Dependency Graph

```
20.1 (Folder Structure)
  │
  ├──> 20.2 (Styles)
  ├──> 20.3 (Component API)
  ├──> 20.5 (Import Rules)
  │
  20.4 (Tests) ──> independent (references test-strategy doc)
  20.6 (Layout) ──> independent
  20.7 (TS Migration) ──> depends on 20.1 (naming) + 20.3 (props typing)
```

---

## Future Epics (out of scope here)

| Epic | Description | Depends on |
|------|-------------|------------|
| **Epic 21** | Storybook Setup & Component Catalog | Epic 20 (conventions defined first) |
| **Epic 22** | TypeScript Migration Execution | Story 20.7 (plan approved) |
| **Epic 23** | Barrel File Cleanup & ESLint Enforcement | Story 20.5 (rules defined) |
| **Epic 24** | Legacy Breakpoint Migration | Story 20.2 (breakpoint strategy defined) |
