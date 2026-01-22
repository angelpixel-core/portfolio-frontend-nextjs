# Development Workflow & Branching Strategy

**Proyecto:** portfolio-frontend-nextjs (brownfield)
**Autor:** Angel DevStack
**Fecha:** 2026-01-22

---

## Resumen Ejecutivo

Este documento define el flujo de desarrollo para un proyecto brownfield con un solo desarrollador. El enfoque combina:

- **Branching por épica** para aislar trabajo completo
- **TDD pragmático** para garantizar calidad sin dogmatismo
- **Commits atómicos** que cuentan la historia del desarrollo
- **CI flexible** que permite desarrollo iterativo sin bloqueos innecesarios

---

## 1. Estrategia de Branching

### Estructura

```
main
 └─ epic/<epic-id>-<short-name>
     └─ story/<epic-id>.<story-id>-<short-name>
```

### Ejemplo Real

```
main
 └─ epic/1-primera-impresion
     ├─ story/1.1-typescript-ci
     ├─ story/1.2-profile-domain
     ├─ story/1.3-technology-stack
     └─ story/1.4-social-links
```

### Reglas de Branches

| Branch | Propósito | CI Status | Merge Target |
|--------|-----------|-----------|--------------|
| `main` | Producción estable | **DEBE pasar** | N/A |
| `epic/*` | Integración de stories de una épica | **DEBE pasar** | `main` |
| `story/*` | Desarrollo activo de una story | **PUEDE fallar** | `epic/*` |

### Flujo de Merges

```
story/1.1-typescript-ci ──┐
story/1.2-profile-domain ─┼──► epic/1-primera-impresion ──► main
story/1.3-technology-stack┘
```

### Beneficios de Este Modelo

- **Aislamiento**: Una épica problemática no contamina `main`
- **Reversibilidad**: Podés abortar una épica completa sin impacto
- **Historia limpia**: El merge a `main` representa valor entregado
- **Simplicidad**: No requiere `develop`, `release/*`, ni `hotfix/*`

---

## 2. Flujo de Desarrollo (TDD Pragmático)

### Filosofía

No es TDD académico (test → código → refactor en ciclos de 30 segundos).
Es **TDD por capas**: el test define el comportamiento esperado, la implementación lo satisface incrementalmente.

### Secuencia por Story

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PREPARACIÓN                                              │
├─────────────────────────────────────────────────────────────┤
│  □ Leer story file completo                                 │
│  □ Crear branch: story/<epic>.<story>-<name>                │
│  □ Entender acceptance criteria                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. TEST PRIMERO (Rojo)                                      │
├─────────────────────────────────────────────────────────────┤
│  □ Escribir test(s) que definen comportamiento              │
│  □ Test debe fallar (no existe implementación)              │
│  □ Commit: test: add failing <behavior> spec                │
│  ⚠️ CI falla - ESTO ES INTENCIONAL                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. IMPLEMENTACIÓN INCREMENTAL                               │
├─────────────────────────────────────────────────────────────┤
│  □ Agregar dependencias necesarias                          │
│     └─ Commit: chore: add <dependency>                      │
│  □ Implementar UI/componentes                               │
│     └─ Commit: feat: render <component>                     │
│  □ Conectar servicios/APIs                                  │
│     └─ Commit: feat: wire <service> integration             │
│  □ Reemplazar mocks por implementaciones reales             │
│     └─ Commit: feat: replace mock with real <service>       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. REFACTORS (si aplica)                                    │
├─────────────────────────────────────────────────────────────┤
│  □ Extraer abstracciones                                    │
│     └─ Commit: refactor: extract <abstraction>              │
│  □ Mejorar naming/estructura                                │
│     └─ Commit: refactor: rename <old> to <new>              │
│  ⚠️ NUNCA mezclar refactor con feature en mismo commit      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. CIERRE (Verde)                                           │
├─────────────────────────────────────────────────────────────┤
│  □ Todos los tests pasan                                    │
│  □ Lint pasa                                                │
│  □ Typecheck pasa                                           │
│  □ CI verde                                                 │
│  □ Merge a epic/* branch                                    │
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo Concreto: Story 1.1

```bash
# 1. Crear branch
git checkout epic/1-primera-impresion
git checkout -b story/1.1-typescript-ci

# 2. Test primero (ROJO)
# Escribir test que verifica que typecheck funciona
git commit -m "test: add typecheck validation spec"
# ❌ CI falla - OK, es intencional

# 3. Implementación incremental
git commit -m "chore: add typescript dependency"
git commit -m "feat: create tsconfig.json with strict mode"
git commit -m "feat: add typecheck script to package.json"
git commit -m "feat: create next-env.d.ts reference"

# 4. CI pipeline
git commit -m "ci: add github actions workflow"
git commit -m "ci: configure lint and typecheck jobs"

# 5. Verde
git commit -m "fix: resolve remaining type errors"
# ✅ CI pasa

# 6. Merge
git checkout epic/1-primera-impresion
git merge story/1.1-typescript-ci
```

---

## 3. Reglas de CI

### Matriz de Exigencia

| Branch Pattern | Lint | Typecheck | Unit Tests | E2E | Status |
|----------------|------|-----------|------------|-----|--------|
| `main` | ✅ DEBE | ✅ DEBE | ✅ DEBE | ✅ DEBE | **Blocking** |
| `epic/*` | ✅ DEBE | ✅ DEBE | ✅ DEBE | ⚠️ Warning | **Blocking** |
| `story/*` | ⚠️ Run | ⚠️ Run | ⚠️ Run | ❌ Skip | **Non-blocking** |

### Justificación

**¿Por qué `story/*` puede fallar?**

- El primer commit de una story es un test que falla (TDD)
- La implementación es incremental
- Exigir verde en cada commit impide desarrollo orgánico

**¿Por qué `epic/*` debe pasar?**

- Representa integración de múltiples stories
- Es el último paso antes de `main`
- Garantiza que el trabajo combinado funciona

**¿Por qué `main` es estricto?**

- Es producción
- Cualquier error aquí afecta usuarios reales
- Zero tolerance for failures

### Configuración en GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, 'epic/**']
  pull_request:
    branches: [main, 'epic/**']

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test

  # E2E solo en main y epic/* cuando esté configurado
  e2e:
    if: github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/heads/epic/')
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      # ... playwright setup
```

---

## 4. Convenciones de Commits

### Formato

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Tipos Permitidos

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva funcionalidad | `feat: render login form` |
| `fix` | Corrección de bug | `fix: resolve null pointer in auth` |
| `test` | Agregar/modificar tests | `test: add failing login flow spec` |
| `refactor` | Cambio sin modificar comportamiento | `refactor: extract auth service` |
| `chore` | Tareas de mantenimiento | `chore: add zod dependency` |
| `ci` | Cambios en CI/CD | `ci: add typecheck job` |
| `docs` | Documentación | `docs: update API usage guide` |
| `style` | Formato, espacios, semicolons | `style: fix eslint warnings` |
| `perf` | Mejoras de performance | `perf: memoize expensive calculation` |

### Regla de Oro: Un Commit = Una Intención

**CORRECTO:**
```bash
git commit -m "chore: add auth client dependency"
git commit -m "feat: implement login form component"
git commit -m "refactor: extract form validation logic"
```

**INCORRECTO:**
```bash
git commit -m "feat: add login with validation and new dependency"
# ❌ Mezcla feature + refactor + chore
```

### Qué NO Mezclar en un Commit

| Combinación | Por qué es malo |
|-------------|-----------------|
| `feat` + `refactor` | No sabés qué rompió si falla |
| `chore` (dependency) + `feat` | El cambio de dep debe ser aislado |
| `fix` + `feat` | Son intenciones distintas |
| `test` + `feat` | El test debe existir antes del feat |

### Commits que Cuentan la Historia

Un buen historial de commits se lee como una narrativa:

```
test: add failing typecheck validation
chore: add typescript as devDependency
feat: create tsconfig.json with strict mode
feat: add typecheck script to package.json
ci: create github actions workflow
ci: add lint, typecheck and test jobs
fix: configure path aliases in tsconfig
docs: update development workflow guide
```

Leyendo esto, cualquiera entiende QUÉ se hizo y EN QUÉ ORDEN.

---

## 5. Checklist por Story

### Antes de Empezar

- [ ] Story file leído completamente
- [ ] Branch `story/*` creado desde `epic/*`
- [ ] Acceptance criteria entendidos

### Durante Desarrollo

- [ ] Primer commit es test que falla
- [ ] Commits son atómicos (una intención)
- [ ] No hay mezcla de tipos de cambio
- [ ] Refactors están aislados

### Antes de Merge a Epic

- [ ] Todos los tests pasan localmente
- [ ] `npm run lint` pasa
- [ ] `npm run typecheck` pasa
- [ ] CI verde en la branch
- [ ] Story file actualizado con notas de implementación

### Antes de Merge Epic a Main

- [ ] Todas las stories de la épica están merged
- [ ] CI verde en `epic/*`
- [ ] Smoke test manual realizado
- [ ] Retrospectiva completada (opcional)

---

## 6. Resumen Visual

```
                    ┌─────────────────────────────────────┐
                    │              main                   │
                    │         (siempre verde)             │
                    └──────────────▲──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │        epic/1-primera-impresion     │
                    │      (verde antes de merge)         │
                    └──────────────▲──────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
┌────────┴────────┐    ┌──────────┴──────────┐    ┌────────┴────────┐
│ story/1.1-ts-ci │    │ story/1.2-profile   │    │ story/1.3-tech  │
│ (puede fallar)  │    │ (puede fallar)      │    │ (puede fallar)  │
└─────────────────┘    └─────────────────────┘    └─────────────────┘
         │                         │                         │
    [TDD cycle]              [TDD cycle]              [TDD cycle]
    test → impl              test → impl              test → impl
```

---

## Referencias

- [Architecture Document](../_bmad-output/planning-artifacts/architecture.md)
- [Epic & Stories](../_bmad-output/planning-artifacts/epics.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
