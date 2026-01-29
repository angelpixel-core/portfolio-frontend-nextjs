---
id: spec
aliases: []
tags: []
---

# Motion & Page Transitions

Objetivo

Definir el comportamiento visual y temporal de las transiciones entre páginas del sitio, de forma consistente en mobile y desktop, asegurando una experiencia cinematográfica, fluida y sin interferencias de interacción durante el cambio de contexto.

⸻

Alcance

Este sistema de transición se aplica a todo cambio real de página, incluyendo:
• Navegación desde el menú (hamburguesa o barra)
• Navegación desde links principales (Home, About, Projects, Articles)
• Click en el logo (navegación a Home)

No se aplica a:
• Interacciones internas dentro de una misma página
• Hover states
• Animaciones locales de componentes

⸻

Principios generales
• La transición cubre el 100% del viewport en todos los dispositivos.
• Se renderiza por encima de todo el contenido, incluyendo header y overlays.
• Durante la transición:
• Se bloquea toda interacción (clicks, hover, scroll, focus).
• No hay disoluciones (fade) en las cortinas:
las capas entran y salen por movimiento, no por transparencia.
• El efecto es cinematográfico, con easing suave no lineal (ajustable en implementación).

⸻

Capas de transición

El sistema está compuesto por tres capas visuales, que nunca aparecen completas al mismo tiempo: 1. Cortina principal (tono rosado) 2. Extensión blanca 3. Extensión negra

Las extensiones blanca y negra solo existen durante la retirada de la cortina principal.

⸻

Secuencia de transición

Fase 1 — Entrada (Left → Right)
• La cortina rosada se desplaza desde la izquierda hacia la derecha.
• Su ancho progresa de 0% → 100%, cubriendo completamente la pantalla.
• Mientras avanza:
• El contenido de la página anterior queda oculto.
• Al alcanzar el 100% del ancho:
• Se produce una breve pausa visual.
• Comienza el montaje de la nueva página por detrás de la cortina.

⸻

Fase 2 — Retirada con extensiones (Right → Left)
• La cortina rosada comienza a retirarse desde la derecha hacia la izquierda.
• Durante esta retirada:
• Aparece una extensión blanca inmediatamente detrás de la cortina rosada.
• A continuación, aparece una extensión negra detrás de la blanca.
• Importante:
• La extensión blanca y la negra no aparecen durante la entrada.
• Solo existen durante la retirada de la cortina rosada.
• Las capas se perciben en cascada, no superpuestas completamente.

⸻

Fase 3 — Revelado y animación de título
• Cuando el borde derecho de la cortina negra alcanza aproximadamente el 50% del viewport:
• Comienza la animación de entrada del título de la nueva página.
• El título:
• Se anima desde abajo hacia arriba.
• Aplica un efecto de opacity 0 → 1.
• El color se adapta al tema activo (dark / light).
• El resto del contenido:
• Ya está montado en el DOM,
• pero no inicia animaciones visibles hasta que la cortina negra avanza más.

⸻

Animación del título (Title Entrance)
• El título no aparece simultáneamente con la cortina.
• Su animación está pensada para:
• Maximizar contraste visual
• Evitar solapamiento perceptual con la transición
• El efecto combina:
• Movimiento vertical (bottom → final position)
• Aparición progresiva por opacidad
• La duración es cinematográfica y ajustable.

⸻

Fase 4 — Salida completa
• Las capas se retiran completamente hacia la izquierda:
• Primero desaparece la cortina rosada
• Luego la extensión blanca
• Finalmente la extensión negra
• No se aplica fade-out.
• Al finalizar:
• La página queda totalmente visible
• Se reactivan las interacciones del usuario

⸻

Consideraciones responsive
• El comportamiento es idéntico en mobile y desktop.
• En mobile:
• La transición siempre ocupa el 100% del viewport.
• No se introducen variantes visuales adicionales fuera de las ya definidas en los diseños de referencia.

⸻

Notas de implementación (no normativas)
• El montaje de la nueva página comienza cuando la cortina rosada alcanza el 100% del ancho.
• Las animaciones visibles del contenido deben esperar hasta que exista espacio visual suficiente para percibirse correctamente.
• Los tiempos exactos y easing se ajustarán durante la implementación y revisión visual.

---

# Excelente, con esto ya está cerrada la sección Home a nivel UX/UI behavior.

No quedan ambigüedades fuertes y lo que definiste es consistente, implementable y testeable.

Abajo te dejo el bloque listo para persistir como sección del documento. Está escrito en tono especificación de comportamiento, no diseño visual, para que sirva tanto a dev como a QA.

⸻

UI / UX Behavior — Home

1. Viewport & Breakpoints

1.1 Ancho mínimo y máximo
• Ancho mínimo permitido: 375px
• El layout no debe comprimirse por debajo de este valor.
• Se evita overflow horizontal y componentes “rígidos” que rompan el layout.
• Mobile layout: desde 375px hasta ~640px
• Desktop layout: >= 640px
• No existen layouts “tablet” específicos.
• Entre 640px y resoluciones grandes el layout es desktop, pero puede verse más compacto.
• Ancho máximo visual (desktop):
• Header, footer y bloques principales no deben estirarse infinitamente.
• Se recomienda usar un max-width de referencia (ej. 1200–1400px) centrado.

⸻

2. Header (Home)

2.1 Desktop (>= 640px)

El header contiene, de izquierda a derecha: 1. Navegación principal (Home, About, Projects, Articles) 2. Logo centrado 3. Social links 4. Theme switcher 5. Botón de autenticación (ícono dentro de círculo)

Social Links
• Light theme
• Íconos en color
• Sin borde
• Dark theme
• Íconos en color
• Borde sutil de alto contraste
• La forma del borde respeta el ícono:
• Circular para la mayoría
• Cuadrado redondeado para LinkedIn
• Todos mantienen paridad de tamaño visual

⸻

2.2 Mobile (375px – 640px)

El header muestra:
• Hamburger menu (izquierda)
• Logo (centro)
• Floating Hire Me button (derecha superior)

⸻

3. Autenticación (Auth Button)

3.1 Estado sin sesión
• Botón circular con ícono neutro (gris)
• Click abre un modal flotante
• Modal contiene:
• Formulario de Sign In
• Email
• Password
• Botones de login social:
• Google
• Microsoft
• LinkedIn
• Link: “Don’t have an account? Sign up”

3.2 Transición Sign In / Sign Up
• Sin cambio de página
• El formulario se desliza horizontalmente
• Sign Up agrega:
• Name
• Password confirmation
• Animación: suave

3.3 Estado con sesión iniciada
• El botón:
• Permanece visible
• Cambia a color activo (verde / celeste)
• Click abre el mismo modal reutilizado, con menú:
• Profile
• Settings
• Logout

Comportamiento actual (stub funcional)
• Profile → console.log(email)
• Settings → console.log(email + " settings")
• Logout:
• Limpia sesión en cliente (cookies / storage)
• Dispara request al backend para cerrar sesión remota
• Botón vuelve a estado neutro

⸻

4. Hero Section (Blade 1)

4.1 Estructura
• Desktop
• Imagen a la izquierda
• Contenido textual a la derecha
• Mobile
• Imagen arriba
• Título
• Descripción
• Botones

4.2 Animaciones
• El título:
• Aparece desde abajo hacia arriba
• Fade-in progresivo
• Sincronizado con el final de la transición de página
• El resto de los elementos:
• Pueden tener animaciones propias
• No dependen de la animación del título
• La imagen:
• No anima
• Solo responde a reflow responsive

4.3 Data fetching
• Durante la transición de páginas:
• Se pueden disparar requests (React Query)
• Objetivo: minimizar percepción de skeletons

⸻

5. Acciones principales

5.1 Resume
• Botón completo (todo clickable)
• Hover:
• Inversión de colores
• Borde animado
• Click:
• Abre en nueva pestaña

5.2 Contact
• Texto “Contact” y ícono (Calendly):
• Targets independientes
• Mismo destino
• Hover:
• Cursor pointer solo sobre el texto
• Underline solo sobre la palabra “Contact”
• El ícono no subraya ni cambia color

⸻

6. Floating “Hire Me” Button

6.1 Posición
• Mobile: esquina superior derecha
• Desktop: esquina inferior izquierda
• Siempre visible
• Persigue la esquina correspondiente durante el scroll

6.2 Comportamiento
• Texto circular:
• Gira constantemente
• Hover:
• Inversión de colores
• La velocidad de rotación no cambia

⸻

7. Segundo Blade (Home)

7.1 Contenido

El Home tiene exactamente dos blades: 1. Blade 1: Hero + Header 2. Blade 2:
• Customers Slider (carrusel)
• Footer completo

7.2 Layout
• Customers Slider arriba
• Footer abajo
• Distribución vertical (justify-between)
• El blade intenta ocupar viewport completo cuando es posible

⸻

8. Mobile Menu (Hamburger)

8.1 Orden del contenido 1. Navegación (Home, About, Projects, Articles) 2. Social links (con borde homogéneo) 3. Theme switcher (fila propia) 4. Auth button (fila propia)

8.2 Interacciones
• Cambio Sign In / Sign Up:
• Slide horizontal
• Animación suave
• Cambio de theme:
• Afecta fondo del menú y del modal
• Iconografía se adapta automáticamente

---

# Excelente. Con tus respuestas ya no quedan ambigüedades funcionales.

A continuación te dejo la sección ABOUT completa, ya redactada y normalizada para pegarla tal cual en tu documento ui-ux-behavior.md.

No hago más preguntas en esta sección: queda cerrada.
Después de esto, si querés, seguimos con Projects.

⸻

About — UI / UX Behavior Specification

Overview

La página About comparte el layout global del sitio (Header + navegación + transiciones), pero introduce reglas específicas de comportamiento respecto a animaciones, blades, y componentes flotantes (Hire Me).

El objetivo de esta sección es presentar identidad, trayectoria y capacidades de forma narrativa, progresiva y controlada, priorizando la lectura y evitando ruido visual.

⸻

Global Layout & Responsive Rules
• Min viewport width: 376px
El viewport no debe poder reducirse por debajo de este ancho para evitar overflow, cortes de layout o deformaciones de componentes.
• Mobile layout: desde 376px hasta ~640px
• Desktop layout: desde ~641px
• Max content width: 1024px
A partir de este ancho, el contenido no se estira, se mantiene centrado.
• Todos los blades intentan ocupar 100vh cuando el contenido lo permite.

⸻

Hire Me Button — About Exception Rule
• ❌ No existe Hire Me flotante en About (desktop ni mobile).
• ✅ El botón Hire Me solo aparece en el último blade, integrado junto al Footer.
• En mobile, el Hire Me del footer:
• No es fixed ni sticky
• Solo es visible al llegar al final de la página

⸻

Blade Structure (Final)

Blade 1 — Hero + Stats
• Header global
• Título principal con animación estándar (ver sección Transitions)
• Imagen principal
• Stats presentados en fila horizontal (no en columna)
• En mobile:
• Hero, imagen y stats se reordenan verticalmente
• Stats aparecen como fila inferior del blade

⸻

Blade 2 — Biography
• Texto largo, orientado a lectura
• Sin Hire Me
• Sin animaciones intrusivas
• Se prioriza legibilidad

⸻

Blade 3 — Skills (Galaxy / Spiral)

Visual Concept
• Fondo tipo espiral / galaxia
• Íconos inicialmente agrupados en el centro

Trigger de animación
• La animación se activa solo cuando el centro de la espiral alcanza el centro del viewport
• Antes de eso:
• Íconos ocultos o compactados
• Al activarse:
• Los íconos se despliegan desde el centro hacia el exterior

Íconos
• Representan tecnologías (con iconografía, no texto)
• Estado inicial: todos visibles

Hover (opcional / extensible)
• En hover puede aparecer:
• Nombre de la tecnología
• Breve descripción o tags (ej: tipo de proyectos)
• No bloqueante para la versión inicial

Filtros (Seniority / Years)
• Botonera de filtros:
• 1 año / 3 años / 5 años / Roadmap
• Comportamiento:
• Los filtros son combinables
• Los íconos que hacen match:
• Se iluminan (ej: azul)
• Los que no hacen match:
• Permanecen visibles pero sin énfasis
• Estado inicial:
• Todos los íconos visibles sin highlight

⸻

Blade 4 — Experience (Timeline)

Timeline Behavior
• Línea vertical que:
• Se carga dinámicamente al hacer scroll hacia abajo
• Se descarga al hacer scroll hacia arriba

Nodo (bolitas)
• Comportamiento deseado: 1. El progreso llega al nodo 2. Se completa primero el círculo 3. Recién después comienza el siguiente tramo

Scroll Lock (UX avanzada)
• Cuando el usuario llega a un nodo:
• El scroll del mouse no desplaza la página
• El scroll se usa para cargar o descargar el nodo
• Una vez que el nodo se completa:
• Se libera el scroll normal de la página
• Este patrón se repite nodo por nodo

Show Details
• Expande contenido inline
• Empuja el contenido hacia abajo
• No utiliza modal

Mobile
• Timeline sigue siendo vertical
• No se transforma en cards

⸻

Blade 5 — Education
• Mismo patrón que Experience
• Timeline vertical
• Animación y comportamiento equivalentes
• Menor densidad de contenido

⸻

Blade 6 — Footer (Last Blade)
• Footer integrado con Hire Me
• Es el único punto donde aparece Hire Me en About
• Cierra la narrativa de la página

⸻

Animations & Transitions

Page Title
• Usa exactamente la misma animación que Home:
• Slide-up (desde abajo)
• Fade-in (opacidad)
• El trigger ocurre cuando:
• La extensión negra final de la cortina de transición cruza el 50% del ancho

Stats Counters
• Animación de conteo:
• Comienza en 0
• Incrementa rápidamente hasta el valor final
• Trigger:
• Sincronizado con la transición de página
• Se dispara cuando la cortina cruza la mitad del ancho
• En mobile:
• La animación solo se ve cuando los stats entran en viewport

Otros elementos
• Algunos componentes tienen animaciones propias
• Otros aparecen sin animación
• Se prioriza sobriedad y no saturación visual

---

# Projects — UI / UX Behavior

1. Principios generales

La sección Projects sigue una lógica mobile-first, con una jerarquía visual clara entre proyectos featured y non-featured.
El diseño actual contempla un máximo de 6 proyectos, sin paginación, sin scroll infinito y sin índice de navegación.

El layout debe soportar crecimiento futuro, ya que más adelante se incorporará paginación u otros mecanismos de navegación, sin necesidad de rediseñar la estructura base.

⸻

2. Estructura por Blades (Regla dura)

La disposición de los proyectos sigue una regla estricta de alternancia:

Desktop & Mobile (estructura lógica)
• Blade 1
• Título de la página (con animación estándar global)
• 1 Featured Project
• Blade 2
• Proyectos Non-Featured
• Blade 3
• 1 Featured Project
• Blade 4
• Proyectos Non-Featured
• Blade final
• Footer
• Puede combinarse con proyectos non-featured

Esta alternancia (Featured → Non-Featured) es una regla dura, no circunstancial.

⸻

3. Featured vs Non-Featured Projects

Featured Project
• Ocupa la mayor parte del blade
• Es el foco visual principal
• CTA claro (ej. Visit Project)
• Imagen protagonista
• No tiene animaciones de entrada especiales
• Diferenciación basada exclusivamente en jerarquía visual

Non-Featured Project
• Cards más compactas
• Jerarquía secundaria
• CTA más discreto
• Igual comportamiento funcional que los featured
• Sin animaciones de entrada

No existen diferencias de comportamiento o interacción más allá de la jerarquía visual.

⸻

4. Comportamiento de Scroll y Altura de Blades

Mobile
• Cada blade intenta ocupar 100vh
• No deben existir cards cortadas
• Distribución:
• Featured Project → 1 por blade
• Non-Featured → 2 cards por blade
• Una en la mitad superior
• Una en la mitad inferior
• El scroll es continuo, pero el layout siempre queda visualmente ordenado al completar cada blade

Desktop
• No hay scroll snapping
• El scroll es libre
• Es aceptable que durante el scroll algunos elementos queden parcialmente visibles
• Al completar el recorrido de un blade, el contenido debe quedar correctamente alineado
• La distribución puede adaptarse para mostrar más información que en mobile

El efecto de “salto automático” entre blades no aplica en desktop.

⸻

5. Animaciones

Transición de página
• Se rige por el sistema global de cortinas
• Bloquea interacción
• Monta el contenido por detrás
• No depende del tipo de proyecto

Animaciones internas
• No hay animaciones de entrada para las cards
• Única animación permitida:
• Hover sobre la imagen del proyecto
• Zoom muy sutil (ya existente en código)
• No debe competir visualmente con la transición de página

⸻

6. Estado actual y evolución futura

Estado actual
• Máximo 6 proyectos
• Sin:
• Paginación
• Scroll infinito
• Índice de navegación

Futuro (no implementado aún)
• El layout debe permitir:
• Crecimiento del listado
• Incorporación de paginación
• No se deben introducir decisiones de UI que bloqueen esta evolución

⸻

7. Resumen de reglas clave
   • Alternancia Featured / Non-Featured → obligatoria
   • Mobile-first
   • Sin cards cortadas
   • Scroll libre en desktop
   • Jerarquía visual clara, sin animaciones innecesarias
   • Diseño preparado para escalar

---

# Articles

Perfecto, vamos solo con la devolución de Articles, en el mismo tono y nivel de detalle que hicimos con Home / About / Projects.
Nada de consolidar todavía: esto es feedback crítico + validación de decisiones.

⸻

Devolución general (nivel sistema)

La page de Articles está bien pensada y consistente con el resto del sitio, pero tiene dos tensiones claras que conviene explicitar: 1. Jerarquía narrativa vs densidad 2. Animación como guía vs animación como ruido

Lo bueno: las resolviste bien, solo hay que dejar reglas explícitas para que nadie “invente” después.

⸻

1. Primer blade – Featured Articles

✔️ Decisión correcta
• Repetir el patrón de Projects
• Featured arriba
• Misma lógica mental para el usuario

Eso construye lenguaje visual coherente entre páginas.

Punto fino a cuidar

“Que entren dos featured completos en desktop, no cortados”

Esto no siempre es posible sin sacrificar legibilidad, así que mi devolución es:

👉 No lo pongas como regla dura, ponelo como intención.

Regla recomendada
• Desktop:
• Se intenta mostrar 2 featured completos
• Si el alto del viewport no lo permite → se acepta corte leve
• Mobile:
• Siempre 1 featured
• Nunca cortado

📌 Importante:
El corte no rompe el sistema porque:
• El scroll en desktop es libre
• No hay snap
• El usuario entiende continuidad

⸻

2. Relación título / cards (muy buen ojo acá)

Tu duda es válida:

“Tal vez el título es muy grande y corta las cards”

Mi devolución:
• Sí, el título es protagonista
• No debe reducirse solo para que entren cards

👉 El título en Articles define el ritmo, no las cards.

Solución correcta:
• Mantener título grande
• Ajustar spacing vertical
• Aceptar que en algunos viewports:
• El featured quede apenas cortado

Esto es diseño editorial, no layout rígido.

⸻

3. Sección “All Articles” – animación secuencial

Acá hay algo muy bien pensado, y quiero remarcarlo.

✔️ Lo que está perfecto
• Trigger al llegar el título a ~50% del viewport
• Aparición uno por uno
• No aparecen todos juntos
• El scroll “invita” a seguir

Eso:
• Reduce carga cognitiva
• Refuerza lectura
• Evita efecto “lista infinita aburrida”

Regla que conviene dejar escrita
• Solo un artículo nuevo aparece por tramo de scroll
• No hay batch
• No hay animación si el usuario scrollea muy rápido (opcional pero deseable)

⸻

4. Hover con thumbnail que sigue al mouse

Este es un detalle premium, pero hay que acotarlo bien.

✔️ Decisiones correctas
• Hover solo sobre el texto
• No sobre el box completo
• La miniatura sigue el puntero
• Refuerza curiosidad, no distrae

Riesgos a controlar
• Z-index (que no tape otros títulos)
• Delay (no debe aparecer instantáneo)
• Movimiento suave, no “pegado” al cursor

Regla recomendada
• Aparece con leve delay (100–150ms)
• Offset fijo respecto al cursor
• Se destruye al salir del texto (no linger)

⸻

5. Mobile behavior (bien resuelto)

✔️ Bien decidido
• Mismo box
• Misma jerarquía
• Sin persecución compleja del cursor (no tiene sentido)

En mobile:
• El hover se traduce a:
• Aparición simple
• O directamente se omite (aceptable)

📌 Importante:
No intentes “emular hover” en mobile.
Es mejor no hacerlo que hacerlo mal.

⸻

6. Footer + convivencia con artículos

Tu planteo es sano:
• El footer puede:
• Estar solo
• Compartir blade con últimos artículos

La clave es esta regla:

El footer nunca debe competir visualmente con un artículo

Eso implica:
• Menos contraste
• Menos peso visual
• No animación agresiva

⸻

7. Coherencia con el sistema de transiciones

Muy bien alineado con lo anterior:
• No hay animaciones de entrada globales
• Solo:
• Page transition (cortinas)
• Animaciones locales por scroll
• Hover puntual

Eso mantiene:
• Ritmo
• Elegancia
• Sensación “editorial”, no “demo”

⸻
