# Flujo de PR Ops (Español)

Esta carpeta contiene scripts para gestionar PRs usando documentos Markdown como fuente de verdad.

## Archivos

- `template.md`: plantilla para crear nuevos documentos de PR.
- `new.sh`: crea un documento de PR en `ops/gh/pr/queue/` y lo commitea automáticamente.
- `create.sh`: valida el documento, opcionalmente commitea cambios del documento, crea/recupera el PR y guarda metadata del PR en el frontmatter.
- `promote.sh`: promueve un PR draft a ready-for-review (idempotente).
- `merge.sh`: mergea un PR open/ready, exige checks requeridos en verde por defecto y permite override manual con admin.

## Convención de nombres

Documento draft:

`YYYY-MM-DD__base-to-head__slug__draft.md`

Documento ready:

`YYYY-MM-DD__base-to-head__slug__<sha7>.md`

Ejemplos:

- `2026-05-16__main-to-develop__phase3-guardrails__draft.md`
- `2026-05-16__main-to-develop__phase3-guardrails__4e3b043.md`

## 1) Crear documento de PR

```bash
ops/gh/pr/new.sh --slug phase3-guardrails --base main --head develop --draft
```

Esto hace:

- crea el documento de PR desde plantilla,
- precarga frontmatter,
- agrega lista de commits desde `base..head`,
- hace commit automático con conventional commits:
  - draft: `docs(pr): add PR draft document <slug>`
  - ready: `docs(pr): add PR document <slug>`

## 2) Crear / persistir PR en GitHub

```bash
ops/gh/pr/create.sh --file ops/gh/pr/queue/<archivo>.md
```

Comportamiento:

- Valida nombre de archivo + frontmatter requerido (`base`, `head`, `title`).
- Revisa si el PR ya existe con `gh pr list --base <base> --head <head>`.
- Si el documento tiene cambios, pregunta si querés commitear con:
  - `docs(pr): update PR#XXX document details` (si el PR existe)
  - `docs(pr): update PR document details` (si todavía no existe)
- Si la respuesta no es `Y`, aborta.
- Crea PR draft/ready si no existe.
- Actualiza frontmatter con `pr_number`, `pr_url`, `pr_state`, `last_synced_at`.

## 3) Promover draft a ready-for-review

```bash
ops/gh/pr/promote.sh --file ops/gh/pr/queue/<archivo>.md
```

Comportamiento:

- Usa `pr_number`/`pr_url` desde frontmatter.
- Si faltan, resuelve por `base/head`.
- Si ya está ready, no hace nada.
- Si está draft, ejecuta `gh pr ready <number>`.
- Actualiza frontmatter con `pr_state: ready`.

## 4) Mergear PR (con confirmación)

```bash
ops/gh/pr/merge.sh --file ops/gh/pr/queue/<archivo>.md --method squash --delete-branch false
```

Comportamiento:

- Resuelve el PR desde frontmatter o por `base/head`.
- Bloquea el merge si los checks requeridos no están en verde.
- Permite override manual solo cuando se pasa `--admin`.
- Pide confirmación interactiva `Y/N` antes de mergear.
- Actualiza frontmatter con `pr_state: merged`, `merge_method`, `merged_at`, `merge_commit_sha` y `last_synced_at`.

Para `develop -> main`, los defaults recomendados son:

- `--method squash`
- `--delete-branch false`

## Requisitos

- GitHub CLI instalado y autenticado (`gh auth status`).
- `jq` instalado (los scripts lo usan para parsear JSON de `gh`).

## Notas

- El flujo está pensado para ser idempotente.
- La metadata del PR queda persistida en el mismo documento Markdown.

## Documentos de planificación

- `ROADMAP.ES.md`: plan de extracción y endurecimiento hacia un futuro CLI externo `gh-ops`.
