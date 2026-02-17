# ADR-008: Spacing Scale

**Date:** 2026-02-16
**Status:** Accepted
**Story:** 24.0 — Spatial System Definition
**Epic:** 24 — Spatial System & Layout Stabilization

## Context

El proyecto usa la escala de spacing default de Tailwind CSS sin tokens custom ni convenciones formales. Un análisis del codebase revela uso informal pero consistente de 6 niveles de gap:

| Tailwind Class | Value | Usage Pattern | Occurrences |
|---------------|-------|---------------|-------------|
| `gap-0.5` | 2px | Micro spacing (skills pills) | 1 |
| `gap-1` | 4px | Icon groups, inline elements, tight labels | 8 |
| `gap-2` | 8px | Component-level (forms, social links, tags, badges) | 25 |
| `gap-3` | 12px | Medium-tight (chat messages, auth separators) | 5 |
| `gap-4` | 16px | Standard section spacing (menus, footers, cards, filters) | 14 |
| `gap-5` | 20px | Auth form sections | 1 |
| `gap-6` | 24px | Section transitions (mobile menu, articles grid) | 6 |
| `gap-8` | 32px | Page-level grids (projects, about, floating panel) | 8 |
| `gap-10` | 40px | Wide grid spacing (projects desktop) | 1 |

Además, `space-y-2` (8px) y `space-y-4` (16px) se usan en skeletons y contenido vertical, y `space-y-8` (32px) en detail views.

No existen custom CSS properties (`--space-*`) ni un spacing token system. Todos los valores provienen directamente de las utilidades de Tailwind.

### Problema

Sin una escala formal:
1. Desarrolladores eligen valores ad-hoc (gap-3 vs gap-4 para contextos similares)
2. No hay reglas sobre cuándo usar `gap` vs `margin` vs `padding` vs `space-y`
3. La vertical rhythm es accidental, no diseñada
4. No hay contract que guíe a nuevos contribuidores

## Decision

### Base Unit: 4px (Tailwind Default)

Se mantiene la base unit de 4px de Tailwind. Justificación:
- El codebase ya está construido sobre esta escala
- 4px ofrece granularidad suficiente sin ser excesiva
- Tailwind documenta y mantiene esta progresión
- No se introducen custom tokens — la escala de Tailwind ES el sistema

### Scale Progression

Se adoptan **4 niveles semánticos** mapeados a Tailwind, sin crear CSS custom properties:

| Nivel Semántico | Tailwind Class | Value | Uso |
|----------------|---------------|-------|-----|
| **Micro** | `gap-1` / `gap-0.5` | 2-4px | Between icons, inline elements, pill internals |
| **Tight** | `gap-2` | 8px | Within components: form fields, tags, badges, links |
| **Standard** | `gap-4` | 16px | Between siblings: cards, menu items, footer sections |
| **Loose** | `gap-6` / `gap-8` | 24-32px | Between sections: page grids, blade separation |

Los valores intermedios (`gap-3`, `gap-5`, `gap-10`) son excepciones permitidas con justificación documentada en comentarios.

### Gap Rules: gap vs margin vs padding vs space-y

| Mecanismo | Cuándo Usar | Cuándo NO Usar |
|-----------|-------------|----------------|
| `gap-*` | Flex/Grid containers con hijos uniformes | Elementos individuales, separación asimétrica |
| `space-y-*` / `space-x-*` | Stacks de contenido sin flex/grid (prose, skeletons) | Containers flex/grid (usar gap en su lugar) |
| `p-*` / `px-*` / `py-*` | Espacio interno de un componente (padding propio) | Separación entre siblings |
| `m-*` / `mx-*` / `my-*` | **Excepciones documentadas solamente** — ver prohibiciones en ADR-010 | Separación entre siblings en containers flex/grid |

**Regla principal:** Preferir `gap` sobre `margin` para separación entre siblings. El margin externo en componentes está prohibido excepto en casos documentados (ver ADR-010).

### Vertical Rhythm Strategy

No se implementa un sistema formal de vertical rhythm (baseline grid). Justificación:
- El proyecto usa tipografía progresiva (`phablet:`, `mobile:`) que cambia font-size por breakpoint
- Un baseline grid rígido entra en conflicto con la progresión tipográfica responsiva
- El spacing consistente via niveles semánticos (micro/tight/standard/loose) es suficiente para coherencia visual

**Convención vertical:** Las secciones de página (blades) usan `gap-8` (32px) entre sí. Dentro de cada blade, el spacing sigue la jerarquía semántica.

### Relación con Tailwind

| Decisión | Razón |
|----------|-------|
| NO crear `--space-*` custom properties | La escala de Tailwind ya es el sistema; duplicarla añade complejidad sin valor |
| NO crear utilidades custom de spacing | Las clases existentes (`gap-*`, `p-*`, `m-*`, `space-y-*`) cubren todos los casos |
| SÍ documentar niveles semánticos | Guían la elección del valor correcto sin restringir la escala |
| SÍ permitir la escala completa de Tailwind | No prohibir valores intermedios — solo requieren justificación |

## Consequences

### Positive
- Zero migration cost — el codebase ya usa esta escala
- Self-documenting — los nombres semánticos guían decisiones
- Enforceable — code review puede validar contra los niveles
- Flexible — no restringe Tailwind, solo organiza su uso

### Negative
- No hay enforcement automático (no existe ESLint rule para spacing levels)
- Los niveles semánticos dependen de disciplina de equipo
- `gap-3`, `gap-5` son grises semánticos — requieren juicio caso a caso

## Enforcement

- **Code Review:** Validar que spacing sigue niveles semánticos
- **Future (optional):** Stylelint rule para flaggear valores de spacing fuera de los niveles primarios (gap-1, gap-2, gap-4, gap-6, gap-8)
- **ADR-010 dependency:** Las prohibiciones de margin externo en componentes se definen en el ADR de Layout vs Component

## References

- [Tailwind Spacing Scale](https://tailwindcss.com/docs/customizing-spacing)
- [ADR-002: Breakpoint Standardization](./002-breakpoint-standardization.md)
- [Layout Patterns](../architecture/layout-patterns.md) — Spacing Patterns section
- [Styles Architecture](../architecture/styles-architecture.md) — @apply policy
- [Epic 24 Definition](../../_bmad-output/planning-artifacts/epics-v4.md#epic-24)
