---
id: epic-12-ux-behavior
aliases: []
tags: []
---

UX Behavior Specification

Header, Home & About — Mobile First

Proyecto: Portfolio Frontend (Next.js)
Autor: Angel DevStack
Fecha: 2026-01-27
Estado: Draft inicial (post Epic 11)

⸻

1. Propósito del Documento

Este documento define el comportamiento esperado de UX para:
• Header / Navegación
• Página Home
• Página About

El foco está en mobile-first, priorizando reglas de comportamiento antes que detalles visuales finos.

Este documento no reemplaza diseño UI, sino que establece el contrato funcional y de interacción sobre el cual se construirá Epic 12.

⸻

2. Principios Generales
   • Mobile First: los comportamientos se definen desde el viewport más pequeño hacia arriba.
   • Un solo patrón de navegación coherente en todo el sitio.
   • Los breakpoints definen qué elementos existen, no solo cómo se acomodan.
   • El menú hamburguesa es un estado transitorio, no permanente.
   • Cada “blade” (sección principal) debe tener intención clara y ocupar el viewport cuando sea posible.

⸻

3. Header — Comportamiento Global

3.1 Breakpoints Funcionales

Viewport aproximado Comportamiento esperado
≤ 840px Menú hamburguesa activo

> 840px Navegación completa visible
> ≥ Desktop Navegación + redes + auth

⚠️ El breakpoint actual (~1440px) es demasiado grande y debe reducirse.

⸻

3.2 Header — Estado Mobile (XS ~350px)

Header cerrado
• Izquierda: ícono de menú hamburguesa
• Centro: logo
• Derecha: botón Hire Me (mejor alineado verticalmente)

Hover / interacción
• Logo: transición de color
• Hire Me: color inverso (light ↔ dark)
• Menú: sin efecto visual obligatorio

⸻

Header abierto (menú desplegado)
• El menú ocupa un blade completo
• Contenido del menú:
• Navegación: Home, About, Projects, Articles
• Redes sociales: LinkedIn, GitHub, WhatsApp, Twitter, Dribbble, Telegram
• Fila separada para autenticación:
• Google
• Microsoft
• LinkedIn
• El botón de cerrar debe ser visible sin overflow
• Íconos deben tener contraste correcto según tema
• Subrayados:
• Item activo (selected) visible
• Hover con animación desde el centro hacia los lados

Comportamiento
• Al hacer click en cualquier item de navegación:
• Se navega a la sección
• El menú se cierra automáticamente

⸻

3.3 Header — Estado Desktop (> 840px)
• El menú hamburguesa desaparece
• Se muestran directamente:
• Navegación principal
• Barra de redes sociales
• Acciones de autenticación (si hay espacio suficiente)
• El menú flotante solo existe si el viewport lo justifica

⸻

4. Página Home — Comportamiento

4.1 Blade 1 — Hero

Debe contener exclusivamente:
• Header
• Imagen hero (centrada)
• Título principal
• Descripción
• Botones de acción:
• Resume
• Contact
(idealmente 50% / 50% en mobile)

No debe incluir
• Carruseles
• Footer
• Contenido secundario

⸻

4.2 Blade 2 — Contenido Secundario
• Carrusel de customers / logos
• Footer completo:
• Copyright
• Autor
• Métodos de contacto

El scroll debe sentirse como un cambio de blade, no como contenido cortado a la mitad.

⸻

5. Página About — Comportamiento

5.1 Biography
• Imagen
• Texto descriptivo
• El componente Stats:
• No debe romper el primer blade
• Si falla la carga, debe degradar visualmente
• No mostrar texto suelto tipo “Unable to load stats” sin contexto

⸻

5.2 Skills
• Botones:
• 1 año
• 3 años
• 5 años
• Training
• Roadmap

Interacción
• Al seleccionar un botón:
• El botón queda activo por color
• Los elementos visuales (galaxia / espiral) se iluminan en sincronía
• El estado activo debe ser claro y persistente

⸻

5.3 Experiences
• La estructura general es correcta
• El texto “Show details” resulta ruidoso
• Alternativas válidas:
• Ícono contextual
• Menú de tres puntos
• Interacción sobre el nodo / marcador
• Debe mantener coherencia visual con Education

⸻

5.4 Education
• Sigue el patrón visual de Experiences
• Ocupa menos blades
• No introduce nuevos patrones de interacción

⸻

6. Footer — Comportamiento Global
   • Comportamiento consistente en todas las páginas
   • El botón Hire Me:
   • Hover con color inverso
   • No debe aparecer duplicado
   • No debe romper la narrativa visual del cierre

⸻

7. Alcance y No-Alcance

Dentro del alcance
• Definición de comportamiento
• Breakpoints funcionales
• Interacciones esperadas
• Estados de navegación

Fuera del alcance
• Ajustes finos de tipografía
• Decisiones estéticas finales
• Diseño visual pixel-perfect

⸻

8. Resultado Esperado
   • Un header predecible, estable y coherente
   • Navegación clara en todos los tamaños
   • Home y About con narrativa visual clara por blades
   • Base sólida para diseño UI sin re-trabajo estructural

⸻

9. Relación con Epic 12

Este documento es el input principal para:

Epic 12 — Header UX & Visual Behavior (Mobile First)

⸻
