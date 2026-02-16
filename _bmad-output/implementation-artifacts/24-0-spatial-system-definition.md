# Story 24.0: Spatial System Definition

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **team lead**,
I want **definir las reglas espaciales del proyecto mediante ADRs formales (spacing scale, containment rules, separacion layout/componente) y un layout audit**,
so that **Epic 24 tenga contratos arquitectonicos claros antes de tocar codigo productivo, previniendo migraciones a ciegas y regresiones visuales**.

## Acceptance Criteria

1. **AC1: ADR — Spacing Scale** — Documento `docs/adr/004-spacing-scale.md` creado con:
   - Base unit definida (4px o 8px) con justificacion
   - Scale progression (tabla de tokens: `--space-xs` a `--space-3xl` o equivalente Tailwind)
   - Gap rules: cuándo usar gap vs margin vs padding
   - Vertical rhythm strategy (si aplica)
   - Relacion con la escala existente de Tailwind (`gap-1` = 4px, `gap-2` = 8px, etc.)

2. **AC2: ADR — Containment Rules** — Documento `docs/adr/005-containment-rules.md` creado con:
   - max-width policy por nivel de layout (root=1024px, blade, section, component)
   - min-height strategy para secciones criticas (hero, main content, blades)
   - overflow behavior (cuándo `overflow-y: auto`, cuándo `hidden`, cuándo `visible`)
   - Blade definition formal (hero blade, grid blade, list blade)
   - Reglas para `100vh` vs `100dvh` vs `calc(100dvh - Xpx)`

3. **AC3: ADR — Layout vs Component Responsibilities** — Documento `docs/adr/006-layout-component-separation.md` creado con:
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
   - Inventario de legacy breakpoints por archivo (23 CSS files + 1 TSX)
   - Resumen de anti-patterns actuales con severidad
   - Mapa de dependencias: qué componentes comparten espacio y cómo

5. **AC5: Validacion** — `npm run lint`, `npm run typecheck`, `npm test` pasan sin nuevos errores (no se toca codigo productivo, pero verificar que docs no rompan nada).

## Tasks / Subtasks

- [ ] Task 1: Crear ADR Spacing Scale (AC: #1)
  - [ ] Analizar spacing patterns actuales en el codebase (gap-1..gap-8 usage, padding patterns)
  - [ ] Definir base unit y scale progression
  - [ ] Documentar gap vs margin vs padding rules
  - [ ] Crear `docs/adr/004-spacing-scale.md`
- [ ] Task 2: Crear ADR Containment Rules (AC: #2)
  - [ ] Documentar max-width hierarchy actual (root=1024px, MainContainer padding, etc.)
  - [ ] Definir min-height strategy para hero, blades, main content
  - [ ] Documentar overflow behavior rules
  - [ ] Formalizar blade definitions (hero, grid, list)
  - [ ] Crear `docs/adr/005-containment-rules.md`
- [ ] Task 3: Crear ADR Layout vs Component Separation (AC: #3)
  - [ ] Clasificar propiedades CSS en layout vs componente
  - [ ] Definir prohibiciones y excepciones
  - [ ] Crear decision tree
  - [ ] Crear `docs/adr/006-layout-component-separation.md`
- [ ] Task 4: Layout Audit (AC: #4)
  - [ ] Grep exhaustivo: hardcoded widths en `src/ui/`
  - [ ] Grep exhaustivo: `position:absolute` en `src/ui/`
  - [ ] Grep exhaustivo: z-index usage en `src/ui/`
  - [ ] Grep exhaustivo: min-height presence/absence en secciones criticas
  - [ ] Grep exhaustivo: legacy breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `xs:`)
  - [ ] Compilar inventarios en `docs/architecture/layout-audit-epic-24.md`
- [ ] Task 5: Validacion (AC: #5)
  - [ ] `npm run lint` — sin errores
  - [ ] `npm run typecheck` — sin errores
  - [ ] `npm test` — todos los tests pasan

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

**ADRs a crear en esta story:** 004 (Spacing Scale), 005 (Containment Rules), 006 (Layout vs Component)

### Hallazgos del Audit Preliminar (de la retro Epic 23)

- **23 CSS files** usan legacy breakpoints
- **53 files** con width/height hardcodeados
- **24 files** con z-index usage
- **32 files** con min-height
- **0 files** con Every Layout primitives
- **~585** `@apply` directives en 83 CSS files

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

### Completion Notes List

### File List
