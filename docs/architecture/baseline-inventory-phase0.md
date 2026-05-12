# Phase 0 Baseline Inventory

Date: 2026-05-12

## Goal

Establish a measurable baseline of alias imports, dependency hotspots, and likely boundary risks before structural refactors.

## Method

- Scanned `src/**/*.{ts,tsx,js,jsx}` for `from "@/..."` imports.
- Counted alias usage by prefix and exact import path.
- Estimated coarse layer-to-layer flows from current folder structure.
- Isolated presentation files that import `@/services/*` directly.

## Inventory Summary

- Total alias imports found: `933`

Top alias prefixes:

- `domains`: 194
- `atoms`: 193
- `lib`: 178
- `services`: 106
- `state`: 82
- `hooks`: 51
- `molecules`: 44
- `organisms`: 29

Top exact alias import paths:

- `@/lib/logger`: 49
- `@/services/analytics`: 27
- `@/lib/admin/getAdminSessionEmail`: 25
- `@/hooks/ui/useReducedMotion`: 23
- `@/lib/createQueryHook`: 18
- `@/atoms/hocs`: 15
- `@/lib/admin/requireAdmin`: 15

## Coarse Layer Flow Snapshot

Approximate flow counts (by source folder and alias prefix family):

- `presentation -> presentation`: 346
- `presentation -> shared_or_platform`: 157
- `presentation -> domain`: 155
- `presentation -> infrastructure`: 93
- `domain -> shared_or_platform`: 54

Notes:

- No direct `domain -> presentation` imports were found in this pass.
- `presentation -> infrastructure` appears mostly in API routes and event tracking calls.

## Hotspots

1. `@/lib/logger` is the most imported single alias target and has appeared in Vercel failures.
2. UI layers (`src/ui`) directly import `@/services/*` in multiple places.
3. API routes (`src/app/api`) heavily depend on `@/services/*`, which is expected but should remain consistent through stable module entrypoints.

UI files importing `@/services/*`: `36`

Representative examples:

- `src/ui/molecules/Resume/Button.tsx`
- `src/ui/organisms/TwoFactorSettings/index.tsx`
- `src/ui/organisms/ResumeRequest/ResumeRequestModal.tsx`
- `src/ui/organisms/ProjectCard/ActionLinks.tsx`

## Barrel Alias Usage

Root-level barrel aliases are present but low-volume:

- `@/providers`: 5
- `@/hooks`: 5
- `@/atoms`: 1
- `@/molecules`: 1
- `@/organisms`: 1
- `@/icons`: 1

## Baseline Risks

- High fan-out on `@/lib/logger` increases blast radius when path resolution breaks.
- Mixed responsibilities under `src/lib` blur boundaries (`shared`, `config`, observability, adapters).
- Direct UI imports from `@/services/*` create coupling pressure between presentation and infrastructure concerns.

## Phase 1 Preparation (Contract First)

1. Finalize and enforce the dependency matrix in lint rules.
2. Create a dedicated `observability` entrypoint and migrate logger imports incrementally.
3. Define which `@/services/*` modules are allowed in UI (likely analytics/intent-only), and route remaining cases through application/use-case adapters.
4. Keep `tsconfig` as the source of truth for alias resolution; avoid global bundler alias fallbacks.
