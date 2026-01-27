---
id: epic-9-retro-2026-01-27-angel
aliases: []
tags: []
---

⸻

Qué aportar a la retro (Epic 9)

1️⃣ Qué funcionó bien (KEEP)

Podés decir algo como:

Documentación tratada como infraestructura.
Epic 9 demostró que la documentación puede trabajarse con el mismo rigor que el código: scope claro, code review, criterios de aceptación y cierre explícito.

Puntos concretos:
• Scope documentation-only respetado al 100%
• Cero cambios de código → cero riesgo
• Alineación real entre templates y código existente
• Mejora en precisión (números reales en lugar de “many”, “some”, etc.)
• Stories cerradas rápido sin comprometer calidad

👉 Insight BMAD:

Cuando el scope está bien definido, la velocidad aparece sola.

⸻

2️⃣ Qué aprendimos (LEARN)

Acá está lo más potente que podés aportar 👇

Cerrar una épica sin eliminar todos los warnings es una decisión consciente, no un fallo.

Aprendizajes clave:
• No todo warning es deuda crítica
• La ausencia de critical issues es una señal clara de DONE
• La retro es el lugar correcto para mover trabajo al futuro, no el code review
• Documentar deuda ≠ postergar indefinidamente

Esto conecta directo con lo que viste:
• Hydration warnings
• Preload warnings
• UX responsive pendiente

👉 Aprendizaje de proceso:

Separar deuda técnica de nuevos requerimientos evita reabrir épicas innecesariamente.

⸻

3️⃣ Qué podríamos mejorar (IMPROVE)

Acá no se trata de “fallamos”, sino de afinar el sistema:

Necesitamos un carril explícito para issues runtime/client-side que no son críticos.

Propuesta concreta:
• Formalizar épicas de Hardening / Runtime Stability
• No mezclar:
• documentación
• infraestructura
• UX nueva
• Usar las retros para crear la próxima épica, no para extender la actual

Esto explica naturalmente por qué aparecen Epic 10 / 11 después.

⸻

4️⃣ Decisión tomada (DECIDE)

Esto es clave dejarlo dicho en la retro:

Decidimos no resolver MEDIUM / LOW issues dentro de Epic 9.
Se documentan y se trasladan como input explícito para próximas épicas.

Razón:
• No son blockers
• No rompen funcionalidad
• No afectan el objetivo de la épica

👉 Esto NO es deuda oculta, es deuda gobernada.

⸻

Frase de cierre (muy buena para la retro)

Si querés cerrar fuerte, algo así:

Epic 9 confirma que cerrar bien una épica no es eliminar todo lo pendiente, sino dejar el sistema en un estado estable, entendible y con próximos pasos claros.

⸻
