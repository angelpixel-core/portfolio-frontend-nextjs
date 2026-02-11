# Test Strategy & Coverage Heatmap

> Generated: 2026-02-11
> Phase: Architectural Consolidation (pre-production)
> Status: ACTIONABLE REFERENCE

---

## 1. Test Philosophy

### What MUST Be Tested
- **Zod schemas** — Data contract validation (all 11 domains)
- **Redux slices** — State management correctness (all 5 slices)
- **Auth flows** — Security-critical (E2E + unit)
- **Critical E2E flows** — 7 flows defined in CLAUDE.md
- **Accessibility** — Focus management, aria attributes, keyboard navigation
- **Query hooks** — React Query integration with mock data

### What SHOULD NOT Be Tested
- CSS styling (except reduced-motion behavioral tests)
- Skeleton components (pure visual, no logic)
- Barrel exports/re-exports
- Third-party library internals (framer-motion, React Query)
- Static content rendering (covered by E2E smoke tests)
- Individual icon components (SVG wrappers with no logic)

### Test Pyramid

```
         /  E2E  \        21 files (Playwright, Chromium)
        / Integ.  \       ~15 files (Jest + RTL, multi-component)
       /   Unit    \      ~78 files (Jest, isolated logic)
```

**Target ratio:** 70% unit / 15% integration / 15% E2E

---

## 2. Normalized Test Placement Convention

### Domain Tests
```
src/domains/{name}/
├── model/
│   └── __tests__/
│       ├── schema.test.ts        # Zod schema validation
│       ├── model.test.ts         # fetchAll/fetchById logic
│       └── validate-data.test.ts # Mock data validation
└── queries/
    └── __tests__/
        ├── use{Entity}s.test.tsx      # fetchAll hook
        └── use{Entity}BySlug.test.tsx # fetchById hook (if applicable)
```

### UI Component Tests
```
src/ui/{layer}/{ComponentName}/
└── __tests__/
    ├── {ComponentName}.test.tsx    # Main test file
    ├── skeleton.test.tsx           # ONLY if skeleton has logic
    └── __snapshots__/             # Auto-generated snapshots
```

### State Management Tests
```
src/state/slices/{sliceName}/
└── __tests__/
    └── slice.test.ts              # Slice reducer + actions
```

**Legacy placement (to migrate):**
- `src/state/slices/__tests__/menuPanel.slice.test.ts` → should be `src/state/slices/menuPanel/__tests__/slice.test.ts`
- `src/state/slices/__tests__/themeMode.slice.test.ts` → should be `src/state/slices/themeMode/__tests__/slice.test.ts`

### Hook Tests
```
src/hooks/{category}/
└── __tests__/
    └── use{HookName}.test.ts(x)
```

### E2E Tests
```
e2e/
├── {feature}.spec.ts              # One file per feature/flow
└── testids.ts                     # Centralized test IDs
```

---

## 3. Coverage Heatmap

### 3.1 Domain Coverage Matrix (11 domains)

| Domain | Schema | Model | Validate | Queries | Status |
|--------|:------:|:-----:|:--------:|:-------:|--------|
| article | OK | OK | OK | OK (2) | **FULL** |
| project | OK | OK | OK | OK (2) | **FULL** |
| academic | OK | -- | -- | OK | **GOOD** |
| job-experience | OK | -- | -- | OK | **PARTIAL** |
| profile | OK | -- | -- | OK | **PARTIAL** |
| technology | OK | -- | -- | -- | **SCHEMA-ONLY** |
| contact-point | OK | -- | -- | -- | **SCHEMA-ONLY** |
| content | -- | -- | -- | -- | **NONE** |
| customer | -- | -- | -- | -- | **NONE** |
| experience-stat | -- | -- | -- | -- | **NONE** |
| navigation-item | -- | -- | -- | -- | **NONE** |

**Legend:** OK = test file exists, -- = no test, (N) = N test files

### 3.2 Redux Slice Coverage Matrix (5 slices)

| Slice | Test File | Location | Status |
|-------|-----------|----------|--------|
| menuPanel | `menuPanel.slice.test.ts` | `slices/__tests__/` (legacy) | OK |
| themeMode | `themeMode.slice.test.ts` | `slices/__tests__/` (legacy) | OK |
| authPanel | `slice.test.ts` | `authPanel/__tests__/` | OK |
| EmailClipboard | `slice.test.ts` | `EmailClipboard/__tests__/` | OK |
| chatPanel | -- | -- | **MISSING** |

### 3.3 Organism Coverage Matrix (19 organisms)

| Organism | Unit Tests | E2E Coverage | Status |
|----------|:----------:|:------------:|--------|
| Academics | OK | -- | GOOD |
| ArticleCard | OK | -- | GOOD |
| ArticleContent | OK (2) | -- | GOOD |
| Auth | OK (3) | `auth.spec.ts` | **FULL** |
| Biography | -- | -- | **MISSING** |
| Chat | OK | -- | GOOD |
| Experiences | OK | -- | GOOD |
| ExperienceStats | -- | -- | **MISSING** |
| Footer | -- | `footer-consistency.spec.ts` | E2E-ONLY |
| Hiring | -- | -- | **MISSING** |
| Menu | OK | `menu-autoclose.spec.ts` | **FULL** |
| MenuFloating | OK (snapshot) | -- | GOOD |
| MenuFloatingClient | -- | -- | **MISSING** (logic component) |
| MobileMenuOverlay | -- | `menu-autoclose.spec.ts` | E2E-ONLY |
| NavBar | -- | `navigation.spec.ts` | E2E-ONLY |
| ProjectCard | OK (snapshot) | -- | GOOD |
| ProjectDetail | OK | -- | GOOD |
| Skills | OK | -- | GOOD |
| WordCloud | -- | -- | **MISSING** |

### 3.4 Atom & Molecule Summary

- **Atoms tested:** 14 files (buttons, links, texts, motion) — GOOD
- **Molecules tested:** 13 files — GOOD
- **Overlays tested:** 2 files (Floating a11y) — GOOD
- **Hooks tested:** 7 files — GOOD
- **Services tested:** 9 files — GOOD

---

## 4. Gaps Prioritized

### P1 — Critical (affects production safety)

| Gap | What to Add | Effort |
|-----|-------------|--------|
| `chatPanel` slice: no test | `src/state/slices/chatPanel/__tests__/slice.test.ts` | 30min |

### P2 — High (untested domains)

| Gap | What to Add | Effort |
|-----|-------------|--------|
| `content` domain: no tests | Schema test + query hook test | 1h |
| `customer` domain: no tests | Schema test + query hook test | 1h |
| `experience-stat` domain: no tests | Schema test + query hook test | 1h |
| `navigation-item` domain: no tests | Schema test + query hook test | 1h |
| `technology` domain: missing queries | Query hook test | 30min |
| `contact-point` domain: missing queries | Query hook test | 30min |

### P3 — Medium (organisms without unit tests)

| Gap | What to Add | Effort |
|-----|-------------|--------|
| Footer | Unit test (content rendering, links) | 1h |
| NavBar | Unit test (responsive behavior, links) | 1h |
| Biography | Unit test (content rendering) | 30min |
| ExperienceStats | Unit test (stat calculations) | 30min |
| WordCloud | Unit test (rendering, interactions) | 30min |
| Hiring | Unit test (CTA rendering) | 30min |
| MobileMenuOverlay | Unit test (open/close logic) | 30min |

### P4 — Low (nice to have)

| Gap | What to Add | Effort |
|-----|-------------|--------|
| Error path tests | Negative cases for API failures | 2-3h |
| `error.tsx` / `global-error.tsx` | Tests for error boundaries (after C1 implementation) | 1h |
| Coverage threshold | Configure Jest `coverageThreshold` in `jest.config.cjs` | 30min |

---

## 5. Redundancies & Legacy Issues

### Legacy Test Placement (2 files)
Two slice tests live in shared `__tests__/` instead of co-located directories:
- `src/state/slices/__tests__/menuPanel.slice.test.ts`
- `src/state/slices/__tests__/themeMode.slice.test.ts`

**Recommendation:** Low priority migration. Tests work fine, naming convention differs but no functional impact.

### Cross-Cutting a11y Tests
Two separate a11y test approaches exist:
1. `a11y-axe.test.tsx` — jest-axe with heavy component mocks
2. `Sections.a11y.test.tsx` — Section-level accessibility assertions
3. `Floating.a11y.test.tsx`, `FloatingMobile.a11y.test.tsx` — Overlay-specific a11y

**Overlap:** The jest-axe tests use extensive mocks that reduce their value. The section/overlay a11y tests are more targeted and valuable.

**Recommendation:** When adding new a11y tests, prefer targeted assertions over full-page jest-axe scans. Reserve jest-axe for integration-level checks with minimal mocking.

### Snapshot Tests
Only 2 components use snapshots: `MenuFloating`, `ProjectCard`. Snapshots are brittle for styling changes but useful for detecting unintended structural changes.

**Recommendation:** Keep existing snapshots but don't add new ones. Prefer explicit assertions.

---

## 6. Proposed Coverage Thresholds

Conservative initial targets (to be enforced in CI after gap remediation):

```javascript
// jest.config.cjs — proposed addition
coverageThreshold: {
  global: {
    branches: 40,
    functions: 50,
    lines: 50,
    statements: 45,
  },
  "./src/domains/": {
    branches: 60,
    functions: 70,
    lines: 70,
    statements: 65,
  },
  "./src/state/slices/": {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

**Rationale:** Start conservative, raise thresholds incrementally. Domain layer should have highest coverage since it contains business logic. Redux slices are simple and should approach full coverage.

---

## 7. Summary Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Unit test files | 93 | ~115 (+22 from P1-P3) |
| E2E test files | 21 | 21 (stable) |
| Domains fully tested | 2/11 | 7/11 |
| Redux slices tested | 4/5 | 5/5 |
| Organisms with unit tests | 11/19 | 18/19 |
| Total tests | 969 | ~1050 |
| Coverage thresholds | None | Global 50% |
