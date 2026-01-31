---
id: 01-blades-and-breakpoints
aliases: []
tags: []
---

# 📐 Home Layout Rules – Blades & Breakpoints

Scope: Home page only
Implementation: Tailwind (existing system)
Status: Final – approved

⸻

0. Conceptos base (obligatorios)

Blade

Un Blade es una unidad conceptual vertical de layout.
• Normalmente ocupa el alto completo del viewport
• Excepción explícita: mobile-1
• El footer NO es un blade por defecto
• Si el footer (o cualquier sección) ocupa ≥ 60–70% del viewport → se considera blade

Regla global de Footer

En todos los breakpoints, salvo donde se indique lo contrario,
la línea superior del footer debe coincidir exactamente con el final del último blade visible.

⸻

1. Breakpoints oficiales (por ancho)

| Name     | Min Width | Reference Device        | Blade Height Reference |
| -------- | --------- | ----------------------- | ---------------------- |
| mobile-3 | 76px      | iPhone 15               | Altura real iPhone     |
| mid-1    | 680px     | Mobile grande / phablet | ~80–85vh conceptual    |
| mid-2    | 768px     | iPad (portrait)         | Altura iPad            |
| desk-1   | 940px     | Desktop reducido        | 820px (Mac ref)        |
| desk-2   | 1024px+   | Desktop estándar        | 820px (Mac ref)        |

⚠️ Nunca se fuerza la altura del viewport real del navegador
El diseño asume estas alturas como referencia conceptual de Blade.

⸻

2. mobile-1 (≥ 376px)

⚠️ Excepción explícita a la regla del Blade completo

Blade 1 – Home principal
Orden vertical estricto: 1. Header
• Menu hamburguesa
• Logo
• Hire Me button
• Siempre circular
• Texto circular + animación
• Flotante
• Persigue el scroll
• ❌ Solo existe en Home 2. Hero image 3. Título (apilado) 4. Descripción (apilada) 5. CTA
• Resume
• Contact
• Apilados
• Full width

Blade 2 – Secundario (no completo)
• Customer slider
• Footer (apilado)
• Altura:
• Slider NO debe superar ~30–40%
• Footer ocupa lo que necesite
• No coincide con el viewport completo

📌 En mobile-1 NO se fuerza que el footer coincida con el final del viewport.

⸻

3. mid-1 (≥ 680px)

Transición estructural

Cambios:
• Título pasa a una sola línea
• CTA:
• Resume / Contact en fila
• 50% / 50%
• Customer slider:
• Se incluye dentro del primer blade

Resultado:
• Todo el contenido cabe en un solo blade
• 👉 El top del footer coincide con el final del blade

Altura conceptual del blade:
• ~80–85vh
• Referencia: mobile grande / phablet

⸻

4. mid-2 (≥ 768px)

Layout split (tablet)

Estructura:
• Hero → 50% izquierda
• Contenido → 50% derecha
• Título (apilado)
• Descripción (apilada)

Debajo:
• CTA (Resume / Contact)
• Fila completa
• 50 / 50
• Customer slider

Reglas:
• El blade ocupa el viewport conceptual completo
• Footer comienza exactamente al final del blade

Altura:
• Referencia directa: iPad portrait

⸻

5. desk-1 (≥ 940px)

Desktop reducido

Cambios:
• Se expande el ancho del título
• Se expande la descripción
• Hero mantiene 50%
• CTA:
• Fila completa
• Botones crecen levemente
• Customer slider visible

Altura conceptual:
• 820px (Mac reference)

📌 No se introducen cambios estructurales nuevos
Solo escalado proporcional dentro del blade

⸻

6. desk-2 (≥ 1024px)

Desktop estable (forma final)

Cambios:
• CTA:
• Ya no ocupan todo el ancho
• Se alinean hacia la izquierda dentro del 50% del contenido
• El tamaño de botones:
• Puede crecer respecto a desk-1
• No se agregan nuevos layouts

Altura:
• Se mantiene 820px como referencia
• Cambios son principalmente:
• Redistribución
• Reducción / expansión de espacios vacíos
• Sin romper jerarquía

⸻

7. Reglas de crecimiento de componentes
   • Los componentes crecen en relación al Blade, no al viewport absoluto
   • El escalado sigue:
   • primero altura
   • luego ancho disponible
   • CTA:
   • Mobile → full width
   • Mid → fila 50/50
   • Desk → crecen y luego se relajan a la izquierda

⸻

8. Scroll y autoscroll
   • ❌ No se fuerza scroll automático
   • El usuario siempre puede scrollear libremente
   • Opcional (futuro):
   • Si el viewport cumple min-height del blade
   • Se puede habilitar autoscroll por blade

⸻

9. Implementación (para el agente)
   • Usar exclusivamente Tailwind
   • Respetar el sistema existente
   • Aplicar reglas con:
   • min-h-[vh] conceptuales
   • flex, grid, order
   • Sin JS para layout (salvo animaciones existentes)

⸻

10. Estado

✅ Reglas cerradas
✅ Sin contradicciones
✅ Listas para DX / UX
✅ Listas para convertir en tokens o constantes

⸻
