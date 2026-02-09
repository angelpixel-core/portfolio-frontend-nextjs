---
id: 003-import-strategy
aliases: []
tags:
  - bundler-optimization
  - lighthouse
  - tree-shaking
  - frontend
---

# ADR-003 — Estrategia de Imports (Barrel vs Direct)

---

Contexto

Durante tareas de optimización de performance (Lighthouse, bundle analysis), se detectó que el uso extensivo de barrel files (index.ts) en capas de UI estaba causando:
• Inclusión de JavaScript no utilizado
• Peor tree-shaking
• Evaluación innecesaria de módulos
• Penalizaciones en métricas de performance

Aunque los barrel imports mejoran la experiencia de desarrollo (DX), su uso en componentes que corren en el cliente introduce riesgos reales de performance en Next.js (App Router + SSR).

---

Decisión

Se adopta una estrategia híbrida de imports, diferenciando por capa del sistema.

✅ Barrel imports PERMITIDOS en:
• domains/** (models, schemas, mocks)
• lib/** (utils puros, helpers sin side-effects)
• services/\*\* (lógica de negocio sin UI)
• Código server-only
• Código sin CSS, animaciones o hooks

Ejemplo permitido:

import { User, Profile } from "@/domains/user";

---

❌ Barrel imports PROHIBIDOS en:
• ui/** (atoms, molecules, organisms)
• app/** (App Router, layouts, pages)
• Componentes client-side
• Componentes con:
• CSS imports
• Animaciones
• Hooks de React
• Side-effects implícitos

Ejemplo prohibido:

import { Button, Modal } from "@/ui";

Ejemplo correcto:

import Button from "@/ui/atoms/Button";
import Modal from "@/ui/molecules/Modal";

---

Justificación Técnica
• Los barrel files fuerzan al bundler a analizar módulos no usados.
• Next.js prioriza seguridad de render sobre tree-shaking agresivo.
• Imports directos:
• Reducen JS parseado
• Mejoran determinismo del bundle
• Facilitan optimización incremental
• Lighthouse mide bytes reales enviados, no intención del desarrollador.

---

Consecuencias

Positivas
• Mejor performance y scores Lighthouse
• Bundles más pequeños
• Menor riesgo de regresiones de hidratación

Negativas
• Leve degradación de DX en capas de UI
• Imports más verbosos (trade-off aceptado)

---

Notas
• Esta decisión no prohíbe barrel files globalmente
• Solo regula dónde son aceptables
• La regla se refuerza mediante ESLint

---

Enforcement — ESLint Rule

**Regla**: `no-barrel-imports-in-ui`
**Ubicación**: `eslint-rules/no-barrel-imports-in-ui.js`
**Tests**: `eslint-rules/__tests__/no-barrel-imports-in-ui.test.js`

**Estado actual**: `warn` (73 violaciones legacy pendientes de migración)
**Objetivo**: Escalar a `error` cuando violations = 0

**Barrel paths monitoreados**:
`@/atoms`, `@/buttons`, `@/icons`, `@/links`, `@/texts`, `@/molecules`, `@/organisms`, `@/overlays`, `@/hooks`

**Configuración** (`.eslintrc.js` overrides, plugin `eslint-plugin-rulesdir`):
```js
{
  files: ["src/ui/**/*", "src/app/**/*"],
  rules: {
    "rulesdir/no-barrel-imports-in-ui": ["warn", {
      barrelPaths: ["@/atoms", "@/buttons", "@/icons", "@/links", "@/texts",
                    "@/molecules", "@/organisms", "@/overlays", "@/hooks"]
    }]
  }
}
```

**Plan de escalado**:
1. Corregir violaciones en batches controlados por sprint
2. Al resolver cada batch, reducir `--max-warnings N` en `package.json`
3. Cuando N = 0, cambiar severidad de `warn` a `error`
4. Restaurar `--max-warnings 0` en el script lint

---
