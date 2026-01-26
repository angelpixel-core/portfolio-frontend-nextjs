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
- **Validación manual obligatoria** antes de merge (tests verdes no son suficientes)

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
│ 5. TESTS VERDES                                             │
├─────────────────────────────────────────────────────────────┤
│  □ Todos los tests pasan                                    │
│  □ Lint pasa                                                │
│  □ Typecheck pasa                                           │
│  □ CI verde                                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. VALIDACIÓN MANUAL (OBLIGATORIO)                          │
├─────────────────────────────────────────────────────────────┤
│  □ Ejecutar checklist de validación manual del story file   │
│  □ Verificar UI/comportamiento en browser real              │
│  □ Confirmar que no hay errores en consola                  │
│  □ Documentar resultado en story file                       │
│  ⚠️ SIN ESTE PASO NO SE PUEDE MERGEAR                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. MERGE                                                    │
├─────────────────────────────────────────────────────────────┤
│  □ Merge story/* → epic/*                                   │
│  □ Eliminar branch story/* (opcional)                       │
│  □ Habilitar siguiente story                                │
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

# 6. Validación manual (OBLIGATORIO)
# - Ejecutar checklist del story file
# - Verificar que npm run typecheck funciona
# - Verificar que npm run lint funciona
# - Verificar que npm test funciona
# - Documentar resultado: "Manual validation: OK"

# 7. Merge (solo después de validación manual)
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

## 5. Manual Validation Gate

### Regla No Negociable

> **Ninguna story se considera "terminada" solo por tests verdes.**
> **Requiere una validación manual mínima documentada.**

Esta regla existe porque:
- Los tests automáticos verifican **comportamiento programático**
- La validación manual verifica **experiencia real**
- En proyectos frontend/UI-heavy, la diferencia es crítica

### Checkpoint Formal

```
Tests automáticos → Verde
        ↓
Validación manual → OK (documentada)
        ↓
Merge story → epic
        ↓
Siguiente story habilitada
```

**Si la validación manual no ocurre, no se continúa.**

### Qué ES la Validación Manual

No es "mirar un rato". Es una checklist **concreta, accionable y repetible**.

Cada story file DEBE incluir una sección:

```markdown
## Manual Validation Checklist

- [ ] App levanta sin errores (`npm run dev`)
- [ ] Navegar a la ruta/componente afectado
- [ ] Verificar que la UI nueva es visible
- [ ] Verificar que la interacción principal funciona
- [ ] Verificar que no hay errores en consola del browser
- [ ] Verificar que no hay errores en terminal del server
```

### Qué NO ES la Validación Manual

- ❌ Ejecutar tests automáticos (eso ya pasó)
- ❌ Leer el código y "ver que está bien"
- ❌ Confiar en que "si compila, funciona"
- ❌ Delegar al CI

### Documentación del Resultado

Al completar la validación, agregar al story file:

```markdown
### Manual Validation Result

- **Date:** 2026-01-22
- **Validated by:** Angel DevStack
- **Result:** ✅ PASS
- **Notes:** All checklist items verified, no issues found
```

---

## 6. Checklist por Story

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
- [ ] **Validación manual completada y documentada** ⚠️
- [ ] Story file actualizado con notas de implementación

### Antes de Merge Epic a Main

- [ ] Todas las stories de la épica están merged
- [ ] CI verde en `epic/*`
- [ ] Smoke test manual realizado
- [ ] Retrospectiva completada (opcional)

---

## 7. Resumen Visual

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
    → manual val ✓           → manual val ✓           → manual val ✓
```

### Flujo Completo por Story

```
1. Story documentada (BMAD)
        ↓
2. Branch story/*
        ↓
3. Test inicial (rojo) → commit
        ↓
4. Implementación incremental → commits
        ↓
5. Tests verdes → commit final
        ↓
6. VALIDACIÓN MANUAL GUIADA ← checkpoint obligatorio
        ↓
7. Check manual OK → documentar
        ↓
8. Merge story/* → epic/*
        ↓
9. Siguiente story habilitada
```

---

## 8. Preview Workflow (Vercel)

### Cómo Funcionan los Previews

Cada vez que creas un Pull Request o pusheas a una branch con PR abierto, Vercel automáticamente:

1. **Detecta el push** via GitHub integration
2. **Crea un build de preview** con la misma configuración que producción
3. **Genera una URL única** del tipo: `portfolio-frontend-nextjs-git-<branch>-<owner>.vercel.app`
4. **Comenta en el PR** con el link al preview

### Cómo Previsualizar tus Cambios

```bash
# 1. Crear branch y hacer cambios
git checkout -b story/X.Y-feature-name
# ... hacer cambios ...
git add .
git commit -m "feat: add new feature"

# 2. Pushear y crear PR
git push -u origin story/X.Y-feature-name
# Crear PR en GitHub hacia epic/* o main

# 3. Esperar el preview deployment
# - Vercel comentará en el PR con la URL
# - El build toma 1-3 minutos típicamente

# 4. Probar el preview
# - Abrir la URL en desktop y móvil
# - Verificar que los cambios funcionan correctamente
```

### Qué Verificar en Preview

Antes de mergear un PR, verifica en el preview:

| Check | Descripción |
|-------|-------------|
| ✅ **Homepage** | Carga sin errores |
| ✅ **Navegación** | Todos los links funcionan |
| ✅ **Theme** | Toggle claro/oscuro funciona |
| ✅ **Móvil** | Layout responsive correcto |
| ✅ **Contenido** | Cambios reflejados correctamente |
| ✅ **Consola** | Sin errores en DevTools |
| ✅ **Performance** | No hay delays excesivos |

### Preview URL Format

```
https://<project>-git-<branch>-<owner>.vercel.app

Ejemplo:
https://portfolio-frontend-nextjs-git-story-6-3-preview-angel-devstack.vercel.app
```

### Environment Variables en Preview

Los previews usan las mismas environment variables que producción, excepto:

| Variable | Preview | Production |
|----------|---------|------------|
| `NODE_ENV` | `production` | `production` |
| `VERCEL_ENV` | `preview` | `production` |
| `VERCEL_URL` | URL del preview | Dominio de producción |

Para configurar variables específicas de preview:
1. Ir a Vercel Dashboard → Settings → Environment Variables
2. Seleccionar scope "Preview" para variables que solo aplican a previews

### Troubleshooting Común

**Build falla en preview pero funciona local:**
- Verificar que `npm ci --legacy-peer-deps` funciona
- Revisar logs en Vercel Dashboard
- Asegurar que no hay dependencias de desarrollo faltantes

**Preview no se crea:**
- Verificar que Vercel GitHub App está conectado
- Revisar que `vercel.json` tiene `github.silent: false`
- Confirmar que el PR está hacia branch configurada (main, epic/*)

**Preview URL no aparece en PR:**
- El comentario puede tardar 1-2 minutos después del build
- Verificar permisos de Vercel Bot en el repo
- Revisar configuración en Vercel Dashboard → Git

**Cambios no se reflejan:**
- Forzar refresh con Ctrl+Shift+R
- Verificar que el commit está incluido en el PR
- Revisar que el build completó sin errores

---

## 9. Branch Protection (Recomendado)

### Por Qué Configurar Branch Protection

GitHub Branch Protection Rules aseguran que:
- No se puede pushear directamente a `main`
- Los PRs requieren CI verde antes de merge
- Se previenen merges accidentales de código roto

### Configuración Recomendada para `main`

1. Ir a **Settings → Branches → Add rule**
2. Branch name pattern: `main`
3. Habilitar las siguientes opciones:

| Opción | Valor | Descripción |
|--------|-------|-------------|
| **Require a pull request before merging** | ✅ | Fuerza uso de PRs |
| **Require status checks to pass** | ✅ | CI debe pasar |
| **Require branches to be up to date** | ✅ | Branch debe estar actualizada |
| **Status checks required** | `quality` | Nombre del job en CI |
| **Do not allow bypassing** | ✅ | Ni admins pueden saltear |

### Status Checks Disponibles

El workflow `CI` define un job llamado `quality` que ejecuta:
- `npm run lint`
- `npm run typecheck`
- `npm test`

En "Status checks required", buscar y agregar: **quality**

### Sin Branch Protection (Flujo Actual)

Sin branch protection, el flujo depende de disciplina manual:
- CI corre en PRs pero no bloquea merge
- Se puede mergear aunque CI falle
- **Recomendación:** Configurar branch protection para seguridad adicional

---

## Referencias

- [Architecture Document](../_bmad-output/planning-artifacts/architecture.md)
- [Epic & Stories](../_bmad-output/planning-artifacts/epics.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Vercel Preview Deployments](https://vercel.com/docs/deployments/preview-deployments)
