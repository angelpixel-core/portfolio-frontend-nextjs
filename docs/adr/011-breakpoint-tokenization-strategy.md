# ADR-011: Breakpoint Tokenization Strategy

**Date:** 2026-02-18
**Status:** Accepted
**Story:** 25.0 — ADR — CSS Convention Decisions
**Epic:** 25 — Architectural Coherence Sprint

## Context

El proyecto ya define 7 tokens de breakpoint en `tailwind.config.js`:

```
phablet: 400px, mobile: 480px, tablet: 640px, nav: 800px,
stage: 960px, desktop: 1025px, wide: 1441px
```

Sin embargo, el codebase utiliza 5 valores `min-width` crudos (560/720/768/880/1024) sin tokens oficiales. Esto genera ambigüedad semántica: se usan para comportamientos distintos (tipografía, reflow de contenido, navegación y detalles) pero no existe una nomenclatura consistente.

**Estado actual:** 7 tokens definidos, 5 valores crudos usados en el código. El objetivo es convertir esos valores en tokens explícitos, con semántica clara, y dejar documentada la decisión de 1024→desktop.

## Decision

### 1) Nuevos tokens y mapeo de valores crudos

| Raw value | Token                        | Rationale                                           | Nota                                                                                                                |
| --------- | ---------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 560px     | `compact`                    | Paso de tipografía progresiva entre mobile y tablet | Se consideró `spacious` como alternativa; `compact` se elige por describir el rango aún compacto respecto a tablet. |
| 720px     | `expanded`                   | Expansión de UI secundaria (auth/social/filters)    | Indica que elementos secundarios “se expanden” al viewport.                                                         |
| 768px     | `prose`                      | Reflow de contenido/lectura (legacy Tailwind `md`)  | Dedicado a layout de texto/artículos.                                                                               |
| 880px     | `details`                    | Aparición de detalles de navegación                 | Separa “nav aparece” (800) de “detalles visibles” (880).                                                            |
| 1024px    | `desktop` (existente 1025px) | Se acepta el shift de 1px                           | **Impacto iPad:** 1024px queda en layout tablet/nav; decisión explícita e intencional.                              |

**Regla de naming:** todos los tokens son una sola palabra en minúscula (coherente con `phablet`, `mobile`, `tablet`, `nav`, `stage`, `desktop`, `wide`).

### 2) Distinción semántica 720px vs 768px

`expanded` (720px) activa UI secundaria: auth en header, social links visibles, filtros disponibles. `prose` (768px) activa reflow de contenido/lectura. La separación de 48px es intencional (misma filosofía que ADR-002 con phablet/mobile).

### 3) Sintaxis obligatoria para media queries

Para nuevos usos se exige la forma:

```
@media screen(token) { ... }
```

Esta sintaxis hace explícito el token y evita valores crudos dispersos.

### 4) Exclusiones

- WordCloud queda fuera de esta migración.
- Contenedores con `max-width` pueden mantener valores crudos (son restricciones de layout, no de breakpoint semántico).

### 5) Escala completa (12 tokens)

**Tabla completa (incluye base sin prefijo):**

| Orden | Token              | Valor  |
| ----: | ------------------ | ------ |
|     0 | base (sin prefijo) | 0px    |
|     1 | phablet            | 400px  |
|     2 | mobile             | 480px  |
|     3 | compact            | 560px  |
|     4 | tablet             | 640px  |
|     5 | expanded           | 720px  |
|     6 | prose              | 768px  |
|     7 | nav                | 800px  |
|     8 | details            | 880px  |
|     9 | stage              | 960px  |
|    10 | desktop            | 1025px |
|    11 | wide               | 1441px |

**Escala en progresión (formato resumido):**

```
phablet(400) → mobile(480) → compact(560) → tablet(640) →
expanded(720) → prose(768) → nav(800) → details(880) →
stage(960) → desktop(1025) → wide(1441)
```

### 6) Nota de enforcement futuro

El uso de `min-width` crudo en CSS será candidato a regla de lint (no en este epic). Dejar breadcrumb para Story 25.5 / futura historia DX.

### 7) Notas para Story 25.5 (implementación)

- Agregar comentarios inline en `tailwind.config.js` con el trigger semántico por token (ej: `// auth, social, filters expand` junto a `expanded`).
- El mensaje de commit debe mencionar explícitamente el cambio de comportamiento en iPad landscape (1024px).
- Documentos dependientes a actualizar en 25.5: `docs/architecture/styles-architecture.md`, `docs/layout-system.md`, `CLAUDE.md`.

### 8) Cheat sheet rápido

| ¿Qué querés lograr?                  | Token recomendado                |
| ------------------------------------ | -------------------------------- |
| Escalar tipografía mobile            | `phablet` / `mobile` / `compact` |
| Mostrar sidebar/contenido secundario | `expanded`                       |
| Reflow de artículos/lectura          | `prose`                          |
| Mostrar items de navegación          | `nav` / `details`                |
| Layout desktop completo              | `desktop`                        |

## Consequences

### Positive

- Nomenclatura explícita para todos los breakpoints usados en producción.
- Reduce la ambigüedad entre “contenido secundario” vs “reflow de lectura”.
- Reglas de naming consistentes con tokens existentes.

### Negative

- No hay enforcement automático aún (requiere lint futuro).
- 1px shift (1024→1025) requiere comunicación de QA.

## References

- ADR-002: Breakpoint Standardization
- `tailwind.config.js` (líneas 59–78)
- `docs/architecture/styles-architecture.md`
- Epic 25 — Architectural Coherence Sprint
