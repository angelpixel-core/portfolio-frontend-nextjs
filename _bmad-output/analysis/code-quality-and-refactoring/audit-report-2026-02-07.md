# Auditoría Integral de Calidad Técnica

**Proyecto:** portfolio-frontend-nextjs
**Fecha:** 2026-02-07
**Contexto:** Post-Epic 14 (Projects & Articles + Code Quality Merge)
**Rol:** BMAD Technical/Product Analyst

---

## 1. Informe de Estado Actual

### Resumen Ejecutivo

> **"Arquitectura sólida con deuda puntual y migración TypeScript incompleta. Lista para features, no para escalar sin cleanup previo."**

El proyecto está en un estado **saludable operativamente** pero con **deuda técnica acumulada** que no bloquea pero sí erosiona mantenibilidad.

### Métricas Clave

| Métrica | Valor | Evaluación |
|---------|-------|------------|
| Archivos fuente | 468 | Tamaño mediano |
| TypeScript vs JavaScript | 50% / 50% (192 cada uno) | 🟡 Migración incompleta |
| Archivos CSS | 85 | BEM scoped ✅ |
| Test suites | 82 | ✅ Buena cobertura |
| Tests unitarios | 818 passing | ✅ Excelente |
| E2E tests | 20+ specs, 613 assertions | ✅ Exhaustivo |
| Snapshots | 5 | ✅ Mínimos (bien) |
| Domains | 11 (100% TypeScript) | ✅ Sólido |
| Build | Passing | ✅ Estable |

### Estado por Área

| Área | Estado | Deuda |
|------|--------|-------|
| **Domains** | 🟢 Excelente | Ninguna - 100% TS, estructura consistente |
| **State Management** | 🟢 Muy Bueno | 3 providers en JSX (bajo impacto) |
| **UI/Atoms** | 🟡 Bueno | ~30 archivos JSX, barrels mixtos |
| **UI/Molecules** | 🟡 Bueno | 36 archivos JSX, 2 componentes deprecated |
| **UI/Organisms** | 🟡 Bueno | 21 archivos JSX |
| **Tests** | 🟢 Muy Bueno | 818/818 passing, cobertura amplia |
| **E2E** | 🟢 Excelente | 20+ specs, viewport-aware |
| **CSS** | 🟢 Muy Bueno | BEM consistente, poca duplicación |
| **Documentación** | 🟢 Buena | 12 docs, 2 ADRs, CLAUDE.md actualizado |

---

## 2. Mapa de Deuda Técnica

### 🔴 Crítica (Bloquea evolución)

*No hay deuda crítica identificada.* El proyecto es operativo y estable.

---

### 🟡 Media (Conviene atacar)

#### TD-M1: Migración TypeScript Incompleta (UI Layer)

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | 50% del código sigue en JavaScript. UI/atoms, molecules, organisms tienen mayoría JSX. |
| **Área afectada** | `src/ui/atoms`, `src/ui/molecules`, `src/ui/organisms` |
| **Impacto** | Type safety parcial, refactors más riesgosos, onboarding más lento |
| **Riesgo** | 🟡 Medio - funciona pero erosiona confianza |
| **Urgencia** | Media - no bloquea pero acumula |
| **Esfuerzo estimado** | 8-12 horas (incremental por componente) |

#### TD-M2: Componentes Deprecated No Eliminados

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | `FeaturedProject/index.jsx` y `Project/index.jsx` marcados deprecated pero no eliminados |
| **Área afectada** | `src/ui/molecules/` |
| **Impacto** | Confusión, imports erróneos posibles |
| **Riesgo** | 🟢 Bajo |
| **Urgencia** | Baja - cosmético |
| **Esfuerzo estimado** | 30 minutos |

#### TD-M3: Console Statements Sin Logging System

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | 17+ `console.log/warn/error` directos en código de producción. Existe `lib/logger.js` pero no se usa consistentemente. |
| **Área afectada** | `ChatBox`, `TransitionProvider`, varios domains |
| **Impacto** | Ruido en consola, debugging inconsistente |
| **Riesgo** | 🟢 Bajo |
| **Urgencia** | Baja - heredado de Epic 13 |
| **Esfuerzo estimado** | 2-4 horas |

#### TD-M4: TODOs Pendientes en Código

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | 5 TODOs identificados, algunos técnicos (OAuth integration, DOM manipulation debt) |
| **Área afectada** | `SocialAuthDropdown`, `SkillSelectorButton`, `WordCloud/telemetry` |
| **Impacto** | Funcionalidad incompleta, deuda conocida |
| **Riesgo** | 🟡 Medio para OAuth (feature gap) |
| **Urgencia** | OAuth = Alta cuando se active Auth epic |
| **Esfuerzo estimado** | Variable por TODO |

#### TD-M5: Barrels Mixtos (index.js/index.ts)

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | 24 barrels en JS vs 49 en TS. Hooks y algunos atoms usan barrels JS. |
| **Área afectada** | `src/hooks`, `src/ui/atoms` |
| **Impacto** | Inconsistencia, posibles issues de tree-shaking |
| **Riesgo** | 🟢 Bajo |
| **Urgencia** | Baja |
| **Esfuerzo estimado** | 2 horas |

---

### 🟢 Baja (Puede esperar)

#### TD-L1: Skeletons Dispersos

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | 30 archivos skeleton.jsx/tsx distribuidos en componentes. Funciona pero podría consolidarse. |
| **Área afectada** | `src/ui/` |
| **Impacto** | Mínimo - patrón funcional |
| **Riesgo** | 🟢 Bajo |
| **Urgencia** | Muy baja |
| **Esfuerzo estimado** | No recomendado ahora |

#### TD-L2: State Providers en JSX

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | 3 providers (`ThemeProvider`, `ReduxProvider`, `ReactQueryProvider`) en JSX |
| **Área afectada** | `src/state/providers/` |
| **Impacto** | Mínimo - son wrappers simples |
| **Riesgo** | 🟢 Bajo |
| **Urgencia** | Muy baja |
| **Esfuerzo estimado** | 1 hora |

#### TD-L3: CSS Selectors Duplicados (6)

| Aspecto | Detalle |
|---------|---------|
| **Descripción** | 6 selectores CSS aparecen 2 veces (ej: `.project_title-link`, `.calendar_link`) |
| **Área afectada** | `src/ui/` CSS files |
| **Impacto** | Mínimo - probablemente media queries o variantes legítimas |
| **Riesgo** | 🟢 Bajo |
| **Urgencia** | Muy baja |
| **Esfuerzo estimado** | Investigar antes de actuar |

---

## 3. Recomendaciones Estratégicas

### Refactors Prioritarios (5-7)

| # | Refactor | Prioridad | ROI | Esfuerzo |
|---|----------|-----------|-----|----------|
| R1 | **Completar migración TS de hooks** (barrels + AppSelector/AppDispatch) | Alta | Alto | 2h |
| R2 | **Eliminar componentes deprecated** (Project, FeaturedProject molecules) | Alta | Alto | 30m |
| R3 | **Consolidar logging** - migrar console.* a lib/logger | Media | Medio | 3h |
| R4 | **Migrar providers a TypeScript** | Media | Medio | 1h |
| R5 | **Migrar atoms críticos a TypeScript** (buttons, links usados en todas partes) | Media | Alto | 4h |
| R6 | **Resolver TODOs de OAuth** antes de Epic Auth | Alta (condicional) | Alto | TBD |

### Mejoras de Testing (3-5)

| # | Mejora | Prioridad | Valor |
|---|--------|-----------|-------|
| T1 | **Definir flujos críticos E2E** (navegación menu, overlays, theme) | Alta | Prevención de regresiones |
| T2 | **Documentar test patterns** en CLAUDE.md | Media | Onboarding, consistencia |
| T3 | **Agregar test para menu auto-close** (Story 14-18 fix) | Media | Regresión prevention |
| T4 | **Revisar 30 skeletons** - ¿todos tienen tests? | Baja | Cobertura edge cases |

### Mejoras Estructurales (3-5)

| # | Mejora | Prioridad | Impacto |
|---|--------|-----------|---------|
| S1 | **Documentar regla HYBRID_EPIC** en proceso BMAD | Alta | Process clarity |
| S2 | **Crear épica Test Health** como backlog | Media | Deuda explícita |
| S3 | **Actualizar component-inventory.md** post-Epic 14 | Baja | Documentation sync |
| S4 | **Agregar ADR para decision de no-Auth en Epic 14** | Baja | Decision record |

---

## 4. Propuesta de Roadmap Técnico

### Opciones Evaluadas

| Opción | Descripción | Pros | Contras |
|--------|-------------|------|---------|
| A | **Auth Epic (Epic 15)** | Avanza features, valor de negocio | Sobre base con 50% JS |
| B | **TypeScript Completion Sprint** | Base sólida para Auth | Retrasa features |
| C | **Hardening Híbrido** | Balance pragmático | Complejidad de tracking |
| D | **Test Health Epic** | Elimina ruido E2E | No avanza producto |

### Recomendación: Opción C - Hardening Híbrido (1 sprint)

**Justificación:**
1. La deuda no es crítica - no bloquea Auth
2. Pero 50% JS en UI layer es riesgo para refactors futuros
3. Auth va a tocar UI (modals, session states) - mejor tipado antes

**Plan Propuesto:**

```
Sprint Hardening (1 semana):
├── Día 1-2: R1 + R2 (hooks TS + delete deprecated) ✅ Quick wins
├── Día 3: R4 + R5 parcial (providers + atoms críticos)
├── Día 4: R3 (consolidar logging)
├── Día 5: T1 + T2 (E2E flows + docs)
└── Buffer: Resolver blockers

Siguiente: Epic 15 - Auth System
```

### Orden Recomendado

1. **Hardening Sprint** (1 semana) - limpiar antes de Auth
2. **Epic 15: Auth System** - con base más sólida
3. **Test Health Epic** (opcional, post-Auth) - si hay tiempo

### Alternativa Aceptable

Si la presión de negocio es alta:
- Skip hardening sprint
- Ir directo a Auth
- Aceptar que refactors en Auth serán más lentos por falta de tipos
- Planificar cleanup post-Auth

---

## 5. Cloudy Index (Índice de Calidad)

### Evaluación Actual

| Dimensión | Score | Notas |
|-----------|-------|-------|
| **Funcionalidad** | 9/10 | Todo funciona, 818 tests passing |
| **Mantenibilidad** | 7/10 | 50% JS reduce confianza en refactors |
| **Testabilidad** | 9/10 | Excelente cobertura unit + E2E |
| **Documentación** | 8/10 | Buena, podría mejorar post-epic |
| **Consistencia** | 7/10 | Mixto TS/JS, algunos patterns legacy |
| **Escalabilidad** | 7/10 | Domains sólidos, UI layer menos preparada |

### **Cloudy Index Global: 7.8/10**

**Interpretación:** Proyecto saludable con espacio de mejora claro. No hay emergencias, pero tampoco es un codebase "limpio" al 100%.

### Acciones para Subir a 8.5+

1. Completar migración TypeScript (UI layer) → +0.5
2. Eliminar código deprecated → +0.2
3. Consolidar logging → +0.1
4. Documentar patterns post-epic → +0.2

---

## Conclusión

> **"Este es el estado real del proyecto hoy: operativo, testeado, con deuda puntual no crítica. La deuda que vale la pena pagar es la migración TypeScript de UI antes de Auth. El camino lógico: 1 sprint de hardening, luego Auth Epic."**

### Decisión Clave Pendiente

¿Hardening sprint antes de Auth, o directo a Auth aceptando la deuda?

**Recomendación del Analyst:** Hardening sprint. El costo de 1 semana se recupera en velocidad y confianza durante Auth.

---

**Documento Generado:** 2026-02-07
**Analyst:** BMAD Technical/Product Analyst
**Próxima Revisión:** Post-Epic 15 (Auth)
