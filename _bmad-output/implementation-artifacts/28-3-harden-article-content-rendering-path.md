# Story 28.3: Harden Article Content Rendering Path

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como owner de plataforma,
quiero endurecer el path de renderizado de contenido de articulos,
para reducir riesgo XSS y mantener una presentacion segura y consistente del article body.

## Acceptance Criteria

1. Se reemplaza el path ad-hoc de sanitizacion/render (escape manual + `dangerouslySetInnerHTML` para parrafos) por un enfoque vetado y mantenible en `src/ui/organisms/ArticleContent/index.tsx`.
2. El nuevo path mantiene paridad funcional de render para headings, parrafos, listas, inline code y code blocks.
3. Se agregan tests de seguridad focalizados para payloads hostiles (por ejemplo `script`, atributos `on*`, enlaces `javascript:`) y se verifica neutralizacion.
4. El cambio mantiene compatibilidad con arquitectura vigente (React 18 + Next.js App Router + testing stack actual) sin romper quality gates.
5. Validacion post-cambio confirma `lint`, `typecheck`, tests afectados y build en verde.

## Tasks / Subtasks

- [ ] Task 1: Definir y aplicar estrategia de render seguro vetada (AC: 1,4)
  - [ ] 1.1 Diseñar reemplazo del parser/sanitizer ad-hoc en `ArticleContent` con enfoque de libreria vetada.
  - [ ] 1.2 Implementar path seguro evitando HTML inseguro sin control explicito de schema/allowlist.
  - [ ] 1.3 Preservar compatibilidad con estructura actual del componente y props del dominio `Article`.

- [ ] Task 2: Asegurar paridad funcional del article body (AC: 2)
  - [ ] 2.1 Verificar render correcto de headings, parrafos, listas y bloques de codigo.
  - [ ] 2.2 Verificar inline code y comportamiento de `CodeBlock` sin regresion visual/semantica.

- [ ] Task 3: Endurecer cobertura de seguridad en tests (AC: 3)
  - [ ] 3.1 Agregar casos hostiles en `ArticleContent` tests para vector `script` y atributos de evento.
  - [ ] 3.2 Agregar caso de URL peligrosa (`javascript:`) y validar sanitizacion/neutralizacion esperada.
  - [ ] 3.3 Asegurar que los asserts confirmen ausencia de ejecucion de payload y salida render segura.

- [ ] Task 4: Validacion de quality gates y trazabilidad (AC: 5)
  - [ ] 4.1 Ejecutar `npm run lint`.
  - [ ] 4.2 Ejecutar `npm run typecheck`.
  - [ ] 4.3 Ejecutar test suite afectada (incluyendo tests de `ArticleContent`).
  - [ ] 4.4 Ejecutar `npm run build`.
  - [ ] 4.5 Registrar evidencia tecnica y decisiones de seguridad en story/changelog.

## Dev Notes

### Technical Requirements

- Esta story implementa TD-01.3 dentro de Epic 28 (P0 security hardening).
- El objetivo principal es eliminar el path de sanitizacion manual con innerHTML ad-hoc y migrar a enfoque vetado.
- Debe mantenerse el soporte de formato actual del article body (markdown-like rendering existente).

### Architecture Compliance

- Mantener stack actual: Next.js App Router + React 18 + TypeScript estricto.
- Evitar regresiones en contratos de UI/organism existentes (`ArticleContent`, `CodeBlock`, `SocialShareButtons`).
- No introducir bypasses de seguridad por conveniencia (sin `allowDangerousHtml` sin sanitizacion explicita).

### Library / Framework Requirements

- Referencia tecnica actualizada:
  - `react-markdown` es seguro por default y recomienda `rehype-sanitize` para hardening adicional de contenido transformado por plugins.
  - DOMPurify / isomorphic-dompurify permite esquema de allowlist (`ALLOWED_TAGS`, `ALLOWED_ATTR`) para sanitizacion controlada.
- Seleccionar una estrategia coherente con React/Next.js y con testing reproducible en Jest.

### File Structure Requirements

- Archivos primarios esperados para implementacion:
  - `src/ui/organisms/ArticleContent/index.tsx`
  - `src/ui/organisms/ArticleContent/__tests__/ArticleContent.test.tsx`
  - `src/ui/organisms/ArticleContent/CodeBlock.tsx` (si se ajusta contrato de render)
  - `package.json` (solo si se agrega dependencia vetada)
  - `_bmad-output/implementation-artifacts/28-3-harden-article-content-rendering-path.md`

### Testing Requirements

- Cobertura minima requerida para esta story:
  - tests de render funcional (paridad de contenido)
  - tests de seguridad para payloads hostiles (script, handlers on\*, javascript:)
- Validaciones obligatorias post-cambio:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test -- src/ui/organisms/ArticleContent/__tests__/ArticleContent.test.tsx` (o suite equivalente afectada)
  - `npm run build`

### Previous Story Intelligence

- Story 28.2 establecio patron de hardening con commits atomicos por concern (logica, tests, docs, status).
- Leccion aplicada: primero enforce de seguridad, luego paridad funcional, luego evidencia automatizada en tests.
- Leccion aplicada: evitar validaciones solo manuales; ACs de seguridad deben tener pruebas automatizadas claras.

### Git Intelligence Summary

- Commits recientes relevantes (patron de trabajo del epic):
  - `cfec9e0` docs(review): approve 28-2 and mark story done
  - `4fbc07d` chore(test): remove unused import in security gate tests
  - `4fb7102` fix(security): enforce seven-day waiver validity window
  - `309074f` test(security): cover runtime gate full-flow outcomes
  - `0ac6449` fix(security): require traceable waiver issue reference
- Patron vigente: cambios pequenos, verificables y atomicos por hallazgo/riesgo.

### Latest Technical Information

- `react-markdown`:
  - seguro por default en render markdown.
  - si se habilita HTML crudo (`rehype-raw`), se recomienda `rehype-sanitize` para controlar XSS.
- DOMPurify / isomorphic-dompurify:
  - sanitizacion robusta de HTML no confiable.
  - permite esquema de allowlist de tags/atributos para enforcement estricto.
- GitHub Actions y npm audit semantica relevante ya consolidada en Epic 28 para mantener quality signals confiables.

### Project Context Reference

- No se detecto `project-context.md`.
- Fuentes canonicas para esta story:
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`
  - `docs/release/technical-debt-backlog.md`
  - `docs/release/production-readiness-audit.md`
  - `docs/release/deployment-work-items-template.md`
  - `src/ui/organisms/ArticleContent/index.tsx`
  - `src/ui/organisms/ArticleContent/__tests__/ArticleContent.test.tsx`
  - `_bmad-output/planning-artifacts/architecture.md`

### References

- Story source / ACs TD-01.3: `docs/release/technical-debt-backlog.md`
- Work item mapping TD-01.3: `docs/release/deployment-work-items-template.md`
- Riesgo R4 (content safety): `docs/release/production-readiness-audit.md`
- Estado sprint/story key: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Componente target: `src/ui/organisms/ArticleContent/index.tsx`
- Tests target: `src/ui/organisms/ArticleContent/__tests__/ArticleContent.test.tsx`
- Arquitectura base y quality gates: `_bmad-output/planning-artifacts/architecture.md`
- Story previa del epic: `_bmad-output/implementation-artifacts/28-2-add-dependency-security-gate-to-ci.md`

## Dev Agent Record

### Agent Model Used

openai/gpt-5.3-codex

### Debug Log References

- N/A

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List

- `_bmad-output/implementation-artifacts/28-3-harden-article-content-rendering-path.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-03-05: Story creada en estado `ready-for-dev` con contexto tecnico de hardening de render de contenido y guardrails de implementacion.
