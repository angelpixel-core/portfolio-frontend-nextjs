---
id: hydration-mismatch-review
aliases: []
tags: []
---

TL;DR (decisión clara)

👉 Este issue NO es LOW ni MEDIUM. Es HIGH.
👉 Hay que fixearlo ahora, aunque la épica esté “done”.
👉 Approach recomendado: Opción A – Defer rendering hasta mount (mounted flag).

No es una mejora estética ni deuda “algún día”: está rompiendo SSR y forzando client rendering completo.

⸻

Qué está pasando realmente (en criollo)

Lo que muestran los screenshots y el stacktrace es un hydration mismatch clásico de Next.js:

Expected server HTML to contain a matching <rect> in <svg>

Traducción:
• El server renderiza SunIcon
• El cliente espera MoonIcon
• React detecta diferencia → descarta todo el SSR
• Next.js hace fallback a client rendering
• Aparece el error rojo + warning de Suspense boundary

Esto no es solo un warning:
• Rompe SSR
• Impacta performance
• Puede afectar SEO
• Hace flaky cualquier test E2E relacionado a theme / layout

⸻

Root cause (confirmado por el log)

La cadena es exactamente esta: 1. getInitialTheme() en SSR → siempre LIGHT 2. getInitialTheme() en client → puede ser DARK (localStorage / system) 3. ThemeButton renderiza:

isDarkMode ? <MoonIcon /> : <SunIcon />

    4.	MoonIcon tiene <rect>, SunIcon no
    5.	React compara DOM → mismatch → 💥

Esto no se arregla con tests ni con suppressHydrationWarning (eso solo tapa síntomas).

⸻

Evaluación de las opciones

✅ Opción A — Defer rendering hasta mount (RECOMENDADA)

Qué es
No renderizar el icono dependiente del theme hasta que el componente esté montado en cliente.

const [mounted, setMounted] = useState(false);

useEffect(() => {
setMounted(true);
}, []);

if (!mounted) {
return <button className="theme-button" aria-label="Toggle theme" />;
}

Pros
• Fix quirúrgico
• 1 archivo
• Patrón oficial de Next.js
• Elimina hydration mismatch 100%
• No toca Redux ni providers
• Ideal para cerrar épica sin abrir otra caja de Pandora

Cons
• Micro “flash” sin icono (aceptable y estándar)

👉 Esta es la que yo elegiría hoy, sin dudar.

⸻

⚠️ Opción B — Migrar a next-themes

Pros
• Solución más “correcta” a largo plazo
• Maneja SSR + system preference bien

Cons
• Refactor grande
• Cambia arquitectura (ThemeProvider + Redux)
• NO es fix de cierre de épica
• Esto es otra épica (o sub-épica)

👉 No ahora.

⸻

⚠️ Opción C — CSS-only icons

Renderizar ambos SVG y ocultar con CSS según .dark.

Pros
• Zero hydration issues
• Elegante desde SSR

Cons
• Duplica SVGs
• Más hack visual
• No tan claro para quien lea el código

👉 Válida, pero menos clara que A.

⸻

Qué hacemos con el resto de los issues del log

Separémoslos bien (esto es clave para la retro):

Issue Severidad Acción
Hydration mismatch (ThemeButton / MoonIcon) HIGH Fix ahora (Opción A)
Missing icons (Twitter, Dribbble) LOW Documentar
Font preload warning LOW Documentar
favicon.ico 404 LOW Documentar o quick fix si querés

Esto mantiene consistencia con el criterio que venís usando:

HIGH → fix
MEDIUM / LOW → documentar

Y además evita “normalizar” un bug de SSR serio.

⸻

Qué aportar a la retro (esto es oro)

Yo dejaría algo así (conceptualmente):

Insight clave:
No todos los “warnings” de consola son iguales. Un hydration mismatch es un bug de arquitectura SSR, aunque la app “funcione”.

Aprendizaje:
Theme, locale, user-preference y cualquier estado dependiente de window deben tratarse explícitamente como client-only o diferirse hasta mount.

Decisión:
Aplicamos fix mínimo (defer rendering) para preservar SSR y evitar refactors prematuros.

Eso muestra:
• Criterio técnico
• Disciplina de scope
• Madurez en SSR / Next.js

⸻
