# Story 18.3: Agregar loading.tsx para /articles/[slug]

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como **visitante**,
quiero **feedback visual inmediato al navegar a un artículo**,
para **saber que la página está cargando y no ver una pantalla en blanco**.

## Acceptance Criteria

1. **Given** el visitante está en `/articles` **When** hace clic en un artículo **Then** se muestra inmediatamente un skeleton/loading state.
2. **Given** el skeleton se muestra **When** el artículo termina de cargar **Then** el skeleton se reemplaza suavemente por el contenido real.
3. **Given** el skeleton se renderiza **When** se inspecciona visualmente en mobile (375px) y desktop (1024px) **Then** la estructura visual del skeleton coincide con la del artículo real (meta arriba, título, imagen, contenido).
4. **Given** `npm run build` se ejecuta **When** el build termina **Then** no hay errores y la ruta `/articles/[slug]` sigue siendo dynamic (`ƒ`).
5. **Given** `npm test` se ejecuta **When** los tests corren **Then** no hay regresiones (tests pasan).

## Tasks / Subtasks

- [x] **Task 1:** Crear `ArticleContentSkeleton` component (AC: #3)
  - [x] Crear `src/ui/organisms/ArticleContent/skeleton.tsx` siguiendo el patrón exacto de `ProjectDetail/skeleton.tsx`.
  - [x] Estructura del skeleton: header (título, meta con date + reading time, share buttons), featured image, body (3 bloques de párrafo), footer (back link).
  - [x] Usar clases BEM existentes de ArticleContent (`article-content`, `article-content__header`, `article-content__meta`, etc.) para que herede el layout CSS.
  - [x] Placeholders con Tailwind: `bg-dark/10 dark:bg-light/10 rounded animate-pulse`.
- [x] **Task 2:** Crear `loading.tsx` page (AC: #1, #2)
  - [x] Crear `src/app/articles/[slug]/loading.tsx` que importe y renderice `ArticleContentSkeleton`.
  - [x] Seguir patrón exacto de `src/app/projects/[slug]/loading.tsx` (1 import + 1 default export).
- [x] **Task 3:** Verificación build, tests y visual (AC: #3, #4, #5)
  - [x] `npm run build`: exitoso, `/articles/[slug]` sigue como `ƒ` (dynamic).
  - [x] `npm test`: 963/963 tests pasan.
  - [ ] Visual check: dev server en 375px y 1024px — skeleton refleja estructura real del artículo.

## Dev Notes

- **Objetivo:** Mejorar perceived performance al navegar a un artículo individual. Actualmente `/articles/[slug]` no tiene `loading.tsx`, mostrando blank/stall durante el server render. `/projects/[slug]` ya tiene este pattern implementado.
- **Ahorro en bundle:** 0 KiB — esta story no reduce bundle. Es mejora de UX (perceived performance).
- **Riesgo:** BAJO — archivos nuevos, 0 archivos existentes modificados. `loading.tsx` es aditivo en Next.js App Router.

### Archivos clave

| Archivo | Uso |
|---------|-----|
| `src/app/projects/[slug]/loading.tsx` | **Patrón a seguir** — importa skeleton y lo renderiza. |
| `src/ui/organisms/ProjectDetail/skeleton.tsx` | **Patrón a seguir** — skeleton con Tailwind pulse + BEM classes del componente real. |
| `src/ui/organisms/ArticleContent/index.tsx` | Componente real — estructura a replicar en el skeleton. |
| `src/ui/organisms/ArticleContent/styles.css` | CSS con clases BEM — el skeleton las hereda para el layout. |
| `src/app/articles/[slug]/page.tsx` | Página actual — usa `ArticleContent` como único child. |

### Estructura de ArticleContent (a replicar en skeleton)

```
<article class="article-content">
  <header class="article-content__header">
    <h1 class="article-content__title">...</h1>
    <div class="article-content__meta">
      <time class="article-content__date">...</time>
      <span class="article-content__reading-time">...</span>
    </div>
    <div class="article-content__share">...</div>
  </header>
  <figure class="article-content__featured-image">
    <img ... />
  </figure>
  <div class="article-content__body">
    <p>...</p> <p>...</p> <p>...</p>
  </div>
  <footer class="article-content__footer">
    <a class="article-content__back-link">← Back to Articles</a>
  </footer>
</article>
```

### Patrón de skeleton (de ProjectDetail/skeleton.tsx)

```tsx
// Placeholders con Tailwind + theme colors
<div className="h-10 w-3/4 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />

// Múltiples bloques con space-y para spacing
<div className="space-y-2">
  <div className="h-4 w-full ... animate-pulse" />
  <div className="h-4 w-3/4 ... animate-pulse" />
</div>
```

### Project Structure Notes

- Skeleton en `src/ui/organisms/ArticleContent/skeleton.tsx` — junto al componente real, convención ya establecida en `ProjectDetail/skeleton.tsx`.
- `loading.tsx` en `src/app/articles/[slug]/loading.tsx` — convención Next.js App Router.
- No crear barrel exports adicionales; el import es directo desde el skeleton file.

### References

- [Source: _bmad-output/planning-artifacts/epic-18-bundle-performance.md] — Story 18.3, AC, subtasks.
- [Source: CLAUDE.md] — Comandos, estructura src/, alias, convenciones BEM y theme.
- [Source: src/ui/organisms/ProjectDetail/skeleton.tsx] — Patrón exacto de skeleton a seguir.
- [Source: src/app/projects/[slug]/loading.tsx] — Patrón exacto de loading page a seguir.
- [Source: 18-2-dynamic-import-chat-overlay] — Learnings: code review detectó dead code, exit animation regression, y doble lectura de estado. Para esta story no aplica (no hay estado compartido ni dynamic imports).

---

## Developer Context (guardrails)

- **Epic 18** es optimización de bundle/performance; no añadir features nuevas. El skeleton es mejora de perceived performance, no funcionalidad.
- **No inventar:** Seguir el patrón EXACTO de `ProjectDetail/skeleton.tsx` + `projects/[slug]/loading.tsx`. No crear componentes extra, no agregar animaciones al skeleton, no crear tests unitarios para el skeleton (el pattern existente no los tiene).
- **CSS:** Importar `./styles.css` en el skeleton para heredar las clases de layout del componente real (padding, max-width, margins). Esto asegura que el skeleton tenga la misma geometría que el artículo cargado.

### Technical requirements

- **Next.js 14 App Router:** `loading.tsx` es la convención estándar para loading UI. Se muestra automáticamente durante la carga del server component.
- **TypeScript:** Ambos archivos nuevos deben ser `.tsx`.
- **Responsive:** El skeleton debe verse bien en mobile (375px) y desktop (1024px). Las clases BEM de ArticleContent ya son responsive (ver `styles.css` media queries).

### Architecture compliance

- Respetar Atomic Design: skeleton en `organisms/ArticleContent/`, loading page en `app/articles/[slug]/`.
- Respetar convención BEM: usar las mismas clases del componente real para el layout wrapper.
- No agregar dependencias nuevas; solo Tailwind utilities + CSS existente.

### Testing requirements

- `npm test`: los 963+ tests deben pasar sin cambios (archivos nuevos, no se modifica nada existente).
- `npm run build`: build exitoso, `/articles/[slug]` sigue como `ƒ` (dynamic).
- Visual check manual en 2 viewports (375px, 1024px) con dev server.
- No se requieren tests unitarios para el skeleton (patrón establecido: `ProjectDetail/skeleton.tsx` no tiene tests).

### Story completion status

- **Status:** review
- **Completion note:** Implementación completada. Skeleton replica estructura del ArticleContent real (header, meta, share, image, body, footer) con Tailwind pulse placeholders. loading.tsx sigue patrón exacto de projects/[slug]/loading.tsx. Build exitoso, 963/963 tests pasan. Pendiente: visual check manual.

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation.

### Completion Notes List

1. Created `ArticleContent/skeleton.tsx` following exact pattern from `ProjectDetail/skeleton.tsx`.
2. Skeleton structure matches ArticleContent: header (title placeholder, meta with date + reading time, share buttons), featured image, body (3 paragraph blocks with varying widths), footer (back link).
3. BEM classes from `styles.css` inherited via `import "./styles.css"` — ensures skeleton has same layout geometry (max-width, padding, margins, centered header).
4. Created `articles/[slug]/loading.tsx` — 1 import + 1 default export, identical pattern to `projects/[slug]/loading.tsx`.
5. Build: exitoso, `/articles/[slug]` sigue como `ƒ` (dynamic). Page size: 2.71 kB / 112 kB.
6. Tests: 963/963 pass — zero files modified, only new files added.

### File List

**Created:**
- `src/ui/organisms/ArticleContent/skeleton.tsx`
- `src/app/articles/[slug]/loading.tsx`

**Modified:**
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (18-3 → in-progress)
- `_bmad-output/implementation-artifacts/18-3-articles-slug-loading-skeleton.md` (status → review, tasks checked)
