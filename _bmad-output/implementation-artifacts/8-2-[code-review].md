---
id: 8-2-[code-review]
aliases: []
tags: []
---

⸻

🧠 Diagnóstico rápido (hechos)

Para Story 8.2 – WCAG 2.2 Full Coverage:
• 🔴 Critical: 0
• 🟡 Medium: 3
• 🟢 Low: 2
• ✅ Acceptance Criteria: 100% cumplidos
• ✅ Objetivo del epic: logrado (infra de a11y consolidada, WCAG 2.2 activo, no blocking)

Los issues nuevos son documentales / de completitud, no de comportamiento:

Medium
• M1: JSDoc desactualizado (comentarios, no lógica)
• M2: Story file list incompleta (trazabilidad documental)
• M3: Ambigüedad AC vs implementación (no requería filters extra, pero podría extenderse)

Low
• L1/L2: Mensajes de log / comentarios (cosmético)

⸻

🎯 Decisión recomendada (clara y defendible)

👉 Elegimos una estrategia mixta (la correcta):

✅ Fixear AHORA (rápido, sin riesgo)

Corregir SOLO lo que:
• no cambia comportamiento
• no agrega scope
• mejora calidad inmediata

Concretamente:
• ✔️ M1 – JSDoc desactualizado
• ✔️ M2 – Completar “Files Modified” en el story
• ✔️ L2 – Comentarios inconsistentes

⏱️ Esto es trabajo trivial, de bajo costo cognitivo y deja la story “limpia”.

⸻

📌 Documentar para después (NO ahora)

NO implementar ahora:
• ❌ M3 – filters adicionales (moderate/minor)

¿Por qué?
• No estaba explícitamente requerido por el AC
• Cambia el diseño de la API de tests
• Es claramente otra story (Epic 8.3 o Epic 9)

Esto se documenta como:

“Potential extension of accessibility filtering strategy”

⸻

🧱 Regla que estás aplicando (y está bien)

Fix what is local and obvious.
Defer what expands the contract.

Eso es scope discipline, no deuda infinita.

⸻

📝 Qué le respondés al workflow ahora

Cuando te pide elegir:

Elegí:
[1] Fix them automatically
👉 pero aclarando que solo M1, M2 y L2.

Y dejás explícito en el cierre algo así:

Decision:

- Fixed documentation-only issues (M1, M2, L2) in-scope.
- Deferred M3 as out-of-scope enhancement; documented for Epic 8.3.

No functional or infra regressions detected.
Story remains compliant with original acceptance criteria.

⸻

🚦 Estado final correcto
• Story 8.2 → DONE
• Epic 8 → sigue sano, sin scope creep
• Epic 9 → tiene input real y justificado
• Vos → actuando como Project Lead, no como “apaguemos incendios”

⸻
