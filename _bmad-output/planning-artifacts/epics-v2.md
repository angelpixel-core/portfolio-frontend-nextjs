---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics']
inputDocuments:
  - '_bmad-output/implementation-artifacts/epic-12-ux-behavior.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/prd.md'
version: 2
scope: 'Epic 12+'
baselineEpic: 11
---

# Portfolio Frontend - Epic Breakdown (v2)

## Overview

Este documento proporciona el desglose de épicas e historias para Epic 12+, basado en el documento UX Behavior Specification creado post-Epic 11.

**Contexto:** Epics 1-11 completados. Epic 11 estableció sistema de breakpoints semánticos y zonas de header estables.

**Foco:** Definición de comportamiento UX mobile-first para Header, Home y About.

---

## Requirements Inventory

### Functional Requirements

**Header - Breakpoints & Layout:**

| ID | Requirement |
|----|-------------|
| FR1 | El menú hamburguesa debe desaparecer cuando hay espacio suficiente (~840px) |
| FR2 | Header mobile: hamburguesa (izq), logo (centro), Hire Me (der) |
| FR3 | Header desktop (>840px): navegación + redes sociales + auth visible |
| FR4 | El breakpoint actual de 1440px debe reducirse a ~840px |

**Header - Interacciones:**

| ID | Requirement |
|----|-------------|
| FR5 | Hover en logo: transición de color |
| FR6 | Hover en Hire Me: color inverso (light ↔ dark) |
| FR7 | Menú abierto ocupa un blade completo |
| FR8 | Al navegar a una sección, el menú se cierra automáticamente |
| FR9 | Subrayados de navegación: selected visible + hover con animación desde centro |
| FR10 | Íconos sociales con contraste correcto según tema (light/dark) |
| FR11 | Botón cerrar visible sin overflow cuando menú abierto |

**Home - Hero Blade:**

| ID | Requirement |
|----|-------------|
| FR12 | Hero blade contiene SOLO: header, imagen hero, título, descripción, botones (Resume/Contact) |
| FR13 | Botones Resume/Contact idealmente 50%/50% en mobile |
| FR14 | Hero blade NO incluye carrusel, footer, ni contenido secundario |

**Home - Secondary Blade:**

| ID | Requirement |
|----|-------------|
| FR15 | Blade 2 contiene: carrusel de customers/logos + footer completo |
| FR16 | Cada blade debe ocupar el viewport cuando sea posible |
| FR17 | Scroll entre blades se siente como cambio de blade, no contenido cortado |

**About - Biography:**

| ID | Requirement |
|----|-------------|
| FR18 | Componente Stats NO debe romper el primer blade |
| FR19 | Si Stats falla carga, degradación visual sin texto suelto |

**About - Skills:**

| ID | Requirement |
|----|-------------|
| FR20 | Botones: 1 año, 3 años, 5 años, Training, Roadmap |
| FR21 | Al seleccionar botón: activo por color + elementos visuales se iluminan en sincronía |
| FR22 | Estado activo debe ser claro y persistente |

**About - Experiences/Education:**

| ID | Requirement |
|----|-------------|
| FR23 | "Show details" debe ser ícono/menú contextual, no texto plano |
| FR24 | Education sigue patrón visual de Experiences |

**Footer:**

| ID | Requirement |
|----|-------------|
| FR25 | Comportamiento consistente en todas las páginas |
| FR26 | Hire Me button: hover con color inverso |
| FR27 | Hire Me NO duplicado ni fuera de contexto |

---

### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR1 | Mobile-first: comportamientos definidos desde viewport más pequeño hacia arriba |
| NFR2 | Un solo patrón de navegación coherente en todo el sitio |
| NFR3 | Breakpoints definen qué elementos EXISTEN, no solo cómo se acomodan |
| NFR4 | Menú hamburguesa es estado transitorio, no permanente |
| NFR5 | Cada blade tiene intención clara y ocupa viewport cuando sea posible |
| NFR6 | Cada breakpoint definido debe validarse manualmente en viewport real (DevTools) además de E2E tests |

---

### Additional Requirements

**Contexto técnico (Epic 11):**
- Usar breakpoints semánticos existentes: `tablet:`, `desktop:`, `wide:`
- Nuevo breakpoint ~840px puede requerir ajuste en `tailwind.config.js`
- Mantener `data-testid` en zonas de header para E2E tests
- No romper reglas de visibilidad documentadas en `layout-system.md`

---

### Out of Scope (Epic 12)

⚠️ **Explícitamente fuera de alcance:**

- No se implementa diseño visual final (colores, spacing fino, tipografías exactas)
- Epic 12 define **comportamiento y reglas de visibilidad**, no refinamiento estético final
- No nuevos breakpoints adicionales al propuesto (~840px)
- No rediseño de branding
- No animaciones nuevas más allá de las especificadas

---

### FR Coverage Map

| FR | Story | Descripción |
|----|-------|-------------|
| FR1 | 12.1 | Menú hamburguesa desaparece en breakpoint óptimo |
| FR2 | 12.2 | Header mobile layout |
| FR3 | 12.3 | Header desktop layout |
| FR4 | 12.1 | Reducir breakpoint (valor TBD) |
| FR5 | 12.4 | Hover logo transición |
| FR6 | 12.4 | Hover Hire Me inverso |
| FR7 | 12.2 | Menú abierto blade completo |
| FR8 | 12.5 | Menu auto-close |
| FR9 | 12.4 | Subrayados selected + hover |
| FR10 | 12.5 | Íconos contraste por tema |
| FR11 | 12.2 | Botón cerrar sin overflow |
| FR12 | 12.6 | Hero blade estructura |
| FR13 | 12.6 | Botones 50/50 mobile |
| FR14 | 12.6 | Hero sin carrusel/footer |
| FR15 | 12.7 | Blade 2 carrusel + footer |
| FR16 | 12.7 | Blades ocupan viewport |
| FR17 | 12.7 | Scroll como cambio blade |
| FR18 | 12.8 | Stats no rompe blade |
| FR19 | 12.8 | Stats degradación elegante |
| FR20 | 12.9 | Skills botones |
| FR21 | 12.9 | Skills activo + sync visual |
| FR22 | 12.9 | Skills estado persistente |
| FR23 | 12.10 | Experiences ícono contextual |
| FR24 | 12.10 | Education patrón Experiences |
| FR25 | 12.11 | Footer consistente |
| FR26 | 12.11 | Hire Me hover inverso |
| FR27 | 12.11 | Hire Me no duplicado |

---

## Epic List

### Epic 12: Header, Home & About UX Behavior (Mobile First)

**Objetivo:** El usuario experimenta navegación coherente y predecible desde mobile hasta desktop, con interacciones claras, estados visibles, y estructura de blades intencional.

**FRs cubiertos:** FR1-FR27 (todos)
**NFRs aplicados:** NFR1-NFR6

---

#### War Room Insights (Aplicados)

| Insight | Aplicación |
|---------|------------|
| ⚠️ Story 12.1 es bloqueante | Debe completarse y validarse antes de continuar |
| 🎯 Breakpoint TBD | El valor ~840px es orientativo; determinar valor óptimo durante implementación |
| 🔀 Paralelización posible | Stories 12.6-12.11 pueden trabajarse en paralelo con 12.2-12.5 post-12.1 |
| 🛡️ Scope discipline | 11 stories manejables, no agregar scope |

---

#### Clusters de Riesgo

| Riesgo | Stories | Razón |
|--------|---------|-------|
| 🔴 Alto | 12.1, 12.4, 12.9 | CSS + JS coordination |
| 🟡 Medio | 12.2, 12.3, 12.5, 12.8 | Mayormente layout |
| 🟢 Bajo | 12.6, 12.7, 12.10, 12.11 | Estructural |

---

#### Story Summary

| # | Story | FRs | Notas |
|---|-------|-----|-------|
| **12.1** | Header Breakpoint Definition ⚠️ | FR1, FR4 | BLOQUEANTE - Valor óptimo TBD |
| 12.2 | Header Mobile Layout | FR2, FR7, FR11 | Depende de 12.1 |
| 12.3 | Header Desktop Layout | FR3 | Depende de 12.1 |
| 12.4 | Header Hover & Selected States | FR5, FR6, FR9 | Alto riesgo: CSS + JS |
| 12.5 | Menu Auto-Close & Theme Contrast | FR8, FR10 | Depende de 12.1 |
| 12.6 | Home Hero Blade Structure | FR12, FR13, FR14 | Parallelizable post-12.1 |
| 12.7 | Home Secondary Blade & Scroll | FR15, FR16, FR17 | Parallelizable post-12.1 |
| 12.8 | About Biography & Stats Degradation | FR18, FR19 | Parallelizable post-12.1 |
| 12.9 | About Skills Interaction States | FR20, FR21, FR22 | Alto riesgo: CSS + JS sync |
| 12.10 | About Experiences/Education UX | FR23, FR24 | Bajo riesgo |
| 12.11 | Footer Consistency | FR25, FR26, FR27 | Bajo riesgo |

---

## Epic 13: Page Transition System

**Objetivo:** Implementar el sistema de transición de páginas de 3 capas (cortinas) que define la identidad visual del sitio, sincronizando animaciones y requests con el punto de trigger del 50% del viewport.

**Fuente:** UI & Motion Specification, Section 1 "Page Transition System - El corazón del proyecto"

---

### Requirements Inventory (Epic 13)

#### Functional Requirements

**Transition Structure:**

| ID | Requirement |
|----|-------------|
| FR13.1 | El sistema de transición se aplica a: navegación por menú, links principales, click en logo |
| FR13.2 | Durante la transición se bloquea toda interacción (click, hover, scroll, focus) |
| FR13.3 | Cortina principal (rosada) avanza Left→Right de 0%→100% ocultando la página anterior |
| FR13.4 | Al llegar a 100%, breve pausa y se monta la nueva página por detrás |
| FR13.5 | Cortina rosada se retira Right→Left con extensiones blanca y negra en cascada |
| FR13.6 | Las extensiones SOLO aparecen en la retirada, NUNCA durante la ida |
| FR13.7 | Cortinas cubren contenido + header + todo el viewport (position: fixed, z-top) |

**Synchronization & Triggers:**

| ID | Requirement |
|----|-------------|
| FR13.8 | La transición real ocurre cuando la extensión negra cruza el 50% del viewport |
| FR13.9 | El evento del 50% dispara: montaje de nueva página, inicio de animaciones, inicio de requests |
| FR13.10 | NADA animado se dispara antes del punto del 50% |
| FR13.11 | Título de página: slide desde abajo + opacity 0→1, trigger al 50% |
| FR13.12 | Color del título dependiente del theme (dark/light) |

**Scope Boundaries:**

| ID | Requirement |
|----|-------------|
| FR13.13 | NO se aplica a: interacciones internas, hover states, animaciones locales de componentes |
| FR13.14 | Las extensiones nunca se ven completas al mismo tiempo |
| FR13.15 | Transiciones SOLO se ejecutan en navegación interna del sitio, NUNCA en carga directa por URL (refresh, bookmark, link externo) |

**Navigation Integration:**

| ID | Requirement |
|----|-------------|
| FR13.16 | Todos los links de navegación interna deben usar `startTransition()` en lugar de navegación directa de Next.js |
| FR13.17 | El orden de fases debe ser siempre: entrada (cubre pantalla) → retirada (revela página nueva) |
| FR13.18 | La página final visible debe ser la nueva página, nunca quedarse cubierta |

---

#### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR13.1 | Performance: transición completa < 1.2s para sensación fluida |
| NFR13.2 | Accessibility: respetar `prefers-reduced-motion` con transición instantánea |
| NFR13.3 | Consistency: misma duración y easing en todas las rutas |
| NFR13.4 | Testability: estados de transición verificables via E2E tests |

---

#### Technical Context

- Usar Framer Motion para orquestación de animaciones
- Coordinar con React Query para diferir requests hasta trigger
- Implementar como componente de layout global (`TransitionProvider`)
- Mantener compatibilidad con App Router de Next.js

#### Architecture Analysis (Post Story 13.1)

**Estado actual de la implementación:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA ACTUAL (BROKEN)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NavigationItemLink ─────> Next.js <Link>                       │
│         │                      │                                │
│         │                      ▼                                │
│         │               pathname cambia                         │
│         │                      │                                │
│         │                      ▼                                │
│         │           AnimatePresence key={pathname}              │
│         │                      │                                │
│         │                      ▼                                │
│         │           TransitionEffect anima                      │
│         │           (direcciones INVERTIDAS)                    │
│         │                                                       │
│  TransitionProvider ──────> startTransition()                   │
│         │                      │                                │
│         │                      ▼                                │
│         │               NADIE LO LLAMA                          │
│         │               (infraestructura sin usar)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Sistema objetivo (Story 13.2+):**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA CORRECTO                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TransitionLink ─────> startTransition(href)                    │
│         │                      │                                │
│         │                      ▼                                │
│         │           TransitionProvider                          │
│         │           phase: idle → entering                      │
│         │                      │                                │
│         │                      ▼                                │
│         │           TransitionEffect                            │
│         │           escucha phase === "entering"                │
│         │           anima Left → Right (cubre)                  │
│         │                      │                                │
│         │                      ▼                                │
│         │           Al completar entrada:                       │
│         │           router.push(href)                           │
│         │           phase: entering → exiting                   │
│         │                      │                                │
│         │                      ▼                                │
│         │           TransitionEffect                            │
│         │           escucha phase === "exiting"                 │
│         │           anima Right → Left (revela)                 │
│         │                      │                                │
│         │                      ▼                                │
│         │           phase: exiting → idle                       │
│         │           Nueva página visible                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Archivos clave a modificar en Story 13.2:**

| Archivo | Cambio |
|---------|--------|
| `src/ui/atoms/links/NavigationItemLink/index.jsx` | Usar startTransition() en lugar de Link directo |
| `src/ui/molecules/TransitionEffect/index.jsx` | Controlar animación por phase, no por AnimatePresence |
| `src/ui/molecules/AnimatedChildren/index.jsx` | Remover AnimatePresence key={pathname} para transiciones |
| `src/state/providers/TransitionProvider/index.tsx` | Agregar flag `isInitialLoad` para skip animation |

---

### Story Summary (Epic 13)

| # | Story | FRs | Riesgo | Notas |
|---|-------|-----|--------|-------|
| **13.1** | Transition Infrastructure & Provider ✅ | FR13.1, FR13.2 | 🔴 Alto | DONE - Define arquitectura base |
| 13.2 | Curtain Entry Animation (Left→Right) | FR13.3, FR13.4, FR13.15, FR13.16, FR13.17, FR13.18 | 🔴 Alto | **CRÍTICO:** Integrar nav links con startTransition(), skip initial load, corregir direcciones |
| 13.3 | Curtain Exit Animation (Right→Left) | FR13.5, FR13.6, FR13.14 | 🔴 Alto | Cascada 3 capas |
| 13.4 | 50% Trigger Synchronization | FR13.8, FR13.9, FR13.10 | 🔴 Alto | Core timing logic |
| 13.5 | Page Title Animation | FR13.11, FR13.12 | 🟢 Bajo | Slide + fade |
| 13.6 | Interaction Blocking During Transition | FR13.2, FR13.7 | 🟡 Medio | Overlay z-index |
| 13.7 | Reduced Motion Support | NFR13.2 | 🟢 Bajo | a11y compliance |
| 13.8 | Transition E2E Test Suite | NFR13.4 | 🟡 Medio | Validación automatizada |

### ⚠️ Critical Implementation Notes (Post Story 13.1 Analysis)

**Problema detectado:** La infraestructura de TransitionProvider (Story 13.1) está **desconectada** de la navegación real:

1. **NavigationItemLink** usa `<Link>` de Next.js directamente → pathname cambia → AnimatePresence anima
2. **TransitionProvider.startTransition()** existe pero **ningún componente lo llama**
3. **Resultado:** Las fases del provider no controlan las animaciones visuales

**Story 13.2 DEBE resolver:**
1. Crear `TransitionLink` o modificar `NavigationItemLink` para usar `startTransition()`
2. Eliminar dependencia de AnimatePresence key={pathname} para animaciones
3. Conectar fases del provider con animaciones de TransitionEffect
4. Skip animation en initial page load (no hay "entrada" previa que justifique "retirada")

---

### Dependencies

```
13.1 ✅ ──┬──> 13.2 ⚠️ ──> 13.3 ──> 13.4 ──> 13.5
          │    │
          │    └──> (13.2 ahora incluye integración con nav + skip initial load)
          │
          └──> 13.6
          │
          └──> 13.7

13.4 ──> 13.8 (E2E tests requieren timing funcional)
```

**Nota:** Story 13.2 aumentó de riesgo 🟡 Medio a 🔴 Alto porque ahora debe:
1. Corregir direcciones de animación (scope original)
2. Integrar navigation links con startTransition() (nuevo)
3. Implementar skip initial load (nuevo)
4. Refactorizar control de animaciones de AnimatePresence a phase-driven (nuevo)

---

### Out of Scope (Epic 13)

⚠️ **Explícitamente fuera de alcance:**

- Animaciones específicas de páginas Projects/Articles (Epic 14)
- Auth button modal y estados de sesión (Epic 15)
- Stats count-up animation (ya en About, puede refinarse post-transition)
- Skills galaxy/spiral animation trigger (ajustar si es necesario)

---

## Epic 14: Projects & Articles Pages

**Objetivo:** Implementar comportamiento UX de páginas Projects y Articles según spec, incluyendo featured/non-featured layouts, efectos hover, y comportamiento touch.

**FRs fuente:** UI & Motion Spec Section 3 "Pages" (Projects, Articles)

**Rationale (Epic 13 Retrospective):** Continuar momentum de UI behavior consolidation de Epic 12-13. El portfolio necesita verse bien antes de agregar autenticación.

---

### Requirements Inventory (Epic 14)

#### Functional Requirements

**Projects Page:**

| ID | Requirement |
|----|-------------|
| FR14.1 | Máximo 6 proyectos visibles, sin paginación ni scroll infinito |
| FR14.2 | Featured project ocupa blade completo (mobile y desktop) |
| FR14.3 | Non-featured projects en grid (mobile: 2 por blade, desktop: grid libre) |
| FR14.4 | Hover en project card: zoom suave en imagen |
| FR14.5 | Tech stack icons visibles en card sin necesidad de click |
| FR14.6 | GitHub/Demo links visibles en hover state |
| FR14.7 | Layout preparado para crecer (1, 3, 6 proyectos) |

**Articles Page:**

| ID | Requirement |
|----|-------------|
| FR14.8 | Featured articles en blade 1 (mobile: 1, desktop: hasta 2) |
| FR14.9 | All articles con aparición secuencial (trigger: título al 50% viewport) |
| FR14.10 | Hover effect: thumbnail aparece al hover sobre artículo específico |
| FR14.11 | Fecha de publicación prominente en article card |
| FR14.12 | Tags/categorías visibles en article card |
| FR14.13 | Footer puede convivir con últimos artículos sin competir visualmente |

**Cross-Page:**

| ID | Requirement |
|----|-------------|
| FR14.14 | Touch behavior equivalente a hover (tap-to-expand o similar) |
| FR14.15 | Animaciones coordinadas con TransitionProvider (canAnimate flag) |
| FR14.16 | Reduced motion support en todas las animaciones |

---

#### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR14.1 | Performance: LCP < 2.5s, CLS < 0.1 en pages con imágenes |
| NFR14.2 | Throttle mouse tracking a 16ms (60fps) |
| NFR14.3 | Mobile-first: touch behavior diseñado primero, hover como enhancement |
| NFR14.4 | Consistencia: reusar motion tokens de Epic 13 |
| NFR14.5 | Testability: E2E tests para hover, touch, y sequential appearance |

---

#### Architecture Decisions (ADRs)

| ADR | Decisión | Rationale |
|-----|----------|-----------|
| ADR-14.1 | CSS Grid + Framer Motion para animaciones | Separar layout de motion |
| ADR-14.2 | Framer Motion whileHover/whileFocus | Consistencia, a11y built-in |
| ADR-14.3 | useMotionValue + throttle 16ms | No re-renders, 60fps cap |
| ADR-14.4 | staggerChildren + canAnimate | Integración con Epic 13 |
| ADR-14.5 | Organisms con variants | DRY, testeable, composable |

---

#### Risk Mitigation (Pre-mortem)

| Riesgo | Mitigación |
|--------|------------|
| 🔴 Mobile hover sin fallback | Story 14.4 dedicada a touch behavior |
| 🔴 Performance en animations | NFR14.1 budget en cada story |
| 🟡 Animation timing conflicts | Reusar motion tokens de Epic 13 |
| 🟡 Content edge cases | AC con variaciones (0, 1, 3, 6 items) |
| 🟢 A11y regressions | Checklist en cada story |

---

#### User Insights (Focus Group)

| Insight | Aplicación |
|---------|------------|
| L1: Tech stack visible | FR14.5 - icons en card |
| C1: GitHub/Demo en hover | FR14.6 - action buttons |
| D1: Mobile touch equivalente | FR14.14 - story dedicada |
| L2: Fecha prominente | FR14.11 - visible sin hover |
| C2: Thumbnail on hover (no follow) | FR14.10 - ajuste de spec |
| M2: Tags visibles | FR14.12 - en article card |

---

### Story Summary (Epic 14)

| # | Story | FRs | Riesgo | Notas |
|---|-------|-----|--------|-------|
| **14.1** | Project Card Component | FR14.5, FR14.6, FR14.7 | 🟡 Medio | Base component con variants |
| **14.2** | Projects Page Layout | FR14.1, FR14.2, FR14.3 | 🟡 Medio | Featured blade + grid |
| **14.3** | Project Hover Interactions | FR14.4, FR14.15, FR14.16 | 🔴 Alto | Zoom + action buttons + reduced motion |
| **14.4** | Project & Article Touch Behavior | FR14.14 | 🔴 Alto | Mobile UX crítico |
| **14.5** | Article Card Component | FR14.11, FR14.12 | 🟡 Medio | Date, tags, base structure |
| **14.6** | Articles Page Layout | FR14.8, FR14.13 | 🟡 Medio | Featured blade + list |
| **14.7** | Article Sequential Appearance | FR14.9, FR14.15, FR14.16 | 🔴 Alto | Scroll-triggered + canAnimate |
| **14.8** | Article Hover Thumbnail | FR14.10, FR14.16 | 🟡 Medio | Hover-specific (no follow mouse) |
| **14.9** | Epic 14 E2E Test Suite | NFR14.5 | 🟡 Medio | Hover, touch, animations |

---

### Dependencies

```
14.1 ──┬──> 14.2 ──> 14.3
       │
       └──> 14.4 (touch behavior uses same cards)

14.5 ──┬──> 14.6 ──> 14.7
       │
       └──> 14.8

14.3, 14.7 ──> 14.9 (E2E requires animations working)
```

**Paralelización:**
- 14.1-14.4 (Projects) pueden trabajarse en paralelo con 14.5-14.8 (Articles)
- 14.9 requiere ambos tracks completados

---

### Out of Scope (Epic 14)

⚠️ **Explícitamente fuera de alcance:**

- Filtrado de articles por categoría (considerar en Epic futuro si >5 articles)
- Cross-linking projects ↔ articles (nice-to-have, diferido)
- Animaciones de scroll-driven en project cards (solo hover zoom)
- Contenido real de proyectos/artículos (usar data existente o mock)
- Project detail page (existe, solo ajustar si es necesario)

---

## Epic 15: Auth System & Session UI (Planificado)

**Objetivo:** Implementar flujo completo de autenticación con Rodauth, incluyendo modal Sign In/Sign Up, estados visuales de sesión, y logout.

**FRs fuente:** UI & Motion Spec Section 2.3 "Auth Button"

**Rationale (Epic 13 Retrospective):** Auth puede esperar hasta que UX esté pulida.

*Stories por definir en próximo sprint planning.*

