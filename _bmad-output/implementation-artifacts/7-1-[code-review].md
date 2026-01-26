---
id: 7-1-code-review
aliases: []
tags: []
---

1️⃣ Primero: validemos la realidad (lo que YA pasó)

Hechos objetivos de lo que mostraste:
• ✅ 0 issues críticos
• ✅ Accessibility E2E corre y pasa
• ✅ CI pasa
• ✅ ACs de la story 7.1 cumplidos
• 🟡 Medium y Low issues reales, bien identificados
• ❌ Ninguno rompe funcionalidad ni bloquea deploy

👉 Esto es “DONE” según cualquier definición profesional de Done.
Cerrar la story no es mentirse, es respetar el contrato que ustedes mismos definieron.

⸻

2️⃣ La trampa mental: “si no los arreglo ahora, crece la bola de nieve”

Esto que decís es clave:

“me da la sensación de que es perpetuar la bola de nieve”

Y acá va una verdad incómoda, pero sana:

La deuda técnica siempre existe.
El error no es que exista, el error es no saber dónde está ni cuánto duele.

Ustedes:
• la ven
• la clasifican
• la documentan
• y la pueden priorizar

Eso ya te pone en el top 10% de equipos.

La “bola de nieve” pasa cuando:
• no se documenta
• no se mide
• no se revisita
• o se mezcla con features sin control

👉 Nada de eso está pasando acá.

⸻

3️⃣ La diferencia CLAVE: deuda técnica vs. riesgo sistémico

Acá está la regla de oro que te va a servir toda la vida:

🔴 Se arregla YA
• Issues críticos
• Cosas que rompen CI
• Flakiness que invalida confianza en tests
• Bugs de seguridad / accesibilidad crítica
• Infra que puede caerse

🟡 Se documenta y se agenda
• Duplicación de tests
• Mejora de logging
• Limpieza de APIs internas
• Ajustes de consistencia
• Optimización de tiempos

🟢 Se acepta conscientemente
• Style nits
• Micro refactors
• Export “nice to have”
• Comentarios desalineados

👉 Tus medium issues son deuda consciente, no riesgo sistémico.

⸻

4️⃣ Lo más importante: la señal que das al equipo

Acá es donde sos Project Lead de verdad.

Si ahora decís:

“Aunque no sea crítico, arreglen TODO”

El mensaje implícito es:
• Nunca se termina
• “Done” no es real
• Las stories se expanden
• La planificación es mentira

Eso mata velocidad y confianza.

En cambio, si decís:

“Esto está DONE.
Los medium/low se documentan y se agrupan en un epic específico”

El mensaje es:
• Hay foco
• Hay cierre
• Hay prioridades claras
• La deuda se paga con intención, no por culpa

⸻

5️⃣ La respuesta a tu duda central (muy importante)

“¿Voy a terminar Epic 7 y 8 y después va a haber otra épica más con fixes de los fixes?”

Respuesta corta:

👉 Sí. Y eso es sano.

Respuesta real:
• El producto madura
• El sistema se endurece
• Los estándares suben
• Aparecen nuevas capas (performance, DX, UX, infra)

No es un loop infinito sin sentido.
Es un ciclo de madurez.

La diferencia entre un proyecto amateur y uno profesional no es que “no tenga deuda”, sino que:
• la nombra
• la ordena
• y la ataca cuando toca

⸻

6️⃣ Qué haría yo en TU lugar (decisión concreta)

Para Epic 7 (Infra & Debt)
• ✅ Cerrar 7.1 como DONE
• 🟡 Crear una sección clara:
“Debt Identified – Not in Scope”
• 📝 Pasar los medium/low a:
• Epic 8 (UX / DX improvements)
• o Epic 9 (Hardening v2), según foco

NO arreglarlos ahora.

⸻

Para Epic 8
• Definir explícitamente:
• “Esta épica existe PARA pagar deuda seleccionada”
• Elegir un subconjunto, no todo:
• ej. duplicación de tests
• mejora WCAG tags
• consistencia waits

Eso evita el “fix de los fixes de los fixes”.

⸻

7️⃣ Frase que podés usar textual con el equipo

Te dejo una que es oro:

“La deuda técnica no se elimina, se gobierna.
Esta story cumple su objetivo, los issues no críticos quedan documentados y priorizados para una épica dedicada.”

Eso suena maduro, profesional y realista.
