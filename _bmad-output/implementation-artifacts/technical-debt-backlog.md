# Technical Debt Backlog

**Última actualización:** 2026-01-27
**Origen:** Epic 9 Retrospective + Console Analysis

---

## Resumen

| Severidad | Cantidad | Estado |
|-----------|----------|--------|
| HIGH | 0 | ✅ Resueltos |
| SERIOUS | 1 | Documentado |
| LOW | 3 | Documentados |

---

## Issues Resueltos

### ~~Hydration Mismatch (ThemeButton)~~ ✅

- **Commit:** `db27e83`
- **Severidad:** HIGH
- **Fix:** Defer rendering pattern en `ThemeButton`
- **Fecha:** 2026-01-27

---

## Issues Pendientes

### 1. Color Contrast in Dark Mode

| Campo | Valor |
|-------|-------|
| **Severidad** | SERIOUS |
| **Tipo** | Accessibility (WCAG 2 AA) |
| **Origen** | axe-core audit en E2E tests |
| **Impacto** | Algunos elementos no cumplen ratio 4.5:1 en dark mode |

**Evidencia:**
```
[SERIOUS] color-contrast: Ensure the contrast between foreground and
background colors meets WCAG 2 AA minimum contrast ratio thresholds
Help: https://dequeuniversity.com/rules/axe/4.11/color-contrast
```

**Acción requerida:**
- Auditar colores de texto en dark mode
- Ajustar CSS variables en `globals.css` o theme config
- Re-ejecutar `npm run test:e2e -- --grep "dark mode"`

---

### 2. Missing Icons in SocialNetworkLink

| Campo | Valor |
|-------|-------|
| **Severidad** | LOW |
| **Tipo** | UI / Data |
| **Origen** | Console warning |
| **Impacto** | Fallback a `QuestionIcon` para redes no mapeadas |

**Evidencia:**
```
⚠️ [SocialNetworkLink] Icon "Twitter" not found in iconMapping
⚠️ [SocialNetworkLink] Icon "Dribbble" not found in iconMapping
```

**Acción requerida:**
- Agregar `Twitter` y `Dribbble` a `iconMapping` en SocialNetworkLink
- O actualizar mock data para usar nombres de iconos existentes

**Ubicación probable:**
- `src/ui/molecules/SocialNetworkLink/` o similar
- Mock data en `public/data/` o API

---

### 3. Font Preload Warning

| Campo | Valor |
|-------|-------|
| **Severidad** | LOW |
| **Tipo** | Performance |
| **Origen** | Browser console |
| **Impacto** | Warning en consola, no afecta funcionalidad |

**Evidencia:**
```
The resource at "http://localhost:9000/_next/static/media/904be59b21bd51cb-s.p.woff2"
preloaded with link preload was not used within a few seconds.
```

**Acción requerida:**
- Revisar configuración de fonts en `next.config.js` o layout
- Verificar si la font preloaded se usa realmente
- Considerar lazy loading o remover preload innecesario

**Ubicación probable:**
- `src/app/layout.tsx`
- `next.config.js`

---

### 4. Favicon 404

| Campo | Valor |
|-------|-------|
| **Severidad** | LOW |
| **Tipo** | Assets |
| **Origen** | Network tab |
| **Impacto** | 404 en request de favicon, tab sin icono |

**Evidencia:**
```
GET http://localhost:9000/favicon.ico [HTTP/1.1 404 Not Found 2ms]
```

**Acción requerida:**
- Agregar `favicon.ico` a `/public/`
- O configurar en `app/layout.tsx` metadata

---

## Notas de Gobernanza

### Criterio de Priorización

| Severidad | Criterio | Acción |
|-----------|----------|--------|
| CRITICAL | Rompe funcionalidad core | Fix inmediato |
| HIGH | Rompe SSR/SEO/Performance | Fix antes de release |
| SERIOUS | Accessibility violation | Planificar en próxima épica |
| MEDIUM | Quality of life | Evaluar esfuerzo vs beneficio |
| LOW | Nice to have | Documentar, fix oportunístico |

### Proceso

1. Issues HIGH → Fix inmediato en épica actual
2. Issues SERIOUS/MEDIUM → Documentar, crear story en próxima épica
3. Issues LOW → Documentar aquí, fix cuando sea conveniente

> "La deuda técnica no se elimina, se gobierna."
> — Epic 8 Retrospective

---

## Historial

| Fecha | Cambio |
|-------|--------|
| 2026-01-27 | Documento creado post-Epic 9 retrospective |
| 2026-01-27 | Hydration mismatch resuelto (HIGH → ✅) |
