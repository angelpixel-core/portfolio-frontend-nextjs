# ADR-010: Layout vs Component Responsibilities

**Date:** 2026-02-16
**Status:** Accepted
**Story:** 24.0 — Spatial System Definition
**Epic:** 24 — Spatial System & Layout Stabilization

## Context

El proyecto no tiene reglas formales sobre qué propiedades CSS pertenecen al layout y cuáles al componente. Esto causa:

1. **Componentes que definen espacio externo** — atoms con `margin`, `width` hardcodeado, o padding que debería ser del layout
2. **Layouts que definen identidad visual** — containers con colores, bordes, o sombras que deberían ser del componente
3. **Acoplamiento** — mover un componente de contexto requiere reescribir sus styles porque asume un layout específico
4. **Anti-patterns recurrentes:**
   - MainContainer tiene `inline-block` (layout concern mezclado con component concern)
   - Componentes con `w-[Npx]` hardcoded que no respetan su container
   - Margin externo en atoms (`.mt-8` en componentes que asumen contexto)

### Tres Niveles del Sistema Espacial

```
┌─────────────────────────────────────────────┐
│  LAYOUT                                     │
│  Flujo, stacking, distribución, límites,    │
│  contención, relación espacial              │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  COMPONENTE                         │    │
│  │  Identidad visual, comportamiento,  │    │
│  │  variaciones, estados internos      │    │
│  │                                     │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │  CONTENIDO                  │    │    │
│  │  │  Texto, imágenes, datos     │    │    │
│  │  └─────────────────────────────┘    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Decision

### Property Classification Table

| Property | Owner | Justification |
|----------|-------|---------------|
| `display` (flex, grid, block) | **Layout** | Define el flujo de hijos |
| `flex-direction`, `flex-wrap` | **Layout** | Dirección del flujo |
| `gap` | **Layout** | Espacio entre siblings — responsabilidad del container |
| `grid-template-*`, `grid-cols-*` | **Layout** | Estructura de grilla |
| `justify-*`, `items-*`, `align-*` | **Layout** | Alineación de hijos en el container |
| `width`, `max-width`, `min-width` | **Layout** | Dimensiones horizontales del contenedor |
| `height`, `max-height`, `min-height` | **Layout** (blade level) | Dimensiones verticales del contenedor |
| `margin` (external) | **Layout** | Espacio externo — responsabilidad del padre, no del hijo |
| `position` (relative/absolute) | **Layout** | Posicionamiento — contexto del padre |
| `z-index` | **Layout** | Stacking order — responsabilidad del contexto |
| `overflow` | **Layout** | Contención — responsabilidad del contenedor |
| `order` | **Layout** | Reordenamiento visual |
| `padding` (internal) | **Component** | Espacio interno del componente |
| `background-*`, `bg-*` | **Component** | Identidad visual |
| `color`, `text-*`, `font-*` | **Component** | Tipografía y color |
| `border-*`, `rounded-*` | **Component** | Bordes y esquinas |
| `shadow-*` | **Component** | Elevación visual |
| `opacity`, `transition-*` | **Component** | Comportamiento visual |
| `cursor-*` | **Component** | Interacción |
| `outline-*` (focus) | **Component** | Accesibilidad visual |

### Prohibitions

| Prohibición | Nivel | Justificación | Enforcement |
|------------|-------|---------------|-------------|
| `width` / `max-width` hardcodeado en atoms | Atom | Atoms se expanden al container. Sizing es responsabilidad del layout. | Code review |
| `margin` externo en componentes (`mt-*`, `mb-*`, `ml-*`, `mr-*`) | Component (todos) | Espacio externo es responsabilidad del padre (via `gap` o layout utilities). | Code review |
| `position: absolute` para layout | Layout | Absolute positioning para layout es frágil. Usar flex/grid. | Code review |
| Colors/backgrounds en layouts | Layout | Layouts son invisibles. La identidad visual es del componente. | Code review |
| `!important` en spacing | Cualquiera | Indica un conflicto de especificidad. Resolver la causa, no el síntoma. | ESLint (existente) |
| `inline-block` para containers | Layout | Usar `block`, `flex`, o `grid`. `inline-block` causa problemas de whitespace. | Code review |

### Documented Exceptions

| Excepción | Propiedad | Valor | Justificación |
|-----------|-----------|-------|---------------|
| Buttons/links | `min-height` | `44px` / `min-h-[44px]` | WCAG 2.5.8: Target Size minimum 44x44px para touch targets |
| Icons (atoms) | `width`, `height` | Intrinsic (`w-5`, `h-5`, etc.) | Icons tienen tamaño intrínseco, no se expanden al container |
| Avatars | `width`, `height` | Intrinsic (`w-10`, `h-10`, etc.) | Tamaño fijo por diseño |
| Badges/pills | `padding` + `min-width` | Per design | Badges tienen sizing mínimo para legibilidad |
| Skip-link | `position: absolute` | Off-screen → visible on focus | Accesibilidad: WCAG 2.4.1 |
| Overlays/modals | `position: fixed` | Full viewport | Overlays viven fuera del flujo normal |
| `my-*` en `<hr>` / separators | `margin` vertical | Per context | Separadores son inherentemente sobre spacing |
| Home page `!important` | Various | Overrides de `.main-container` | Legacy — eliminar en Story 24.2 |

### Composition Rules

**Cómo componentes se relacionan dentro de layouts:**

1. **Un componente NUNCA conoce a su padre.** No debe asumir que está dentro de un flex, grid, o container específico.

2. **Un componente SIEMPRE ocupa el 100% de su container** (width: auto/100%) excepto los que tienen intrinsic sizing (icons, avatars, badges).

3. **El spacing entre siblings es responsabilidad del layout container** (via `gap`), no del componente (via `margin`).

4. **Nesting:** Un componente puede ser layout de sus propios hijos (ej: un card es layout de title + summary + actions) pero no layout de sus siblings.

5. **Responsiveness:** Los breakpoints que cambian layout (columns, direction, visibility) van en el layout level. Los breakpoints que cambian apariencia (font-size, padding, colors) van en el component level.

### Decision Tree

```
¿Esta propiedad afecta la RELACIÓN ESPACIAL entre elementos?
├── SÍ → Layout property
│   ├── ¿Define flujo de hijos? (display, flex-direction) → Layout
│   ├── ¿Define espacio ENTRE hijos? (gap, space-y) → Layout
│   ├── ¿Define tamaño del container? (width, height, max-*) → Layout
│   ├── ¿Define posición relativa a siblings? (order, margin) → Layout
│   └── ¿Define stacking/overflow? (z-index, overflow) → Layout
│
└── NO → Component property
    ├── ¿Define apariencia visual? (color, bg, border, shadow) → Component
    ├── ¿Define espacio INTERNO? (padding) → Component
    ├── ¿Define tipografía? (font-*, text-*) → Component
    ├── ¿Define interacción? (cursor, transition) → Component
    └── ¿Define accesibilidad visual? (outline, focus) → Component

EXCEPCIONES:
- ¿Es un icon/avatar/badge? → Intrinsic sizing permitido en Component
- ¿Es un touch target? → min-height: 44px permitido en Component (WCAG)
- ¿Es un overlay/modal? → position: fixed permitido en Component
```

## Consequences

### Positive
- Separación clara reduce acoplamiento — mover componentes entre contextos es seguro
- Decision tree elimina ambigüedad en code review
- Prohibiciones previenen anti-patterns recurrentes
- Excepciones documentadas evitan reglas demasiado rígidas

### Negative
- Requiere migración de componentes existentes que violan las reglas (Story 24.2)
- Code review es el enforcement principal — no hay automated linting para la mayoría de reglas
- La clasificación de `padding` (component) vs `margin` (layout) puede ser confusa para contribuidores nuevos
- Excepciones podrían crecer si no se mantienen controladas

## Enforcement

- **Code Review:** Validar contra la classification table y el decision tree
- **Story 24.2:** Migrar violaciones existentes (hardcoded widths, external margins, inline-block)
- **Future (optional):** Stylelint rule para detectar margin en archivos de atoms
- **Layout Audit:** El documento `layout-audit-epic-24.md` enumera todas las violaciones actuales con severidad

## References

- [ADR-008: Spacing Scale](./008-spacing-scale.md) — Niveles semánticos de spacing
- [ADR-009: Containment Rules](./009-containment-rules.md) — Container hierarchy y max-width policy
- [Component API](../architecture/component-api.md) — Props typing, component patterns
- [Styles Architecture](../architecture/styles-architecture.md) — CSS patterns, BEM naming
- [Layout Patterns](../architecture/layout-patterns.md) — Every Layout primitives, page composition
- [Layout Audit](../architecture/layout-audit-epic-24.md) — Inventario de violaciones actuales
