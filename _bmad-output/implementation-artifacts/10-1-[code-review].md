---
id: 10-1-[code-review]
aliases: []
tags: []
---

⸻

La clave no es la severidad, es la cohesión

Tu duda central es esta (la reformulo):

“¿Estos issues son independientes y conviene separarlos,
o son parte del mismo fenómeno y conviene cerrarlos juntos?”

Y la respuesta es:

👉 En este caso puntual: sí, están cohesionados.
👉 No es deuda técnica estratégica, es fricción residual.

Eso cambia todo.

⸻

Analicemos qué tipo de issues son

De tu review:

MEDIUM 1. Story Dev Notes desactualizadas 2. Skeletons potencialmente afectados (pero mismo patrón) 3. Falta File List en Dev Agent Record

LOW 4. Typo en clase CSS (ligthning) 5. Branch no mergeada

Ahora la pregunta correcta no es “¿son críticos?”, sino:

❓ ¿Alguno de estos tiene valor independiente como historia futura?

Respuesta honesta: no.
• El typo no genera aprendizaje futuro
• El File List es parte del cierre, no una feature
• Los skeletons ya fueron auditados bajo el mismo criterio
• Las Dev Notes son documentación incorrecta, no backlog
• El merge es higiene básica

👉 Todo esto pertenece a cerrar correctamente la story, no a expandir scope.

⸻

Entonces tu sensación es correcta por esta razón específica

“Documentarlo para después es como decir:
‘anotá que hay que borrar el punto y coma’”

Exacto.
Eso no es deuda gobernable, es ruido administrativo.

📌 Regla práctica (guardala, es oro):

Si un issue no puede convertirse en una story con intención propia,
se corrige donde se detecta.

⸻

Por qué NO estás rompiendo el framework BMAD

BMAD separa cuando:
• Hay riesgo
• Hay impacto transversal
• Hay trade-offs
• Hay priorización futura

Nada de eso aplica acá.

Esto es:
• Consistencia
• Higiene
• Cierre semántico de la story

👉 Fixear todo no es scope creep, es scope completion.

⸻

Decisión recomendada (clara y firme)

✅ Elegí la opción [1] Fix them automatically

Y hacelo así:
• Actualizá Dev Notes
• Agregá File List
• Corregí el typo
• Confirmá skeletons como “auditados”
• Mergeá la rama correctamente

Y cerrás con una frase clave (para vos y para la retro):

“No se generan nuevas stories porque los issues no representan trabajo con valor independiente, sino tareas de cierre.”

Eso es madurez, no perfeccionismo.

⸻

Cuándo SÍ separar (para que quede claro el criterio)

Separarías si fuera algo como:
• “Redefinir skeleton color tokens a nivel Design System”
• “Revisar loading UX global”
• “Estandarizar icon mapping cross-domain”

Eso sí va a Epic 10 / 11 / etc.

Pero borrar un typo, actualizar docs y cerrar loops → se hace ahora.

⸻
