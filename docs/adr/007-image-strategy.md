---
id: 005-image-strategy
aliases: []
tags: []
---

📘 ADR-004 — Estrategia de uso de imágenes en el frontend

---

Contexto

El proyecto utiliza Next.js, que provee el componente <Image /> para optimización automática de imágenes (LCP, CLS, formatos modernos, lazy-loading).

Sin embargo, el uso indiscriminado de <Image /> introduce:
• acoplamiento fuerte al framework,
• ruido conceptual en el design system,
• complejidad innecesaria para imágenes no críticas,
• pérdida de portabilidad futura.

El proyecto prioriza:
• claridad arquitectónica,
• design system limpio,
• performance real (no dogmática),
• capacidad de evolución futura.

---

Decisión

✅ Se adopta una estrategia híbrida y explícita: 1. next/image se considera infraestructura, no HTML. 2. No se permite importar next/image directamente en componentes de UI. 3. El uso de imágenes optimizadas se realiza exclusivamente a través de un wrapper propio del design system.

---

Implementación acordada

1️⃣ Wrapper único de imagen

Se define un componente interno:

src/ui/atoms/media/Image.tsx

Este componente encapsula next/image y es el único punto de contacto con la API de Next.

---

2️⃣ Reglas de uso

✅ Usar el wrapper (<Image />) SOLO para:
• Hero images
• Thumbnails de artículos / proyectos
• Imágenes que impactan directamente en LCP / CLS
• Contenido editorial relevante

❌ NO usar next/image (usar <img> o CSS) para:
• Íconos
• SVGs
• Logos pequeños
• Imágenes decorativas
• Backgrounds
• Elementos animados
• UI atoms / buttons

---

Consecuencias

Beneficios
• Mejora real de performance y Lighthouse
• Design system desacoplado de Next
• Portabilidad futura
• Menor complejidad mental
• Decisión explícita y auditable

Costes
• Wrapper adicional
• Disciplina de uso (enforced por lint)

---

Enforcement
• Se documenta esta decisión como policy DX / BMAD
• Se implementa una regla ESLint que:
• ❌ prohíbe import Image from "next/image" en src/ui/** y src/app/**
• ✅ permite el wrapper interno

---

Estado final

✔ Decisión aceptada
✔ Aplicable a todo código nuevo
✔ Refactors existentes se harán solo cuando el componente se toque por otro motivo

---

---

🧠 Prompt para el agente (ejecución)

Copiá y pegá esto tal cual:

---

Objetivo
Implementar la decisión arquitectónica ADR-004 (Image Strategy).

Contexto
Este proyecto usa Next.js, pero el uso directo de next/image está restringido por arquitectura.

---

Tareas a realizar 1. Crear wrapper de imagen
• Ruta: src/ui/atoms/media/Image.tsx
• El wrapper debe re-exportar o encapsular next/image
• No debe cambiar el comportamiento por ahora 2. Actualizar imports
• Reemplazar cualquier uso existente de next/image por el wrapper
• SOLO en los componentes donde aplique (hero, thumbnails) 3. No migrar imágenes decorativas
• SVGs, íconos, backgrounds y UI elements deben seguir usando <img> o CSS 4. Implementar ESLint rule
• Prohibir import ... from "next/image" en:
• src/ui/**
• src/app/**
• Permitir:
• src/ui/atoms/media/Image
• Severidad: error
• Sin autofix 5. Documentación
• Referenciar ADR-004 en comentarios de la regla
• No modificar lógica visual ni estilos

---

Criterios de aceptación
• No hay imports directos de next/image fuera del wrapper
• Build, lint y tests pasan
• No se rompe UI ni comportamiento visual
• Arquitectura queda explícita y documentada

---

Si querés, próximo paso puedo:
• escribir la regla ESLint completa
• convertir esto en policy BMAD
• definir qué imágenes migramos ahora y cuáles después
• ayudarte a decidir si el wrapper expone variant, priority, etc.

Vos marcás el ritmo.
