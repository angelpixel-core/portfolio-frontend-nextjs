---
id: epic-14-retro-2026-02-07-angel
aliases: []
tags: []
---

# 🔄 Retrospectiva – Épica 14

Projects & Articles + Code Quality Merge

## 1. Contexto de la épica

La Épica 14 fue atípica respecto al resto del proyecto:
• Comenzó como una épica UX/UI + comportamiento de páginas (Projects & Articles).
• Durante su ejecución absorbió trabajo de calidad de código y refactorización que originalmente estaba planificado para otra épica.
• Cerró con 100% de stories completadas, tests pasando y aplicación funcional.

Esto la convierte en una épica híbrida, tanto en alcance como en impacto.

⸻

## 2. Qué salió bien (👍)

🟢 Entrega y ejecución
• 18/18 stories completadas.
• No quedaron features a medio implementar.
• La aplicación es usable, coherente y estable al cierre.

🟢 UX y producto
• Se consolidó el patrón page → blade → comportamiento, que ahora se reutiliza.
• Mobile-first aplicado de forma consistente.
• Projects y Articles quedaron alineadas visual y conceptualmente.
• Decisiones de diseño tomadas con criterio, no por prueba/error.

🟢 Calidad técnica
• Eliminación efectiva de código muerto y placeholders.
• Refactors relevantes (state, exports, hooks, breakpoints).
• Mejora real en mantenibilidad, no solo cosmética.
• Se evitó el “refactor eterno”: se cerró la épica.

🟢 Trabajo del equipo
• Buena comunicación entre UX, desarrollo y QA.
• Capacidad de detectar bugs reales durante el desarrollo (ej. menú).
• Se respetó el cierre de historias sin “scope creep” infinito.

⸻

## 3. Qué no salió tan bien / aprendizajes (⚠️)

🟡 Mezcla de objetivos
• La épica mezcló:
• UX/features
• Refactor técnico
• Bug fixing
• Esto funcionó, pero:
• Dificultó el tracking.
• Generó confusión sobre prioridades en algunos momentos.

👉 Aprendizaje:

Las épicas híbridas son posibles, pero deben ser excepcionales y explícitas, no la norma.

⸻

🟡 Tests heredados
• Existían tests rotos previos a la épica.
• Durante el desarrollo:
• Algunos tests quedaron obsoletos por cambios legítimos de UI.
• Hubo ruido respecto a si fixearlos o no.

👉 Aprendizaje:

Tests que no reflejan la UI actual no son tests de calidad, son deuda.

Decisión correcta:
• Cerrar la épica con tests pasando.
• Postergar la auditoría profunda de testing a otra fase.

⸻

🟡 Falta de “foto final” hasta ahora
• Aunque el código quedó bien, faltaba una:
• Auditoría global post-épica
• Re-evaluación objetiva del estado del proyecto

👉 Aprendizaje:

Después de una épica grande, siempre conviene hacer una auditoría de estado antes de avanzar.

(Esto ya está en marcha 👍)

⸻

## 4. Decisiones correctas tomadas

    •	✅ No reabrir la épica para “pulir un poco más”.
    •	✅ No intentar arreglar todo de una vez.
    •	✅ Priorizar cierre, estabilidad y claridad.
    •	✅ Separar:
    •	Entrega (Epic 14)
    •	Análisis profundo (siguiente fase)

Esto demuestra madurez de proceso.

⸻

## 5. Qué NO hacer después de esta épica 🚫

    •	No meter nuevas features sin análisis previo.
    •	No seguir refactorizando “porque sí”.
    •	No tocar tests sin un criterio claro.
    •	No mezclar auditorías (code / security / performance) sin orden.

⸻

## 6. Próximo paso natural (➡️)

El paso correcto post–Épica 14 es:

Auditoría integral del estado actual del proyecto
(calidad, refactorización, tests, reutilización, arquitectura)

No para ejecutar inmediatamente, sino para:
• Decidir qué vale la pena hacer
• Definir próximas épicas reales
• Evitar refactors impulsivos

⸻

## 7. Cierre de la retro

Conclusión:
La Épica 14 fue exitosa, compleja y bien cerrada.
Dejó el proyecto en un estado mucho más sólido que al inicio, y habilita decisiones más estratégicas hacia adelante.

👉 No fue una épica “bonita”, fue una épica necesaria.

⸻
