---
id: epic-10-retro-2026-01-27-angel
aliases: []
tags: []
---

⸻

🧠 Aportes clave para la retrospectiva (Epic 10)

1️⃣ Qué hicimos bien (y conviene institucionalizar)

Higiene técnica como criterio de cierre
• Se validó build limpio, tests verdes y runtime estable antes de cerrar.
• Se consolidó una rama base confiable, aunque no “feature-complete”.
👉 Esto no siempre se hace y es una fortaleza del equipo.

📌 Aprendizaje:

No se avanza rápido sobre código sucio; se avanza seguro sobre código limpio.

⸻

2️⃣ Distinción importante aprendida (alto valor)

No todo lo rojo en consola es deuda técnica
• Identificamos correctamente ruido externo (extensiones tipo SES / MetaMask).
• Evitamos “fixes falsos” o hacks innecesarios.
• Se definió un criterio objetivo de validación: navegador limpio / sin extensiones.

📌 Aprendizaje:

El contexto de ejecución importa tanto como el código.

⸻

3️⃣ Buen uso del método (confirmación)

Épicas de hardening separadas de features
• Epic 10 fue 100% runtime / UX polish.
• Cero mezcla con lógica de negocio.
• TDD aplicado incluso en fixes chicos.

📌 Aprendizaje:

Separar épicas por naturaleza reduce fricción y acelera cierre real.

⸻

4️⃣ Qué podemos mejorar (sin culpa)

Documentación mínima preventiva
• Apareció una duda legítima sobre “errores en rojo”.
• No era deuda, pero generó incertidumbre.

📌 Action item liviano:
• Nota corta en README / docs técnicas:
“Algunos warnings pueden provenir de extensiones del navegador (SES, wallets). Validar siempre en navegador limpio.”

⸻

5️⃣ Decisión madura tomada (esto vale oro)

Cerrar sin “overengineering”
• No se intentó arreglar lo que no es del sistema.
• Se evitó alargar la épica artificialmente.
• Se priorizó estabilidad real vs. perfección aparente.

📌 Aprendizaje:

Saber cuándo parar también es ingeniería.

⸻
