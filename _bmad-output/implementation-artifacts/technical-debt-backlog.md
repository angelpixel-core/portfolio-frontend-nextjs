# Technical Debt Backlog

**Última actualización:** 2026-01-27
**Origen:** Epic 9 Retrospective + Console Analysis

---

## Resumen

| Severidad | Cantidad | Estado |
|-----------|----------|--------|
| HIGH | 0 | ✅ Resueltos |
| SERIOUS | 0 | ✅ Resueltos (Story 10.1) |
| LOW | 2 | 📋 Asignados a Epic 10 (Stories 10.3-10.4) |

> **Nota:** Todos los issues pendientes fueron asignados a **Epic 10: Runtime & UX Polish**.

---

## Issues Resueltos

### ~~Hydration Mismatch (ThemeButton)~~ ✅

- **Commit:** `db27e83`
- **Severidad:** HIGH
- **Fix:** Defer rendering pattern en `ThemeButton`
- **Fecha:** 2026-01-27

---

## Issues Pendientes

### ~~1. Color Contrast in Dark Mode~~ ✅ (Story 10.1)

| Campo | Valor |
|-------|-------|
| **Severidad** | SERIOUS |
| **Tipo** | Accessibility (WCAG 2 AA) |
| **Origen** | axe-core audit en E2E tests |
| **Resuelto** | 2026-01-27 |

**Fix aplicado:**
- `.paragraph` (ParagraphText): Agregado `text-dark dark:text-light`
- `.hero-image` (Hero skeleton): Agregado `text-dark dark:text-light`

**Commits:**
- `66c90d7` - RED: Debug test
- `9b9635d` - GREEN: CSS fixes
- `4f36cfe` - REFACTOR: Cleanup

---

### ~~2. Missing Icons in SocialNetworkLink~~ ✅ (Story 10.2)

| Campo | Valor |
|-------|-------|
| **Severidad** | LOW |
| **Tipo** | UI / Data |
| **Origen** | Console warning |
| **Resuelto** | 2026-01-27 |

**Fix aplicado:**
- Added `Twitter: TwitterIcon` to iconMapping
- Added `Dribbble: DribbbleIcon` to iconMapping

**Commits:**
- `d82c516` - RED: Tests for PascalCase icons
- `b304202` - GREEN: Add icon mappings

---

### 3. Font Preload Warning → **Story 10.3**

| Campo | Valor |
|-------|-------|
| **Severidad** | LOW |
| **Tipo** | Performance |
| **Origen** | Browser console |
| **Impacto** | Warning en consola, no afecta funcionalidad |
| **Asignado a** | Epic 10, Story 10.3 |

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

### 4. Favicon 404 → **Story 10.4**

| Campo | Valor |
|-------|-------|
| **Severidad** | LOW |
| **Tipo** | Assets |
| **Origen** | Network tab |
| **Impacto** | 404 en request de favicon, tab sin icono |
| **Asignado a** | Epic 10, Story 10.4 |

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
| 2026-01-27 | Epic 10 creado, 4 issues asignados a Stories 10.1-10.4 |
| 2026-01-27 | Color contrast resuelto via Story 10.1 (SERIOUS → ✅) |
| 2026-01-27 | Missing icons resuelto via Story 10.2 (LOW → ✅) |
