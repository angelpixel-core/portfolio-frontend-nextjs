# ADR-001: TypeScript and CI Foundation

**Date:** 2026-01-22
**Status:** Accepted
**Story:** 1.1 - Fundacion TypeScript y CI

## Context

This brownfield Next.js portfolio project needed TypeScript integration and a CI pipeline to ensure code quality. The codebase was JavaScript-only with path aliases configured via jsconfig.json.

## Decisions

### 1. TypeScript Strict Mode with allowJs

**Decision:** Enable `strict: true` with `allowJs: true` for incremental migration.

**Rationale:** Allows existing JavaScript files to continue working while new code benefits from strict type checking. Migration can happen file-by-file.

### 2. Legacy Peer Dependencies

**Decision:** Use `--legacy-peer-deps` flag for npm install.

**Rationale:** React 18 peer dependency conflicts exist with several packages (e.g., react-type-animation). This is pre-existing technical debt documented here rather than addressed in Story 1.1 (toolchain stabilization, not codebase sanitization).

**CI Impact:** `.github/workflows/ci.yml` uses `npm ci --legacy-peer-deps`

### 3. ESLint 8.x (Downgrade from 9.x)

**Decision:** Downgrade eslint from `^9.39.0` to `^8.57.0`.

**Rationale:** `eslint-config-next` is incompatible with ESLint 9.x. The upgrade path requires Next.js to release ESLint 9 compatible configuration.

### 4. Jest Types in tsconfig.json

**Decision:** Add `"types": ["jest", "node", "@testing-library/jest-dom"]` to tsconfig.json.

**Rationale:** Test files are written in TypeScript/TSX and need Jest type definitions to pass type checking.

### 5. Broken Domain Exports (Hygiene Fix)

**Decision:** Removed exports to non-existent `./components` and `./mutations` from 11 domain index.ts files.

**Rationale:** These were pre-existing broken exports causing 28 TypeScript errors. Fixing them is hygiene, not scope creep - they were never functional.

## Consequences

### Positive
- TypeScript strict mode catches errors early
- CI pipeline validates lint, types, and tests on every push to main/epic branches
- Path aliases work consistently between tsconfig.json and Jest

### Negative
- 4 test suites have pre-existing failures (documented in Known Test Debt section)
- Must use `--legacy-peer-deps` until dependency conflicts are resolved
- ESLint stuck at 8.x until eslint-config-next catches up

## Known Test Debt

The following test suites have failures unrelated to Story 1.1 (toolchain setup):

| Test File | Issue | Root Cause |
|-----------|-------|------------|
| `src/ui/overlays/__tests__/Floating.a11y.test.tsx` | `closeMock` never called | `jest.doMock` after import doesn't work |
| `src/ui/organisms/__tests__/Sections.a11y.test.tsx` | Section landmarks not found | Test expects landmarks that component doesn't render |
| `src/ui/organisms/MenuFloating/__tests__/MenuFloatingClient.test.tsx` | Navigation role not found | Floating panel doesn't render expected structure |
| `src/ui/organisms/Menu/__tests__/Menu.test.tsx` | Navigation links assertion | Query selector mismatch |

**Recommendation:** Create Story for test debt remediation separate from toolchain work.

## Files Changed

- `tsconfig.json` - Created with strict mode
- `package.json` - Added typecheck script, TS devDependencies, ESLint downgrade
- `.github/workflows/ci.yml` - Created CI pipeline
- `.eslintrc.json` - Added jest/browser/node/es2021 environments
- `jest.config.cjs` - Added setupFilesAfterEnv, moduleNameMapper
- `jest.setup.js` - Created with jest-dom import
- `src/domains/*/index.ts` - Removed broken exports (11 files)
- `src/state/adapters/redux/index.ts` - Created barrel export
- `src/state/adapters/zustand/store.ts` - Created placeholder
- `src/ui/molecules/model/schema.ts` - Created Education types
