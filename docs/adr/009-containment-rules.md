# ADR-009: Containment Rules

**Date:** 2026-02-16
**Status:** Accepted
**Story:** 24.0 — Spatial System Definition
**Epic:** 24 — Spatial System & Layout Stabilization

## Context

El proyecto tiene un contenedor raíz (`max-width: 1024px`) pero carece de reglas formales de contención para niveles intermedios. El sistema responde en ancho (breakpoints) pero no tiene estrategia de contención vertical. Hallazgos específicos:

1. **max-width** solo existe en `.layout` (1024px). No hay policy para blades, secciones, ni componentes.
2. **min-height** no tiene estrategia. `.layout` usa `min-height: 100vh` (no `100dvh`). Las secciones críticas (hero, main content) no tienen min-height definido.
3. **overflow** es inconsistente: no hay reglas sobre cuándo usar `auto`, `hidden`, o `visible`.
4. **Blades** (secciones viewport-aware) no tienen definición formal.

### Estado Actual del Container Hierarchy

```
body
└── .layout          → max-width: 1024px, min-height: 100vh, flex column
    ├── <header>     → (NavBar) — no max-width, no min-height
    ├── #main-content → flex: 1 (pushes footer down)
    │   └── .main-container → inline-block, w-full, h-full, padding legacy
    │       └── [page content / blades]
    └── <footer>     → (Footer) — no max-width, no min-height
```

### Problemas Identificados

- `100vh` en `.layout` no considera la barra de navegación móvil (iOS Safari)
- MainContainer usa `inline-block` (anti-pattern, debería ser `block` o `flex`)
- No hay min-height en hero sections — contenido puede colapsar a 0px
- Blades no tienen identidad formal (hero, grid, list) — son divs con clases ad-hoc
- El footer es pushed-down por `flex: 1` en `#main-content`, pero no tiene min-height propio

## Decision

### 1. Max-Width Policy por Nivel

| Nivel | max-width | Responsable | Notas |
|-------|-----------|-------------|-------|
| **Root** (`.layout`) | `1024px` | `globals.css` | Centering via `margin: 0 auto`. Inmutable. |
| **Blade** (section) | `inherit` (1024px) | Layout level | Blades heredan del root. No definen max-width propio. |
| **Component** | `none` | Component level | Componentes NUNCA definen width/max-width propios. Se expanden al 100% de su contenedor. Excepciones: icons, avatars, badges (intrinsic sizing). |
| **Content Container** (`.main-container`) | `inherit` | Layout level | Padding define el espacio interno, no max-width. |

**Regla:** Solo `.layout` define max-width. Todo lo demás hereda o usa width: 100%.

**Violación conocida:** `organisms/ArticleContent/styles.css` define `max-width: 800px` para el contenedor de prosa. Migrar a un layout primitive (Center) en Story 24.2.

### 2. Min-Height Strategy

| Elemento | min-height | Justificación |
|----------|-----------|---------------|
| `.layout` | `100dvh` | **Cambio:** Migrar de `100vh` a `100dvh` para iOS Safari. Fallback: `min-height: 100vh; min-height: 100dvh;` |
| Hero blade | `60dvh` (sugerido) | Garantiza presencia visual. Ajustar en Story 24.2. |
| `#main-content` | `none` (flex: 1 suficiente) | El flex-grow ya maneja el espacio. Agregar min-height causaría conflicto. |
| Footer | `none` | Footer es content-driven. No necesita min-height. |
| Page error/not-found | `50vh` (ya implementado) | `min-h-[50vh]` ya existe en `error.tsx` y `not-found.tsx`. |

**Regla:** `min-height` se aplica solo donde el contenido puede colapsar a dimensiones inaceptables. No aplicar min-height defensivo en todos los contenedores.

### 3. Overflow Behavior

| Contexto | Overflow | Justificación |
|----------|----------|---------------|
| `.layout` (root) | `visible` (default) | El contenido nunca debería overflow del root. Si lo hace, es un bug. |
| Hero blade | `hidden` | Elementos decorativos (gradients, backgrounds) no deben desbordar. |
| Scrollable lists | `overflow-y: auto` | Solo en containers explícitamente scrollable (chat panel, mobile menu). |
| Page transitions | `overflow: hidden` en `body` | Ya implementado en `body.transition-active`. |
| Components | `visible` (default) | Nunca usar `overflow: hidden` en componentes como fix para layout issues. |

**Regla:** `overflow: hidden` es una decisión de layout, no de componente. Solo se aplica en el nivel de blade o superior.

### 4. Blade Definitions

Un **blade** es una sección semántica que ocupa una fracción significativa del viewport. Clasificación formal:

| Blade Type | Características | Ejemplo |
|-----------|----------------|---------|
| **Hero Blade** | Primera sección visible. Background decorativo. `min-height: 60dvh` sugerido. Contiene heading + CTA. | Home hero, About hero |
| **Grid Blade** | Grilla de cards/items. `display: grid` con `gap-8`. Responsive columns. | Projects grid, Articles grid |
| **List Blade** | Lista vertical de items. `display: flex; flex-direction: column` con `gap-4`/`gap-6`. | Article list, Experience timeline |
| **Detail Blade** | Contenido de detalle (prose). Max-width implícito por root. Padding generoso. | Article detail, Project detail |
| **Footer Blade** | Siempre al bottom. Multi-column en desktop, stack en mobile. | Footer |

**Convención de naming:** Los blades no tienen clase CSS dedicada. Se identifican por su BEM block class (ej: `.home-hero`, `.projects-grid`, `.articles-list`). Story 24.1 puede optar por agregar un `.blade` utility class si los Every Layout primitives lo requieren.

### 5. Viewport Height Rules

| Propiedad | Cuándo Usar | Cuándo NO Usar |
|-----------|-------------|----------------|
| `100dvh` | Root layout container (`.layout`) | Componentes internos |
| `100vh` | Fallback para browsers sin dvh support (progressive enhancement) | Como valor único sin fallback dvh |
| `calc(100dvh - Xpx)` | **Nunca.** Evitar cálculos con magic numbers. | — |
| `min-h-screen` | **Evitar.** Tailwind lo mapea a `100vh`, no `100dvh`. | — |
| `min-h-[50vh]` | Error/not-found pages (ya implementado) | Secciones regulares |

**Migración propuesta** (Story 24.2):
```css
/* Before */
.layout { min-height: 100vh; }

/* After (progressive enhancement) */
.layout {
  min-height: 100vh;
  min-height: 100dvh;
}
```

## Consequences

### Positive
- Container hierarchy documentada — cada nivel sabe qué puede y qué no puede definir
- min-height strategy previene colapsos sin crear rigidez
- Blade definitions formalizan patrones ya existentes
- dvh migration mejora experiencia en iOS Safari

### Negative
- La migración a `100dvh` requiere testing en múltiples devices (Story 24.2)
- Blade definitions podrían ser demasiado rígidas para futuros layouts — mantener flexibilidad
- No hay enforcement automático (no existe linter para containment rules)

## Enforcement

- **Code Review:** Validar que componentes no definen width/max-width (excepciones: intrinsic sizing)
- **Story 24.2:** Aplicar min-height y dvh migration
- **Story 24.3:** E2E vertical viewport tests validarán containment

## References

- [globals.css](../../src/styles/globals.css) — Root layout container
- [MainContainer/styles.css](../../src/ui/atoms/hocs/MainContainer/styles.css) — Legacy padding
- [Layout Patterns](../architecture/layout-patterns.md) — Blade architecture, page composition
- [ADR-002: Breakpoint Standardization](./002-breakpoint-standardization.md) — Breakpoint hierarchy
- [ADR-008: Spacing Scale](./008-spacing-scale.md) — Spacing levels referenced for blade gaps
