---
id: 03-header-navbar-rules_final-version
aliases: []
tags: []
---

# 📐 Documento de Reglas — Header / Navbar (Versión Final)

Este documento define estructura, comportamiento, jerarquía y animaciones del Header del sitio, tanto en Desktop como en Mobile.
El objetivo es orden, previsibilidad y extensibilidad futura (parallax, transiciones complejas, 3D, etc.).

⸻

1️⃣ Principios generales (NO negociables)

1. El Header es un sistema, no una fila suelta.
2. El orden semántico (HTML) es estable.
3. La adaptación entre breakpoints se hace solo con CSS (Grid/Flex + animaciones).
4. No se duplica DOM para mobile/desktop.
5. El comportamiento del Header no debe romper el layout del Blade.
6. El Header no depende de scroll automático.
7. El diseño debe permitir animaciones futuras complejas sin refactor masivo.

⸻

2️⃣ Estructura semántica (HTML + BEM)

<header class="header">
  <div class="header__logo"></div>

  <nav class="header__nav"></nav>

  <div class="header__socials"></div>

  <div class="header__ui">
    <div class="header__auth"></div>
    <div class="header__theme"></div>
  </div>

  <div class="header__cta header__cta--hireme"></div>
</header>

Notas clave
• No hay menú hamburguesa activo (el componente existe pero está desconectado, momentaneamente no lo utilizaremos).
• El HireMe es un componente independiente del flujo normal del header.
• El logo siempre es funcional (lleva al Home).

⸻

3️⃣ Orden lógico (importante para accesibilidad y animaciones)

Orden DOM (siempre igual):

1. Logo
2. Navegación del sitio (Home / About / Projects / Articles)
3. Social links
4. UI utils
   • Autenticación (personita)
   • Theme switch
5. HireMe circular (CTA)

Este orden nunca cambia, solo cambia la forma en que se presenta u oculta.

⸻

4️⃣ Desktop behavior (≥ mid-2)

Layout base (CSS Grid recomendado)

Distribución conceptual:

| padding | logo | AIR | nav | AIR | socials | AIR | ui | AIR | hireMe |

    •	El AIR es deliberado (espacio visual de respiración).
    •	La relación de aires es 2 : 3 (consistente).
    •	Los socials no van pegados al borde derecho:
    •	Se relajan hacia la izquierda
    •	Quedan más alineados con el título del Hero
    •	El espacio sobrante a la derecha queda reservado para UI utils + CTA.

Logo
• Posición normal (no fixed).
• Alineado verticalmente al centro del header.

Navegación
• Visible en línea.
• Espaciado regular.
• Alineada visualmente con el contenido del Hero.

Social links
• En fila.
• Relajados hacia el centro (no extremos).
• Nunca pisan el área del logo.

UI utils (auth + theme)
• Agrupados.
• A la derecha.
• Claramente separados de los socials.

HireMe circular
• Siempre visible en Home.
• No fixed en desktop.
• Alineado verticalmente con el logo (misma baseline).
• Respeta el mismo padding lateral que el contenido principal.
• Visualmente destacado (neumorphism / 3D soft).

⸻

5️⃣ Mobile / Mid behavior (mobile-1 y mid-1)

Cambio conceptual (muy importante)

👉 No hay menú hamburguesa.
👉 Los elementos se “ocultan detrás del logo” con animación.

⸻

Header visible en Mobile

Elementos que quedan visibles: 1. Logo (izquierda) 2. Auth (personita) 3. Theme switch 4. HireMe circular (flotante)

Distribución conceptual:

| padding | logo | AIR | auth | theme | AIR | hireMe |

⸻

Elementos que se ocultan
• Navegación del sitio
• Social links

Estos elementos:
• no desaparecen abruptamente
• se ocultan detrás del logo mediante animación

⸻

6️⃣ Animación de ocultamiento (mobile transition)

Idea base
• Efecto de atracción imantada
• Inspiración física, no mecánica

Comportamiento
• Los elementos (nav + socials):
• Mantienen su orden y distancia inicial
• Se desplazan hacia el logo
• Se “introducen” detrás de él

Timing
• No arrancan todos exactamente al mismo tiempo
• Delay incremental:
• ~0.3–0.4s entre cada elemento
• El último elemento se mueve más rápido
• El primero conserva más “aire” respecto al logo

Efectos visuales opcionales (permitidos)
• El logo puede cambiar de color por cada elemento absorbido
• Secuencia tipo semáforo (colores controlados, no chillones)
• Micro-rebote al final de la absorción

⚠️ Esta animación es progresiva:
no tiene que implementarse completa ahora, pero el layout debe permitirla.

⸻

7️⃣ Overlay al hacer click en el logo (mobile)

Al hacer click en el logo en mobile:

Se abre un overlay que contiene:

1. Navegación del sitio (columna)
2. Social links (fila)

❌ No incluye:
• Auth
• Theme switch
• HireMe

El overlay es:
• simple
• rápido
• enfocado en exploración, no configuración

⸻

8️⃣ HireMe circular — reglas especiales

Comportamiento actual (Home)
• Visible siempre
• Flota y persigue el scroll (deberia)
• Estilo circular con texto circular animado

Desktop
• Alineado correctamente

Futuro (no implementar ahora, pero tener en cuenta)
• En About:
• Persigue el scroll
• Al llegar al último blade:
• Transiciona
• Se convierte en botón cuadrado
• Posibles animaciones:
• Espiral / giro / flip-card
• Parallax
• Cambio de cara rotacion/frontal/trasera

👉 Por eso el componente NO debe estar acoplado al header.

⸻

9️⃣ Tecnología de layout
• CSS Grid preferido para el header
• Flex permitido donde tenga sentido
• Tailwind como sistema base
• BEM para naming y claridad

No se aceptan:
• position: fixed innecesarios
• hacks con márgenes mágicos
• dependencias de JS para layout

⸻

🔍 Checklist para el agente(rellenado por mi a confirmar por el agente):

El agente debe poder responder sí a todo esto:
• ¿El logo y el HireMe dejaron de ser fixed en desktop?
si
• ¿El HireMe flota solo en mobile y solo en Home?
el hire me flota en ambos, con flotar queremos decir que que cuando hago scroll el boton no se esconde junto con el Header, sin o que queda presente en la misma posicion, creo que he confundido el termino, flotar es lo mismo que estar fijo a algo o no?
• ¿Los socials están relajados hacia el centro, no al borde?
centro
• ¿Auth y theme tienen aire propio a la derecha?
si
• ¿No hay menú hamburguesa activo?
ya no usaremos el menu hamburgesa, pero debemos documentarlo en el componente que es el logo quien act as like menu.
• ¿En mobile los elementos se ocultan detrás del logo?
si
• ¿El layout permite animaciones futuras sin refactor?
al momento, la animacion es perseguir el scroll hasta el bottom del ultimo blade en la pagina /about y que cuando va llegando al final este transiciona y se convierte en el actual botonn cuadrado que existe en ese lugar, como no se me ocurre graficamente la manera de tranasicionar que como el flip card de una tarjeta de credito en un medio de pago.
• ¿Todo está implementado con Grid/Flex + Tailwind + BEM?
pretendemos que si

⸻
