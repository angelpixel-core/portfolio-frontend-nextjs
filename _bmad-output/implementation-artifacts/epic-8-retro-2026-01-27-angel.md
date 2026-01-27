---
id: epic-8-retro-2026-01-27-angel
aliases: []
tags: []
---

⸻

🎯 Aportes clave a la retrospectiva – Epic 8

1️⃣ La disciplina de scope fue el mayor habilitador de cierre

“Mantener un scope estrictamente de hardening (sin features nuevas) permitió cerrar las 3 stories sin bloqueos ni re-trabajo.”

Evidencia real:
• 3/3 stories DONE
• 0 critical issues
• Medium/Low siempre documentados, nunca ocultos

👉 Insight: decir ‘no’ a tiempo acelera más que decir ‘sí’ a todo.

⸻

2️⃣ La infraestructura de tests pasó de “existir” a “ser confiable”

“Epic 8 no agregó más tests: hizo que los existentes fueran confiables, consistentes y entendibles.”

Resultados concretos:
• E2E: 34 → 27 tests (menos duplicación, más señal)
• A11y: una sola fuente autoritativa (accessibility.spec.ts)
• Wait strategies estandarizadas

👉 Insight: menos tests, mejor tests.

⸻

3️⃣ La validación manual cambió de foco (y eso fue un avance)

“Aprendimos a validar historias de infraestructura mirando el sistema, no la UI.”

Qué se validó manualmente:
• Que CI falle cuando debe fallar
• Que los reports existan y sean legibles
• Que los warnings tengan sentido humano

Qué no se validó (correctamente):
• Pixel-perfect
• UX / responsive
• Lighthouse manual

👉 Insight: validar intención > validar apariencia.

⸻

4️⃣ La deuda técnica dejó de ser abstracta y pasó a ser gobernada

“La deuda no desapareció, pero quedó visible, clasificada y con destino claro.”

Hechos:
• Deuda heredada de Epic 7 → resuelta en Epic 8
• Nueva deuda detectada → asignada a Epic 9
• Ningún issue quedó “flotando”

👉 Insight: la deuda es aceptable cuando tiene dueño y roadmap.

⸻

5️⃣ Documentación tratada como infraestructura (no como anexo)

“Epic 8 confirmó que la documentación también necesita hardening.”

Ejemplos:
• Estrategias de wait documentadas
• Patrones de E2E explícitos
• Historias largas navegables

👉 Esto prepara directamente el terreno para Epic 9.

⸻

🧠 Meta-aprendizaje (muy valioso)

“Cerrar epics técnicos sin features visibles requiere criterio compartido sobre qué es DONE.”

Epic 8 ayudó a alinear al equipo en:
• cuándo cerrar
• cuándo documentar
• cuándo no tocar más

Eso reduce fricción futura.

⸻

🧩 Riesgos detectados (sin dramatizar)
• Tentación recurrente de “fixear un poco más”
• Confundir warnings de runtime con scope de la story
• Expectativa de perfección en epics de hardening

👉 Mitigación: reglas claras de severidad + epics dedicados (como 9).

⸻

🚀 Qué habilita Epic 8 hacia adelante
• Epic 9 (Docs & DX) con base sólida
• Futuros E2E sin flakiness
• A11y como sistema, no como esfuerzo puntual
• Mayor velocidad sin perder confianza

⸻

📌 Versión ultra-corta (por si el framework pide bullets)
• Scope discipline permitió cerrar 3/3 stories
• Infra de tests pasó de frágil a confiable
• Validación manual enfocada en sistema, no UI
• Deuda técnica visible y gobernada
• Documentación tratada como infraestructura

⸻
