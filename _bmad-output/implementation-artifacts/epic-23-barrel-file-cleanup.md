# Epic 23 — Barrel File Cleanup

> Status: BACKLOG
> Phase: Growth (Post-MVP)
> Type: PERFORMANCE OPTIMIZATION + CODE QUALITY (Tree-shaking, bundle size reduction)
> Depends on: Epic 22 (TypeScript migration complete — all files now .ts/.tsx)
> Requerimientos: TD4 (Barrel file cleanup — 56 barrel files, 10 protegidos por ESLint)

---

## Objective

El bundle del portfolio solo incluye código realmente usado gracias a tree-shaking efectivo. Todos los barrel files innecesarios están eliminados o deprecados, y las reglas de import documentadas en `docs/architecture/import-rules.md` están completamente aplicadas.

---

## Out of Scope

- **TypeScript migration** — Ya completado en Epic 22. Todos los archivos son .ts/.tsx.
- **Breakpoint migration** — Los imports pueden usar breakpoints legacy o semánticos. Migration es Epic 24.
- **Every Layout utilities** — No afecta imports. Implementación es Epic 24.
- **Nuevas features** — Solo cleanup y optimización, sin cambios funcionales.

---

## Success Criteria

1. **Icons barrel eliminado o deprecado** — Cero imports desde `@/icons` en `src/`
2. **Barrels prohibidos en UI/App eliminados** — Todos los barrels con >15 exports o `export *` en `src/ui/` y `src/app/` removidos o migrados
3. **ESLint rule activa** — `no-barrel-imports-in-ui` bloquea regresiones en CI
4. **Bundle size reducido** — Chunk de icons eliminado (~50 KiB gzip según `import-rules.md`)
5. **Documentación actualizada** — `import-rules.md` incluye playbook de cleanup y lista de barrels permitidos

---

## Current State (from import-rules.md audit)

| Metric | Value |
|--------|-------|
| Total barrel files | 56 |
| Barrels protegidos por ESLint | 10 (`@/atoms`, `@/buttons`, `@/icons`, `@/links`, `@/texts`, `@/molecules`, `@/organisms`, `@/overlays`, `@/hooks`, `@/providers`) |
| Icons barrel exports | 57 |
| Icons barrel consumers | 0 (verificado via grep) |
| Barrels con `export *` | `@/atoms` (7 wildcard), `@/hooks` (4 cascading) |
| Barrels con >15 exports | `@/icons` (57), `@/molecules` (25), `@/organisms` (20) |

---

## Technical Risk Assessment: MEDIO

| Riesgo | Descripción | Mitigación |
|--------|-------------|------------|
| Regresiones en imports | Cambiar imports puede romper builds si paths incorrectos | Tests E2E y unitarios validan que UI funciona |
| ESLint rule demasiado estricta | Puede bloquear imports legítimos de barrels permitidos | Regla solo aplica a UI/App; domains/hooks/state/lib permitidos |
| Barrel cascading en hooks | `@/hooks` tiene `export *` que re-exporta desde sub-barrels | Convertir a named exports explícitos |
| Bundle size no medible | Sin baseline claro de bundle antes/después | Usar `npm run build` y analizar chunks manualmente o con webpack-bundle-analyzer |

---

## Story Breakdown

---

### Story 23.1 — Icons Barrel Cleanup & ESLint Enforcement

**Objective:** Eliminar todos los imports desde `@/icons` y migrarlos a rutas directas (`@/atoms/icons/GitHubIcon`), asegurando que el barrel de icons no tenga consumidores en `src/`.

**User Story:**

Como **desarrollador de UI**,  
quiero **eliminar el barrel `@/icons` y usar solo imports directos de iconos**,  
para que **tree-shaking pueda eliminar iconos no usados y el bundle no cargue los 57 iconos en cada página**.

**Acceptance Criteria:**

1. **AC1: Zero imports desde `@/icons`** — No queda ningún import desde `@/icons` en `src/` (incluyendo tests y stories)
2. **AC2: Direct path imports** — Todos los imports de iconos usan rutas directas (`@/atoms/icons/GitHubIcon`, etc.)
3. **AC3: Barrel deprecation** — El antiguo barrel de icons (`src/ui/atoms/icons/index.*`) se mantiene solo si:
   - No se consume desde `src/ui/` ni `src/app/`, **o**
   - Se marca claramente como deprecated y bloqueado por ESLint para UI/App
4. **AC4: Validation suite** — `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` pasan sin nuevas advertencias/errores
5. **AC5: No regresiones visuales** — Stories de Icon Gallery y UI funcionan correctamente (validado manualmente en Storybook o app)

**Affected Files:**

| File | Action |
|------|--------|
| `src/**/*.{ts,tsx}` | MODIFY — buscar y reemplazar `import { XIcon } from "@/icons"` → `import XIcon from "@/atoms/icons/XIcon"` |
| `src/ui/atoms/icons/index.ts` | MODIFY o DELETE — deprecar o eliminar si cero consumers |
| `.eslintrc.js` | VERIFY — regla `no-barrel-imports-in-ui` incluye `@/icons` |

**Scope:**

- Buscar todos los imports desde `@/icons` en `src/` (grep/ripgrep)
- Migrar cada import a ruta directa (`@/atoms/icons/IconName`)
- Verificar que Icon Gallery en Storybook sigue funcionando
- Opcional: eliminar barrel si cero consumers, o marcarlo como deprecated

**Risk Level:** Bajo (migración mecánica, ESLint ya protege)

**Definition of Done:**

- [ ] Cero imports desde `@/icons` en `src/` (verificado via grep)
- [ ] Todos los imports usan rutas directas
- [ ] ESLint rule `no-barrel-imports-in-ui` incluye `@/icons` y pasa sin errores
- [ ] Tests pasan (987 tests)
- [ ] Build exitoso
- [ ] Icon Gallery en Storybook funciona

**Complexity:** Low

---

### Story 23.2 — UI Barrel Audit & Cleanup (Atoms/Molecules/Organisms/Overlays)

**Objective:** Auditar y limpiar todos los barrel files en la capa de UI (atoms, molecules, organisms, overlays) aplicando la matriz de decisión de `import-rules.md`.

**User Story:**

Como **maintainer del frontend**,  
quiero **auditar y limpiar todos los barrel files en la capa de UI (atoms, molecules, organisms, overlays)**,  
para que **ningún barrel prohibido rompa el tree-shaking y los bundles se mantengan pequeños**.

**Acceptance Criteria:**

1. **AC1: Inventario completo** — Lista de todos los barrels en:
   - `src/ui/atoms/**/index.*`
   - `src/ui/molecules/**/index.*`
   - `src/ui/organisms/**/index.*`
   - `src/ui/overlays/**/index.*`
2. **AC2: Aplicación de matriz de decisión** — Para cada barrel se aplica la matriz de `import-rules.md`:
   - Si **> 15 exports**, o `export *`, o se consume desde UI/App → **el barrel se elimina o se marca como prohibido** y se migran imports a rutas directas
   - Solo permanecen barrels **explicitamente permitidos** (pocos exports, server-side, sin consumo en UI/App)
3. **AC3: Imports migrados** — Todos los imports en UI/App respetan las reglas:
   - Nada de `export * from` en barrels consumidos por UI
   - Nada de cascadas (`index` que re-exporta desde otro `index`)
4. **AC4: ESLint enforcement** — ESLint rule `no-barrel-imports-in-ui` está activada y el lint pasa sin violaciones
5. **AC5: Bundle no crece** — Bundle no crece respecto a baseline previo (al menos verificado por un build o análisis rápido de tamaño de chunks)

**Affected Files:**

| File | Action |
|------|--------|
| `src/ui/atoms/**/index.*` | AUDIT → MODIFY/DELETE según matriz |
| `src/ui/molecules/**/index.*` | AUDIT → MODIFY/DELETE según matriz |
| `src/ui/organisms/**/index.*` | AUDIT → MODIFY/DELETE según matriz |
| `src/ui/overlays/**/index.*` | AUDIT → MODIFY/DELETE según matriz |
| `src/ui/**/*.{ts,tsx}` | MODIFY — migrar imports de barrels prohibidos a rutas directas |
| `src/app/**/*.{ts,tsx}` | MODIFY — migrar imports de barrels prohibidos a rutas directas |

**Scope:**

- Inventariar todos los barrels en UI layer
- Aplicar matriz de decisión (export count, `export *`, consumo desde UI/App)
- Migrar imports de barrels prohibidos a rutas directas
- Eliminar o deprecar barrels prohibidos
- Verificar ESLint rule cubre todos los casos

**Risk Level:** Medio (muchos archivos a tocar, riesgo de regresiones)

**Definition of Done:**

- [ ] Inventario completo de barrels en UI layer
- [ ] Matriz de decisión aplicada a cada barrel
- [ ] Imports migrados de barrels prohibidos
- [ ] ESLint rule pasa sin violaciones
- [ ] Tests pasan (987 tests)
- [ ] Build exitoso
- [ ] Bundle size no crece (verificado manualmente)

**Complexity:** Medium

---

### Story 23.3 — Safe Barrels en Lib, Domains, Hooks y State

**Objective:** Asegurar que los barrels fuera de la capa UI (lib, domains, hooks, state) usan solo patrones seguros y no tienen `export *` si se consumen desde UI/App.

**User Story:**

Como **arquitecto del proyecto**,  
quiero **asegurar que los barrels fuera de la capa UI (lib, domains, hooks, state) usan solo patrones seguros**,  
para que **la organización de imports sea cómoda sin penalizar el rendimiento**.

**Acceptance Criteria:**

1. **AC1: Inventario completo** — Lista de todos los barrels en:
   - `src/lib/**/index.*`
   - `src/domains/**/index.*`
   - `src/hooks/**/index.*`
   - `src/state/**/index.*`
2. **AC2: Eliminación de `export *`** — Ningún barrel en estas capas usa `export *` si se consume desde UI/App; en su lugar:
   - Se reemplaza por `export { A, B }` explícitos, **o**
   - Se limita su uso a capas internas (domains/hooks/state) documentado en `import-rules.md`
3. **AC3: Sin cascading** — No hay barrels en estas capas que **reempaqueten otros barrels** (no cascadas)
4. **AC4: Documentación actualizada** — `docs/architecture/import-rules.md` actualizada con:
   - Lista de barrels "permitidos" (safe) y su propósito
   - Ejemplos de import correctos para domains/hooks/state
5. **AC5: Lint y typecheck pasan** — Lint y typecheck pasan sin nuevas reglas rotas; cualquier nueva regla ESLint asociada a estos barrels está documentada y sin violaciones

**Affected Files:**

| File | Action |
|------|--------|
| `src/lib/**/index.*` | AUDIT → MODIFY si tiene `export *` consumido desde UI/App |
| `src/domains/**/index.*` | AUDIT → MODIFY si tiene `export *` consumido desde UI/App |
| `src/hooks/**/index.*` | AUDIT → MODIFY (tiene `export *` cascading según import-rules.md) |
| `src/state/**/index.*` | AUDIT → MODIFY si tiene `export *` consumido desde UI/App |
| `docs/architecture/import-rules.md` | MODIFY — añadir sección "Safe Barrels List" |

**Scope:**

- Inventariar barrels en lib/domains/hooks/state
- Identificar `export *` que se consumen desde UI/App
- Convertir `export *` a named exports explícitos
- Eliminar cascading (barrels que re-exportan desde otros barrels)
- Documentar barrels permitidos y su propósito

**Risk Level:** Bajo (estas capas no afectan bundle directamente, pero mejoramos organización)

**Definition of Done:**

- [ ] Inventario completo de barrels en lib/domains/hooks/state
- [ ] `export *` eliminado o limitado a capas internas
- [ ] Cascading eliminado
- [ ] `import-rules.md` actualizado con lista de barrels permitidos
- [ ] Lint y typecheck pasan
- [ ] Tests pasan

**Complexity:** Low-Medium

---

### Story 23.4 — Tooling & Docs para Barrel Cleanup

**Objective:** Automatizar la detección de barrel imports prohibidos y documentar el proceso de cleanup para prevenir regresiones futuras.

**User Story:**

Como **team lead**,  
quiero **automatizar la detección de barrel imports prohibidos y documentar el proceso de cleanup**,  
para que **cualquier regresión futura se bloquee automáticamente y el equipo tenga una guía clara**.

**Acceptance Criteria:**

1. **AC1: ESLint rule completa** — Regla `no-barrel-imports-in-ui` está configurada y cubierta por tests de lint (al menos un caso positivo/negativo)
2. **AC2: Documentación playbook** — `docs/architecture/import-rules.md` ampliado con una sección "Barrel Cleanup Playbook (Epic 23)":
   - Pasos para detectar barrels prohibidos
   - Ejemplos de migración de imports (`@/icons` → `@/atoms/icons/GitHubIcon`, etc.)
   - Cómo interpretar los errores de ESLint relacionados con barrels
3. **AC3: Script de auditoría** — Si ya existe algún codemod o script, se documenta su uso; si no, se define al menos un comando de auditoría (por ejemplo, un script que liste barrels e imports sospechosos)
4. **AC4: Sprint tracking** — `sprint-status.yaml` incluye las stories 23.x en `backlog` (o el estado que acordemos) para seguimiento futuro

**Affected Files:**

| File | Action |
|------|--------|
| `.eslintrc.js` | VERIFY/MODIFY — regla `no-barrel-imports-in-ui` completa y testeada |
| `docs/architecture/import-rules.md` | MODIFY — añadir sección "Barrel Cleanup Playbook" |
| `package.json` | MODIFY (opcional) — añadir script de auditoría si se crea |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | MODIFY — añadir stories 23-1, 23-2, 23-3, 23-4 |

**Scope:**

- Verificar/mejorar ESLint rule `no-barrel-imports-in-ui`
- Añadir tests de lint para la regla (casos positivo/negativo)
- Documentar playbook de cleanup en `import-rules.md`
- Opcional: crear script de auditoría (grep barrels, contar exports, detectar `export *`)
- Actualizar sprint-status con stories 23.x

**Risk Level:** Bajo (documentación y tooling, no afecta código de producción)

**Definition of Done:**

- [ ] ESLint rule completa y testeada
- [ ] `import-rules.md` incluye playbook de cleanup
- [ ] Script de auditoría documentado o creado
- [ ] `sprint-status.yaml` incluye stories 23.x
- [ ] Lint pasa con regla activa

**Complexity:** Low

---

## Dependencies

- **Epic 22 (TypeScript Migration)** — Debe estar completo. Todos los archivos son .ts/.tsx antes de empezar cleanup de barrels.
- **Epic 20 Story 20.5 (Barrel File & Import Rules)** — Documento `import-rules.md` debe existir y estar actualizado.

---

## References

- [Source: docs/architecture/import-rules.md] — Matriz de decisión, ESLint rules, icon barrel case study
- [Source: _bmad-output/planning-artifacts/epics-v4.md#Epic 23] — Epic scope y requerimientos TD4
- [Source: CLAUDE.md#Performance Anti-pattern] — Barrel import rules y tree-shaking
