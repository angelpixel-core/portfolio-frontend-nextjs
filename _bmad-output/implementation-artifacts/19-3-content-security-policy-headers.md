# Story 19.3: Content Security Policy Headers

Status: ready-for-dev

## Story

As a **security-conscious developer**,
I want **Content Security Policy headers that restrict resource loading origins**,
so that **the application is protected against XSS attacks and unauthorized resource injection**.

## Acceptance Criteria

1. CSP header applied to all routes `/(.*)`
2. `default-src 'self'` restricts all unspecified resource types to same origin
3. `script-src` allows Next.js runtime (`'self' 'unsafe-inline'`), plus `'unsafe-eval'` only in development
4. `style-src` allows Tailwind and inline styles (`'self' 'unsafe-inline'`)
5. `font-src` allows Next.js optimized Google Fonts (`'self'`)
6. `img-src` allows local images and data URIs (`'self' data:`)
7. `connect-src` allows self for mock mode, plus backend API host when configured
8. No console CSP violation errors on any route (/, /about, /projects, /articles, /articles/[slug])
9. Social share links (twitter.com, linkedin.com) work without CSP blocking (they are navigation, not resource loads)
10. Existing security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) preserved
11. `Referrer-Policy` header set to `strict-origin-when-cross-origin`
12. `Permissions-Policy` header disables unused APIs (camera, microphone, geolocation)

## Tasks / Subtasks

- [ ] Task 1: Agregar `headers()` function a `next.config.js` con CSP + security headers (AC: #1-#7, #10-#12)
  - [ ] Definir `cspHeader` con directivas completas como template string multi-line
  - [ ] Usar `process.env.NODE_ENV === 'development'` para `unsafe-eval` condicional
  - [ ] Agregar `Content-Security-Policy` con `.replace(/\n/g, '')` para aplanar
  - [ ] Agregar `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] Agregar `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - [ ] Mover headers existentes de `vercel.json` a `next.config.js` para centralizar
  - [ ] Eliminar sección `headers` de `vercel.json` (evita duplicación)
- [ ] Task 2: Verificar en todas las rutas (AC: #8, #9)
  - [ ] Iniciar dev server: `npm run dev`
  - [ ] Verificar headers con: `curl -I http://localhost:9000/`
  - [ ] Confirmar presencia de: `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`
  - [ ] Visitar cada ruta en browser: `/`, `/about`, `/projects`, `/articles`
  - [ ] Abrir DevTools > Console → verificar 0 CSP violations
  - [ ] Verificar que social share buttons abren sin error (navegación, no fetch)
  - [ ] Verificar que theme toggle funciona (CSS changes no bloqueadas)
  - [ ] Verificar que framer-motion animations funcionan (inline styles permitidos)
- [ ] Task 3: Build production y verificación (AC: #3, #8)
  - [ ] `npm run build` — exitoso sin warnings nuevos
  - [ ] `npm start` → verificar que CSP NO incluye `unsafe-eval` en prod
  - [ ] `curl -I http://localhost:3000/` → confirmar header CSP sin `unsafe-eval`
- [ ] Task 4: Verificar tests (AC: #10)
  - [ ] `npm test` → todos pasan sin regresiones
  - [ ] `npm run lint` → sin warnings

## Dev Notes

### Enfoque de Implementación: next.config.js (NO vercel.json)

**CRÍTICO:** Los docs oficiales de Next.js recomiendan usar `next.config.js headers()` para CSP:
- Aplica en dev Y producción (vercel.json solo aplica en Vercel Edge, no en local)
- Permite `unsafe-eval` condicional por entorno
- Testeable localmente con `npm run dev`
- Portable a cualquier hosting (no depende de Vercel)

**Patrón oficial de Next.js:**

```javascript
const isDev = process.env.NODE_ENV === 'development';

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    connect-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

// Inside nextConfig:
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: cspHeader.replace(/\n/g, ''),
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ];
},
```

### Auditoría de Recursos Externos

El proyecto tiene dependencias externas mínimas:

| Recurso | Dominio | Directiva CSP |
|---------|---------|---------------|
| Google Fonts | N/A (optimizado por `next/font`) | `font-src 'self'` (Next.js descarga y sirve localmente) |
| Imágenes | Locales (`/public/images/`) | `img-src 'self' data:` |
| Social links | linkedin.com, github.com, twitter.com, etc. | No requiere CSP (son `<a href>` navegación, no resource loads) |
| Backend API | Configurable via env, deshabilitado en mock mode | `connect-src 'self'` suficiente para mock mode |
| Schema.org | JSON-LD metadata | No requiere CSP (es `<script type="application/ld+json">`, no fetch) |
| OG Image | `/images/og-image.png` (local, 18KB) | `img-src 'self'` cubre |

### CSP Policy Completa

```
default-src 'self'; script-src 'self' 'unsafe-inline' [unsafe-eval solo en dev]; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

**Explicación de cada directiva:**
- `default-src 'self'`: Fallback para todo lo no especificado
- `script-src 'self' 'unsafe-inline'`: Next.js runtime + inline scripts; `unsafe-eval` SOLO en dev (HMR)
- `style-src 'self' 'unsafe-inline'`: Tailwind genera inline styles, framer-motion inyecta estilos
- `img-src 'self' blob: data:`: Imágenes locales + data URIs para placeholders/SVG inlines + blob URLs
- `font-src 'self'`: `next/font/google` descarga Montserrat en build time y la sirve como self
- `object-src 'none'`: No hay plugins (Flash, Java) — bloquear completamente
- `connect-src 'self'`: XHR/fetch solo a mismo origen (mock mode no necesita más)
- `base-uri 'self'`: Previene inyección de `<base>` tag
- `form-action 'self'`: Previene form hijacking
- `frame-ancestors 'none'`: Equivalente moderno de X-Frame-Options DENY
- `upgrade-insecure-requests`: Fuerza HTTPS en sub-recursos

### Migración de Headers: vercel.json → next.config.js

**Antes (vercel.json):**
```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-XSS-Protection", "value": "1; mode=block" }
    ]
  }
]
```

**Después:**
- `vercel.json`: Eliminar sección `headers` completa
- `next.config.js`: `headers()` function con TODOS los security headers centralizados
- Resultado: Un solo lugar para todos los headers, testeable localmente

### Estado Actual de next.config.js

```javascript
const nextConfig = {
  productionBrowserSourceMaps: true,
  images: { ... },
  experimental: { optimizePackageImports: [...], optimizeCss: true },
  compiler: { removeConsole: ... },
  // ← headers() function va AQUÍ dentro de nextConfig
};
module.exports = nextConfig;
```

**Notas de integración:**
- La variable `isDev` debe definirse FUERA de nextConfig (antes de la declaración)
- La función `headers()` es una propiedad async de nextConfig (al mismo nivel que `images`, `experimental`)
- El `cspHeader` template string usa `.replace(/\n/g, '')` para aplanar antes de enviar

### Caso Especial: `unsafe-eval` en producción

Next.js en modo producción NO requiere `unsafe-eval`. Solo es necesario en dev (HMR/hot reload). El patrón condicional:
```javascript
script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}
```
Elimina `unsafe-eval` automáticamente en builds de producción, endureciendo la política CSP sin romper el desarrollo.

### Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| CSP demasiado restrictivo rompe funcionalidad | Alto | Verificar todas las rutas localmente con `npm run dev` |
| `unsafe-inline` debilita CSP | Medio | Necesario para Next.js/Tailwind; migrar a nonces en futuro |
| Faltan dominios para futuro backend | Bajo | Se agregará al `connect-src` cuando se integre API real |
| Conflicto con vercel.json headers | Medio | Eliminar headers de vercel.json al mover a next.config.js |

### Scope Boundaries — Qué NO Modificar

| Archivo | Razón |
|---------|-------|
| `src/app/layout.jsx` | No relacionado — metadata OG/Twitter ya completo (Story 19.4) |
| `src/middleware.ts` | No existe, no crear — CSP sin nonces no requiere middleware |
| Cualquier componente en `src/ui/` | CSP es header-level, no requiere cambios en componentes |

### Previous Story Intelligence (19.4, 19.5)

**De Story 19.5 (Metadata Hardening):**
- `metadataBase` configurado correctamente — CSP no lo afecta
- Build-time env validation ya funciona — no interferir
- Prettier formatting estricto — lint después de cambios

**De Story 19.4 (Open Graph):**
- OG image en `/images/og-image.png` (18KB, local) — cubierto por `img-src 'self'`
- Twitter Card images con URL relativa — cubierto por `img-src 'self'`
- No hay recursos externos para OG — CSP no impacta social previews

**Lecciones comunes:**
- Siempre correr `npm run lint` después de cambios en next.config.js
- Verificar build completo: `npm run build` antes de marcar task como hecho
- Los 983 tests actuales deben seguir pasando

### Project Structure Notes

- `next.config.js` — archivo principal a modificar (agregar `headers()` + `isDev` + `cspHeader`)
- `vercel.json` — eliminar sección `headers` (migrada a next.config.js)
- No crear middleware ni componentes nuevos

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.3]
- [Source: vercel.json — current headers config to migrate]
- [Source: next.config.js:22-52 — nextConfig object to extend]
- [Docs: Next.js Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)
- [Docs: MDN Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [Source: _bmad-output/implementation-artifacts/19-4-open-graph-social-meta.md — OG resources audit]
- [Source: _bmad-output/implementation-artifacts/19-5-production-metadata-hardening.md — build lessons]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `next.config.js` | MODIFICAR — agregar isDev, cspHeader, headers() function | pendiente |
| `vercel.json` | MODIFICAR — eliminar sección headers (migrada) | pendiente |

## Change Log

- 2026-02-11: Story created with basic CSP plan targeting vercel.json
- 2026-02-11: Enhanced — switched to next.config.js headers() per Next.js official docs, added conditional unsafe-eval, added previous story intelligence (19.4/19.5), fixed verification approach for local testability
