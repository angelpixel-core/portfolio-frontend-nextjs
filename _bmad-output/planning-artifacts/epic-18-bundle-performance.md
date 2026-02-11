---
version: 1
scope: 'Epic 18'
baselineEpic: 17
status: draft
type: performance-optimization
sourceDocument: 'auditory/vercel-react-best-practices (branch)'
createdAt: '2026-02-11'
---

# Portfolio Frontend - Epic 18: Bundle Performance Optimization

## Overview

Este epic aborda los hallazgos pendientes de la auditoría Vercel React Best Practices que requieren cambios más amplios que los ya aplicados en la rama `auditory/vercel-react-best-pratices` (commits 1-8).

**Contexto:** La auditoría elevó el score de ~82/100 a ~93/100 con 8 commits atómicos. Los hallazgos restantes son optimizaciones de bundle que requieren refactors coordinados.

**Foco:** Reducción de JavaScript client-side, lazy loading, y mejora de perceived performance.

**Tipo:** Performance Optimization (no agrega funcionalidad nueva)

---

## Datos de Bundle Actuales (post-commit 8)

| Ruta | First Load JS | Nota |
|------|--------------|------|
| `/` | 184 kB | Home |
| `/about` | 187 kB | About |
| `/articles` | 170 kB | Article listing |
| `/articles/[slug]` | 139 kB | Article detail |
| `/projects` | 203 kB | Project listing |
| `/projects/[slug]` | 94.1 kB | Project detail |
| Shared (all pages) | 87.9 kB | Framework + shared chunks |

### Chunks Clave

| Chunk | Raw | Gzip | Contenido | Cargado en |
|-------|-----|------|-----------|------------|
| `2186` | 103.7 KiB | 33.5 KiB | **framer-motion** | TODAS las páginas (via layout) |
| `fd9d1056` | 168.8 KiB | 53.7 KiB | React + framework | Shared |
| `2117` | 121.4 KiB | 31.8 KiB | Shared libs | Shared |

**Hallazgo principal:** framer-motion (chunk 2186, 33.5 KiB gzip) se carga en el layout raíz y por tanto en TODAS las páginas, incluyendo las que no usan animaciones directamente.

---

## Requirements (NFRs de la auditoría)

| ID | Requirement | Severidad |
|----|-------------|-----------|
| NFR-P1 | framer-motion debe usar `LazyMotion` + feature splitting para reducir bundle | HIGH |
| NFR-P2 | Chat overlay debe cargarse dinámicamente (solo cuando el usuario lo abre) | MODERATE |
| NFR-P3 | `/articles/[slug]` debe tener `loading.tsx` para instant navigation feedback | LOW |

> **Nota:** WordCloud fue reportado en la auditoría pero NO EXISTE en el codebase actual. Descartado.

---

## Epic List

### Epic 18: Bundle Performance Optimization

**Goal:** Reducir el JavaScript client-side en ~15-25 KiB (gzip) mediante lazy loading de framer-motion y dynamic import del Chat, y mejorar perceived performance con loading states.

**NFRs cubiertos:** NFR-P1, NFR-P2, NFR-P3

---

## Story 18.1: Implementar LazyMotion + feature splitting para framer-motion

As a **visitor**,
I want **pages to load faster with smaller JavaScript bundles**,
So that **I experience snappier navigation and reduced data usage**.

### Contexto Técnico

**Estado actual:** 13 archivos importan directamente de `"framer-motion"`:
- 10 usan `motion.*` components (motion.div, motion.li, etc.)
- 6 usan `AnimatePresence`
- 1 usa `useReducedMotion`

**Archivos afectados:**

| Archivo | Imports actuales |
|---------|-----------------|
| `src/ui/atoms/ArticleHoverThumbnail/index.tsx` | `motion`, `AnimatePresence` |
| `src/ui/atoms/buttons/AuthButton/index.tsx` | `AnimatePresence`, `motion` |
| `src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx` | `motion` |
| `src/ui/atoms/motion/ArticleAppearance/index.tsx` | `motion` |
| `src/ui/molecules/Article/index.tsx` | `motion` |
| `src/ui/molecules/SocialAuthDropdown/index.tsx` | `motion`, `AnimatePresence` |
| `src/ui/organisms/Auth/Form/AuthForm.tsx` | `motion`, `AnimatePresence` |
| `src/ui/organisms/Auth/AuthModal.tsx` | `motion`, `AnimatePresence` |
| `src/ui/organisms/Chat/index.tsx` | `AnimatePresence` |
| `src/ui/organisms/ArticleContent/index.tsx` | `motion` |
| `src/ui/overlays/Floating/index.jsx` | `motion` |
| `src/ui/overlays/FloatingMobile/index.jsx` | `motion` |
| `src/hooks/ui/useReducedMotion.ts` | `useReducedMotion` |

**Estrategia:**

1. Crear `LazyMotion` provider con `domAnimation` features
2. Reemplazar `motion.*` → `m.*` en los 10 archivos que usan motion components
3. `AnimatePresence` y `useReducedMotion` NO necesitan cambios (son independientes de LazyMotion)
4. Envolver el layout raíz con `<LazyMotion features={domAnimation}>`

**Ahorro estimado:** ~15-20 KiB gzip (de 33.5 KiB a ~13-18 KiB). El feature bundle `domAnimation` incluye solo las features DOM necesarias, excluyendo layout animations, SVG path animations, y otros features pesados.

### Acceptance Criteria

**Given** el build actual tiene chunk 2186 (framer-motion) con 33.5 KiB gzip
**When** se implementa LazyMotion con domAnimation features
**Then** el chunk de framer-motion se reduce en al menos 12 KiB gzip

**Given** un componente que usa `motion.div` (ej: ArticleAppearance)
**When** se reemplaza por `m.div` con LazyMotion provider
**Then** la animación funciona idénticamente (entrada, salida, hover)

**Given** `prefers-reduced-motion: reduce` está activo en el OS
**When** se visita cualquier página con animaciones
**Then** las animaciones están reducidas/deshabilitadas (sin regresión del hook existente)

**Given** `npm run build` se ejecuta
**When** el build completa
**Then** no hay errores ni warnings nuevos

**Given** `npm test` se ejecuta
**When** todos los tests corren
**Then** los 963+ tests pasan sin regresiones

### Subtasks

1. Crear `src/providers/LazyMotionProvider.tsx` que exporta `<LazyMotion features={domAnimation} strict>`
2. Integrar el provider en el layout raíz (`src/app/layout.jsx`)
3. Refactorizar los 10 archivos: `import { motion } from "framer-motion"` → `import { m } from "framer-motion"`
4. Convertir `FloatingMobile/index.jsx` y `Floating/index.jsx` a TypeScript (.tsx)
5. Actualizar tests si alguno mockea framer-motion `motion`
6. Verificar build + tests + visual check en 3 viewports

### Riesgo: MEDIO

- **Scope amplio:** 12 archivos + 1 provider + layout
- **Mitigación:** Los cambios son mecánicos (rename `motion` → `m`), no lógicos
- **Riesgo real:** Algún componente podría usar features no incluidos en `domAnimation` (layout animations, SVG morphing). Verificar en visual check.

### Orden de ejecución: 1 (independiente)

---

## Story 18.2: Dynamic import del Chat overlay

As a **visitor**,
I want **the initial page load to be faster**,
So that **I can start reading content without waiting for chat code to download**.

### Contexto Técnico

**Estado actual:**
```
layout.jsx
  └─> dynamic(() => import("@/organisms/Footer"))   // Footer ya es lazy
       └─> import Chat from "@/organisms/Chat"       // Chat es EAGER dentro de Footer
            └─> AnimatePresence (framer-motion)
            └─> FloatingMobile → motion (framer-motion)
            └─> Floating → motion (framer-motion)
```

Footer es dynamic pero Chat se importa eagerly dentro de él. Chat solo se muestra cuando el usuario abre el panel (click en ChatButton). El 99% de las visitas nunca abren el chat.

**Estrategia:**
- Usar `next/dynamic` para importar Chat dentro de Footer
- Renderizar Chat condicionalmente basado en `chatPanel.isOpen` del Redux store
- Opcionalmente: preload el chunk en `onMouseEnter` del ChatButton

**Ahorro estimado:** ~3-8 KiB gzip (Chat + sus dependencias exclusivas: Floating, FloatingMobile, form components). El ahorro real depende de cuánto código es exclusivo de Chat vs compartido.

### Acceptance Criteria

**Given** la página se carga por primera vez
**When** el visitor no ha interactuado con el chat
**Then** el JavaScript del Chat no está en el bundle inicial (verificable en Network tab)

**Given** el visitor hace click en el botón de Chat
**When** el Chat overlay se abre
**Then** el Chat se carga dinámicamente y se muestra sin delay perceptible (<300ms)

**Given** el Chat está abierto y el visitor envía un mensaje
**When** la interacción se completa
**Then** toda la funcionalidad del Chat funciona igual que antes

**Given** `npm run build` se ejecuta
**When** el build completa
**Then** el Footer chunk es más pequeño que antes del cambio

### Subtasks

1. Modificar `src/ui/organisms/Footer/index.jsx` para usar `next/dynamic` con Chat
2. Agregar fallback/skeleton si es necesario (el Chat tiene AnimatePresence, puede no necesitarlo)
3. Verificar que el Redux state `chatPanel.isOpen` controla correctamente el render
4. Verificar build + tests + visual check

### Riesgo: BAJO

- **Scope reducido:** 1 archivo principal (Footer)
- **Patrón probado:** Footer ya usa dynamic import, Chat es autocontenido
- **Riesgo real:** Flash al abrir el chat si el chunk tarda en cargar. Mitigable con preload.

### Orden de ejecución: 2 (después de Story 18.1 porque Chat usa framer-motion)

---

## Story 18.3: Agregar loading.tsx para /articles/[slug]

As a **visitor**,
I want **instant visual feedback when navigating to an article**,
So that **I know the page is loading and don't see a blank screen**.

### Contexto Técnico

**Estado actual:**
- `/projects/[slug]/loading.tsx` existe → importa `ProjectDetailSkeleton`
- `/articles/[slug]/loading.tsx` **NO existe** → el usuario ve blank/stall durante server render
- `ArticleListSkeleton.tsx` existe para la lista pero no hay skeleton para el detalle

**Estrategia:**
1. Crear `src/app/articles/[slug]/loading.tsx`
2. Crear un `ArticleDetailSkeleton` component (similar a `ProjectDetailSkeleton`)
3. El skeleton debe reflejar la estructura del article detail: header con meta, título, imagen, contenido

**Ahorro estimado en bundle:** 0 KiB (no reduce bundle). **Mejora en perceived performance:** significativa para artículos con server-side rendering.

### Acceptance Criteria

**Given** el visitor está en `/articles`
**When** hace click en un artículo
**Then** se muestra inmediatamente un skeleton/loading state

**Given** el skeleton se muestra
**When** el artículo termina de cargar
**Then** el skeleton se reemplaza suavemente por el contenido real

**Given** el skeleton se renderiza
**When** se inspecciona visualmente en mobile (375px) y desktop (1024px)
**Then** la estructura visual del skeleton coincide con la del artículo real (meta arriba, título, imagen, contenido)

**Given** `npm run build` se ejecuta
**When** el build completa
**Then** no hay errores y el route `/articles/[slug]` sigue siendo dynamic (`ƒ`)

### Subtasks

1. Analizar estructura HTML de `ArticleContent` para diseñar el skeleton
2. Crear `src/ui/organisms/ArticleContent/skeleton.tsx` (o en el directorio que corresponda)
3. Crear `src/app/articles/[slug]/loading.tsx` que importa el skeleton
4. Visual check en 2 viewports (mobile + desktop)

### Riesgo: BAJO

- **Scope mínimo:** 2 archivos nuevos, 0 archivos modificados
- **Sin regresión posible:** loading.tsx es additive, no modifica nada existente
- **Patrón establecido:** Sigue exactamente el mismo patrón de `/projects/[slug]/loading.tsx`

### Orden de ejecución: 3 (independiente, puede hacerse en paralelo con 18.1 o 18.2)

---

## Resumen de Ejecución

| Story | Descripción | Archivos | Ahorro (gzip) | Riesgo | Orden |
|-------|-------------|----------|---------------|--------|-------|
| 18.1 | LazyMotion + `m` refactor | ~14 archivos | ~15-20 KiB | MEDIO | 1 |
| 18.2 | Dynamic import Chat | ~1-2 archivos | ~3-8 KiB | BAJO | 2 |
| 18.3 | loading.tsx articles/[slug] | 2 archivos nuevos | 0 (UX) | BAJO | 3 |

**Ahorro total estimado:** ~18-28 KiB gzip en First Load JS

**Impact proyectado en build stats:**

| Ruta | Antes | Después (estimado) |
|------|-------|---------------------|
| `/` | 184 kB | ~162-169 kB |
| `/about` | 187 kB | ~165-172 kB |
| `/articles` | 170 kB | ~148-155 kB |
| `/projects` | 203 kB | ~181-188 kB |

**Audit score proyectado:** ~93/100 → ~96-97/100

---

## Descartados

| Hallazgo original | Razón de descarte |
|-------------------|-------------------|
| WordCloud dynamic import | El componente WordCloud NO existe en el codebase |
