---
id: articles-blocks-editor-plan
aliases: []
tags: [articles, admin, content, assets]
---

# Plan: Editor visual de artículos por bloques

## Objetivo

- [x] Tener artículos con contenido estructurado, no Markdown/MDX libre.
- [x] Soportar secciones dinámicas dentro de un artículo.
- [x] Permitir imágenes opcionales por bloque y posiciones flexibles.
- [x] Mantener una imagen hero por artículo para reutilizar en card + detalle.
- [x] Poder operar todo desde el dashboard administrativo.
- [x] Tener un comando/CLI para crear un usuario admin local si no existe.

## Decisión de diseño

- [x] Modelo normalizado por bloque, no JSONB para el contenido editorial.
- [x] Imágenes persistidas como assets externos, no dentro de la DB.
- [x] `content_asset` se usa como metadato de storage y referencia de archivo.
- [x] El hero del artículo sigue siendo el asset principal reutilizado en listing + detail.
- [x] Las imágenes internas pertenecen a un único artículo o proyecto.
- [x] El editor debe ser visual por bloques, no un textarea Markdown.

## Alcance inicial

### Artículos

- [x] Título, slug, summary, status, published_at y metadata base siguen en `content_article`.
- [x] El hero se mantiene en `hero_asset_id`.
- [x] El cuerpo del artículo se mueve a una tabla de bloques ordenados.
- [x] Cada bloque puede tener texto, imagen opcional y layout propio.
- [x] Los bloques pueden renderizarse en diferentes posiciones de media.
- [x] Agregar acción `New article` en el listado del admin.
- [x] Abrir un formulario vacío en la misma página antes de persistir.
- [x] Mostrar labels visibles y ayuda contextual en todos los inputs del editor.

### Projects

- [x] El patrón debe ser extensible a projects.
- [x] No mezclar la propuesta de artículos con una refactorización total de projects.

## Modelo de datos propuesto

### `content_article`

- [x] Mantener campos base del artículo.
- [x] Mantener `hero_asset_id` para portada.
- [ ] Eliminar `content` libre cuando el renderer por bloques esté estable.

### `content_article_block`

- [ ] `id` primary key.
- [ ] `article_id` FK a `content_article`.
- [ ] `position` / `sort_order` para el orden visual.
- [ ] `block_type` (`text`, `image`, `quote`, `callout`, `code`, `divider`).
- [ ] `title` opcional.
- [ ] `body` opcional.
- [ ] `image_asset_id` opcional FK a `content_asset`.
- [ ] `image_ref` opcional para fallback visual o copy interno.
- [ ] `image_alt` opcional.
- [ ] `image_position` (`top`, `left`, `right`, `bottom`).
- [ ] `caption` opcional.
- [ ] `created_at`, `updated_at`.

## Storage de imágenes

- [x] Usar `content_asset` como metadato de archivos.
- [x] En producción, persistir imágenes en un storage externo.
- [x] `Vercel Blob` ya existe en el repo como camino principal.
- [x] En local, mantener un camino funcional para desarrollo sin bloquear el editor.
- [ ] Definir si local usará Blob también o un adapter filesystem-only.
- [x] Asegurar que la UI admin suba y asocie assets al bloque correcto.

## Admin bootstrap

- [x] Agregar CLI para bootstrap de usuario admin local.
- [x] Crear usuario si no existe.
- [x] Asignar email/password para login local.
- [x] Registrar el email en `ADMIN_EMAILS` o dejarlo listo para el resolver transitorio.
- [x] Documentar el comando en `docs/` y en scripts/package.json.

## Plan de trabajo

### Fase 1 — Schema y migración

- [x] Crear tabla `content_article_block`.
- [x] Crear índices por `article_id` y `position`.
- [x] Definir enums/constraints para `block_type` e `image_position`.
- [x] Mantener compatibilidad con `content_article.content` mientras dure la transición.
- [x] Agregar fixtures/tests para el nuevo modelo.

### Fase 2 — Writer/admin flow

- [x] Crear página de detalle por artículo en `/admin/content/articles/[id]`.
- [x] Crear editor visual base por bloques dentro de la página de detalle.
- [x] Permitir agregar, reordenar, editar y eliminar bloques.
- [x] Permitir seleccionar o subir imagen para un bloque.
- [x] Agregar `New article` y flujo de alta manual desde el listado.
- [x] Reorganizar el formulario de artículo en secciones legibles con labels.
- [x] Mantener el editor de bloques como formulario simple primero.
- [ ] Evolucionar el editor de bloques a una UI más visual por cards/preview cuando el flujo simple esté estable.
- [ ] Permitir reutilizar el hero asset dentro del artículo cuando aplique.
- [ ] Mostrar fallback visual cuando no haya imagen recuperable.

### Fase 3 — Reader/public flow

- [ ] Renderizar bloques en `/articles/[slug]`.
- [ ] Soportar media arriba, izquierda, derecha y abajo.
- [ ] Mantener el hero arriba del artículo y reutilizarlo en la card.
- [ ] Mantener SEO/metadata compatibles con la vista actual.

### Fase 4 — Migration/backfill

- [ ] Migrar el contenido actual de artículos al formato por bloques.
- [ ] Conservar compatibilidad temporal con los artículos legacy.
- [ ] Validar que el listing y el detalle muestren exactamente el mismo contenido visible.

### Fase 5 — Hardening

- [ ] Agregar tests unitarios para el renderer por bloques.
- [ ] Agregar tests de admin para crear/editar bloques.
- [ ] Agregar smoke E2E del flujo admin + publicación.
- [ ] Documentar el flujo operativo para local y producción.

## Criterios de aceptación

- [ ] Un artículo puede tener N bloques sin límite artificial práctico.
- [ ] Un bloque puede tener imagen o no.
- [ ] Un bloque puede cambiar la posición de la imagen.
- [ ] El hero del artículo se usa en card y detalle.
- [ ] El admin local puede arrancar sin intervención manual extra.
- [ ] Las imágenes de artículos/proyectos quedan almacenadas fuera de la DB.
- [x] El admin puede crear un artículo nuevo sin usar el flujo público de registro.
- [x] El formulario del editor expone labels y ayuda contextual suficientes para operar sin ambigüedad.

## Riesgos y mitigaciones

- [ ] Riesgo: demasiada complejidad en el editor.
  - [ ] Mitigación: empezar con bloques simples y agregar tipos después.
- [ ] Riesgo: divergencia entre hero y bloques.
  - [ ] Mitigación: tratar hero como asset principal del artículo, no como bloque especial duplicado.
- [ ] Riesgo: assets huérfanos.
  - [ ] Mitigación: política de cleanup explícita, no borrado automático al inicio.

## Notas

- [x] Esta propuesta prioriza control editorial y consistencia estructural.
- [x] La normalización por bloque es la base para que el dashboard admin pueda crecer sin depender de Markdown.
- [x] Projects puede adoptar el mismo patrón más adelante, pero sin mezclar la migración inicial.
