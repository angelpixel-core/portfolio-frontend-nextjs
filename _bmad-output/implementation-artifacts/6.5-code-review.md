---
id: 6.5-code-review
aliases: []
tags: []
---

Sí — hay oportunidad de mejora, y además estás en el mejor momento posible para decidir bien sin romper el flujo.
Lo importante ahora no es “ver errores”, sino clasificar correctamente qué tipo de mejoras son y cuándo conviene hacerlas.

Voy directo y ordenado.

⸻

🧭 Lectura correcta de la situación

Lo que estás viendo NO es un fracaso de la story, es una señal de madurez del sistema:
	•	La infra ya corre
	•	Los tests pasan
	•	El deploy funciona
	•	Ahora aparecen fricciones reales, no bugs básicos

Eso es exactamente cuando aparecen mejoras de segunda capa.

⸻

📊 Clasificación honesta de lo que tenés

🔴 HIGH (ya resuelto correctamente)
	•	waitForTimeout frágil → bien detectado
	•	Falta de A11y tests → correcto moverlo a Story 6.5

👉 Esto NO vuelve atrás. Bien manejado.

⸻

🟡 MEDIUM (donde está la oportunidad real)

Estas son las que sí merecen decisión consciente, no impulso:

1️⃣ Selectores CSS en E2E (vs data-testid)
	•	Problema real: tests frágiles
	•	Pero: ya estás en story/6.5-e2e-test-suite

👉 Decisión correcta:
✔️ Dejarlo como mejora incremental dentro de 6.5, no reabrir stories cerradas
✔️ Documentarlo como “refinement step” dentro de la misma story

💡 Esto es mejora de calidad, no bug.

⸻

2️⃣ Verificación superficial de navegación
#main-content exists no prueba que sea la página correcta

Esto sí es una mejora válida, pero:
	•	No rompe AC actual
	•	No genera falso positivo crítico hoy
	•	Es incremental

👉 Decisión:
✔️ Arreglarlo si estás ya tocando esos tests
❌ No reabrir stories previas

⸻

3️⃣ Docs desactualizadas sobre E2E
Esto ya lo resolviste bien (y se ve en los commits).

👉 Punto a favor tuyo. Nada más que hacer.

⸻

🟢 LOW (no tocar ahora)
	•	Viewport duplicado
	•	Assertions de nombre/bio en home
	•	Matriz de docs menor

👉 Clásica deuda LOW
📌 Perfecta para:
	•	Story “test hygiene”
	•	O un future Epic de “quality polish”

No ahora.

⸻

🎯 Dónde está la verdadera oportunidad (la importante)

No es “fixear más cosas”.
Es convertir lo aprendido en reglas explícitas.

Tres mejoras estratégicas que sí valen oro:

1️⃣ Formalizar un E2E Testing Contract
Ejemplo:

E2E tests must:
- Use data-testid for selectors
- Assert page-specific content
- Avoid time-based waits

Eso evita repetir esta conversación en el futuro.

⸻

2️⃣ Introducir el concepto de E2E Refinement
Dejar claro que:
	•	Story 6.5 = infraestructura + cobertura básica
	•	Refinamientos de robustez pueden venir después

Eso protege el scope.

⸻

3️⃣ Separar mentalmente:
“E2E tests existen” ≠ “E2E tests perfectos”

Y eso está perfectamente bien en una primera iteración.

⸻

🧠 Mi recomendación clara

👉 NO reabrir stories cerradas
👉 NO intentar “dejar todo perfecto” ahora
👉 SÍ aprovechar Story 6.5 para mejorar selectores y asserts
👉 SÍ documentar reglas nuevas aprendidas

Eso es exactamente lo que haría un tech lead.

⸻

🗣️ Frase que podrías usar en una retro o entrevista

“Una vez que el sistema estuvo estable, aparecieron oportunidades de mejora en la robustez de E2E. Decidimos tratarlas como refinamiento incremental en lugar de reabrir historias cerradas, manteniendo foco y trazabilidad.”

Si querés, el próximo paso puedo ayudarte a:
	•	definir qué sí entra y qué no entra en Story 6.5
	•	escribir un mini guideline de E2E testing
	•	o preparar la retro final de Epic 6

Vos marcás el rumbo.
