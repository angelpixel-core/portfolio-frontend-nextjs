---
id: 004-environment-variables-strategy
aliases: []
tags:
  - frontend
  - next.js
  - static-deploy-compatible
---

# ADR 005 — Environment Variables Strategy (Mock-First, Optional Vars)

⸻

Context

El proyecto portfolio-frontend-nextjs consume contenido dinámico (perfil, navegación, social links, textos, assets) que en producción será provisto por un backend.
Durante desarrollo y CI, dicho backend no existe aún, por lo que se utiliza un sistema de mocks con fallbacks.

Se detectó que:
• Existen múltiples variables NEXT*PUBLIC*\*
• La mayoría no están presentes en CI
• Aun así, la aplicación renderiza correctamente
• Los E2E no fallan por env vars faltantes

Era necesario decidir:
• Qué variables son obligatorias
• Cuál es la fuente de verdad
• Qué rol juegan los mocks
• Qué exigir en CI

⸻

Decision

1. Estrategia “Mock-First”

El frontend adopta una estrategia mock-first:
• Los modelos (domains/_/model/mock.ts) son la fuente primaria de datos
• Las variables de entorno solo overridean valores mock
• Ninguna variable NEXT*PUBLIC*_ es estrictamente requerida para renderizar la UI

⸻

2. Variables de entorno como override, no dependencia
   • Las variables de entorno:
   • NO son obligatorias
   • NO bloquean ejecución
   • NO causan errores fatales si faltan
   • Toda variable debe tener:
   • fallback explícito
   • o valor por defecto en mock

⸻

3. CI sin dependencia de .env
   • CI corre con:
   • NODE_ENV
   • PROFILE_EMAIL (legacy)
   • No se exige configurar las ~30 variables públicas
   • CI valida:
   • build
   • typecheck
   • E2E
   • No valida “contenido real”

⸻

4. Clasificación formal de variables

A. Flags
• NEXT_PUBLIC_USE_MOCKS
• NEXT_PUBLIC_OAUTH_ENABLED
• NEXT_PUBLIC_TRANSITION_PAUSE_MS

B. Identidad / URLs simples
• username, email, resume, calendly, etc.
• Siempre con fallback seguro

C. Datos estructurales
• customers
• nav items
• technologies
• content largo

👉 Prohibido mover a .env
👉 Permanecen en mock.ts

⸻

5. .env.example como documentación
   • Se mantiene un .env.example
   • Contiene valores mock-safe
   • Sirve como:
   • referencia
   • onboarding
   • override manual opcional
   • Nunca obligatorio para CI

⸻

Consequences

Positivas
• CI estable y predecible
• Menos fricción de configuración
• UI desacoplada del backend
• Tests no dependen de secrets

Negativas / Trade-offs
• Datos placeholder visibles si no se overridean
• Requiere disciplina en mocks (fallbacks correctos)

⸻

Related Decisions
• ADR 006 — Frontend Testing Strategy
• ADR 007 — Privilege & Exposure Checklist (pendiente)

⸻

ADR 006 — Frontend Testing Strategy (E2E, Dead Tests, Skips)

Status: Accepted
Date: 2026-02-09
Context: Playwright E2E + Next.js App Router

⸻

Context

Durante refactors UI y UX:
• Se modificaron layouts
• Se eliminaron componentes
• Se reemplazaron features (Skills → WordCloud, Header CTA, etc.)

Esto dejó:
• Tests obsoletos
• Tests mal diseñados
• Tests marcados como skip / fixme

Se necesitaba una política clara para:
• eliminar vs arreglar tests
• uso legítimo de test.fixme
• cuándo un test deja de tener sentido

⸻

Decision

1. Tests reflejan el producto actual, no el pasado
   • Un test que valida:
   • un componente eliminado
   • una feature desactivada
   • un layout inexistente

👉 Debe eliminarse, no arreglarse.

⸻

2. Clasificación oficial de tests

A. Dead Tests
• Componente no existe
• Feature removida
• Página incorrecta

👉 Acción: Eliminar

⸻

B. Broken Tests
• Falta interacción previa
• Selector incorrecto
• Timing mal resuelto

👉 Acción: Fixear

⸻

C. Future Tests
• Feature planificada pero no implementada
• CSS/UX pendiente

👉 Acción:
• test.fixme()
• comentario obligatorio explicando la razón

⸻

3. Uso permitido de test.fixme()

test.fixme() está permitido solo si:
• La feature no está implementada
• Existe intención explícita de hacerlo
• Se documenta el motivo

Ejemplo obligatorio:

test.fixme(
'HireMe hover effect',
'Hover state not implemented yet — tracked in UX backlog'
);

⸻

4. Objetivo de CI
   • CI debe:
   • pasar en verde
   • sin errores
   • con skips intencionales y justificados
   • CI no debe:
   • cargar deuda silenciosa
   • esconder fallos reales

⸻

Consequences

Positivas
• Test suite honesta
• Menos ruido en CI
• Mayor confianza en verde = saludable

Negativas / Trade-offs
• Menor cobertura histórica
• Requiere disciplina para no abusar de fixme

⸻

Related Decisions
• ADR 005 — Privilege & Exposure Checklist

⸻
