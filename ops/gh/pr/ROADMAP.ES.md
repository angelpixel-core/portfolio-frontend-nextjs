# Hoja de Ruta de Operaciones de PR (Español)

## Contexto

Este directorio gestiona el flujo de documentos de Pull Request para este repositorio:

- Generar documentos de PR (`new.sh`)
- Persistir PRs en GitHub (`create.sh`)
- Promover draft a ready-for-review (`promote.sh`)

La implementación actual vive en este repo, preservando el historial de documentos en git.

## Límite de Dominio

Subdominio: `ops/gh/pr`

Responsabilidad:

- Ciclo de vida del documento de PR y persistencia de metadata.
- Creación/promoción idempotente de PRs en GitHub según `base/head` + frontmatter.

Fuera de alcance:

- Workflows de despliegue CI/CD.
- Publicación de versiones de artefactos de aplicación.

## Estado Actual

- Contrato Markdown + frontmatter activo y utilizado por scripts.
- Convención de nombres para estado draft y ready.
- Metadata de PR persistida en frontmatter (`pr_number`, `pr_url`, `pr_state`).

## Estado Objetivo

Extraer operaciones de PR a tooling reusable externo (`angelpixel-core/gh-ops`) manteniendo el historial de documentos en cada proyecto.

### Se mantiene en cada repo de aplicación

- `ops/gh/pr/queue/*.md` (histórico de documentos PR)
- overrides locales de plantilla (`template.md`) si hacen falta
- archivo de configuración local (futuro): `.gh-ops.yml`

### Se mueve al tooling externo

- implementación de comandos (`new`, `create`, `promote`)
- motor de validación de frontmatter y naming
- lógica de idempotencia e integración con GitHub

## Contrato Estable (debe mantenerse compatible)

### Patrones de nombre

- Draft: `YYYY-MM-DD__base-to-head__slug__draft.md`
- Ready: `YYYY-MM-DD__base-to-head__slug__<sha7>.md`

### Frontmatter requerido

- `base`
- `head`
- `title`

### Metadata persistida

- `pr_number`
- `pr_url`
- `pr_state` (`draft|ready`)
- `created_at`
- `last_synced_at`

## Plan de Extracción Progresiva

### Fase 1 - Congelar Contrato

- Bloquear naming + claves de frontmatter.
- Mantener scripts locales como comportamiento de referencia.
- Agregar fixtures para documentos draft y ready.

### Fase 2 - Bootstrap de CLI Externa

- Crear CLI `gh-ops` con `pr new/create/promote`.
- Portar el comportamiento idempotente exacto.
- Agregar tests de parser + wrappers de comandos GitHub.

### Fase 3 - Adopción en Repos

- Reemplazar implementación local por wrappers finos (o llamadas directas al CLI).
- Mantener docs y queue dentro del repo.
- Validar que no haya regresiones de flujo.

### Fase 4 - Separación Final

- Remover duplicación de implementación local.
- Mantener únicamente docs de integración y overrides opcionales.

## Reglas de Idempotencia

- Antes de crear PR, resolver PR existente por `base/head`.
- Re-ejecutar `create` no debe duplicar PRs.
- Re-ejecutar `promote` sobre PR ready debe ser no-op.
- El frontmatter debe actualizarse tras cada operación.

## Riesgos y Mitigaciones

- **Riesgo:** deriva del parser entre repos.
  - **Mitigación:** tests de contrato con fixtures markdown.
- **Riesgo:** cambios en forma de API/CLI de GitHub.
  - **Mitigación:** encapsular llamadas `gh` detrás de adaptadores estables + tests de integración.
- **Riesgo:** mezcla de rutas locales.
  - **Mitigación:** path raíz configurable con defaults.

## Criterios de Aceptación

- El CLI externo reproduce el comportamiento actual en este repo.
- El historial de documentos PR permanece en el git del repo de aplicación.
- No se duplican PRs al repetir `create`.
- La promoción draft-to-ready es idempotente.
