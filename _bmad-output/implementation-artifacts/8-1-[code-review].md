---
id: 8-1-[code-review]
aliases: []
tags: []
---

⸻

📌 Qué dicen los hechos (objetivos)

De la review de Story 8.1 – A11y Test Consolidation:
• ❌ 0 Critical
• 🟡 3 Medium
• 🟢 3 Low
• ✅ Todos los AC cumplidos
• ✅ Objetivo principal logrado:
“single authoritative source for accessibility tests”

Además:
• Los Medium no rompen funcionalidad
• 2 de los 3 Medium ya estaban documentados como deuda previa (Story 7.1)
• Los Low son puramente cosméticos / docs

Esto es clave.

⸻

🧠 El error típico (que vos estás evitando)

“Ya que no hay críticos, aprovechemos y arreglemos todo”

Eso genera:
• scope creep silencioso
• stories que nunca cierran
• sensación de “la deuda no se termina nunca”

Y ojo: eso no es disciplina técnica, es ansiedad técnica.

⸻

✅ Qué hacemos con estos issues (decisión clara)

✔️ Decisión recomendada (alineada con BMAD + práctica real)

NO se fixean ahora.
Se documentan y se gobiernan.

Cómo exactamente:

⸻

🟡 Medium issues

Acción:
• Documentarlos explícitamente
• Asignarlos a stories futuras ya previstas

Ejemplo concreto:

Issue Origen Acción
M1: Discrepancia docs (34 vs 33 tests) 8.1 Doc fix → puede entrar en Epic 9
M2: wcag22aa faltante Story 7.1 Mantener deuda → Epic 8.2
M3: waitForLoadState inconsistente Story 7.1 Mantener deuda → Epic 8.3

👉 Importante: ya están gobernados, no están “flotando”.

⸻

🟢 Low issues

Acción:
• Quedan como cleanup opportunistic
• NO bloquean cierre
• NO abren nueva story

Esto es exactamente lo que hiciste hasta ahora y está bien.

⸻

🧭 Regla de oro (guardátela)

Una story de infraestructura se cierra cuando cumple su objetivo,
no cuando el sistema es perfecto.

La perfección es un programa, no una story.

⸻

🧱 Por qué NO es “perpetuar la bola de nieve”

Lo que vos hiciste distinto a equipos malos:
• 🔹 La deuda está escrita
• 🔹 Está clasificada
• 🔹 Tiene lugar futuro asignado
• 🔹 No se mezcla con features

Eso no es bola de nieve, eso es deuda gobernada.

La bola de nieve es:

“Sí, sabemos que está mal, después vemos”.

Acá no pasa eso.

⸻

📌 Cómo cerrar esto formalmente (te recomiendo hacerlo)

Agregá algo así en la story / retro:

### Issue Handling Decision

No critical issues detected.
Medium and low issues were documented and assigned to future stories
(Epic 8.2 / 8.3 and Epic 9).

Decision aligns with scope discipline:

- Story objective achieved
- No functional or accessibility regressions
- Debt remains visible and governed

Eso blinda la decisión frente a cualquier review posterior.

⸻

🧠 Respuesta a tu duda existencial (la más importante)

“¿Siempre va a haber otra épica más con fixes de los fixes?”

Sí.
Y eso es sano.

La diferencia entre caos y madurez es:
• si sabés cuándo cerrar
• si sabés cuándo no tocar

Vos ya estás actuando como Project Lead real, no como “dev con buena intención”.

⸻
