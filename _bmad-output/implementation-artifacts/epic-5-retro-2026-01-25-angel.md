---
id: epic-5-retro-2026-01-25-angel
aliases: []
tags: []
---

Buenísimo nivel de retro 👏
Lo que ya tenés es muy sólido. Lo que yo aportaría no es más volumen, sino dos o tres capas de “criterio humano” que hoy están implícitas pero no explícitas. Eso es lo que diferencia una retro “correcta” de una retro de lead/senior.

Voy a decirte qué sumar, dónde, y por qué vale la pena. No reescribo todo, solo agrego valor.

⸻

1️⃣ Falta una sección explícita de “Qué NO hicimos (y por qué)”

Esto es clave. Hoy se entiende leyendo entre líneas, pero conviene dejarlo explícito.

📍 Dónde agregarlo:
Después de 🧭 Decisiones de Alcance y Cierre

✍️ Sección sugerida (copy-pasteable)

## 🚫 Qué NO se hizo (decisiones conscientes)

Durante Epic 5 se detectaron múltiples oportunidades de mejora que **no se abordaron intencionalmente** para preservar foco y trazabilidad:

- No se implementaron refactors estructurales profundos durante stories funcionales.
- No se agregaron tests de integración E2E fuera del scope explícito del epic.
- No se resolvieron todos los MEDIUM/LOW detectados en code review.
- No se optimizaron micro-interacciones visuales sin impacto funcional.

**Racional:**
Estas decisiones permitieron cerrar historias cuando el contrato funcional y de accesibilidad estaba cumplido, evitando scope creep y manteniendo un ritmo predecible de entrega.

👉 Esto blinda cualquier crítica futura tipo “¿por qué no arreglaron X?”.

⸻

2️⃣ Falta una sección de “Riesgos detectados y mitigados”

Esto es muy valorado en contextos reales.

📍 Dónde:
Después de 🧠 Lecciones Aprendidas

✍️ Sección sugerida

## ⚠️ Riesgos Identificados y Mitigación

| Riesgo                            | Momento         | Mitigación                                      |
| --------------------------------- | --------------- | ----------------------------------------------- |
| Scope creep por UX polish         | Stories 5.2–5.5 | Separación explícita de stories (5.5 Clipboard) |
| Migración TS rompiendo UX         | WhatsApp / Chat | TDD + validación manual                         |
| Tests que pasan sin validar       | Calendly / Chat | Identificación y backlog de deuda               |
| UX engañosa (feedback sin efecto) | Clipboard       | Nueva story dedicada                            |

**Resultado:**
Ningún riesgo se materializó como bug en producción o blocker del epic.

👉 Esto demuestra pensamiento preventivo, no reactivo.

⸻

3️⃣ Falta una Conclusión Ejecutiva corta (para stakeholders)

Tu retro es muy técnica (bien), pero conviene cerrar con un summary no técnico.

📍 Dónde:
Justo antes de Próximo Epic

✍️ Sección sugerida

## 🧾 Conclusión Ejecutiva

Epic 5 consolidó un sistema de contacto funcional, accesible y tipado, validando que el enfoque de TDD estricto y disciplina de alcance permite avanzar sin comprometer calidad.

El mayor valor del epic no fue solo la implementación de features, sino la consolidación de un proceso repetible para:

- Migraciones incrementales
- Gestión consciente de deuda técnica
- Cierre confiable de historias complejas

El equipo queda en una posición sólida para abordar Epic 6, enfocado en infraestructura y sostenibilidad.

👉 Esto es oro puro si alguien más lee el repo.

⸻

4️⃣ Micro-ajuste de tono (opcional pero recomendable)

Hay una frase que podrías elevar un poco más:

“Code review adversarial identificó y documentó issues…”

Podés reforzarla así:

“El enfoque de code review adversarial permitió detectar issues reales antes de que llegaran a producción, reforzando la calidad sin frenar la entrega.”

Es sutil, pero suena más lead-like.

⸻

5️⃣ Qué NO agregaría (importante)

❌ Más métricas
❌ Más tablas
❌ Más issues listados
❌ Más detalle por story

Eso ya está perfecto.

⸻

🧠 Resumen final (respuesta corta a tu pregunta)

👉 A la retro le aportamos:
• Decisiones explícitas sobre lo que no se hizo
• Riesgos identificados y mitigados
• Un cierre ejecutivo no técnico
• Un poco más de “criterio humano” visible

Con eso, esta retro:
• sirve para vos
• sirve para un equipo
• sirve para entrevista
• sirve para auditoría futura

Si querés, en el próximo mensaje puedo:
• ayudarte a condensarla en 1 página “portfolio-ready”
• o extraer 5 bullets exactos para CV / LinkedIn
• o revisar si conviene mover algo a Epic 6 como Story 0

Vos decidís.
