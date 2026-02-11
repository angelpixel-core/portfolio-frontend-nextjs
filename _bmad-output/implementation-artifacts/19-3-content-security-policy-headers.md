# Story 19.3: Content Security Policy Headers

Status: ready-for-dev

## Story

As a **security-conscious developer**,
I want **Content Security Policy headers that restrict resource loading origins**,
so that **the application is protected against XSS attacks and unauthorized resource injection**.

## Acceptance Criteria

1. CSP header present in `vercel.json` applied to all routes `/(.*)`
2. `default-src 'self'` restricts all unspecified resource types to same origin
3. `script-src` allows Next.js runtime (`'self' 'unsafe-inline' 'unsafe-eval'`)
4. `style-src` allows Tailwind and inline styles (`'self' 'unsafe-inline'`)
5. `font-src` allows Next.js optimized Google Fonts (`'self'`)
6. `img-src` allows local images and data URIs (`'self' data:`)
7. `connect-src` allows self for mock mode, plus backend API host when configured
8. No console CSP violation errors on any route (/, /about, /projects, /articles, /articles/[slug])
9. Social share links (twitter.com, linkedin.com) work without CSP blocking (they are navigation, not resource loads)
10. Existing security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) preserved

## Tasks / Subtasks

- [ ] Task 1: Diseñar CSP policy basada en auditoría de recursos (AC: #2-#7)
  - [ ] Mapear cada directiva CSP a los recursos reales del proyecto
  - [ ] Documentar la política completa antes de implementar
- [ ] Task 2: Agregar CSP header en `vercel.json` (AC: #1, #10)
  - [ ] Agregar `Content-Security-Policy` al array de headers existente
  - [ ] Mantener los 3 headers existentes intactos
  - [ ] El valor CSP es un string largo — usar comillas, no line breaks
- [ ] Task 3: Verificar en todas las rutas (AC: #8, #9)
  - [ ] Iniciar dev server: `npm run dev`
  - [ ] Visitar cada ruta: `/`, `/about`, `/projects`, `/articles`
  - [ ] Abrir DevTools > Console → verificar 0 CSP violations
  - [ ] Verificar que social share buttons abren sin error (navegación, no fetch)
  - [ ] Verificar que theme toggle funciona (CSS changes no bloqueadas)
- [ ] Task 4: Agregar `Referrer-Policy` header (mejora de seguridad adicional)
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Task 5: Agregar `Permissions-Policy` header (opcional, buenas prácticas)
  - [ ] Deshabilitar APIs no utilizadas: `camera=(), microphone=(), geolocation=()`

## Dev Notes

### Auditoría de Recursos Externos

El proyecto tiene dependencias externas mínimas:

| Recurso | Dominio | Directiva CSP |
|---------|---------|---------------|
| Google Fonts | N/A (optimizado por `next/font`) | `font-src 'self'` (Next.js descarga y sirve localmente) |
| Imágenes | Locales (`/public/images/`) | `img-src 'self' data:` |
| Social links | linkedin.com, github.com, twitter.com, etc. | No requiere CSP (son `<a href>` navegación, no resource loads) |
| Backend API | Configurable via env, deshabilitado en mock mode | `connect-src 'self'` suficiente para mock mode |
| Schema.org | JSON-LD metadata | No requiere CSP (es `<script type="application/ld+json">`, no fetch) |

### CSP Policy Recomendada

```
default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

**Explicación de cada directiva:**
- `default-src 'self'`: Fallback para todo lo no especificado
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'`: Next.js requiere inline scripts y eval para HMR y runtime
- `style-src 'self' 'unsafe-inline'`: Tailwind genera inline styles, framer-motion inyecta estilos
- `font-src 'self'`: `next/font/google` descarga Montserrat en build time y la sirve como self
- `img-src 'self' data:`: Imágenes locales + data URIs para placeholders/SVG inlines
- `connect-src 'self'`: XHR/fetch solo a mismo origen (mock mode no necesita más)
- `frame-ancestors 'none'`: Equivalente moderno de X-Frame-Options DENY
- `base-uri 'self'`: Previene inyección de `<base>` tag
- `form-action 'self'`: Previene form hijacking

### Estado Actual de Headers en vercel.json

Ya existen 3 headers de seguridad:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

**Nota:** `X-XSS-Protection` está deprecated en browsers modernos. CSP lo reemplaza. Mantenerlo por backward compat pero CSP es la protección real.

### Caso Especial: `unsafe-eval` en producción

Next.js en modo producción NO requiere `unsafe-eval`. Solo es necesario en dev (HMR). Para producción, se podría usar:
```
script-src 'self' 'unsafe-inline'
```
Sin embargo, para simplificar y evitar CSP errors en dev, mantener `unsafe-eval` en ambos entornos. Optimizar en una iteración futura con nonce-based CSP.

### Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| CSP demasiado restrictivo rompe funcionalidad | Alto | Verificar todas las rutas manualmente |
| `unsafe-inline` debilita CSP | Medio | Necesario para Next.js/Tailwind; migrar a nonces en futuro |
| Faltan dominios para futuro backend | Bajo | Se agregará al `connect-src` cuando se integre API real |

### Project Structure Notes

- Solo se modifica `vercel.json` — archivo de configuración Vercel en root
- No hay archivos Next.js middleware ni custom headers en `next.config.js`
- Headers se aplican en edge de Vercel, no en runtime de Node.js

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.3]
- [Source: _bmad-output/analysis/deploy-safety-report-2026-02-11.md]
- [Docs: MDN Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [Docs: Vercel Headers Configuration](https://vercel.com/docs/projects/project-configuration#headers)
- [Source: vercel.json — current headers config]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `vercel.json` | MODIFICAR — agregar CSP, Referrer-Policy, Permissions-Policy headers | pendiente |
