# Z-Index Scale

**Date:** 2026-02-26
**Scope:** Arquitectura CSS — capas, overlays y accesibilidad

## Contexto

El proyecto usa una mezcla de `z-index` en CSS y utilidades Tailwind (`z-*`). Sin una escala oficial, los valores pueden competir entre sí y generar conflictos invisibles. Esta escala consolida valores existentes y define reglas de uso.

## Escala oficial (7 capas)

| Capa           | Rango / Valor | Uso                                                                            | Tailwind                 |
| -------------- | ------------- | ------------------------------------------------------------------------------ | ------------------------ |
| **Background** | -10 a -1      | Sombras, pseudo-elementos y depth layers (BoxShadow, FeaturedBoxShadow, skill) | `-z-10`                  |
| **Document**   | 0             | Flujo base del layout (MainContainer, Footer, History)                         | `z-0`                    |
| **Elevation**  | 1             | Elevacion minima para iconos/animaciones puntuales                             | `z-[1]` (o `z-index: 1`) |
| **Components** | 10            | Navbar base, imagenes flotantes, carruseles y thumbnails de contenido          | `z-10`                   |
| **Overlays**   | 20            | Backdrops y capas intermedias (chat + floating backdrop)                       | `z-20`                   |
| **Panels**     | 30            | Contenido overlay no modal (Floating panel, MenuButton, HireMe desktop)        | `z-30`                   |
| **Modals**     | 40–50         | Auth, dropdowns, cortinas de transicion y elevaciones bloqueantes              | `z-40`, `z-50`           |
| **A11y**       | 100–9999      | Skip links y capa de accesibilidad extrema                                     | `z-[100]`, `z-[9999]`    |

**Nota:** `TransitionEffect` utiliza `z-50 / z-40 / z-30` para las capas de cortinas (Story 13.6).

## Inventario auditado (scope Story 25.6)

Exclusion explicita: `src/ui/organisms/WordCloud/**` queda fuera de alcance por decision de Epic 25.

| Valor                      | Capa       | Evidencia (archivo)                                                                                                                                                                                                                                                      |
| -------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `-z-10`                    | Background | `src/ui/atoms/shadows/BoxShadow/styles.css`, `src/ui/atoms/shadows/FeaturedBoxShadow/styles.css`, `src/app/articles/ArticleListSkeleton.tsx`                                                                                                                             |
| `z-index: -1`              | Background | `src/ui/molecules/skill/styles.css`                                                                                                                                                                                                                                      |
| `z-0` / `z-index: 0`       | Document   | `src/ui/organisms/Footer/styles.css`, `src/ui/atoms/hocs/MainContainer/styles.css`, `src/ui/atoms/hocs/History/styles.css`, `src/ui/organisms/Auth/styles.css`                                                                                                           |
| `z-index: 1` / `zIndex: 1` | Elevation  | `src/app/styles.css`, `src/ui/atoms/icons/LiIcon/styles.css`, `src/ui/organisms/Skills/index.tsx`                                                                                                                                                                        |
| `z-10`                     | Components | `src/ui/organisms/NavBar/styles.css`, `src/ui/molecules/MovingImage/styles.css`, `src/ui/molecules/FeaturedArticlesCarousel/styles.css`, `src/ui/molecules/skill/index.tsx`, `src/ui/organisms/Auth/styles.css`                                                          |
| `z-20`                     | Overlays   | `src/ui/organisms/Chat/styles.css`, `src/ui/overlays/Floating/styles.css`, `src/ui/overlays/FloatingMobile/styles.css`                                                                                                                                                   |
| `z-30`                     | Panels     | `src/ui/overlays/Floating/styles.css`, `src/ui/overlays/FloatingMobile/styles.css`, `src/ui/molecules/HireMe/styles.css`, `src/ui/atoms/buttons/MenuButton/styles.css`, `src/ui/molecules/TransitionEffect/index.tsx`                                                    |
| `z-40`                     | Modals     | `src/ui/molecules/TransitionEffect/index.tsx`                                                                                                                                                                                                                            |
| `z-50` / `z-index: 50`     | Modals     | `src/ui/organisms/Auth/styles.css`, `src/ui/atoms/buttons/AuthButton/styles.css`, `src/ui/atoms/ArticleHoverThumbnail/styles.css`, `src/ui/organisms/NavBar/styles.css`, `src/ui/molecules/TransitionEffect/index.tsx`, `src/ui/molecules/SocialAuthDropdown/styles.css` |
| `z-index: 100`             | A11y       | `src/app/coming-soon/styles.css`                                                                                                                                                                                                                                         |
| `z-index: 9999`            | A11y       | `src/styles/globals.css`                                                                                                                                                                                                                                                 |

## Reglas de uso

1. **No inventar valores nuevos** sin actualizar este documento.
2. **`z-9999` está reservado exclusivamente para skip-link.**
3. **`z-100` es la capa general de accesibilidad.**
4. **Panels vs Modals:** Si un overlay debe bloquear interacción, usar Modals (40–50). Si es informativo/no modal, usar Panels (30).

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
