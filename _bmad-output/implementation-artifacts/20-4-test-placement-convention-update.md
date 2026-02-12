# Story 20.4: Test Placement & Convention Update

Status: review

## Story

As a **developer working on the portfolio frontend**,
I want **a canonical test conventions guide consolidating placement rules, mock patterns, and templates from the existing test-strategy document**,
so that **all new tests follow consistent patterns for file placement, naming, mocking, and assertion style**.

## Acceptance Criteria

1. Test placement rules formalized (unit/integration/E2E) with canonical directory patterns
2. 5 test templates: atom component, domain schema, Redux slice, hook, E2E spec
3. Mock patterns reference with 4+ patterns (Redux store, framer-motion, hook mock, React Query wrapper)
4. Jest mock hoisting warning documented with before/after examples
5. Legacy test placement (2 slice tests in shared `__tests__/`) documented as known debt
6. `CLAUDE.md` updated with link to new document in Key Files Reference section

## Tasks / Subtasks

- [x] Task 1: Create `docs/architecture/test-conventions.md` (AC: #1-5)
  - [x] Section 1: Test Placement Convention (AC: #1)
    - Rule: All unit/integration tests in `__tests__/` subdirectory of their source module
    - Rule: Test files named `{Subject}.test.tsx` (React) or `{Subject}.test.ts` (logic)
    - Rule: E2E tests in `e2e/{feature}.spec.ts` (Playwright, Chromium only)
    - 6 canonical placement patterns: domain model, domain queries, UI component, Redux slice, hook, E2E
    - Centralized test IDs: `e2e/testids.ts`
    - Test utilities: `src/test-utils/` (framer-motion-mock.ts, axe-helper.ts)
  - [x] Section 2: Test File Templates (AC: #2)
    - Template 1: Atom component test — render + interactions + accessibility
    - Template 2: Domain schema test — Zod `.safeParse()` valid/invalid cases
    - Template 3: Redux slice test — reducer actions + side effects + localStorage
    - Template 4: Hook test — `renderHook()` + mock dependencies
    - Template 5: E2E spec test — Playwright fixture + test IDs + waitFor patterns
    - Each template annotated with pattern rationale
  - [x] Section 3: Mock Patterns Reference (AC: #3)
    - Pattern 1: Redux store mock — `createTestStore()` + `renderWithProvider()`
    - Pattern 2: framer-motion mock — `require("@/test-utils/framer-motion-mock")`
    - Pattern 3: Hook mock — `jest.fn()` at module scope + `jest.mock()` factory
    - Pattern 4: React Query wrapper — `createWrapper()` with `retry: false`
    - Pattern 5: Next.js navigation mock — global in `jest.setup.js`
    - Pattern 6: Direct import mock — `__esModule: true` for default exports
    - Pattern 7: Icon mock — `__esModule: true` + SVG stub with test ID
  - [x] Section 4: Jest Mock Hoisting Rules (AC: #4)
    - Rule: `jest.mock()` calls are hoisted ABOVE variable declarations
    - Anti-pattern: referencing `const` helpers inside `jest.mock()` factory
    - Fix: inline all factory functions directly in `jest.mock()` calls
    - Before/after example with real codebase pattern
    - Rule: direct imports (not barrels) require `__esModule: true` in factory
  - [x] Section 5: Snapshot Policy (AC: #1)
    - Current state: 3 snapshot files, ~10 snapshots (ProjectCard, MenuFloating, ProjectListSkeleton)
    - Rule: Keep existing snapshots, don't add new ones
    - Rule: Prefer explicit assertions over snapshot matching
    - Rationale: snapshots are brittle for styling changes
  - [x] Section 6: Legacy & Known Debt (AC: #5)
    - 2 slice tests in shared `src/state/slices/__tests__/` (menuPanel, themeMode) instead of co-located
    - Proposed migration path (low priority, tests work fine)
    - Cross-cutting a11y test approaches (jest-axe vs targeted assertions)
    - Recommendation: prefer targeted assertions for new a11y tests
  - [x] Section 7: Test Configuration Reference
    - Jest config summary (jest.config.cjs): jsdom, testMatch pattern, moduleNameMapper
    - Jest setup summary (jest.setup.js): @testing-library/jest-dom, Next.js navigation mock
    - Playwright config summary (playwright.config.ts): Chromium only, port 9000, CI settings
    - Coverage: not enforced yet, proposed thresholds from test-strategy doc
  - [x] Section 8: Codebase Metrics Appendix
    - Test file counts by extension and category
    - Coverage heatmap summary (from test-strategy-2026-02-11.md)
    - Cross-references to test-strategy document for gap details
- [x] Task 2: Update `CLAUDE.md` (AC: #6)
  - [x] Add `docs/architecture/test-conventions.md` to Key Files Reference section
- [x] Task 3: Verify document quality (AC: #1-6)
  - [x] `npm run lint` — no regressions
  - [x] `npm run typecheck` — no regressions
  - [x] `npm test` — all tests pass (no code changes, but verify)

## Dev Notes

### Tipo de Story

**DOCUMENTATION ONLY** — Esta story produce un documento markdown. NO hay cambios de codigo fuente, solo `docs/architecture/test-conventions.md` + update a `CLAUDE.md`.

### Datos del Codebase (auditoria exhaustiva)

#### Test File Statistics

| Metrica | Valor |
|---------|-------|
| Total unit test files | 96 |
| Unit tests `.test.tsx` | 70 (72.9%) |
| Unit tests `.test.ts` | 25 (26.0%) |
| Unit tests `.test.js` | 1 (1.0% — ESLint rule test) |
| E2E spec files | 22 |
| Snapshot files | 3 (~10 snapshots) |
| Test utility files | 2 (framer-motion-mock.ts, axe-helper.ts) |
| Jest setup files | 1 (jest.setup.js) |
| Total test cases | ~983 (as of Story 20.3) |

#### Test File Distribution by Category

| Categoria | Ruta | Archivos | Notas |
|-----------|------|----------|-------|
| App Route Tests | `src/app/__tests__/` | 7 | Layout, error, SkipLink, smoke |
| Domain Model Tests | `src/domains/{name}/model/__tests__/` | 10 | Zod schema validation |
| Domain Query Tests | `src/domains/{name}/queries/__tests__/` | 8 | React Query hooks |
| Hook Tests | `src/hooks/{category}/__tests__/` | 4 | useReducedMotion, useScrollAppearance, useTouchState, useTransition |
| Redux Slice Tests | `src/state/slices/{name}/__tests__/` + `slices/__tests__/` | 4 | 2 co-located + 2 legacy shared |
| Atom Button Tests | `src/ui/atoms/buttons/*/__tests__/` | 6 | ThemeButton, AuthButton, ChatButton, CopyButton, SkillSelectorButton |
| Molecule Tests | `src/ui/molecules/{name}/__tests__/` | 17 | Articles, Calendar, CopyEmail, Education, Experience, filters |
| Organism Tests | `src/ui/organisms/{name}/__tests__/` | 18 | Academics, ArticleCard, Auth, Chat, Menu, ProjectCard, Skills |
| Overlay A11y Tests | `src/ui/overlays/__tests__/` | 2 | Floating, FloatingMobile accessibility |
| Library/Service Tests | `src/lib/__tests__/`, `src/services/__tests__/` | 6 | createQueryHook, article-jsonld, auth utilities |
| Provider Tests | `src/state/providers/*/__tests__/` | 2 | AuthProvider, TransitionProvider |
| Shared/Config Tests | `src/ui/__tests__/`, `src/styles/__tests__/` | 3 | responsive, reduced-motion |

#### Naming Convention Compliance

| Patron | Archivos | Compliance |
|--------|----------|------------|
| `__tests__/` subdirectory placement | 96/96 | 100% |
| `.test.tsx` for React tests | 70/70 | 100% |
| `.test.ts` for logic tests | 25/25 | 100% |
| `.spec.ts` for E2E tests | 22/22 | 100% |
| Centralized test IDs (`e2e/testids.ts`) | 22/22 | 100% |

#### Mock Patterns Inventory (datos reales)

| Patron | Ejemplo Real | Componente |
|--------|-------------|------------|
| Redux store mock | `createTestStore()` + `renderWithProvider()` | ThemeButton, AuthButton |
| framer-motion mock | `require("@/test-utils/framer-motion-mock")` | All motion components |
| Hook mock (jest.fn at scope) | `const mockUseReducedMotion = jest.fn()` | useReducedMotion |
| React Query wrapper | `createWrapper()` con `retry: false` | useArticles, useProjects |
| Next.js navigation | Global en `jest.setup.js` | All components using router |
| Direct import (__esModule) | `{ __esModule: true, default: () => <svg /> }` | Icon mocks (GitHubIcon, etc.) |
| Icon mock with testid | `default: () => <svg data-testid="github-icon" />` | ProjectCard, ArticleCard |

#### Jest Configuration Key Points

| Configuracion | Valor |
|---------------|-------|
| Test environment | `jsdom` |
| Test match pattern | `**/__tests__/**/*.test.[jt]s?(x)` |
| Setup file | `jest.setup.js` (@testing-library/jest-dom + Next.js nav mock) |
| Module name mapper | 20+ aliases mirroring tsconfig paths |
| Coverage thresholds | NONE (proposed in test-strategy doc) |
| CSS handling | Auto-mocked by next/jest |

#### Playwright Configuration Key Points

| Configuracion | Valor |
|---------------|-------|
| Test directory | `./e2e` |
| Browser | Chromium only |
| Base URL | `http://localhost:9000` |
| Retries | 2 in CI, 0 locally |
| Workers | 1 in CI (sequential), parallel locally |
| Reporter | `github` in CI, `html` locally |
| Web server | `npm run dev` (auto-started) |
| Trace | `on-first-retry` |

#### Snapshot Test Inventory

| Archivo | Snapshots | Componente |
|---------|-----------|------------|
| `ProjectCard/__tests__/__snapshots__/ProjectCard.test.tsx.snap` | 7 | ProjectCard variants |
| `MenuFloating/__tests__/__snapshots__/MenuFloatingClient.test.tsx.snap` | 2 | Menu floating UI |
| `projects/__tests__/__snapshots__/ProjectListSkeleton.test.tsx.snap` | 1 | Skeleton loading state |

#### Legacy Test Placement (datos reales)

| Test File | Ubicacion Actual | Ubicacion Correcta |
|-----------|-----------------|-------------------|
| `menuPanel.slice.test.ts` | `src/state/slices/__tests__/` (shared) | `src/state/slices/menuPanel/__tests__/slice.test.ts` |
| `themeMode.slice.test.ts` | `src/state/slices/__tests__/` (shared) | `src/state/slices/themeMode/__tests__/slice.test.ts` |

**Nota**: Tests funcionan correctamente, migracion es baja prioridad.

#### A11y Test Approaches (datos reales)

| Enfoque | Archivos | Patron |
|---------|----------|--------|
| jest-axe (full page) | `a11y-axe.test.tsx` | Heavy component mocks, lower value |
| Section-level assertions | `Sections.a11y.test.tsx` | Targeted, higher value |
| Overlay-specific a11y | `Floating.a11y.test.tsx`, `FloatingMobile.a11y.test.tsx` | Focused assertions |

**Recomendacion**: Preferir assertions dirigidas sobre scans jest-axe con mocking extenso.

#### Test Utility Files (datos reales)

| Archivo | Lineas | Contenido |
|---------|--------|-----------|
| `src/test-utils/framer-motion-mock.ts` | 286 | Motion components (div, span, a, button, etc.), LazyMotion passthrough, AnimatePresence passthrough, hook mocks (useReducedMotion, useInView, useScroll, etc.), both `motion` and `m` exports |
| `src/test-utils/axe-helper.ts` | 15 | jest-axe integration, exports `checkA11y()`, `axe`, `toHaveNoViolations` |

### Scope Boundaries — Que NO Hacer

| NO hacer | Razon |
|----------|-------|
| Mover tests legacy (menuPanel, themeMode) | Solo documentar, migracion es tarea futura |
| Crear tests nuevos | Solo documentar patrones y templates |
| Modificar jest.config.cjs | Solo documentar configuracion |
| Modificar playwright.config.ts | Solo documentar configuracion |
| Agregar coverage thresholds | Solo documentar propuesta |
| Tocar `src/` | Epic 20 es docs-only |

### Previous Story Intelligence (Story 20.3)

- Story 20.3 creo `docs/architecture/component-api.md` exitosamente
- Code review encontro 6 issues (0 HIGH, 4 MEDIUM, 2 LOW) — todos corregidos
- Key learning: verificar datos contra codebase real (counts incorrectos de "use client", m.* components, Props definitions)
- Key learning: marcar convenciones aspiracionales como "(recommended)" si no estan adoptadas
- Pattern: documentar excepciones historicas explicitamente con markers
- Pattern: incluir cross-references a otros documentos del epic
- **Verificacion triple**: Todo dato citado en el documento debe ser verificable contra codebase real (grep counts)
- Misplacements se documentan pero NO se corrigen (correccion es epic futuro)

### Documentacion Existente a Referenciar

| Documento | Contenido Relevante |
|-----------|-------------------:|
| `_bmad-output/analysis/test-strategy-2026-02-11.md` | Test philosophy, placement, coverage heatmap, gaps, thresholds |
| `docs/architecture/folder-structure.md` | Component folder contents, `__tests__/` placement (Story 20.1) |
| `docs/architecture/component-api.md` | Props typing, stateful patterns (Story 20.3) |
| `CLAUDE.md` | Testing Conventions section, Critical E2E Flows, framer-motion notes |
| `jest.config.cjs` | Module name mapper, test match patterns |
| `jest.setup.js` | Global mocks (Next.js navigation) |
| `playwright.config.ts` | E2E configuration, browser settings |
| `src/test-utils/framer-motion-mock.ts` | Comprehensive motion mock (286 lines) |
| `src/test-utils/axe-helper.ts` | jest-axe integration helper |
| `e2e/testids.ts` | Centralized E2E test IDs |

### Real Test Examples for Templates

**Atom test model**: `src/ui/atoms/buttons/ThemeButton/__tests__/ThemeButton.test.tsx`
- Redux store setup with `createTestStore()`, `renderWithProvider()` wrapper
- Grouped describes: accessibility, functionality
- Role-based queries: `screen.getByRole("switch")`

**Domain schema test model**: `src/domains/article/model/__tests__/schema.test.ts`
- Zod `.safeParse()` with type-safe success check
- Separate valid/invalid case describes
- Tests default values and enum validation

**Redux slice test model**: `src/state/slices/__tests__/themeMode.slice.test.ts`
- Pure reducer function testing
- localStorage mock with `beforeEach` cleanup
- `matchMedia` helper function
- Legacy key migration tests

**Hook test model**: `src/hooks/ui/__tests__/useReducedMotion.test.ts`
- `renderHook()` from Testing Library
- `jest.mock` at module top-level (hoisting-safe)
- Defensive null/undefined handling

**Query hook test model**: `src/domains/article/queries/__tests__/useArticles.test.tsx`
- React Query `createWrapper()` with `retry: false`
- `jest.useFakeTimers()` + `jest.advanceTimersByTime()`
- `waitFor()` for async assertions

**E2E test model**: `e2e/theme.spec.ts`
- `test.use({ viewport })` for breakpoint control
- Helper functions for repeated interactions
- `addInitScript()` for localStorage setup
- `page.waitForLoadState('networkidle')`
- `emulateMedia()` for system preference testing
- Centralized test IDs from `testids.ts`

### References

- [Source: _bmad-output/implementation-artifacts/epic-20-component-style-architecture.md#Story 20.4]
- [Source: _bmad-output/analysis/test-strategy-2026-02-11.md — test philosophy, placement, coverage]
- [Source: docs/architecture/folder-structure.md — component folder contents, __tests__/ placement]
- [Source: jest.config.cjs — test match patterns, module name mapper]
- [Source: playwright.config.ts — E2E configuration]
- [Source: src/test-utils/framer-motion-mock.ts — comprehensive motion mock]
- [Source: CLAUDE.md — Testing Conventions, Critical E2E Flows]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A — documentation-only story, no debugging needed.

### Completion Notes List

- All 8 sections written covering test placement convention (6 canonical patterns + naming rules + test utilities), 5 test file templates (atom component, domain schema, Redux slice, hook + query hook variant, E2E spec), 7 mock patterns (Redux store, framer-motion, hook mock, React Query wrapper, Next.js navigation, direct import __esModule, Next.js Link), Jest mock hoisting rules (anti-pattern + fix + before/after examples + __esModule rule), snapshot policy (3 files, 5 snapshots, keep existing / don't add new), legacy & known debt (2 misplaced slice tests, 3 a11y approaches with recommendation), test configuration reference (Jest + Playwright + proposed coverage thresholds), codebase metrics appendix (test pyramid, layer distribution, cross-references)
- Data sourced from exhaustive codebase audit: 96 unit test files, 22 E2E specs, 2 test utilities, 3 snapshot files
- All code examples adapted from real test files (ThemeButton, article schema, themeMode slice, useReducedMotion, useArticles, theme.spec.ts)
- Cross-references to test-strategy-2026-02-11.md, folder-structure.md, component-api.md, styles-architecture.md, CLAUDE.md
- Lint, typecheck, 983 tests — all passing, 0 regressions
- Code review fixes (5 findings): corrected snapshot counts (3→5 total), corrected test distribution table (13 layers with accurate counts), changed "Based on" to "Adapted from" for simplified template, added Services/App/Lib/Styles/Other rows to distribution, added note about no centralized test wrapper

### File List

| Archivo | Accion | Estado |
|---------|--------|--------|
| `docs/architecture/test-conventions.md` | CREAR | done |
| `CLAUDE.md` | MODIFICAR — agregar referencia en Key Files Reference | done |
