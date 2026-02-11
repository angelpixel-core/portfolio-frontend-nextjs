# Story 19.4: Open Graph & Social Meta

Status: review

## Story

As a **visitor sharing the portfolio on social media**,
I want **rich preview cards with image, title, and description on shared links**,
so that **shared links look professional on LinkedIn, Twitter, and messaging apps**.

## Acceptance Criteria

1. Root `layout.jsx` metadata export incluye `openGraph` con `title`, `description`, `images`, `type`, `url`
2. Root `layout.jsx` metadata export incluye `twitter` con `card: "summary_large_image"`, `title`, `description`, `images`
3. OG image file exists at `public/images/og-image.png` (1200x630, < 300KB)
4. `<meta property="og:image">` tag present en HTML output de todas las páginas
5. Pages `/about`, `/projects`, `/articles` heredan OG defaults del layout o tienen overrides propios
6. Detail pages (`/articles/[slug]`, `/projects/[slug]`) ya tienen OG — no romper
7. OG image URL usa `SITE_URL` para URL absoluta en producción
8. Tests existentes no se rompen

## Tasks / Subtasks

- [x] Task 1: Crear OG image placeholder (AC: #3)
  - [x] Crear `public/images/og-image.png` — 1200x630px, < 300KB
  - [x] Opción recomendada: generar imagen sólida con colores del tema (#1b1b1b fondo + #B63E96 acento)
  - [x] Contenido: nombre del desarrollador ("Angel Thunder"), título "Portfolio", subtítulo "Web Developer"
  - [x] Verificar tamaño < 300KB
- [x] Task 2: Agregar `openGraph` y `twitter` al root metadata (AC: #1, #2, #7)
  - [x] Archivo: `src/app/layout.jsx` — agregar a `metadata` export:
    ```javascript
    openGraph: {
      title: "Portfolio | Angel Thunder",
      description: "Angel Thunder's Portfolio - Web Developer",
      url: "/",
      siteName: "Angel Thunder Portfolio",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: "Angel Thunder - Web Developer Portfolio",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Portfolio | Angel Thunder",
      description: "Angel Thunder's Portfolio - Web Developer",
      images: ["/images/og-image.png"],
    },
    ```
  - [x] `metadataBase` ya configurado con `SITE_URL` → URLs relativas se resuelven a absolutas automáticamente
  - [x] NO tocar ningún otro campo del metadata export (keywords, authors, alternates ya correctos post-19.5)
- [x] Task 3: Verificar herencia en subrutas (AC: #5, #6)
  - [x] `npm run build` exitoso
  - [x] Detail pages (`articles/[slug]`, `projects/[slug]`) ya tienen `openGraph`/`twitter` → override del layout (correcto)
  - [x] Pages sin override (`/about`, `/projects`, `/articles`) heredan del root layout
- [x] Task 4: Verificar meta tags en HTML output (AC: #4)
  - [x] `npm run build` → inspeccionar HTML generado
  - [x] Confirmar presencia de: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
  - [x] Confirmar presencia de: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- [x] Task 5: Verificar tests (AC: #8)
  - [x] `npm test` → todos pasan sin regresiones

## Dev Notes

### Estado Actual de Metadata en layout.jsx (Post-Story 19.5)

```javascript
export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    template: "%s | Portfolio",
    default: "Portfolio",
  },
  description: "Angel Thunder's Portfolio - Web Developer",
  keywords: [
    "Web Developer", "Full Stack Developer", "React", "Next.js",
    "TypeScript", "Portfolio", "Software Engineer", "Frontend Developer",
  ],
  authors: [{ name: "AngelThunder" }],
  alternates: {
    canonical: "/",
  },
  // ← openGraph y twitter van AQUÍ
};
```

### Estado Actual de OG Metadata por Página

| Página | openGraph | twitter | Acción |
|--------|-----------|---------|--------|
| Root layout (`layout.jsx`) | ✅ Sí (agregado) | ✅ Sí (agregado) | **COMPLETADO** |
| `/about` | ✅ Hereda | ✅ Hereda | Hereda del layout |
| `/projects` | ✅ Hereda | ✅ Hereda | Hereda del layout |
| `/articles` | ✅ Hereda | ✅ Hereda | Hereda del layout |
| `/articles/[slug]` | ✅ Override dinámico | ✅ Override dinámico | Ya implementado — NO TOCADO |
| `/projects/[slug]` | ✅ Override dinámico | ✅ Override dinámico | Ya implementado — NO TOCADO |

### Next.js Metadata Inheritance

Next.js App Router fusiona metadata de padre a hijo:
- Root layout metadata → se aplica a todas las rutas como fallback
- Page-level metadata → override del layout para esa ruta
- Las detail pages ya hacen override con datos dinámicos del artículo/proyecto

**Implicación:** Solo necesitamos agregar OG al root layout. Las subrutas sin metadata propia lo heredan automáticamente.

### metadataBase ya configurado

```javascript
metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
```

URLs relativas en `images` (como `/images/og-image.png`) se resuelven a absolutas con el dominio de producción. **NO repetir SITE_URL en openGraph.images.**

### OG Image Requirements

- **Dimensiones:** 1200x630px (ratio 1.91:1) — standard para LinkedIn y Twitter
- **Formato:** PNG preferido (mejor calidad para texto), JPEG aceptable
- **Tamaño:** < 300KB para carga rápida en previews
- **Contenido mínimo:** Nombre, título, un toque visual del brand
- **Ubicación:** `public/images/og-image.png`
- **Estado actual:** ✅ Creada — 34KB

### Imágenes Existentes en public/images/

Disponibles como referencia (NO usar como OG directamente — dimensiones incorrectas):
- `/images/profile/hero.png` — Hero section
- `/images/profile/me.jpg` — Foto de perfil
- `/images/about/hero.png` — About hero
- SVG logos NO sirven para OG (crawlers requieren raster: PNG/JPEG)

### Scope Boundaries — Qué NO Modificar

| Archivo | Razón |
|---------|-------|
| `src/app/articles/[slug]/page.tsx` | Ya tiene OG+Twitter completo con datos dinámicos |
| `src/app/projects/[slug]/page.tsx` | Ya tiene OG+Twitter completo con datos dinámicos |
| `src/app/about/layout.jsx` | Hereda OG del root — no necesita override |
| `src/app/projects/layout.jsx` | Hereda OG del root — no necesita override |
| `src/app/articles/layout.tsx` | Hereda OG del root — no necesita override |
| `next-sitemap.config.js` | No relacionado con OG |

### Previous Story Intelligence (19.5)

Story 19.5 (Production Metadata Hardening) completada. Cambios relevantes:
- `keywords` cambiado de string a `string[]` array (M1 fix)
- `author` cambiado a `authors: [{ name: "AngelThunder" }]` (M2 fix)
- `metadataBase` fallback consistente en todos los archivos
- About page ahora tiene `description` y `canonical`

**Lecciones de 19.5:**
- Usar formato canónico de la Metadata API de Next.js (no strings arbitrarios)
- URLs relativas en metadata se resuelven via `metadataBase` — no hardcodear dominio

### Colores del Tema (para OG image)

```
dark: #1b1b1b     light: #f5f5f5
primary: #B63E96   primaryDark: #58E6D9
```

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.4]
- [Source: src/app/layout.jsx:20-41 — metadata actual post-19.5]
- [Source: src/app/articles/[slug]/page.tsx:15-46 — OG pattern de referencia]
- [Source: src/app/projects/[slug]/page.tsx:14-42 — OG pattern de referencia]
- [Source: _bmad-output/implementation-artifacts/19-5-production-metadata-hardening.md — learnings]
- [Docs: Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Docs: Open Graph Protocol](https://ogp.me/)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- OG image generated via ImageMagick: 1200x630px PNG, 34KB (#1b1b1b bg, #B63E96 border, text)
- Build verified with `SITE_URL=https://example.com` — all OG meta tags present with absolute URLs
- HTML inspection confirmed: og:title, og:description, og:image, og:url, og:type, og:site_name, og:locale
- Twitter card inspection confirmed: twitter:card, twitter:title, twitter:description, twitter:image
- Sub-route inheritance verified: /about, /projects, /articles all inherit og:image from root layout

### Completion Notes List

- Task 1: Created `public/images/og-image.png` — 1200x630px, 34KB, theme colors (#1b1b1b + #B63E96), text: "Angel Thunder / Portfolio / Web Developer"
- Task 2: Added `openGraph` and `twitter` objects to root layout metadata export. Used relative URLs resolved via metadataBase.
- Task 3: Verified inheritance — sub-routes without OG override correctly inherit from root layout. Detail pages with dynamic OG remain unaffected.
- Task 4: Verified all 14 OG/Twitter meta tags present in HTML output (og:title, og:description, og:url, og:site_name, og:locale, og:image, og:image:width, og:image:height, og:image:alt, og:type, twitter:card, twitter:title, twitter:description, twitter:image).
- Task 5: All 983 tests pass with 0 regressions.

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `src/app/layout.jsx` | MODIFICAR — agregar openGraph y twitter a metadata | completado |
| `public/images/og-image.png` | CREAR — OG social preview image 1200x630 34KB | completado |

## Change Log

- 2026-02-11: Story implemented — OG+Twitter metadata added to root layout, OG image created, all 8 ACs verified, 983 tests pass
