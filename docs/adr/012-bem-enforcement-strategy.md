# ADR-012: BEM Enforcement Strategy

**Date:** 2026-02-18
**Status:** Accepted
**Story:** 25.0 — ADR — CSS Convention Decisions
**Epic:** 25 — Architectural Coherence Sprint

## Context

El proyecto usa BEM de forma parcial y presenta múltiples violaciones (single underscore, delimitadores inconsistentes, mezclas con snake_case). El audit identifica **332 clases** con desvíos distribuidos en **45 archivos CSS**. Esto dificulta refactors, rompe la predictibilidad y obliga a resolver naming caso por caso.

## Decision

### 1) Convención oficial

Se adopta estrictamente:

```
block__element--modifier
```

- Doble underscore (`__`) obligatorio para elementos.
- Doble guión (`--`) obligatorio para modifiers.
- Todo en minúsculas, con guiones simples dentro de cada segmento.

### 2) Alcance y volumen

- Alcance total: 332 clases / 45 archivos CSS.
- Enfoque por batches para mantener cambios revisables y con tests controlados.

### 3) Orden de batches

1. `app/` pages
2. `atoms/`
3. `molecules/`
4. `organisms/`
5. `overlays/`

### 4) Estrategia de test por batch

1. Ejecutar renames de clases.
2. `npm test` → se esperan fallos de snapshots.
3. Contar fallos de snapshot y comparar con el esperado del batch:

```
npm test 2>&1 | grep "snapshot" | wc -l
```

4. `npm test -- -u` para actualizar snapshots.
5. Re-ejecutar `npm test` y confirmar todo en verde.
6. Verificación visual en `npm run dev`.

### 5) Exclusiones

- WordCloud queda fuera del alcance.
- No se implementa rule ESLint/stylelint en este epic (candidato futuro).

### 6) Riesgo E2E (selectors CSS)

El test `e2e/about-experiences-education-ux.spec.ts` usa 4 selectores con BEM inválido:

- `.experience_title`
- `.education_title`
- `.experience_history-info`
- `.education_history-info`

Cuando se renombren estas clases, el story debe **actualizar los selectores** o migrar a `data-testid`.

Además, tests de `TransitionEffect` afirman la clase `transition-effect_blade` — también debe renombrarse o migrarse a `data-testid`.

## Consequences

### Positive

- Naming consistente y predecible en toda la base de CSS.
- Refactors y documentación más confiables.
- Facilita automatización futura (linting o codemods).

### Negative

- Cambios masivos con impacto en snapshots y E2E.
- Sin enforcement automático hasta que se implemente lint.

## References

- `docs/architecture/styles-architecture.md`
- Epic 25 — Architectural Coherence Sprint
- Story 25.0 — ADR — CSS Convention Decisions
