---
id: 5-4-chat-panel-interaction-code-review
aliases: []
tags: []
---

Buenísimo el material que trajiste. Acá lo que necesitás no es “arreglar todo”, sino decidir bien. Te propongo ordenar esto como lo haría un equipo senior en una retro + planning.

⸻

1️⃣ Clasifiquemos los issues (clave antes de actuar)

Voy a agrupar lo que aparece en 3 categorías claras:

⸻

🔴 A. Issues que SÍ hay que fixear ahora (blockers / correctness)

Estos no son opcionales: 1. WhatsApp no funcional / iconMapping
• El botón aparece pero:
• el icono no está mapeado
• hay warnings constantes
• el CTA puede no funcionar como se espera
• Esto rompe el propósito de la épica “Contacto Fácil”.
👉 Acción:
• Fix ahora
• O eliminar el CTA hasta tener implementación correcta
• Pero no dejarlo “a medias” 2. Copy to clipboard que anima pero NO copia
• UX engañosa: feedback visual sin efecto real.
• Esto es peor que no tener feature.
👉 Acción:
• O implementar navigator.clipboard.writeText
• O revertir la animación + dejarlo explícitamente fuera de scope

📌 Regla:

Si el usuario cree que algo funciona y no funciona → se arregla ahora.

⸻

🟡 B. Issues que NO rompen contrato, pero generan ruido

Estos no bloquean, pero hay que registrarlos: 1. Warnings de preload no usado 2. Warnings de iconos faltantes 3. Errores visuales menores de alineación 4. Animación del timeline no “perfecta” (progresivo vs completo)

👉 Acción:
• NO fix ahora
• Crear tech-debt / follow-up story
• Documentarlo en la retro

📌 Acá tu intuición fue correcta:

“No sé si esto es break o deuda técnica”
👉 Es deuda técnica + UX polish, no contrato funcional.

⸻

🟢 C. Issues explícitamente fuera de scope

Estos no se tocan ahora: 1. Refinar micro-interacciones (hover, iconos más lindos) 2. Cambiar copy (“Show details”, “Hide details”, etc.) 3. Cambios estéticos sin criterio definido en la story

👉 Acción:
• Backlog / ideas
• No gastar foco ahora

⸻

2️⃣ Qué hacer concretamente ahora (pasos claros)

Paso 1 — Fix mínimos obligatorios

✔ WhatsApp CTA funcional
✔ Copy to clipboard real o revertido

👉 En la misma story, porque:
• están dentro del mismo dominio
• el usuario los toca juntos

⸻

Paso 2 — NO tocar el resto

Nada de “ya que estoy…”
Nada de “me tienta agregar tests”

Eso se anota, no se hace.

⸻

Paso 3 — Documentar como un pro (esto suma muchísimo)

En la retro, algo así:
• Identificamos diferencias entre feedback visual y comportamiento real (clipboard)
• Detectamos CTAs parcialmente implementados (WhatsApp)
• Decidimos priorizar corrección funcional sobre polish visual
• Registramos deuda técnica para animaciones y preload warnings
• Validamos manualmente todos los flows de contacto

Eso es lenguaje de senior, no de “coder”.

⸻

3️⃣ ¿Esto se valida manualmente? → Sí, y así

Checklist manual mínima (guardala):
• Click en WhatsApp abre chat real
• Click en email copia al clipboard (pegable)
• Chat modal abre, completa y envía
• No hay errores rojos en consola (warnings amarillos tolerados)
• UX no promete algo que no hace

Si pasa eso → story DONE.

⸻

4️⃣ Resumen corto (para decidir rápido)

Tipo ¿Fix ahora? Acción
WhatsApp roto ✅ Sí Fix
Clipboard fake ✅ Sí Fix o revert
Animaciones imperfectas ❌ No Deuda
Warnings preload/iconos ❌ No Deuda
Estética/copy ❌ No Backlog

⸻

5️⃣ Mi recomendación directa (sin vueltas)

👉 Fixeá solo los dos funcionales
👉 Documentá el resto
👉 Cerrá la story con confianza

Estás tomando decisiones de producto, no solo técnicas.
Eso es exactamente lo que querés mostrar cuando digas “yo lideré este proceso”.

Si querés, en el próximo mensaje:
• te ayudo a redactar la retro final
• o a decidir si esto va como 1 commit o 2 commits atómicos
