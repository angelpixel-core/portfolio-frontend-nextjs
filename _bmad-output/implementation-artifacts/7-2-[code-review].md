---
id: 7-2-[code-review]
aliases: []
tags: []
---

⸻

1. Validaciones manuales para la Story 7.2 (qué sí vale la pena hacer)

La 7.2 no es visual ni funcional para el usuario, es infraestructura de testing.
Entonces la validación manual no es “ver la UI”, sino ver que el sistema sea más resistente.

✅ Checklist manual mínimo (suficiente para DONE)

Usá esto tal cual:

A. Validación de robustez (la más importante) 1. Abrí la app (npm run dev) 2. Abrí /, /about, /projects, /articles 3. Abrí DevTools → Elements 4. Renombrá temporalmente una clase CSS (ej: .animated-title_container) 5. Corré:

npm run test:e2e

    6.	✅ Los tests siguen pasando

👉 Esto valida exactamente el objetivo de la story.

⸻

B. Validación de contrato (data-testid) 1. En DevTools buscá:

data-testid=

    2.	Verificá que:
    •	Existen en elementos interactivos
    •	Siguen el patrón documentado (nav-social-container, etc.)
    3.	Abrí docs/development-workflow.md sección E2E
    4.	Confirmá que lo que está en código coincide con lo documentado

👉 Esto cubre AC1 y AC3.

⸻

C. Validación de no regresión 1. Navegá normalmente (home → projects → articles) 2. Click en links, theme toggle, social icons 3. No debe romper nada (ya lo comprobaste visualmente)

👉 Esto cubre “no functionality changed”.

⸻

📌 Con eso alcanza.
No necesitás más validación manual para esta story.

⸻

2. ¿Hacemos otro code review de la 7.2?

👉 Sí, pero con criterio.

Vos ya tenés el output del review, que es excelente.
La pregunta ahora no es “qué está mal”, sino:

¿Qué corresponde fixear ahora según el framework?

⸻

3. Decisión BMAD: qué fixear y qué NO (clave)

Estado actual (muy importante)
• ❌ Críticos: 0
• 🟡 Medium: 3
• 🟢 Low: 2
• Tests: 100% passing
• ACs: 100% cumplidos

👉 La story está DONE.
No hay discusión ahí.

⸻

4. Qué haría yo (recomendación clara)

🔧 Fixear ahora (rápido, sin riesgo)

Solo 1 cosa, porque:
• Es documental
• Es barata
• Reduce confusión futura

Fix inmediato recomendado:
• 🔧 Actualizar el story para que diga:

TESTIDS.nav.social.container

en lugar de contact.socialNav

👉 Esto es un fix de 5 minutos, sin tocar código productivo.

⸻

📝 Documentar para después (NO ahora)

Estos van a backlog técnico:
• getSocialLinkTestId no usado
• Comentarios inconsistentes en registry
• Código comentado en CustomersSlider

👉 Estos son perfectos candidatos para Epic 8 o Epic 9, no para esta story.

⸻

5. Respondiendo a tu duda grande (la más importante)

“¿No estamos perpetuando la bola de nieve?”

La respuesta honesta y realista es:

✅ Sí, la deuda técnica nunca se termina

Y no está mal.

Lo que sí estaría mal sería:
• Mezclar fixes estructurales con objetivos de la story
• Romper el foco
• Convertir cada story en “cleanup infinito”

Vos no estás ignorando la deuda, la estás:
• Identificando
• Clasificando
• Planificando

Eso es madurez, no negligencia.

⸻

6. Cómo se ve el flujo real (para que lo interiorices)

En proyectos sanos pasa esto:

Epic N → entrega valor
↓
Documenta deuda
↓
Epic N+1 → mejora infraestructura
↓
Queda deuda residual
↓
Epic N+2 → otro slice de deuda
↓
(repetir)

👉 Nunca hay “la épica donde se arregla todo”.
Eso es un mito peligroso.

⸻

7. Conclusión clara para que tomes la decisión

Para la Story 7.2:
• ✅ Validación manual: la que te pasé
• 🔧 Fix ahora: solo el mismatch documental
• 📝 Medium/Low: backlog
• 🏁 Estado: DONE
