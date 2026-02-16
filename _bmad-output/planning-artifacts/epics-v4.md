---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/epics-v3.md
  - _bmad-output/implementation-artifacts/epic-20-retro-2026-02-11.md
  - docs/architecture/typescript-migration.md
  - docs/architecture/import-rules.md
  - docs/architecture/styles-architecture.md
  - docs/architecture/layout-patterns.md
---

# portfolio-frontend-nextjs - Epic Breakdown (v4: Epics 22-24 Stories)

## Overview

Este documento extiende epics-v3 con stories detalladas para los Epics 22, 23 y 24. Los Epics 1-20 cubrieron todos los FRs originales (FR1-33). Epic 21 (Storybook) esta completamente implementado. Los Epics 22-24 abordan deuda tecnica estrategica identificada en Epic 20.

## Requirements Inventory

### Functional Requirements (FR1-33 — Todos Implementados)

> **Estado:** FR1-33 completamente implementados en Epics 1-20. No hay FRs pendientes del PRD original.

### Non-Functional Requirements (Pendientes)

| NFR | Target | Status |
|-----|--------|--------|
| NFR-P6 | First Load JS <100KB | ⚠️ Cercano, no enforced |
| NFR-P7 | Total Bundle <200KB gzipped | ⚠️ Cercano, no enforced |
| NFR-S2 | JWT HttpOnly cookies | ⏳ Requiere Rails backend |
| NFR-S3 | CORS configurado | ⏳ Requiere Rails backend |
| NFR-S4 | npm audit sin vulnerabilidades | ⚠️ --legacy-peer-deps |
| NFR-R4 | Service Worker offline cache | ⏳ Growth phase |

### Additional Requirements

**Architecture Requirements (Epic 20 docs):**
- AR1: ~170 archivos .js/.jsx pendientes de migracion a .ts/.tsx — 146 .jsx + 24 .js, concentrados 88% en UI layer
- AR2: TypeScript strict mode habilitado, zero `any` como objetivo — `tsconfig.json` ya tiene `strict: true`

**Technical Debt:**
- TD4: Barrel file cleanup — 56 barrel files, 10 protegidos por ESLint, icons barrel tiene 57 exports con 0 consumers
- TD5: Breakpoint migration — 46 legacy usages (max-width) en ~30 archivos, 64 semantic usages en ~20 archivos

**Layout Patterns (pendiente de implementar):**
- LP1: 7 Every Layout primitives definidos (Stack, Center, Cluster, Sidebar, Switcher, Cover, Grid) — CSS listo, falta agregar a globals.css
- LP2: MainContainer usa legacy breakpoints — migrar como parte de Epic 24

### Requirements Coverage Map

| Requirement | Epic | Descripcion |
|-------------|------|-------------|
| AR1, AR2 | **Epic 22** | TypeScript migration execution (~170 archivos) |
| TD4 | **Epic 23** | Barrel file cleanup + deprecation |
| TD5, LP1, LP2 | **Epic 24** | Breakpoint migration + Every Layout utilities |
| GR1 | Future | Microinteracciones y polish UX |
| GR2 | Future | Test coverage 80%+ |
| GR4 | Future | Error handling exhaustivo |
| GR5 | Future | Performance optimization (Service Worker) |
| VR1-VR5 | Future | Vision phase (design system, i18n, dev view, metrics, live chat) |
| TD1-TD3 | Backlog | Deuda tecnica (requiere Rails backend o decision) |
| DD1, DD2 | Backlog | Documentation refresh |

## Epic List

### Epic 22: TypeScript Migration Execution
Completar la migracion de ~170 archivos JS/JSX a TS/TSX siguiendo el plan de Story 20.7 y `docs/architecture/typescript-migration.md`.
**Requerimientos cubiertos:** AR1, AR2

### Epic 23: Barrel File Cleanup
Eliminar o deprecar barrel files innecesarios para mejorar tree-shaking, reducir bundle size, y alinear con las reglas documentadas en `docs/architecture/import-rules.md`.
**Requerimientos cubiertos:** TD4

**Story Breakdown:**

- **Story 23.1 — Icons Barrel Cleanup & ESLint Enforcement**
  - Eliminar todos los imports desde `@/icons` y migrarlos a rutas directas (`@/atoms/icons/GitHubIcon`)
  - Asegurar que el barrel de icons no tenga consumidores en `src/`
  - Complexity: Low

- **Story 23.2 — UI Barrel Audit & Cleanup (Atoms/Molecules/Organisms/Overlays)**
  - Auditar y limpiar todos los barrel files en la capa de UI aplicando la matriz de decisión de `import-rules.md`
  - Migrar imports de barrels prohibidos a rutas directas
  - Complexity: Medium

- **Story 23.3 — Safe Barrels en Lib, Domains, Hooks y State**
  - Asegurar que los barrels fuera de la capa UI usan solo patrones seguros
  - Eliminar `export *` si se consumen desde UI/App
  - Eliminar cascading (barrels que re-exportan desde otros barrels)
  - Complexity: Low-Medium

- **Story 23.4 — Tooling & Docs para Barrel Cleanup**
  - Automatizar la detección de barrel imports prohibidos
  - Documentar el proceso de cleanup en `import-rules.md`
  - Verificar/mejorar ESLint rule `no-barrel-imports-in-ui`
  - Complexity: Low

**Documentación detallada:** `_bmad-output/implementation-artifacts/epic-23-barrel-file-cleanup.md`

### Epic 24: Spatial System & Layout Stabilization
Definir el sistema espacial del proyecto (spacing scale, reglas de contencion, separacion layout/componente), implementar Every Layout primitives, migrar breakpoints legacy a semanticos, y estabilizar el comportamiento vertical del layout.
**Requerimientos cubiertos:** TD5, LP1, LP2
**Origen:** Retro Epic 23 (epic-23-retro-2026-02-16.md) — reframed de "Breakpoint Migration" a "Spatial System"

**Contexto del Reframe:**

Epic 24 fue originalmente planificado como una migracion 1:1 de breakpoints legacy (max-width) a semanticos (min-width). La retrospectiva de Epic 23 revelo que el problema real es mas profundo:

- El sistema responde en ancho pero no tiene reglas de contencion vertical
- Componentes definen espacio que deberia ser responsabilidad del layout contenedor
- No hay spacing scale definida, ni max-width policy, ni min-height strategy
- `position:absolute` fragiles, z-index sin sistematizar, overflow inconsistente

El reframe: **Epic 24 no es una migracion de breakpoints. Es la definicion del sistema espacial del proyecto.**

Tres niveles a separar:
1. **Layout** — flujo, stacking, distribucion, limites, contencion, relacion espacial
2. **Componente** — identidad visual, comportamiento, variaciones, estados
3. **Reglas de composicion** — como componentes se relacionan dentro de layouts

**Story Breakdown:**

- **Story 24.0 — Spatial System Definition (Architectural)**
  - Definir el sistema espacial antes de cualquier migracion tecnica
  - Deliverables: 3 ADRs (spacing scale, containment rules, layout vs component) + layout audit document
  - NO se toca codigo productivo
  - Extensible: 0-A, 0-B, 0-C si el scope se abre
  - Definition of Done: ADRs versionados en `/docs/adr`, tabla de espaciado, lista de anti-patterns, aprobacion explicita
  - Complexity: Medium (investigacion + definicion, no implementacion)

- **Story 24.1 — Implement Layout Primitives**
  - Implementar 7 Every Layout primitives en globals.css: Stack, Center, Cluster, Sidebar, Switcher, Cover, Grid
  - Documentar patterns y ejemplos de uso
  - Crear stories en Storybook para cada primitive
  - Prerequisito: Story 24.0 completada
  - Complexity: Medium

- **Story 24.2 — Migrate Page by Page**
  - Migrar layouts de paginas a usar Layout Primitives
  - Eliminar width hardcodeados en componentes
  - Aplicar max-width en layouts, min-height en secciones
  - Refactorizar MainContainer a semantic breakpoints
  - Prerequisito: Story 24.1 completada
  - Complexity: High (toca multiples archivos, riesgo visual)

- **Story 24.3 — Vertical Viewport E2E Tests**
  - Crear Playwright tests que reduzcan altura y validen no-superposicion
  - Tests de viewport vertical para secciones criticas
  - Validar overflow y contencion en todos los breakpoints
  - Prerequisito: Story 24.2 completada
  - Complexity: Medium

- **Story 24.4 — Breakpoint Normalization**
  - Reemplazar 46 usages de legacy breakpoints (sm:, md:, lg:, xl:, 2xl:, xs:) con semantic equivalents
  - Eliminar definiciones de breakpoints legacy de tailwind.config.js
  - Verificar visual regression por breakpoint
  - Prerequisito: Story 24.2 completada (layouts ya estables)
  - Complexity: Medium-High

- **Story 24.5 — CLS Validation & Stabilization**
  - Medir y validar Cumulative Layout Shift (CLS < 0.1)
  - Lighthouse gates para CLS
  - Performance testing final
  - Verificar bundle size no incremento
  - Prerequisito: Stories 24.2-24.4 completadas
  - Complexity: Low-Medium

**Metricas de exito:**
- Zero legacy max-width breakpoints en codebase
- 7 Every Layout primitives implementados y documentados
- CLS < 0.1 en todas las paginas
- Lighthouse scores >= 90 mantenidos
- Bundle size no incrementado
- E2E viewport vertical tests pasando

**Riesgos:**
- Visual regression en layouts responsivos (HIGH) — mitigacion: E2E Playwright + CLS gates
- Scope creep en Story 24.2 (MEDIUM) — mitigacion: Story 0 define contratos antes de codigo
- Documentacion inconsistente (MEDIUM) — mitigacion: sync docs como paso de review (acuerdo retro Epic 23)

**Documentacion de referencia:**
- `docs/architecture/layout-patterns.md` — Layout patterns actuales
- `docs/architecture/styles-architecture.md` — CSS patterns, breakpoints
- `CLAUDE.md` — Responsive Breakpoint System section
- ADR-002 — Breakpoint migration guidance
- `_bmad-output/implementation-artifacts/epic-23-retro-2026-02-16.md` — Origen del reframe

---
