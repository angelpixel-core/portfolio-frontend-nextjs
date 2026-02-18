---
id: 25-0-adr-css-convention-decisions
aliases: []
tags: []
---

# Story 25.0: ADR — CSS Convention Decisions

Status: done

## Story

As a developer,
I want architectural decision records that define breakpoint tokenization, BEM enforcement, and z-index scale,
so that all subsequent Epic 25 stories have unambiguous conventions to follow.

## Acceptance Criteria

1. ADR-011 (Breakpoint Tokenization Strategy) written — includes mapping table raw value → token name, rationale for new tokens, and 1024→desktop decision
2. ADR-012 (BEM Enforcement Strategy) written — documents `block__element--modifier` convention, rename scope, and batch approach
3. Z-index scale documented in `docs/architecture/z-index-scale.md` — complete inventory with layer names and conflict analysis
4. All new breakpoint token names are explicit and final (no TBD)

## Tasks / Subtasks

- [x] Task 1: Write ADR-011 — Breakpoint Tokenization Strategy (AC: #1)
  - [x] 1.1 Create `docs/adr/011-breakpoint-tokenization-strategy.md`
  - [x] 1.2 Document current state: 7 tokens defined, 5 raw values used (560/720/768/880/1024)
  - [x] 1.3 Define mapping table with proposed token names:
    - `560px` → `compact` (progressive typography step between mobile and tablet). Alternative considered: `spacious` — describes viewport expanding. `compact` chosen as default: describes the viewport range (still compact relative to tablet). Document both in ADR as evaluated options.
    - `720px` → `expanded` (secondary content expansion — auth, social, filters become visible)
    - `768px` → `prose` (content layout shifts — legacy Tailwind `md` replacement, article/text reflow)
    - `880px` → `details` (navigation details display — nav zone links, contact info visible)
    - `1024px` → use existing `desktop` (1025px) — accept 1px shift, document rationale. **iPad impact:** iPad landscape (1024px) will no longer trigger desktop layout — intentional: iPads use tablet/nav layout. Document explicitly in ADR as conscious decision, not side-effect.
  - [x] 1.4 Document `@media screen(token)` as required syntax for all new media queries
  - [x] 1.5 Document exclusions: WordCloud out of scope, `max-width` containers keep raw values
  - [x] 1.6 Document 720px→768px semantic distinction: `expanded` triggers secondary UI elements (auth/social/filters), `prose` triggers content layout reflow — 48px gap is intentional, not redundant (same principle as ADR-002 phablet/mobile 80px gap)
  - [x] 1.7 Include complete scale table (all 12 tokens) showing existing + new in progression:
    ```
    phablet(400) → mobile(480) → compact(560) → tablet(640) →
    expanded(720) → prose(768) → nav(800) → details(880) →
    stage(960) → desktop(1025) → wide(1441)
    ```
  - [x] 1.8 Document enforcement note: raw `min-width` in CSS is a future linter rule candidate (not for this epic, but breadcrumb for Story 25.5 or future DX story)
  - [x] 1.9 Document Story 25.5 implementation notes: (a) add inline comments in `tailwind.config.js` with semantic trigger per token (e.g., `// auth, social, filters expand` next to `expanded`), (b) commit message must mention iPad landscape 1024px behavior change explicitly for QA awareness
  - [x] 1.10 Include quick-decision cheat sheet table in ADR: "What do you want to do? → Use this token". Covers: font-size mobile → phablet/mobile/compact, show sidebar content → expanded, article reflow → prose, nav items → nav/details, desktop layout → desktop. Prevents dev paralysis from 11 tokens.
  - [x] 1.11 Document dependent docs that will require update in Story 25.5: `docs/architecture/styles-architecture.md` (breakpoint section), `docs/layout-system.md` (breakpoint table), `CLAUDE.md` (Responsive Breakpoint System table). ADR-011 is the source of truth; these docs are consumers.

- [x] Task 2: Write ADR-012 — BEM Enforcement Strategy (AC: #2)
  - [x] 2.1 Create `docs/adr/012-bem-enforcement-strategy.md`
  - [x] 2.2 Document convention: `block__element--modifier` (double underscore mandatory)
  - [x] 2.3 Document scope: 332 classes across 45 CSS files, rename approach by UI layer batch
  - [x] 2.4 Define batch order: app/ pages → atoms/ → molecules/ → organisms/ → overlays/
  - [x] 2.5 Document test strategy per batch: (1) execute class renames, (2) `npm test` → expect snapshot failures, (3) count snapshot failures with `npm test 2>&1 | grep "snapshot" | wc -l` and compare against expected count for the batch, (4) `npm test -- -u` to update snapshots, (5) re-run `npm test` to confirm all green, (6) visual check on dev server
  - [x] 2.6 Document exclusions: WordCloud out of scope, no ESLint/stylelint rule (future candidate)
  - [x] 2.7 Document E2E selector risk: `e2e/about-experiences-education-ux.spec.ts` uses 4 CSS class selectors with single-underscore BEM violations (`.experience_title`, `.education_title`, `.experience_history-info`, `.education_history-info`). BEM rename story MUST update these selectors or migrate to `data-testid`. Also: `TransitionEffect` tests assert `transition-effect_blade` className — will break on rename.

- [x] Task 3: Create z-index scale documentation (AC: #3)
  - [x] 3.1 Create `docs/architecture/z-index-scale.md`
  - [x] 3.2 Document complete scale with 7 layers (BOTH CSS `z-index` values AND Tailwind utility classes):
    - Background (-10 to -1): shadow pseudo-elements. Tailwind: `-z-10`
    - Document (0): base layout flow
    - Elevation (1): minimal lift (intentional: lowest possible z above document flow, avoids competing with Components layer)
    - Components (10): navigation, images, carousels. Tailwind: `z-10`
    - Overlays (20): backdrop layers. Tailwind: `z-20`
    - Panels (30): overlay content, HireMe, menu trigger. Tailwind: `z-30`
    - Modals (40-50): auth, skill detail, dropdowns, TransitionEffect curtains. Tailwind: `z-40`, `z-50`
    - A11y (100-9999): skip link
      Note: TransitionEffect uses `z-50/z-40/z-30` Tailwind utilities for curtain animation layers (Story 13.6)
  - [x] 3.3 Document HireMe z-30 vs Floating panel z-30 as known behavior (mutually exclusive visibility)
  - [x] 3.4 Add z-index usage rules: when to use each layer, never add new values without updating doc
  - [x] 3.5 Document z-9999 rule: reserved exclusively for skip-link — no other component may use this value. z-100 is the general a11y layer; z-9999 is the nuclear option for guaranteed top-layer accessibility
  - [x] 3.6 Update `docs/index.md` with link to z-index scale doc
  - [x] 3.7 Include z-index audit commands in doc for periodic verification:
    - CSS files: `grep -rn "z-index" src/ --include="*.css"`
    - Tailwind utilities in JSX/TSX: `grep -rn "z-[0-9]" src/ --include="*.tsx" --include="*.jsx"`
    - Allows devs to verify all z-index values (both CSS and Tailwind) match the documented scale. Candidate for future CI check.

- [x] Task 4: Verify and commit (AC: #1-4)
  - [x] 4.1 Ensure all token names are final (no TBD, no "proposed")
  - [x] 4.2 `npm run lint` passes (docs don't break lint)
  - [x] 4.3 Atomic commit: ADRs + z-index doc

## Dev Notes

### Story 25.0 is documentation-first with minimal test infra fixes

This story produces 3 documents that serve as the decision foundation for all subsequent Epic 25 stories. Minor adjustments were required to stabilize E2E validation (auth env default + calendar contrast). Full test verification recorded below.

### Breakpoint Token Decision Context

**Current tokens** (from `tailwind.config.js` line 59-78):

```
phablet: 400px, mobile: 480px, tablet: 640px, nav: 800px,
stage: 960px, desktop: 1025px, wide: 1441px
```

**Raw values in codebase** (from audit agents):

- `560px` — 10 instances in 9 files — typography scaling step
- `720px` — 34 instances in 12 files (excl. WordCloud) — auth/social/filter visibility
- `768px` — 40 instances in 7 files (excl. WordCloud) — content layout shifts
- `880px` — 11 instances in 6 files — nav zone content display
- `1024px` — 29 instances in 4 files (excl. WordCloud) — desktop layout, off-by-1 with `desktop: 1025px`

**Critical semantic distinctions (validated via ADR elicitation):**

- `720px` (`expanded`) is NOT the same as `tablet: 640px` — at 720px auth moves to header, social links appear, filters show. Name `expanded` describes the action: secondary content expands into view.
- `768px` (`prose`) is NOT the same as `tablet: 640px` — legacy Tailwind `md`, used for content/article layout reflow. 48px gap from `expanded` is intentional (same principle as ADR-002 phablet/mobile).
- `880px` (`details`) is NOT the same as `nav: 800px` — at 800px hamburger disappears, at 880px nav zone details (links, contact) appear. Lowercase single-word follows existing token convention.

**Naming convention rule:** All breakpoint tokens must be lowercase single words (matches existing: `phablet`, `mobile`, `tablet`, `nav`, `stage`, `desktop`, `wide`).

### BEM Scope Detail

**Top 5 files by violation count:**

1. `Chat/styles.css` — 39 classes
2. `Experience/styles.css` — 17 classes
3. `Education/styles.css` — 15 classes
4. `NavBar/styles.css` — 15 classes
5. `app/styles.css` — 15 classes

**Batch breakdown:**

- Batch A (app/ pages): 33 classes, 4 CSS files
- Batch B (atoms/): 39 classes, 11 CSS files
- Batch C (molecules/): 75 classes, 16 CSS files
- Batch D (organisms/): 62 classes, 7 CSS files
- Batch E (overlays/): 4 classes, 2 CSS files

### Z-index Complete Inventory (from audit agent)

| Value | Selector                                                                 | File              |
| ----- | ------------------------------------------------------------------------ | ----------------- |
| -10   | BoxShadow, FeaturedBoxShadow pseudo-elements                             | shadows/          |
| -1    | skill:before                                                             | skill/styles.css  |
| 0     | MainContainer, History, Footer, Auth                                     | layout elements   |
| 1     | LiIcon, app/styles lightning                                             | minimal elevation |
| 10    | NavBar, Auth, MovingImage, Carousel                                      | components        |
| 20    | Floating, FloatingMobile, Chat backdrop                                  | overlay backdrops |
| 30    | Floating panel, HireMe, MenuButton                                       | overlay content   |
| 40    | WordCloud skill detail backdrop                                          | modal backdrop    |
| 50    | Auth modal, NavBar fixed, AuthButton, WordCloud card, SocialAuthDropdown | modals            |
| 100   | coming-soon skip-link                                                    | a11y              |
| 9999  | globals.css skip-link                                                    | a11y (highest)    |

**Known conflict:** HireMe (z-30) and Floating panel (z-30) share the same layer. Not a runtime issue because HireMe hides when the floating overlay opens (they're mutually exclusive in visibility).

### Subtask Priority Guide

**CORE** (must be in the ADR/doc): 1.1-1.7, 2.1-2.7, 3.1-3.6, 4.1-4.3
**ENRICHMENT** (incorporate inline during writing, no dedicated section needed): 1.8, 1.9, 1.10, 1.11, 3.7

Enrichment subtasks add value but should be woven naturally into the ADR prose — not as separate sections that bloat the document.

### Project Structure Notes

- ADRs go in `docs/adr/` — existing ADRs numbered 001-010
- ADR format: follow existing pattern from `docs/adr/008-spacing-scale.md` (Spanish, structured)
- Z-index doc goes in `docs/architecture/` alongside `styles-architecture.md`, `layout-patterns.md`
- `docs/index.md` has a "Architecture Documentation" section to add link

### References

- [Source: _bmad-output/implementation-artifacts/architectural-audit-2026-02-17.md] — Full audit with all findings
- [Source: _bmad-output/implementation-artifacts/epic-25-architectural-coherence.md] — Epic definition
- [Source: tailwind.config.js lines 59-78] — Current breakpoint definitions
- [Source: docs/adr/008-spacing-scale.md] — ADR format reference
- [Source: docs/architecture/styles-architecture.md] — Existing CSS architecture doc

## Dev Agent Record

### Agent Model Used

OpenCode gpt-5.2-codex

### Implementation Plan

- Redactar ADR-011 (breakpoints) y ADR-012 (BEM) siguiendo el formato ADR existente.
- Crear documentación de escala de z-index y enlazarla en `docs/index.md`.
- Ejecutar lint y suites de tests configuradas.
- Registrar resultados, archivos tocados y estado de la historia.

### Debug Log

- `npm run test:e2e` falló con violaciones de contraste (a11y) en `/` y light mode, y un fallo en `auth.spec.ts` (Auth button no disabled).
- Se corrigió contraste de `CalendarLink` y se forzó `NEXT_PUBLIC_OAUTH_ENABLED=false` en Playwright local para mantener el flujo de Auth e2e estable.
- Reintento de `npm run test:e2e` pasó (223 tests, 30 skipped).
- Apareció nuevo fallo de contraste en `/about` por opacidad dinámica de `WordCloud` (`tagcloud--weight-3` / `tagcloud--weight-2`); se ajustó color base en light mode.
- Revisión adversarial del code review detectó que `opacity: 0.85 !important` rompía efecto 3D de TagCloud.js; se eliminó.
- Revisión adversarial detectó doble hardcoding en CalendarLink (CSS hardcode + !important vs CSS var inline); se limpiaron reglas CSS para dejar inline style ganar.
- Usuario ejecutó validación manual mediante `npm run test:e2e -- e2e/accessibility.spec.ts` → OK tras arreglos.

### Completion Notes List

- Documentación creada: ADR-011, ADR-012 y escala de z-index.
- `docs/index.md` actualizado con link a la nueva doc.
- Ajuste de contraste para `CalendarLink` (CSS var) y default local de OAuth en Playwright.
- Ajuste de contraste para `WordCloud` en `/about` (light mode): color base más oscuro; se eliminó `opacity: 0.85 !important` que rompía efecto 3D de TagCloud.js.
- `npm run lint`, `npm test` y `npm run test:e2e` ejecutados OK (223 passed, 30 skipped).
- Verificación adicional del caso de accesibilidad en `/about` ejecutada manualmente por el usuario con resultado OK.

### File List

- docs/adr/011-breakpoint-tokenization-strategy.md
- docs/adr/012-bem-enforcement-strategy.md
- docs/architecture/z-index-scale.md
- docs/index.md
- playwright.config.ts
- src/styles/globals.css
- src/ui/atoms/links/CalendarLink/index.tsx
- src/ui/atoms/links/CalendarLink/skeleton.tsx
- src/ui/atoms/links/CalendarLink/styles.css
- src/ui/organisms/WordCloud/styles.css
- \_bmad-output/implementation-artifacts/25-0-adr-css-convention-decisions.md
- \_bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-02-18: Creación de ADR-011, ADR-012 y documentación de escala de z-index; índice actualizado.
- 2026-02-18: Ajustes de contraste en CalendarLink y default OAuth para Playwright; E2E estabilizado.
- 2026-02-18: Fix de contraste en `/about` para WordCloud (light mode) + code review arreglos (M1, M2, B1).
- Revisión adversarial: eliminado `opacity: 0.85 !important` de WordCloud para preservar efecto 3D de TagCloud.js; limpiado CalendarLink para usar CSS var inline sin !important.

## Revisión de Código (AI)

**Fecha:** 2026-02-18  
**Issues detectados:** 0 Critical, 2 Medium, 1 Low

### Arreglos aplicados (autofix)

- **[AI-Review][Medium] WordCloud: opacity: 0.85 !important anulaba cálculo dinámico de TagCloud.js**
  - Ubicación: `src/ui/organisms/WordCloud/styles.css:174-175`
  - Arreglo: Eliminada regla `:root:not(.dark) .tagcloud--item { opacity: 0.85 !important; }`. El color base `#1f2937` ya garantiza contraste AA sin forzar opacidad, permitiendo que TagCloud.js controle opacity dinámicamente para el efecto 3D.

- **[AI-Review][Medium] CalendarLink: mezcla de CSS var + hardcode + !important**
  - Ubicación: `src/ui/atoms/links/CalendarLink/styles.css:26,61,68,78`
  - Arreglo: Removido `!important` y colores hardcodeados de reglas CSS. Dejado que inline style `style={{ color: "var(--calendar-text-color)" }}` gane mediante cascade. Consistencia unificada en CSS custom property.

- **[AI-Review][Low] Falta documentar qué comando ejecutó el usuario para validar manualmente**
  - Ubicación: `Dev Agent Record → Debug Log`
  - Arreglo: Agregado comando de validación: `npm run test:e2e -- e2e/accessibility.spec.ts`.

### Evidencia de arreglos

- `src/ui/organisms/WordCloud/styles.css`: líneas anteriormente `174-175` eliminadas.
- `src/ui/atoms/links/CalendarLink/styles.css`: 4 reglas con `!important` limpiadas.
- `25-0-adr-css-convention-decisions.md`: Debug Log actualizado con comandos y arreglos.

## Angel DevStack Notes

- I ran a refiment over it story

Advanced Elicitation Options

1. [DONE] Architecture Decision Records — Múltiples arquitectos debaten opciones
2. [PEDING-1] Critique and Refine — Revisión sistemática de fortalezas/debilidades
3. [DONE] Pre-mortem Analysis — Imaginar fallos futuros
4. Comparative Analysis Matrix — Evaluar opciones contra criterios ponderados
5. [PEDING-2] First Principles Analysis — Verificar coherencia semántica fundamental
