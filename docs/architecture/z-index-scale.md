# Z-Index Scale

**Date:** 2026-02-26
**Scope:** Arquitectura CSS — capas, overlays y accesibilidad

## Contexto

El proyecto usa una mezcla de `z-index` en CSS y utilidades Tailwind (`z-*`). Sin una escala oficial, los valores pueden competir entre sí y generar conflictos invisibles. Esta escala consolida valores existentes y define reglas de uso.

## Escala oficial (8 capas)

| Capa               | Rango / Valor | Uso                                                                                     | Tailwind / CSS                              |
| ------------------ | ------------- | --------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Background**     | -10 a -1      | Sombras, pseudo-elementos y depth layers (BoxShadow, FeaturedBoxShadow, skill)          | `-z-10`, `z-[-1]`                           |
| **Document**       | 0             | Flujo base del layout (MainContainer, Footer, History)                                  | `z-0`                                       |
| **Elevation**      | 1             | Elevacion minima para iconos/animaciones puntuales                                      | `z-[1]` (o `z-index: 1`)                    |
| **Components**     | 10            | Navbar base, imagenes flotantes, carruseles y thumbnails de contenido                   | `z-10`                                      |
| **Legacy Overlay** | 20–60         | Capas historicas no bloqueantes o locales (chat, hire-me, paneles antiguos)             | `z-20`, `z-30`, `z-40`, `z-50`, `60`        |
| **OverlayTop**     | 90 / 91       | Regla global para overlays activos: backdrop/modal container (90) + panel/dropdown (91) | `--z-overlay-backdrop`, `--z-overlay-panel` |
| **A11y**           | 100           | Capa general de accesibilidad (sin competir con skip-link)                              | `z-[100]`                                   |
| **Skip Link**      | 9999          | Reserva exclusiva para salto de navegacion                                              | `z-[9999]`                                  |

**Nota:** `TransitionEffect` mantiene `z-50 / z-40 / z-30` para las cortinas (Story 13.6). OverlayTop (90/91) no debe usarse en transiciones de pagina.

## Inventario auditado (scope Story 25.6)

Exclusion explicita: `src/ui/organisms/WordCloud/**` queda fuera de alcance por decision de Epic 25.

| Valor                                | Capa           | Evidencia (archivo)                                                                                                                                                                                                                                     |
| ------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-z-10`                              | Background     | `src/ui/atoms/shadows/BoxShadow/styles.css`, `src/ui/atoms/shadows/FeaturedBoxShadow/styles.css`, `src/app/articles/ArticleListSkeleton.tsx`                                                                                                            |
| `z-index: -1`                        | Background     | `src/ui/molecules/skill/styles.css`, `src/ui/atoms/buttons/SkillSelectorButton/index.tsx`                                                                                                                                                               |
| `z-0` / `z-index: 0`                 | Document       | `src/ui/organisms/Footer/styles.css`, `src/ui/atoms/hocs/MainContainer/styles.css`, `src/ui/atoms/hocs/History/styles.css`, `src/ui/organisms/Auth/styles.css`, `src/ui/atoms/buttons/SkillSelectorButton/index.tsx`                                    |
| `z-index: 1` / `zIndex: 1`           | Elevation      | `src/app/styles.css`, `src/ui/atoms/icons/LiIcon/styles.css`, `src/ui/organisms/Skills/index.tsx`                                                                                                                                                       |
| `z-10`                               | Components     | `src/ui/organisms/NavBar/styles.css`, `src/ui/molecules/MovingImage/styles.css`, `src/ui/molecules/FeaturedArticlesCarousel/styles.css`, `src/ui/molecules/skill/index.tsx`, `src/ui/organisms/Auth/styles.css`                                         |
| `z-20`                               | Legacy Overlay | `src/ui/organisms/Chat/styles.css`                                                                                                                                                                                                                      |
| `z-30`                               | Legacy Overlay | `src/ui/molecules/HireMe/styles.css`, `src/ui/atoms/buttons/MenuButton/styles.css`, `src/ui/molecules/TransitionEffect/index.tsx`                                                                                                                       |
| `z-40`                               | Legacy Overlay | `src/ui/molecules/TransitionEffect/index.tsx`                                                                                                                                                                                                           |
| `z-50` / `z-index: 50`               | Legacy Overlay | `src/ui/atoms/ArticleHoverThumbnail/styles.css`, `src/ui/organisms/NavBar/styles.css` (`.layout__hireme-mobile .hire-me__container`), `src/ui/molecules/TransitionEffect/index.tsx`                                                                     |
| `z-index: 60`                        | Legacy Overlay | `src/ui/molecules/Experience/styles.css`                                                                                                                                                                                                                |
| `z-index: var(--z-overlay-backdrop)` | OverlayTop     | `src/ui/overlays/Floating/styles.css`, `src/ui/overlays/FloatingMobile/styles.css`, `src/ui/organisms/Auth/styles.css`, `src/ui/organisms/ResumeRequest/styles.css`, `src/ui/organisms/HireFlow/styles.css`, `src/ui/molecules/Monetization/styles.css` |
| `z-index: var(--z-overlay-panel)`    | OverlayTop     | `src/ui/overlays/Floating/styles.css`, `src/ui/overlays/FloatingMobile/styles.css`, `src/ui/atoms/buttons/AuthButton/styles.css`, `src/ui/molecules/SocialAuthDropdown/styles.css`                                                                      |
| `z-index: 100`                       | A11y           | `src/app/coming-soon/styles.css`                                                                                                                                                                                                                        |
| `z-index: 9999`                      | A11y           | `src/styles/globals.css`                                                                                                                                                                                                                                |

## Reglas de uso

1. **No inventar valores nuevos** sin actualizar este documento.
2. **Todo overlay bloqueante debe usar OverlayTop** (`--z-overlay-backdrop` / `--z-overlay-panel`).
3. **`z-9999` está reservado exclusivamente para skip-link.**
4. **`z-100` es la capa general de accesibilidad.**
5. **Las capas Legacy (20–60)** solo se mantienen por compatibilidad y no deben usarse en nuevos overlays.
6. **Todo overlay bloqueante debe renderizar via portal** (`src/ui/overlays/OverlayPortal/index.tsx`) para evitar conflictos de stacking context locales.

## Conflictos conocidos (documentados)

- **HireMe (z-30)** y **Floating panel (z-30)** comparten capa. No es problema porque son mutuamente excluyentes en visibilidad.
- **HireMe breakpoint elevation**: en mobile, el contenedor puede escalar a `z-50` para priorizar CTA sobre capas de navegacion; en desktop se mantiene en capa Panels (`z-30`).

## Auditoría periódica (comandos)

```bash
# CSS files con z-index
grep -rn "z-index" src/ --include="*.css"

# Tailwind utilities en JSX/TSX
grep -rn "z-[0-9]" src/ --include="*.tsx" --include="*.jsx"

# Scope Story 25.6 (excluye WordCloud)
grep -rn "z-index" src/ --include="*.css" | grep -v "src/ui/organisms/WordCloud/"
grep -rn "z-\\[\|z-[0-9]" src/ --include="*.tsx" --include="*.jsx" | grep -v "src/ui/organisms/WordCloud/"
```

Estos comandos permiten validar que los valores se mantienen dentro de la escala.

## Referencias

- `docs/architecture/styles-architecture.md`
- Story 13.6 (TransitionEffect layering)
- Epic 25 — Architectural Coherence Sprint
