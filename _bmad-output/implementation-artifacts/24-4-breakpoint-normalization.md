# Story 24.4: Breakpoint Normalization

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer maintaining the portfolio codebase**,
I want **reemplazar los 84 usages de legacy breakpoints (sm:, md:, lg:, xl:, 2xl:, xs:) con sus equivalentes semánticos (phablet:, mobile:, tablet:, nav:, stage:, desktop:, wide:) y eliminar las definiciones legacy de tailwind.config.js**,
so that **el sistema de breakpoints sea consistente mobile-first (min-width), eliminando la confusión de breakpoints invertidos (max-width) y reduciendo bugs de layout en futuros cambios**.

## Acceptance Criteria

### AC1: Migrar todos los legacy breakpoints en archivos de producción

- [ ] 0 usages de `sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `xs:` en `src/`
- [ ] Cada reemplazo preserva el comportamiento visual exacto (max-width → min-width invertido)
- [ ] Verificar con `grep -r "sm:\|md:\|lg:\|xl:\|2xl:\|xs:" src/` = 0 resultados

### AC2: Actualizar archivos de test que referencien legacy breakpoints

- [ ] Tests en `src/styles/__tests__/` actualizados para reflejar nuevos breakpoints
- [ ] Si los tests validan la presencia de legacy breakpoints, actualizarlos o eliminarlos
- [ ] `npm test` pasa sin fallos

### AC3: Eliminar definiciones legacy de tailwind.config.js

- [ ] Remover las 6 definiciones legacy: `2xl`, `xl`, `lg`, `md`, `sm`, `xs` (max-width)
- [ ] Mantener las 7 definiciones semánticas intactas
- [ ] `npm run build` exitoso sin errores de clases desconocidas

### AC4: Verificar visual regression

- [ ] `npm run test:e2e` pasa (253 tests, incluyendo los 10 de vertical-viewport)
- [ ] Verificación manual en 4 viewports: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- [ ] Las 4 rutas (/, /about, /projects, /articles) visualmente intactas

### AC5: Actualizar documentación

- [ ] CLAUDE.md: remover tabla de legacy breakpoints o marcar como eliminados
- [ ] `docs/architecture/styles-architecture.md`: actualizar conteos y tabla de migración
- [ ] ADR-002: agregar nota de migración completada

## Tasks / Subtasks

### Fase 1: Inventario y mapeo (AC1)

- [ ] T1: Generar inventario exacto de los 84 legacy usages con archivo:línea (AC: 1)
  - [ ] T1.1: Crear tabla de mapeo: cada `sm:X` → `tablet:X` (o equivalente semántico invertido)
  - [ ] T1.2: Identificar cases donde la inversión no es 1:1 (requieren lógica nueva)

### Fase 2: Migración por componente (AC1)

- [ ] T2: Migrar organismos — mayor impacto (AC: 1)
  - [ ] T2.1: `ProjectCard/styles.css` (8 usages)
  - [ ] T2.2: `Skills/styles.css` (6 usages)
  - [ ] T2.3: `ArticleCard/styles.css` (5 usages)
  - [ ] T2.4: `Chat/styles.css` (3 usages)
  - [ ] T2.5: `Auth/styles.css` (2 usages)
- [ ] T3: Migrar moléculas (AC: 1)
  - [ ] T3.1: `Article/styles.css` (4 usages)
  - [ ] T3.2: `skill/styles.css` (4 usages)
  - [ ] T3.3: `ExtraInfo/styles.css` (3 usages)
  - [ ] T3.4: `FeaturedArticle/styles.css` (1 usage)
  - [ ] T3.5: `ArticleListItem/styles.css` (1 usage)
  - [ ] T3.6: `SocialNetworkLink/styles.css` (1 usage)
- [ ] T4: Migrar átomos (AC: 1)
  - [ ] T4.1: `BoxShadow/styles.css` (4 usages)
  - [ ] T4.2: `ArrowButton/styles.css` (3 usages)
  - [ ] T4.3: `SkillSelectorButton/styles.css` (3 usages)
  - [ ] T4.4: `AnimatedTitle/styles.css` (1 usage)
  - [ ] T4.5: `TransitionerLi/styles.css` (1 usage)
- [ ] T5: Migrar pages (AC: 1)
  - [ ] T5.1: `app/articles/styles.css` (1 usage)
  - [ ] T5.2: `app/articles/ArticleListSkeleton.tsx` (1 usage)

### Fase 3: Tests y config (AC2, AC3)

- [ ] T6: Actualizar tests de layout-migration (AC: 2)
  - [ ] T6.1: Actualizar assertions en `src/styles/__tests__/` (~32 occurrences)
- [ ] T7: Eliminar legacy breakpoints de tailwind.config.js (AC: 3)
  - [ ] T7.1: Remover 6 definiciones max-width
  - [ ] T7.2: Verificar `npm run build` limpio

### Fase 4: Verificación y docs (AC4, AC5)

- [ ] T8: Verificar visual regression (AC: 4)
  - [ ] T8.1: `npm run test:e2e` verde
  - [ ] T8.2: `npm test` verde
  - [ ] T8.3: `npm run lint` 0 warnings
- [ ] T9: Actualizar documentación (AC: 5)
  - [ ] T9.1: CLAUDE.md — actualizar tabla de breakpoints
  - [ ] T9.2: `docs/architecture/styles-architecture.md` — actualizar conteos
  - [ ] T9.3: ADR-002 — nota de migración completada

## Dev Notes

### Regla de inversión max-width → min-width

**CRITICO**: Los legacy breakpoints son **invertidos** — aplican estilos HASTA el breakpoint (max-width). Los semánticos aplican DESDE el breakpoint (min-width). La migración NO es un simple find-and-replace.

**Patrón de conversión:**
```css
/* ANTES: Legacy (max-width = aplica hasta 767px, es decir mobile) */
.component { font-size: 1.2rem; }       /* base: desktop */
md:.component { font-size: 1rem; }      /* md: hasta 767px */
sm:.component { font-size: 0.9rem; }    /* sm: hasta 639px */

/* DESPUES: Semantic (min-width = aplica desde breakpoint) */
.component { font-size: 0.9rem; }       /* base: mobile-first */
tablet:.component { font-size: 1rem; }  /* tablet: desde 640px */
desktop:.component { font-size: 1.2rem; } /* desktop: desde 1025px */
```

**Tabla de equivalencia semántica:**

| Legacy (max-width) | Rango que cubre | Equivalente semántico (min-width) |
|--------------------|-----------------|------------------------------------|
| `xs:` (≤479px) | 0-479px | base (sin prefijo) — reasignar estilos al default |
| `sm:` (≤639px) | 0-639px | base (sin prefijo) — o `mobile:` para 480-639px |
| `md:` (≤767px) | 0-767px | base (sin prefijo) — breakpoint opuesto: `tablet:` para ≥640px |
| `lg:` (≤1023px) | 0-1023px | base — breakpoint opuesto: `desktop:` para ≥1025px |
| `xl:` (≤1279px) | 0-1279px | base — breakpoint opuesto: `wide:` (si aplica) |
| `2xl:` (≤1535px) | 0-1535px | base — raramente usado |

### NAV_BREAKPOINT coupling

`nav: 800px` está hardcoded en 3 lugares (ADR-002). **NO cambiar** la definición del breakpoint — solo migrar las clases CSS que usan legacy prefijos. El breakpoint `nav:` ya es semántico.

### Archivos que ya usan ambos sistemas

Algunos archivos tienen mix de legacy y semánticos (ya parcialmente migrados):
- `src/ui/organisms/ProjectCard/styles.css` — 8 legacy + 2 semantic
- `src/app/articles/styles.css` — 1 legacy + 5 semantic

En estos casos, la migración elimina el legacy y puede consolidar con el semántico existente.

### Project Structure Notes

- CSS files: `src/ui/{layer}/{ComponentName}/styles.css` (BEM naming)
- Test files: `src/styles/__tests__/layout-migration-*.test.ts`
- Config: `tailwind.config.js` líneas 59-98 (breakpoints section)
- Docs: `docs/adr/002-breakpoint-standardization.md`, `docs/architecture/styles-architecture.md`

### References

- [Source: docs/adr/002-breakpoint-standardization.md] — Original breakpoint decision
- [Source: docs/adr/008-spacing-scale.md] — Spacing tokens (Story 24.0)
- [Source: docs/adr/009-containment-rules.md] — Max-width and overflow rules
- [Source: docs/architecture/styles-architecture.md#breakpoints] — Migration status table
- [Source: docs/architecture/layout-patterns.md] — Layout primitives and responsive patterns
- [Source: CLAUDE.md#responsive-breakpoint-system] — Breakpoint reference table
- [Source: _bmad-output/implementation-artifacts/24-0-spatial-system-definition.md] — Layout audit findings
- [Source: _bmad-output/implementation-artifacts/24-3-vertical-viewport-e2e-tests.md] — E2E safety net

### Previous Story Intelligence (24.3)

- Vertical viewport E2E tests provide safety net for this migration
- `assertNoOverlap()`, `assertReachable()` helpers validate layout integrity
- F1 (hero overlap at short viewports) is pre-existing — this story should not worsen it
- 10 tests across 4 viewport heights (400, 500, 667, 800px) catch regressions

### Git Intelligence

Últimos commits relevantes:
- `9b79bf0` docs(epic-24): add Story 24-6 WCAG color contrast fix
- `58271ac` fix(e2e): add descriptive messages to all bare test.skip() calls
- `d0c5a4e` refactor(e2e): replace beforeEach guards with describe-level skips
- `128a03a` fix(e2e): sync OAuth flag to test runner for describe-level skips

Patrón: commits atómicos por concern, Co-Authored-By trailer, conventional commits.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### Change Log

| Date | Change |
|------|--------|
| 2026-02-17 | Story created by create-story workflow — comprehensive context engine |
