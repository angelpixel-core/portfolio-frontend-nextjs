---
version: 1
scope: 'Epic 17'
baselineEpic: 16
status: draft
sourceDocument: '_bmad-output/analysis/code-quality-and-refactorization-2026-02-06.md'
type: technical-debt
---

# Portfolio Frontend - Epic 17: Code Quality & Refactorization

## Overview

Este documento proporciona el desglose de épica e historias para la mejora de calidad de código, basado en el análisis de ingeniería completado el 2026-02-06.

**Contexto:** Epics 1-16 completados. Este epic aborda deuda técnica acumulada.

**Foco:** Mantenibilidad, reducción de complejidad accidental, consistencia de patrones, type safety.

**Tipo:** Technical Debt / Refactorization (no agrega funcionalidad nueva)

---

## Arquitectura Target (Post-Refactor)

| Área | Estado Actual | Estado Target |
|------|---------------|---------------|
| **Archivos vacíos/muertos** | 8 | 0 |
| **Duplicación Focus Ring** | 26 ocurrencias | 1 utility |
| **Duplicación Query Hooks** | ~250 líneas | ~50 líneas |
| **Domains sin TypeScript** | 4 completos + 3 parciales | 0 |
| **Sistemas de breakpoints** | 3 | 1 (semántico) |
| **Schemas Zod vacíos** | 4 | 0 |

---

## Restricciones: NO HACER

| ❌ NO hacer | Razón |
|-------------|-------|
| Migrar Redux → Zustand | Funcional, cambio grande sin ROI inmediato |
| Cambiar App Router structure | Riesgo SEO, requiere E2E completos primero |
| Reestructurar carpetas UI grandes | Alto riesgo, bajo beneficio inmediato |
| Introducir nuevas librerías | Estabilizar primero lo existente |
| Refactor Framer Motion | Funciona, priorizar después de auditoría performance |
| Migrar breakpoints legacy masivamente | Solo migrar cuando se toque componente por otra razón |

---

## Requirements Inventory

### Technical Requirements (TRs)

**Dead Code & Cleanup:**

| ID | Requirement | Phase |
|----|-------------|-------|
| TR17.1 | Eliminar hooks vacíos (useIsMobile, useOutsideClick, useScrollLock) | 1 |
| TR17.2 | Eliminar adapter Zustand (no instalado) | 1 |
| TR17.3 | Eliminar comentarios residuales ("HASTA aca aver que pasa") | 1 |
| TR17.4 | Renombrar skeletons a lowercase (4 archivos) | 1 |
| TR17.5 | Fix import duplicado en articles/layout.tsx | 1 |

**CSS Consolidation:**

| ID | Requirement | Phase |
|----|-------------|-------|
| TR17.6 | Crear @layer utilities con .focus-ring en globals.css | 2 |
| TR17.7 | Reemplazar 26 focus-visible blocks con @apply focus-ring | 2 |
| TR17.8 | Extraer glass-effect a utility class | 2 |
| TR17.9 | Mover brand colors a tailwind.config.js | 2 |
| TR17.10 | Eliminar duplicación CSS NavBar/Menu | 2 |

**TypeScript Migration:**

| ID | Requirement | Phase |
|----|-------------|-------|
| TR17.11 | Crear schemas Zod: content, customer, experience-stat, navigation-item | 3 |
| TR17.12 | Migrar model/index.js → .ts: contact-point, profile, technology | 3 |
| TR17.13 | Migrar mock.js → mock.ts: technology | 3 |
| TR17.14 | Actualizar cacheTime → gcTime en hooks JS | 3 |
| TR17.15 | Fix typo QUERY_KEY ('experiencie' → 'experience') | 3 |

**Query Hook Factory:**

| ID | Requirement | Phase |
|----|-------------|-------|
| TR17.16 | Crear src/lib/createQueryHook.ts con factory genérica | 4 |
| TR17.17 | Crear src/lib/queryConfig.ts con DEFAULT_STALE_TIME, DEFAULT_GC_TIME | 4 |
| TR17.18 | Migrar 11 hooks a usar factory | 4 |

**Breakpoint Standardization:**

| ID | Requirement | Phase |
|----|-------------|-------|
| TR17.19 | Documentar decisión: agregar breakpoints a config VS migrar Experience | 5 |
| TR17.20 | Eliminar media queries con magic numbers (400px, 480px) | 5 |
| TR17.21 | Marcar legacy breakpoints como @deprecated | 5 |

**Export & Barrel Cleanup:**

| ID | Requirement | Phase |
|----|-------------|-------|
| TR17.22 | Estandarizar exports: default exports everywhere | 6 |
| TR17.23 | Migrar NeumorphicToggle, FeaturedProject, Project, TechnologyFilter | 6 |
| TR17.24 | Eliminar exports comentados en organisms/index.js | 6 |

**State Management Cleanup:**

| ID | Requirement | Phase |
|----|-------------|-------|
| TR17.25 | Migrar menuPanel/ de .js a .ts | 7 |
| TR17.26 | Consolidar selectores en EmailClipboard | 7 |
| TR17.27 | Extraer RootState type del store | 7 |

---

### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR17.1 | `npm run predeploy` pasa al 100% después de cada historia |
| NFR17.2 | No hay regresiones visuales (screenshots A/B) |
| NFR17.3 | Tiempo de build no aumenta >10% |
| NFR17.4 | Cada historia es deployable independientemente |
| NFR17.5 | Tests existentes siguen pasando al 100% |

---

## Epic 17: Code Quality & Refactorization

**Objetivo:** El equipo de desarrollo experimenta un codebase más limpio, consistente y mantenible, con type safety mejorado y duplicación reducida.

**TRs cubiertos:** TR17.1-TR17.27
**NFRs aplicados:** NFR17.1-NFR17.5

---

### Risk Assessment

| Riesgo | Stories | Nivel | Mitigación |
|--------|---------|-------|------------|
| Layout breakpoints | 17.5 | 🔴 Alto | Tests visuales antes/después, Playwright |
| Query Hook Factory | 17.4 | 🔴 Alto | Tests unitarios por domain |
| TypeScript migration | 17.3 | 🟡 Medio | Migrar con strict: false primero |
| Focus Ring extraction | 17.2 | 🟡 Medio | Test manual WCAG 2.4.7 |
| Dead code removal | 17.1 | 🟢 Bajo | Verificar no hay imports |

---

### Story Summary

| # | Story | TRs | Riesgo | Esfuerzo | Fase |
|---|-------|-----|--------|----------|------|
| **17.1** | Quick Wins: Dead Code Removal | TR17.1-TR17.5 | 🟢 Bajo | 1-2 días | 1 |
| **17.2** | CSS Utilities Consolidation | TR17.6-TR17.10 | 🟡 Medio | 2-3 días | 2 |
| **17.3** | Domain TypeScript Migration | TR17.11-TR17.15 | 🟡 Medio | 3-5 días | 3 |
| **17.4** | Query Hook Factory | TR17.16-TR17.18 | 🔴 Alto | 2-3 días | 4 |
| **17.5** | Breakpoint Standardization | TR17.19-TR17.21 | 🔴 Alto | 3-5 días | 5 |
| **17.6** | Export & Barrel Cleanup | TR17.22-TR17.24 | 🟢 Bajo | 1-2 días | 6 |
| **17.7** | State Management Cleanup | TR17.25-TR17.27 | 🟢 Bajo | 1-2 días | 7 |

---

## Story Details

### Story 17.1: Quick Wins - Dead Code Removal ✏️

**Fase:** 1 - Quick Wins
**Esfuerzo:** 1-2 días
**Riesgo:** 🟢 Bajo

**Objetivo:** Limpiar sin cambiar comportamiento

#### Tasks

- [ ] **T1:** Eliminar `src/hooks/ui/useIsMobile.js` (VACÍO)
- [ ] **T2:** Eliminar `src/hooks/ui/useOutsideClick.js` (VACÍO)
- [ ] **T3:** Eliminar `src/hooks/ui/useScrollLock.js` (VACÍO)
- [ ] **T4:** Eliminar `src/state/adapters/zustand/` (placeholder sin implementar)
- [ ] **T5:** Eliminar comentario "HASTA aca aver que pasa" en `src/state/providers/ReduxProvider/index.jsx` línea 4
- [ ] **T6:** Renombrar `src/ui/atoms/links/NavigationItemLink/Skeleton.jsx` → `skeleton.jsx`
- [ ] **T7:** Renombrar `src/ui/molecules/SocialNetworkLink/Skeleton.jsx` → `skeleton.jsx`
- [ ] **T8:** Renombrar `src/ui/molecules/WhatsApp/Skeleton.tsx` → `skeleton.tsx`
- [ ] **T9:** Fix import duplicado en `src/app/articles/layout.tsx`
- [ ] **T10:** Actualizar barrel files si hay imports rotos

#### Acceptance Criteria

```gherkin
Given el codebase actual con archivos vacíos y código muerto
When ejecuto las tareas de limpieza
Then los archivos vacíos son eliminados
And los skeletons siguen patrón lowercase
And npm run build pasa sin errores
And npm test pasa al 100%
And grep de archivos eliminados devuelve 0 resultados
```

#### Definition of Done

- [ ] `npm run build` pasa sin errores
- [ ] `npm test` pasa al 100%
- [ ] `grep -r "useIsMobile\|useOutsideClick\|useScrollLock" src/` devuelve 0
- [ ] `grep -r "zustand" src/` devuelve 0
- [ ] Todos los skeletons siguen patrón `skeleton.tsx` (lowercase)

---

### Story 17.2: CSS Utilities Consolidation ✏️

**Fase:** 2 - CSS Consolidation
**Esfuerzo:** 2-3 días
**Riesgo:** 🟡 Medio

**Objetivo:** Single source of truth para estilos comunes

#### Tasks

- [ ] **T1:** Crear `@layer utilities` con `.focus-ring` en `src/app/globals.css`
- [ ] **T2:** Documentar focus-ring utility en comentario CSS
- [ ] **T3:** Reemplazar focus-visible blocks en AuthButton
- [ ] **T4:** Reemplazar focus-visible blocks en ThemeButton
- [ ] **T5:** Reemplazar focus-visible blocks en ChatButton
- [ ] **T6:** Reemplazar focus-visible blocks en MenuButton
- [ ] **T7:** Reemplazar focus-visible blocks en ArrowButton
- [ ] **T8:** Reemplazar focus-visible blocks en CopyButton
- [ ] **T9:** Reemplazar focus-visible blocks en HireMeButton
- [ ] **T10:** Reemplazar focus-visible blocks en HireMeHeaderButton
- [ ] **T11:** Reemplazar focus-visible blocks en NavigationItemButton
- [ ] **T12:** Reemplazar focus-visible blocks en CalendarLink
- [ ] **T13:** Reemplazar focus-visible blocks restantes (2 más)
- [ ] **T14:** Crear `.glass-effect` utility class
- [ ] **T15:** Reemplazar glass effect en Floating/styles.css
- [ ] **T16:** Reemplazar glass effect en Auth/styles.css
- [ ] **T17:** Agregar brand colors a `tailwind.config.js` (extend.colors)
- [ ] **T18:** Eliminar CSS duplicado de brand colors en NavBar/styles.css
- [ ] **T19:** Eliminar CSS duplicado de brand colors en Menu/styles.css
- [ ] **T20:** Test visual en todos los breakpoints + dark mode

#### Acceptance Criteria

```gherkin
Given estilos focus duplicados en 12 archivos
When extraigo a utility class
Then existe una sola definición de focus-ring
And todos los componentes usan @apply focus-ring
And no hay diferencias visuales
And dark mode funciona correctamente
```

#### Definition of Done

- [ ] `grep -r "outline: 3px solid #0066cc" src/` devuelve 0
- [ ] `grep -r "outline-color: #66b3ff" src/` devuelve 0
- [ ] Brand colors definidos solo en `tailwind.config.js`
- [ ] Test visual: screenshots A/B idénticos en 320px, 800px, 1440px
- [ ] Dark mode validado manualmente en los 3 breakpoints
- [ ] `npm run build` + `npm test` pasan

---

### Story 17.3: Domain TypeScript Migration ✏️

**Fase:** 3 - TypeScript Migration
**Esfuerzo:** 3-5 días
**Riesgo:** 🟡 Medio

**Objetivo:** Type safety en toda la capa de datos

#### Tasks

- [ ] **T1:** Crear schema Zod para domain `content`
- [ ] **T2:** Migrar `content/model/index.js` → `index.ts`
- [ ] **T3:** Migrar `content/model/mock.js` → `mock.ts`
- [ ] **T4:** Crear schema Zod para domain `customer`
- [ ] **T5:** Migrar `customer/model/index.js` → `index.ts`
- [ ] **T6:** Migrar `customer/model/mock.js` → `mock.ts`
- [ ] **T7:** Crear schema Zod para domain `experience-stat`
- [ ] **T8:** Migrar `experience-stat/model/index.js` → `index.ts`
- [ ] **T9:** Migrar `experience-stat/model/mock.js` → `mock.ts`
- [ ] **T10:** Fix typo QUERY_KEY ('experiencie' → 'experience')
- [ ] **T11:** Crear schema Zod para domain `navigation-item`
- [ ] **T12:** Migrar `navigation-item/model/index.js` → `index.ts`
- [ ] **T13:** Migrar `navigation-item/model/mock.js` → `mock.ts`
- [ ] **T14:** Migrar `contact-point/model/index.js` → `index.ts`
- [ ] **T15:** Migrar `profile/model/index.js` → `index.ts`
- [ ] **T16:** Migrar `technology/model/mock.js` → `mock.ts`
- [ ] **T17:** Actualizar `cacheTime` → `gcTime` en todos los hooks JS

#### Acceptance Criteria

```gherkin
Given domains con migración TypeScript parcial
When completo la migración
Then todos los domains tienen schema Zod
And todos los model/index son .ts
And todos los mocks son .ts
And typecheck pasa sin errores
```

#### Definition of Done

- [ ] `find src/domains -name "*.js" | wc -l` devuelve 0
- [ ] Todos los schemas Zod exportan tipo inferido
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run validate:content` pasa al 100%
- [ ] `grep -r "cacheTime" src/` devuelve 0
- [ ] `grep -r "experiencie" src/` devuelve 0

---

### Story 17.4: Query Hook Factory ✏️

**Fase:** 4 - Query Hook Factory
**Esfuerzo:** 2-3 días
**Riesgo:** 🔴 Alto

**Objetivo:** Eliminar duplicación en data fetching

#### Tasks

- [ ] **T1:** Crear `src/lib/queryConfig.ts` con constantes
- [ ] **T2:** Crear `src/lib/createQueryHook.ts` con factory genérica
- [ ] **T3:** Escribir tests para createQueryHook
- [ ] **T4:** Migrar useArticles a usar factory (prueba piloto)
- [ ] **T5:** Verificar comportamiento idéntico
- [ ] **T6:** Migrar useProjects
- [ ] **T7:** Migrar useAcademics
- [ ] **T8:** Migrar useJobExperiences
- [ ] **T9:** Migrar useTechnologies
- [ ] **T10:** Migrar useProfile
- [ ] **T11:** Migrar useContents
- [ ] **T12:** Migrar useCustomers
- [ ] **T13:** Migrar useContactPoints
- [ ] **T14:** Migrar useExperienceStats
- [ ] **T15:** Migrar useNavigationItems
- [ ] **T16:** Eliminar código duplicado de hooks originales
- [ ] **T17:** Smoke test: verificar datos cargan en UI

#### Acceptance Criteria

```gherkin
Given 11 query hooks con código duplicado
When creo factory y migro
Then existe createQueryHook genérico
And todos los hooks usan la factory
And líneas de código reducidas >60%
And comportamiento es idéntico
```

#### Definition of Done

- [ ] Factory `createQueryHook` creada y tipada
- [ ] Config central con `DEFAULT_STALE_TIME` y `DEFAULT_GC_TIME`
- [ ] 11 hooks migrados a usar factory
- [ ] Líneas de código en queries/ reducidas >60%
- [ ] Tests unitarios por cada hook
- [ ] Smoke test: datos cargan correctamente en UI
- [ ] `npm run build` + `npm test` pasan

---

### Story 17.5: Breakpoint Standardization ✏️

**Fase:** 5 - Breakpoint Standardization
**Esfuerzo:** 3-5 días
**Riesgo:** 🔴 Alto

**Objetivo:** Sistema de breakpoints consistente

#### Tasks

- [ ] **T1:** Analizar uso de breakpoints en Experience component
- [ ] **T2:** Documentar decisión ADR: agregar a config VS migrar
- [ ] **T3:** Si agregar: actualizar tailwind.config.js con 400px, 480px
- [ ] **T4:** Si migrar: refactorizar Experience a usar breakpoints semánticos
- [ ] **T5:** Eliminar media queries con magic numbers
- [ ] **T6:** Crear checklist de migración legacy → semantic
- [ ] **T7:** Documentar breakpoints en docs/
- [ ] **T8:** Marcar legacy breakpoints como @deprecated
- [ ] **T9:** Ejecutar Playwright tests en múltiples viewports

#### Acceptance Criteria

```gherkin
Given 3 sistemas de breakpoints diferentes
When estandarizo
Then existe un solo sistema de breakpoints
And Experience usa breakpoints de config
And no hay magic numbers en media queries
And layout funciona en todos los viewports
```

#### Definition of Done

- [ ] Decisión documentada en ADR o docs/
- [ ] Experience component usa breakpoints de config
- [ ] `grep -r "@media (min-width: 400px)" src/` devuelve 0
- [ ] `grep -r "@media (min-width: 480px)" src/` devuelve 0
- [ ] Playwright tests pasan en: 320px, 640px, 800px, 1024px, 1440px
- [ ] No hay regresiones visuales

---

### Story 17.6: Export & Barrel Cleanup ✏️

**Fase:** 6 - Export Cleanup
**Esfuerzo:** 1-2 días
**Riesgo:** 🟢 Bajo

**Objetivo:** API de imports consistente

#### Tasks

- [ ] **T1:** Documentar patrón elegido: default exports
- [ ] **T2:** Migrar NeumorphicToggle a default export
- [ ] **T3:** Actualizar barrel en atoms/buttons/index.js
- [ ] **T4:** Migrar FeaturedProject a default export
- [ ] **T5:** Migrar Project a default export
- [ ] **T6:** Migrar TechnologyFilter a default export
- [ ] **T7:** Actualizar barrel en molecules/index.js
- [ ] **T8:** Eliminar exports comentados en organisms/index.js
- [ ] **T9:** Agregar comentarios organizativos a molecules/index.js
- [ ] **T10:** Verificar imports en todas las páginas

#### Acceptance Criteria

```gherkin
Given mix de default y named exports
When estandarizo a default exports
Then todos los barrel files usan patrón consistente
And todos los imports funcionan
And IDE autocomplete funciona
```

#### Definition of Done

- [ ] Todos los barrel files usan `export { default as X }`
- [ ] `grep "export {" src/ui/*/index.js | grep -v "default"` devuelve 0
- [ ] No hay exports comentados
- [ ] `npm run build` pasa sin errores de import
- [ ] IDE autocomplete funciona correctamente

---

### Story 17.7: State Management Cleanup ✏️

**Fase:** 7 - State Cleanup
**Esfuerzo:** 1-2 días
**Riesgo:** 🟢 Bajo

**Objetivo:** Consistencia en Redux layer

#### Tasks

- [ ] **T1:** Migrar `menuPanel/slice.js` → `slice.ts`
- [ ] **T2:** Migrar `menuPanel/hooks.js` → `hooks.ts`
- [ ] **T3:** Migrar `menuPanel/index.js` → `index.ts`
- [ ] **T4:** Extraer `RootState` type del store
- [ ] **T5:** Exportar `RootState` desde store
- [ ] **T6:** Actualizar selectores para usar `RootState`
- [ ] **T7:** Consolidar selectores en EmailClipboard (1 selector combinado)
- [ ] **T8:** Eliminar acciones duplicadas (mantener solo full names)
- [ ] **T9:** Escribir/actualizar tests de slices
- [ ] **T10:** Smoke test: todos los paneles funcionan

#### Acceptance Criteria

```gherkin
Given menuPanel en JavaScript y selectores inconsistentes
When migro y consolido
Then todo el state layer es TypeScript
And RootState está exportado y usado
And selectores son consistentes
And paneles funcionan correctamente
```

#### Definition of Done

- [ ] `find src/state -name "*.js" | wc -l` devuelve 0
- [ ] `RootState` exportado desde store
- [ ] Cada slice tiene máximo 1 selector por concepto
- [ ] Tests de slices pasan al 100%
- [ ] Smoke test: menu, chat, auth panels funcionan
- [ ] `npm run typecheck` pasa sin errores

---

## Dependencies

```
17.1 ✏️ ──> 17.2 ✏️ ──> 17.3 ✏️ ──> 17.4 ✏️
                              │
                              └──> 17.5 ✏️ ──> 17.6 ✏️ ──> 17.7 ✏️
```

**Notas:**
- Stories son mayormente secuenciales pero independientes
- 17.1 (Quick Wins) es requisito para todas las demás
- 17.3 (TypeScript) es requisito para 17.4 (Hook Factory)
- 17.6 y 17.7 pueden paralelizarse después de 17.5

---

## Verification Checklist (Epic Complete)

- [ ] `npm run predeploy` pasa al 100%
- [ ] No hay regresiones visuales (screenshots A/B)
- [ ] Tiempo de build no aumenta >10%
- [ ] Documentación actualizada en docs/
- [ ] 0 archivos vacíos/muertos
- [ ] 0 schemas Zod vacíos
- [ ] 1 sistema de breakpoints
- [ ] Duplicación CSS reducida >80%
- [ ] Query hooks reducidos >60% en líneas

---

## Reference Documents

- `_bmad-output/analysis/code-quality-and-refactorization-2026-02-06.md` (Source Analysis)
- `docs/layout-system.md` (Breakpoints Reference)
- `tailwind.config.js` (Current Breakpoints)
- `CLAUDE.md` (Project Commands)

---

## Out of Scope (Epic 17)

⚠️ **Explícitamente fuera de alcance:**

- Migrar Redux → Zustand
- Cambiar App Router structure
- Reestructurar carpetas UI grandes
- Introducir nuevas librerías
- Refactor Framer Motion
- Migrar breakpoints legacy masivamente (solo cuando se toque componente)
- Consolidar Contact Link molecules (Epic futuro)
- Abstraer Card Grid variants (Epic futuro)
- Estandarizar BEM naming (Epic futuro)
