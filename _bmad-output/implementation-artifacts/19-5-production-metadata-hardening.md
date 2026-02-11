# Story 19.5: Production Metadata Hardening

Status: ready-for-dev

## Story

As a **search engine crawler or social platform**,
I want **all metadata, canonical URLs, and SEO fields to reference the production domain**,
so that **the site is correctly indexed and linked in search results and social shares**.

## Acceptance Criteria

1. `src/app/layout.jsx` — `metadataBase` usa `SITE_URL` con fallback sensato ✅ (ya implementado)
2. `src/app/articles/[slug]/page.tsx` — JSON-LD usa `SITE_URL` para URLs absolutas ✅ (ya implementado)
3. `next-sitemap.config.js` — `siteUrl` usa `SITE_URL` ✅ (ya implementado)
4. Fallback inconsistencia corregida: todos usan el mismo fallback (`http://localhost:3000`)
5. Build con `SITE_URL=https://production.com` produce sitemap.xml con URLs de producción
6. Build con `SITE_URL=https://production.com` produce robots.txt referenciando dominio de producción
7. `SITE_URL` documentada como variable requerida en Vercel env vars
8. Metadata `author` y `keywords` en layout usan valores personalizables o razonables

## Tasks / Subtasks

- [ ] Task 1: Auditar consistencia de fallbacks SITE_URL (AC: #4)
  - [ ] `layout.jsx:21` — fallback: `http://localhost:3000` ✅
  - [ ] `articles/[slug]/page.tsx:58` — fallback: `http://localhost:3000` ✅
  - [ ] `next-sitemap.config.js:3` — fallback: `https://localhost:3000` ⚠️ (usa https, inconsistente)
  - [ ] Corregir `next-sitemap.config.js` → `http://localhost:3000` para consistencia
- [ ] Task 2: Verificar sitemap.xml con SITE_URL (AC: #5)
  - [ ] `SITE_URL=https://angelthunder.dev npm run build`
  - [ ] Verificar `public/sitemap-0.xml` contiene `https://angelthunder.dev/` como base
  - [ ] Verificar que todas las URLs en sitemap usan el dominio correcto
- [ ] Task 3: Verificar robots.txt con SITE_URL (AC: #6)
  - [ ] Verificar `public/robots.txt` contiene `Sitemap: https://angelthunder.dev/sitemap.xml`
  - [ ] Verificar que `Host:` (si presente) usa dominio correcto
- [ ] Task 4: Revisar metadata en layout.jsx (AC: #8)
  - [ ] `author: "AngelThunder"` → considerar usar `NEXT_PUBLIC_AUTHOR_NAME` env var
  - [ ] `description` → verificar que es descriptiva y no genérica
  - [ ] `keywords` → actualizar lista (remover `OTHER_KEYWORDS` placeholder)
  - [ ] Verificar que `title.template` y `title.default` son adecuados para producción
- [ ] Task 5: Documentar SITE_URL como requerida (AC: #7)
  - [ ] Verificar que `.env.production.template` incluye `SITE_URL` ✅ (ya incluida)
  - [ ] Verificar que `next.config.js` emite warning cuando falta ✅ (ya implementado)
  - [ ] Agregar nota en `_bmad-output/analysis/deploy-safety-report` si no existe

## Dev Notes

### Auditoría de SITE_URL en el Codebase

| Archivo | Variable | Fallback | Estado |
|---------|----------|----------|--------|
| `src/app/layout.jsx:21` | `process.env.SITE_URL` | `http://localhost:3000` | ✅ Correcto |
| `src/app/articles/[slug]/page.tsx:58` | `process.env.SITE_URL` | `http://localhost:3000` | ✅ Correcto |
| `next-sitemap.config.js:3` | `process.env.SITE_URL` | `https://localhost:3000` | ⚠️ Inconsistente (https vs http) |
| `next.config.js:15` | Validation check | Warning si falta | ✅ Correcto |
| `src/lib/seo/article-jsonld.ts:30` | Recibe como parámetro | N/A | ✅ Correcto |

### Inconsistencia: `https://localhost:3000`

`next-sitemap.config.js` usa `https://localhost:3000` como fallback, mientras todos los demás usan `http://localhost:3000`. Esto es inconsistente y técnicamente incorrecto (localhost no tiene SSL por defecto). Corregir a `http://localhost:3000`.

### Metadata Actual en layout.jsx (líneas 20-33)

```javascript
export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    template: "%s | Portfolio",
    default: "Portfolio",
  },
  description: "Angel Thunder's Portfolio - Web Developer",
  keywords: "Web Developer, Software Developer, Programming, Projects, OTHER_KEYWORDS",
  author: "AngelThunder",
  alternates: {
    canonical: "/",
  },
};
```

**Problemas detectados:**
1. `keywords` contiene placeholder `OTHER_KEYWORDS` — debe actualizarse con keywords reales
2. `author` es string hardcoded — considerar env var `NEXT_PUBLIC_AUTHOR_NAME`
3. `title.default` es genérico "Portfolio" — suficiente pero podría incluir nombre

### Riesgo Bajo

Esta story es mayormente verificación y ajustes menores. La infraestructura de SITE_URL ya está en su lugar gracias a Phase 1 del hardening anterior.

### Project Structure Notes

- Archivos a modificar: `next-sitemap.config.js` (fallback fix), `src/app/layout.jsx` (keywords cleanup)
- No se crean archivos nuevos
- Verificación principal es via `npm run build` + inspección de output

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.5]
- [Source: _bmad-output/analysis/deploy-safety-report-2026-02-11.md]
- [Source: src/app/layout.jsx — metadata actual]
- [Source: next-sitemap.config.js — siteUrl config]
- [Source: .env.production.template — SITE_URL documented]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `next-sitemap.config.js` | MODIFICAR — corregir fallback a http://localhost:3000 | pendiente |
| `src/app/layout.jsx` | MODIFICAR — limpiar keywords, revisar author | pendiente |
