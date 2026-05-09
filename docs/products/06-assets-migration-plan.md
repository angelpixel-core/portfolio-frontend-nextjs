---
id: 06-assets-migration-plan
aliases: []
tags: []
---

# Assets Migration Plan (Articles first, then Projects)

## Objetivo

- [ ] Normalizar gestión de imágenes en una tabla de assets.
- [ ] Mantener compatibilidad temporal con `content_article.img` para no romper producción.
- [ ] Reutilizar el patrón para `projects` en una segunda fase.

## Alcance de Fase A (mínimo útil, bajo riesgo)

- [x] Crear tabla `content_asset` (o `media_asset`) para metadatos de archivos.
- [x] Agregar columna `hero_asset_id` nullable en `content_article`.
- [x] Mantener columna legacy `content_article.img` como fallback transitorio.
- [ ] Preparar lectura dual: `hero_asset.url` primero, `img` como fallback.

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
- [ ] Aplicar migraciones en entorno local/staging.
- [ ] Verificar que el flujo actual siga funcionando sin cambios de datos.

### Phase 2 — Backfill de artículos existentes

- [x] Definir estrategia de backfill (script SQL o job app-level).
- [x] Para cada artículo con `img`, crear asset y setear `hero_asset_id`.
- [x] Registrar `provider` y `provider_key` cuando sea posible.
- [ ] Validar conteo: artículos con `img` vs artículos con `hero_asset_id`.

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
- [ ] Actualizar admin upload:
  - [x] crear registro en `content_asset` al subir imagen.
  - [x] asignar `hero_asset_id` en artículo.
  - [x] mantener `img` en paralelo durante transición (opcional recomendado).

### Phase 4 — Hardening y cleanup

- [ ] Métricas/queries para detectar artículos sin `hero_asset_id`.
- [ ] Política de reemplazo de imagen (sin delete automático por ahora).
- [ ] Definir proceso de limpieza de assets huérfanos.

### Phase 5 — Cutover final (cuando la cobertura sea 100%)

- [ ] Evaluar hacer `hero_asset_id` non-null (si aplica al negocio).
- [ ] Marcar `img` como deprecated.
- [ ] Eliminar `img` en migración posterior cuando no haya consumidores.

## Criterios de aceptación

- [ ] Se pueden subir imágenes dinámicas y asociarlas a artículos sin redeploy.
- [ ] Listado y detalle de artículo usan una única imagen principal consistente.
- [ ] No se rompe compatibilidad con artículos legacy durante la transición.
- [ ] El plan queda replicable para `content_project`.

## Extensión a Projects (Fase B)

- [x] Agregar `hero_asset_id` en `content_project`.
- [x] Reutilizar `content_asset` sin duplicar tablas.
- [x] Reusar upload endpoint/patrón con scope `projects`.
- [x] Aplicar backfill de `content_project.img` hacia assets.

## Riesgos y mitigaciones

- [ ] Riesgo: datos parciales en transición.
  - [ ] Mitigación: lectura dual con fallback.
- [ ] Riesgo: pérdida de referencia al reemplazar imagen.
  - [ ] Mitigación: no borrar automático; cleanup posterior controlado.
- [ ] Riesgo: inconsistencias entre `img` y `hero_asset_id`.
  - [ ] Mitigación: priorizar `hero_asset_id` en lectura y auditar divergencias.

## Notas de implementación

- [ ] Mantener enfoque incremental (migraciones aditivas primero).
- [ ] Evitar Big Bang refactor hacia block-based CMS en esta etapa.
- [ ] Usar este plan como base para el roadmap hacia `content_entries/content_blocks/assets`.
