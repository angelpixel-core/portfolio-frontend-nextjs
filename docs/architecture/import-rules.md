# Barrel File & Import Path Rules

> Epic 20 — Component & Style Architecture (Story 20.5)
> Prevents bundle contamination and ensures tree-shaking by defining when barrel files are appropriate and how to structure imports.

---

## 1. Barrel File Decision Matrix

### When Barrel Files Are Safe

| Condition | Rationale |
|-----------|-----------|
| < 10 named exports | Small surface area, minimal tree-shaking impact |
| Server-side only consumption | No client bundle impact |
| Named `export { X }` pattern | Explicit, auditable exports |
| Domain model/queries barrels | Consumed via React Query hooks on server boundary |

### When Barrel Files Are Prohibited

| Condition | Rationale |
|-----------|-----------|
| > 15 exports | Pulls too many modules into any importing chunk |
| UI/App layer consumption | Client bundle directly affected |
| `export * from` pattern | Uncontrolled export surface, prevents dead code elimination |
| Cascading re-exports | Barrel importing from other barrels multiplies the problem |

### Decision Flowchart

```
Does this module have an index.ts/js that re-exports?
  │
  ├── YES → How many exports?
  │         │
  │         ├── < 10 → Named exports only? (no export *)
  │         │          │
  │         │          ├── YES → Is it consumed in src/ui/ or src/app/?
  │         │          │          │
  │         │          │          ├── YES → ⚠️ PROHIBITED by ESLint rule
  │         │          │          │         Use direct path: @/atoms/buttons/ThemeButton
  │         │          │          │
  │         │          │          └── NO → ✅ ALLOWED (server-side, hooks internal, state internal)
  │         │          │
  │         │          └── NO (uses export *) → ⛔ AVOID — convert to named exports
  │         │
  │         └── >= 10 → ⛔ PROHIBITED — use direct imports only
  │
  └── NO → ✅ No barrel file needed — direct imports are the default
```

---

## 2. Icons Barrel Case Study

### The Problem

`src/ui/atoms/icons/index.js` re-exports **57 icon components** via named exports:

```javascript
// src/ui/atoms/icons/index.js (57 exports)
export { default as GitHubIcon } from "./GitHubIcon";
export { default as LinkedInIcon } from "./LinkedInIcon";
export { default as ReactIcon } from "./ReactIcon";
// ... 54 more exports
```

Any component importing from this barrel pulled **all 57 icons** into its chunk, regardless of how many it actually used.

### Bundle Impact

| Metric | Before (barrel imports) | After (direct imports) |
|--------|------------------------|----------------------|
| Chunk 514 (icons) | ~50 KiB gzip | **Eliminated** |
| Tree-shaking | Defeated — all 57 icons loaded | Effective — only used icons loaded |
| Import pattern | `import { GitHubIcon } from "@/icons"` | `import GitHubIcon from "@/atoms/icons/GitHubIcon"` |

### Resolution

1. **Refactored all imports** from barrel (`@/icons`) to direct paths (`@/atoms/icons/GitHubIcon`)
2. **Added ESLint rule** (`no-barrel-imports-in-ui`) to prevent regression
3. **Barrel file preserved** but has zero consumers — candidate for deprecation in future cleanup

### Current State

```
src/ui/atoms/icons/index.js
├── 57 named exports
├── 0 consumers (verified via codebase grep)
└── Protected by ESLint rule (error severity)
```

### Lesson Learned

Barrel files with large export counts are a **silent performance killer**. They look convenient (`import { X } from "@/icons"`) but webpack cannot tree-shake named re-exports from barrel files effectively in client bundles.

---

## 3. Import Alias Reference

### Complete Alias Table (from `tsconfig.json`)

#### Direct Path Aliases (Safe — No Barrel)

| Alias | Maps To | Usage |
|-------|---------|-------|
| `@/app/*` | `src/app/*` | App Router pages and layouts |
| `@/domains/*` | `src/domains/*` | Domain model and query imports |
| `@/styles/*` | `src/styles/*` | Global and shared styles |
| `@/lib/*` | `src/lib/*` | Utility libraries |
| `@/services/*` | `src/services/*` | External service integrations |
| `@/shared/*` | `src/ui/shared/*` | Shared UI components |
| `@/atoms/*` | `src/ui/atoms/*` | Atom components by direct path |
| `@/buttons/*` | `src/ui/atoms/buttons/*` | Button atoms by direct path |
| `@/icons/*` | `src/ui/atoms/icons/*` | Icon atoms by direct path |
| `@/links/*` | `src/ui/atoms/links/*` | Link atoms by direct path |
| `@/texts/*` | `src/ui/atoms/texts/*` | Text atoms by direct path |
| `@/molecules/*` | `src/ui/molecules/*` | Molecules by direct path |
| `@/organisms/*` | `src/ui/organisms/*` | Organisms by direct path |
| `@/overlays/*` | `src/ui/overlays/*` | Overlays by direct path |
| `@/hooks/*` | `src/hooks/*` | Hooks by direct path |
| `@/providers/*` | `src/providers/*` | Providers by direct path |
| `@/state/*` | `src/state/*` | State modules by direct path |
| `@/conf/*` | `src/config/*` | Configuration files |
| `@/images/*` | `public/images/*` | Static image assets |
| `@/test-utils/*` | `src/test-utils/*` | Test utilities |

#### Barrel Aliases (Resolve to Index Re-export Files)

| Alias | Maps To | Exports | ESLint Protected |
|-------|---------|---------|-----------------|
| `@/atoms` | `src/ui/atoms/index.ts` | 7 `export *` + 1 named | Yes |
| `@/buttons` | `src/ui/atoms/buttons/index.ts` | 11 named | Yes |
| `@/icons` | `src/ui/atoms/icons/index.ts` | 57 named | Yes |
| `@/links` | `src/ui/atoms/links/index.ts` | 6 named | Yes |
| `@/texts` | `src/ui/atoms/texts/index.ts` | 5 named | Yes |
| `@/molecules` | `src/ui/molecules/index.ts` | 25 named | Yes |
| `@/organisms` | `src/ui/organisms/index.ts` | 20 named | Yes |
| `@/overlays` | `src/ui/overlays/index.ts` | 2 named | Yes |
| `@/hooks` | `src/hooks/index.ts` | 24 named re-exports | Yes |
| `@/providers` | `src/providers/index.ts` | 1 named | No |

> **Note:** `@/hooks` and `@/providers` have dual aliases in `tsconfig.json` — the bare form (e.g., `@/hooks`) resolves to the barrel index, while the wildcard form (e.g., `@/hooks/*`) resolves to direct sub-paths. Both appear in the Direct Path table above as wildcard aliases. Always prefer the wildcard form in UI/App layers.

### Import Pattern Rules

```typescript
// GOOD — direct path with alias (tree-shaking safe)
import GitHubIcon from "@/atoms/icons/GitHubIcon";
import ThemeButton from "@/atoms/buttons/ThemeButton";
import Experience from "@/molecules/Experience";
import NavBar from "@/organisms/NavBar";
import useProfile from "@/hooks/domains/useProfile";

// BAD — barrel import (defeats tree-shaking, blocked by ESLint in UI/App)
import { GitHubIcon } from "@/icons";       // ESLint error
import { ThemeButton } from "@/buttons";     // ESLint error
import { Experience } from "@/molecules";    // ESLint error
import { NavBar } from "@/organisms";        // ESLint error
import { useProfile } from "@/hooks";        // ESLint error
```

---

## 4. ESLint Enforcement

### Custom Rule: `no-barrel-imports-in-ui`

**File:** `eslint-rules/no-barrel-imports-in-ui.js`

| Property | Value |
|----------|-------|
| Rule name | `rulesdir/no-barrel-imports-in-ui` |
| Severity | `error` (blocks CI pipeline) |
| Scope | `src/ui/**/*` and `src/app/**/*` |
| Plugin | `eslint-plugin-rulesdir` (local rules directory) |

### Protected Barrel Paths (9 total)

```javascript
// .eslintrc.js — overrides[0]
{
  files: ["src/ui/**/*", "src/app/**/*"],
  rules: {
    "rulesdir/no-barrel-imports-in-ui": ["error", {
      barrelPaths: [
        "@/atoms",       // src/ui/atoms/index.ts — 7 wildcard + 1 named
        "@/buttons",     // src/ui/atoms/buttons/index.ts — 11 named
        "@/icons",       // src/ui/atoms/icons/index.ts — 57 named
        "@/links",       // src/ui/atoms/links/index.ts — 6 named
        "@/texts",       // src/ui/atoms/texts/index.ts — 5 named
        "@/molecules",   // src/ui/molecules/index.ts — 25 named
        "@/organisms",   // src/ui/organisms/index.ts — 20 named
        "@/overlays",    // src/ui/overlays/index.ts — 2 named
        "@/hooks",       // src/hooks/index.ts — 24 named re-exports
      ],
    }],
  },
}
```

### How the Rule Works

1. Checks `ImportDeclaration` nodes in AST
2. Matches import source **exactly** against barrel paths (e.g., `@/icons` matches, `@/icons/GitHubIcon` does not)
3. Allows side-effect imports (`import "@/molecules"`) — no specifiers means no tree-shaking risk
4. Reports error with fix suggestion pointing to direct path

### Error Message

```
Barrel import from '@/icons' harms tree-shaking. Use a direct path import
instead (e.g., '@/icons/ComponentName' not '@/icons'). See ADR-003.
```

### Unprotected Layers

The ESLint rule only applies to `src/ui/**/*` and `src/app/**/*`. Other layers can still use barrel imports:

| Layer | ESLint Rule | Status | Risk |
|-------|-------------|--------|------|
| `src/ui/**/*` | Yes | Protected | — |
| `src/app/**/*` | Yes | Protected | — |
| `src/hooks/**/*` | No | Unprotected | LOW — hooks are internal, consumed by UI via direct paths |
| `src/state/**/*` | No | Unprotected | LOW — state is internal |
| `src/domains/**/*` | No | Unprotected | LOW — server-side primarily |
| `src/services/**/*` | No | Unprotected | LOW — service layer |
| `src/lib/**/*` | No | Unprotected | LOW — utility layer |

**Rationale:** The ESLint rule targets UI and App layers because those layers produce client-side JavaScript bundles where tree-shaking matters most. Internal layers (hooks, state, domains) are consumed indirectly through specific imports and don't produce standalone client chunks.

---

## 5. Migration Patterns

### Before / After: Icon Import

```typescript
// BEFORE — barrel import (chunk 514, ~50 KiB)
import { GitHubIcon, LinkedInIcon } from "@/icons";

// AFTER — direct imports (only used icons bundled)
import GitHubIcon from "@/atoms/icons/GitHubIcon";
import LinkedInIcon from "@/atoms/icons/LinkedInIcon";
```

### Before / After: Molecule Import

```typescript
// BEFORE — barrel import (pulls 25 components)
import { Experience, Education } from "@/molecules";

// AFTER — direct imports (only 2 components bundled)
import Experience from "@/molecules/Experience";
import Education from "@/molecules/Education";
```

### Before / After: Organism Import

```typescript
// BEFORE — barrel import (pulls 20 exports including ArticleCard variants)
import { NavBar, Footer } from "@/organisms";

// AFTER — direct imports
import NavBar from "@/organisms/NavBar";
import Footer from "@/organisms/Footer";
```

### Cascading Wildcard Problem

The `@/atoms` barrel demonstrates the cascading problem:

```typescript
// src/ui/atoms/index.ts
export * from "./buttons";   // → 11 exports
export * from "./hocs";      // → 4 exports
export * from "./icons";     // → 57 exports
export * from "./links";     // → 6 exports
export * from "./motion";    // → 1 export
export * from "./shadows";   // → 2 exports
export * from "./texts";     // → 5 exports
export { ArticleHoverThumbnail } from "./ArticleHoverThumbnail";
// TOTAL: 87+ exports from a single import!
```

Importing anything from `@/atoms` pulls the **entire atom layer** into the chunk because `export *` prevents tree-shaking at the barrel level.

### Domain Barrel Pattern

Domain barrels use `export * from` to combine model and queries:

```typescript
// src/domains/profile/index.ts
export * from "./model";     // Profile type, schema, fetchAll, fetchById
export * from "./queries";   // useProfile, useProfiles
```

**Risk:** Importing the `Profile` type from `@/domains/profile` also loads the entire query module. For new code, prefer direct sub-path imports:

```typescript
// PREFERRED — import only what you need
import type { Profile } from "@/domains/profile/model/schema";
import useProfile from "@/domains/profile/queries/useProfile";

// ACCEPTABLE — domain barrel (acceptable for server components)
import { Profile, useProfile } from "@/domains/profile";
```

### Adding New Components

When creating new components, always use direct exports:

```typescript
// src/ui/atoms/buttons/NewButton/index.tsx
export default function NewButton({ label }: NewButtonProps) {
  return <button>{label}</button>;
}

// Consumer — always use direct path
import NewButton from "@/atoms/buttons/NewButton";

// NEVER add to barrel file (src/ui/atoms/buttons/index.ts)
// export { default as NewButton } from "./NewButton";  // DON'T DO THIS
```

---

## 6. Current State Metrics

### Barrel File Inventory

| Category | Files | Dominant Pattern | Largest Barrel |
|----------|-------|-----------------|----------------|
| UI Atoms | 8 | Named `export { default as X }` | icons (57 exports) |
| UI Molecules | 1 | Named `export { default as X }` | molecules (25 exports) |
| UI Organisms | 1 | Named `export { default as X }` | organisms (20 exports) |
| UI Overlays | 1 | Named `export { default as X }` | overlays (2 exports) |
| Domains | ~24 | `export * from` | Per-domain (model + queries) |
| Hooks | 5 | Named re-exports | hooks root (24 named) |
| State | 6 | Named re-exports | state root (52 named) |
| Other (lib, providers, services) | ~10 | Varied | Small (1-3 exports) |
| **Total** | **~56** | — | icons (57) |

> **Counting methodology:** This table counts module-level re-export barrels (index files whose primary purpose is aggregating exports from sub-modules). Single-component entry points (e.g., `state/slices/chatPanel/index.ts`) are excluded. Total index files in `src/` including component entry points: ~74.

### Barrel Import Compliance

| Layer | Direct Imports | Barrel Imports | Compliance |
|-------|---------------|----------------|------------|
| `src/ui/**/*` | 174+ | 0 | **100%** |
| `src/app/**/*` | Verified | 0 | **100%** |

### Next.js Optimization Config

```javascript
// next.config.js
experimental: {
  optimizePackageImports: [
    "framer-motion",
    "@tanstack/react-query",
    "zod",
    "immer",
  ],
}
```

`optimizePackageImports` applies to **external packages only**. Internal barrel files are not covered — the ESLint rule is the enforcement mechanism for internal imports.

---

## 7. Anti-patterns & Risk Zones

### Anti-pattern 1: `export *` Cascading

```typescript
// ANTI-PATTERN — cascading wildcards
// src/ui/atoms/index.ts
export * from "./buttons";   // re-exports everything from buttons barrel
export * from "./icons";     // re-exports all 57 icons
// → Single import from @/atoms loads 88+ modules
```

**Why it's dangerous:** Each `export *` forwards ALL exports from the target module. When barrels import from other barrels, the export surface multiplies uncontrollably.

### Anti-pattern 2: Barrel Import in UI Layer

```typescript
// ANTI-PATTERN — importing from barrel in component
import { Hero, Title, Paragraph } from "@/molecules";
// → Loads 25 molecules even though only 3 are used
```

**Fix:** Always use direct path imports in `src/ui/` and `src/app/`:

```typescript
import Hero from "@/molecules/Hero";
import Title from "@/molecules/Title";
import Paragraph from "@/molecules/Paragraph";
```

### Anti-pattern 3: Adding Exports to Large Barrels

```typescript
// ANTI-PATTERN — growing a barrel beyond 15 exports
// src/ui/atoms/buttons/index.ts (already 11 exports)
export { default as NewButton } from "./NewButton";     // DON'T — approaching threshold
```

**Rule:** If a barrel already has > 10 exports, do not add more. Use direct imports instead.

### Risk Zone: Hooks Barrel Chain — RESOLVED (Story 23.3)

Hooks root barrel converted from 4 `export *` to 24 explicit named re-exports. No more cascading.

### Risk Zone: State Barrel Chain — RESOLVED (Story 23.3)

State root barrel converted from 3 `export *` to explicit named re-exports. All 4 slice barrels (authPanel, chatPanel, menuPanel, themeMode) also converted from `export * from "./slice"` to explicit named exports.

### Risk Zone: Domain Barrels — ACCEPTABLE

```typescript
// src/domains/article/index.ts
export * from "./model";     // Article type + schema + fetchAll + fetchById + filtering
export * from "./queries";   // useArticle + useArticles + useArticleBySlug
```

Domain barrels use `export *` but this is acceptable because:
- Domains are consumed via hooks, not directly in UI components
- Each domain has < 10 exports (model + queries)
- DDD pattern: model + queries are the complete public API
- No tree-shaking impact on client bundles

For type-only imports, prefer the direct schema path:

```typescript
import type { Article } from "@/domains/article/model/schema";
```

---

## 8. Safe Barrels List (Epic 23)

Barrels documented as safe and allowed in the codebase:

### Hooks Layer (`src/hooks/`)

| Barrel | Exports | Pattern | Status |
|--------|---------|---------|--------|
| `src/hooks/index.ts` | 24 | Named re-exports | Safe (ESLint-protected in UI/App) |
| `src/hooks/store/index.ts` | 2 | Named defaults | Safe |
| `src/hooks/ui/index.ts` | 4 | Named exports | Safe |
| `src/hooks/domains/index.ts` | 15 | Named re-exports | Safe |
| `src/hooks/auth/index.ts` | 3 | Named defaults | Safe |

### State Layer (`src/state/`)

| Barrel | Exports | Pattern | Status |
|--------|---------|---------|--------|
| `src/state/index.ts` | ~55 | Named re-exports | Safe (no `export *`) |
| `src/state/stores/index.ts` | 3 | Named + types | Safe |
| `src/state/providers/index.ts` | 5 | Named defaults | Safe |
| `src/state/slices/index.ts` | ~35 | Named re-exports | Safe (no `export *`) |
| `src/state/slices/*/index.ts` | 5-14 | Named exports | Safe (no `export *`) |

### Lib Layer (`src/lib/`)

| Barrel | Exports | Pattern | Status |
|--------|---------|---------|--------|
| `src/lib/index.ts` | 1 | Named default | Safe |
| `src/lib/seo/index.ts` | 3 | Named exports | Safe |
| `src/lib/httpRequest/index.ts` | 1 | Default | Safe |
| `src/lib/social-urls/index.ts` | 8 | Named + default | Safe (cohesive module) |

### Other Layers

| Barrel | Exports | Pattern | Status |
|--------|---------|---------|--------|
| `src/providers/index.ts` | 1 | Named default | Safe |
| `src/services/auth/index.ts` | mixed | `export *` (types/mocks) + named | Acceptable — exception: `export *` re-exports type definitions and mock data only; no runtime module surface risk; not consumed in UI/App layer |
| `src/domains/*/index.ts` | < 10 each | `export *` (DDD pattern) | Acceptable |
| `src/ui/shared/skeletons/index.ts` | 3 | Named exports | Safe |

---

## 9. Barrel Cleanup Playbook (Epic 23)

> Step-by-step guide for detecting, evaluating, and migrating barrel files. Based on lessons from Epic 23 (Stories 23.1–23.4).

### 9.1 How to Detect Prohibited Barrels

**Automated tools:**

1. **ESLint rule** — catches barrel imports in `src/ui/` and `src/app/`:
   ```bash
   npm run lint
   # Error: Barrel import from '@/icons' harms tree-shaking.
   ```

2. **Audit script** — lists all barrel files with classification:
   ```bash
   npm run audit:barrels
   # Shows: File | Exports | E* count | Type | Status
   # Status: "safe" (named only) or "candidate" (has export *)
   ```

3. **Manual grep** — find `export *` in barrel files:
   ```bash
   grep -rn "export \*" src/**/index.ts
   ```

### 9.2 Migration Guide (Step by Step)

**Goal:** Convert a barrel from `export *` to named re-exports (or eliminate it).

**Step 1: Identify the barrel and its exports**

```bash
npm run audit:barrels   # Find barrels with status "candidate"
```

**Step 2: List all exports from the barrel source modules**

```bash
# Example: migrating src/hooks/index.ts
grep -n "^export" src/hooks/store/index.ts
grep -n "^export" src/hooks/ui/index.ts
grep -n "^export" src/hooks/domains/index.ts
```

**Step 3: Replace `export *` with explicit named exports**

```typescript
// BEFORE (wildcard — cascading risk)
export * from "./store";
export * from "./ui";
export * from "./domains";

// AFTER (named — auditable, tree-shakeable)
export { useAppDispatch, useAppSelector } from "./store";
export { useIsMobile, useIsTablet, useBreakpoint, useScrollPosition } from "./ui";
export { useProfile, useProjects, useArticles } from "./domains";
```

**Step 4: Verify no consumers break**

```bash
npm run typecheck   # Catch missing exports
npm test            # Verify test coverage
npm run build       # Ensure production build works
```

**Step 5: Update documentation**

- Update export counts in `import-rules.md` sections 3, 6, and 8
- Update `folder-structure.md` barrel aliases table
- Re-run `npm run audit:barrels` to confirm the barrel now shows "safe"

### 9.3 Understanding ESLint Errors

**Error format:**

```
error  Barrel import from '@/icons' harms tree-shaking. Use a direct path import
instead (e.g., '@/icons/ComponentName' not '@/icons'). See ADR-003.
  rulesdir/no-barrel-imports-in-ui
```

**What it means:** You're importing from a barrel file's root path (e.g., `@/icons`) inside `src/ui/` or `src/app/`. This pulls all re-exports into the chunk.

**How to fix:**

| Before (error) | After (fixed) |
|-----------------|---------------|
| `import { GitHubIcon } from "@/icons"` | `import GitHubIcon from "@/atoms/icons/GitHubIcon"` |
| `import { ThemeButton } from "@/buttons"` | `import ThemeButton from "@/atoms/buttons/ThemeButton"` |
| `import { Experience } from "@/molecules"` | `import Experience from "@/molecules/Experience"` |
| `import { NavBar } from "@/organisms"` | `import NavBar from "@/organisms/NavBar"` |
| `import { useProfile } from "@/hooks"` | `import useProfile from "@/hooks/domains/useProfile"` |

**Key distinction:** The rule triggers on exact barrel path matches. Sub-path imports (e.g., `@/icons/GitHubIcon`) are always allowed.

### 9.4 Cleanup Checklist

When converting a barrel file, follow this checklist:

- [ ] Run `npm run audit:barrels` — identify barrel type and export count
- [ ] Grep for all `export *` lines in the barrel
- [ ] For each `export *`, enumerate the actual exports from the source module
- [ ] Replace `export *` with explicit `export { name1, name2 }` from each source
- [ ] Run `npm run typecheck` — verify all consumers still resolve
- [ ] Run `npm test` — verify no test regressions
- [ ] Run `npm run lint` — verify no ESLint violations
- [ ] Run `npm run build` — verify production build succeeds
- [ ] Update barrel counts in `docs/architecture/import-rules.md` (sections 3, 6, 8)
- [ ] Update barrel counts in `docs/architecture/folder-structure.md`
- [ ] Re-run `npm run audit:barrels` — confirm barrel now shows "safe"

### 9.5 When to Keep a Barrel (Decision Criteria)

Not all barrels need elimination. Use this decision guide:

| Keep the barrel if... | Action |
|----------------------|--------|
| < 10 named exports, no `export *` | Keep — low risk, convenient API |
| Server-side only (domains, services) | Keep — no client bundle impact |
| `export *` with < 5 exports and server-only | Acceptable, but prefer named |
| Internal aggregation (hooks root, state root) | Keep — ESLint blocks UI consumption |

| Eliminate or convert if... | Action |
|---------------------------|--------|
| > 15 exports | Convert to named or eliminate |
| `export *` in UI layer | Convert immediately |
| Consumed in `src/ui/` or `src/app/` | Eliminate — use direct paths |
| Cascading (`export *` from another barrel) | Convert to named exports |

**Domains exception:** Domain barrels (`src/domains/*/index.ts`) use `export *` but are acceptable because they have < 10 exports each and are consumed via hooks, not directly in UI.

---

## Cross-References

- **Folder structure and naming:** [folder-structure.md](./folder-structure.md) — Component folder contents, barrel file placement
- **Component API and props:** [component-api.md](./component-api.md) — Import patterns for types
- **Style imports:** [styles-architecture.md](./styles-architecture.md) — CSS import patterns
- **Test mock imports:** [test-conventions.md](./test-conventions.md) — Mock import patterns (jest.mock)
- **CLAUDE.md barrel warning:** [CLAUDE.md](../../CLAUDE.md) — Performance Anti-pattern: Barrel Imports
- **ESLint rule source:** [`eslint-rules/no-barrel-imports-in-ui.js`](../../eslint-rules/no-barrel-imports-in-ui.js) — Custom rule implementation
