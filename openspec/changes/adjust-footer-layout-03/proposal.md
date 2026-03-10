# Proposal: Footer Layout 03 Refresh

## Intent

Actualizar el footer al layout definido en `.private/requests/03-footer.md` para mejorar jerarquia visual, claridad de navegacion y consistencia responsive (1/2/3 columnas), sin romper contratos actuales de layout global ni test coverage.

## Scope

### In Scope

- Refactor de estructura en `src/ui/organisms/Footer/index.tsx` para bloques tipograficos `Contact` y `Links`.
- Ajuste responsive en `src/ui/organisms/Footer/styles.css` para layout 1/2/3 columnas con titulos pequenos en uppercase y spacing consistente.
- Agregar bloque inferior de stack tecnologico (lineas "Built with...", "State & Data...", etc.) segun `03-footer.md`.
- Actualizar pruebas afectadas de footer en E2E y contratos CSS.

### Out of Scope

- Rediseno global de otras secciones fuera de footer.
- Cambios de dominio/datos de perfil fuera de lo necesario para labels/links del footer.
- Reescritura completa del sistema de layout de la app.

## Approach

Aplicar refactor incremental sobre el footer existente (sin reemplazo total del componente), manteniendo `data-testid` y contratos de integracion. Primero se adapta markup y estilos; luego se sincronizan tests (E2E + contrato CSS) en el mismo cambio para evitar deuda de sincronizacion UI-test.

## Affected Areas

| Area                                                  | Impact   | Description                                                                              |
| ----------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `src/ui/organisms/Footer/index.tsx`                   | Modified | Reorganizar contenido y semantica de columnas `Contact/Links` + bloque inferior de stack |
| `src/ui/organisms/Footer/styles.css`                  | Modified | Implementar layout responsive 1/2/3 columnas y nueva jerarquia tipografica               |
| `e2e/footer-consistency.spec.ts`                      | Modified | Ajustar expectativas de estructura/visibilidad del nuevo footer                          |
| `e2e/vertical-viewport.spec.ts`                       | Modified | Revalidar que footer permanezca debajo de `main-content`                                 |
| `src/styles/__tests__/layout-migration-wave3.test.ts` | Modified | Sincronizar contrato CSS del footer con nuevas clases/layout                             |

## Risks

| Risk                                                            | Likelihood | Mitigation                                                                   |
| --------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| Regresion en Home por reglas de visibilidad/duplicado de footer | Medium     | Mantener `data-testid`, validar Home especificamente en E2E y viewport tests |
| Fallos de tests por cambio de estructura DOM                    | High       | Actualizar tests en el mismo PR y ejecutar suite de footer + smoke routes    |
| Drift visual entre breakpoints 720/880/960                      | Medium     | Validar matriz responsive con checks de layout y revisiones manuales rapidas |

## Rollback Plan

1. Revertir el commit del refactor de footer (`index.tsx` + `styles.css`).
2. Revertir commit de sincronizacion de tests si fue separado.
3. Ejecutar `npm run lint`, `npm run typecheck`, `npm test` y pruebas E2E de footer para confirmar restauracion.

## Dependencies

- Request source: `.private/requests/03-footer.md`
- Contratos actuales de layout/footer en E2E existentes
- Componentes de links ya usados en footer (`Telegram`, `CopyEmail`, `Author`/social links)

## Success Criteria

- [ ] Footer refleja layout solicitado en `03-footer.md` en mobile/tablet/desktop (1/2/3 columnas)
- [ ] `Contact` y `Links` usan jerarquia tipografica (titulos uppercase + links debajo) sin separadores internos
- [ ] Bloque de stack tecnologico inferior visible y consistente en todas las paginas clave
- [ ] Pruebas de footer/layout actualizadas y passing (E2E + contratos CSS relevantes)
- [ ] No regresiones en visibilidad/posicionamiento del footer (incluyendo Home y viewport corto)
