---
id: 006-frontend-testing-strategy
aliases: []
tags: []
related: 004-environment-variables-strategy, 005-privilege-and-exposure-checklist
---

# 📘 docs/adr/006-frontend-testing-strategy.md

⸻

1. Contexto

Este proyecto frontend:
• No depende aún de un backend productivo
• Opera en modo mock por defecto
• Tiene una UI rica en animaciones, overlays y estados
• Usa Playwright para E2E, Jest para unit/integration
• Evoluciona activamente (componentes cambian, algunos se eliminan)

Históricamente, los tests fallaban o se skippeaban por:
• cambios legítimos de UI
• componentes eliminados
• expectativas de test mal alineadas con el diseño actual

Este ADR define una estrategia clara, explícita y sostenible.

⸻

2. Objetivos de la estrategia de testing

✔ Detectar regresiones reales
✔ Proteger flujos críticos de usuario
✔ Permitir refactors sin fricción innecesaria
✔ Evitar tests frágiles o cosméticos
✔ Tener CI confiable (verde significa algo)

No buscamos:
• Testear implementación interna
• Congelar el diseño visual
• Validar datos mock como si fueran reales

⸻

3.  Pirámide de tests adoptada

```
            ▲
            │   E2E (Playwright)
            │   - Flujos críticos
            │   - UX real
            │
            │   Integration
            │   - Hooks
            │   - Providers
            │
            │   Unit
            │   - Utils
            │   - Pure components
            ▼
```

Prioridad: 1. E2E (alto valor, bajo volumen) 2. Integration 3. Unit

⸻

4. Tipos de tests y reglas

4.1 Unit Tests (Jest)

Se testea:
• funciones puras
• utilidades
• lógica sin DOM

Reglas:
• ❌ No testear estilos
• ❌ No testear Tailwind classes
• ❌ No mocks complejos

Ejemplo válido:

```
expect(buildSocialUrl("github", "user")).toBe("https://github.com/user")
```

⸻

4.2 Integration Tests

Se testea:
• hooks (React Query, providers)
• estado global
• mocks + fallbacks

Reglas:
• ✔ Puede usar mocks
• ✔ Puede simular env vars
• ❌ No animaciones
• ❌ No layout exacto

⸻

4.3 E2E Tests (Playwright)

Son el contrato principal de calidad.

Se testea:
• flujos reales de usuario
• accesibilidad
• navegación
• overlays y modales
• estados expandidos/colapsados

Se testea qué ve el usuario, no cómo está hecho.

⸻

5. Qué NO se testea en E2E

❌ Colores exactos
❌ Clases CSS específicas
❌ Animaciones frame-by-frame
❌ Orden exacto de elementos decorativos
❌ Componentes eliminados o experimentales

Ejemplo prohibido:

```
expect(el).toHaveClass("bg-blue-500")
```

⸻

6. Skipped Tests: política oficial

Un test puede estar skipped solo si:

| Causa                                    | Permitido |
| ---------------------------------------- | --------- |
| Componente eliminado                     | ✅        |
| Feature planificada pero no implementada | ✅        |
| test.fixme() documentado                 | ✅        |
| Dependía de diseño descartado            | ✅        |
| Falta de env var                         | ❌        |
| Flakiness no investigada                 | ❌        |

⸻

6.1 Reglas obligatorias para skip

Todo test skippeado debe tener:

```
test.skip("reason: <short explanation + ticket/ADR>")
```

Ejemplo:

test.skip("dead test: Skill orbit UI removed in favor of WordCloud (ADR-XXX)")

⸻

7. Tests “dead” vs “pending”
   • Dead test: el feature ya no existe → eliminar
   • Pending test: el feature existe pero falta → test.fixme()

No se permiten skips “por las dudas”.

⸻

8. Relación con variables de entorno
   • Ningún test E2E debe fallar por falta de NEXT*PUBLIC*\*
   • Todos los mocks tienen fallback
   • CI puede correr con env mínimo

Si un test depende de datos reales → está mal diseñado

⸻

9. CI Rules (hard rules)

En CI:
• ❌ No se permiten tests fallando
• ❌ No se permiten skips nuevos sin justificación
• ✔ Skips existentes deben estar documentados
• ✔ El número de skips debe tender a 0 o ser estable

⸻

10. Qué significa “verde”

✅ Build exitoso
✅ Todos los tests activos pasan
✅ Skips conocidos y documentados
✅ UI renderiza completamente con mocks

“Verde” sí significa listo para release estático.

⸻

11. Decisión

Adoptamos una Test Strategy pragmática, orientada a UX real, que:
• acepta skips documentados
• elimina tests muertos
• prioriza flujos críticos
• desacopla tests de diseño cosmético

⸻

12. Consecuencias

👍 CI más estable
👍 Refactors más rápidos
👍 Menos deuda de tests
👍 Base sólida para Auth y Backend real

⚠ Requiere disciplina al escribir nuevos tests
⚠ Tests viejos pueden eliminarse sin miedo

⸻

TL;DR

Los tests validan experiencia, no implementación.
Verde significa “el usuario no se rompe”, no “el CSS no cambió”.

⸻
