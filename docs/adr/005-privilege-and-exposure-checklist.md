---
id: 005-privilege-and-exposure-checklist
aliases: []
tags:
  - frontend
  - next.js
  - static-deploy-compatible
---

# ADR 005 — Privilege & Exposure Checklist (Frontend)

⸻

Context

El proyecto portfolio-frontend-nextjs es una aplicación 100% pública, sin autenticación obligatoria ni backend activo en producción al momento.

Sin embargo:
• Consume datos dinámicos (perfil, links, textos)
• Ejecuta lógica de UI avanzada (overlays, transitions, feature flags)
• Será desplegado como sitio estático o serverless
• En el futuro puede integrar:
• autenticación
• pagos
• backend propio

Es necesario definir qué información y capacidades se exponen al cliente web, bajo qué condiciones, y qué nunca debe vivir en el frontend.

Este documento establece un baseline de seguridad, privilegios y exposición, independiente de implementación futura.

⸻

Decision

1. El frontend es un cliente no confiable

Regla fundamental:

Todo lo que corre en el navegador puede ser leído, modificado y ejecutado por terceros.

Consecuencia:
• No existen secretos en frontend
• No existe “seguridad por ocultamiento”
• Todo NEXT*PUBLIC*\* es público por definición

⸻

2. Clasificación de datos expuestos

A. Datos públicos intencionales (Permitidos)

Estos datos pueden vivir en frontend:

| Tipo                | Ejemplos          | Fuente     |
| ------------------- | ----------------- | ---------- |
| Identidad pública   | nombre, rol       | env / mock |
| Contacto público    | email, calendly   | env / mock |
| Social links        | usernames         | env / mock |
| Contenido editorial | textos home/about | mock.ts    |
| Assets              | imágenes, logos   | assets     |

✔ Son visibles por diseño
✔ No comprometen seguridad
✔ No requieren autenticación

⸻

B. Flags de comportamiento UI (Permitidos)

| Flag                            | Uso                          |
| ------------------------------- | ---------------------------- |
| NEXT_PUBLIC_USE_MOCKS           | Selección de fuente de datos |
| NEXT_PUBLIC_OAUTH_ENABLED       | Habilitar UI OAuth           |
| NEXT_PUBLIC_TRANSITION_PAUSE_MS | Timing UI                    |

✔ Controlan UX
✔ No otorgan privilegios
✔ No habilitan acceso a datos sensibles

⸻

C. Datos prohibidos en frontend (Nunca)

Estos NO deben existir en el frontend, bajo ningún nombre:

| Tipo               | Ejemplos             |
| ------------------ | -------------------- |
| Credenciales       | passwords, tokens    |
| Secrets            | API keys privadas    |
| Identidad sensible | DNI, dirección       |
| Config backend     | DB_HOST, DB_PASSWORD |
| Privilegios roles  | admin, flags write   |

❌ Nunca en .env
❌ Nunca en mocks
❌ Nunca en NEXT*PUBLIC*\*

⸻

3. Reglas sobre variables de entorno

3.1 NEXT*PUBLIC*\*
• Son públicas
• Se exponen en el bundle JS
• Pueden ser leídas desde DevTools

👉 Usarlas solo para:
• Identidad pública
• Config visual
• Overrides de mock

⸻

3.2 Variables server-only

Variables como:
• DB*\*
• API_KEY
• CLIENT_SECRET
• GOOGLE*\*

✔ Permitidas solo en backend
✔ No deben existir en el repo frontend
✔ Si aparecen → error de arquitectura

⸻

4. Autenticación (Estado actual)

Estado actual del proyecto:
• ❌ No hay login real
• ❌ No hay sesión
• ❌ No hay roles
• ❌ No hay API write

La UI de autenticación:
• Está deshabilitada por flag
• No otorga privilegios
• No cambia datos

👉 No existe riesgo de escalamiento de privilegios hoy.

⸻

5. Tests y exposición

5.1 E2E tests
• Los tests no deben:
• depender de secrets
• validar datos reales
• requerir credenciales

Los E2E validan:
• UX
• Accesibilidad
• Layout
• Comportamiento UI

⸻

5.2 Tests skipped

Los tests skippeados actuales:
• NO son por seguridad
• NO son por env vars
• Son:
• dead tests
• tests de features removidas
• tests mal diseñados

👉 No representan riesgo de exposición.

⸻

6. Preparación para futuro backend

Cuando se integre backend real:

Obligatorio:
• Auth en backend
• Tokens HttpOnly
• Rate limiting
• Logging
• Validación server-side

Nunca:
• Mover lógica de permisos al frontend
• Confiar en flags UI para seguridad
• Exponer endpoints write sin auth

⸻

7. Checklist de verificación (pre-release)

Antes de cada release:
• No hay secretos en .env.example
• Todo NEXT*PUBLIC*\* es intencional
• No hay API keys en el bundle
• Los mocks cubren ausencia de env vars
• La app funciona sin .env
• No hay lógica de permisos en frontend
• UI flags no otorgan acceso

⸻

Consequences

Positivas
• Seguridad clara y explícita
• Menos riesgo futuro
• CI y frontend desacoplados
• Arquitectura escalable

Trade-offs
• Más disciplina al integrar backend
• Requiere revisar PRs con criterio de exposición

⸻

Related Decisions
• ADR 004 — Environment Variables Strategy
• ADR 006 — Frontend Testing Strategy

⸻

Summary (TL;DR)

El frontend es público, no confiable y deliberadamente limitado.
Toda seguridad real vive en backend.
Los env vars son configuración visual, no secretos.

⸻
