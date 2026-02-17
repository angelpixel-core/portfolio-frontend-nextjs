# Story 24.2: Migrate Page by Page

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **migrar los layouts de las 4 páginas principales y sus organismos a usar los Every Layout primitives de Story 24.1, reemplazando `flex flex-col` ad-hoc con `.stack`, `flex-wrap` con `.cluster`, `mx-auto` con `.center`, etc., y refactorizar MainContainer a breakpoints semánticos**,
so that **el spatial system definido en ADRs 008-010 se aplique consistentemente, la intención de layout sea legible inmediatamente en cada clase CSS, y el codebase quede preparado para los vertical viewport tests de Story 24.3**.

## Acceptance Criteria

1. **AC1: Root Layout — Cover primitive** — `src/app/layout.tsx`:
   - `.layout` en globals.css recibe `min-height: 100dvh` (progressive enhancement sobre `100vh` existente)
   - `#main-content` en globals.css se migra a usar `.cover-principal` (class en JSX o `flex: 1` renombrado)
   - Verificar que footer sigue empujado al fondo en páginas cortas

2. **AC2: MainContainer — Semantic breakpoints** — `src/ui/atoms/hocs/MainContainer/styles.css`:
   - Legacy breakpoints migrados: `xl:p-24 lg:p-16 md:p-12 sm:p-8` → `tablet:p-12 desktop:p-16`
   - `inline-block` documentado como deuda conocida (NO cambiar — 14 `!important` overrides en Home dependen de esto)
   - Test visual: padding se reduce correctamente en mobile→tablet→desktop

3. **AC3: Home page primitives** — `src/app/styles.css`:
   - `.home-content`: `flex flex-col` → `.stack` (mobile base; `display: contents` at 640px+ se mantiene)
   - `.home-slider-container`: `flex flex-col` → `.stack`
   - `.home_contact-container`: migrar a `.switcher` o `.cluster` según análisis
   - `!important` overrides en `.main_home-container` NO se tocan (bloqueado por MainContainer refactor)
   - `calc(100dvh - 114px)`: extraer magic number a `--header-height: 114px` custom property en globals.css (documenta la excepción ADR-009 con un nombre, no con un número mágico)

4. **AC4: About page primitives** — `src/app/about/styles.css`:
   - `.main_about`: `flex flex-col` → `.stack`
   - `.about-headline-wrapper`: `flex flex-col` → `.stack`
   - `.about-content`: mobile `.stack`, tablet+ `.sidebar gap-8` con `--sidebar-main: 5fr; --sidebar-aside: 3fr`
   - `.about_biography-container`: `flex flex-col` → `.stack`
   - `.about-transition-node`: `mx-auto` → `.center`

5. **AC5: Projects page primitives** — `src/app/projects/styles.css`:
   - `.main_projects`: `flex flex-col` → `.stack`
   - `.projects-blade--hero`: `flex flex-col` → `.stack` (mantener min-height y scroll-snap)
   - `.projects-grid`: `grid auto-fill` → `.grid-fluid gap-8` con `--min: 320px`
   - Breakpoints responsive del grid se mantienen como overrides en CSS

6. **AC6: Articles page primitives** — `src/app/articles/styles.css`:
   - `.main_articles`: `flex flex-col` → `.stack`
   - `.articles-blade--hero`: `flex flex-col` → `.stack`
   - `.articles-blade--list`: `mx-auto` → `.center max-w-4xl`; `sm:mt-8` → `tablet:mt-8`
   - `.articles-list`: `flex flex-col` → `.stack`; `sm:gap-6` → `tablet:gap-6`

7. **AC7: Organism primitives (Wave 3)** — Migración de organismos de alto impacto:
   - Footer: `.footer-content` y `.footer-col` → `.stack` (mantener grid/flex-row overrides)
   - ProjectCard: `.project-card`, `__content` → `.stack`; `__tech-stack` → `.cluster`
   - ArticleCard: `.article-card`, `__content` → `.stack`
   - Auth: `.auth-modal`, `.auth-panel`, `.auth-form`, `.auth-field` → `.stack`; `.auth-oauth-row`, `.auth-tabs` → `.cluster`
   - Chat: `.chatbox_form`, `.form-message`, `.form-attachment` → `.stack`; `.form-hours_container` → `.cluster`
   - ArticleContent: `max-width: 800px; margin: 0 auto` → `.center max-w-[800px]`
   - ProjectDetail: `max-w-4xl mx-auto` → `.center max-w-4xl`; tech-list/links → `.cluster`
   - ExperienceStats: → `.switcher desktop:flex-row`
   - ArticleListItem: → `.switcher tablet:flex-row`

8. **AC8: Molecule primitives (Wave 4)** — Migración de moléculas:
   - TechnologyFilter: `__chips` → `.cluster`
   - SkillSelector: → `.cluster center`; `md:my-8` → `tablet:my-8`
   - Experience: `_header` → `.switcher`; `_tags` → `.cluster`
   - WordCloud: `.word-cloud` → `.stack`; skill-detail lists → `.cluster`

9. **AC9: Legacy breakpoint fixes oportunistas** — En cada archivo tocado, migrar legacy breakpoints que se encuentren:
   - `sm:` → invertir a `tablet:` (verificar caso por caso)
   - `md:` → invertir a `tablet:` o `nav:`
   - `xl:` → invertir a `desktop:`
   - Conteo inicial: 22 archivos con legacy breakpoints; migrar SOLO los que se tocan por primitives

10. **AC10: Snapshot regression guard** — Antes de Wave 2, correr `npm test -- --updateSnapshot` para capturar snapshots baseline de componentes críticos (ProjectCard, ArticleCard, Footer). Después de cada wave, correr `npm test` y verificar que snapshots no cambian. Diferencias mínimas de padding/margin/gap son aceptables si son intencionales (documentar en commit).

11. **AC11: Validación** — `npm run lint`, `npm run typecheck`, `npm test` pasan sin errores nuevos. `npm run build` exitoso.

## Tasks / Subtasks

- [x] Task 1: Wave 1 — Root Layout + MainContainer (AC: #1, #2)
  - [x] Agregar `min-height: 100dvh` fallback a `.layout` en globals.css
  - [x] Migrar `#main-content` a `.cover-principal` (evaluar: class en JSX vs CSS)
  - [x] Refactorizar MainContainer breakpoints: `xl:p-24 lg:p-16 md:p-12 sm:p-8` → `tablet:p-12 desktop:p-16`
  - [x] Validar: lint + typecheck + tests
- [x] Task 2: Wave 2 — Pages (AC: #3, #4, #5, #6)
  - [x] Home: migrar `.home-content`, `.home-slider-container`, `.home_contact-container`
  - [x] About: migrar `.main_about`, `.about-content` (stack→sidebar), `.about_biography-container`, `.about-transition-node`
  - [x] Projects: migrar `.main_projects`, `.projects-blade--hero`, `.projects-grid` → `.grid-fluid`
  - [x] Articles: migrar `.main_articles`, `.articles-blade--hero`, `.articles-blade--list`, `.articles-list`
  - [x] Fix legacy breakpoints encontrados en estos archivos
  - [x] Validar: lint + typecheck + tests
- [x] Task 3: Wave 3 — Organismos (AC: #7)
  - [x] Footer: `.footer-content`, `.footer-col` → `.stack`
  - [x] ProjectCard: card/content → `.stack`; tech-stack → `.cluster`
  - [x] ArticleCard: card/content → `.stack`
  - [x] Auth: modal/panel/form/field → `.stack`; oauth-row/tabs → `.cluster`
  - [x] Chat: form containers → `.stack`; hours container → `.cluster`
  - [x] ArticleContent: → `.center max-w-[800px]`
  - [x] ProjectDetail: → `.center max-w-4xl`; tech-list/links → `.cluster`
  - [x] ExperienceStats: → `.switcher desktop:flex-row`
  - [x] ArticleListItem: → `.switcher tablet:flex-row`
  - [x] Validar: lint + typecheck + tests (1066/1066, 103 suites)
- [x] Task 4: Wave 4 — Moléculas (AC: #8)
  - [x] TechnologyFilter: __chips → Cluster
  - [x] SkillSelector: → Cluster + Center; md:my-8 → tablet:my-8
  - [x] Experience: _header → Switcher; _tags → Cluster
  - [x] WordCloud: word-cloud → Stack; skill-detail → Stack; tech-list/companies-list/keywords-list → Cluster
  - [x] Validar: lint + typecheck + tests (1077/1077, 104 suites)
- [x] Task 5: Snapshot baseline + regression guard (AC: #10)
  - [x] Antes de Wave 2: baseline capturado (5 snapshots)
  - [x] Después de cada wave: snapshots estables (5/5 en todas las waves)
  - [x] No hubo diff de snapshot — todas las migraciones son CSS-only
- [x] Task 6: Validación final (AC: #11)
  - [x] `npm run lint` — 0 errors
  - [x] `npm run typecheck` — 0 errors
  - [x] `npm test` — 1077/1077 pasan, 5 snapshots estables
  - [x] `npm run build` — exitoso (shared JS: 88.5 kB, +0.4 kB vs baseline)

## Dev Notes

### Estrategia de Migración: CSS-in-CSS (Regla Estricta)

**REGLA MANDATORIA (Winston):** TODO lo que ya está en `@apply` dentro de archivos CSS se reemplaza con CSS nativo en el mismo archivo CSS. La ÚNICA excepción es `layout.tsx` que recibe `className="cover-principal"` en el `<main>` (porque el parent controla el child). No hay opciones — es una regla, no una sugerencia.

**Razón técnica:** `@apply stack` NO funciona (`@apply` no resuelve clases de `@layer utilities` en dev mode — globals.css línea 86). Por lo tanto, el CSS nativo del primitive se escribe directamente.

**Patrón de migración:**

```css
/* ANTES */
.main_about {
  @apply flex flex-col items-center justify-center w-full;
}

/* DESPUÉS */
.main_about {
  /* Layout: Stack primitive (Story 24.2) */
  display: flex;
  flex-direction: column;
  @apply items-center justify-center w-full;
}
```

**Única excepción JSX — layout.tsx:**

```tsx
<main id="main-content" className="cover-principal" tabIndex={-1}>
```

### Archivos a Tocar — Mapa Exacto

**Wave 1 (2 archivos):**
| Archivo | Cambios |
|---------|---------|
| `src/styles/globals.css` | +`min-height: 100dvh` a `.layout` |
| `src/ui/atoms/hocs/MainContainer/styles.css` | Legacy bp → semantic bp |

**Wave 2 (4 archivos):**
| Archivo | Stack | Center | Sidebar | Switcher | Cover | Grid Fluid | Legacy BP |
|---------|-------|--------|---------|----------|-------|------------|-----------|
| `src/app/styles.css` | 3 | — | — | 1? | — | — | sí |
| `src/app/about/styles.css` | 4 | 1 | 1 | — | — | — | — |
| `src/app/projects/styles.css` | 2 | — | — | — | — | 1 | sí |
| `src/app/articles/styles.css` | 3 | 1 | — | — | — | — | sí |

**Wave 3 (9 archivos):**
| Archivo | Stack | Cluster | Center | Switcher |
|---------|-------|---------|--------|----------|
| `src/ui/organisms/Footer/styles.css` | 2 | — | — | — |
| `src/ui/organisms/ProjectCard/styles.css` | 4 | 1 | — | — |
| `src/ui/organisms/ArticleCard/styles.css` | 4 | — | — | — |
| `src/ui/organisms/Auth/styles.css` | 4 | 3 | — | — |
| `src/ui/organisms/Chat/styles.css` | 3 | 1 | — | — |
| `src/ui/organisms/ArticleContent/styles.css` | — | — | 1 | — |
| `src/ui/organisms/ProjectDetail/styles.css` | — | 2 | 1 | — |
| `src/ui/organisms/ExperienceStats/styles.css` | — | — | — | 1 |
| `src/ui/molecules/ArticleListItem/styles.css` | — | — | — | 1 |

**Wave 4 (4 archivos):**
| Archivo | Cluster | Switcher | Stack |
|---------|---------|----------|-------|
| `src/ui/molecules/TechnologyFilter/styles.css` | 1 | — | — |
| `src/ui/molecules/SkillSelector/styles.css` | 1 | — | — |
| `src/ui/molecules/Experience/styles.css` | 1 | 1 | — |
| `src/ui/organisms/WordCloud/styles.css` | 3 | — | 1 |

**Total: ~19 CSS archivos + 1 TSX (layout.tsx)**

### Conteos Exactos de Migraciones

| Primitive | Sites a migrar | Archivos |
|-----------|---------------|----------|
| Stack | ~30 | 15 |
| Cluster | ~13 | 8 |
| Center | ~5 | 5 |
| Sidebar | 1 | 1 |
| Switcher | ~4 | 4 |
| Cover | 1 (root layout) | 1 |
| Grid Fluid | 1 | 1 |
| **Total** | **~55** | **~19** |

### Excepciones Documentadas (NO Migrar)

| Componente | Razón | Ref |
|------------|-------|-----|
| `.main_home-container` `!important` overrides | Bloqueado por MainContainer `inline-block` refactor | layout-patterns.md §7 |
| `calc(100dvh - 114px)` en Home hero | ADR-009 excepción — extraer a `--header-height` custom property | ADR-009 |
| AnimatedTitle `block → inline-block` switch | Display-mode switch, no es Switcher | layout-patterns.md §2.5 |
| Footer `flex-col → grid → flex-row` triple switch | Layout-system switch, demasiado específico | layout-patterns.md §2.5 |
| ProjectCard/ArticleCard featured `grid-row: 1/4` spanning | Row-spanning no cubierto por `.sidebar` base — mantener en CSS scoped | layout-patterns.md §2.4 |

### Legacy Breakpoint Mapping (para AC9)

| Legacy | Comportamiento | Semántico | Verificación |
|--------|---------------|-----------|--------------|
| `sm:` | max-width 639px | Invertir lógica → `tablet:` (min-width 640px) | Caso por caso |
| `md:` | max-width 767px | → `tablet:` o `nav:` | Caso por caso |
| `lg:` | max-width 1023px | → `desktop:` (min-width 1025px) | Caso por caso |
| `xl:` | max-width 1279px | → `desktop:` | Caso por caso |

**PRECAUCIÓN:** La inversión NO es mecánica. `sm:p-8` (padding 8 en ≤639px) NO es lo mismo que `tablet:p-8` (padding 8 en ≥640px). Hay que invertir la lógica: si `sm:p-8` reduce padding en mobile, el equivalente es que el padding base sea p-8 y se aumente con `tablet:p-12`.

### ADR-010: Violaciones de Margin Externo (Flag, No Fix)

Estos `margin-top`/`margin-bottom` en componentes violan ADR-010. **No fixear en esta story** — solo documentar para Story 24.3+:

| Archivo | Clase | Violación |
|---------|-------|-----------|
| ProjectCard/styles.css | `__content` | `mt-4` |
| ArticleCard/styles.css | `__content` | `mt-4` |
| Experience/styles.css | `__tags` | `mt-4` |
| ProjectDetail/styles.css | `__links` | `mt-8` |
| TechnologyFilter/styles.css | `__chips` | `mb-4` |
| SkillSelector/styles.css | `.skills_selector` | `mb-28` |

### Coupling Crítico (nav: 800px)

El breakpoint `nav: 800px` está hardcodeado en 3 lugares que DEBEN mantenerse sincronizados:
1. `tailwind.config.js` — definición del breakpoint
2. `MenuFloatingClient/index.tsx` — constante JS
3. `MobileMenuOverlay/index.tsx` — warning documentado

**NO tocar estos archivos en esta story.**

### Lecciones de Story 24.1 (Aplicar Aquí)

- CSS nativo, NO `@apply` para primitives en `@layer utilities`
- Verificar 0 colisiones de nombres con grep ANTES de migrar
- Conteos exactos obligatorios — no "~" ni "+"
- Cross-reference docs al terminar
- Tests de CSS: `fs.readFileSync` + string matching

### Risk Assessment

- **Riesgo ALTO:** Regresión visual — cada migración cambia CSS de producción
  - Mitigación: Waves incrementales con validación entre cada una
  - Mitigación: `npm run build` después de cada wave
- **Riesgo MEDIO:** Inversión incorrecta de legacy breakpoints
  - Mitigación: Verificar caso por caso, nunca mecánicamente
  - Mitigación: Comparar comportamiento visual antes/después
- **Riesgo BAJO:** Conflictos de especificidad con Tailwind
  - Mitigación: Primitives en `@layer utilities` tienen misma especificidad (verificado en Story 24.1 review)

### Project Structure Notes

- `src/styles/globals.css` — Root layout CSS (`.layout`, `#main-content`)
- `src/app/layout.tsx` — Root JSX layout (único archivo TSX a tocar)
- `src/app/*/styles.css` — Page-level CSS (4 archivos)
- `src/ui/organisms/*/styles.css` — Organism CSS (9 archivos)
- `src/ui/molecules/*/styles.css` — Molecule CSS (4 archivos)
- `src/ui/atoms/hocs/MainContainer/styles.css` — MainContainer (1 archivo)
- `.storybook/preview.ts` — NO requiere cambios (ya importa globals.css)

### References

- [Source: docs/architecture/layout-patterns.md] — Every Layout primitives, current codebase sites, implementation status
- [Source: docs/architecture/layout-audit-epic-24.md] — Exhaustive audit: 103 hardcoded widths, 84 heights, 25 CSS files with legacy bp
- [Source: docs/adr/008-spacing-scale.md] — Gap es responsabilidad del container, NO del primitive
- [Source: docs/adr/009-containment-rules.md] — `100dvh` con fallback `100vh`; `calc(100dvh - Xpx)` prohibido
- [Source: docs/adr/010-layout-component-separation.md] — Layout vs Component; margin externo prohibido en componentes
- [Source: docs/architecture/styles-architecture.md] — @apply policy, BEM naming, breakpoints
- [Source: src/styles/globals.css:86] — Warning: @apply can't resolve @layer classes from other files in dev mode
- [Source: _bmad-output/implementation-artifacts/24-1-implement-layout-primitives.md] — Story anterior: primitives implementados, 21 tests, 12 stories
- [Source: _bmad-output/implementation-artifacts/24-0-spatial-system-definition.md] — ADRs 008-010, layout audit, Senior Dev Review fixes
- [Source: _bmad-output/planning-artifacts/epics-v4.md] — Epic 24 definition, story dependencies

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
