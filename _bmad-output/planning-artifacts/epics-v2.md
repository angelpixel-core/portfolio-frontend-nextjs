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

- Auth button modal y estados de sesión (Epic 14)
- Animaciones específicas de páginas Projects/Articles (Epic 15+)
- Stats count-up animation (ya en About, puede refinarse post-transition)
- Skills galaxy/spiral animation trigger (ajustar si es necesario)

---

## Epic 14: Auth System & Session UI (Planificado)

**Objetivo:** Implementar flujo completo de autenticación con Rodauth, incluyendo modal Sign In/Sign Up, estados visuales de sesión, y logout.

**FRs fuente:** UI & Motion Spec Section 2.3 "Auth Button"

*Stories por definir en próximo sprint planning.*

---

## Epic 15: Projects & Articles Pages (Planificado)

**Objetivo:** Implementar comportamiento UX de páginas Projects y Articles según spec, incluyendo featured/non-featured layouts y efectos hover.

**FRs fuente:** UI & Motion Spec Section 3 "Pages" (Projects, Articles)

*Stories por definir en próximo sprint planning.*

