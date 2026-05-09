---
id: 06-assets-migration-plan
aliases: []
tags: []
---

# Assets Migration Plan (Articles first, then Projects)

## Objetivo

- [x] Normalizar gestión de imágenes en una tabla de assets.
- [x] Mantener compatibilidad temporal con `content_article.img` para no romper producción.
- [x] Reutilizar el patrón para `projects` en una segunda fase.

## Alcance de Fase A (mínimo útil, bajo riesgo)

- [x] Crear tabla `content_asset` (o `media_asset`) para metadatos de archivos.
- [x] Agregar columna `hero_asset_id` nullable en `content_article`.
- [x] Mantener columna legacy `content_article.img` como fallback transitorio.
- [x] Preparar lectura dual: `hero_asset.url` primero, `img` como fallback.

## Modelo de datos propuesto

### Tabla `content_asset`

- [x] `id` (uuid/text primary key)
- [x] `url` (text not null)
- [x] `provider` (text not null, ej: `vercel-blob`)
- [x] `provider_key` (text not null, ruta/clave interna del provider)
- [x] `mime_type` (text not null)
- [x] `size_bytes` (integer/bigint, opcional al inicio)
- [x] `width` (integer, opcional)
- [x] `height` (integer, opcional)
- [x] `alt` (text, opcional)
- [x] `created_at`, `updated_at`

### Cambios en `content_article`

- [x] Agregar `hero_asset_id` nullable.
- [x] FK `hero_asset_id -> content_asset.id`.
- [x] Índice en `hero_asset_id`.

## Plan de migración por fases

### Phase 1 — Additive schema (sin romper)

- [x] Crear migración SQL para `content_asset`.
- [x] Crear migración SQL para `content_article.hero_asset_id` + FK + índice.
- [x] Aplicar migraciones en entorno local/staging.
- [x] Verificar que el flujo actual siga funcionando sin cambios de datos.

### Phase 2 — Backfill de artículos existentes

- [x] Definir estrategia de backfill (script SQL o job app-level).
- [x] Para cada artículo con `img`, crear asset y setear `hero_asset_id`.
- [x] Registrar `provider` y `provider_key` cuando sea posible.
- [x] Validar conteo: artículos con `img` vs artículos con `hero_asset_id`.

Consulta sugerida para validación post-backfill:

```sql
SELECT
  COUNT(*) FILTER (WHERE img IS NOT NULL AND img <> '') AS articles_with_img,
  COUNT(*) FILTER (WHERE hero_asset_id IS NOT NULL) AS articles_with_hero_asset,
  COUNT(*) FILTER (WHERE hero_asset_id IS NULL AND img IS NOT NULL AND img <> '') AS pending_backfill
FROM content_article;
```

### Phase 3 — Lectura y escritura dual

- [x] Actualizar model/query para devolver `heroImageUrl` efectivo:
  - [x] `hero_asset.url` si existe.
  - [x] fallback a `img` si no existe.
- [x] Actualizar admin upload:
  - [x] crear registro en `content_asset` al subir imagen.
  - [x] asignar `hero_asset_id` en artículo.
  - [x] mantener `img` en paralelo durante transición (opcional recomendado).

### Phase 4 — Hardening y cleanup

- [x] Métricas/queries para detectar artículos sin `hero_asset_id`.
- [x] Política de reemplazo de imagen (sin delete automático por ahora).
- [x] Definir proceso de limpieza de assets huérfanos.

Runbooks agregados en Phase 4:

- `npm run db:prod:metrics:assets:phase4` — KPIs de cobertura, mismatch y huérfanos.
- `npm run db:prod:list:orphan-assets` — listado de assets sin referencias.
- `npm run db:prod:cleanup:orphan-assets` — limpieza controlada (por defecto `DRY_RUN=true`).

Política actual de reemplazo de imagen:

- Reemplazar imagen **no borra automáticamente** el asset anterior.
- Cleanup se ejecuta por lote y con antigüedad mínima (`MIN_AGE_DAYS`, default 7).
- Para ejecutar borrado real: `DRY_RUN=false npm run db:prod:cleanup:orphan-assets`.

### Phase 5 — Cutover final (cuando la cobertura sea 100%)

- [ ] Evaluar hacer `hero_asset_id` non-null (si aplica al negocio).
- [ ] Marcar `img` como deprecated.
- [ ] Eliminar `img` en migración posterior cuando no haya consumidores.

### Pre-Phase 5 — Data source alignment (mock -> fixtures)

Contexto detectado:

- El dashboard admin (`/admin/content/articles`) usa DB real.
- El sitio público (`/articles`) todavía puede usar fallback de `mock.ts` en runtime.
- Esto genera desalineación visual/operativa entre contenido administrado y contenido publicado.

Objetivo de esta etapa:

- Dejar DB como única fuente en runtime productivo.
- Mover mocks de dominio a fixtures para tests.
- Mantener testabilidad sin acoplar tests a datos de producción.

Paso a paso (implementación propuesta):

1) Alinear fuente pública a DB (runtime)

- [x] Cambiar `useArticles`/`useArticleBySlug` para que en runtime productivo no usen fallback mock por defecto.
- [x] Respetar variable explícita de desarrollo para habilitar fallback solo local si se necesita (opt-in, no default).
- [ ] Verificar `/articles` y `/articles/[slug]` contra datos de admin DB.

2) Extraer mocks a fixtures de test

- [x] Crear carpeta de fixtures (ej. `src/test-utils/fixtures/articles/`).
- [x] Mover contenido de `src/domains/article/model/mock.ts` a fixture(s) versionables para test.
- [x] Actualizar tests unitarios/integración que consumen mock de dominio para usar fixtures explícitos.

Estado actual Step 2:

- Se creó `src/test-utils/fixtures/articles/articles.fixture.ts` como fuente explícita de datos para tests.
- Se migraron tests de hooks de artículos para usar fixtures + mocks de modelo (sin depender de fallback runtime).

3) Limpiar consumo de mock en código de dominio

- [x] Eliminar dependencia directa a `mock.ts` en `src/domains/article/model/index.ts` para runtime normal.
- [x] Mantener helper de test/dev aislado (sin afectar build de producción).
- [x] Asegurar que fallos de API/DB no se enmascaren con fallback implícito en producción.

Estado actual Step 3:

- `src/domains/article/model/index.ts` usa `getArticleDevData()` solo cuando `useMockFallback=true`.
- `src/domains/article/model/devData.ts` encapsula el import de mock para contexto dev/test.

4) Validación funcional y técnica

- [ ] Verificar que artículos visibles en admin sean exactamente los mostrados en `/articles`.
- [ ] Verificar filtros de publicación (`status`, `visible`, `published_at`) sobre datos de DB.
- [ ] Ejecutar `npm run typecheck`, `npm test` y smoke E2E de navegación de artículos.

5) Criterio de salida para iniciar Phase 5

- [ ] Runtime productivo sin fallback mock implícito.
- [ ] Tests usando fixtures (no mock de dominio runtime).
- [ ] Paridad confirmada entre dashboard admin y listing público.
- [ ] Sin regresiones en filtros de publicación ni render de imágenes (asset URL + fallback controlado).

## Criterios de aceptación

- [x] Se pueden subir imágenes dinámicas y asociarlas a artículos sin redeploy.
- [x] Listado y detalle de artículo usan una única imagen principal consistente.
- [x] No se rompe compatibilidad con artículos legacy durante la transición.
- [x] El plan queda replicable para `content_project`.

## Extensión a Projects (Fase B)

- [x] Agregar `hero_asset_id` en `content_project`.
- [x] Reutilizar `content_asset` sin duplicar tablas.
- [x] Reusar upload endpoint/patrón con scope `projects`.
- [x] Aplicar backfill de `content_project.img` hacia assets.

## Riesgos y mitigaciones

- [x] Riesgo: datos parciales en transición.
  - [x] Mitigación: lectura dual con fallback.
- [x] Riesgo: pérdida de referencia al reemplazar imagen.
  - [x] Mitigación: no borrar automático; cleanup posterior controlado.
- [x] Riesgo: inconsistencias entre `img` y `hero_asset_id`.
  - [x] Mitigación: priorizar `hero_asset_id` en lectura y auditar divergencias.

## Notas de implementación

- [x] Mantener enfoque incremental (migraciones aditivas primero).
- [x] Evitar Big Bang refactor hacia block-based CMS en esta etapa.
- [x] Usar este plan como base para el roadmap hacia `content_entries/content_blocks/assets`.
