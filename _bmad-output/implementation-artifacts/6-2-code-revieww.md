---
id: 6-2-code-revieww
aliases: []
tags: []
---

Buen cierre de ciclo este 👍.
Mi opinión, alineada con todo lo que ya definiste en Epic 5 y estás aplicando en Epic 6, es bastante clara:

⸻

TL;DR (la decisión correcta)

👉 Sí, hay que fixear cosas.
👉 Pero NO todo.
👉 Fixeamos: 1 HIGH + 1 MEDIUM que lo acompaña.
👉 El resto: backlog explícito, bien documentado.

Y esto no es tibieza, es disciplina de alcance bien ejecutada.

⸻

Desglose concreto del code review (qué sí / qué no)

🔴 HIGH – Se fija sí o sí

H1: fetchById / fetchBySlug bypass de filtros
• Viola directamente AC2
• Permite acceder a drafts/future articles si conocés el slug
• Es un bug funcional, no cosmético
• Impacto real en producción

👉 Este se fija obligatoriamente.
Si no se arregla, la story no debería cerrarse.

⸻

🟡 MEDIUM – Se fija solo el que está acoplado al HIGH

M1: Falta test para acceso directo a draft/future
• Está directamente relacionado con H1
• Es el test que protege el fix
• Es TDD “by the book”: bug → test → fix

👉 Este se fija junto con H1, en el mismo commit o secuencia.

⸻

Qué NO fijamos ahora (y por qué)

🟡 MEDIUM que van a backlog

M2: Validación URL vs slug
• No rompe ningún AC
• No es regresión
• Es mejora de consistencia, no bug

👉 Backlog claro, sin tocar ahora.

⸻

🟢 LOW (documentar y seguir)

L1: console.log en test
• Feo, pero no rompe nada
• Ya cumple su función de validación humana
• Se puede limpiar en una story de test hygiene

L2: Checklist “manual” no literal
• El espíritu del check se cumplió vía tests
• Solo requiere aclaración, no refactor

👉 Ambos solo documentar.

⸻

Resumen tipo tabla (para cerrar discusión)

Severidad Issue Decisión
HIGH fetchById / fetchBySlug bypass ✅ FIX
MEDIUM Falta test para draft access ✅ FIX
MEDIUM URL vs slug consistency 📝 Backlog
LOW console.log en test 📝 Backlog
LOW Checklist wording 📝 Backlog

⸻

Qué le respondería al reviewer / agente (copy-paste)

Agree that fixes are needed.

Please fix:

- HIGH: fetchById / fetchBySlug must respect published filtering (AC2)
- MEDIUM: add test coverage for direct access to draft/future articles

Do NOT fix the remaining MEDIUM/LOW items now.
Document them clearly as backlog items with rationale.

Goal: close the story compliant with ACs while keeping scope tight.

⸻
