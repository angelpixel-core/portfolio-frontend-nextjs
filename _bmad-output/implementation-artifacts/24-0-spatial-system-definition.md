# Story 24.0: Spatial System Definition

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **team lead**,
I want **definir las reglas espaciales del proyecto mediante ADRs formales (spacing scale, containment rules, separacion layout/componente) y un layout audit**,
so that **Epic 24 tenga contratos arquitectonicos claros antes de tocar codigo productivo, previniendo migraciones a ciegas y regresiones visuales**.

## Acceptance Criteria

1. **AC1: ADR — Spacing Scale** — Documento `docs/adr/008-spacing-scale.md` creado con:
   - Base unit definida (4px o 8px) con justificacion
   - Scale progression (tabla de tokens: `--space-xs` a `--space-3xl` o equivalente Tailwind)
   - Gap rules: cuándo usar gap vs margin vs padding
   - Vertical rhythm strategy (si aplica)
   - Relacion con la escala existente de Tailwind (`gap-1` = 4px, `gap-2` = 8px, etc.)

2. **AC2: ADR — Containment Rules** — Documento `docs/adr/009-containment-rules.md` creado con:
   - max-width policy por nivel de layout (root=1024px, blade, section, component)
   - min-height strategy para secciones criticas (hero, main content, blades)
   - overflow behavior (cuándo `overflow-y: auto`, cuándo `hidden`, cuándo `visible`)
   - Blade definition formal (hero blade, grid blade, list blade)
   - Reglas para `100vh` vs `100dvh` vs `calc(100dvh - Xpx)`

3. **AC3: ADR — Layout vs Component Responsibilities** — Documento `docs/adr/010-layout-component-separation.md` creado con:
   - Tabla de propiedades: cuáles pertenecen al layout, cuáles al componente
   - Prohibiciones explicitas (ej: width hardcodeado en atoms, margin externo en componentes)
   - Reglas de composicion (cómo componentes se relacionan dentro de layouts)
   - Decision tree: "Esta propiedad es de layout o de componente?"
   - Excepciones documentadas (ej: min-height 44px en botones por WCAG)

4. **AC4: Layout Audit Document** — Documento `docs/architecture/layout-audit-epic-24.md` creado con:
   - Inventario de width hardcodeados en `src/ui/` (archivos + valores)
   - Inventario de `position:absolute` fragiles (distinguir intencional vs fragil)
   - Inventario de z-index por archivo (tabla con valor y proposito)
   - Inventario de min-height ausentes en secciones criticas
   - Inventario de legacy breakpoints por archivo (25 files — dato verificado en audit)
   - Resumen de anti-patterns actuales con severidad
   - Mapa de dependencias: qué componentes comparten espacio y cómo

5. **AC5: Validacion** — `npm run lint`, `npm run typecheck`, `npm test` pasan sin nuevos errores (no se toca codigo productivo, pero verificar que docs no rompan nada).

## Tasks / Subtasks

- [x] Task 1: Crear ADR Spacing Scale (AC: #1)
  - [x] Analizar spacing patterns actuales en el codebase (gap-1..gap-8 usage, padding patterns)
  - [x] Definir base unit y scale progression
  - [x] Documentar gap vs margin vs padding rules
  - [x] Crear `docs/adr/008-spacing-scale.md`
- [x] Task 2: Crear ADR Containment Rules (AC: #2)
  - [x] Documentar max-width hierarchy actual (root=1024px, MainContainer padding, etc.)
  - [x] Definir min-height strategy para hero, blades, main content
  - [x] Documentar overflow behavior rules
  - [x] Formalizar blade definitions (hero, grid, list)
  - [x] Crear `docs/adr/009-containment-rules.md`
- [x] Task 3: Crear ADR Layout vs Component Separation (AC: #3)
  - [x] Clasificar propiedades CSS en layout vs componente
  - [x] Definir prohibiciones y excepciones
  - [x] Crear decision tree
  - [x] Crear `docs/adr/010-layout-component-separation.md`
- [x] Task 4: Layout Audit (AC: #4)
  - [x] Grep exhaustivo: hardcoded widths en `src/ui/`
  - [x] Grep exhaustivo: `position:absolute` en `src/ui/`
  - [x] Grep exhaustivo: z-index usage en `src/ui/`
  - [x] Grep exhaustivo: min-height presence/absence en secciones criticas
  - [x] Grep exhaustivo: legacy breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `xs:`)
  - [x] Compilar inventarios en `docs/architecture/layout-audit-epic-24.md`
- [x] Task 5: Validacion (AC: #5)
  - [x] `npm run lint` — 0 errors, 0 warnings
  - [x] `npm run typecheck` — 0 errors
  - [x] `npm test` — 987 passed, 99 suites, 5 snapshots

## Dev Notes

### Contexto del Epic

Story 24.0 es la primera story de **Epic 24: Spatial System & Layout Stabilization**. Fue definida como obligatoria en la retro de Epic 23 con el principio: "No comenzamos migración hasta tener contratos arquitectonicos claros."

**REGLA FUNDAMENTAL: No se toca código productivo en esta story.** Solo se crean documentos de arquitectura.

### Estado Actual del Layout System

**Root Container:**
- `.layout` en globals.css: `max-width: 1024px`, `min-width: 320px`, `min-height: 100vh`, `margin: 0 auto`, `display: flex; flex-direction: column`
- `#main-content`: `flex: 1` (footer push-down)

**Spacing Patterns Actuales (informal, no sistematizado):**
- `gap-1` (4px): Icon groups, inline elements
- `gap-2` (8px): Component-level (forms, social links)
- `gap-4` (16px): Medium level (chat sections, footer columns)
- `gap-6` (24px): Section transitions
- `gap-8` (32px): Page-level grids
- No custom spacing tokens existen — se usa escala default de Tailwind

**MainContainer Padding (LEGACY — usa breakpoints invertidos):**
- Default: `py-12 px-28`
- `xl:` (<1280px): `p-24`
- `lg:` (<1024px): `p-16`
- `md:` (<768px): `p-12`
- `sm:` (<640px): `p-8`

**NavBar Padding (CORRECTO — semantic breakpoints):**
- `px-6 tablet:px-12 desktop:px-16 wide:px-32`
- `py-4 desktop:py-6`

### Breakpoint System

**Semantic (ACTIVO — min-width, mobile-first):**
| Breakpoint | Query | Purpose |
|-----------|-------|---------|
| *(base)* | 0-399px | Small mobile |
| `phablet:` | 400px+ | +10% typography |
| `mobile:` | 480px+ | +25% typography |
| `tablet:` | 640px+ | Tablets |
| `nav:` | 800px+ | Nav toggle (COUPLED con JS) |
| `stage:` | 960px+ | Hero swap |
| `desktop:` | 1025px+ | Desktop |
| `wide:` | 1441px+ | Ultra-wide |

**Legacy (DEPRECATED — max-width, inverted):**
`2xl:`, `xl:`, `lg:`, `md:`, `sm:`, `xs:` — 23 CSS files + 1 TSX todavía los usan.

**Coupling critico:** `nav: 800px` está hardcodeado en:
- `tailwind.config.js`
- `MenuFloatingClient/index.tsx` (constante JS)
- `MobileMenuOverlay/index.tsx` (warning documentado)

### Every Layout Primitives (PLANIFICADOS, NO IMPLEMENTADOS)

Documentados en `layout-patterns.md` con use-site analysis:
| Primitive | Decision | Use Sites |
|-----------|----------|-----------|
| Stack | ADOPT | 54+ |
| Center | ADOPT | 5+ |
| Cluster | ADOPT | 11+ |
| Sidebar | ADOPT | 3+ |
| Switcher | ADOPT | 7+ |
| Cover | ADOPT | 5+ |
| Grid (Fluid) | ADOPT | 1 |

**Status:** CSS NOT created yet — Story 24.1 los implementará basándose en los ADRs de Story 24.0.

### ADRs Existentes

- **ADR-001:** (si existe, verificar)
- **ADR-002:** Breakpoint Standardization (2026-02-06) — Added `phablet` y `mobile` para progressive typography
- **ADR-003:** Import Strategy — Barrel vs Direct imports

**ADRs creados en esta story:** 008 (Spacing Scale), 009 (Containment Rules), 010 (Layout vs Component)

### Hallazgos del Audit Preliminar (de la retro Epic 23)

> **Nota:** Estos conteos eran estimados. El audit exhaustivo (`docs/architecture/layout-audit-epic-24.md`) tiene los datos verificados con grep.

- **25 CSS files** usan legacy breakpoints (preliminar: 23)
- **28 files** con hardcoded widths, **26 files** con hardcoded heights (preliminar: 53 combinados)
- **47 declarations** de z-index en 20+ files (preliminar: 24 files)
- **56 declarations** de min-height (preliminar: 32 files)
- **0 files** con Every Layout primitives
- **~585** `@apply` directives en 83 CSS files (no re-auditado en esta story)

### Anti-Patterns Conocidos

| Anti-Pattern | Ubicacion | Severidad |
|-------------|-----------|-----------|
| MainContainer legacy breakpoints | `atoms/hocs/MainContainer/styles.css` | Medium |
| Home `!important` overrides | `src/app/styles.css` | Low |
| `inline-block` en MainContainer | `atoms/hocs/MainContainer/styles.css` | Low |
| Raw media queries (720px, 880px) | Footer, varios componentes | Low |
| No container queries | Global | None (futuro) |

### Lecciones de Epic 23 Aplicables

1. **Conteos exactos obligatorios** — Cada inventario en el audit debe tener números verificados con grep
2. **Sincronizacion de docs** — Los ADRs deben ser consistentes entre sí y con docs existentes
3. **"El sistema se protege solo"** — Los ADRs deben ser enforceable (ESLint rules, CI gates) no solo aspiracionales

### Risk Assessment

- **Riesgo**: Bajo (no se toca código productivo)
- **Riesgo principal**: ADRs demasiado vagos o demasiado restrictivos — balance necesario
- **Mitigacion**: Review adversarial post-story para validar que los ADRs son implementables

### Project Structure Notes

- ADRs van en `docs/adr/` (directorio existente con ADR-002 y ADR-003)
- Layout audit va en `docs/architecture/` (directorio existente)
- Formato ADR: seguir estructura de ADR-002 (Title, Status, Context, Decision, Consequences)
- Extensible: Si el scope de algún ADR se abre, crear Story 0-A, 0-B, etc.

### Referencias

- [Source: docs/architecture/layout-patterns.md] — Layout patterns actuales, Every Layout analysis
- [Source: docs/architecture/styles-architecture.md] — CSS patterns, BEM, breakpoints, @apply policy
- [Source: docs/architecture/component-api.md] — Props typing, component patterns
- [Source: docs/adr/002-breakpoint-standardization.md] — Breakpoint ADR existente
- [Source: docs/adr/003-import-strategy.md] — Import ADR existente
- [Source: tailwind.config.js] — Breakpoint definitions (semantic + legacy)
- [Source: src/styles/globals.css] — Root layout container (.layout, #main-content)
- [Source: src/ui/atoms/hocs/MainContainer/styles.css] — Legacy breakpoint usage
- [Source: _bmad-output/implementation-artifacts/epic-23-retro-2026-02-16.md#Section 6] — Origen del reframe a "Spatial System"
- [Source: _bmad-output/planning-artifacts/epics-v4.md#Epic 24] — Definicion del epic

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

### Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6 (adversarial code review)
**Date:** 2026-02-16
**Outcome:** APPROVED (all issues fixed)

**Issues Found:** 0 High, 4 Medium, 3 Low — all 7 fixed in-place.

| ID | Severity | Issue | Fix |
|----|----------|-------|-----|
| M1 | Medium | Story Dev Notes had stale preliminary counts | Added note pointing to verified audit data |
| M2 | Medium | ADR-008 gap counts didn't match audit (25→29, 14→20) | Corrected occurrence numbers |
| M3 | Medium | ADR-009 didn't mention ArticleContent max-width: 800px violation | Added known violation note |
| M4 | Medium | ADR-010 `display` classified as Layout-only but components use flex internally | Added dual-ownership qualifier with Composition Rule #4 reference |
| L1 | Low | ADR-009 typo "progresive" | Fixed to "progressive" |
| L2 | Low | AC4 said "23 CSS files + 1 TSX" but audit found 25 | Updated to "25 files — dato verificado en audit" |
| L3 | Low | ADR-008 References linked to `_bmad-output/` (inconsistent with ADR-002/003) | Changed to textual reference |

### Completion Notes List

- ADRs numerados 008-010 (no 004-006) porque ya existían ADRs 001-007
- Layout audit contiene conteos exactos verificados con grep (principio PI-1 de retro Epic 23)
- Hallazgo: 25 files con legacy breakpoints (no 23 como estimaba el audit preliminar)
- Hallazgo: 103 hardcoded width values, 84 hardcoded height values
- Hallazgo: 317 @media declarations, incluyendo 720px (30 usos) y 768px (39 usos) no mapeados a breakpoints semánticos
- Todos los ADRs cross-referencian entre sí y con docs existentes

### File List

**Created:**
- `docs/adr/008-spacing-scale.md` — ADR: Spacing Scale (AC1)
- `docs/adr/009-containment-rules.md` — ADR: Containment Rules (AC2)
- `docs/adr/010-layout-component-separation.md` — ADR: Layout vs Component (AC3)
- `docs/architecture/layout-audit-epic-24.md` — Layout Audit Document (AC4)

**Modified:**
- `_bmad-output/implementation-artifacts/24-0-spatial-system-definition.md` — Story status + task checkboxes
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Story status: ready-for-dev → in-progress
