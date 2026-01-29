---
id: spec
aliases: []
tags:
  - curated
---

Excelente. Con todo lo que validamos y con tu ok explícito sobre el enfoque, el orden y el guión, ya estamos en condiciones de consolidar todo en un único documento canónico.

Abajo te dejo el documento final unificado, listo para persistir como
👉 ui-ux-behavior.md (o ui-motion-spec.md si querés un nombre aún más técnico).

No es un resumen:
es la fuente de verdad para diseño, frontend, animaciones y QA.

⸻

UI & Motion Specification

Documento de referencia única para el comportamiento visual, de interacción y de motion del sitio.

Este documento define reglas duras, sistemas de transición, estructura de páginas y criterios de animación, evitando ambigüedades y decisiones ad-hoc durante la implementación.

⸻

0. System Rules (Fundación)

0.1 Layout & Breakpoints
• Min viewport width (regla dura): 376px
El layout no puede comprimirse por debajo de este ancho.
• Se evita overflow horizontal
• Se evitan componentes rígidos que rompan el layout
• Mobile layout: 376px → 600 / 640px
• Desktop layout: ≥ 1024px
• No existen layouts tablet dedicados
• Entre 640px y 1024px el layout es desktop más compacto
• Max content width: 1024px
• Header, footer y blades no se estiran infinitamente
• El contenido se mantiene centrado

⸻

0.2 Scroll Rules
• Mobile
• Comportamiento tipo reel / flick / blade
• Los blades intentan ocupar 100vh
• No deben quedar cards cortadas al finalizar un blade
• Desktop
• Scroll libre
• ❌ No snap automático
• Durante el scroll pueden verse elementos parciales
• Al finalizar un blade, el orden visual debe recomponerse

Estas reglas definen todo el comportamiento posterior.

⸻

1. Page Transition System (El corazón del proyecto)

1.1 Alcance

El sistema de transición se aplica a:
• Navegación por menú
• Links principales
• Click en el logo (Home)

No se aplica a:
• Interacciones internas
• Hover states
• Animaciones locales de componentes

Durante la transición:
• Se bloquea toda interacción (click, hover, scroll, focus)

⸻

1.2 Capas (Cortinas)

El sistema está compuesto por tres capas: 1. Cortina principal (rosada) 2. Extensión blanca 3. Extensión negra

Reglas:
• Las extensiones solo aparecen en la retirada
• Nunca aparecen durante la ida
• Cubren:
• Contenido
• Header
• Todo el viewport
• Posición: fixed, z-top

⸻

1.3 Secuencia

Fase 1 — Entrada (Left → Right)
• La cortina rosada avanza de 0% → 100%
• Oculta completamente la página anterior
• Al llegar a 100%:
• Breve pausa
• Se monta la nueva página por detrás

Fase 2 — Retirada (Right → Left)
• La cortina rosada se retira
• Aparecen en cascada:
• Extensión blanca
• Extensión negra
• Nunca se ven completas al mismo tiempo

⸻

1.4 Regla crítica de sincronización

La transición real ocurre cuando la extensión negra cruza el 50% del viewport

Ese evento dispara:
• Montaje efectivo de la nueva page
• Inicio de animaciones visibles
• Inicio de requests (React Query)

⚠️ Nada animado se dispara antes de ese punto.

⸻

1.5 Animación del título
• Slide desde abajo hacia arriba
• Opacidad 0 → 1
• Color dependiente del theme (dark / light)
• Trigger:
• Cuando la extensión negra cruza el 50%

⸻

2. Global Components

2.1 Header

Desktop
• Navegación
• Logo centrado
• Social links
• Theme switcher
• Auth button

Mobile
• Hamburger (izquierda)
• Logo (centro)
• Hire Me (derecha superior)

⸻

2.2 Social Links & Theme
• Light theme
• Íconos en color
• Sin borde
• Dark theme
• Íconos en color
• Borde sutil de contraste
• Forma consistente:
• Círculo (general)
• Cuadrado redondeado (LinkedIn)
• Paridad de tamaño visual

⸻

2.3 Auth Button

Sin sesión
• Ícono neutro
• Click → modal
• Sign In + Social login
• Link a Sign Up (slide horizontal)

Con sesión
• Botón iluminado (verde / celeste)
• Modal reutilizado con:
• Profile (console.log email)
• Settings (console.log email)
• Logout
• Logout:
• Limpia cliente
• Notifica backend

⸻

3. Pages

⸻

Home

Blade 1
• Header
• Hero
• Floating Hire Me
• Título con animación estándar

Blade 2
• Customer Slider
• Footer
• Distribución vertical
• Intenta ocupar viewport completo

Hire Me
• Fixed
• Cambia de esquina según viewport
• Texto circular rota siempre
• Hover: inversión de color, misma velocidad

⸻

About

❌ No Hire Me flotante

Blade 1
• Título
• Imagen
• Stats
• Desktop: fila
• Mobile: fila inferior

Stats
• Conteo 0 → N
• Trigger:
• Cuando la cortina negra cruza el 50%

Blade 2 — Biography
• Texto largo
• Sin animaciones intrusivas

Blade 3 — Skills
• Galaxia / espiral
• Trigger:
• Centro de la espiral llega al centro del viewport
• Íconos visibles desde inicio
• Filtros:
• Seniority / años
• Combinables (OR)
• Hover futuro:
• Tooltip mínimo
• Tags de tipo de proyecto

Blade 4 — Experience
• Timeline vertical
• Scroll-driven animation: 1. Se llena tramo 2. Se completa nodo 3. Recién entonces continúa el scroll

Blade 5 — Education
• Mismo patrón que Experience

Blade Final
• Footer + Hire Me integrado
• Hire Me solo visible al llegar al final

⸻

Projects

Reglas duras
• Máx 6 proyectos
• Sin paginación
• Sin scroll infinito
• Layout preparado para crecer

Featured
• Ocupa blade completo
• Mobile y desktop
• Jerarquía visual

Non-featured
• Mobile:
• 2 por blade (arriba / abajo)
• Desktop:
• Grid libre
• Sin animación de entrada
• Hover:
• Zoom suave en imagen

Scroll:
• Mobile: ordenado por blade
• Desktop: libre, sin snap

⸻

Articles

Blade 1 — Featured Articles
• Título
• Mobile:
• 1 featured completo
• Desktop:
• Se intenta mostrar 2 completos
• Corte leve aceptable

Blade 2 — All Articles
• Trigger:
• Título llega al 50% del viewport
• Aparición secuencial:
• Uno por tramo de scroll
• No batch

Hover Effect
• Solo sobre el texto
• Thumbnail sigue el mouse
• Con delay y offset
• Mobile:
• Sin persecución compleja
• Box simple

Footer
• Puede convivir con últimos artículos
• Nunca compite visualmente

⸻

4. Animations Matrix

Elemento Trigger Tipo Mobile Desktop
Page Title Cortina 50% Slide + Fade ✔ ✔
Stats Cortina 50% Count up ✔ ✔
Skills Centro viewport Radial ✔ ✔
Experience Scroll local Fill ✔ ✔
Projects hover Hover Zoom ✔ ✔
Articles hover Hover texto Follow thumbnail Limitado Completo

⸻

Estado final

✔ Documento coherente
✔ Sin contradicciones
✔ Implementable
✔ Escalable
✔ QA-friendly

Cuando quieras, el próximo paso puede ser:
• convertir esto en checklist de implementación
• o bajar una page concreta a acceptance criteria técnicos

Vos decís.
