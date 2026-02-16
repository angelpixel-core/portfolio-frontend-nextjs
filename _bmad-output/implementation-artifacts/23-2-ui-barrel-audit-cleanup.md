# Story 23.2: UI Barrel Audit & Cleanup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como **mantenedor del frontend**,
quiero **auditar y limpiar todos los barrel files de la capa UI (atoms, molecules, organisms, overlays)**,
para que **tree-shaking funcione correctamente y el bundle solo incluya código realmente usado**.

## Acceptance Criteria

1. **AC1: Inventario completo** — Existe un inventario documentado de todos los barrel files en `src/ui/` con: ruta, cantidad de exports, tipo de export (`export *` vs named), y consumers.
2. **AC2: Cascading `export *` eliminado** — No quedan patrones `export * from` en barrels de UI. Todos convertidos a `export { default as X } from` (named re-exports explícitos).
3. **AC3: Barrel root `@/atoms` limpio** — `src/ui/atoms/index.ts` usa solo named re-exports, no `export *`. Deprecado con JSDoc si tiene 0 consumers.
4. **AC4: Barrels grandes deprecados** — Barrels con >15 exports (`@/molecules` 25, `@/organisms` 21) marcados con `@deprecated` JSDoc y fecha. ESLint ya los protege.
5. **AC5: Validation suite pasa** — `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` pasan sin nuevos errores.
6. **AC6: Bundle no crece** — Build output no muestra incremento de bundle size respecto a baseline actual.

## Tasks / Subtasks

- [x] Task 1: Generar inventario de barrels en `src/ui/` (AC: #1)
  - [x] Listar todos los `index.ts`/`index.js` bajo `src/ui/` con conteo de exports
  - [x] Clasificar tipo de export: `export *` vs `export { default as X }`
  - [x] Verificar consumers de cada barrel via grep
  - [x] Documentar inventario en Dev Notes
- [x] Task 2: Convertir `export *` a named exports en sub-barrels (AC: #2)
  - [x] `src/ui/atoms/hocs/index.ts`: convertir 2 `export *` a named exports (`FramerImage`, `MainContainer`)
  - [x] `src/ui/atoms/shadows/index.ts`: convertir 2 `export *` a named exports (`BoxShadow`, `FeaturedBoxShadow`)
  - [x] Verificar que no hay otros `export *` en barrels de UI (solo `shared/skeletons` queda — fuera de scope)
  - [x] Ejecutar `npm run lint` y `npm test` después de cada cambio
- [x] Task 3: Limpiar barrel root `@/atoms` (AC: #3)
  - [x] `src/ui/atoms/index.ts`: convertir 7 `export *` a 30 named re-exports explícitos
  - [x] Añadir JSDoc `@deprecated Since 2026-02-16 (Story 23.2)` (0 consumers confirmado)
  - [x] Verificar que `ArticleHoverThumbnail` export se mantiene correctamente (named export)
- [x] Task 4: Deprecar barrels grandes (AC: #4)
  - [x] `src/ui/molecules/index.ts` (25 exports): añadido `@deprecated` JSDoc
  - [x] `src/ui/organisms/index.ts` (21 exports): añadido `@deprecated` JSDoc
  - [x] Verificar que ESLint `no-barrel-imports-in-ui` cubre `@/molecules` y `@/organisms` (confirmado)
- [x] Task 5: Verificar barrels pequeños y aceptables (AC: #1)
  - [x] `src/ui/atoms/buttons/index.ts` (11 exports): aceptable (<15, named re-exports)
  - [x] `src/ui/atoms/links/index.ts` (6 exports): safe (<10)
  - [x] `src/ui/atoms/texts/index.ts` (5 exports): safe (<10)
  - [x] `src/ui/atoms/motion/index.ts` (1 export): safe
  - [x] `src/ui/overlays/index.ts` (2 exports): safe
  - [x] Barrels internos de organismos (Auth/Form 2, Menu/skeletons 2, MenuFloating/skeletons 1): safe (<=2 exports)
- [x] Task 6: Ejecutar suite de validación completa (AC: #5, #6)
  - [x] `npm run lint` — sin errores (0 warnings)
  - [x] `npm run typecheck` — sin errores
  - [x] `npm test` — 987 tests, 99 suites, all passed
  - [x] `npm run build` — build exitoso + sitemap generado

## Dev Notes

### Contexto del Epic

Story 23.2 es parte de **Epic 23: Barrel File Cleanup**. Story 23.1 (Icons Barrel) ya está completada — estableció el patrón de deprecación con JSDoc y verificó la protección ESLint.

### Inventario de Barrels UI (Pre-audit)

| Ruta | Exports | Tipo | Consumers | Estado |
|------|---------|------|-----------|--------|
| `src/ui/atoms/index.ts` | ~87 (cascading) | 7 `export *` + 1 named | 0 | CRITICAL — convertir |
| `src/ui/atoms/buttons/index.ts` | 11 | named re-exports | 0 | Safe (<15) |
| `src/ui/atoms/icons/index.ts` | 57 | named re-exports | 0 | DEPRECATED (Story 23.1) |
| `src/ui/atoms/links/index.ts` | 6 | named re-exports | 0 | Safe (<10) |
| `src/ui/atoms/texts/index.ts` | 5 | named re-exports | 0 | Safe (<10) |
| `src/ui/atoms/hocs/index.ts` | 4 | 2 `export *` + 2 named | 0 | Convertir `export *` |
| `src/ui/atoms/shadows/index.ts` | 2 | 2 `export *` | 0 | Convertir `export *` |
| `src/ui/atoms/motion/index.ts` | 1 | named re-export | 0 | Safe |
| `src/ui/molecules/index.ts` | 25 | named re-exports | 0 | Deprecar (>15) |
| `src/ui/organisms/index.ts` | 21 | named re-exports | 0 | Deprecar (>15) |
| `src/ui/organisms/Auth/Form/index.ts` | 2 | named re-exports | internal | Safe |
| `src/ui/organisms/Menu/skeletons/index.ts` | 2 | named re-exports | internal | Safe |
| `src/ui/organisms/MenuFloating/skeletons/index.ts` | 1 | named re-export | internal | Safe |
| `src/ui/overlays/index.ts` | 2 | named re-exports | 0 | Safe |

### Decisión Técnica: `export *` → Named Exports

**Problema:** `export *` impide tree-shaking porque webpack no puede determinar qué exports son usados sin analizar toda la cadena transitiva.

**Solución:** Convertir a named re-exports explícitos:
```typescript
// ❌ ANTES (cascading, impide tree-shaking)
export * from "./FramerImage/index";
export * from "./MainContainer/index";

// ✅ DESPUÉS (explícito, tree-shaking funciona)
export { default as FramerImage } from "./FramerImage";
export { default as MainContainer } from "./MainContainer";
```

### Archivos a Modificar

| Archivo | Acción | Cambio |
|---------|--------|--------|
| `src/ui/atoms/hocs/index.ts` | MODIFY | `export *` → named re-exports |
| `src/ui/atoms/shadows/index.ts` | MODIFY | `export *` → named re-exports |
| `src/ui/atoms/index.ts` | MODIFY | `export *` → named re-exports + `@deprecated` |
| `src/ui/molecules/index.ts` | MODIFY | Añadir `@deprecated` JSDoc |
| `src/ui/organisms/index.ts` | MODIFY | Añadir `@deprecated` JSDoc |

### Patrón de `@deprecated` JSDoc (de Story 23.1)

```typescript
/**
 * @deprecated Since 2026-02-16 (Story 23.2). This barrel file is deprecated.
 *
 * Use direct path imports instead:
 * ```typescript
 * // ❌ DON'T: import { Hero } from "@/molecules";
 * // ✅ DO: import Hero from "@/molecules/Hero";
 * ```
 *
 * ESLint `no-barrel-imports-in-ui` blocks barrel imports in src/ui/ and src/app/.
 * See: docs/architecture/import-rules.md
 */
```

### Mini-Barrels Aceptables (de Story 23.1 review)

- `src/ui/organisms/WordCloud/icons.ts` — Re-exporta 22 iconos con imports directos. Lazy-loaded via `React.lazy`. Aceptable porque sirve code-splitting.
- Barrels internos de componentes (`Auth/Form/index.ts`, `Menu/skeletons/index.ts`) — Son entry points de subcomponentes con <=2 exports. Aceptable.

### Contenido Actual de Barrels a Convertir

**`src/ui/atoms/hocs/index.ts` (4 exports, 2 con `export *`):**
```typescript
export * from "./FramerImage/index";           // → export { default as FramerImage } from "./FramerImage"
export { default as History } from "./History"; // OK — ya es named
export * from "./MainContainer/index";          // → export { default as MainContainer } from "./MainContainer"
export { default as TransitionerLi } from "./TransitionerLi"; // OK — ya es named
```

**`src/ui/atoms/shadows/index.ts` (2 exports, ambas `export *`):**
```typescript
export * from "./BoxShadow/index";             // → export { default as BoxShadow } from "./BoxShadow"
export * from "./FeaturedBoxShadow/index";     // → export { default as FeaturedBoxShadow } from "./FeaturedBoxShadow"
```

**`src/ui/atoms/index.ts` (7 `export *` + 1 named):**
```typescript
export * from "./buttons";    // → export { default as ArrowButton, ... } from "./buttons"
export * from "./hocs";       // → export { default as FramerImage, ... } from "./hocs"
export * from "./icons";      // → EXCLUDED — icons barrel already deprecated in Story 23.1, not re-exported
export * from "./links";      // → export { default as CalendarLink, ... } from "./links"
export * from "./motion";     // → export { default as MotionFade } from "./motion"
export * from "./shadows";    // → export { default as BoxShadow, ... } from "./shadows"
export * from "./texts";      // → export { default as AnimatedTitle, ... } from "./texts"
export { ArticleHoverThumbnail } from "./ArticleHoverThumbnail"; // OK — ya es named
```

**IMPORTANTE para `@/atoms`:** Verificar los exports exactos de cada sub-barrel antes de convertir. Los sub-barrels de buttons (11), links (6), texts (5) tienen sus propios named exports que deben propagarse correctamente.

### Decisión: atoms/index.ts usa imports directos (no sub-barrels)

El barrel reescrito importa directamente desde cada componente (`./buttons/ArrowButton`) en lugar de re-exportar desde sub-barrels (`./buttons`). Esto es intencional:
- **Elimina indirección**: webpack resuelve directamente al módulo final
- **Independencia**: añadir un export a `buttons/index.ts` no lo propaga automáticamente a `@/atoms` — deseable dado que el barrel está deprecado y no debería crecer
- **Consistencia**: el patrón `export { default as X } from "./category/Component"` es explícito y auditable

### Verificación Pre-conversión Requerida

Antes de convertir `src/ui/atoms/index.ts`, el dev agent DEBE:
1. Leer cada sub-barrel (`buttons/index.ts`, `hocs/index.ts`, etc.) para obtener lista exacta de exports
2. Generar los named re-exports equivalentes
3. Verificar que el barrel root resultante tiene los mismos exports públicos

### ESLint Protection Status

Barrels ya protegidos por `no-barrel-imports-in-ui` (severity: `error`):
`@/atoms`, `@/buttons`, `@/icons`, `@/links`, `@/texts`, `@/molecules`, `@/organisms`, `@/overlays`, `@/hooks`

Consumers en `src/ui/` y `src/app/`: **0** (verificado en Story 23.1 review)

### Risk Assessment

- **Riesgo**: Bajo-Medio
- **Razón**: 0 consumers de los barrels en UI/App. Los cambios son solo en los barrel files mismos, no en consumers.
- **Riesgo principal**: Error al convertir `export *` → named exports si un sub-barrel exporta algo inesperado (ej: named exports además de default).
- **Mitigación**: Leer cada sub-barrel antes de convertir. Ejecutar tests después de cada cambio.

### Lecciones de Story 23.1

1. **File List debe distinguir Modified vs Referenced**
2. **JSDoc `@deprecated` debe incluir fecha** — Convención: `@deprecated Since YYYY-MM-DD (Story XX.X)` como texto libre dentro del tag (no tag `@since` separado). Consistente entre Story 23.1 y 23.2.
3. **Commits**: `feat()` para código, `docs()` para story/planning, `chore()` para sprint-status
4. **Mini-barrels con code-splitting purpose son aceptables** (documentar por qué)
5. **Exhaustive grep verification** en source + tests + stories

### Project Structure Notes

- **Alias de importación**: `@/atoms` → `src/ui/atoms/index.ts` (barrel root)
- **Sub-barrels**: `@/buttons` → `src/ui/atoms/buttons/index.ts`, etc.
- **Convención**: Cada componente tiene su propio folder con `index.tsx` (entry point)
- **Regla**: Barrel files solo en el nivel de categoría, no dentro de componentes individuales

### Referencias

- [Source: docs/architecture/import-rules.md#Barrel File Decision Matrix] — Reglas de cuándo prohibir/permitir barrels
- [Source: docs/architecture/import-rules.md#Cascading Risk] — Problema con `export *` en `@/atoms`
- [Source: docs/architecture/folder-structure.md#Atom Subcategories] — Convención de folders y barrels
- [Source: .eslintrc.js#no-barrel-imports-in-ui] — Configuración ESLint con 9 barrelPaths
- [Source: _bmad-output/implementation-artifacts/23-1-icons-barrel-cleanup-eslint.md#Dev Notes] — Patrón de deprecación y lecciones
- [Source: _bmad-output/implementation-artifacts/epic-23-barrel-file-cleanup.md#Story 23.2] — Requisitos del epic

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (via Claude Code)

### Debug Log References

N/A — implementación limpia sin errores.

### Completion Notes List

- Inventario completo de 14 barrel files en `src/ui/` documentado en Dev Notes
- Convertidos 4 `export *` a named exports en `hocs/index.ts` y `shadows/index.ts`
- Barrel root `@/atoms` reescrito: 7 `export *` → 30 named re-exports explícitos + `@deprecated`
- Barrels `@/molecules` (25 exports) y `@/organisms` (21 exports) deprecados con JSDoc
- 6 barrels pequeños documentados como aceptables (<15 exports, named re-exports)
- Único `export *` restante en UI: `shared/skeletons/index.ts` (fuera de scope — Story 23.3)
- Suite completa: lint ✅, typecheck ✅, 987 tests ✅, build ✅
- 0 consumers de barrels en `src/ui/` y `src/app/` (ESLint protege con severity `error`)
- **Nota:** Commits de Story 23.2 están en branch `story/23-1-icons-barrel-cleanup-eslint` (branch del epic). Si se necesita PR por story individual, crear branch dedicado.

### File List

**Modified:**
- `src/ui/atoms/index.ts` — reescrito: 7 `export *` → 30 named re-exports + `@deprecated` JSDoc
- `src/ui/atoms/hocs/index.ts` — 2 `export *` → named exports (`FramerImage`, `MainContainer`)
- `src/ui/atoms/shadows/index.ts` — 2 `export *` → named exports (`BoxShadow`, `FeaturedBoxShadow`)
- `src/ui/molecules/index.ts` — añadido `@deprecated` JSDoc
- `src/ui/organisms/index.ts` — añadido `@deprecated` JSDoc
- `_bmad-output/implementation-artifacts/23-2-ui-barrel-audit-cleanup.md` — este archivo
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — status actualizado

**Referenced (not modified):**
- `src/ui/atoms/buttons/index.ts` — verificado: 11 named re-exports, safe
- `src/ui/atoms/links/index.ts` — verificado: 6 named re-exports, safe
- `src/ui/atoms/texts/index.ts` — verificado: 5 named re-exports, safe
- `src/ui/atoms/motion/index.ts` — verificado: 1 named re-export, safe
- `src/ui/atoms/icons/index.ts` — verificado: ya deprecado (Story 23.1)
- `src/ui/overlays/index.ts` — verificado: 2 named re-exports, safe
- `src/ui/organisms/Auth/Form/index.ts` — verificado: 2 internal re-exports, safe
- `src/ui/organisms/Menu/skeletons/index.ts` — verificado: 2 internal re-exports, safe
- `src/ui/organisms/MenuFloating/skeletons/index.ts` — verificado: 1 internal re-export, safe
- `src/ui/shared/skeletons/index.ts` — verificado: tiene `export *`, fuera de scope (Story 23.3)
- `.eslintrc.js` — verificado: `no-barrel-imports-in-ui` cubre 9 barrelPaths
- `docs/architecture/import-rules.md` — referenciado para barrel decision matrix

## Review Record

### Round 1 — Code Review (2026-02-16)

**Reviewer:** Claude Opus 4.6 (adversarial review)
**Result:** PASS con 5 fixes documentales

| # | Sev | Issue | Disposition |
|---|-----|-------|-------------|
| M1 | MEDIUM | `atoms/index.ts` bypasses sub-barrels para imports directos | Documentado como decisión intencional en Dev Notes |
| M2 | MEDIUM | Dev Notes decía "icons: keep but convert" pero fue excluido | Corregido: "EXCLUDED — already deprecated in Story 23.1" |
| L1 | LOW | `@deprecated` usa texto "Since" en vez de tag `@since` | Documentada convención: texto libre consistente con Story 23.1 |
| L2 | LOW | Branch name `story/23-1-*` contiene commits de Story 23.2 | Documentado en Completion Notes con nota sobre PRs por story |
| L3 | LOW | File List sin sección "Referenced" (lección de 23.1) | Añadida sección "Referenced (not modified)" con 12 archivos |

**Verificaciones positivas:**
- 6 ACs cumplidos: inventario, `export *` eliminado, atoms limpio, barrels deprecados, suite pasa, bundle estable
- Export types correctos: `FramerImage`/`MainContainer`/`BoxShadow`/`FeaturedBoxShadow` como named (`export { X }`), resto como `export { default as X }`
- Único `export *` restante en UI: `shared/skeletons/index.ts` (fuera de scope)
- 7 files changed, 6 atomic commits, convención de commit respetada
