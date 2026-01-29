---
id: epic-12-retro-2026-01-28-angel
aliases: []
tags: []
---

📌 Aporte sugerido a la retrospectiva (Epic 12)

✅ Qué salió bien (logros reales)
• Se logró sanear completamente la base del frontend: sin errores críticos, sin warnings bloqueantes, con tests confiables y CI estable.
• El epic terminó con 100% de cumplimiento de FRs, incluso corrigiendo desviaciones detectadas tardíamente (FR15 / FR16).
• El proceso de code review adversarial funcionó: detectó violaciones de requisitos que no eran evidentes a simple vista.
• El sistema de breakpoints semánticos (nav / tablet / desktop) se consolidó y eliminó comportamientos erráticos históricos.
• El proyecto quedó en un estado onboarding-friendly: alguien nuevo puede correrlo sin “ruido rojo” desde el minuto cero.

⸻

🧠 Qué aprendimos (insights clave)
• Los requisitos de UX también son contratos funcionales: no basta con que “se vea”, tiene que cumplir exactamente lo que dice el FR.
• Los tests E2E pueden dar falsos positivos si no validan estructura y jerarquía, no solo visibilidad.
• Resolver issues “tarde” pero antes del merge sigue siendo una victoria del proceso, no un fracaso.
• Mantener una rama estable y limpia reduce la carga cognitiva futura mucho más que avanzar rápido con deuda.
• Atomic Design sirve para implementar, pero el diseño debe empezar por comportamiento de página y breakpoints, no por componentes aislados.

⸻

🔁 Qué mejoraríamos para el próximo epic
• Formalizar antes un documento de UI / UX behavior para evitar ambigüedades de interpretación.
• Alinear más temprano tests con Acceptance Criteria estructurales (no solo visuales).
• Usar el code review no solo como control, sino como herramienta de diseño correctivo temprano.

⸻

🧭 Próximo paso (importante dejarlo explícito)

A partir de este epic, se iniciará una nueva fase enfocada en UX / UI behavior refinement, basada en un documento específico que describa:
• comportamiento mobile-first
• transiciones entre breakpoints
• estados interactivos del header, blades y navegación

Este trabajo no corrige bugs, sino que embellece y refina la experiencia, apoyándose sobre una base técnica ya saneada.

Esto deja clarísimo que:
• no hay deuda crítica pendiente
• lo que sigue no es “arreglar errores”, es subir la calidad percibida

⸻

🧠 Frase de cierre (muy buena para retro / entrevista)

“Este epic no solo cerró stories: cerró incertidumbre. A partir de ahora, cualquier mejora se hace sobre una base estable, predecible y documentada.”
