# Story 19.4: Open Graph & Social Meta

Status: ready-for-dev

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

## Tasks / Subtasks

- [ ] Task 1: Crear OG image placeholder (AC: #3)
  - [ ] Crear `public/images/og-image.png` — 1200x630px
  - [ ] Opciones: usar herramienta online (og-image.vercel.app), crear manualmente, o placeholder sólido
  - [ ] Verificar tamaño < 300KB
  - [ ] El diseño debe incluir: nombre del desarrollador, título "Portfolio", colores del tema (#1b1b1b + #B63E96)
- [ ] Task 2: Agregar `openGraph` y `twitter` al root metadata en `layout.jsx` (AC: #1, #2, #7)
  - [ ] Agregar al export `metadata`:
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
  - [ ] `metadataBase` ya está configurado con `SITE_URL` → URLs relativas se resolverán a absolutas automáticamente
- [ ] Task 3: Verificar herencia en subrutas (AC: #5, #6)
  - [ ] `npm run build` y verificar HTML output
  - [ ] Las páginas de detalle (`articles/[slug]`, `projects/[slug]`) ya tienen `openGraph` y `twitter` → override del layout (correcto)
  - [ ] Las páginas sin override propio (`/about`, `/projects`, `/articles`) heredan del layout
- [ ] Task 4: Verificar meta tags en HTML (AC: #4)
  - [ ] `npm run dev` → visitar cada ruta → View Source → buscar `<meta property="og:`
  - [ ] Confirmar: `og:title`, `og:description`, `og:image`, `og:url`, `og:type` presentes
  - [ ] Confirmar: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` presentes

## Dev Notes

### Estado Actual de OG Metadata

| Página | openGraph | twitter | Acción |
|--------|-----------|---------|--------|
| Root layout (`layout.jsx`) | ❌ No | ❌ No | AGREGAR |
| `/about/page.jsx` | ❌ No | ❌ No | Hereda del layout |
| `/projects/page.tsx` | ❌ No | ❌ No | Hereda del layout |
| `/articles/page.tsx` | ❌ No | ❌ No | Hereda del layout |
| `/articles/[slug]/page.tsx` | ✅ Sí | ✅ Sí | Ya implementado |
| `/projects/[slug]/page.tsx` | ✅ Sí | ✅ Sí | Ya implementado |

### Next.js Metadata Inheritance

Next.js App Router fusiona metadata de padre a hijo:
- Root layout metadata → se aplica a todas las rutas como fallback
- Page-level metadata → override del layout para esa ruta
- Las páginas de detalle ya hacen override con datos dinámicos del artículo/proyecto

**Implicación:** Solo necesitamos agregar OG al root layout. Las subrutas sin metadata propia lo heredan automáticamente.

### metadataBase ya configurado

```javascript
metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
```

Esto significa que URLs relativas en `images` (como `/images/og-image.png`) se resolverán automáticamente a absolutas con el dominio de producción.

### OG Image Requirements

- **Dimensiones:** 1200x630px (ratio 1.91:1) — standard para LinkedIn y Twitter
- **Formato:** PNG preferido (mejor calidad para texto), JPEG aceptable
- **Tamaño:** < 300KB para carga rápida en previews
- **Contenido mínimo:** Nombre, título, un toque visual del brand

### Notas Importantes

- NO modificar las metadata de `articles/[slug]` ni `projects/[slug]` — ya están completas
- NO agregar `robots` metadata aquí — eso es parte de Story 19.5
- El campo `author` ya existe en layout pero como string, no como objeto Next.js Metadata

### Project Structure Notes

- `src/app/layout.jsx` — modificar metadata export (ya existe, solo agregar propiedades)
- `public/images/og-image.png` — crear nuevo archivo
- No se necesitan cambios en otros archivos

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.4]
- [Source: src/app/layout.jsx — metadata actual]
- [Source: src/app/articles/[slug]/page.tsx — OG ya implementado para referencia]
- [Docs: Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Docs: Open Graph Protocol](https://ogp.me/)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `src/app/layout.jsx` | MODIFICAR — agregar openGraph y twitter a metadata | pendiente |
| `public/images/og-image.png` | CREAR — OG social preview image 1200x630 | pendiente |
