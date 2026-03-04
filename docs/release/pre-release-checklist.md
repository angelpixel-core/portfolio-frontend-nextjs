---
id: pre-release-checklist
aliases: []
tags: []
---

# 🚀 Pre-Release Checklist — Static Frontend Deploy

---

0. Alcance del checklist

Este checklist aplica a:
• Frontend Next.js
• Deploy estático (S3 / bucket / CDN / Vercel static)
• Modo mock activo
• Sin backend productivo aún

No cubre:
• Autenticación real
• Pagos
• Escritura de datos persistentes

---

1. Configuración de entorno mínima

1.1 Variables obligatorias para deploy

Estas deben existir sí o sí en el entorno de build:

```
NEXT_PUBLIC_USE_MOCKS=true
SITE_URL=https://example.com
```

✔ Sin estas, el build puede ser inconsistente.

---

1.2 Variables recomendadas (no críticas)

Estas mejoran coherencia visual, pero tienen fallback:

```
NEXT_PUBLIC_AUTHOR_NAME
NEXT_PUBLIC_CONTACT_EMAIL
NEXT_PUBLIC_LINKEDIN_USERNAME
NEXT_PUBLIC_GITHUB_USERNAME
NEXT_PUBLIC_TWITTER_USERNAME
NEXT_PUBLIC_DRIBBBLE_USERNAME
NEXT_PUBLIC_TELEGRAM_USERNAME
NEXT_PUBLIC_WHATSAPP_PHONE
NEXT_PUBLIC_CALENDLY_USERNAME
NEXT_PUBLIC_RESUME_URL
NEXT_PUBLIC_TRANSITION_PAUSE_MS
```

✔ Si faltan → se usan mocks
✔ No rompen build
✔ No rompen tests

---

1.3 Variables que NO deben existir

Antes del deploy, verificar que NO estén presentes:
• DB\__
• API_KEY
• CLIENT_SECRET
• _\_TOKEN
• Credenciales OAuth reales

👉 Si existen → bloquear release

---

2. Build & artefactos

2.1 Build limpio

Ejecutar:

```
rm -rf .next
npm ci
npm run build
```

Checklist:
• Build termina sin warnings críticos
• No hay errores de TypeScript
• No hay imports dinámicos fallidos
• No hay logs de env undefined inesperados

---

2.2 Output estático

Confirmar que:
• No hay dependencias de runtime backend
• Todas las páginas renderizan con mocks
• No hay llamadas HTTP reales a API_HOST

---

3. Tests antes de release

3.1 Unit / integration tests

```
npm test
```

Requisitos:
• 0 tests fallando
• Tests skippeados documentados (dead / fixme)
• No nuevos skips introducidos en el sprint

---

3.2 E2E (Playwright)

```
npx playwright test
```

Checklist:
• Todos los tests activos pasan
• Skips conocidos coinciden con inventario
• No hay skips por env vars

👉 Regla: no se aceptan skips “misteriosos”

---

4. Smoke Tests manuales (obligatorios)

Estos tests se hacen en el build final, no en dev.

Home
• Hero visible
• CTA visibles
• Slider customers renderiza
• Footer completo

About
• Título correcto (“I Design Systems, Not Just Code”)
• Biography visible
• Skills / WordCloud funcional
• Experience toggle funciona

Contact
• Modal abre
• Validaciones funcionan
• Submit mock responde
• Mensaje de éxito aparece
• Retry funciona

Global
• Theme switch
• Reduced motion
• Mobile / Desktop OK
• No errores en console

---

5. Seguridad básica (frontend)

Antes de release:
• No tokens en window
• No secrets en bundle
• No endpoints write activos
• No OAuth habilitado por error
• No flags de debug visibles

5.1 Gate de seguridad de dependencias en CI (runtime)

El pipeline ejecuta:

```
npm run security:audit:runtime
```

Política:
• Bloquea merge/release si hay vulnerabilidades high/critical en runtime deps
• Ignora dev-only por diseño (`npm audit --omit=dev --audit-level=high`)
• No usar `continue-on-error` en este gate

Break-glass / Waiver (excepcional):
• Archivo de waiver: `.github/security-audit-waiver.json`
• Debe incluir: `issue`, `owner`, `reason`, `expiresOn`
• Activación explícita solo con variable CI `SECURITY_AUDIT_BREAK_GLASS=1`
• Reglas mínimas:

- issue link trazable
- owner responsable
- fecha de expiración obligatoria (max 7 días, enforced por el gate)
- plan de remediación documentado en el issue
  • Si falta cualquiera de estos campos o expiró el waiver -> NO-GO

---

6. Performance básica

Ejecutar Lighthouse (local o CI):

Objetivo mínimo:
• Performance ≥ 80
• Accessibility ≥ 90
• SEO ≥ 90

No bloquear release por:
• Animaciones
• Imágenes placeholder
• Mock data

---

7. Documentación obligatoria

Antes de hacer tag / deploy:
• ADR 003 — Environment & Mock Strategy
• ADR 004 — Testing Strategy
• ADR 005 — Privilege & Exposure Checklist
• README actualizado con modo mock

---

8. Criterio de “GO / NO-GO”

GO si:
• Build OK
• Tests verdes
• Smoke tests OK
• No secretos
• Mocks activos

NO-GO si:
• Env vars sensibles presentes
• Tests fallando
• UI rota sin fallback
• Dependencia backend no mockeada

---

9. Post-release inmediato

Después del deploy:
• Verificar /
• Verificar /about
• Verificar /contact
• Revisar console errors
• Revisar network tab (no API calls)

---

TL;DR

Este frontend puede ir a producción hoy
porque:
• no depende de backend
• no expone secretos
• usa mocks con fallback
• tiene tests y smoke coverage

---
