---
id: code-quality-and-refactorization-2026-02-06
aliases: []
tags: [refactor, technical-debt, code-quality]
---

---

# 📊 Análisis de Ingeniería: Refactorización y Calidad de Código

| Campo | Valor |
|-------|-------|
| Proyecto | portfolio-frontend-nextjs |
| Fecha | 2026-02-05 |
| Última actualización | 2026-02-06 |
| Analista | Mary (Business Analyst) |
| Foco | Mantenibilidad, reducción de complejidad accidental, preparación para auditorías futuras |

---

## 0. ARQUITECTURA TARGET (Post-Refactor)

Esta sección define el estado deseado del codebase. Usar como brújula para todas las decisiones.

| Área | Estado Target |
|------|---------------|
| **Breakpoints** | Sistema semántico único: `tablet:` / `nav:` / `desktop:` / `wide:` |
| **Domains** | 100% TypeScript + Zod schemas obligatorios |
| **UI Components** | Naming consistente: `skeleton.tsx` (lowercase) |
| **Data Fetching** | Factory pattern + config central (`createQueryHook.ts`) |
| **State (Redux)** | Tipado completo con `RootState` global exportado |
| **Exports** | Default exports en todos los barrel files |
| **CSS** | Utilities centralizadas en `@layer utilities` |

---

## 0.1 RESTRICCIONES: NO HACER (aunque sea tentador)

Estas decisiones están **explícitamente fuera de scope** para evitar scope creep:

| ❌ NO hacer | Razón |
|-------------|-------|
| Migrar Redux → Zustand | Funcional, cambio grande sin ROI inmediato |
| Cambiar App Router structure | Riesgo SEO, requiere E2E completos primero |
| Reestructurar carpetas UI grandes | Alto riesgo, bajo beneficio inmediato |
| Introducir nuevas librerías | Estabilizar primero lo existente |
| Refactor Framer Motion | Funciona, priorizar después de auditoría performance |
| Migrar breakpoints legacy masivamente | Solo migrar cuando se toque componente por otra razón |

---

## 1. PROBLEMAS DETECTADOS

1.1 Inconsistencias Estructurales Críticas

A. Sistema de Breakpoints Mixto (40+ archivos afectados)

Problema: El codebase usa TRES sistemas de breakpoints simultáneamente:
┌─────────────────┬───────────────────────┬────────────────────────────────────────┐
│ Sistema │ Ejemplo │ Archivos │
├─────────────────┼───────────────────────┼────────────────────────────────────────┤
│ Legacy │ sm:text-base, md:my-8 │ Footer, Project, SkillSelector │
│ max-width │ │ │
├─────────────────┼───────────────────────┼────────────────────────────────────────┤
│ Semántico │ tablet:px-12, │ NavBar, MenuButton │
│ min-width │ nav:hidden │ │
├─────────────────┼───────────────────────┼────────────────────────────────────────┤
│ Pixeles crudos │ @media (min-width: │ Experience (400px, 480px, 768px NO │
│ │ 400px) │ están en config) │
└─────────────────┴───────────────────────┴────────────────────────────────────────┘
Ejemplo concreto:
/_ src/ui/organisms/Experience/styles.css - Líneas 8-128 _/
@media (min-width: 400px) { ... } /_ ❌ No existe en tailwind.config.js _/
@media (min-width: 480px) { ... } /_ ❌ No existe en tailwind.config.js _/
@media (min-width: 768px) { ... } /_ ❌ No existe en tailwind.config.js _/

B. Migración TypeScript Incompleta

Problema: Domains con migración parcial o nula:
Domain: content
Estado: 100% JavaScript, schema.js VACÍO
Archivos Afectados: model/index.js, mock.js, schema.js
────────────────────────────────────────
Domain: customer
Estado: 100% JavaScript, schema.js VACÍO
Archivos Afectados: model/index.js, mock.js, schema.js
────────────────────────────────────────
Domain: experience-stat
Estado: 100% JavaScript, schema.js VACÍO
Archivos Afectados: model/index.js, mock.js, schema.js
────────────────────────────────────────
Domain: navigation-item
Estado: 100% JavaScript, schema.js VACÍO
Archivos Afectados: model/index.js, mock.js, schema.js
────────────────────────────────────────
Domain: contact-point
Estado: Mixto (schema.ts ✓, model/index.js ✗)
Archivos Afectados: model/index.js
────────────────────────────────────────
Domain: profile
Estado: Mixto (schema.ts ✓, model/index.js ✗)
Archivos Afectados: model/index.js
────────────────────────────────────────
Domain: technology
Estado: Mixto (mock.js ✗, resto .ts ✓)
Archivos Afectados: model/mock.js
Ejemplo concreto:
// src/domains/content/model/schema.js - ARCHIVO VACÍO (0 líneas de código)
// src/domains/customer/model/schema.js - ARCHIVO VACÍO
// src/domains/experience-stat/model/schema.js - ARCHIVO VACÍO

C. Nomenclatura de Skeletons Inconsistente

Problema: 3 patrones diferentes para archivos skeleton:
┌───────────────────────────┬────────────────────────────────────────┬─────────────┐
│ Patrón │ Ejemplo │ Cantidad │
├───────────────────────────┼────────────────────────────────────────┼─────────────┤
│ skeleton.jsx (correcto) │ atoms/buttons/ArrowButton/skeleton.jsx │ 27 archivos │
├───────────────────────────┼────────────────────────────────────────┼─────────────┤
│ Skeleton.jsx (PascalCase) │ molecules/WhatsApp/Skeleton.tsx │ 4 archivos │
├───────────────────────────┼────────────────────────────────────────┼─────────────┤
│ skeletons/ (directorio) │ organisms/Menu/skeletons/ │ 3 archivos │
└───────────────────────────┴────────────────────────────────────────┴─────────────┘
Archivos a renombrar:

- src/ui/atoms/links/NavigationItemLink/Skeleton.jsx → skeleton.jsx
- src/ui/molecules/SocialNetworkLink/Skeleton.jsx → skeleton.jsx
- src/ui/molecules/WhatsApp/Skeleton.tsx → skeleton.tsx

D. Exports Inconsistentes en Barrel Files

Problema: Mix de default y named exports sin patrón claro:

// src/ui/atoms/buttons/index.js
export { default as ArrowButton } from "./ArrowButton"; // default
export { NeumorphicToggle } from "./NeumorphicToggle"; // ❌ named (único!)

// src/ui/molecules/index.js
export { default as Hero } from "./Hero"; // default
export { FeaturedProject } from "./FeaturedProject"; // ❌ named
export { Project } from "./Project"; // ❌ named

---

1.2 Código Duplicado

A. Focus Ring (26 ocurrencias en 12 archivos)

Problema: Mismo CSS hardcodeado repetido 26 veces:

/_ Repetido en: AuthButton, ThemeButton, ChatButton, MenuButton,
ArrowButton, CopyButton, HireMeButton, HireMeHeaderButton,
NavigationItemButton, CalendarLink + 2 más _/

.component:focus-visible {
outline: 3px solid #0066cc;
outline-offset: 2px;
}
@media (prefers-color-scheme: dark) {
.component:focus-visible {
outline-color: #66b3ff;
}
}

B. Query Hooks (11 archivos, 85-90% duplicación)

Problema: 11 hooks prácticamente idénticos:

// Repetido en: useArticles, useProjects, useAcademics, useJobExperiences,
// useTechnologies, useProfile, useContents, useCustomers, useContactPoints,
// useExperienceStats, useNavigationItems

export const use[Domain] = () => {
return useQuery<TypeModel>({
queryKey: [QUERY_KEY],
queryFn: () => model.fetchAll(),
staleTime: 1000 _ 60 _ 5, // IDÉNTICO en todos
gcTime: 1000 _ 60 _ 10, // IDÉNTICO en todos
});
};

Ahorro potencial: ~250 líneas de código.

C. Glass Effect Overlay (2 archivos)

Problema: Misma implementación en Floating y Auth:

/_ Duplicado en: overlays/Floating/styles.css, organisms/Auth/styles.css _/
background: rgba(0, 0, 0, 0.4);
backdrop-blur-sm;
background: rgba(23, 23, 23, 0.85);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
inset 0 0 0 1px rgba(255, 255, 255, 0.1);

D. Brand Colors (2 archivos, copy-paste exacto)

Problema: Colores de redes sociales duplicados:

/_ IDÉNTICO en: NavBar/styles.css (líneas 112-133), Menu/styles.css (líneas 93-109)
_/
.component a[href*="linkedin"] svg path { fill: #0A66C2; }
.component a[href*="github"] svg path { fill: #24292f; }
.component a[href*="twitter"] svg path { fill: #1DA1F2; }
.component a[href*="dribbble"] svg path { fill: #EA4C89; }

---

1.3 Código Muerto y Archivos Vacíos
Archivo: src/hooks/ui/useIsMobile.js
Estado: VACÍO (0 bytes)
Impacto: Exportado pero no implementado
────────────────────────────────────────
Archivo: src/hooks/ui/useOutsideClick.js
Estado: VACÍO (0 bytes)
Impacto: Exportado pero no implementado
────────────────────────────────────────
Archivo: src/hooks/ui/useScrollLock.js
Estado: VACÍO (0 bytes)
Impacto: Exportado pero no implementado
────────────────────────────────────────
Archivo: src/state/adapters/zustand/
Estado: Placeholder sin implementar
Impacto: Zustand ni siquiera instalado
────────────────────────────────────────
Archivo: src/domains/content/model/schema.js
Estado: VACÍO
Impacto: Sin validación Zod
────────────────────────────────────────
Archivo: src/domains/customer/model/schema.js
Estado: VACÍO
Impacto: Sin validación Zod
────────────────────────────────────────
Archivo: src/domains/experience-stat/model/schema.js
Estado: VACÍO
Impacto: Sin validación Zod
────────────────────────────────────────
Archivo: src/domains/navigation-item/model/schema.js
Estado: VACÍO
Impacto: Sin validación Zod
Comentarios residuales:

- src/state/providers/ReduxProvider/index.jsx línea 4: "// HASTA aca aver que pasa"

---

1.4 Inconsistencias en App Router
Problema: Mix .jsx / .tsx sin patrón
Archivos Afectados: about/page.jsx vs articles/page.tsx
────────────────────────────────────────
Problema: "use client" solo en listados
Archivos Afectados: articles/page.tsx, projects/page.tsx
────────────────────────────────────────
Problema: Layout innecesario
Archivos Afectados: articles/[slug]/layout.tsx (solo pasa children)
────────────────────────────────────────
Problema: Missing loading/error
Archivos Afectados: articles/[slug]/ no tiene loading.tsx ni not-found.tsx
────────────────────────────────────────
Problema: Import duplicado
Archivos Afectados: articles/layout.tsx importa React dos veces

---

1.5 State Management Issues
Problema: menuPanel usa .js (resto usa .ts)
Ubicación: src/state/slices/menuPanel/
────────────────────────────────────────
Problema: Selectores múltiples innecesarios
Ubicación: EmailClipboard/hooks.ts hace 2 useAppSelector
────────────────────────────────────────
Problema: Acciones duplicadas en hooks
Ubicación: Todos exportan open() + openAuthPanel()
────────────────────────────────────────
Problema: Tipos hardcodeados
Ubicación: Cada hook repite (state: { sliceName: StateInterface })

---

2. REFACTORS RECOMENDADOS (Por Impacto)

🔴 IMPACTO ALTO
┌─────┬────────────────────────────┬────────────┬──────────┬───────────────────────┐
│ # │ Refactor │ Archivos │ Esfuerzo │ Beneficio │
├─────┼────────────────────────────┼────────────┼──────────┼───────────────────────┤
│ 1 │ Extraer Focus Ring a CSS │ 12 │ Bajo │ Elimina 26 │
│ │ Layer │ archivos │ │ duplicaciones │
├─────┼────────────────────────────┼────────────┼──────────┼───────────────────────┤
│ 2 │ Crear Query Hook Factory │ 11 │ Medio │ Elimina ~250 líneas │
│ │ │ archivos │ │ │
├─────┼────────────────────────────┼────────────┼──────────┼───────────────────────┤
│ 3 │ Completar migración TS en │ 7 domains │ Alto │ Type safety │
│ │ domains │ │ │ consistente │
├─────┼────────────────────────────┼────────────┼──────────┼───────────────────────┤
│ 4 │ Estandarizar breakpoints │ 40+ │ Alto │ Comportamiento │
│ │ │ archivos │ │ predecible │
├─────┼────────────────────────────┼────────────┼──────────┼───────────────────────┤
│ 5 │ Eliminar archivos │ 8 archivos │ Bajo │ Reduce confusión │
│ │ vacíos/muertos │ │ │ │
└─────┴────────────────────────────┴────────────┴──────────┴───────────────────────┘
🟡 IMPACTO MEDIO
┌─────┬───────────────────────────────┬───────────┬──────────┬─────────────────────┐
│ # │ Refactor │ Archivos │ Esfuerzo │ Beneficio │
├─────┼───────────────────────────────┼───────────┼──────────┼─────────────────────┤
│ 6 │ Unificar skeleton naming │ 7 │ Bajo │ Consistencia │
│ │ │ archivos │ │ │
├─────┼───────────────────────────────┼───────────┼──────────┼─────────────────────┤
│ 7 │ Estandarizar exports en │ 4 │ Bajo │ API predecible │
│ │ barrels │ archivos │ │ │
├─────┼───────────────────────────────┼───────────┼──────────┼─────────────────────┤
│ 8 │ Extraer Glass Effect a │ 2 │ Bajo │ Reutilización │
│ │ utility │ archivos │ │ │
├─────┼───────────────────────────────┼───────────┼──────────┼─────────────────────┤
│ 9 │ Mover brand colors a Tailwind │ 2 │ Bajo │ Single source of │
│ │ config │ archivos │ │ truth │
├─────┼───────────────────────────────┼───────────┼──────────┼─────────────────────┤
│ 10 │ Migrar menuPanel a TypeScript │ 3 │ Bajo │ Type safety │
│ │ │ archivos │ │ │
└─────┴───────────────────────────────┴───────────┴──────────┴─────────────────────┘
🟢 IMPACTO BAJO (Para después)
┌─────┬───────────────────────────────┬─────────────┬──────────┬───────────────────┐
│ # │ Refactor │ Archivos │ Esfuerzo │ Beneficio │
├─────┼───────────────────────────────┼─────────────┼──────────┼───────────────────┤
│ 11 │ Consolidar Contact Link │ 3 archivos │ Medio │ ~30 líneas menos │
│ │ molecules │ │ │ │
├─────┼───────────────────────────────┼─────────────┼──────────┼───────────────────┤
│ 12 │ Abstraer Card Grid variants │ 4 archivos │ Alto │ ~150 líneas menos │
├─────┼───────────────────────────────┼─────────────┼──────────┼───────────────────┤
│ 13 │ Unificar form components │ 2 archivos │ Medio │ Menos duplicación │
├─────┼───────────────────────────────┼─────────────┼──────────┼───────────────────┤
│ 14 │ Estandarizar BEM naming │ 40+ │ Alto │ Consistencia │
│ │ │ archivos │ │ visual │
└─────┴───────────────────────────────┴─────────────┴──────────┴───────────────────┘

---

3. QUÉ NO TOCAR TODAVÍA
   Área: Framer Motion animations
   Razón: Funciona, refactor cosmético. Priorizar después de auditoría de performance.
   ────────────────────────────────────────
   Área: Redux slice structure
   Razón: Funcional aunque verbose. Evaluar migración a Zustand después de estabilizar.
   ────────────────────────────────────────
   Área: App Router layouts
   Razón: Cambios pueden romper SEO. Esperar a tener tests E2E completos.
   ────────────────────────────────────────
   Área: Component subdirectory structure
   Razón: (Menu/skeletons/, Auth/Form/) - Refactor grande con alto riesgo.
   ────────────────────────────────────────
   Área: BEM naming convention
   Razón: Cambio masivo, bajo ROI inmediato. Documentar patrón elegido primero.
   ────────────────────────────────────────
   Área: Legacy breakpoints en componentes existentes
   Razón: Solo migrar cuando se toque el componente por otra razón.

---

4. RIESGOS DE REFACTOR

🔴 RIESGO ALTO
Refactor: Breakpoints
Qué Puede Romperse: Layout en todos los viewports
Mitigación: Tests visuales antes/después, Playwright
────────────────────────────────────────
Refactor: Query Hook Factory
Qué Puede Romperse: Todas las data fetches
Mitigación: Tests unitarios por domain
────────────────────────────────────────
Refactor: TypeScript migration
Qué Puede Romperse: Runtime errors si tipos incorrectos
Mitigación: Migrar con strict: false primero
🟡 RIESGO MEDIO
Refactor: Focus Ring extraction
Qué Puede Romperse: Accessibility (focus visible)
Mitigación: Test manual WCAG 2.4.7
────────────────────────────────────────
Refactor: Skeleton renaming
Qué Puede Romperse: Imports rotos
Mitigación: Buscar/reemplazar global
────────────────────────────────────────
Refactor: Export standardization
Qué Puede Romperse: Imports en páginas
Mitigación: Verificar build completo
🟢 RIESGO BAJO
┌──────────────────────────┬────────────────────┬──────────────────────────┐
│ Refactor │ Qué Puede Romperse │ Mitigación │
├──────────────────────────┼────────────────────┼──────────────────────────┤
│ Eliminar archivos vacíos │ Nada (no usados) │ Verificar no hay imports │
├──────────────────────────┼────────────────────┼──────────────────────────┤
│ Brand colors a config │ Nada visual │ Comparación visual │
├──────────────────────────┼────────────────────┼──────────────────────────┤
│ Comentarios residuales │ Nada │ Ninguna │
└──────────────────────────┴────────────────────┴──────────────────────────┘

---

5. PLAN INCREMENTAL

Fase 1: Quick Wins (1-2 días)

**Objetivo:** Limpiar sin cambiar comportamiento

**Tareas:**
□ Eliminar archivos vacíos (useIsMobile.js, useOutsideClick.js, useScrollLock.js)
□ Eliminar adapter zustand (no instalado)
□ Eliminar comentario residual en ReduxProvider
□ Renombrar skeletons a lowercase (4 archivos)
□ Fix import duplicado en articles/layout.tsx

**Definition of Done (DoD):**
- [ ] `npm run build` pasa sin errores
- [ ] `npm test` pasa al 100%
- [ ] `grep -r "useIsMobile\|useOutsideClick\|useScrollLock" src/` devuelve 0 resultados
- [ ] `grep -r "zustand" src/` devuelve 0 resultados
- [ ] Todos los skeletons siguen patrón `skeleton.tsx` (lowercase)

---

Fase 2: CSS Consolidation (2-3 días)

**Objetivo:** Single source of truth para estilos comunes

**Tareas:**
□ Crear @layer utilities con .focus-ring en globals.css
□ Reemplazar 26 focus-visible blocks con @apply focus-ring
□ Extraer glass-effect a utility class
□ Mover brand colors a tailwind.config.js (extend.colors)
□ Eliminar duplicación en NavBar/Menu

**Definition of Done (DoD):**
- [ ] `grep -r "outline: 3px solid #0066cc" src/` devuelve 0 resultados
- [ ] `grep -r "outline-color: #66b3ff" src/` devuelve 0 resultados
- [ ] Brand colors definidos solo en `tailwind.config.js`
- [ ] Test visual: screenshots A/B idénticos en 320px, 800px, 1440px
- [ ] Dark mode validado manualmente en los 3 breakpoints
- [ ] `npm run build` + `npm test` pasan

---

Fase 3: Domain TypeScript Migration (3-5 días)

**Objetivo:** Type safety en toda la capa de datos

**Tareas:**
□ Crear schemas Zod para: content, customer, experience-stat, navigation-item
□ Migrar model/index.js → index.ts en: contact-point, profile, technology
□ Migrar mock.js → mock.ts en: technology
□ Actualizar cacheTime → gcTime en hooks JS restantes
□ Fix typo QUERY_KEY en experience-stat ('experiencie' → 'experience')

**Definition of Done (DoD):**
- [ ] `find src/domains -name "*.js" | wc -l` devuelve 0
- [ ] Todos los schemas Zod exportan tipo inferido (`z.infer<typeof Schema>`)
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run validate:content` pasa al 100%
- [ ] `grep -r "cacheTime" src/` devuelve 0 (solo gcTime)
- [ ] `grep -r "experiencie" src/` devuelve 0

---

Fase 4: Query Hook Factory (2-3 días)

**Objetivo:** Eliminar duplicación en data fetching

**Tareas:**
□ Crear src/lib/createQueryHook.ts con factory genérica
□ Crear src/lib/queryConfig.ts con DEFAULT_STALE_TIME, DEFAULT_GC_TIME
□ Refactorizar 1 hook como prueba (useArticles)
□ Migrar hooks restantes progresivamente
□ Eliminar código duplicado

**Definition of Done (DoD):**
- [ ] Factory `createQueryHook` creada y tipada
- [ ] Config central con `DEFAULT_STALE_TIME` y `DEFAULT_GC_TIME`
- [ ] 11 hooks migrados a usar factory
- [ ] Líneas de código en queries/ reducidas >60%
- [ ] Tests unitarios por cada hook migrado
- [ ] Smoke test: datos cargan correctamente en UI
- [ ] `npm run build` + `npm test` pasan

---

Fase 5: Breakpoint Standardization (3-5 días)

**Objetivo:** Sistema de breakpoints consistente

**Tareas:**
□ Documentar decisión: agregar 400/480/768 a config VS migrar Experience
□ Si agregar: actualizar tailwind.config.js con breakpoints faltantes
□ Si migrar: refactorizar Experience component
□ Crear checklist de migración legacy → semantic
□ Migrar componentes críticos (NavBar, Footer ya migrados)
□ Marcar legacy breakpoints como @deprecated en docs

**Definition of Done (DoD):**
- [ ] Decisión documentada en ADR o docs/
- [ ] Experience component usa breakpoints de config (no magic numbers)
- [ ] `grep -r "@media (min-width: 400px)" src/` devuelve 0
- [ ] `grep -r "@media (min-width: 480px)" src/` devuelve 0
- [ ] Playwright tests pasan en: 320px, 640px, 800px, 1024px, 1440px
- [ ] No hay regresiones visuales en ningún breakpoint

---

Fase 6: Export & Barrel Cleanup (1-2 días)

**Objetivo:** API de imports consistente

**Tareas:**
□ Decidir patrón: default exports everywhere
□ Migrar NeumorphicToggle a default export
□ Migrar FeaturedProject, Project, TechnologyFilter a default exports
□ Eliminar exports comentados en organisms/index.js
□ Agregar comentarios organizativos a molecules/index.js

**Definition of Done (DoD):**
- [ ] Todos los barrel files usan `export { default as X }` (no named exports)
- [ ] `grep "export {" src/ui/*/index.js | grep -v "default"` devuelve 0
- [ ] No hay exports comentados en ningún index.js
- [ ] `npm run build` pasa sin errores de import
- [ ] IDE autocomplete funciona correctamente para todos los componentes

---

Fase 7: State Management Cleanup (1-2 días)

**Objetivo:** Consistencia en Redux layer

**Tareas:**
□ Migrar menuPanel/ de .js a .ts
□ Consolidar selectores en EmailClipboard (1 selector combinado)
□ Eliminar acciones duplicadas (mantener solo full names)
□ Extraer RootState type del store para selectores tipados

**Definition of Done (DoD):**
- [ ] `find src/state -name "*.js" | wc -l` devuelve 0
- [ ] `RootState` exportado desde store y usado en todos los selectores
- [ ] Cada slice tiene máximo 1 selector por concepto (no duplicados)
- [ ] Tests de slices pasan al 100%
- [ ] Smoke test: todos los paneles (menu, chat, auth) funcionan correctamente
- [ ] `npm run typecheck` pasa sin errores

---

## 6. RESUMEN EJECUTIVO

### 6.1 Métricas Técnicas

| Métrica | Actual | Post-Refactor |
|---------|--------|---------------|
| Archivos vacíos/muertos | 8 | 0 |
| Duplicación Focus Ring | 26 ocurrencias | 1 utility |
| Duplicación Query Hooks | ~250 líneas | ~50 líneas |
| Domains sin TypeScript | 4 completos + 3 parciales | 0 |
| Sistemas de breakpoints | 3 | 1 (semántico) |
| Schemas Zod vacíos | 4 | 0 |

### 6.2 Métricas de Éxito Adicionales

| Métrica | Cómo medir | Target |
|---------|------------|--------|
| TypeScript warnings | `npm run typecheck 2>&1 \| grep -c "error"` | 0 |
| Tiempo agregar domain | Cronometrar creación domain nuevo | <15 min |
| Cobertura tests domains | Jest coverage report | >80% |
| Build time | `time npm run build` | Sin regresión |
| Bundle size | Next.js build output | Sin regresión >5% |

### 6.3 Criterios de Éxito Global

- [ ] `npm run predeploy` pasa al 100%
- [ ] No hay regresiones visuales (screenshots A/B)
- [ ] Tiempo de build no aumenta >10%
- [ ] Documentación actualizada en docs/

---

**Tiempo estimado total:** 13-22 días de trabajo incremental

---

## 7. SIGUIENTE PASO RECOMENDADO

Crear **Épica BMAD** con las primeras historias de Fase 1 (Quick Wins) usando el workflow `/create-epics-and-stories` o manualmente.
