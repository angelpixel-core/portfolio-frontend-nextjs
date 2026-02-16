# Story 22.10: Lib, Shared, Barrels & Test — Batch J (Final)

Status: done

## Story

As a **developer maintaining this portfolio**,
I want **all 12 remaining JS/JSX files (lib utilities, shared skeletons, barrel re-exports, and test setup) migrated from JS/JSX to TS/TSX with proper type annotations**,
so that **the entire `src/` directory is 100% TypeScript, completing the migration objective of Epic 22 (AR1, AR2) and enabling strict type safety across the full codebase**.

## Acceptance Criteria

1. **AC1: File Rename** — All 12 files renamed via `git mv` (.js → .ts, .jsx → .tsx) with no broken imports or module resolution errors.
2. **AC2: Type Annotations** — Each file has explicit parameter types, return types, typed exports, and proper interfaces where applicable. No implicit `any`.
3. **AC3: No Behavior Change** — Zero functional changes. Same exports, same runtime behavior, same module resolution.
4. **AC4: Validation Suite** — All 4 commands pass with zero NEW failures:
   - `npm run lint` (zero new warnings)
   - `npm run typecheck` (zero new errors vs baseline)
   - `npm test` (all tests pass)
   - `npm run build` (zero new build failures)
5. **AC5: No Forbidden Patterns** — Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. No refactoring, no import path changes, no bug fixes.

## Tasks / Subtasks

- [x] **Task 1: Create branch and rename all 12 files** (AC: #1)
  - [x] 1.1 Create branch `migration/ts-batch-j-lib-shared` from epic
  - [x] 1.2 `git mv` all 7 lib `.js` files to `.ts`
  - [x] 1.3 `git mv` 2 shared files (`.js` → `.ts`, `.jsx` → `.tsx`)
  - [x] 1.4 `git mv` 2 barrel files (overlays, providers) `.js` → `.ts`
  - [x] 1.5 `git mv` test file `.test.js` → `.test.ts`
  - [x] 1.6 Verify no resolution errors: `npm run typecheck`
  - [x] 1.7 Commit: `refactor: rename Batch J files from .js/.jsx to .ts/.tsx`

- [x] **Task 2: Type lib utility files (7 files)** (AC: #2, #3, #5)
  - [x] 2.1 `lib/index.ts` — barrel, no changes needed (re-export only)
  - [x] 2.2 `lib/actions.ts` — type `prevState` and `formData: FormData`, return `Promise<void>`
  - [x] 2.3 `lib/utils.ts` — type `filePath`, `file`, `jsonData`, `tryQuery` with generics
  - [x] 2.4 `lib/suppressWarnings.ts` — type `args` spread, minimal changes
  - [x] 2.5 `lib/social-urls/index.ts` — create `SocialProvider` union type, type all functions
  - [x] 2.6 `lib/httpRequest/index.ts` — create `HttpRequestOptions` interface, type function
  - [x] 2.7 `lib/httpRequest/config.ts` — add explicit `string` types to constants

- [x] **Task 3: Type shared + barrel + test files (5 files)** (AC: #2, #3, #5)
  - [x] 3.1 `shared/skeletons/index.ts` — barrel, no changes needed
  - [x] 3.2 `shared/skeletons/skeletons.tsx` — add `import React`, return types
  - [x] 3.3 `overlays/index.ts` — barrel, no changes needed
  - [x] 3.4 `providers/index.ts` — barrel, no changes needed
  - [x] 3.5 `__tests__/typescript-setup.test.ts` — convert `require` to `import`, type variables

- [x] **Task 4: Commit types + validate** (AC: #4)
  - [x] 4.1 Commit: `feat(ts): add TypeScript annotations to Batch J — lib, shared, barrels, test`
  - [x] 4.2 Validation: lint, typecheck, tests, build

## Dev Notes

### Files to Migrate (12 files)

| # | File | Category | Export Pattern | Key Notes |
|---|------|----------|---------------|-----------|
| 1 | `src/lib/index.js` | Barrel | Named re-export | `export { default as httpRequest }` |
| 2 | `src/lib/actions.js` | Utility | Named export | `async function createUser(prevState, formData)` |
| 3 | `src/lib/utils.js` | Utility | Named exports | `"use server"`, `jsonData`, `tryQuery` |
| 4 | `src/lib/suppressWarnings.js` | Client | Empty export `{}` | `"use client"`, side-effect module |
| 5 | `src/lib/social-urls/index.js` | Utility | Named + default | 5 functions + constants, needs union type |
| 6 | `src/lib/httpRequest/index.js` | HTTP client | Default export | Needs `HttpRequestOptions` interface |
| 7 | `src/lib/httpRequest/config.js` | Config | Named exports | Constants only |
| 8 | `src/ui/shared/skeletons/index.js` | Barrel | Wildcard re-export | `export * from "./skeletons"` |
| 9 | `src/ui/shared/skeletons/skeletons.jsx` | React component | Named exports | 3 placeholder skeleton components |
| 10 | `src/ui/overlays/index.js` | Barrel | Named re-exports | `Floating`, `FloatingMobile` |
| 11 | `src/providers/index.js` | Barrel | Named re-export | `RootProvider` |
| 12 | `src/__tests__/typescript-setup.test.js` | Test | None | CommonJS `require`, Jest environment |

### Typing Patterns by Category

**Pattern 1: Barrel files (5 files — #1, #3 skeletons, #10, #11)**

Barrels only need rename. No content changes. Example:
```ts
// lib/index.ts — unchanged
export { default as httpRequest } from "./httpRequest";
```

**Pattern 2: `lib/actions.ts` — Server Action**

```ts
export async function createUser(
  prevState: unknown,
  formData: FormData
): Promise<void> {
  // ...unchanged logic...
}
```

Note: Most of the function body is commented out. Type only the active code paths.

**Pattern 3: `lib/utils.ts` — Server Utilities**

```ts
"use server";

import fs from "fs";
import path from "path";
import { logger } from "@/lib/logger";

const PATH = process.env.SOURCE_DATA_PATH;
const ENCODING = "utf-8" as const;

const filePath = (file: string): string => path.join(process.cwd(), PATH ?? "", `${file}.json`);
const file = async (name: string): Promise<string> => await fs.readFileSync(filePath(name), ENCODING);
const jsonData = async (src: string): Promise<unknown> => await file(src).then((raw) => JSON.parse(raw));

const tryQuery = async <T>(query: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await query();
  } catch (error) {
    logger.error("Database", "Query failed", error);
  }
};

export { jsonData, tryQuery };
```

IMPORTANT: `file()` uses `readFileSync` inside an `async` function. This is existing behavior — DO NOT change it (migration rule: no bug fixes). TypeScript will type it correctly as `Promise<string>`.

IMPORTANT: `PATH` from `process.env` can be `undefined`. Use `PATH ?? ""` to satisfy strict null checks without changing behavior.

**Pattern 4: `lib/suppressWarnings.ts` — Client Side-Effect Module**

```ts
"use client";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalWarn = console.warn;

  console.warn = (...args: unknown[]): void => {
    const message = args[0];
    // ...unchanged filter logic...
    originalWarn.apply(console, args as Parameters<typeof console.warn>);
  };
}

export {};
```

**Pattern 5: `lib/social-urls/index.ts` — Union-Typed Utility**

```ts
type SocialProvider = "linkedin" | "github" | "twitter" | "dribbble" | "telegram" | "whatsapp" | "calendly" | "email";

const SOCIAL_BASE_URLS: Record<SocialProvider, string> = { ... };
const PROVIDER_ENV_VARS: Record<SocialProvider, string> = { ... };

export const getIdentifier = (provider: SocialProvider): string | null => { ... };
export const buildSocialUrl = (provider: SocialProvider, identifier?: string | null): string | null => { ... };
export const getSocialUrl = (provider: SocialProvider): string | null => { ... };
export const getAllSocialUrls = (): Partial<Record<SocialProvider, string>> => { ... };
export const isProviderConfigured = (provider: SocialProvider): boolean => { ... };
```

IMPORTANT: `getAllSocialUrls` returns `Partial<Record<SocialProvider, string>>` because only configured providers are included. Current code builds an empty object and adds keys conditionally.

IMPORTANT: Keep the `default` export at the bottom (object with all functions). Do NOT change export pattern.

**Pattern 6: `lib/httpRequest/index.ts` — HTTP Client**

```ts
interface HttpRequestOptions {
  token?: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

const httpRequest = async (
  endpoint: string,
  api_url: string = API_URL,
  options: HttpRequestOptions = {}
): Promise<unknown> => {
  // ...unchanged logic...
};

export default httpRequest;
```

NOTE: Return type is `Promise<unknown>` (not `any`) — callers should cast/validate the response. Do NOT add generics `<T>` since that changes the API signature.

**Pattern 7: `lib/httpRequest/config.ts` — Constants**

```ts
export const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";
export const BASE_HOST: string = IS_PRODUCTION
  ? process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost"
  : "http://localhost";
export const BACKEND_PORT: string | number = process.env.NEXT_PUBLIC_BACKEND_PORT || 8000;
export const API_VERSION: string = "v1";

export const BASE_URL: string = `${BASE_HOST}:${BACKEND_PORT}`;
export const PATH_URL: string = "site";
export const API_URL: string = `${BASE_URL}/api/${API_VERSION}/${PATH_URL}`;
```

IMPORTANT: `BASE_HOST` uses `process.env` which returns `string | undefined`. Add `?? "http://localhost"` to satisfy strict null checks.

**Pattern 8: `shared/skeletons/skeletons.tsx` — React Placeholders**

```tsx
import React from "react";

export const MenuResponsiveSkeleton = (): React.JSX.Element => {
  return <div>MenuResponsiveSkeleton</div>;
};

export const ArticleSkeleton = (): React.JSX.Element => {
  return <div>ArticleSkeleton</div>;
};

export const FeaturedArticleSkeleton = (): React.JSX.Element => {
  return <div>FeaturedArticleSkeleton</div>;
};
```

**Pattern 9: `__tests__/typescript-setup.test.ts` — Jest Test**

```ts
/**
 * @jest-environment node
 */
import fs from "fs";
import path from "path";

describe("TypeScript Setup", () => {
  const rootDir: string = path.resolve(__dirname, "../..");
  // ...unchanged test logic with typed variables...
});
```

Convert `require` to `import` for ES module consistency. Type intermediate variables (`tsconfig`, `packageJson`) as `Record<string, unknown>` or more specific interfaces.

### Export Pattern Diversity (CRITICAL)

| Pattern | Files |
|---------|-------|
| Named re-exports (barrel) | lib/index, skeletons/index, overlays/index, providers/index |
| Named exports | actions, utils, httpRequest/config, social-urls, skeletons.tsx |
| Default export | httpRequest/index |
| Named + Default exports | social-urls/index |
| Empty export `{}` | suppressWarnings |
| Wildcard re-export | skeletons/index (`export * from`) |

**Preserve each pattern exactly.** Do NOT change export styles.

### Story 22-1 through 22-9 Learnings (CRITICAL)

1. **`import React from "react"` IS NEEDED** for `.tsx` files using `React.JSX.Element`
2. **Commit strategy**: First commit = renames only via `git mv`, second commit = type annotations
3. **Jest cache**: After rename, run `npm test -- --no-cache` if tests fail with "Cannot find module"
4. **Pre-existing typecheck errors**: Errors not introduced by this batch are baseline, NOT scope
5. **`"use client"` / `"use server"` directives**: MUST remain as first line where present
6. **Prettier line length**: If types exceed 80 chars, expand to multiline format
7. **Default className = ""**: Add default for optional className to prevent "undefined" in DOM
8. **Barrel files**: Rename only, DO NOT change re-export content (Epic 23)
9. **`process.env` strict null**: Environment variables are `string | undefined`. Add `?? fallback` where used in expressions that TypeScript flags

### Anti-Patterns to Avoid

- Do NOT add `React.FC` or `React.FunctionComponent` — use explicit arrow functions
- Do NOT use `any` — use `unknown` for truly unknown types
- Do NOT change barrel file re-exports — that's Epic 23
- Do NOT fix the `async readFileSync` pattern in `utils.ts` — that's a separate concern
- Do NOT add generics `<T>` to `httpRequest` return — that changes the API
- Do NOT change `require()` to `import` in the test file if it causes jest-environment issues (test with `--no-cache`)
- Do NOT change import paths from barrel to direct — that's Epic 23

### Recommended Task Execution Order

1. **Rename all 12 files** → commit
2. **Barrel files** (5 files — trivial, no content changes)
3. **Config + constants** (config.js — simple typing)
4. **Utility files** (actions, utils, suppressWarnings — moderate)
5. **social-urls** (most complex — needs SocialProvider union type)
6. **httpRequest** (needs HttpRequestOptions interface)
7. **skeletons.tsx** (React components — add import React + return types)
8. **Test file** (convert require → import, type variables)
9. **Validate + commit**

### Commit Strategy

Per `docs/architecture/typescript-migration.md` Section 4:
1. **First commit**: File renames only (`git mv`)
2. **Second commit**: Type annotations added
3. Branch: `migration/ts-batch-j-lib-shared`

### Impact — Migration Completion

After this batch:
- **ALL 170 files** migrated from JS/JSX to TS/TSX (AR1 complete)
- **Zero .js/.jsx files** remaining in `src/`
- **Epic 22 fully complete** — ready for retrospective
- Next epic: Epic 23 (Barrel File Cleanup)

### References

- [Source: docs/architecture/typescript-migration.md#P6: Lib + Utilities] — Batch J lib file list
- [Source: docs/architecture/typescript-migration.md#P7: Shared + Barrels + Test] — Batch J shared/barrel/test file list
- [Source: docs/architecture/typescript-migration.md#3. Migration Rules] — DO/DO NOT rules
- [Source: docs/architecture/typescript-migration.md#4. Batch Definitions] — Batch J definition, commit strategy, ACs
- [Source: _bmad-output/implementation-artifacts/22-9-icons.md] — Story 22-9 learnings
- [Source: CLAUDE.md#Performance Anti-pattern] — Barrel import rules (Epic 23)
- [Source: _bmad-output/planning-artifacts/epics-v4.md#Epic 22] — Epic scope and requirements

## Senior Developer Review (AI)

**Outcome:** Approve (after fixes applied)  
**Date:** 2025-02-15

**Action Items (all resolved):**

- [x] [MEDIUM] config.ts: BASE_HOST used cast when NEXT_PUBLIC_API_HOST unset → runtime "undefined:8000". Use `?? "http://localhost"` per Dev Notes. [src/lib/httpRequest/config.ts]
- [x] [LOW] suppressWarnings: Add `args as Parameters<typeof console.warn>` for apply() per Dev Notes. [src/lib/suppressWarnings.ts]
- [x] [LOW] utils tryQuery: Explicit `return undefined` in catch for clarity. [src/lib/utils.ts]
- [x] [LOW] typescript-setup.test.ts: Type tsconfig/packageJson as Record<string, unknown> (no implicit any from JSON.parse). [src/__tests__/typescript-setup.test.ts]
- [x] [LOW] Dev Agent Record: Agent Model Used left blank (documentation gap; no code change).

**Git vs Story:** No discrepancies. File List matches commits (12 renames + tsconfig).

## Dev Agent Record

### Agent Model Used

—

### Debug Log References

### Completion Notes List

- Batch J complete: 12 files renamed (git mv), types added per Dev Notes. lib: actions (prevState, FormData, Promise<void>), utils (filePath, file, jsonData, tryQuery<T>), suppressWarnings (args: unknown[]), social-urls (SocialProvider union, Record types, string | SocialProvider for callers), httpRequest (HttpRequestOptions, endpoint/api_url/options typed), config (explicit string types). shared/skeletons: React import + JSX.Element return types. Barrels (lib/index, shared/skeletons/index, overlays, providers): rename only. typescript-setup.test.ts: require→import, typed callback. tsconfig.json: @/providers path updated to index.ts. All ACs met: lint, typecheck, tests (987), build pass.
- Code review (AI): 1 MEDIUM + 4 LOW found. All fixed: config.ts BASE_HOST use `?? "http://localhost"` (strict null + runtime); suppressWarnings apply cast per Dev Notes; utils tryQuery explicit `return undefined` in catch; typescript-setup.test.ts tsconfig/packageJson typed as Record<string, unknown>. Lint/typecheck pass after fixes.

### File List

- src/lib/index.ts (renamed, barrel)
- src/lib/actions.ts (renamed, typed)
- src/lib/utils.ts (renamed, typed)
- src/lib/suppressWarnings.ts (renamed, typed)
- src/lib/social-urls/index.ts (renamed, typed)
- src/lib/httpRequest/index.ts (renamed, typed)
- src/lib/httpRequest/config.ts (renamed, typed)
- src/ui/shared/skeletons/index.ts (renamed, barrel)
- src/ui/shared/skeletons/skeletons.tsx (renamed, typed)
- src/ui/overlays/index.ts (renamed, barrel)
- src/providers/index.ts (renamed, barrel)
- src/__tests__/typescript-setup.test.ts (renamed, typed)
- tsconfig.json (path @/providers → index.ts)
