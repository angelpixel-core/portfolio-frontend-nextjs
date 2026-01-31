---
id: 02-rules
aliases: []
tags: []
---

🧩 Home Layout – Mapping reglas → Tailwind (BEM-friendly)

Convención asumida (alineada a lo que ya usás):

.block
.block**element
.block**element--modifier

Tailwind vive dentro de esas clases.

⸻

1. Estructura base (Home)

Block principal

<main class="home">

.home {
@apply relative w-full overflow-x-hidden;
}

⸻

2. Blade system (conceptual)

No creamos .blade como componente React,
pero sí como bloque BEM conceptual.

<section class="home__blade home__blade--primary">
<section class="home__blade home__blade--secondary">

.home\_\_blade {
@apply relative w-full;
}

⸻

3. Blade 1 – Home principal

3.1 mobile-1 (≥ 376px)

.home\_\_blade--primary {
/_ mobile-1: NO full viewport _/
@apply flex flex-col;
}

Orden vertical (BEM + Tailwind):

<header class="home__header"></header>
<div class="home__hero"></div>
<h1 class="home__title"></h1>
<p class="home__description"></p>
<div class="home__cta"></div>

.home\_\_header {
@apply flex items-center justify-between;
}

.home\_\_hero {
@apply flex justify-center;
}

.home\_\_title {
@apply text-center;
}

.home\_\_description {
@apply text-center;
}

.home\_\_cta {
@apply flex flex-col gap-4 w-full;
}

⸻

Hire Me Button (mobile-1)

<div class="home__hireme">

.home\_\_hireme {
@apply fixed z-50;
@apply bottom-6 right-6;
@apply pointer-events-auto;
}

🔒 Reglas:
• ❌ No existe fuera de Home
• ❌ Nunca cuadrado
• ✅ Siempre circular
• ✅ Siempre flotante

⸻

4. Blade 2 – mobile-1 secondary (slider + footer)

<section class="home__blade home__blade--secondary">

.home\_\_blade--secondary {
@apply flex flex-col;
}

.home\_\_customers {
@apply flex items-center justify-center;
@apply min-h-[20vh] max-h-[40vh];
}

.home\_\_footer {
@apply flex flex-col;
}

⚠️ Excepción explícita
Este blade NO fuerza alineación con viewport.

⸻

5. mid-1 (≥ 680px)

Cambio estructural

@media (min-width: 680px) {
.home\_\_blade--primary {
@apply min-h-[80vh] justify-between;
}
}

CTA cambia:

@media (min-width: 680px) {
.home\_\_cta {
@apply flex-row;
}
}

Customer slider entra al Blade 1:

@media (min-width: 680px) {
.home\_\_customers {
@apply block;
}
}

📌 Footer:

@media (min-width: 680px) {
.home\_\_footer {
@apply mt-auto;
}
}

⸻

6. mid-2 (≥ 768px – iPad)

Split layout

@media (min-width: 768px) {
.home\_\_content {
@apply grid grid-cols-2 gap-8;
}

.home\_\_hero {
@apply col-span-1;
}

.home\_\_text {
@apply col-span-1 flex flex-col justify-center;
}
}

CTA y slider:

@media (min-width: 768px) {
.home\_\_cta {
@apply w-full justify-between;
}

.home\_\_customers {
@apply mt-8;
}
}

Blade:

@media (min-width: 768px) {
.home\_\_blade--primary {
@apply min-h-screen;
}
}

⸻

7. desk-1 (≥ 940px)

Desktop reducido

@media (min-width: 940px) {
.home\_\_blade--primary {
@apply min-h-[820px];
}

.home\_\_title {
@apply text-5xl;
}

.home\_\_description {
@apply text-lg;
}
}

CTA:

@media (min-width: 940px) {
.home\_\_cta {
@apply justify-center gap-8;
}
}

⸻

8. desk-2 (≥ 1024px)

Desktop estable

@media (min-width: 1024px) {
.home\_\_cta {
@apply justify-start;
}

.home\_\_cta-button {
@apply max-w-[280px];
}
}

Espacios:

@media (min-width: 1024px) {
.home\_\_content {
@apply gap-12;
}
}

⚠️ No se crean layouts nuevos
Solo redistribución y respiración

⸻

9. Footer – regla global

.home\_\_footer {
@apply w-full;
}

@media (min-width: 680px) {
.home\_\_footer {
@apply mt-auto;
}
}

📌 Traducción directa de la regla:

El top del footer coincide con el final del último blade.

⸻

10. Resumen para el agente
    • 🧠 Las reglas viven primero
    • 🎯 Tailwind implementa, no decide
    • 🧱 BEM es la API
    • 📐 Altura es conceptual
    • ❌ Nunca forzar scroll
    • ✅ Nunca romper jerarquía

⸻

Próximo paso recomendado

1. 🔧 Tomar código actual y proponer diffs BEM
2. 🧪 Definir tests visuales por breakpoint
