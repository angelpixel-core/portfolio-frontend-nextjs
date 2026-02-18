# Z-Index Scale

**Date:** 2026-02-18
**Scope:** Arquitectura CSS — capas, overlays y accesibilidad

## Contexto

El proyecto usa una mezcla de `z-index` en CSS y utilidades Tailwind (`z-*`). Sin una escala oficial, los valores pueden competir entre sí y generar conflictos invisibles. Esta escala consolida valores existentes y define reglas de uso.

## Escala oficial (7 capas)

| Capa           | Rango / Valor | Uso                                                       | Tailwind              |
| -------------- | ------------- | --------------------------------------------------------- | --------------------- |
| **Background** | -10 a -1      | Sombras y pseudo-elementos (BoxShadow, FeaturedBoxShadow) | `-z-10`               |
| **Document**   | 0             | Flujo base del layout                                     | _(sin clase)_         |
| **Elevation**  | 1             | Elevación mínima (no competir con Components)             | _(custom CSS)_        |
| **Components** | 10            | NavBar, imágenes, carruseles                              | `z-10`                |
| **Overlays**   | 20            | Backdrops y capas intermedias                             | `z-20`                |
| **Panels**     | 30            | Contenido de overlays (paneles, botones flotantes)        | `z-30`                |
| **Modals**     | 40–50         | Auth, dropdowns, TransitionEffect curtains                | `z-40`, `z-50`        |
| **A11y**       | 100–9999      | Skip links y accesibilidad extrema                        | `z-[100]`, `z-[9999]` |

**Nota:** `TransitionEffect` utiliza `z-50 / z-40 / z-30` para las capas de cortinas (Story 13.6).

## Reglas de uso

1. **No inventar valores nuevos** sin actualizar este documento.
2. **`z-9999` está reservado exclusivamente para skip-link.**
3. **`z-100` es la capa general de accesibilidad.**
4. **Panels vs Modals:** Si un overlay debe bloquear interacción, usar Modals (40–50). Si es informativo/no modal, usar Panels (30).

## Conflictos conocidos (documentados)

- **HireMe (z-30)** y **Floating panel (z-30)** comparten capa. No es problema porque son mutuamente excluyentes en visibilidad.

## Auditoría periódica (comandos)

```bash
# CSS files con z-index
grep -rn "z-index" src/ --include="*.css"

# Tailwind utilities en JSX/TSX
grep -rn "z-[0-9]" src/ --include="*.tsx" --include="*.jsx"
```

Estos comandos permiten validar que los valores se mantienen dentro de la escala.

## Referencias

- `docs/architecture/styles-architecture.md`
- Story 13.6 (TransitionEffect layering)
- Epic 25 — Architectural Coherence Sprint
