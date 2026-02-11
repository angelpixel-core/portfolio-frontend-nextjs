# Story 19.5: Production Metadata Hardening

Status: done

## Story

As a **search engine crawler or social platform**,
I want **all metadata, canonical URLs, and SEO fields to reference the production domain with complete, accurate information**,
so that **the site is correctly indexed in search results and displays professional previews when shared**.

## Acceptance Criteria

1. Fallback de `SITE_URL` es consistente en todos los archivos (`http://localhost:3000`)
2. `next-sitemap.config.js` corregido: `https://localhost:3000` → `http://localhost:3000`
3. Root layout `keywords` no contiene placeholder `OTHER_KEYWORDS` — reemplazado con keywords reales
4. About page (`src/app/about/layout.jsx`) tiene `description` y `canonical`
5. Build con `SITE_URL=https://production.com npm run build` produce sitemap.xml y robots.txt con URLs de producción
6. `npm run build` sin `SITE_URL` sigue funcionando (warning, no error)
7. Tests existentes no se rompen

## Tasks / Subtasks

- [x] Task 1: Corregir fallback inconsistente en `next-sitemap.config.js` (AC: #1, #2)
  - [x] Cambiar `"https://localhost:3000"` → `"http://localhost:3000"` en línea 3
  - [x] Verificar: los 3 archivos con SITE_URL ahora usan el mismo fallback
- [x] Task 2: Limpiar keywords placeholder en root layout (AC: #3)
  - [x] `src/app/layout.jsx:27-28` — reemplazar keywords que contienen `OTHER_KEYWORDS`
  - [x] Keywords sugeridos: `"Web Developer, Full Stack Developer, React, Next.js, TypeScript, Portfolio, Software Engineer, Frontend Developer"`
  - [x] NO agregar keywords genéricos irrelevantes — Google ignora keyword stuffing
- [x] Task 3: Completar metadata de About page (AC: #4)
  - [x] `src/app/about/layout.jsx` — agregar `description` y `alternates.canonical`:
    ```javascript
    export const metadata = {
      title: "About",
      description: "Learn about my background, skills, and experience as a web developer.",
      alternates: {
        canonical: "/about",
      },
    };
    ```
  - [x] Mantener `title: "About"` (hereda template `%s | Portfolio` del root)
- [x] Task 4: Verificar build con y sin SITE_URL (AC: #5, #6)
  - [x] `SITE_URL=https://example.com npm run build`
  - [x] Verificar `public/sitemap-0.xml` contiene `https://example.com` como base URL
  - [x] Verificar `public/robots.txt` contiene `Sitemap: https://example.com/sitemap.xml`
  - [x] `npm run build` (sin SITE_URL) → warning pero exitoso
- [x] Task 5: Verificar tests (AC: #7)
  - [x] `npm test` → todos pasan sin regresiones

## Dev Notes

### Auditoría Completa de SITE_URL

| Archivo | Línea | Fallback Actual | Correcto? |
|---------|-------|-----------------|-----------|
| `src/app/layout.jsx` | 21 | `http://localhost:3000` | ✅ |
| `src/app/articles/[slug]/page.tsx` | 58 | `http://localhost:3000` | ✅ |
| `next-sitemap.config.js` | 3 | `http://localhost:3000` | ✅ (corregido) |
| `next.config.js` | 15 | Warning check only | ✅ |
| `src/lib/seo/article-jsonld.ts` | 30 | Recibe como param | ✅ (no tiene fallback propio) |

### Auditoría de Metadata por Página

| Ruta | Archivo | title | description | canonical |
|------|---------|-------|-------------|-----------|
| `/` | `layout.jsx` | ✅ template | ✅ | ✅ `/` |
| `/about` | `about/layout.jsx` | ✅ "About" | ✅ (agregado) | ✅ `/about` (agregado) |
| `/projects` | `projects/layout.jsx` | ✅ | ✅ | ✅ `/projects` |
| `/articles` | `articles/layout.tsx` | ✅ | ✅ | ✅ `/articles` |
| `/projects/[slug]` | dynamic `generateMetadata` | ✅ | ✅ | ✅ dynamic |
| `/articles/[slug]` | dynamic `generateMetadata` | ✅ | ✅ | ✅ dynamic |

### Keywords Actual vs Propuesta

**Actual (`layout.jsx:27-28`):**
```
"Web Developer, Software Developer, Programming, Projects, OTHER_KEYWORDS"
```

**Propuesta:**
```
"Web Developer, Full Stack Developer, React, Next.js, TypeScript, Portfolio, Software Engineer, Frontend Developer"
```

### Patrón metadataBase en Next.js

`metadataBase` en root layout se hereda a TODAS las rutas:
```javascript
metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
```
Todas las URLs relativas en `alternates.canonical`, `openGraph.images`, etc. se resuelven automáticamente contra esta base. **NO necesitamos repetir SITE_URL en cada página** — solo el root layout.

### Scope Boundaries — Qué NO Modificar

| Archivo | Razón para no tocar |
|---------|---------------------|
| `src/app/articles/[slug]/page.tsx` | Ya correcto — tiene OG, Twitter, JSON-LD, canonical |
| `src/app/projects/[slug]/page.tsx` | Ya correcto — tiene OG, Twitter, canonical |
| `next.config.js` | Ya tiene validation warning |
| `.env.production.template` | Ya tiene SITE_URL documentado |
| `src/lib/seo/article-jsonld.ts` | Ya correcto — recibe siteUrl como param |

### Out of Scope (pertenece a otras stories)

- Agregar `openGraph` y `twitter` al root layout → **Story 19.4**
- Usar `NEXT_PUBLIC_AUTHOR_NAME` env var en vez de hardcoded → backlog
- Agregar keywords a layouts de sub-rutas → mejora incremental, no blocker

### Dependencia con Story 19.4

Si Story 19.4 (Open Graph) se implementa ANTES que esta, las páginas sin OG propio heredarán del root layout automáticamente. Si se implementa DESPUÉS, esta story NO debe agregar OG — dejar ese scope a 19.4.

### Previous Story Intelligence (19.4)

Story 19.4 va a modificar `src/app/layout.jsx` para agregar `openGraph` y `twitter` al metadata. Si ambas stories tocan el mismo archivo, coordinar para evitar conflictos de merge. Recomendación: implementar 19.5 primero (es más pequeña y segura).

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.5]
- [Source: _bmad-output/analysis/deploy-safety-report-2026-02-11.md]
- [Source: src/app/layout.jsx:20-33 — metadata actual con keyword placeholder]
- [Source: src/app/about/layout.jsx:6-8 — metadata incompleta]
- [Source: next-sitemap.config.js:3 — fallback inconsistente https]
- [Docs: Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Docs: Next.js metadataBase](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Prettier format fix required on `src/app/error.tsx` (line 17: role="alert" + className on same line)
- Build verified with `SITE_URL=https://example.com` — sitemap-0.xml and robots.txt correctly use production URLs
- Build verified without `SITE_URL` — falls back to `http://localhost:3000` successfully

### Completion Notes List

- Task 1: Fixed `next-sitemap.config.js` line 3 fallback from `https://localhost:3000` to `http://localhost:3000`. All 3 SITE_URL fallbacks now consistent.
- Task 2: Replaced `OTHER_KEYWORDS` placeholder in `src/app/layout.jsx` with relevant technology keywords.
- Task 3: Added `description` and `alternates.canonical` to `src/app/about/layout.jsx`. All pages now have complete metadata.
- Task 4: Build verified with and without SITE_URL. Sitemap and robots.txt correctly reference production domain when set. `robots.txt` confirmed: `Sitemap: https://example.com/sitemap.xml`.
- Task 5: All 983 tests pass with 0 regressions.
- Review fix M1: Changed `keywords` from comma-delimited string to `string[]` array (Next.js canonical format).
- Review fix M2: Changed `author` (ignored by Next.js) to `authors: [{ name: "AngelThunder" }]` (correct Metadata API field).

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `next-sitemap.config.js` | MODIFICAR — fallback `https` → `http` (línea 3) | completado |
| `src/app/layout.jsx` | MODIFICAR — keywords placeholder, keywords→array, author→authors | completado |
| `src/app/about/layout.jsx` | MODIFICAR — agregar description + canonical (líneas 6-8) | completado |

## Change Log

- 2026-02-11: Story implemented — 3 metadata files corrected, all ACs verified, 983 tests pass
- 2026-02-11: Code review fixes — keywords→array (M1), author→authors (M2), removed error.tsx from scope (L1), fixed doc typo (L2), documented robots.txt verification (L3)
