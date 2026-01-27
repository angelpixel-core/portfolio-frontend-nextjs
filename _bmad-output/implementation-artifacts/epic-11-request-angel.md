---
id: epic-11-request-angel
aliases: []
tags: []
---

⸻

2️⃣ Lo que detecté:

Es una señal de diseño incompleto

Lo que describís del navbar que:
• desaparece en ~1250px
• oculta grupos completos (nav, auth, social, theme)
• deja estados “intermedios raros”
• hace que TanStack quede colgado visualmente en ciertos breakpoints

👉 No es un issue puntual
👉 Es un problema de definición de reglas de responsive layout

Y esto es CLAVE:
👉 No se arregla bien con fixes sueltos
👉 Se arregla bien con una épica de diseño + layout system

⸻

3️⃣ Qué tipo de épica corresponde ahora (BMAD-wise)

No es:
• ❌ “Fix navbar bug”
• ❌ “Navbar disappears on wide screens”

Es:

🧠 Definición explícita del sistema de layout y responsive rules

Yo lo formularía así (conceptualmente):

🔹 Epic 11 – Responsive Header & Navigation System

Objetivo

Definir, documentar e implementar un sistema coherente de layout responsivo para el header, incluyendo navegación, identidad, acciones y estados de transición.

⸻

4️⃣ Qué debería incluir esta épica (alto nivel)

A. Definición de breakpoints (primero, no código)

Algo como:
• Mobile (≤640)
• Tablet (641–1024)
• Desktop (1025–1440)
• Wide (≥1441)

👉 Esto no es Tailwind default, es design intent.

⸻

B. Definición de “zonas” del header (clave)

Vos ya lo pensaste muy bien, solo hay que formalizarlo: 1. Brand zone
• Logo (centro visual) 2. Primary navigation
• Home / About / Projects / Articles 3. Social / Contact
• WhatsApp, Telegram, Twitter, LinkedIn, etc. 4. Auth actions
• Google / Microsoft / LinkedIn 5. UI controls
• Theme switcher 6. Floating CTA
• “Hire me” (no responde a breakpoints normales)

👉 Cada zona decide si se muestra, colapsa o se agrupa según breakpoint.

⸻

C. Reglas claras de colapso (esto hoy falta)

Ejemplo (solo ilustrativo):

Breakpoint Nav Social Auth Theme Burger
Mobile ❌ ❌ ❌ ❌ ✅
Tablet ❌ ❌ ❌ ✅ ✅
Desktop ✅ ❌ ❌ ✅ ❌
Wide ✅ ✅ ✅ ✅ ❌

Esto evita estados fantasmas como los que estás viendo.

⸻

D. Tests que validen layout (clave BMAD)

Acá entra Playwright fuerte:
• viewport-based tests
• screenshots por breakpoint
• asserts de visibilidad (toBeVisible / toBeHidden)
• no lógica, estructura

Esto convierte UX en regla verificable, no subjetiva.

⸻

5️⃣ Qué haría ahora mismo con BMAD (concreto)

Paso 1 – Nueva épica

Nombre sugerido:

Responsive Header & Navigation System

⸻

Paso 2 – Scope bien acotado

Muy importante dejar claro:
• ❌ No nuevas features
• ❌ No rediseño visual profundo
• ✅ Solo reglas, consistencia y estados
• ✅ Tests de layout

Esto evita que se vuelva una “épica infinita”.

⸻

Paso 3 – Historias típicas dentro de la épica

Ejemplos de stories que BMAD puede generar bien:
• Definir breakpoints oficiales del proyecto
• Mapear zonas del header
• Implementar reglas de visibilidad
• Refactor del header layout
• Tests Playwright por viewport
• Documentación del layout system

⸻

6️⃣ Sobre TanStack “colgado” en wide screens

Eso probablemente sea efecto secundario, no causa raíz.

Posibles motivos:
• contenedor con overflow-hidden
• height mal calculado
• breakpoint que oculta wrapper pero no desmonta componente
• devtools overlay afectado por layout

👉 No lo ataquen ahora
👉 Va a caer solo cuando el layout esté bien definido

⸻
