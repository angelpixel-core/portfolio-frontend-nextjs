# Story 19.5: Production Metadata Hardening

Status: ready-for-dev

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

- [ ] Task 1: Corregir fallback inconsistente en `next-sitemap.config.js` (AC: #1, #2)
  - [ ] Cambiar `"https://localhost:3000"` → `"http://localhost:3000"` en línea 3
  - [ ] Verificar: los 3 archivos con SITE_URL ahora usan el mismo fallback
- [ ] Task 2: Limpiar keywords placeholder en root layout (AC: #3)
  - [ ] `src/app/layout.jsx:27-28` — reemplazar keywords que contienen `OTHER_KEYWORDS`
  - [ ] Keywords sugeridos: `"Web Developer, Full Stack Developer, React, Next.js, TypeScript, Portfolio, Software Engineer, Frontend Developer"`
  - [ ] NO agregar keywords genéricos irrelevantes — Google ignora keyword stuffing
- [ ] Task 3: Completar metadata de About page (AC: #4)
  - [ ] `src/app/about/layout.jsx` — agregar `description` y `alternates.canonical`:
    ```javascript
    export const metadata = {
      title: "About",
      description: "Learn about my background, skills, and experience as a web developer.",
      alternates: {
        canonical: "/about",
      },
    };
    ```
  - [ ] Mantener `title: "About"` (hereda template `%s | Portfolio` del root)
- [ ] Task 4: Verificar build con y sin SITE_URL (AC: #5, #6)
  - [ ] `SITE_URL=https://example.com npm run build`
  - [ ] Verificar `public/sitemap-0.xml` contiene `https://example.com` como base URL
  - [ ] Verificar `public/robots.txt` contiene `Sitemap: https://example.com/sitemap.xml`
  - [ ] `npm run build` (sin SITE_URL) → warning pero exitoso
- [ ] Task 5: Verificar tests (AC: #7)
  - [ ] `npm test` → todos pasan sin regresiones

## Dev Notes

### Auditoría Completa de SITE_URL

| Archivo | Línea | Fallback Actual | Correcto? |
|---------|-------|-----------------|-----------|
| `src/app/layout.jsx` | 21 | `http://localhost:3000` | ✅ |
| `src/app/articles/[slug]/page.tsx` | 58 | `http://localhost:3000` | ✅ |
| `next-sitemap.config.js` | 3 | `https://localhost:3000` | ⚠️ → corregir a `http://` |
| `next.config.js` | 15 | Warning check only | ✅ |
| `src/lib/seo/article-jsonld.ts` | 30 | Recibe como param | ✅ (no tiene fallback propio) |

### Auditoría de Metadata por Página

| Ruta | Archivo | title | description | canonical |
|------|---------|-------|-------------|-----------|
| `/` | `layout.jsx` | ✅ template | ✅ | ✅ `/` |
| `/about` | `about/layout.jsx` | ✅ "About" | ❌ **FALTA** | ❌ **FALTA** |
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

### Debug Log References

### Completion Notes List

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `next-sitemap.config.js` | MODIFICAR — fallback `https` → `http` (línea 3) | pendiente |
| `src/app/layout.jsx` | MODIFICAR — reemplazar keywords placeholder (líneas 27-28) | pendiente |
| `src/app/about/layout.jsx` | MODIFICAR — agregar description + canonical (líneas 6-8) | pendiente |
